import React, { useRef, useState } from 'react';
import { Download, Upload, FileJson, FileText, CheckCircle2, ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { ExportButton } from '../../../components/settings/ExportButton';
import { exportService } from '../../../services/exportService';

export const BackupExport: React.FC = () => {
  const store = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportJson = () => {
    exportService.exportToJson(
      {
        profile: store.profile,
        notebooks: store.notebooks,
        strictMode: store.strictMode,
        ragTemperature: store.ragTemperature,
        theme: store.theme,
        notifications: store.notifications,
        dailyGoalMinutes: store.dailyGoalMinutes,
        subjectPriority: store.subjectPriority,
        aiPersona: store.aiPersona,
        exportDate: new Date().toISOString(),
      },
      `atlas-bac-backup-${store.profile.name.replace(/\s+/g, '_')}.json`
    );
  };

  const handleExportMarkdown = () => {
    exportService.exportToMarkdown(
      store.profile,
      { totalXP: 3420, currentLevel: 14, streakDays: 18 },
      store.notebooks
    );
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);
    try {
      const data = await exportService.importFromJson(file);
      if (data.profile) store.updateProfile(data.profile);
      if (data.notebooks) store.setNotebooks(data.notebooks);
      if (data.notifications) store.updateNotifications(data.notifications);
      if (data.dailyGoalMinutes) store.updateLearning({ dailyGoalMinutes: data.dailyGoalMinutes });
      setImportStatus('تم استيراد النسخة الاحتياطية وتحديث إعداداتك بنجاح ✅');
    } catch (err: any) {
      setImportStatus(`فشل الاستيراد: ${err.message} ❌`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Export Data */}
      <SettingsCard
        title="تصدير بيانات الطالب والملخصات (Export Data)"
        subtitle="حفظ نسخة كاملة من كراسك، مقالاتك، وإحصائيات تقدمك بصيغة JSON أو تقرير Markdown"
        icon={Download}
        badge="Full Data Portability"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ExportButton
            label="نسخة احتياطية مشفرة (JSON)"
            subLabel="تشمل كامل الإعدادات، الدفاتر المتجهة، وسجل المراجعة لاستعادتها في أي وقت"
            type="json"
            onExport={handleExportJson}
          />

          <ExportButton
            label="تقرير ملخص الطالب (Markdown / Print)"
            subLabel="تقرير منظم ومقروء للمطالعة والطباعة يضم قائمة ملخصاتك وأهدافك"
            type="markdown"
            onExport={handleExportMarkdown}
          />
        </div>
      </SettingsCard>

      {/* 2. Import Data */}
      <SettingsCard
        title="استعادة النسخة الاحتياطية (Restore Backup)"
        subtitle="استيراد ملف نسخة احتياطية سابقة (JSON) لمزامنة ملخصاتك وإعداداتك دفعة واحدة"
        icon={Upload}
        badge="JSON Restore"
      >
        <div className="p-6 rounded-2xl bg-[#091338] border-2 border-dashed border-white/20 hover:border-amber-400/50 transition-colors text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h5 className="text-xs sm:text-sm font-bold text-white">
              اضغط لاختيار ملف النسخة الاحتياطية (.json)
            </h5>
            <p className="text-[11px] text-[#a2a6d0]">
              سيتم دمج الملخصات وتحديث التفضيلات دون حذف نقاط خبرتك السابقة
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-2 border border-white/10"
          >
            {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{isImporting ? 'جاري الاستيراد...' : 'تحديد ملف النسخة الاحتياطية'}</span>
          </button>

          {importStatus && (
            <p className="text-xs font-bold text-amber-300 pt-2">{importStatus}</p>
          )}
        </div>
      </SettingsCard>
    </div>
  );
};
