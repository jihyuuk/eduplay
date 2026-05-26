import { AlarmClock, Plus, RefreshCcw } from "lucide-react";
import SubHeader from "../../components/SubHeader";
import ChunkyButton from "../../components/ChunkyButton";
import TimePickerField, { TEXT_COLORS } from "./components/TimePickerField";
import { useState } from "react";

const MAX_OPTION_HOUR = 25;
const MAX_OPTION_MINUTE = 60;
const MAX_OPTION_SECOND = 60;

type QuickTime = {
    label: string;      // 화면에 보여줄 텍스트
    value: number;      // 더해줄 실제 숫자
    unit: "h" | "m" | "s"; // 시, 분, 초 단위 구분
};

// 2. 타입에 맞춰 데이터 배열 선언
const quickTimes: QuickTime[] = [
    { label: "15분", value: 15, unit: "m" },
    { label: "10분", value: 10, unit: "m" },
    { label: "5분", value: 5, unit: "m" },
    { label: "3분", value: 3, unit: "m" },
    { label: "30초", value: 30, unit: "s" },
    { label: "10초", value: 10, unit: "s" },
    { label: "5초", value: 5, unit: "s" },
];

export default function TimerPage() {

    const [hour, setHour] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);
    const [second, setSecond] = useState<number>(0);

    const handleHourChange = (newValue: number) => {
        setHour(((newValue % MAX_OPTION_HOUR) + MAX_OPTION_HOUR) % MAX_OPTION_HOUR);
    }

    const handleMinuteChange = (newValue: number) => {
        setMinute(((newValue % MAX_OPTION_MINUTE) + MAX_OPTION_MINUTE) % MAX_OPTION_MINUTE);
    }

    const handleSecondChange = (newValue: number) => {
        setSecond(((newValue % MAX_OPTION_SECOND) + MAX_OPTION_SECOND) % MAX_OPTION_SECOND);
    }

    const resetAll = () => {
        setHour(0);
        setMinute(0);
        setSecond(0);
    }

    const handleQuickAdd = (time: QuickTime) => {
        if (time.unit === "m") {
            handleMinuteChange(minute + time.value);
        } else if (time.unit === "s") {
            handleSecondChange(second + time.value);
        } else if (time.unit === "h") {
            handleHourChange(hour + time.value);
        }
    };

    return (
        <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">

            {/* 서브헤더 */}
            <SubHeader title="타이머" />

            <main className="flex-1 flex flex-col items-center justify-center w-full p-4 relative">

                {/* 타이머 설정 영역 카드 */}
                <div className="flex flex-col items-center justify-center border-1 p-5 sm:p-10 rounded-4xl bg-white shadow-md">

                    {/* 시간 선택 컨테이너 */}
                    <div className="flex items-end justify-center gap-2 sm:gap-4 w-full">

                        {/* ==================== [시(Hour) 영역] ==================== */}
                        <TimePickerField label="시" color="sky" currentValue={hour} onValueChange={handleHourChange} maxOptions={MAX_OPTION_HOUR} />

                        {/* ==================== [분(Minute) 영역] ==================== */}
                        <TimePickerField label="분" color="pink" currentValue={minute} onValueChange={handleMinuteChange} maxOptions={MAX_OPTION_MINUTE} />

                        {/* ==================== [초(Second) 영역] ==================== */}
                        <TimePickerField label="초" color="purple" currentValue={second} onValueChange={handleSecondChange} maxOptions={MAX_OPTION_SECOND} />

                    </div>

                    {/* 빠른 입력 */}
                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                        {quickTimes.map((quickTime, index) =>
                            <ChunkyButton
                                key={index}
                                size="xs"
                                variant="white"
                                onClick={() => handleQuickAdd(quickTime)}
                                className={quickTime.unit === 'h' ? TEXT_COLORS["sky"] : quickTime.unit === 'm' ? TEXT_COLORS["pink"] : TEXT_COLORS["purple"]}
                            >
                                + {quickTime.label}
                            </ChunkyButton>
                        )}
                    </div>

                    <div className="flex w-full gap-2 mt-12">
                        <ChunkyButton icon={RefreshCcw} variant="secondary" className="text-nowrap" onClick={resetAll} >
                            초기화
                        </ChunkyButton>

                        <ChunkyButton icon={AlarmClock} className="w-full">
                            시작하기
                        </ChunkyButton>
                    </div>
                </div>

            </main>
        </div>
    );
}

function Colon() {
    return (
        <div className="text-4xl sm:text-5xl font-black text-gray-400 pb-7 sm:pb-9 select-none">
            :
        </div>
    );
}