import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { FloatingInput } from './FloatingInput';
import { StrengthMeter, computePasswordStrength } from './StrengthMeter';

interface PasswordFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  helperText?: string;
  showStrength?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id = 'password-input',
  label = 'كلمة المرور',
  value,
  onChange,
  error,
  helperText,
  showStrength = false,
  required = true,
  disabled = false,
  autoComplete = 'current-password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const strength = computePasswordStrength(value);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full space-y-2">
      <FloatingInput
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        icon={<Lock className="w-4 h-4" />}
        actionElement={
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            className="p-1 rounded-lg text-white/40 hover:text-amber-400 focus:outline-none transition-colors cursor-pointer"
            title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-amber-400" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        }
      />

      {showStrength && value.length > 0 && (
        <div className="pt-1 px-1">
          <StrengthMeter strength={strength} showRequirements={true} />
        </div>
      )}
    </div>
  );
};
