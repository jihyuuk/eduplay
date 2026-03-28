import { useNavigate } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import type { Difficulty } from "./FlipCardGamePage";

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
      <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen">
            <div className="w-full shrink-0">
                <SubHeader title="짝 맞추기 - 난이도 선택" onBack={handleGoHome} />
            </div>

            {/* 화면 중앙 정렬을 위한 래퍼 */}
            <main className="flex-1 flex flex-col items-center justify-center w-full p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full">
                    <h2 className="text-2xl font-bold mb-6 text-slate-700">난이도를 골라보세요!</h2>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => handleSelectDifficulty('EASY')}
                            className="py-4 rounded-2xl border-2 border-slate-200 hover:border-pink-400 hover:bg-pink-50 transition-all font-bold text-lg text-slate-600 hover:text-pink-500"
                        >
                            쉬움 (6명)
                        </button>
                        <button
                            onClick={() => handleSelectDifficulty('NORMAL')}
                            className="py-4 rounded-2xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all font-bold text-lg text-slate-600 hover:text-purple-500"
                        >
                            보통 (10명)
                        </button>
                        <button
                            onClick={() => handleSelectDifficulty('HARD')}
                            className="py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all font-bold text-lg text-slate-600 hover:text-blue-500"
                        >
                            어려움 (15명)
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}