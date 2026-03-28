import React from 'react';
import { type LucideIcon } from 'lucide-react';

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

export const CHUNKY_VARIANTS: Record<string, string> = {
    primary: "bg-pink-400 border-pink-600 text-white shadow-[0_4px_0_0_#db2777] md:shadow-[0_6px_0_0_#db2777] hover:shadow-[0_8px_0_0_#db2777] md:hover:shadow-[0_10px_0_0_#db2777] hover:brightness-110",
    secondary: "bg-purple-400 border-purple-600 text-white shadow-[0_4px_0_0_#9333ea] md:shadow-[0_6px_0_0_#9333ea] hover:shadow-[0_8px_0_0_#9333ea] md:hover:shadow-[0_10px_0_0_#9333ea] hover:brightness-110",
    success: "bg-green-400 border-green-600 text-white shadow-[0_4px_0_0_#16a34a] md:shadow-[0_6px_0_0_#16a34a] hover:shadow-[0_8px_0_0_#16a34a] md:hover:shadow-[0_10px_0_0_#16a34a] hover:brightness-110",
    warning: "bg-amber-400 border-amber-600 text-white shadow-[0_4px_0_0_#d97706] md:shadow-[0_6px_0_0_#d97706] hover:shadow-[0_8px_0_0_#d97706] md:hover:shadow-[0_10px_0_0_#d97706] hover:brightness-110",
    error: "bg-red-400 border-red-600 text-white shadow-[0_4px_0_0_#dc2626] md:shadow-[0_6px_0_0_#dc2626] hover:shadow-[0_8px_0_0_#dc2626] md:hover:shadow-[0_10px_0_0_#dc2626] hover:brightness-110",
    info: "bg-sky-400 border-sky-600 text-white shadow-[0_4px_0_0_#0284c7] md:shadow-[0_6px_0_0_#0284c7] hover:shadow-[0_8px_0_0_#0284c7] md:hover:shadow-[0_10px_0_0_#0284c7] hover:brightness-110",
    white: "bg-white border-pink-100 text-pink-500 shadow-[0_4px_0_0_#fce7f3] md:shadow-[0_6px_0_0_#fce7f3] hover:shadow-[0_8px_0_0_#fce7f3] md:hover:shadow-[0_10px_0_0_#fce7f3] hover:brightness-100",
    disabled: "bg-slate-200 border-slate-300 text-slate-400 shadow-[0_4px_0_0_#cbd5e1] md:shadow-[0_6px_0_0_#cbd5e1]"
};

// 반응형 잼미니
const SIZES: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: "px-3 py-1.5 text-base md:text-lg rounded-xl",
    md: "px-4 py-2 md:px-6 md:py-3 text-lg md:text-xl rounded-2xl",
    lg: "px-6 py-3 md:px-8 md:py-4 text-xl md:text-2xl rounded-[24px]",
    xl: "px-8 py-4 md:px-10 md:py-6 text-2xl md:text-3xl rounded-[32px] w-full"
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
                ${CHUNKY_VARIANTS[disabled ? 'disabled' : variant]}
                ${SIZES[size]}
                ${className}
                ${!disabled ? 'cursor-pointer' : ''}
                chunky-transition
                chunky-hover
                chunky-active
                border-2
                flex items-center justify-center gap-2
                select-none
            `}
        >
            {Icon && <Icon className="w-[1.2em] h-[1.2em]" strokeWidth={3} />}
            {children}
        </button>
    );
};