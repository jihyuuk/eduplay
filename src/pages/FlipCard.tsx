import { useEffect, useRef, useState } from "react";
import type { Kid } from "../types/Kid"
import { motion } from "framer-motion";
import { HelpCircle, RefreshCw, Timer } from "lucide-react";
import GameCard from "../components/GameCard";
import LoadingShuffle from "../components/LoadingShuffle";
import LoadingShuffle2 from "../components/LoadingShuffle-2";
import LoadingShuffle3 from "../components/LoadingShuffle-3";
import LoadingShuffle4 from "../components/LoadingShuffle-4";
import LoadingShuffle5 from "../components/LoadingShuffle-5";

//상태, 난이도
type GameStatus = 'SETTING' | 'LOADING' | 'PLAYING';
type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

//카드 타입
export type Card = {
    instanceId: string;
    kid: Kid;
}

//난이도, 넓이별 그리드
const GRID_CONFIG = {
    EASY: "grid-cols-4 gap-2 px-3 max-w-lg sm:gap-4",
    NORMAL: "grid-cols-5 gap-2 px-3 max-w-xl sm:gap-3",
    HARD: "grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-4 px-3 md:px-4 max-w-7xl"
}

//닌이도 별 아이들 수, 가로 배열, 카운트 다운, 힌트 시간
const DIFFICULTY_CONFIG = {
    EASY: { kids: 6, cols: 4, rows: 3, countdown: 10, hintTime: 1000 },
    NORMAL: { kids: 10, cols: 5, rows: 4, countdown: 15, hintTime: 1500 },
    HARD: { kids: 15, cols: 10, rows: 3, countdown: 15, hintTime: 2000 },
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

//랜더링 기다리기
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
    //카드 클릭 가능 여부
    const [isLock, setIsLock] = useState(false);

    //현재 상태 - 난이도 선택 -> 로딩 -> 실행
    const [status, setStatus] = useState<GameStatus>('SETTING');
    //난이도 - EASY, NORMAL, HARD
    const [difficulty, setDifficulty] = useState<Difficulty>('EASY');

    //카드
    const [cards, setCards] = useState<Card[]>([]);
    // Set 기반 상태
    const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());


    // 처음 카운트 다운
    const [countDown, setCountDown] = useState<string | null>(null);
    const countDownRef = useRef<number | null>(null);
    // 플레이타임
    const [playTime, setPlayTime] = useState(0);
    const playTimerRef = useRef<number | null>(null);
    // 힌트 사용 횟수
    const [hintCount, setHintCount] = useState(0);

    // 모든 setTimeout 이걸로 대신 관리
    const timeoutRefs = useRef<number[]>([]);

    //타이머 등록
    const addTimeout = (callback: () => void, delay: number) => {
        const id = window.setTimeout(() => {
            // 실행 끝난 timeout은 배열에서 제거
            timeoutRefs.current = timeoutRefs.current.filter(timeoutId => timeoutId !== id);
            callback();
        }, delay);

        timeoutRefs.current.push(id);
        return id;
    };
    //전체 타이머 초기화
    const clearAllTimeouts = () => {
        timeoutRefs.current.forEach(id => clearTimeout(id));
        timeoutRefs.current = [];
    };


    // [중요] 컴포넌트 언마운트 시 모든 타이머 정리
    useEffect(() => {
        return () => {
            stopPlayTimer();
            stopCountDown();
            clearAllTimeouts();
        };
    }, []);

    //전체 변수 초기화
    const resetAll = () => {
        setIsClear(false);
        setFlippedIds(new Set());
        setMatchedIds(new Set());
        setWrongIds(new Set());
        setIsLock(true);
        setPlayTime(0);
        setCountDown(null);
        //타이머 초기화
        stopPlayTimer();
        stopCountDown();
        clearAllTimeouts();
    }

    // 게임 셋업
    const setupGame = async (selectedDiffi: Difficulty) => {

        //1. 로딩 적용 및 초기화
        setStatus('LOADING');
        resetAll();
        setDifficulty(selectedDiffi);

        //2. 랜덤 n명 뽑기
        const randomKids = shuffleCards(kids).slice(0, DIFFICULTY_CONFIG[selectedDiffi].kids);

        //3. 추출된 아이들로 카드 쌍 만들기 (총 kids * 2장)
        const pairCards: Card[] = randomKids.flatMap((kid) => [
            { instanceId: `${kid.id}-a`, kid },
            { instanceId: `${kid.id}-b`, kid }
        ]);

        // 4. 처음엔 앞면 보여주기
        setFlippedIds(new Set(pairCards.map(card => card.instanceId)))
        // 5. 카드 섞기
        const shuffledCards = shuffleCards(pairCards);
        // 6. 이미지 미리 로드
        await preloadImages(randomKids.map((kid) => kid.imagePath));
        // 7. 카드 업데이트
        setCards(shuffledCards);
        // 8. 랜더링 기다리기
        await waitForPaint();
        // 9. 로딩 끝
        //setStatus('PLAYING');
        // 20. 외우기 카운트 다운
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

                addTimeout(() => {
                    setCountDown(null);
                    setFlippedIds(new Set());
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
        if (isLock || flippedIds.has(clickedCard.instanceId) || matchedIds.has(clickedCard.kid.id) || flippedIds.size === 2) return;

        //2. 예전에 뒤집힌 카드
        const prevFlipped = [...flippedIds];

        //3. 클릭된 카드 뒤집기
        setFlippedIds(prev => {
            const next = new Set(prev);
            next.add(clickedCard.instanceId);
            return next;
        });

        //4. 예전에 뒤집힌 카드 있으면 즉, 현재 뒤집힌 카드가 2개면
        if (prevFlipped.length === 1) {
            const first = cards.find(c => c.instanceId === prevFlipped[0])!;
            const second = clickedCard;

            setIsLock(true);

            if (first.kid.id === second.kid.id) {
                handleMatch(first);
            } else {
                handleMismatch(first, second);
            }
        }

    };

    // 정답 처리 함수
    const handleMatch = (card: Card) => {

        addTimeout(() => {
            //클리어 판별
            const isClearGame = (matchedIds.size + 1) === (cards.length / 2)

            // matched 추가
            setMatchedIds(prev => {
                const next = new Set(prev);
                next.add(card.kid.id);
                return next;
            });

            // flipped 제거 (선택사항, 안 해도 matched가 앞면 유지함 - resetTurn)
            resetTurn();

            //2. 클리어 효과
            if (isClearGame) {
                stopPlayTimer();
                addTimeout(() => setIsClear(true), 600);
            }

        }, 600);
    };

    // 오답 처리 함수
    const handleMismatch = (first: Card, second: Card) => {
        //틀린 카드 상태 저장
        addTimeout(() => {
            setWrongIds(new Set([first.instanceId, second.instanceId]));
        }, 600);

        //1초 뒤 다시 뒤집기
        addTimeout(() => {
            resetTurn();
        }, 1200);
    };

    //턴 초기화
    const resetTurn = () => {
        setFlippedIds(new Set());
        setIsLock(false);
        setWrongIds(new Set());
    };

    //힌트 클릭
    const handleHintClick = () => {

        // 클릭 무시 조건
        if (isLock) return;
        // 턴 초기화
        resetTurn();
        //클릭 막기 - 무조건 resetTurn() 뒤에
        setIsLock(true);

        //힌트 사용 횟수 증가
        setHintCount(prev => prev + 1);

        // 전체 뒤집기 - 최적화
        setFlippedIds(new Set(cards.map(card => card.instanceId)));

        // 2. n초 뒤에 다시 덮기
        addTimeout(() => {
            setFlippedIds(new Set());
            setIsLock(false); // 다시 클릭 가능하게 풀기
        }, DIFFICULTY_CONFIG[difficulty].hintTime);
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
            {/* {status === 'LOADING' && (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl font-bold text-slate-700">카드를 섞고 있어요...</p>
                    <p className="text-slate-400">잠시만 기다려주세요!</p>
                </div>
            )} */}

            {/* {status === 'LOADING' && (
                <div className="flex flex-col items-center w-full min-h-full">
                    <div className="title-area text-center py-4 mb-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-500 tracking-tight drop-shadow-sm">
                                햇살반 <span className="text-purple-700">친구 찾기 놀이</span>
                            </h1>
                            <p className="sm:text-lg md:text-xl">카드를 섞고 있어요... 🎴</p>
                        </div>
                    </div>

                    <div className="relative w-full flex justify-center items-center">
                        <div className={`grid justify-center w-full ${GRID_CONFIG[difficulty]}`}>
                            {Array.from({ length: DIFFICULTY_CONFIG[difficulty].kids * 2 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                        rotate: 0,
                                        x: 0,
                                        y: 0,
                                    }}
                                    // animate={{
                                    //     opacity: [0.7, 1, 0.85, 1],
                                    //     scale: [0.95, 1.03, 0.98, 1],
                                    //     rotate: [-4, 4, -2, 0],
                                    //     x: [0, -8, 8, 0],
                                    //     y: [0, 6, -6, 0],
                                    // }}
                                    animate={{
    opacity: [0.6, 1, 0.9],
    scale: [1, 0.92, 1],
    x: [0, (i % 2 === 0 ? -12 : 12), 0],
    y: [0, (i % 3 === 0 ? -10 : 10), 0],
    rotate: [0, (i % 2 === 0 ? -8 : 8), 0],
}}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.03,
                                    }}
                                    className="aspect-[3/4] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-400 via-pink-400 to-amber-300 shadow-md border-2 border-white/50 flex items-center justify-center"
                                >
                                    <span className="text-white text-3xl sm:text-5xl font-black drop-shadow-md">
                                        ?
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0.4, scale: 0.95 }}
                                animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
                            >
                                <p className="text-lg md:text-2xl font-bold text-slate-700">
                                    카드 섞는 중...
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            )} */}

            {status === 'LOADING' && (
    <div className="flex flex-col items-center w-full">
        <div className="text-center mb-8">
            <motion.p 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-2xl font-bold text-pink-600"
            >
                카드를 열심히 섞고 있어요! 🪄
            </motion.p>
            <p className="text-slate-500">누가 나올지 기대되지 않나요?</p>
        </div>

        {/* 실제 게임판과 동일한 그리드 설정을 사용하여 시각적 이질감을 줄입니다 */}
        <LoadingShuffle
            count={DIFFICULTY_CONFIG[difficulty].kids * 3} 
            gridConfig={GRID_CONFIG[difficulty]} 
        />
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
                                const isMatched = matchedIds.has(card.kid.id);
                                const isFlipped = flippedIds.has(card.instanceId) || isMatched;
                                const isWrong = wrongIds.has(card.instanceId);

                                return (
                                    <GameCard
                                        key={card.instanceId}
                                        card={card}
                                        isFlipped={isFlipped}
                                        isMatched={isMatched}
                                        isWrong={isWrong}
                                        onClick={handleCardClick}
                                    />
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
                            onClick={() => { setupGame(difficulty); }}
                            className="mt-4 px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold"
                        >
                            다시하기
                        </button>
                        <button
                            onClick={() => { resetAll(); setStatus('SETTING'); }}
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