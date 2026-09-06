import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonData, NoteSnippet } from '../../types';
import {
  BookMarked,
  Save,
  Trash2,
  Sparkles,
  Plus,
  Tag,
  Share2,
  CheckCircle,
  FileText,
  Clock,
  Layers,
  Search,
} from 'lucide-react';

interface MagicNotebookProps {
  lesson: LessonData;
  isOpen: boolean;
  onClose: () => void;
  onAskAIAboutNote: (noteText: string) => void;
  injectedNoteText?: string | null;
  onClearInjectedNote?: () => void;
}

export const MagicNotebook: React.FC<MagicNotebookProps> = ({
  lesson,
  isOpen,
  onClose,
  onAskAIAboutNote,
  injectedNoteText,
  onClearInjectedNote,
}) => {
  const storageKey = `bac_atlas_notes_${lesson.id}`;

  const [notes, setNotes] = useState<NoteSnippet[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load notes', e);
    }
    return [
      {
        id: `note-default-1`,
        lessonId: lesson.id,
        text: `أهم ما يجب ضبطه في هذا الدرس:\n1. الفرق بين الإدارة المباشرة والحماية غير المباشرة.\n2. التواريخ الحاسمة (معاهدة فاس 1912، معركة أنوال 1921، الظهير البربري 1930).`,
        updatedAt: 'اليوم، 10:15 ص',
        tags: ['تواريخ', 'مفاهيم_أساسية'],
        vectorMatches: [
          {
            title: 'مطابقة مرجعية عالية',
            text: 'معاهدة فاس 1912: أحدثت ازدواجية إدارية واحتكاراً للقرار الفعلي بيد المقيم العام.',
            confidence: 0.96,
            source: 'الإطار المرجعي 2026',
          },
        ],
      },
    ];
  });

  const [activeNoteText, setActiveNoteText] = useState('');
  const [activeTag, setActiveTag] = useState('ملاحظات_عامة');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // When note injected from video or AI
  useEffect(() => {
    if (injectedNoteText) {
      setActiveNoteText((prev) => (prev ? `${prev}\n\n📌 ${injectedNoteText}` : `📌 ${injectedNoteText}`));
      if (onClearInjectedNote) onClearInjectedNote();
    }
  }, [injectedNoteText, onClearInjectedNote]);

  // Persist notes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to save notes', e);
    }
  }, [notes, storageKey]);

  const handleAddNote = () => {
    if (!activeNoteText.trim()) return;

    setIsSaving(true);
    const newNote: NoteSnippet = {
      id: `note-${Date.now()}`,
      lessonId: lesson.id,
      text: activeNoteText.trim(),
      updatedAt: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
      tags: [activeTag],
      vectorMatches: [
        {
          title: 'استرجاع متطابق من المتجهات',
          text: `تم ربط الملاحظة بمحاور وحدة «${lesson.title}» في المعجم المرجعي.`,
          confidence: 0.92,
          source: 'Vector Store الطالب',
        },
      ],
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteText('');
    setIsSaving(false);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-stone-800 bg-[#09101d]/95 backdrop-blur-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 p-4.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-md">
            <BookMarked className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-100">الدفتر الذكي (Magic Notebook)</h3>
            <p className="text-[11px] text-stone-400">
              ملخصات وربط متجهات لـ «{lesson.chapter}»
            </p>
          </div>
        </div>

        <button
          id="btn-close-magic-notebook"
          onClick={onClose}
          className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
        >
          ✕
        </button>
      </div>

      {/* Note Editor Area */}
      <div className="border-b border-stone-800 bg-stone-950/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            تدوين خلاصة أو فكرة جديدة
          </span>
          <select
            value={activeTag}
            onChange={(e) => setActiveTag(e.target.value)}
            className="rounded-lg border border-stone-700 bg-stone-900 px-2 py-1 text-[11px] font-semibold text-stone-300 focus:outline-none"
          >
            <option value="ملاحظات_عامة">#ملاحظات_عامة</option>
            <option value="تواريخ_وأعلام">#تواريخ_وأعلام</option>
            <option value="منهجية_المقال">#منهجية_المقال</option>
            <option value="مفاهيم_مرجعية">#مفاهيم_مرجعية</option>
          </select>
        </div>

        <textarea
          rows={4}
          value={activeNoteText}
          onChange={(e) => setActiveNoteText(e.target.value)}
          placeholder="اكتب خلاصة، فكرة، أو سؤال استرجاعي هنا... (يتم الربط التلقائي بالإطار المرجعي)"
          className="w-full rounded-2xl border border-stone-700/80 bg-[#0c1626] p-3 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveNoteText((prev) => `${prev} «المفهوم» `)}
              className="rounded bg-stone-800 px-2 py-1 text-[10px] font-semibold text-stone-300 hover:bg-stone-700"
            >
              + اقتباس «»
            </button>
            <button
              type="button"
              onClick={() => setActiveNoteText((prev) => `${prev}\n• `)}
              className="rounded bg-stone-800 px-2 py-1 text-[10px] font-semibold text-stone-300 hover:bg-stone-700"
            >
              + نقطة •
            </button>
          </div>

          <button
            id="btn-save-note"
            onClick={handleAddNote}
            disabled={!activeNoteText.trim()}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeNoteText.trim()
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20 hover:scale-105 cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Save className="h-3.5 w-3.5" />
            <span>حفظ الملاحظة</span>
          </button>
        </div>

        {showSavedFeedback && (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 animate-pulse">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>تم الحفظ وربط المتجه بنجاح!</span>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-400 font-bold">
          <span>الملاحظات المحفوظة ({notes.length})</span>
        </div>

        {notes.length === 0 ? (
          <div className="py-12 text-center text-stone-500 text-xs">
            لا توجد ملاحظات مدونة بعد. ابدأ بتدوين أفكارك لربطها بالإطار المرجعي.
          </div>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-stone-800 bg-[#0c1527] p-4 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    #{note.tags[0] || 'عام'}
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">{note.updatedAt}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAskAIAboutNote(note.text)}
                    className="rounded p-1 text-stone-400 hover:text-amber-300"
                    title="تحليل وتوسيع بالمساعد الذكي"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="rounded p-1 text-stone-400 hover:text-rose-400"
                    title="حذف"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-stone-200 leading-relaxed whitespace-pre-wrap">
                {note.text}
              </div>

              {note.vectorMatches && note.vectorMatches.length > 0 && (
                <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-teal-300">
                    <Layers className="h-3 w-3" />
                    توصية المتجهات (RAG):
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug">
                    {note.vectorMatches[0].text}
                  </p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
