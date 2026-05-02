'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import crypto from 'crypto';
import type { LeadSubject } from '@/lib/supabase/types';

export interface LeadFormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

const VALID_SUBJECTS: LeadSubject[] = [
  'general', 'diagnostic', 'formation', 'partnership', 'press', 'other',
];

const SUBJECT_LABELS: Record<LeadSubject, string> = {
  general: 'Demande générale',
  diagnostic: 'Diagnostic IA gratuit',
  formation: 'Formations',
  partnership: 'Partenariat',
  press: 'Presse / Média',
  other: 'Autre',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Action serveur de soumission du formulaire de contact.
 * 1. Valide les champs
 * 2. Vérifie le honeypot anti-spam
 * 3. Hash l'IP et enregistre en DB
 * 4. Envoie une notification email via Resend (si configuré)
 */
export async function submitLead(
  prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  // ---- Honeypot anti-spam ----
  const honeypot = formData.get('website');
  if (honeypot && typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true, message: 'Merci, votre message a bien été envoyé.' };
  }

  // ---- Extraction des champs ----
  const fullName = (formData.get('full_name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? '';
  const company = (formData.get('company') as string | null)?.trim() || null;
  const phone = (formData.get('phone') as string | null)?.trim() || null;
  const subjectRaw = (formData.get('subject') as string | null) ?? 'general';
  const subject: LeadSubject = VALID_SUBJECTS.includes(subjectRaw as LeadSubject)
    ? (subjectRaw as LeadSubject)
    : 'general';
  const message = (formData.get('message') as string | null)?.trim() ?? '';
  const consent = formData.get('consent');

  // ---- Validation ----
  const errors: Record<string, string> = {};

  if (fullName.length < 2 || fullName.length > 120) {
    errors.full_name = 'Veuillez indiquer votre nom complet.';
  }
  if (!EMAIL_REGEX.test(email) || email.length > 200) {
    errors.email = 'Veuillez saisir une adresse email valide.';
  }
  if (message.length < 10 || message.length > 4000) {
    errors.message = 'Votre message doit contenir entre 10 et 4000 caractères.';
  }
  if (!consent) {
    errors.consent = 'Merci d\u2019accepter le traitement de vos données.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Le formulaire contient des erreurs.',
      errors,
    };
  }

  // ---- Métadonnées de la requête ----
  let ipHash: string | null = null;
  let userAgent: string | null = null;
  try {
    const h = headers();
    const forwardedFor = h.get('x-forwarded-for') ?? '';
    const realIp = h.get('x-real-ip') ?? '';
    const ip = forwardedFor.split(',')[0]?.trim() || realIp || 'unknown';
    if (ip && ip !== 'unknown') {
      ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
    }
    userAgent = h.get('user-agent')?.slice(0, 500) ?? null;
  } catch {
    // Silencieux
  }

  // ---- Insertion en DB ----
  try {
    const supabase = createClient();
    const payload = {
      full_name: fullName,
      email,
      company,
      phone,
      subject,
      message,
      source: 'contact-form',
      ip_hash: ipHash,
      user_agent: userAgent,
    };
    const { error } = await supabase
      .from('leads')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(payload as any);

    if (error) {
      console.error('submitLead insert error:', error);
      return {
        success: false,
        message: "Une erreur est survenue. Réessayez ou écrivez-nous directement à contact@qwestinum.com.",
      };
    }

    // ---- Notification email via Resend (best-effort, non bloquante) ----
    sendLeadNotification({
      fullName,
      email,
      company,
      phone,
      subject,
      message,
    }).catch((err) => {
      console.error('Resend notification failed (non-blocking):', err);
    });

    return {
      success: true,
      message: 'Merci, votre message a bien été envoyé. Nous reviendrons vers vous sous 24 h ouvrées.',
    };
  } catch (err) {
    console.error('submitLead exception:', err);
    return {
      success: false,
      message: "Une erreur est survenue. Réessayez ou écrivez-nous directement à contact@qwestinum.com.",
    };
  }
}

// ----------------------------------------------------------------
// Envoi de notification email via Resend
// ----------------------------------------------------------------
interface LeadEmailData {
  fullName: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: LeadSubject;
  message: string;
}

async function sendLeadNotification(data: LeadEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.warn('Resend not configured, skipping notification.');
    return;
  }

  const resend = new Resend(apiKey);
  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;

  const html = buildLeadEmailHtml(data, subjectLabel);
  const text = buildLeadEmailText(data, subjectLabel);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: data.email,
    subject: `[Qwestinum] Nouveau lead — ${subjectLabel} (${data.fullName})`,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildLeadEmailHtml(data: LeadEmailData, subjectLabel: string): string {
  const messageHtml = escapeHtml(data.message).replace(/\n/g, '<br>');
  const company = data.company ? escapeHtml(data.company) : '<em style="color: #807D75;">non renseigné</em>';
  const phone = data.phone ? escapeHtml(data.phone) : '<em style="color: #807D75;">non renseigné</em>';

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nouveau lead Qwestinum</title>
</head>
<body style="margin: 0; padding: 24px; background: #F4F0E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #2A2724;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #D8D2C2; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="background: #2A2724; padding: 24px 32px; color: #F4F0E8;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #D4A82C; font-weight: 600;">Qwestinum</div>
        <h1 style="margin: 8px 0 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #F4F0E8;">Nouveau lead reçu</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #D8D2C2;">Sujet : ${escapeHtml(subjectLabel)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #807D75; width: 130px; vertical-align: top;">Nom</td>
            <td style="padding: 8px 0; color: #2A2724; font-weight: 500;">${escapeHtml(data.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #807D75; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #A8861C; text-decoration: none;">${escapeHtml(data.email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #807D75; vertical-align: top;">Entreprise</td>
            <td style="padding: 8px 0; color: #2A2724;">${company}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #807D75; vertical-align: top;">Téléphone</td>
            <td style="padding: 8px 0; color: #2A2724;">${phone}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #D8D2C2;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #807D75; font-weight: 600; margin-bottom: 12px;">Message</div>
          <div style="font-size: 15px; line-height: 1.6; color: #2A2724; padding: 16px 20px; background: #F4F0E8; border-left: 3px solid #D4A82C; border-radius: 4px;">
            ${messageHtml}
          </div>
        </div>

        <div style="margin-top: 28px; text-align: center;">
          <a href="mailto:${escapeHtml(data.email)}?subject=Re%3A%20Votre%20demande%20Qwestinum"
             style="display: inline-block; background: #D4A82C; color: #2A2724; padding: 14px 28px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 2px;">
            Répondre à ${escapeHtml(data.fullName.split(' ')[0])} →
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background: #F4F0E8; border-top: 1px solid #D8D2C2; font-size: 11px; color: #807D75; text-align: center;">
        Lead enregistré dans la base Supabase · qwestinum.fr
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildLeadEmailText(data: LeadEmailData, subjectLabel: string): string {
  return `QWESTINUM — NOUVEAU LEAD

Sujet : ${subjectLabel}

Nom         : ${data.fullName}
Email       : ${data.email}
Entreprise  : ${data.company ?? '—'}
Téléphone   : ${data.phone ?? '—'}

Message :
---
${data.message}
---

Pour répondre, utilisez simplement Reply à cet email (le Reply-To est configuré).

Lead enregistré dans Supabase. Voir le dashboard admin (à venir).
`;
}