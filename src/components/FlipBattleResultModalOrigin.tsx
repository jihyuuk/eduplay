import React, { useEffect } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react'; // 아이콘 추가
import ChunkyButton from './ChunkyButton';
import { ConfettiCanvas } from './ConfettiCanvas';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ResultModalProps {
    redScore: number;   // 빨간색 점수 추가
    blueScore: number;  // 파란색 점수 추가
    description: string;
    playAgain: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ redScore, blueScore, description, playAgain }) => {

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
            <ConfettiCanvas />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div className="relative bg-white rounded-[3rem] p-6 sm:p-10 shadow-2xl max-w-[400px] w-full mx-auto text-center border-8 border-purple-100 animate-in fade-in zoom-in duration-300">
                
                {/* 우승 텍스트 섹션 */}
                <div className="mb-6">
                    <div className="relative inline-block">
                        <span className="text-6xl sm:text-7xl" role="img">
                            {isDraw ? "🤝" : isBlueWin ? "🏆" : "🔥"}
                        </span>
                        {/* 승리했을 때 위에 왕관 씌우기 */}
                        {isBlueWin && (
                            <motion.div 
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-4 -right-2 text-3xl"
                            >
                                👑
                            </motion.div>
                        )}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-4 tracking-tight">
                        {isDraw ? "무승부예요!" : isBlueWin ? "파란팀 승리!" : "빨간팀 승리!"}
                    </h2>
                    <p className="text-slate-500 font-bold mt-2">{description}</p>
                </div>

                {/* 대결 스코어 보드 디자인 */}
                <div className="flex items-center justify-between gap-4 mb-8 bg-slate-50 p-6 rounded-[2.5rem] border-4 border-slate-100">
                    
                    {/* 빨간팀 */}
                    <div className={`flex-1 flex flex-col items-center p-4 rounded-3xl transition-all ${!isBlueWin && !isDraw ? 'bg-red-50 ring-4 ring-red-200 scale-105' : 'opacity-60'}`}>
                        <span className="text-sm font-black text-red-400 mb-1">빨간팀</span>
                        <span className="text-5xl font-black text-red-500 tabular-nums">{redScore}</span>
                    </div>

                    <div className="text-2xl font-black text-slate-300 italic">VS</div>

                    {/* 파란팀 */}
                    <div className={`flex-1 flex flex-col items-center p-4 rounded-3xl transition-all ${isBlueWin ? 'bg-blue-50 ring-4 ring-blue-200 scale-105' : 'opacity-60'}`}>
                        <span className="text-sm font-black text-blue-400 mb-1">파란팀</span>
                        <span className="text-5xl font-black text-blue-500 tabular-nums">{blueScore}</span>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="space-y-6">
                    <ChunkyButton
                        icon={RefreshCw}
                        variant={isBlueWin ? 'warning' : 'error'}
                        className='w-full text-xl py-5 shadow-[0_8px_0_0_rgba(0,0,0,0.1)]'
                        onClick={playAgain}
                    >
                        다시 대결하기
                    </ChunkyButton>

                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center justify-center mx-auto gap-2 text-slate-400 font-bold hover:text-purple-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>처음으로 돌아가기</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;