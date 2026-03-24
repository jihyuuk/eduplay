import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingShuffleProps {
  count: number;
  gridConfig: string;
}

export default function LoadingShuffle2({ count, gridConfig }: LoadingShuffleProps) {
  const [items, setItems] = useState(() => Array.from({ length: count }, (_, i) => i));
  const [isGathered, setIsGathered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. 먼저 카드를 가운데로 살짝 모으고 섞기
      setIsGathered(true);
      
      setTimeout(() => {
        setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
        // 2. 다시 제자리로 펼치기
        setIsGathered(false);
      }, 400); 

    }, 1000); // 1초 주기로 마술 효과 반복

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`grid justify-center w-full ${gridConfig}`}>
      {items.map((item, index) => (
        <motion.div
          key={item}
          layout
          // 모일 때(isGathered)는 중앙으로 살짝 쏠리는 느낌과 회전을 줌
          animate={{
            scale: isGathered ? 0.8 : 1,
            rotate: isGathered ? (index % 2 === 0 ? 15 : -15) : 0,
            zIndex: isGathered ? 10 : 1,
          }}
          transition={{
            layout: { type: "spring", stiffness: 200, damping: 20 },
            scale: { duration: 0.3 },
            rotate: { duration: 0.3 }
          }}
          className="aspect-[3/4] w-full bg-white rounded-xl shadow-lg border-2 border-pink-100 flex items-center justify-center overflow-hidden"
        >
          {/* 카드 뒷면: 무지개 그라데이션 패턴 */}
          <div className="w-full h-full bg-gradient-to-tr from-yellow-200 via-pink-200 to-purple-300 flex items-center justify-center relative">
              {/* 내부의 작은 원형 장식들 */}
              <div className="absolute inset-2 border-2 border-white/40 rounded-lg border-dashed" />
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="text-3xl"
              >
                🌈
              </motion.span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}