'use client';

import { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: (file: File) => Promise<string | null>;
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkInputOpen, setLinkInputOpen] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await onImageUpload(file);
    setUploading(false);

    if (url) {
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleLinkSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = (formData.get('url') as string)?.trim();

    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      const finalUrl = url.startsWith('http') || url.startsWith('mailto:') ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
    }
    setLinkInputOpen(false);
  }

  return (
    <div className="border-b border-perle bg-perle/20 px-3 py-2">
      <div className="flex flex-wrap items-center gap-1">

        <ToolbarGroup>
          <ToolbarButton
            label="Titre H2"
            icon="H2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            label="Titre H3"
            icon="H3"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />
          <ToolbarButton
            label="Paragraphe"
            icon="¶"
            active={editor.isActive('paragraph')}
            onClick={() => editor.chain().focus().setParagraph().run()}
          />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            label="Gras"
            icon={<strong>B</strong>}
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="Italique"
            icon={<em>I</em>}
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="Code inline"
            icon="</>"
            active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            label="Liste à puces"
            icon="•"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="Liste numérotée"
            icon="1."
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            label="Citation"
            icon="❝"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            label="Bloc de code"
            icon="{}"
            active={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton
            label="Lien"
            icon="🔗"
            active={editor.isActive('link')}
            onClick={() => setLinkInputOpen(!linkInputOpen)}
          />
          <ToolbarButton
            label="Insérer une image"
            icon="🖼"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          />
          <ToolbarButton
            label="Séparateur"
            icon="─"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </ToolbarGroup>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarGroup>
            <ToolbarButton
              label="Annuler"
              icon="↶"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            />
            <ToolbarButton
              label="Refaire"
              icon="↷"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            />
          </ToolbarGroup>
        </div>
      </div>

      {/* Sous-barre lien */}
      {linkInputOpen && (
        <form onSubmit={handleLinkSubmit} className="mt-2 flex gap-2">
          <input
            type="text"
            name="url"
            placeholder="URL (ex: https://...) — vide pour supprimer le lien"
            defaultValue={editor.getAttributes('link').href ?? ''}
            autoFocus
            className="flex-1 bg-lin border border-perle rounded-sm px-3 py-1.5 font-sans text-sm text-sepia focus:outline-none focus:border-or-fonce"
          />
          <button
            type="submit"
            className="bg-sepia text-lin px-3 py-1.5 rounded-sm font-sans text-xs font-semibold uppercase tracking-wide-2 hover:bg-or-fonce transition-colors"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => setLinkInputOpen(false)}
            className="px-3 py-1.5 rounded-sm font-sans text-xs text-pierre hover:text-sepia"
          >
            ✕
          </button>
        </form>
      )}

      {uploading && (
        <p className="mt-2 font-sans text-xs text-or-fonce">
          Upload de l'image en cours…
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarSeparator() {
  return <div className="w-px h-5 bg-perle mx-1" />;
}

function ToolbarButton({
  label,
  icon,
  onClick,
  active = false,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        'h-8 min-w-[32px] px-2 rounded-sm font-sans text-sm transition-colors flex items-center justify-center',
        active
          ? 'bg-or-pale/40 text-or-fonce'
          : 'text-sepia hover:bg-perle/60',
        disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
      )}
    >
      {icon}
    </button>
  );
}
