import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, RotateCw, Timer } from "lucide-react";
import GameCard from "../components/GameCard";
import LoadingShuffle from "../components/LoadingShuffle";
import FlipCardClearModal from "../components/FlipCardClearModal";
import { useNavigate, useParams } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import ChunkyIconButton from "../components/ChunkyIconButton";
import ChunkyButton from "../components/ChunkyButton";
import type { GameKid } from "./FlipCardKidPage";

//상태
type GameStatus = 'LOADING' | 'PLAYING';

//난이도
type Difficulty = 'EASY' | 'NORMAL' | 'HARD';
const VALID_DIFFICULTIES: Difficulty[] = ['EASY', 'NORMAL', 'HARD'];

//카드 타입
type Card = {
    instanceId: string;
    kid: GameKid;
}

//난이도, 넓이별 그리드
const GRID_CONFIG = {
    EASY: "grid-cols-4 gap-2 px-3 max-w-lg sm:gap-4",
    NORMAL: "grid-cols-5 gap-2 px-3 max-w-xl sm:gap-3",
    HARD: "grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-4 px-3 md:px-4 max-w-7xl"
}

//닌이도 별 아이들 수, 가로 배열, 카운트 다운, 힌트 시간
const DIFFICULTY_CONFIG = {
    EASY: { kids: 6, cols: 4, rows: 3, countdown: 5, hintTime: 1000 },
    NORMAL: { kids: 10, cols: 5, rows: 4, countdown: 10, hintTime: 1500 },
    HARD: { kids: 15, cols: 10, rows: 3, countdown: 10, hintTime: 2000 },
}

