import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, User, Check, UploadCloud } from 'lucide-react';
import { uploadService } from '../../services/uploadService';

interface AvatarUploaderProps {
  currentAvatar: string;
  name: string;
  onAvatarChange: (newAvatarUrl: string) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  name,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadService.uploadAvatar(file);
      onAvatarChange(result.url);
    } catch (err: any) {
      setError(err.message || 'فشل رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
      {/* Current Avatar with hover trigger */}
      <div className="relative group">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-amber-400/40 p-1 bg-[#091338] shadow-lg shadow-amber-400/10">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#070e2b] rounded-2xl text-amber-300">
              <User className="w-10 h-10" />
            </div>
          )}

          {/* Hover overlay */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer rounded-2xl text-white gap-1"
          >
            <Camera className="w-6 h-6 text-amber-300" />
            <span className="text-[10px] font-bold">تغيير الصورة</span>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md cursor-pointer transition-all border border-amber-300"
          title="رفع صورة جديدة"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Upload info and presets */}
      <div className="flex-1 text-center sm:text-right space-y-3">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <span>الصورة الرمزية للطالب</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/20">
              BAC Avatar
            </span>
          </h4>
          <p className="text-xs text-[#a2a6d0] mt-0.5">
            اختر صورة تعبر عنك أو ارفع صورة خاصة (الحجم الأقصى 5 ميغابايت بصيغة JPG/PNG)
          </p>
        </div>

        {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

        {/* Preset quick picker */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-[#a2a6d0] block">نماذج جاهزة سريعة:</span>
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            {PRESET_AVATARS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onAvatarChange(url)}
                className={`relative w-8 h-8 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                  currentAvatar === url
                    ? 'border-amber-400 scale-110 shadow-[0_0_8px_rgba(255,225,109,0.5)]'
                    : 'border-white/15 opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={url}
                  alt={`preset-${i}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {currentAvatar === url && (
                  <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white font-bold" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
