import React, { useEffect } from 'react';
import { RefreshCw, ArrowLeft} from 'lucide-react'; // 아이콘 추가
import ChunkyButton from './ChunkyButton';
import { ConfettiCanvas } from './ConfettiCanvas';
import { useNavigate } from 'react-router-dom';

interface ResultModalProps {
    redScore: number;   // 빨간색 점수 추가
    blueScore: number;  // 파란색 점수 추가
    playAgain: () => void;
}

const FlipBattleResultModal: React.FC<ResultModalProps> = ({ redScore, blueScore, playAgain }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const navigate = useNavigate();
    const isBlueWin = blueScore > redScore;
    const isDraw = blueScore === redScore;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[200] px-4">

            {/* 이겼을때만 Confetti */}
            {isBlueWin && <ConfettiCanvas />}

            {/* 배경 레이어 (Backdrop) */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* 모달 본체: 모바일 대응 (p-6, max-w-[320px], text-sm/lg 등 적용) */}
            <div className="relative bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl max-w-[340px] sm:max-w-sm w-full mx-auto text-center border-4 border-pink-200 animate-in fade-in zoom-in duration-300">


                {/* 우승 텍스트 섹션 */}
                <div className="mb-4 sm:mb-6">
                    <span className="text-5xl sm:text-6xl inline-block animate-bounce" role="img" aria-label="결과">{isDraw ? "🤝" : isBlueWin ? "🎉" : "🔥"}</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-pink-600 mt-3 sm:mt-4">
                        {isDraw ? "무승부예요!" : isBlueWin ? "이겼어요!" : "아쉬워요..."}
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium">{isDraw ? "똑같아요! 둘 다 대단해요!" : isBlueWin ? "최고예요! 정말 빨라요!" : "조금만 더 하면 이길 수 있어요!"}</p>
                </div>

                {/* 대결 스코어 보드 디자인 */}
                <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6 bg-slate-50 p-6 rounded-[2.5rem] border-4 border-slate-100">

                    {/* 빨간팀 */}
                    <div className={`flex-1 flex flex-col items-center p-4 rounded-3xl transition-all ${!isBlueWin && !isDraw ? 'bg-red-50 ring-4 ring-red-200 scale-105' : 'opacity-60'}`}>
                        <span className="text-sm font-black text-red-400 mb-1">로봇</span>
                        <span className="text-5xl font-black text-red-500 tabular-nums">{redScore}</span>
                    </div>

                    <div className="text-2xl font-black text-slate-300 italic">VS</div>

                    {/* 파란팀 */}
                    <div className={`flex-1 flex flex-col items-center p-4 rounded-3xl transition-all ${isBlueWin ? 'bg-blue-50 ring-4 ring-blue-200 scale-105' : 'opacity-60'}`}>
                        <span className="text-sm font-black text-blue-400 mb-1">나</span>
                        <span className="text-5xl font-black text-blue-500 tabular-nums">{blueScore}</span>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="space-y-8 sm:space-y-9">
                    {/* 1. 다시하기 */}
                    <ChunkyButton
                        icon={RefreshCw}
                        variant='error'
                        className='w-full'
                        onClick={playAgain}
                    >
                        다시 대결하기
                    </ChunkyButton>

                    {/* 2. 하단 보조 버튼 */}
                    {/* 하단 닫기 버튼 */}
                    <button
                        onClick={() => navigate("/")}
                        className="text-gray-400 font-bold hover:text-purple-400 transition-all hover:scale-110 active:scale-95 flex items-center justify-center mx-auto gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 transition-colors group-hover:text-purple-500" />
                        <span>나가기</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlipBattleResultModal;