import { useNavigate } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import type { Difficulty } from "./FlipCardGamePage";
import ChunkyButton from "../components/ChunkyButton";
import { Baby, Star, Trophy } from "lucide-react";

export default function FlipCardSettingPage() {

    //네비게이션
    const navigate = useNavigate();

    //홈으로 이동
    const handleGoHome = () => {
        navigate('/');
    }

    //난이도 선택 -> url이동
    const handleSelectDifficulty = (difficulty : Difficulty) =>{
        navigate(`/flip-card/${difficulty.toLowerCase()}`);
    }

    return (
     <div className="bg-gradient-to-tr from-rose-50/40 via-fuchsia-50/30 to-indigo-50/40 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">
            {/* 서브헤더 */}
            <SubHeader title="카드 뒤집기 - 햇살반"/>

           {/* 메인 영역 */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md">
                
                {/* 안내 문구 애니메이션 (framer-motion이 있다면 감싸주면 더 좋아요) */}
                {/* <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-3 text-slate-700 drop-shadow-sm">
                        난이도를 골라보세요!
                    </h2>
                </div> */}

                {/* 난이도 버튼 그룹 */}
                <div className="flex flex-col gap-10 w-full">
                    
                    {/* 쉬움: 초록색(Success) - 편안함 */}
                    <ChunkyButton
                        variant="success"
                        size="xl"
                        icon={Baby}
                        onClick={() => handleSelectDifficulty('EASY')}
                    >
                        쉬움 <span className="text-base md:text-xl opacity-90 ml-1">(6명)</span>
                    </ChunkyButton>

                    {/* 보통: 주황색(Warning) - 활기참 */}
                    <ChunkyButton
                        variant="warning"
                        size="xl"
                        icon={Star}
                        onClick={() => handleSelectDifficulty('NORMAL')}
                    >
                        보통 <span className="text-base md:text-xl opacity-90 ml-1">(10명)</span>
                    </ChunkyButton>

                    {/* 어려움: 보라색(Secondary) - 도전적 */}
                    <ChunkyButton
                        variant="error"
                        size="xl"
                        icon={Trophy}
                        onClick={() => handleSelectDifficulty('HARD')}
                    >
                        어려움 <span className="text-base md:text-xl opacity-90 ml-1">(15명)</span>
                    </ChunkyButton>

                </div>

                {/* 하단 장식 (선택 사항) */}
                {/* <div className="mt-12 text-pink-300">
                    현재 등록된 친구는 "15명" 입니다.
                </div> */}

            </main>
            
        </div>
    );
}