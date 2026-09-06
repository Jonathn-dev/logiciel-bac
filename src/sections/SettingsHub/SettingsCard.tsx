import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'glow' | 'accent' | 'amber' | 'danger';
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
  headerAction,
  variant = 'default',
  className = '',
}) => {
  return (
    <GlassCard variant={variant} className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white font-serif">{title}</h3>
              {badge && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-[#dfe0ff] border border-white/15">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-[#a2a6d0] mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {/* Body */}
      <div>{children}</div>
    </GlassCard>
  );
};
