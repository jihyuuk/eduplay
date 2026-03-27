import { AlertCircle, CheckCircle2, ChevronLeft, Heart, Info, Play, RotateCcw, Settings, Star, XCircle } from "lucide-react";
import { useState } from "react";
import ChunkyButton, { GlobalStyles } from "./ChunkyButton";
import { useNavigate } from "react-router-dom";

export function ChunkyButtonExample() {

    const [lastAction, setLastAction] = useState<string>("마우스를 버튼 위로 가져가보세요!");

    const navigate = useNavigate();

    const handleBack = () => navigate("/");

    return (
        <div className="min-h-screen bg-pink-50/30 pb-20">
            <GlobalStyles />

            <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b-4 border-pink-100 px-4 py-4 font-jua">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex-1 flex justify-start">
                        <ChunkyButton variant="white" size="sm" onClick={handleBack} icon={ChevronLeft} />
                    </div>
                    <div className="flex-[3] text-center">
                        <h1 className="text-3xl text-pink-500 drop-shadow-sm">참 잘했어요!</h1>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <ChunkyButton variant="primary" size="sm" icon={Settings} />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-12">

                {/* 상태 표시창 */}
                <div className="bg-white border-4 border-pink-200 rounded-3xl p-8 text-center shadow-inner group">
                    <p className="font-jua text-2xl text-pink-600 transition-all group-hover:scale-110">
                        {lastAction}
                    </p>
                </div>

                {/* 버튼 라이브러리 섹션 */}
                <section className="space-y-6">
                    <h2 className="font-jua text-2xl text-slate-700 mb-4">🌈 컬러별 버튼 (Variants)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <ChunkyButton variant="primary" onClick={() => setLastAction("분홍이(기본) 클릭!")}>
                            분홍이
                        </ChunkyButton>
                        <ChunkyButton variant="secondary" onClick={() => setLastAction("보라보라 클릭!")}>
                            보라보라
                        </ChunkyButton>
                        <ChunkyButton variant="success" icon={CheckCircle2} onClick={() => setLastAction("초록색(정답) 클릭!")}>
                            정답이야
                        </ChunkyButton>
                        <ChunkyButton variant="warning" icon={AlertCircle} onClick={() => setLastAction("노란색(주의) 클릭!")}>
                            조심조심
                        </ChunkyButton>
                        <ChunkyButton variant="error" icon={XCircle} onClick={() => setLastAction("빨간색(오답) 클릭!")}>
                            다시해봐
                        </ChunkyButton>
                        <ChunkyButton variant="info" icon={Info} onClick={() => setLastAction("하늘색(정보) 클릭!")}>
                            알려줄게
                        </ChunkyButton>
                        <ChunkyButton variant="white" icon={Heart} onClick={() => setLastAction("하얀색 하트 클릭!")}>
                            사랑해
                        </ChunkyButton>
                        <ChunkyButton disabled icon={Play}>
                            잠깐쉬어
                        </ChunkyButton>
                    </div>
                </section>

                {/* 대형 버튼 섹션 */}
                <section className="space-y-6">
                    <h2 className="font-jua text-2xl text-slate-700 mb-4">📏 크기별 버튼 (Sizes)</h2>
                    <div className="flex flex-wrap items-end gap-8">
                        <ChunkyButton size="sm" variant="info">작은 버튼</ChunkyButton>
                        <ChunkyButton size="md" variant="primary">보통 버튼</ChunkyButton>
                        <ChunkyButton size="lg" variant="success" icon={Star}>커다란 버튼</ChunkyButton>
                    </div>
                    <div className="pt-6">
                        <ChunkyButton size="xl" variant="secondary" icon={RotateCcw} onClick={() => setLastAction("왕 버튼 클릭!")}>
                            제일 큰 다시하기 버튼!
                        </ChunkyButton>
                    </div>
                </section>

                {/* 아이콘 전용 버튼 */}
                <section className="space-y-6">
                    <h2 className="font-jua text-2xl text-slate-700 mb-4">🎨 아이콘 버튼</h2>
                    <div className="flex gap-4">
                        <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 flex gap-4">
                            <ChunkyButton variant="primary" size="sm" icon={Heart} />
                            <ChunkyButton variant="success" size="sm" icon={CheckCircle2} />
                            <ChunkyButton variant="warning" size="sm" icon={Star} />
                            <ChunkyButton variant="error" size="sm" icon={XCircle} />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}