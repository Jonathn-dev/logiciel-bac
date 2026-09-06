import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'default' | 'compact';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'default' }) => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
        variant === 'compact'
          ? 'p-2 bg-[#131b4a]/80 hover:bg-[#1c2357] border-white/10 text-[#ffe16d]'
          : 'px-3 py-1.5 bg-[#131b4a]/90 hover:bg-[#1c2357] border-[#ffe16d]/20 text-[#dfe0ff] text-xs font-bold'
      }`}
      title={isDark ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          {variant !== 'compact' && <span>الوضع النهاري</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-blue-400" />
          {variant !== 'compact' && <span>الوضع الليلي</span>}
        </>
      )}
    </button>
  );
};
