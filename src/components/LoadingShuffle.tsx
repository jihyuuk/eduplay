import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingShuffleProps {
  count: number;
  gridConfig: string;
  isDataReady: boolean; //부모 데이터(이미지 등) 로딩이 끝났는지 여부
}

//카드 섞는 함수
function shuffle<T>(array: T[]): T[] {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

export default function LoadingShuffle({ count, gridConfig, isDataReady }: LoadingShuffleProps) {
  
  // 가짜 카드 배열 생성
  const [items, setItems] = useState(() => Array.from({ length: count }, (_, i) => i));

  useEffect(() => {
    // 1. 데이터가 준비되었다면 타이머를 시작 안 함
    if (isDataReady) return;

    // 2.셔플 실행
    const timer = setInterval(() => {
      setItems((prev) => shuffle(prev));
    }, 1000);

    // 3. 언마운트되거나 isDataReady가 true가 되면 타이머 청소
    return () => clearInterval(timer);

  }, [isDataReady, count]);


  return (
    <>
      {/* 2. 카드 그리드 (배경 레이어) */}
      <div className={`grid justify-center w-full ${gridConfig}`}>
        {items.map((item) => (
          <motion.div
            key={item}
            style={{ willChange: "transform" }}
            layout 
            //transition={{ type: "spring", stiffness: 300, damping: 25 }}
            //transition={{ type: "spring", stiffness: 100, damping: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 23 }}
            className="card"
          >
            {/* 카드 뒷면 */}
            <div className="card-back">
              <span className="text-white text-3xl sm:text-5xl font-bold">?</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. 중앙 메시지 (공중 부양 레이어) */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isDataReady ? 0 : 1, // 로딩 끝나면 사라짐
            scale: [1, 1.05, 1], // 둥실둥실 효과
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-3xl shadow-2xl border-4 border-pink-100 flex flex-col items-center gap-2"
        >
          <span className="text-4xl">🪄</span>
          <p className="text-xl md:text-2xl font-black text-pink-600 tracking-tight">
            곧 시작해요
          </p>
          <p className="text-sm md:text-base font-bold text-purple-400">
            카드를 열심히 섞고 있어요...
          </p>

          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-1.5 h-1.5 bg-pink-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div> */}

      {/* 배경에서 둥둥 떠다니는 파티클들 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden">
        <div className="z-10 text-center">
          <h2 className="text-2xl md:text-5xl font-black text-pink-500 drop-shadow-[0_4px_10px_rgba(255,255,255,0.8)]">
            곧 시작해요! 
          </h2>
          <p className="text-md md:text-2xl font-bold text-purple-600 mt-2">
            준비됐나요? 😆
          </p>
        </div>
      </div>
    </>
  );
}