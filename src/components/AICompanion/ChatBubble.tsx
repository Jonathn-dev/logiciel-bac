import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AIMessage, AICompanionStatus, LessonData } from '../../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldCheck,
  BookOpen,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
} from 'lucide-react';

interface ChatBubbleProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AIMessage[];
  status: AICompanionStatus;
  lesson: LessonData;
  onAskQuestion: (question: string) => void;
  onClearChat: () => void;
  onInsertNoteFromAI: (text: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  isOpen,
  onClose,
  messages,
  status,
  lesson,
  onAskQuestion,
  onClearChat,
  onInsertNoteFromAI,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleQuestions = [
    `ما هي أهم نتائج هجمات الشمال القسنطيني 20 أوت 1955؟`,
    `كيف أحرر مقالاً تاريخياً حول استراتيجيات الحرب الباردة؟`,
    `وضح قرارات مؤتمر الصومام 1956 وهيكلة الولايات الست`,
    `ما هي العوامل المتحكمة في أسعار البترول ودور منظمة أوبك؟`,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || status === 'thinking') return;
    onAskQuestion(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col border-r border-stone-800 bg-[#08101e]/95 backdrop-blur-2xl shadow-2xl">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-stone-800 p-4.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-teal-400 text-stone-950 shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-stone-100">رفيق الباكالوريا الذكي</h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-3 w-3" />
                RAG صارم
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              متصل بـ «{lesson.title}»
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-clear-chat"
            onClick={onClearChat}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
            title="إعادة ضبط المحادثة"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            id="btn-close-ai-drawer"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col gap-1.5 ${
              msg.sender === 'student' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
              {msg.sender === 'student' ? (
                <>
                  <span>أنت</span>
                  <User className="h-3 w-3" />
                </>
              ) : (
                <>
                  <Bot className="h-3 w-3 text-amber-400" />
                  <span className="font-bold text-amber-400">Atlas AI</span>
                </>
              )}
              <span className="font-mono text-stone-500">{msg.timestamp}</span>
            </div>

            <div
              className={`relative max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                msg.sender === 'student'
                  ? 'bg-amber-500 text-stone-950 font-bold rounded-tr-none'
                  : 'border border-stone-800 bg-[#0d172a] text-stone-100 rounded-tl-none space-y-3'
              }`}
            >
              <div className="whitespace-pre-line font-normal">{msg.text}</div>

              {/* Citations & Reference validation */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="rounded-xl border border-teal-500/20 bg-teal-950/30 p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-teal-300">
                    <ShieldCheck className="h-3 w-3" />
                    المراجع والإطار الوطني المعتمد:
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-stone-300 space-y-0.5">
                    {msg.citations.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Concepts Pills */}
              {msg.keyConcepts && msg.keyConcepts.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {msg.keyConcepts.map((k, i) => (
                    <span
                      key={i}
                      className="rounded bg-stone-800 px-2 py-0.5 text-[10px] font-semibold text-amber-300"
                    >
                      #{k}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Actions on AI message */}
              {msg.sender === 'ai' && (
                <div className="flex items-center justify-end gap-2 border-t border-stone-800 pt-2">
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onInsertNoteFromAI(msg.text)}
                    className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-500/20"
                  >
                    <BookmarkPlus className="h-3 w-3" />
                    <span>إضافة إلى دفتري</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {status === 'thinking' && (
          <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-300">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>جاري استرجاع معطيات الإطار المرجعي وتدقيق الصياغة...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="border-t border-stone-800/80 bg-stone-950/40 p-3">
        <div className="text-[10px] font-bold text-stone-400 mb-1.5">أسئلة مقترحة شائعة:</div>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onAskQuestion(q)}
              className="rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1 text-[10px] text-stone-300 hover:border-amber-500/40 hover:text-amber-300 text-right"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="border-t border-stone-800 p-3.5 bg-[#08101e]">
        <div className="flex items-center gap-2 rounded-2xl border border-stone-700 bg-stone-900/90 p-1.5 focus-within:border-amber-400 shadow-inner">
          <input
            type="text"
            placeholder="اسأل رفيق الباكالوريا (مصطلحات، منهجية، أحداث)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={status === 'thinking'}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || status === 'thinking'}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
              inputText.trim() && status !== 'thinking'
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20 hover:scale-105 cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