const kids: GameKid[] = [
    { id: 1, name: "사과", imageUrl: "/fruits/apple.png" },
    { id: 2, name: "아보카도", imageUrl: "/fruits/avocado.png" },
    { id: 3, name: "바나나", imageUrl: "/fruits/banana.png" },
    { id: 4, name: "블루베리", imageUrl: "/fruits/blueberry.png" },
    { id: 5, name: "체리", imageUrl: "/fruits/cherry.png" },
    { id: 6, name: "코코넛", imageUrl: "/fruits/coconut.png" },
    { id: 7, name: "포도", imageUrl: "/fruits/grape.png" },
    { id: 8, name: "청포도", imageUrl: "/fruits/green-grape.png" },
    { id: 9, name: "키위", imageUrl: "/fruits/kiwi.png" },
    { id: 10, name: "망고", imageUrl: "/fruits/mango.png" },
    { id: 11, name: "멜론", imageUrl: "/fruits/melon.png" },
    { id: 12, name: "오렌지", imageUrl: "/fruits/orange.png" },
    { id: 13, name: "복숭아", imageUrl: "/fruits/peach.png" },
    { id: 14, name: "레몬", imageUrl: "/fruits/lemon.png" },
    { id: 15, name: "딸기", imageUrl: "/fruits/strawberry.png" },
    { id: 16, name: "수박", imageUrl: "/fruits/watermelon.png" },
    { id: 17, name: "파인애플", imageUrl: "/fruits/pineapple.png" },
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



export default function FlipCardFruitPage() {

    // 네비게이션
    const navigate = useNavigate();

    // url에서 난이도 가져오기
    const { difficultyParam } = useParams<{ difficultyParam: string }>();

    //난이도 - EASY, NORMAL, HARD
    const difficulty = (difficultyParam?.toUpperCase() as Difficulty) || 'EASY';
    // 헤더 제목 핸들러
    const headerTitle = `과일 뒤집기 (${difficulty === 'EASY' ? '쉬움' : difficulty === 'NORMAL' ? '보통' : '어려움'})`;


    // difficulty 값이 이상하면 튕겨내기 (방어 코드)
    useEffect(() => {
        const upperDifficulty = difficultyParam?.toUpperCase() as Difficulty;

        // 값이 없거나, 유효한 난이도가 아니면 튕겨냄
        if (!upperDifficulty || !VALID_DIFFICULTIES.includes(upperDifficulty)) {
            navigate('/', { replace: true });
            return;
        }

        // 검사를 무사히 통과했다면 게임 세팅!
        startGame();

    }, [difficultyParam]);

    // [중요] 컴포넌트 언마운트 시 모든 타이머 정리
    useEffect(() => {
        return () => {
            stopPlayTimer();
            stopCountDown();
            clearAllTimeouts();
        };
    }, []);


    // 게임 상태 관리
    const [status, setStatus] = useState<GameStatus>('LOADING');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isClear, setIsClear] = useState(false);
    const [isLock, setIsLock] = useState(true);

    // 카드 및 카드 상태 관리
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());

    // 카운트다운, 힌트 횟수, 플레이 시간
    const [countDown, setCountDown] = useState<string | null>(null);
    const [hintCount, setHintCount] = useState(0);
    const [playTime, setPlayTime] = useState(0);

    //버튼 상태 관리
    const [isHinting, setIsHinting] = useState(true);
    const [isStarting, setIsStarting] = useState(true);

    //타이머 관련 ref
    const timeoutRefs = useRef<number[]>([]); // 모든 setTimeout 이걸로 대신 관리
    const countDownRef = useRef<number | null>(null);
    const playTimerRef = useRef<number | null>(null);

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


    //전체 변수 초기화
    const resetAll = () => {
        //타이머 초기화
        clearAllTimeouts();
        stopPlayTimer();
        stopCountDown();

        //게임상태
        setStatus("LOADING");
        setIsDataLoaded(false);
        setIsClear(false);
        setIsLock(true);

        //카드 및 카드 상태
        setCards([]);
        setFlippedIds(new Set());
        setMatchedIds(new Set());
        setWrongIds(new Set());

        //버튼 상태 관리
        setIsHinting(true);
        setIsStarting(true);

        //카운트다운 및 플레이타임, 힌트
        setCountDown(null);
        setHintCount(0);
        setPlayTime(0);
    }

    // 게임 셋업
    const startGame = async () => {

        //1. 로딩 적용 및 초기화
        resetAll();

        //2. 랜덤 n명 뽑기
        const randomKids = shuffleCards(kids).slice(0, DIFFICULTY_CONFIG[difficulty].kids);

        //3. 추출된 아이들로 카드 쌍 만들기 (총 kids * 2장)
        const pairCards: Card[] = randomKids.flatMap((kid) => [
            { instanceId: `${kid.id}-a`, kid },
            { instanceId: `${kid.id}-b`, kid }
        ]);

        //4. 카드 섞기
        const shuffledCards = shuffleCards(pairCards);
        //5. 카드 업데이트
        setCards(shuffledCards);

        //6.실제 카드 랜더링 기다리기
        await Promise.all([
            preloadImages(randomKids.map((kid) => kid.imageUrl)), // 실제 데이터 로딩
            waitForPaint(),//  랜더링 기다리기
            new Promise((resolve) => setTimeout(resolve, 4000)),// 최소 대기 타이머
        ]);

        // 9. 로딩 끝
        setIsDataLoaded(true);

        // 10. 잠깐 딜레이 줬다가 시작 <- 안줘도 될 것 같기도
        //await new Promise((resolve) => setTimeout(resolve, 800));
        setStatus("PLAYING");

        // 11. 카드 앞면으로 뒤집기
        setFlippedIds(new Set(pairCards.map(card => card.instanceId)))

        //12. 1초 뒤 카운트 다운 시작
        addTimeout(() => {
            startCountDown(DIFFICULTY_CONFIG[difficulty].countdown);
        }, 1000);
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
                    setIsHinting(false);
                    setIsStarting(false);
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
        if (isLock || flippedIds.has(clickedCard.instanceId) || matchedIds.has(clickedCard.instanceId) || flippedIds.size === 2) return;

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
            setIsLock(true);

            const first = cards.find(c => c.instanceId === prevFlipped[0])!;
            const second = clickedCard;

            if (first.kid.id === second.kid.id) {
                handleMatch(first, second);
            } else {
                handleMismatch(first, second);
            }
        }

    };

    // 정답 처리 함수
    const handleMatch = (first: Card, second: Card) => {

        addTimeout(() => {
            //클리어 판별
            const isClearGame = matchedIds.size + 2 === cards.length;

            // matched 추가
            setMatchedIds(prev => {
                const next = new Set(prev);
                next.add(first.instanceId);
                next.add(second.instanceId);
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
        setIsHinting(true);

        //힌트 사용 횟수 증가
        setHintCount(prev => prev + 1);

        // 전체 뒤집기 - 최적화
        setFlippedIds(new Set(cards.map(card => card.instanceId)));

        // 2. n초 뒤에 다시 덮기
        addTimeout(() => {
            setFlippedIds(new Set());
            setIsLock(false); // 다시 클릭 가능하게 풀기
            setIsHinting(false);
        }, DIFFICULTY_CONFIG[difficulty].hintTime);
    }


    return (
        <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">

            {/* 서브헤더 */}
            <SubHeader
                title={headerTitle}
                rightElement={<ChunkyIconButton icon={RotateCw} iconSize={17} onClick={startGame} disabled={isStarting} />}
            />

            <main className="flex-1 flex flex-col items-center justify-center w-full p-4 relative">
                {/* 게임 지표 (시간, 힌트) - PLAYING 일때만 보임 */}
                <div className={`w-full transition-opacity duration-500 ${status === 'PLAYING' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-full grid grid-cols-2 gap-4 md:gap-8 mb-4 sm:text-lg md:text-xl font-bold text-slate-700">
                        <div className="flex items-center justify-end gap-2">
                            <Timer className="text-blue-500" />
                            <div>
                                시간: <span className="text-blue-600 tabular-nums font-sans">{playTime}</span>초
                            </div>
                        </div>

                        <div className="flex items-center justify-start gap-2">
                            <HelpCircle className="text-amber-500" />
                            <div>
                                힌트: <span className="text-amber-600 tabular-nums font-sans">{hintCount}</span>번
                            </div>
                        </div>
                    </div>
                </div>


                {/* 게임 컨텐츠 화면 */}
                <div className={`flex flex-col items-center w-full min-h-full transition-opacity duration-500`}>

                    {/* --- [여기서부터 카드 영역 시작] --- */}
                    <div className="relative w-full flex justify-center items-center">

                        {/* 가짜 로딩 카드 */}
                        {status === 'LOADING' && (
                            <>
                                {/* 실제 게임판과 동일한 그리드 설정을 사용하여 시각적 이질감을 줄입니다 */}
                                <LoadingShuffle
                                    count={DIFFICULTY_CONFIG[difficulty].kids * 2}
                                    gridConfig={GRID_CONFIG[difficulty]}
                                    isDataReady={isDataLoaded} />
                            </>
                        )}

                        {/* 카드 판 */}
                        <div
                            className={`grid justify-center w-full ${GRID_CONFIG[difficulty]}
                        ${status === 'PLAYING'
                                    ? 'opacity-100'
                                    : 'opacity-0 pointer-events-none absolute'
                                }`}
                        >
                            {cards.map((card) => {
                                const isMatched = matchedIds.has(card.instanceId);
                                const isFlipped = flippedIds.has(card.instanceId) || isMatched;
                                const isWrong = wrongIds.has(card.instanceId);

                                return (
                                    <GameCard
                                        key={card.instanceId}
                                        card={card}
                                        isFlipped={isFlipped}
                                        isMatched={isMatched}
                                        isWrong={isWrong}
                                        onPointerDown={handleCardClick}
                                    />
                                );
                            })}
                        </div>

                        {/* 카운트 다운 */}
                        {countDown && (
                            <div className="absolute inset-0 flex items-center justify-center z-[50] pointer-events-none">
                                <motion.span
                                    key={countDown}
                                    // initial={{ scale: 1.8, opacity: 0, filter: "blur(10px)" }}
                                    // animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                    //transition={{ type: "spring", stiffness: 250, damping: 20 }}
                                    //className="text-[6rem] md:text-[8rem] font-black text-pink-500 drop-shadow-[0_0_20px_white]"
                                    initial={{ scale: 1.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="text-[6rem] md:text-[8rem] font-black text-pink-500"
                                >
                                    {countDown}
                                </motion.span>
                            </div>
                        )}
                    </div>
                </div>


                {/* 하단 버튼 - PLAYING 일떄만 */}
                <div className={`mt-10 mb-5 transition-opacity duration-500 ${status === 'PLAYING' ? 'opacity-100' : 'opacity-0'} `}>
                    <ChunkyButton variant="warning" icon={HelpCircle} onClick={handleHintClick} disabled={isHinting}>
                        힌트 사용
                    </ChunkyButton>
                </div>
            </main>


            {/*  클리어 모달 */}
            {isClear && (
                <FlipCardClearModal
                    playTime={playTime}
                    hintCount={hintCount}
                    playAgain={startGame}//다시하기
                    description="새콤달콤 과일 찾기 성공!"
                />
            )}
        </div>
    );
}