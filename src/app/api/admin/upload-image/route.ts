import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET_CONFIGS = {
  'articles-images': {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    sizeLabel: '5 Mo',
  },
  'partners-logos': {
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    sizeLabel: '2 Mo',
  },
  'use-cases-images': {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    sizeLabel: '5 Mo',
  },
} as const;

type AllowedBucket = keyof typeof BUCKET_CONFIGS;

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Non authentifié.' }, { status: 401 });
    }

    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!adminRow) {
      return NextResponse.json({ success: false, message: 'Accès admin requis.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const bucketParam = formData.get('bucket') as string | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'Aucun fichier fourni.' }, { status: 400 });
    }

    const bucket: AllowedBucket = (bucketParam && bucketParam in BUCKET_CONFIGS)
      ? (bucketParam as AllowedBucket)
      : 'articles-images';

    const config = BUCKET_CONFIGS[bucket];

    if (file.size > config.maxSize) {
      return NextResponse.json(
        { success: false, message: `Fichier trop volumineux (${config.sizeLabel} max).` },
        { status: 400 }
      );
    }

    if (!config.allowedTypes.includes(file.type as never)) {
      return NextResponse.json(
        { success: false, message: `Type non supporté pour ce bucket (${config.allowedTypes.join(', ')}).` },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `${new Date().getFullYear()}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '31536000', upsert: false });

    if (uploadError) {
      console.error('upload-image route — supabase upload error:', uploadError);
      return NextResponse.json(
        { success: false, message: `Échec de l'upload : ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (err) {
    console.error('upload-image route exception:', err);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
