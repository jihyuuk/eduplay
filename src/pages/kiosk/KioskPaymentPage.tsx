import { useState } from "react";
import { CreditCard, Heart, Hand, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PaymentType =
    | "CARD"
    | "CASH"
    | "LOVE"
    | "CLAP"
    | "SMILE";

export default function KioskPaymentPage() {
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);

    const completePayment = () => {
        navigate("/kiosk/result");
    };

    return (
        <div className="bg-gradient-to-tr from-rose-100 via-sky-50 to-amber-100 bg-fixed min-h-[100dvh] flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm h-screen !h-[100dvh] w-full max-w-3xl mx-auto flex flex-col overflow-hidden shadow-2xl relative">

               {/* 귀여운 어닝 (둥근 천막 스타일) */}
                <div className="flex w-full h-16 shrink-0 drop-shadow-md z-10">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-b-full ${i % 2 === 0 ? "bg-rose-400" : "bg-white"
                                }`}
                        />
                    ))}
                </div>

                {/* 헤더 */}
                <header className="shrink-0 p-5 bg-white shadow-sm text-center">
                    <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 drop-shadow-sm">
                        결제하기
                    </h1>
                </header>

                {/* 메인 영역 (푸터 제거 후 내부 정렬) */}
                <main className="flex-1 min-h-0 overflow-y-auto p-6 bg-gray-50/50 flex flex-col items-center justify-center">
                    
                    {/* 1. 결제 수단 선택 화면 */}
                    {!selectedPayment && (
                        <div className="w-full max-w-xl flex flex-col items-center gap-8 animate-fade-in">
                            <div className="grid grid-cols-2 gap-6 w-full">
                                <PaymentButton
                                    icon={<CreditCard size={64} strokeWidth={2} />}
                                    title="카드 결제"
                                    onClick={() => setSelectedPayment("CARD")}
                                />

                                <PaymentButton
                                    icon={<Heart size={64} strokeWidth={2} />}
                                    title="사랑해 결제"
                                    onClick={() => setSelectedPayment("LOVE")}
                                />

                                <PaymentButton
                                    icon={<Hand size={64} strokeWidth={2} />}
                                    title="박수 결제"
                                    onClick={() => setSelectedPayment("CLAP")}
                                />

                                <PaymentButton
                                    icon={<Smile size={64} strokeWidth={2} />}
                                    title="미소 결제"
                                    onClick={() => setSelectedPayment("SMILE")}
                                />
                            </div>

                        </div>
                    )}

                    {/* 2. 각 결제별 가이드 화면 */}
                    {selectedPayment && (
                        <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
                            {selectedPayment === "CARD" && (
                                <PaymentGuide
                                    title="카드를 대주세요 💳"
                                    description="카드를 기계에 톡! 대는 척 해보세요."
                                    buttonText="카드 결제 완료"
                                    onComplete={completePayment}
                                    themeColor="sky"
                                />
                            )}

                            {selectedPayment === "LOVE" && (
                                <PaymentGuide
                                    title="사랑해를 외쳐주세요 ❤️"
                                    description='크게 "사랑해!"라고 말한 뒤 버튼을 눌러주세요.'
                                    buttonText="사랑해!"
                                    onComplete={completePayment}
                                    themeColor="rose"
                                />
                            )}

                            {selectedPayment === "CLAP" && (
                                <PaymentGuide
                                    title="박수를 쳐주세요 👏"
                                    description="짝! 짝! 짝! 세 번 박수를 친 뒤 버튼을 눌러주세요."
                                    buttonText="짝짝짝!"
                                    onComplete={completePayment}
                                    themeColor="amber"
                                />
                            )}

                            {selectedPayment === "SMILE" && (
                                <PaymentGuide
                                    title="활짝 웃어보세요 😊"
                                    description="예쁜 미소를 지은 뒤 버튼을 눌러주세요."
                                    buttonText="웃었어요!"
                                    onComplete={completePayment}
                                    themeColor="emerald"
                                />
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function PaymentGuide({
    title,
    description,
    buttonText,
    onComplete,
    themeColor
}: {
    title: string;
    description: string;
    buttonText: string;
    onComplete: () => void;
    themeColor: "sky" | "rose" | "amber" | "emerald";
}) {
    const themes = {
        sky: "from-sky-400 to-blue-400 border-sky-500 shadow-[0_6px_0_0_#0284c7]",
        rose: "from-rose-400 to-pink-400 border-rose-500 shadow-[0_6px_0_0_#e11d48]",
        amber: "from-amber-400 to-orange-400 border-amber-500 shadow-[0_6px_0_0_#d97706]",
        emerald: "from-emerald-400 to-teal-400 border-emerald-500 shadow-[0_6px_0_0_#059669]",
    };

    return (
        <div className="w-full flex flex-col items-center text-center">
            <div className="w-full bg-white border-4 border-purple-100 rounded-[2.5rem] p-8 py-20 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.04)] mb-6">
                <div className="text-4xl font-black text-gray-800 tracking-tight leading-tight">
                    {title}
                </div>
                <div className="mt-5 text-xl font-extrabold text-gray-400 leading-relaxed break-keep">
                    {description}
                </div>
            </div>

            <button
                onClick={onComplete}
                className={`h-20 w-full rounded-2xl border-4 text-3xl font-black text-white bg-gradient-to-r active:translate-y-[6px] active:shadow-none transition-all duration-70 ${themes[themeColor]}`}
            >
                {buttonText}
            </button>
        </div>
    );
}

function PaymentButton({
    icon,
    title,
    onClick
}: {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
}) {
    let themeClasses = "bg-sky-50 border-sky-300 text-sky-500 shadow-[0_8px_0_0_#bae6fd]";
    if (title.includes("사랑해")) {
        themeClasses = "bg-rose-50 border-rose-300 text-rose-500 shadow-[0_8px_0_0_#fecdd3]";
    } else if (title.includes("박수")) {
        themeClasses = "bg-amber-50 border-amber-300 text-amber-500 shadow-[0_8px_0_0_#fef08a]";
    } else if (title.includes("미소")) {
        themeClasses = "bg-emerald-50 border-emerald-300 text-emerald-500 shadow-[0_8px_0_0_#a7f3d0]";
    }

    return (
        <button
            onClick={onClick}
            className={`
                aspect-square
                rounded-[2.5rem]
                border-4
                flex flex-col
                items-center
                justify-center
                gap-4
                transition-all
                duration-100
                active:translate-y-[8px]
                active:shadow-none
                select-none
                ${themeClasses}
            `}
        >
            <div className="drop-shadow-sm animate-pulse">
                {icon}
            </div>
            <div className="text-3xl font-black text-gray-700 tracking-tight">
                {title}
            </div>
        </button>
    );
}