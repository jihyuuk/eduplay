import React from 'react';
import { type LucideIcon } from 'lucide-react';

/**
 * 전역 스타일 정의 (아이들을 위한 Jua 폰트 및 입체 애니메이션)
 */
export const GlobalStyles: React.FC = () => (
    <style dangerouslySetInnerHTML={{
        __html: `

    /*진짜 마우스가 있는 기기(PC)에서만 호버 효과 적용! => 모바일 터치환경에서 Sticky Hover 방지 */
    @media (hover: hover) and (pointer: fine) {
      .chunky-hover:hover:not(:disabled) {
        transform: translateY(-4px);
      }
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
    primary: "bg-pink-400 border-pink-600 text-white shadow-[0_4px_0_0_#db2777] md:shadow-[0_6px_0_0_#db2777] hover:shadow-[0_8px_0_0_#db2777] md:hover:shadow-[0_10px_0_0_#db2777] hover:brightness-120",
    secondary: "bg-purple-400 border-purple-600 text-white shadow-[0_4px_0_0_#9333ea] md:shadow-[0_6px_0_0_#9333ea] hover:shadow-[0_8px_0_0_#9333ea] md:hover:shadow-[0_10px_0_0_#9333ea] hover:brightness-120",
    success: "bg-green-400 border-green-600 text-white shadow-[0_4px_0_0_#16a34a] md:shadow-[0_6px_0_0_#16a34a] hover:shadow-[0_8px_0_0_#16a34a] md:hover:shadow-[0_10px_0_0_#16a34a] hover:brightness-120",
    warning: "bg-amber-400 border-amber-600 text-white shadow-[0_4px_0_0_#d97706] md:shadow-[0_6px_0_0_#d97706] hover:shadow-[0_8px_0_0_#d97706] md:hover:shadow-[0_10px_0_0_#d97706] hover:brightness-120",
    error: "bg-red-400 border-red-600 text-white shadow-[0_4px_0_0_#dc2626] md:shadow-[0_6px_0_0_#dc2626] hover:shadow-[0_8px_0_0_#dc2626] md:hover:shadow-[0_10px_0_0_#dc2626] hover:brightness-120",
    info: "bg-sky-400 border-sky-600 text-white shadow-[0_4px_0_0_#0284c7] md:shadow-[0_6px_0_0_#0284c7] hover:shadow-[0_8px_0_0_#0284c7] md:hover:shadow-[0_10px_0_0_#0284c7] hover:brightness-120",
    white: "bg-white border-pink-100 text-pink-500 shadow-[0_4px_0_0_#fce7f3] md:shadow-[0_6px_0_0_#fce7f3] hover:shadow-[0_8px_0_0_#fce7f3] md:hover:shadow-[0_10px_0_0_#fce7f3] hover:brightness-120",
    disabled: "bg-slate-200 border-slate-300 text-slate-400 shadow-[0_4px_0_0_#cbd5e1] md:shadow-[0_6px_0_0_#cbd5e1] cursor-not-allowed"
};

// 원본
// const SIZES: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
//     sm: "px-3 py-1.5 text-lg rounded-xl",
//     md: "px-6 py-3 text-xl rounded-2xl",
//     lg: "px-8 py-4 text-2xl rounded-[24px]",
//     xl: "px-10 py-6 text-3xl rounded-[32px] w-full"
// };

// 반응형-gpt
// const SIZES = {
//   sm: "px-3 py-1.5 text-base sm:text-lg",
//   md: "px-4 py-2 text-lg sm:text-xl md:text-2xl",
//   lg: "px-6 py-3 text-xl sm:text-2xl md:text-3xl",
//   xl: "px-8 py-4 text-2xl sm:text-3xl md:text-4xl w-full"
// };

// const SIZES = {
//   sm: "px-3 py-2 text-sm sm:text-base",
//   md: "px-5 py-3 text-base sm:text-lg md:text-xl",
//   lg: "px-6 py-4 text-lg sm:text-xl md:text-2xl",
//   xl: "px-8 py-5 text-xl sm:text-2xl md:text-3xl w-full"
// };

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
                ${VARIANTS[disabled ? 'disabled' : variant]}
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