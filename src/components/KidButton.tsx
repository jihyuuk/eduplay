import React from 'react';

// 1. 사용할 수 있는 variant 종류를 정의합니다.
type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'disabled';

// 2. Props의 타입을 정의합니다.
interface KidButtonProps {
  variant?: ButtonVariant;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const KidButton: React.FC<KidButtonProps> = ({
  variant = 'primary',
  label,
  icon,
  disabled = false,
  onClick,
  className = ''
}) => {
  // 스타일 객체에도 타입을 지정하여 실수를 방지합니다.
  const styles: Record<ButtonVariant, { bg: string; shadow: string; activeShadow: string; hover: string; text: string }> = {
    primary: {
      bg: 'bg-[#7AD3FF]',
      shadow: 'shadow-[0_8px_0_rgb(80,170,230)]',
      activeShadow: 'shadow-[0_2px_0_rgb(80,170,230)]',
      hover: 'hover:bg-[#97E0FF]',
      text: 'text-white'
    },
    success: {
      bg: 'bg-[#6EE7B7]',
      shadow: 'shadow-[0_8px_0_rgb(70,190,140)]',
      activeShadow: 'shadow-[0_2px_0_rgb(70,190,140)]',
      hover: 'hover:bg-[#A7F3D0]',
      text: 'text-white'
    },
    warning: {
      bg: 'bg-[#FFD93D]',
      shadow: 'shadow-[0_8px_0_rgb(230,180,30)]',
      activeShadow: 'shadow-[0_2px_0_rgb(230,180,30)]',
      hover: 'hover:bg-[#FFE67D]',
      text: 'text-[#8B5E00]'
    },
    danger: {
      bg: 'bg-[#FF85A1]',
      shadow: 'shadow-[0_8px_0_rgb(220,100,130)]',
      activeShadow: 'shadow-[0_2px_0_rgb(220,100,130)]',
      hover: 'hover:bg-[#FFA3B9]',
      text: 'text-white'
    },
    disabled: {
      bg: 'bg-slate-200',
      shadow: 'shadow-none',
      activeShadow: 'shadow-none',
      hover: '',
      text: 'text-slate-400'
    }
  };

  const currentStyle = disabled ? styles.disabled : (styles[variant] || styles.primary);

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        relative flex items-center justify-center 
        gap-2 md:gap-3
        px-6 py-3 md:px-10 md:py-5
        rounded-[1.5rem] md:rounded-[2.5rem]
        text-xl md:text-2xl
        font-black transition-all duration-150
        ${currentStyle.bg} ${currentStyle.text} ${currentStyle.shadow}
        ${!disabled && 'active:translate-y-1.5 active:' + currentStyle.activeShadow}
        ${!disabled && 'hover:-translate-y-1 hover:scale-105 active:scale-95'}
        ${!disabled && currentStyle.hover}
        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        select-none 
        ${className} 
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default KidButton;