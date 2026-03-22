import { useState } from "react";


type GameStatus = 'SETTING' | 'LOADING' | 'PLAYING';
type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

//닌이도별 아이들 수, 가로 배열, 카운트 다운, 힌트 시간
const DIFFICULTY_CONFIG = {
    EASY: { kids: 6, cols: 4, countdown: 10, hintTime: 1 },
    NORMAL: { kids: 10, cols: 5, countdown: 15, hintTime: 2 },
    HARD: { kids: 15, cols: 10, countdown: 20, hintTime: 3 },
}


export default function FlipCard() {

    //현재 상태 - 난이도 선택 -> 로딩 -> 실행
    const [status, setStatus] = useState<GameStatus>('SETTING');
    //난이도 - EASY, NORMAL, HARD
    const [difficulty, setDifficulty] = useState<Difficulty>('EASY');

    // 난이도 선택 후 로딩으로 넘어가는 함수
    const handleStart = (selectedDiffi: Difficulty) => {
        //난이도 적용 -> 상태 로딩 변경 -> 2초뒤 실행(임시)
        setDifficulty(selectedDiffi);
        setStatus('LOADING');

        setTimeout(() => {
            setStatus('PLAYING');
        }, 2000);
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            
            {/* 1단계: 난이도 선택 */}
            {status === 'SETTING' && (
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full">
                    <h2 className="text-2xl font-bold mb-6">난이도를 골라보세요!</h2>
                    <div className="flex flex-col gap-3">
                        {(['EASY', 'NORMAL', 'HARD'] as Difficulty[]).map((diffi) => (
                            <button
                                key={diffi}
                                onClick={() => handleStart(diffi)}
                                className="py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-lg"
                            >
                                {diffi === 'EASY' ? '쉬움 (3x4)' : diffi === 'NORMAL' ? '보통 (4x4)' : '어려움 (4x5)'}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 2단계: 로딩 화면 (준비 중...) */}
            {status === 'LOADING' && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl font-bold text-slate-700">카드를 섞고 있어요...</p>
                    <p className="text-slate-400">잠시만 기다려주세요!</p>
                </div>
            )}

            {/* 3단계: 실제 게임 화면 */}
            {status === 'PLAYING' && (
                <div className="w-full max-w-4xl">
                    <header className="flex justify-between items-center mb-6">
                        <button onClick={() => setStatus('SETTING')} className="text-slate-500 underline">그만하기</button>
                        <div className="font-bold text-blue-600">난이도: {difficulty}</div>
                    </header>
                    {/* 여기에 카드 그리드(Grid) 컴포넌트가 들어갑니다 */}
                    <div className="grid grid-cols-4 gap-4">
                        {/* 카드가 렌더링될 자리 */}
                    </div>
                </div>
            )}
        </div>
    );
}