import { useEffect, useRef, useState } from "react";
import type { Kid } from "../types/Kid"
import { motion } from "framer-motion";
import { HelpCircle, RefreshCw, Timer } from "lucide-react";

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

//난이도, 넓이별 그리드
const GRID_CONFIG = {
    EASY: "grid-cols-4 gap-2 px-3 max-w-lg sm:gap-4",
    NORMAL: "grid-cols-5 gap-2 px-3 max-w-xl sm:gap-3",
    HARD: "grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-4 px-3 md:px-4 max-w-7xl"
}

//닌이도 별 아이들 수, 가로 배열, 카운트 다운, 힌트 시간
const DIFFICULTY_CONFIG = {
    EASY: { kids: 6, cols: 4, rows: 3, countdown: 10, hintTime: 1 },
    NORMAL: { kids: 10, cols: 5, rows: 4, countdown: 15, hintTime: 2 },
    HARD: { kids: 15, cols: 10, rows: 3, countdown: 15, hintTime: 3 },
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

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
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
    // 1. 틀린 카드들을 저장할 상태 추가 (애니메이션 적용 대상)
    const [wrongCards, setWrongCards] = useState<Card[]>([]);
    // 처음 카운트 다운
    const [countDown, setCountDown] = useState<string | null>(null);
    const countDownRef = useRef<number | null>(null);
    // 플레이타임
    const [playTime, setPlayTime] = useState(0);
    const playTimerRef = useRef<number | null>(null);
    // 힌트 사용 횟수
    const [hintCount, setHintCount] = useState(0);

    // [중요] 컴포넌트 언마운트 시 모든 타이머 정리
    useEffect(() => {
        return () => {
            stopPlayTimer();
            stopCountDown();
        };
    }, []);


    // 게임 셋업
    const setupGame = async (selectedDiffi: Difficulty) => {

        //1. 로딩 적용 및 난이도 업데이트
        setIsClear(false);
        setStatus('LOADING');
        setDifficulty(selectedDiffi);
        setFlippedCards([]);
        setIsLock(true);
        setWrongCards([]);
        setPlayTime(0);
        //타이머 초기화
        stopPlayTimer();
        stopCountDown();

        //2. 랜덤 n명 뽑기
        const randomKids = shuffleCards(kids).slice(0, DIFFICULTY_CONFIG[selectedDiffi].kids);

        //3. 추출된 아이들로 카드 쌍 만들기 (총 kids * 2장)
        const pairCards: Card[] = randomKids.flatMap((kid) => [
            { instanceId: `${kid.id}-a`, kid, isFlipped: true, isMatched: false },
            { instanceId: `${kid.id}-b`, kid, isFlipped: true, isMatched: false }
        ]);

        // 4. 카드 섞기
        const shuffledCards = shuffleCards(pairCards);
        // 5. 이미지 미리 로드
        await preloadImages(randomKids.map((kid) => kid.imagePath));
        // 6. 카드 업데이트
        setCards(shuffledCards);
        await waitForPaint();
        // 7. 로딩 끝
        setStatus('PLAYING');
        // 8. 외우기 카운트 다운
        startCountDown(DIFFICULTY_CONFIG[selectedDiffi].countdown);
    };

    //카운트 다운
    const startCountDown = (count: number) => {
        // 1. 이미 실행 중인 카운트다운이 있다면 제거 (중복 방지)
        stopCountDown();

        let currentCount = count;
        setCountDown(currentCount.toString());

        countDownRef.current = window.setInterval(() => {
            currentCount--;

            if (currentCount <= 0) {
                stopCountDown(); // 타이머 종료
                setCountDown("시작!");

                setTimeout(() => {
                    setCountDown(null);
                    setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
                    setIsLock(false);
                    startPlayTimer(); // 게임 타이머 시작
                }, 500);
                return;
            }

            setCountDown(currentCount.toString());
        }, 1000);
    };

    // 카운트다운 정지 함수
    const stopCountDown = () => {
        if (countDownRef.current) {
            clearInterval(countDownRef.current);
            countDownRef.current = null;
        }
    };

    //플레이 타임 타이머 작동
    const startPlayTimer = () => {
        stopPlayTimer();

        setPlayTime(0);

        playTimerRef.current = window.setInterval(() => {
            setPlayTime(prev => prev + 1);
        }, 1000);
    };

    //플레이 타이머 정지
    const stopPlayTimer = () => {
        if (playTimerRef.current) {
            clearInterval(playTimerRef.current);
            playTimerRef.current = null;
        }
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
                // 정답 (Matched 상태로 변경, 클리어 판별)
                handleMatch(firstCard, secondCard);
            } else {
                // 오답
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

        setTimeout(() => {
            setCards(updatedCards);
            resetTurn();

            //2. 클리어 판별
            if (updatedCards.every(card => card.isMatched)) {
                stopPlayTimer();
                setTimeout(() => setIsClear(true), 600);
            }
        }, 600);
    };

    // 오답 처리 함수
    const handleMismatch = (first: Card, second: Card) => {
        //틀린 카드 상태 저장
        setTimeout(() => {
            setWrongCards([first, second]);
        }, 600);

        //1초 뒤 다시 뒤집기
        setTimeout(() => {
            setCards(prev => prev.map(card =>
                (card.instanceId === first.instanceId || card.instanceId === second.instanceId)
                    ? { ...card, isFlipped: false } : card
            ));
            resetTurn();
        }, 1200);
    };

    //턴 초기화
    const resetTurn = () => {
        setFlippedCards([]);
        setIsLock(false);
        setWrongCards([]);
    };

    //힌트 클릭
    const handleHintClick = () => {

        // 클릭 무시 조건
        if (isLock) return;
        // 턴 초기화
        resetTurn();
        //클릭 막기
        setIsLock(true);

        //힌트 사용 횟수 증가
        setHintCount(hintCount + 1);

        // 1. 모든 카드 앞면으로 뒤집기 
        setCards(prev => prev.map(card => ({
            ...card,
            isFlipped: true
        })));

        // 2. 2초 뒤에 다시 덮기
        setTimeout(() => {
            setCards(prev => prev.map(card => ({
                ...card,
                isFlipped: card.isMatched ? true : false // 맞춘 카드만 앞면 유지
            })));
            setIsLock(false); // 다시 클릭 가능하게 풀기
        }, 2000);
    }


    return (
        <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center justify-center min-h-screen">

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
                <div className="flex flex-col items-center w-full min-h-full">



                    <div className="title-area text-center py-4 mb-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-500 tracking-tight drop-shadow-sm">
                                햇살반 <span className="text-purple-700">친구 찾기 놀이</span>
                            </h1>
                            <p className="sm:text-lg md:text-xl">"카드 속에 누가 숨었을까? 🧐"</p>
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4 md:gap-8 mb-4 sm:text-lg md:text-xl font-bold text-slate-700">
                        <div className="flex items-center justify-start">
                            <Timer className="mr-2 text-blue-500" />
                            시간: <span className="ml-2 text-blue-600 tabular-nums">{playTime}</span>초
                        </div>

                        <div className="flex items-center justify-start">
                            <HelpCircle className="mr-2 text-amber-500" />
                            힌트: <span className="ml-2 text-amber-600 tabular-nums">{hintCount}</span>번
                        </div>
                    </div>

                    {/* --- [여기서부터 카드 영역 시작] --- */}
                    <div className="relative w-full flex justify-center items-center">
                        {/* 카드 판 */}
                        <div
                            className={`grid justify-center w-full ${GRID_CONFIG[difficulty]}`}
                        >
                            {cards.map((card) => {
                                const isWrong = wrongCards.some(wc => wc.instanceId === card.instanceId);
                                return (
                                    <div
                                        key={card.instanceId}
                                        onClick={() => handleCardClick(card)}
                                        className={`card ${isWrong ? "wrong" : ""}`}
                                    >
                                        <div className={`card-inner ${card.isFlipped || card.isMatched ? "flipped" : ""}`}>
                                            {/* 뒷면 (물음표) */}
                                            <div className="card-back">
                                                <span className="text-white text-3xl sm:text-5xl font-bold">?</span>
                                            </div>

                                            {/* 앞면 (사진) */}
                                            <div className={`card-front ${card.isMatched ? "matched" : ""}`}>
                                                <div className="relative w-full flex-1 min-h-0 overflow-hidden rounded-[0.5em]">
                                                    <img
                                                        src={card.kid.imagePath}
                                                        alt={card.kid.name}
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                </div>
                                                {/* 이름이 너무 길면 깨질 수 있으니 텍스트 크기 조절 */}
                                                <p className="text-center mt-1 font-bold text-slate-700 text-xs sm:text-sm truncate w-full">
                                                    {card.kid.name}
                                                </p>

                                                {/* 정답일 때 나타나는 체크 표시 뱃지 */}
                                                {card.isMatched && (
                                                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg badge-appear">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 1. 카운트다운 숫자가 이 영역의 정중앙에 옵니다 */}
                        {countDown && (
                            <div className="absolute inset-0 flex items-center justify-center z-[50] pointer-events-none">
                                <motion.span
                                    key={countDown}
                                    initial={{ scale: 1.8, opacity: 0, filter: "blur(10px)" }}
                                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                                    /* 숫자가 너무 크면 카드 영역을 넘어가므로 살짝 줄였습니다 */
                                    className="text-[6rem] md:text-[11rem] font-black text-pink-500 drop-shadow-[0_0_20px_white]"
                                >
                                    {countDown}
                                </motion.span>
                            </div>
                        )}
                    </div>

                    {/* 하단 버튼 */}
                    <div className="flex gap-5 md:gap-8 mt-6 p-4 w-full justify-center">
                        <button onClick={() => setupGame(difficulty)}
                            className="p-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-lg md:tex-xl lg:text-2xl rounded-2xl font-semibold shadow-[0_10px_20px_rgba(124,58,237,0.3)] hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.95] flex items-center justify-center cursor-pointer">
                            <RefreshCw className="mr-2" />다시 하기
                        </button>

                        <button onClick={() => handleHintClick()}
                            className="p-3 px-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-lg md:tex-xl lg:text-2xl rounded-2xl font-semibold shadow-[0_10px_20px_rgba(245,158,11,0.3)] hover:from-amber-500 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.95] flex items-center justify-center cursor-pointer">
                            <HelpCircle className="mr-2" />힌트 보기
                        </button>
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