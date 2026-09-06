import React from 'react';
import { BacBranch } from '../../types';
import { BAC_BRANCHES_LIST, ALGERIA_58_WILAYAS } from '../../data/algerianWilayas';
import { GraduationCap, MapPin } from 'lucide-react';

interface BranchWilayaSelectorProps {
  selectedBranch: BacBranch;
  onSelectBranch: (branch: BacBranch) => void;
  selectedWilayaCode: string;
  onSelectWilaya: (wilayaCode: string, wilayaName: string) => void;
  disabled?: boolean;
}

export const BranchWilayaSelector: React.FC<BranchWilayaSelectorProps> = ({
  selectedBranch,
  onSelectBranch,
  selectedWilayaCode,
  onSelectWilaya,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-4 text-right">
      {/* 1. Branch Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-white/80 pr-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>الشعبة الدراسية لبكالوريا الجزائر</span>
            <span className="text-amber-400">*</span>
          </span>
          <span className="text-[10px] text-amber-300/80 font-normal">
            تحدد منهاج ومواضيع الامتحانات
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BAC_BRANCHES_LIST.map((b) => {
            const isSelected = selectedBranch === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBranch(b.id)}
                disabled={disabled}
                className={`p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1 text-xs cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/20 text-white shadow-lg shadow-amber-400/15 ring-2 ring-amber-400/30'
                    : 'border-white/15 bg-white/[0.04] text-white/70 hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base">{b.icon}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                  )}
                </div>
                <div className="font-bold text-[11px] sm:text-xs text-white leading-tight">
                  {b.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Wilaya Selector (58 Wilayas) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-white/80 pr-1 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>الولاية (58 ولاية)</span>
          <span className="text-amber-400">*</span>
        </label>

        <div className="relative">
          <select
            value={selectedWilayaCode}
            onChange={(e) => {
              const code = e.target.value;
              const wilaya = ALGERIA_58_WILAYAS.find((w) => w.code === code);
              onSelectWilaya(code, wilaya ? wilaya.name : 'الجزائر العاصمة');
            }}
            disabled={disabled}
            className="w-full appearance-none rounded-2xl border border-white/15 bg-[#0b132b]/80 backdrop-blur-md px-4 py-3 text-sm text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/25 transition-all cursor-pointer"
          >
            {ALGERIA_58_WILAYAS.map((w) => (
              <option key={w.code} value={w.code} className="bg-[#0f172a] text-white py-1">
                {w.code} - ولاية {w.name} ({w.nameEn})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xs">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
};
