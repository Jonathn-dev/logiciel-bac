import React from 'react';

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
  badge?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  size = 'md',
  badge
}) => {
  const isSm = size === 'sm';

  return (
    <div
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#090d2e]/60 hover:bg-[#090d2e] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
    >
      <div className="text-right">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-white block">{label}</span>
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-medium">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[11px] text-[#a2a6d0] mt-0.5">{description}</p>
        )}
      </div>

      {/* Switch Body (dir="ltr" ensures standard track translation without RTL reversal) */}
      <div
        dir="ltr"
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 shrink-0 select-none ${
          isSm ? 'w-10 h-6 px-0.5' : 'w-12 h-7 px-1'
        } ${checked ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'bg-[#091338] border border-white/20'}`}
      >
        <span
          className={`inline-block rounded-full bg-stone-950 shadow-md transform transition-transform duration-200 ease-in-out ${
            isSm ? 'w-5 h-5' : 'w-5 h-5'
          } ${checked ? (isSm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'}`}
        />
      </div>
    </div>
  );
};
