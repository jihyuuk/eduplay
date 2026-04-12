import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, Timer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import ChunkyIconButton from "../components/ChunkyIconButton";
import GameCardBattle from "../components/GameCardBattle";
import FlipBattleResultModal from "../components/FlipBattleResultModal";

//상태
type GameStatus = 'LOADING' | 'PLAYING';

//난이도
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';
const VALID_DIFFICULTIES: Difficulty[] = ['EASY', 'NORMAL', 'HARD'];

//총 카드 갯수
const CARD_COUNT = 40;

//처음 카운트 다운
const COUNTDOWN = 5;

//남은 시간
const LEFT_TIME = 30;

//난이도 별 뒤집는 시간
const CPU_DELAY_CONFIG = {
    EASY: 600,
    NORMAL: 1000,
    HARD: 1000,
}

//난이도 별 뒤집기 개수
const CPU_FLIP_COUNT = {
    EASY: 1,
    NORMAL: 2,
    HARD: 3,
}

//랜덤으로 뒤집을 절반 함수
function pickRandomHalf() {
    const arr = Array.from({ length: CARD_COUNT }, (_, i) => i);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return new Set(arr.slice(0, CARD_COUNT / 2));
}

//그리드 설정 (총 40개)
const GRID_CONFIG = "grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4 px-3 md:px-4 max-w-7xl"



