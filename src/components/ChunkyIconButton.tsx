import { type LucideIcon } from 'lucide-react';
import { CHUNKY_VARIANTS } from './ChunkyButton';

// 버튼 속성(Props)에 대한 타입 정의
interface ChunkyButtonProps {
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'disabled';
    disabled?: boolean;
    className?: string;
    icon: LucideIcon;
    iconSize?: number;
    strokeWidth?: number;
}

/**
 * ChunkyButton 컴포넌트
 */
export default function ChunkyIconButton({
    onClick,
    variant = 'primary',
    disabled = false,
    className = "",
    icon: Icon,
    iconSize = 20,
    strokeWidth = 2
}: ChunkyButtonProps) {


    return (
        <button
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            className={`
                p-1.5 sm:p-2
                rounded-xl
                ${CHUNKY_VARIANTS[disabled ? 'disabled' : variant]}
                ${className}
                ${!disabled ? 'cursor-pointer' : ''}
                chunky-transition
                chunky-hover
                chunky-active
                border-2
                select-none
            `}
        >
            <Icon size={iconSize} strokeWidth={strokeWidth} />
        </button>
    );
};