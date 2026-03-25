import React from 'react';
import { Timer, HelpCircle, RefreshCw, Settings, Home } from 'lucide-react';

interface ResultModalProps {
    playTime: number;
    hintCount: number;
    playAgain: () => void;
    goSetting: () => void;
    goHome: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ playTime, hintCount, playAgain, goSetting, goHome }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[200]">
            {/* 배경 레이어 (Backdrop) */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* 모달 본체 */}
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center border-4 border-pink-200 animate-in fade-in zoom-in duration-300">

                {/* 상단 축하 섹션 */}
                <div className="mb-6">
                    <span className="text-6xl inline-block animate-bounce" role="img" aria-label="축하">🎉</span>
                    <h2 className="text-3xl font-bold text-pink-600 mt-4">최고예요!</h2>
                    <p className="text-slate-500 mt-2 font-medium">우리 반 친구들을 모두 찾았어요!</p>
                </div>

                {/* 결과 리포트 섹션 */}
                <div className="bg-rose-50 rounded-2xl p-5 mb-6 space-y-4">
                    {/* 걸린 시간 */}
                    <div className="flex justify-between items-center text-xl">
                        <div className="flex items-center text-slate-600">
                            <Timer className="w-6 h-6 mr-2 text-blue-500" />
                            <span>걸린 시간</span>
                        </div>
                        <span className="font-bold text-blue-600">{playTime}초</span>
                    </div>

                    {/* 힌트 사용 횟수 */}
                    <div className="flex justify-between items-center text-xl">
                        <div className="flex items-center text-slate-600">
                            <HelpCircle className="w-6 h-6 mr-2 text-amber-500" />
                            <span>힌트 사용</span>
                        </div>
                        <span className="font-bold text-amber-600">{hintCount}번</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* 1. 다시하기 (메인 강조 버튼) */}
                    <button
                        onClick={playAgain}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-2xl rounded-2xl font-bold shadow-lg hover:from-pink-600 hover:to-rose-700 transition-all active:scale-95 flex items-center justify-center group"
                    >
                        <RefreshCw className="w-7 h-7 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        한 번 더 하기
                    </button>

                    {/* 2. 하단 보조 버튼 (2열 배치) */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={goSetting}
                            className="py-4 bg-slate-100 text-slate-600 text-lg rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                        >
                            <Settings className="w-5 h-5 mr-2 text-slate-500" />
                            난이도 선택
                        </button>

                        <button
                            onClick={goHome}
                            className="py-4 bg-slate-100 text-slate-600 text-lg rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                        >
                            <Home className="w-5 h-5 mr-2 text-slate-500" />
                            홈으로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;