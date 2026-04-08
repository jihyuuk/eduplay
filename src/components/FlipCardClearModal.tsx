import React, { useEffect } from 'react'; // useEffect 추가
import { Timer, HelpCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import ChunkyButton from './ChunkyButton';
import { ConfettiCanvas } from './ConfettiCanvas';
import { useNavigate } from 'react-router-dom';

interface ResultModalProps {
    playTime: number;
    hintCount: number;
    description: string;
    playAgain: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ playTime, hintCount, description, playAgain }) => {

    // 💡 스크롤 방지 로직: 모달이 떠 있을 때 뒷배경 스크롤을 막습니다.
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const navigate = useNavigate();

    const goHome = () => {
        navigate("/", { replace: true });
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[200] px-4">

            <ConfettiCanvas />

            {/* 배경 레이어 (Backdrop) */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* 모달 본체: 모바일 대응 (p-6, max-w-[320px], text-sm/lg 등 적용) */}
            <div className="relative bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl max-w-[340px] sm:max-w-sm w-full mx-auto text-center border-4 border-pink-200 animate-in fade-in zoom-in duration-300">

                {/* 상단 축하 섹션 */}
                <div className="mb-4 sm:mb-6">
                    <span className="text-5xl sm:text-6xl inline-block animate-bounce" role="img" aria-label="축하">🎉</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mt-3 sm:mt-4">최고예요!</h2>
                    <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">{description}</p>
                </div>

                {/* 결과 리포트 섹션 */}
                <div className="bg-rose-50 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center text-lg sm:text-xl">
                        <div className="flex items-center text-slate-600">
                            <Timer className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                            <span>걸린 시간</span>
                        </div>
                        <span className="font-bold text-blue-600">{playTime}초</span>
                    </div>

                    <div className="flex justify-between items-center text-lg sm:text-xl">
                        <div className="flex items-center text-slate-600">
                            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-amber-500" />
                            <span>힌트 사용</span>
                        </div>
                        <span className="font-bold text-amber-600">{hintCount}번</span>
                    </div>
                </div>

                <div className="space-y-8 sm:space-y-9">
                    {/* 1. 다시하기 */}
                    <ChunkyButton
                        icon={RefreshCw}
                        variant='error'
                        className='w-full'
                        onClick={playAgain}
                    >
                        한 번 더 하기
                    </ChunkyButton>

                    {/* 2. 하단 보조 버튼 */}
                    {/* 하단 닫기 버튼 */}
                    <button
                        onClick={goHome}
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

export default ResultModal;