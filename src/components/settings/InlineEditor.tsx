import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface InlineEditorProps {
  label: string;
  value: string;
  onSave: (val: string) => void;
  type?: 'text' | 'textarea' | 'number' | 'email';
  placeholder?: string;
  description?: string;
  badge?: string;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  label,
  value,
  onSave,
  type = 'text',
  placeholder = '',
  description,
  badge,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleStartEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-white">{label}</label>
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {badge}
            </span>
          )}
        </div>
        {!isEditing ? (
          <button
            type="button"
            onClick={handleStartEdit}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            <span>تعديل</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleConfirm}
              className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer"
              title="تأكيد"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 cursor-pointer"
              title="إلغاء"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {description && <p className="text-[11px] text-[#a2a6d0]">{description}</p>}

      <div>
        {isEditing ? (
          type === 'textarea' ? (
            <textarea
              rows={3}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2.5 rounded-xl bg-[#091338] border border-amber-400/50 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              autoFocus
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2 rounded-xl bg-[#091338] border border-amber-400/50 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              autoFocus
            />
          )
        ) : (
          <div className="p-2.5 rounded-xl bg-[#060b22] border border-white/5 text-xs text-[#dfe0ff] font-medium min-h-[34px] flex items-center">
            {value || <span className="text-[#a2a6d0]/50 italic">{placeholder || 'غير محدد'}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
