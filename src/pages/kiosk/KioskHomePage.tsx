import { useNavigate } from "react-router-dom";
import { Store, Sparkles, Pointer } from "lucide-react";

export default function KioskHomePage() {
    const navigate = useNavigate();

    const goToOrderPage = () => {
        navigate("/kiosk/order");
    };

    return (
        <div className=" h-screen !h-[100dvh] overflow-hidden">
            <div
                onClick={goToOrderPage}
                className="bg-white/90 backdrop-blur-sm cursor-pointer h-full w-full max-w-3xl mx-auto flex flex-col overflow-hidden relative shadow-2xl"
            >
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

                {/* 타이틀 영역 */}
                <section className="shrink-0 text-center pt-16 px-6 relative">
                    <h1 className="text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 drop-shadow-sm">
                        에듀 마트
                    </h1>

                    <div className="mt-6 inline-block bg-amber-100 text-amber-700 text-2xl font-bold px-6 py-2 rounded-full border-2 border-amber-300 shadow-sm">
                        키오스크 체험하기
                    </div>
                </section>

                {/* 가운데 상점 아이콘 (빛나는 효과 및 애니메이션 추가) */}
                <main className="flex-1 flex items-center justify-center px-6 relative">
                    <div className="relative">
                        {/* 뒤에 깔리는 은은한 빛 효과 */}
                        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-60 animate-pulse" />

                        {/* 메인 아이콘 컨테이너 */}
                        <div className="relative bg-white border-8 border-yellow-100 rounded-full h-72 w-72 flex items-center justify-center shadow-xl">
                            <Store size={150} className="text-rose-500" strokeWidth={1.5} />
                        </div>

                        {/* 반짝이 장식 */}
                        <Sparkles
                            className="absolute -top-4 -right-4 text-yellow-400 animate-pulse"
                            size={56}
                            fill="currentColor"
                        />
                        <Sparkles
                            className="absolute bottom-8 -left-8 text-rose-300 animate-pulse"
                            size={40}
                            fill="currentColor"
                        />
                    </div>
                </main>

                {/* 안내 문구 (누르고 싶은 둥근 버튼 스타일) */}
                <footer className="shrink-0 pb-20 px-8 text-center flex justify-center">
                    <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-orange-400 to-rose-500 text-white w-full max-w-md py-6 rounded-full shadow-[0_10px_25px_-5px_rgba(244,63,94,0.5)]">
                        <Pointer size={40} className="animate-pulse" />
                        <span className="text-4xl font-black tracking-wide">
                            화면을 터치해 주세요
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}