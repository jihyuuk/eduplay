import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChunkyButton from "../../../components/ChunkyButton";

export type LabelColor = 'sky' | 'pink' | 'purple' | 'green' | 'amber';

type TimePickerFieldProps = {
    label: string;
    color: LabelColor;
    currentValue: number;
    onValueChange: (newValue: number) => void;
    maxOptions: number;
}

export const TEXT_COLORS: Record<LabelColor, string> = {
    sky: "text-sky-400",
    pink: "text-pink-400",
    purple: "text-purple-400",
    green: "text-green-400",
    amber: "text-amber-400"
};

const LABEL_COLORS: Record<LabelColor, string> = {
    sky: "text-sky-500 bg-sky-50 border-sky-200",
    pink: "text-pink-500 bg-pink-50 border-pink-200",
    purple: "text-purple-500 bg-purple-50 border-purple-200",
    green: "text-green-500 bg-green-50 border-green-200",
    amber: "text-amber-500 bg-amber-50 border-amber-200"
};

const HOVER_COLORS: Record<LabelColor, string> = {
    sky: "hover:bg-sky-50 hover:text-sky-500",
    pink: "hover:bg-pink-50 hover:text-pink-500",
    purple: "hover:bg-purple-50 hover:text-purple-500",
    green: "hover:bg-green-50 hover:text-green-500",
    amber: "hover:bg-amber-50 hover:text-amber-500",
};

const FOCUS_COLORS: Record<LabelColor, string> = {
    sky: "focus:ring-sky-200 focus:border-sky-400",
    pink: "focus:ring-pink-200 focus:border-pink-400",
    purple: "focus:ring-purple-200 focus:border-purple-400",
    green: "focus:ring-green-200 focus:border-green-400",
    amber: "focus:ring-amber-200 focus:border-amber-400",
};


export default function TimePickerField({ label, color, currentValue, onValueChange, maxOptions }: TimePickerFieldProps) {

    const [isOpen, setIsOpen] = useState(false);

    // 숫자를 항상 두 자릿수 문자열("00")로 변환해주는 헬퍼 펑션
    const formatTime = (time: number) => String(time).padStart(2, '0');

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        if (isOpen) {
            setIsOpen(false);
            buttonRef.current?.blur();
        } else {
            setIsOpen(true);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // 클릭된 요소가 현재 드롭다운 컨테이너 외부에 있다면 닫기
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                buttonRef.current?.blur();
            }
        }

        if (isOpen) {
            // 창이 열려있을 때만 이벤트를 등록해서 메모리 낭비 방지
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            // 컴포넌트가 사라지거나 닫힐 때 이벤트 청소
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="flex items-end gap-1.5">
            <div ref={containerRef} className="flex flex-col items-center gap-2">
                <span className={`text-base font-black px-4 py-0.5 rounded-full border-2 shadow-sm select-none ${LABEL_COLORS[color]}`}>
                    {label}
                </span>

                {/* select 대신 우리가 만든 커스텀 버튼 디자인 */}
                <div className="relative">

                    <button
                        onClick={handleToggle}
                        ref={buttonRef}
                        className={`
                            w-20 h-24 sm:w-24 sm:h-28 text-5xl sm:text-6xl font-black text-gray-700 bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-inner focus:outline-none focus:bg-white focus:ring-4  transition-all flex items-center justify-center cursor-pointer select-none
                            ${FOCUS_COLORS[color]}
                        `}
                    >
                        {formatTime(currentValue)}
                    </button>

                    {/* 옵션 창이 열렸을 때 나오는 커스텀 스크롤 박스 */}
                    {isOpen && (
                        <div className="absolute top-[105%] left-0 w-full max-h-48 bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-y-auto z-50 p-1 flex flex-col gap-0.5 chunky-scrollbar">
                            {Array.from({ length: maxOptions }, (_, i) => {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            onValueChange(i);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                                    w-full py-2 text-base font-bold text-gray-600 rounded-xl transition-colors text-center cursor-pointer
                                                    ${HOVER_COLORS[color]} 
                                                `}
                                    >
                                        {formatTime(i)}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 우측 세로 버튼 조합 */}
            <div className="flex flex-col gap-2 w-11 sm:w-13">
                <ChunkyButton
                    variant="white"
                    onClick={() => onValueChange(currentValue + 1)}
                    className={`!p-0 !px-0 w-full h-11 sm:h-13 flex items-center justify-center ${TEXT_COLORS[color]}`}
                >
                    <ChevronUp size={24} strokeWidth={3} className="mx-auto" />
                </ChunkyButton>
                <ChunkyButton
                    variant="white"
                    onClick={() => onValueChange(currentValue - 1)}
                    className={`!p-0 !px-0 w-full h-11 sm:h-13 flex items-center justify-center ${TEXT_COLORS[color]}`}
                >
                    <ChevronDown size={24} strokeWidth={3} className="mx-auto" />
                </ChunkyButton>
            </div>
        </div>
    );
}

