import React from 'react';
import { type LucideIcon } from 'lucide-react';

/**
 * 전역 스타일 정의 (아이들을 위한 Jua 폰트 및 입체 애니메이션)
 */
export const GlobalStyles: React.FC = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
    /* 호버 시 살짝 위로 뜨는 효과와 그림자 깊이 조절 */
    .chunky-hover:hover:not(:disabled) {
      transform: translateY(-4px);
    }

    /* 클릭 시 꾹 눌리는 효과 (그림자 높이만큼 내려가기) */
    .chunky-active:active:not(:disabled) {
      transform: translateY(6px) !important;
      box-shadow: none !important;
    }
    
    /* 부드러운 전환 효과 */
    .chunky-transition {
      transition: transform 0.1s ease-out, box-shadow 0.1s ease-out, filter 0.1s ease-out;
    }
  `}} />
);

// 버튼 속성(Props)에 대한 타입 정의
interface ChunkyButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'disabled';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    className?: string;
    icon?: LucideIcon;
}

const VARIANTS: Record<string, string> = {
    primary: "bg-pink-400 border-pink-600 text-white shadow-[0_6px_0_0_#db2777] hover:shadow-[0_10px_0_0_#db2777] hover:brightness-105",
    secondary: "bg-purple-400 border-purple-600 text-white shadow-[0_6px_0_0_#9333ea] hover:shadow-[0_10px_0_0_#9333ea] hover:brightness-105",
    success: "bg-green-400 border-green-600 text-white shadow-[0_6px_0_0_#16a34a] hover:shadow-[0_10px_0_0_#16a34a] hover:brightness-105",
    warning: "bg-amber-400 border-amber-600 text-white shadow-[0_6px_0_0_#d97706] hover:shadow-[0_10px_0_0_#d97706] hover:brightness-105",
    error: "bg-red-400 border-red-600 text-white shadow-[0_6px_0_0_#dc2626] hover:shadow-[0_10px_0_0_#dc2626] hover:brightness-105",
    info: "bg-sky-400 border-sky-600 text-white shadow-[0_6px_0_0_#0284c7] hover:shadow-[0_10px_0_0_#0284c7] hover:brightness-105",
    white: "bg-white border-pink-100 text-pink-500 shadow-[0_6px_0_0_#fce7f3] hover:shadow-[0_10px_0_0_#fce7f3]",
    disabled: "bg-slate-200 border-slate-300 text-slate-400 shadow-[0_6px_0_0_#cbd5e1] cursor-not-allowed"
};

const SIZES: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: "px-3 py-1.5 text-lg rounded-xl",
    md: "px-6 py-3 text-xl rounded-2xl",
    lg: "px-8 py-4 text-2xl rounded-[24px]",
    xl: "px-10 py-6 text-3xl rounded-[32px] w-full"
};


/**
 * ChunkyButton 컴포넌트
 */
export default function ChunkyButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = "",
    icon: Icon
}: ChunkyButtonProps) {


    return (
        <button
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            className={`
                ${VARIANTS[disabled ? 'disabled' : variant]}
                ${SIZES[size]}
                ${className}
                ${!disabled ? 'cursor-pointer' : ''}
                chunky-transition
                chunky-hover
                chunky-active
                font-jua
                border-2
                flex items-center justify-center gap-2
                select-none
            `}
        >
            {Icon && <Icon size={size === 'sm' ? 20 : size === 'xl' ? 36 : 28} strokeWidth={3} />}
            {children}
        </button>
    );
};