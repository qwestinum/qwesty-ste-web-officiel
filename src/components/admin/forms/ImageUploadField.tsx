'use client';

import { useRef, useState } from 'react';

interface ImageUploadFieldProps {
  bucket: 'articles-images' | 'partners-logos' | 'use-cases-images';
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({ bucket, value, onChange, label = 'Image' }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
      const json = await res.json();

      if (!json.success) {
        setError(json.message ?? 'Upload échoué.');
      } else {
        onChange(json.url);
      }
    } catch {
      setError('Erreur réseau lors de l\'upload.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="block font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-ink-muted mb-1.5">
        {label}
      </label>

      {value && (
        <div className="mb-2 flex items-center gap-3">
          <img src={value} alt="" className="h-12 w-12 object-cover rounded-lg border border-hairline" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="font-sans text-[11px] text-ink-muted hover:text-ink transition-colors"
          >
            Supprimer
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full font-sans text-xs text-ink-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-sans file:text-xs file:font-semibold file:uppercase file:tracking-wide-2 file:bg-cream file:text-ink hover:file:bg-cream/70 disabled:opacity-50"
      />

      {uploading && (
        <p className="mt-1 font-sans text-[11px] text-ink-muted">Upload en cours…</p>
      )}
      {error && (
        <p className="mt-1 font-sans text-[11px] text-ink">{error}</p>
      )}
    </div>
  );
}
