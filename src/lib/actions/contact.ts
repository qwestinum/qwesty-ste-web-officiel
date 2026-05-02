'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Action serveur de soumission du formulaire de contact.
 * Valide les champs, vérifie le honeypot anti-spam, hash l'IP et enregistre.
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
    // Silencieux : pas d'accès aux headers en certains contextes
  }

  // ---- Insertion en DB ----
  // Cast volontaire pour contourner un bug de typage @supabase/ssr v0.5+
  // qui force le type "never" sur les nouvelles tables non générées par CLI.
  // L'insertion fonctionne correctement à l'exécution.
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