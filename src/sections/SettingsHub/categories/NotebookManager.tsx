import React, { useState } from 'react';
import {
  BookMarked,
  Shield,
  ShieldAlert,
  Database,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  Upload,
  Cpu,
  Layers,
} from 'lucide-react';
import { useSettingsStore, NotebookItem } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { ToggleSwitch } from '../../../components/settings/ToggleSwitch';
import { notebookApi } from '../../../services/notebookApi';

export const NotebookManager: React.FC = () => {
  const {
    notebooks,
    activeNotebookId,
    strictMode,
    ragTemperature,
    addNotebook,
    removeNotebook,
    setActiveNotebook,
    toggleStrictMode,
    setRAGTemperature,
  } = useSettingsStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'history' | 'geography' | 'all'>('history');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await notebookApi.indexNotebook(newTitle, newSubject, newContent, tagsArray);
      if (res.success && res.notebook) {
        addNotebook(res.notebook);
        setActiveNotebook(res.notebook.id);
        setNewTitle('');
        setNewContent('');
        setNewTags('');
        setShowAddForm(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVectors = notebooks.reduce((acc, n) => acc + n.vectorCount, 0);

  return (
    <div className="space-y-6">
      {/* RAG Context Gate & Strict Mode Banner */}
      <SettingsCard
        title="حارس السياق المعرفي (RAG Context Gate)"
        subtitle="التحكم في قيود الاسترجاع ومنع الهلوسة لحصر إجابات الذكاء الاصطناعي في كراسك المعتمد"
        icon={Shield}
        badge="Zero Hallucination"
        variant="amber"
      >
        <div className="space-y-4">
          <ToggleSwitch
            checked={strictMode}
            onChange={toggleStrictMode}
            label="تفعيل الوضع الصارم (Strict Notebook Mode)"
            description="عند تفعيل هذا الخيار، سيتم حصر النموذج فقط في ملخصاتك ودفاترك الخاصة ورفض أي سؤال خارجي غير مدرج بها (حساب درجة الحرارة تلقائياً = 0.0)"
            badge={strictMode ? 'صارم 0.0 Temp' : 'مرن 0.2 Temp'}
          />

          {/* Temperature Slider */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>حرارة التوليد المعرفي (Model Temperature):</span>
              </span>
              <span className="font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {ragTemperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.7}
              step={0.05}
              value={ragTemperature}
              onChange={(e) => setRAGTemperature(Number(e.target.value))}
              disabled={strictMode}
              className={`w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg ${
                strictMode ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <div className="flex items-center justify-between text-[10px] text-[#a2a6d0] font-mono">
              <span>0.0 (حصر قطعي في الكراس)</span>
              <span>0.2 (منهجي دقيق)</span>
              <span>0.7 (استنتاج إبداعي)</span>
            </div>
            {strictMode && (
              <p className="text-[10px] text-amber-300/80 font-bold mt-1">
                🔒 تم قفل درجة الحرارة عند 0.0 لأن الوضع الصارم مفعل لضمان دقة معلومات البكالوريا.
              </p>
            )}
          </div>
        </div>
      </SettingsCard>

      {/* Notebooks List */}
      <SettingsCard
        title="دفاتر وملخصات الطالب المفهرسة"
        subtitle={`قاعدة المتجهات المتصلة حالياً تضم (${notebooks.length} دفاتر | ${totalVectors} متجهاً مفهرساً)`}
        icon={Database}
        badge="Vector Database"
        headerAction={
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'إغلاق النموذج' : 'إضافة ملخص جديد'}</span>
          </button>
        }
      >
        <div className="space-y-4">
          {/* Add New Form */}
          {showAddForm && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091338] border border-amber-400/40 space-y-3">
              <h5 className="text-xs sm:text-sm font-black text-amber-300">
                فهرسة دفتر أو ملخص جديد في قاعدة المتجهات
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-white font-bold block mb-1">عنوان الملخص:</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: ملخص أزمات الحرب الباردة 1947-1962"
                    className="w-full p-2 rounded-xl bg-[#060b22] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-white font-bold block mb-1">المادة:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-[#060b22] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="history">التاريخ 📜</option>
                    <option value="geography">الجغرافيا 🌍</option>
                    <option value="all">شامل (تاريخ + جغرافيا) 🏛️</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1">
                  نص الملخص أو الملاحظات:
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="الصق عناصر الدرس، التواريخ المعلمية، أو التعاريف ليتم تقسيمها إلى متجهات دلالية..."
                  className="w-full p-2.5 rounded-xl bg-[#060b22] border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1">
                  الوسوم والكلمات المفتاحية (مفصولة بفواصل):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="مثال: كوبا، أزمة السويس، جدار برلين، 1961"
                  className="w-full p-2 rounded-xl bg-[#060b22] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isSubmitting || !newTitle || !newContent}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الفهرسة والتضمين...' : 'تأكيد الفهرسة المتجهية'}
                </button>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="space-y-3">
            {notebooks.map((nb) => {
              const isActive = activeNotebookId === nb.id;
              return (
                <div
                  key={nb.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-amber-400 bg-[#091338] shadow-[0_0_20px_rgba(255,225,109,0.1)]'
                      : 'border-white/10 bg-[#070e2b] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          nb.subject === 'history'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : nb.subject === 'geography'
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}
                      >
                        <BookMarked className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-white">{nb.title}</h5>
                          {isActive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-stone-950">
                              الدفتر النشط حالياً
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#a2a6d0] mt-0.5 line-clamp-1">{nb.summary}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] font-mono text-amber-300 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                        {nb.vectorCount} Vector
                      </span>

                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => setActiveNotebook(nb.id)}
                          className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                        >
                          تحديد كنشط
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> مفعل
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeNotebook(nb.id)}
                        className="p-1.5 rounded-lg text-[#a2a6d0] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="حذف هذا الدفتر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tags footer */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2 border-t border-white/5 text-[10px]">
                    <span className="text-[#a2a6d0]">الوسوم:</span>
                    {nb.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 text-[#dfe0ff] border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                    <span className="text-[#a2a6d0] font-mono mr-auto">تحديث: {nb.lastUpdated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
