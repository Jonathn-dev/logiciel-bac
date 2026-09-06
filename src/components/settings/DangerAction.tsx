import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

interface DangerActionProps {
  title: string;
  description: string;
  buttonLabel: string;
  confirmText?: string;
  onAction: () => Promise<void> | void;
  icon?: 'trash' | 'reset';
}

export const DangerAction: React.FC<DangerActionProps> = ({
  title,
  description,
  buttonLabel,
  confirmText = 'هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه.',
  onAction,
  icon = 'trash',
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      await onAction();
      setShowConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h5 className="text-xs sm:text-sm font-bold text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{title}</span>
          </h5>
          <p className="text-xs text-[#a2a6d0] mt-0.5">{description}</p>
        </div>

        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {icon === 'trash' ? <Trash2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>{buttonLabel}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExecute}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-rose-900/40"
            >
              {isLoading ? 'جاري التنفيذ...' : 'تأكيد الحذف النهائي'}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <p className="text-[11px] text-rose-400 font-bold bg-rose-950/40 p-2 rounded-lg border border-rose-500/20">
          ⚠️ {confirmText}
        </p>
      )}
    </div>
  );
};
