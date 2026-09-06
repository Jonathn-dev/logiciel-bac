import React from 'react';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';

interface PlanBadgeProps {
  plan: 'free' | 'pro_bac' | 'vip_academy';
  status?: 'active' | 'trial' | 'expired';
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, status = 'active' }) => {
  const getBadgeConfig = () => {
    switch (plan) {
      case 'vip_academy':
        return {
          label: 'باقة التفوق والأكاديمية VIP',
          icon: Crown,
          bg: 'bg-gradient-to-r from-purple-500/20 to-amber-500/20 text-purple-200 border-purple-400/40',
        };
      case 'pro_bac':
        return {
          label: 'خطة التفوق BAC PRO',
          icon: Sparkles,
          bg: 'bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-300 border-amber-400/40',
        };
      default:
        return {
          label: 'الباقة المجانية الأساسية',
          icon: ShieldCheck,
          bg: 'bg-white/10 text-white/80 border-white/20',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${config.bg}`}>
        <Icon className="w-3.5 h-3.5 text-amber-300" />
        <span>{config.label}</span>
      </div>

      {status === 'active' && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          نشط ومفعل
        </span>
      )}
      {status === 'trial' && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          فترة تجريبية
        </span>
      )}
      {status === 'expired' && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          منتهي
        </span>
      )}
    </div>
  );
};
