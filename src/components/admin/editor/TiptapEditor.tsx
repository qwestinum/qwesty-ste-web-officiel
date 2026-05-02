'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import type { Content } from '@tiptap/core';
import { useEffect, useRef, useState } from 'react';
import { getTiptapExtensions } from '@/lib/tiptap/extensions';
import { saveArticleContent } from '@/lib/actions/articles';
import { EditorToolbar } from './EditorToolbar';
import type { Json } from '@/lib/supabase/types';

interface TiptapEditorProps {
  articleId: string;
  initialContent: Json | null;
}

const AUTOSAVE_DELAY_MS = 30000;

/**
 * Re-sérialise le JSON Tiptap pour s'assurer qu'il ne contient que des objets
 * "plain". Sans ça, certaines extensions Tiptap (notamment l'extension Image)
 * peuvent inclure des références non-sérialisables qui font planter la
 * Server Action avec l'erreur "Only plain objects can be passed".
 */
function sanitizeTiptapJson(json: unknown): unknown {
  return JSON.parse(JSON.stringify(json));
}

export function TiptapEditor({ articleId, initialContent }: TiptapEditorProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const lastSavedRef = useRef<string>(JSON.stringify(initialContent ?? {}));
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: getTiptapExtensions({ placeholder: "Commencez à écrire votre article ici…" }),
    content: (initialContent ?? '') as Content,
    editorProps: {
      attributes: {
        class: 'tiptap-content focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('dirty');
      scheduleAutosave(editor);
    },
    immediatelyRender: false,
  });

  function scheduleAutosave(editor: Editor) {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      void doSave(editor);
    }, AUTOSAVE_DELAY_MS);
  }

  async function doSave(editor: Editor, manual = false) {
    const rawJson = editor.getJSON();
    // Sanitize : élimine toute référence non-sérialisable
    const cleanJson = sanitizeTiptapJson(rawJson);
    const serialized = JSON.stringify(cleanJson);
    if (serialized === lastSavedRef.current && !manual) return;

    setSaveStatus('saving');
    setErrorMsg(null);

    try {
      const result = await saveArticleContent(articleId, cleanJson as Json);
      if (result.success) {
        lastSavedRef.current = serialized;
        setSaveStatus('saved');
        setTimeout(() => {
          setSaveStatus((s) => (s === 'saved' ? 'idle' : s));
        }, 2000);
      } else {
        setSaveStatus('error');
        setErrorMsg(result.message);
      }
    } catch (err) {
      console.error('saveArticleContent failed:', err);
      setSaveStatus('error');
      setErrorMsg('Erreur de sauvegarde — voir la console pour le détail.');
    }
  }

  // Sauvegarde manuelle au Cmd/Ctrl+S
  useEffect(() => {
    if (!editor) return;

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (editor) void doSave(editor, true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, articleId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  // Avertit l'utilisateur s'il quitte avec des changements non sauvegardés
  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (saveStatus === 'dirty' || saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [saveStatus]);

  // Upload d'image via API route (compat fichiers binaires)
  async function handleImageUpload(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.url) {
        setErrorMsg(result.message ?? "Échec de l'upload");
        setSaveStatus('error');
        return null;
      }

      return result.url as string;
    } catch (err) {
      console.error('handleImageUpload exception:', err);
      setErrorMsg("Erreur réseau pendant l'upload");
      setSaveStatus('error');
      return null;
    }
  }

  if (!editor) {
    return (
      <div className="bg-perle/30 border border-perle rounded-md p-12 text-center">
        <p className="font-sans text-sm text-pierre">Chargement de l'éditeur…</p>
      </div>
    );
  }

  return (
    <div className="bg-lin border border-perle rounded-md">
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />

      <div className="px-6 md:px-10 py-8 min-h-[480px]">
        <EditorContent editor={editor} />
      </div>

      <div className="border-t border-perle px-4 py-2.5 flex items-center justify-between text-xs">
        <SaveStatusIndicator status={saveStatus} errorMsg={errorMsg} />
        <button
          type="button"
          onClick={() => void doSave(editor, true)}
          disabled={saveStatus === 'saving'}
          className="font-sans text-[11px] font-semibold uppercase tracking-wide-2 text-pierre hover:text-or-fonce transition-colors disabled:opacity-50"
        >
          {saveStatus === 'saving' ? 'Sauvegarde…' : 'Sauvegarder maintenant'}
          <span className="ml-2 text-[10px] opacity-50">⌘S</span>
        </button>
      </div>
    </div>
  );
}

function SaveStatusIndicator({
  status,
  errorMsg,
}: {
  status: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
  errorMsg: string | null;
}) {
  const styles = {
    idle: { text: 'À jour', dot: 'bg-pierre/40' },
    dirty: { text: 'Modifications non sauvegardées', dot: 'bg-or' },
    saving: { text: 'Sauvegarde en cours…', dot: 'bg-or animate-pulse' },
    saved: { text: 'Sauvegardé', dot: 'bg-or-fonce' },
    error: { text: errorMsg ?? 'Erreur de sauvegarde', dot: 'bg-sepia' },
  }[status];

  return (
    <div className="flex items-center gap-2 font-sans text-xs text-pierre">
      <span className={`block w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      <span>{styles.text}</span>
    </div>
  );
}
