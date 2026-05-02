import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Route d'upload d'image vers Supabase Storage.
 * Vérifie l'authentification admin avant d'autoriser l'upload.
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // 1. Vérification admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié.' },
        { status: 401 }
      );
    }

    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!adminRow) {
      return NextResponse.json(
        { success: false, message: 'Accès admin requis.' },
        { status: 403 }
      );
    }

    // 2. Lecture du fichier
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni.' },
        { status: 400 }
      );
    }

    // 3. Validation
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Fichier trop volumineux (5 Mo max).' },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Type non supporté (JPEG, PNG, WebP, GIF uniquement).',
        },
        { status: 400 }
      );
    }

    // 4. Upload Supabase Storage
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `${new Date().getFullYear()}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('articles-images')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('upload-image route — supabase upload error:', uploadError);
      return NextResponse.json(
        { success: false, message: `Échec de l'upload : ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 5. URL publique
    const { data } = supabase.storage
      .from('articles-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (err) {
    console.error('upload-image route exception:', err);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur.' },
      { status: 500 }
    );
  }
}