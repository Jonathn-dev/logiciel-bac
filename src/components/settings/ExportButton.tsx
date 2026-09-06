import React, { useState } from 'react';
import { Download, Check, FileJson, FileText } from 'lucide-react';

interface ExportButtonProps {
  label: string;
  subLabel?: string;
  type?: 'json' | 'markdown' | 'pdf';
  onExport: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  label,
  subLabel,
  type = 'json',
  onExport,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleClick = () => {
    onExport();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const Icon = type === 'json' ? FileJson : FileText;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-4 rounded-2xl bg-[#091338] hover:bg-[#0c194a] border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-between text-right cursor-pointer group w-full"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-amber-400/10 text-amber-300 border border-white/10 group-hover:border-amber-400/30 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h6 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
            {label}
          </h6>
          {subLabel && <p className="text-[11px] text-[#a2a6d0] mt-0.5">{subLabel}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 group-hover:bg-amber-400 group-hover:text-stone-950 text-xs font-bold transition-all text-[#dfe0ff]">
        {downloaded ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 group-hover:text-stone-950" />
            <span>تم التصدير!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>تحميل</span>
          </>
        )}
      </div>
    </button>
  );
};
