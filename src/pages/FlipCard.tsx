import { useState } from "react";
import type { Kid } from "../types/Kid"

//상태, 난이도
type GameStatus = 'SETTING' | 'LOADING' | 'PLAYING';
type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

//카드 타입
export type Card = {
    instanceId: string;
    kid: Kid;
    isFlipped: boolean;
    isMatched: boolean;
}

//닌이도 별 아이들 수, 가로 배열, 카운트 다운, 힌트 시간
const DIFFICULTY_CONFIG = {
    EASY: { kids: 6, cols: 4, countdown: 10, hintTime: 1 },
    NORMAL: { kids: 10, cols: 5, countdown: 15, hintTime: 2 },
    HARD: { kids: 15, cols: 10, countdown: 20, hintTime: 3 },
}

//임시 아이들 목록
const kids: Kid[] = [
    { id: "1", name: "홍길동", imagePath: "/images/1.jpg" },
    { id: "2", name: "김철수", imagePath: "/images/2.jpg" },
    { id: "3", name: "이영희", imagePath: "/images/3.jpg" },
    { id: "4", name: "박민수", imagePath: "/images/4.jpg" },
    { id: "5", name: "최서윤", imagePath: "/images/5.jpg" },
    { id: "6", name: "윤도현", imagePath: "/images/6.jpg" },
    { id: "7", name: "한지민", imagePath: "/images/7.jpg" },
    { id: "8", name: "강하늘", imagePath: "/images/8.jpg" },
    { id: "9", name: "정예준", imagePath: "/images/9.jpg" },
    { id: "10", name: "조아라", imagePath: "/images/10.jpg" },
    { id: "11", name: "임시아", imagePath: "/images/11.jpg" },
    { id: "12", name: "송지후", imagePath: "/images/12.jpg" },
    { id: "13", name: "오하린", imagePath: "/images/13.jpg" },
    { id: "14", name: "권우진", imagePath: "/images/14.jpg" },
    { id: "15", name: "신유나", imagePath: "/images/15.jpg" },
];

//카드 섞는 함수
function shuffleCards<T>(array: T[]): T[] {
    const copied = [...array];

    for (let i = copied.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copied[i], copied[j]] = [copied[j], copied[i]];
    }

    return copied;
}

//이미지 미리 로딩
function preloadImages(imagePaths: string[]): Promise<void[]> {
    return Promise.all(
        imagePaths.map(
            (path) =>
                new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = path;
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); //실패시에도 일단 진행
                })
        )
    );
}


export default function FlipCard() {

    //현재 상태 - 난이도 선택 -> 로딩 -> 실행
    const [status, setStatus] = useState<GameStatus>('SETTING');
    //난이도 - EASY, NORMAL, HARD
    const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
    //카드
    const [cards, setCards] = useState<Card[]>([]);


    // 게임 셋업
    const setupGame = async (selectedDiffi: Difficulty) => {

        //1. 로딩 적용 및 난이도 업데이트
        setStatus('LOADING');
        setDifficulty(selectedDiffi);

        //2. 랜덤 n명 뽑기
        const randomKids = shuffleCards(kids).slice(0, DIFFICULTY_CONFIG[selectedDiffi].kids);

        //3. 추출된 아이들로 카드 쌍 만들기 (총 kids * 2장)
        const pairCards: Card[] = randomKids.flatMap((kid) => [
            { instanceId: `${kid.id}-a`, kid, isFlipped: false, isMatched: false },
            { instanceId: `${kid.id}-b`, kid, isFlipped: false, isMatched: false }
        ]);

        // 4. 카드 섞기
        const shuffledCards = shuffleCards(pairCards);
        // 5. 이미지 미리 로드
        await preloadImages(randomKids.map((kid) => kid.imagePath));
        // 6. 카드 업데이트
        setCards(shuffledCards);
        // 7. 로딩 끝
        setStatus('PLAYING');
    };




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
                                onClick={() => setupGame(diffi)}
                                className="py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-lg"
                            >
                                {diffi === 'EASY' ? '쉬움 (6명)' : diffi === 'NORMAL' ? '보통 (10명)' : '어려움 (15명)'}
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
                <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: `repeat(${DIFFICULTY_CONFIG[difficulty].cols}, minmax(0, 1fr))` }}
                >
                    {cards.map((card) => (
                        <div
                            key={card.instanceId}
                            className="bg-white rounded-2xl shadow p-4 aspect-[3/4] flex items-center justify-center"
                        >
                            <img
                                src={card.kid.imagePath}
                                alt={card.kid.name}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}