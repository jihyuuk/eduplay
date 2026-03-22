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
    { id: "1", name: "기서윤", imagePath: "/images/giseoyun.jpg" },
    { id: "2", name: "김 단", imagePath: "/images/gim-dan.jpg" },
    { id: "3", name: "김로운", imagePath: "/images/gim-rowoon.jpg" },
    { id: "4", name: "김태린", imagePath: "/images/gim-taerin.jpg" },
    { id: "5", name: "김하윤", imagePath: "/images/gim-hayun.jpg" },
    { id: "6", name: "박시현", imagePath: "/images/park-sihyeon.jpg" },
    { id: "7", name: "손예령", imagePath: "/images/son-yeryeong.jpg" },
    { id: "8", name: "신희재", imagePath: "/images/sin-huijae.jpg" },
    { id: "9", name: "오성준", imagePath: "/images/oh-seongjun.jpg" },
    { id: "10", name: "윤태연", imagePath: "/images/yun-taeyeon.jpg" },
    { id: "11", name: "윤혜리", imagePath: "/images/yun-hyeri.jpg" },
    { id: "12", name: "이태연", imagePath: "/images/i-taeyeon.jpg" },
    { id: "13", name: "최시윤", imagePath: "/images/choi-siyun.jpg" },
    { id: "14", name: "최우담", imagePath: "/images/choi-udam.jpg" },
    { id: "15", name: "한서율", imagePath: "/images/han-seoyul.jpg" }
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

    //클리어 여부
    const [isClear, setIsClear] = useState(false);
    //현재 상태 - 난이도 선택 -> 로딩 -> 실행
    const [status, setStatus] = useState<GameStatus>('SETTING');
    //난이도 - EASY, NORMAL, HARD
    const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
    //카드
    const [cards, setCards] = useState<Card[]>([]);
    //뒤집힌 카드 - 최대 2개
    const [flippedCards, setFlippedCards] = useState<Card[]>([]);
    //카드 클릭 가능 여부
    const [isLock, setIsLock] = useState(false);


    // 게임 셋업
    const setupGame = async (selectedDiffi: Difficulty) => {

        //1. 로딩 적용 및 난이도 업데이트
        setStatus('LOADING');
        setDifficulty(selectedDiffi);
        resetTurn();
        setIsClear(false);

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


    //카드 뒤집기 
    const handleCardClick = (clickedCard: Card) => {

        //1. 클릭 무시 - 비교중, 이미 뒤집힘, 이미 맞춤, 이미 2장 이상 뒤집음
        if (isLock || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length === 2) return;

        // 2. 해당 카드의 isFlipped를 true로 변경 (UI 업데이트)
        setCards((prev) =>
            prev.map((card) =>
                card.instanceId === clickedCard.instanceId
                    ? { ...card, isFlipped: true }
                    : card
            )
        );

        // 3. 비교 로직 시작
        const newFlippedCards = [...flippedCards, clickedCard];

        if (newFlippedCards.length === 1) {
            // 첫 번째 카드를 뒤집은 경우
            setFlippedCards(newFlippedCards);

        } else if (newFlippedCards.length === 2) {
            // 두 번째 카드를 뒤집은 경우
            setIsLock(true); // 판정 끝날 때까지 클릭 잠금

            const [firstCard, secondCard] = newFlippedCards;

            if (firstCard.kid.id === secondCard.kid.id) {
                // 정답! (Matched 상태로 변경, 클리어 판별)
                handleMatch(firstCard, secondCard);
            } else {
                // 오답... (1초 뒤에 다시 덮기)
                handleMismatch(firstCard, secondCard);
            }
        }
    };

    // 정답 처리 함수
    const handleMatch = (first: Card, second: Card) => {
        //1. Matched로 상태 변경
        const updatedCards = cards.map(card =>
            card.kid.id === first.kid.id ? { ...card, isMatched: true } : card
        );

        setCards(updatedCards);
        resetTurn();

        //2. 클리어 판별
        if (updatedCards.every(card => card.isMatched)) {
            setTimeout(() => setIsClear(true), 600);
        }
    };

    // 오답 처리 함수
    const handleMismatch = (first: Card, second: Card) => {
        //1초 뒤 다시 뒤집기
        setTimeout(() => {
            setCards(prev => prev.map(card =>
                (card.instanceId === first.instanceId || card.instanceId === second.instanceId)
                    ? { ...card, isFlipped: false } : card
            ));
            resetTurn();
        }, 1000);
    };

    //뒤집기 초기화
    const resetTurn = () => {
        setFlippedCards([]);
        setIsLock(false);
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
                /* 1. 여기에 '울타리' 역할을 하는 부모 div를 추가합니다. */
                <div className="w-full max-w-[95vw] lg:max-w-6xl mx-auto p-4">
                    <div
                        className="grid gap-2 sm:gap-4 justify-center" // justify-center로 중앙 정렬
                        style={{
                            gridTemplateColumns: `repeat(${DIFFICULTY_CONFIG[difficulty].cols}, minmax(0, 1fr))`
                        }}
                    >
                        {cards.map((card) => (
                            <div
                                key={card.instanceId}
                                onClick={() => handleCardClick(card)}
                                className="card"
                            >
                                <div className={`card-inner ${card.isFlipped || card.isMatched ? "flipped" : ""}`}>
                                    {/* 뒷면 (물음표) */}
                                    <div className="card-back">
                                        <span className="text-white text-3xl sm:text-5xl font-bold">?</span>
                                    </div>

                                    {/* 앞면 (사진) */}
                                    <div className="card-front">
                                        <img
                                            src={card.kid.imagePath}
                                            alt={card.kid.name}
                                            className="w-full h-[80%] object-cover rounded-xl"
                                        />
                                        {/* 이름이 너무 길면 깨질 수 있으니 텍스트 크기 조절 */}
                                        <p className="text-center mt-1 font-bold text-slate-700 text-xs sm:text-sm truncate w-full">
                                            {card.kid.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4단계: 클리어 화면 */}
            {isClear && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
                        <h2 className="text-3xl font-bold mb-3">🎉 모두 맞췄어요!</h2>
                        <button
                            onClick={() => { setupGame(difficulty); setIsClear(false) }}
                            className="mt-4 px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold"
                        >
                            다시하기
                        </button>
                        <button
                            onClick={() => { setStatus('SETTING'); setIsClear(false) }}
                            className="mt-4 px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold"
                        >
                            난이도 선택
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}