export default function FlipCardBattlePage() {

    // 네비게이션
    const navigate = useNavigate();

    // url에서 난이도 가져오기
    const { difficultyParam } = useParams<{ difficultyParam: string }>();

    //난이도 - EASY, NORMAL, HARD
    const difficulty = (difficultyParam?.toUpperCase() as Difficulty) || 'EASY';
    // 헤더 제목 핸들러
    const headerTitle = `뒤집기 대결 - ${difficulty === 'EASY' ? '쉬움' : difficulty === 'NORMAL' ? '보통' : '어려움'}`;


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
        return () => clearAllTimers();
    }, []);


    // 게임 상태 관리
    const [status, setStatus] = useState<GameStatus>('LOADING');
    const [isTimeOver, setIsTimeOver] = useState(false);
    const [isLock, setIsLock] = useState(true);

    // 카드 및 카드 상태 관리
    const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());

    // 카운트다운, 힌트 횟수, 플레이 시간
    const [countDown, setCountDown] = useState<string | null>(null);
    const [leftTime, setLeftTime] = useState(LEFT_TIME);

    //버튼 상태 관리
    const [isStarting, setIsStarting] = useState(true);

    //타이머 관련 ref
    const countDownRef = useRef<number | null>(null);
    const leftTimerRef = useRef<number | null>(null);
    const cpuTimerRef = useRef<number | null>(null);

    //게임 결과
    const [resultCount, setResultCount] = useState<Map<number, number>>(new Map());
    const [showResultModal, setShowResultModal] = useState(false);

    //게임 끝나고 결과 보기
    const resultCounting = async (flippedIds: Set<number>) => {

        const redCards = Array.from({ length: CARD_COUNT }, (_, i) => i).filter(id => !flippedIds.has(id));
        const blueCards = Array.from({ length: CARD_COUNT }, (_, i) => i).filter(id => flippedIds.has(id));

        const delay = 250;

        //빨간거 먼저 세기
        for (let i = 0; i < redCards.length; i++) {
            await new Promise(res => setTimeout(res, delay));
            const targetIdx = redCards[i];
            setResultCount(prev => new Map(prev).set(targetIdx, i + 1));
        }

        //파란거 세기
        for (let i = 0; i < blueCards.length; i++) {
            await new Promise(res => setTimeout(res, delay));
            const targetIdx = blueCards[i];
            setResultCount(prev => new Map(prev).set(targetIdx, i + 1));
        }

        await new Promise(res => setTimeout(res, delay));
        setShowResultModal(true);
    }


    //전체 변수 초기화
    const resetAll = () => {
        //타이머 초기화
        clearAllTimers();

        //게임상태
        setStatus("LOADING");
        setIsTimeOver(false);
        setIsLock(true);

        //카드 및 카드 상태
        setFlippedIds(new Set());

        //버튼 상태 관리
        setIsStarting(true);

        //카운트다운 및 플레이타임, 힌트
        setCountDown(null);
        setLeftTime(LEFT_TIME);

        //결과 초기화
        setResultCount(new Map());
        setShowResultModal(false);
    }

    // 게임 셋업
    const startGame = async () => {

        // 1. 로딩 적용 및 초기화
        resetAll();

        // 2. 랜덤 절반 뒤집기
        setFlippedIds(pickRandomHalf());

        // 3. 로딩 끝
        setStatus("PLAYING");

        // 4. 카운트 다운 시작
        startCountDown(COUNTDOWN);
    };

    //타이머 시작---------------------------
    //카운트 다운 시작
    const startCountDown = (count: number) => {
        // 1. 이미 실행 중인 카운트다운이 있다면 제거 (중복 방지)
        stopCountDown();

        let currentCount = count;
        setCountDown(count.toString());

        countDownRef.current = window.setInterval(() => {
            currentCount--;

            if (currentCount === 0) {
                setCountDown("시작!");
                return;
            }

            if (currentCount <= -1) {
                stopCountDown(); // 타이머 종료
                setCountDown(null);
                setIsLock(false);
                setIsStarting(false);
                startLeftTimer();
                startCpuTimer();
                return;
            }

            setCountDown(currentCount.toString());
        }, 1000);
    };

    //남은 시간 시작
    const startLeftTimer = () => {
        stopLeftTimer();

        setLeftTime(LEFT_TIME);

        leftTimerRef.current = window.setInterval(() => {
            setLeftTime(prev => {

                if (prev <= 0) {
                    setIsTimeOver(true);
                    setCountDown(null);
                    clearAllTimers();
                    setFlippedIds(current => {
                        resultCounting(current);
                        return current;
                    });
                    return 0;
                }

                if (prev <= 1) {
                    setCountDown("종료!");
                    setIsLock(true);
                    stopCpuTimer();
                    setStatus("LOADING");
                    return 0;
                }

                if (prev <= 11) {
                    setCountDown((prev - 1).toString());
                }

                return prev - 1;
            });

        }, 1000);
    };

    //cpu 뒤집기 시작
    const startCpuTimer = () => {
        stopCpuTimer();

        cpuTimerRef.current = window.setInterval(() => {
            setFlippedIds((prev) => {
                // 1. 기존의 Set을 복사하고 배열로 변환
                const next = new Set(prev);
                let idsArray = Array.from(next);

                // 2. 반복해서 삭제 시도
                for (let i = 0; i < CPU_FLIP_COUNT[difficulty]; i++) {
                    // 더 이상 지울 카드가 없으면 루프 탈출 
                    if (idsArray.length <= 0) break;

                    // 랜덤 인덱스 선택
                    const randomIndex = Math.floor(Math.random() * idsArray.length);

                    // 배열에서 해당 요소를 꺼내고(splice), Set에서도 삭제(delete)
                    const [removedId] = idsArray.splice(randomIndex, 1);
                    next.delete(removedId);
                }

                return next;
            });
        }, CPU_DELAY_CONFIG[difficulty]);
    }

    //타이머 정지---------------------------
    //카운트 다운 정지
    const stopCountDown = () => {
        if (countDownRef.current) {
            clearInterval(countDownRef.current);
            countDownRef.current = null;
        }
    };

    //남은 시간 정지
    const stopLeftTimer = () => {
        if (leftTimerRef.current) {
            clearInterval(leftTimerRef.current);
            leftTimerRef.current = null;
        }
    };

    //cpu 뒤집기 정지
    const stopCpuTimer = () => {
        if (cpuTimerRef.current) {
            clearInterval(cpuTimerRef.current);
            cpuTimerRef.current = null;
        }
    }

    //전체 타이머 초기화
    const clearAllTimers = () => {
        stopCountDown();
        stopLeftTimer();
        stopCpuTimer();
    };


    const handleCardClick = useCallback((idx: number) => {
        if (isLock || isTimeOver || isStarting) return;

        setFlippedIds(prev => {
            const next = new Set(prev);
            next.add(idx);
            return next;
        });
    }, [isLock, isTimeOver, isStarting]);


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
                    <div className="flex justify-center mb-4 sm:text-lg md:text-xl font-bold text-slate-700 w-full">
                        <div className="flex items-center justify-end gap-2">
                            <Timer className="text-blue-500" />
                            <div>
                                남은 시간: <span className={`${leftTime <= 10 ? "text-red-600" : "text-blue-600"} tabular-nums font-sans`}>{leftTime}</span>초
                            </div>
                        </div>
                    </div>
                </div>


                {/* 게임 컨텐츠 화면 */}
                <div className={`flex flex-col items-center w-full min-h-full transition-opacity duration-500`}>

                    {/* --- [여기서부터 카드 영역 시작] --- */}
                    <div className="relative w-full flex justify-center items-center">

                        {/* 카드 판 */}
                        <div className={`grid justify-center w-full ${GRID_CONFIG}`}>
                            {Array.from({ length: CARD_COUNT }).map((_, idx) =>
                                <GameCardBattle
                                    key={idx}
                                    index={idx}
                                    isFlipped={flippedIds.has(idx)}
                                    isTimeOver={isTimeOver}
                                    onPointerDown={handleCardClick}
                                    count={resultCount.get(idx) || null}
                                />
                            )}
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
            </main>


            {/*  클리어 모달 */}
            {showResultModal && (
                <FlipBattleResultModal
                    redScore={CARD_COUNT - flippedIds.size}
                    blueScore={flippedIds.size}
                    playAgain={startGame} />
            )}
        </div>
    );
}
