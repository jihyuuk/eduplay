import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingShuffleProps {
  count: number;
  gridConfig: string; // 여기서는 그리드 클래스 대신 스타일링용으로만 참고합니다.
}

export default function LoadingShuffle3({ count }: LoadingShuffleProps) {
  const [items, setItems] = useState(() => Array.from({ length: count }, (_, i) => i));
  const [phase, setPhase] = useState<'GATHER' | 'SPREAD'>('SPREAD');

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase('GATHER');
      
      setTimeout(() => {
        setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
        setPhase('SPREAD');
      }, 700); 
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    // 카드가 퍼져나갈 충분한 공간을 확보합니다.
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {items.map((item, index) => {
        // 부채꼴 각도 계산 (-60도 ~ 60도 사이)
        const rotation = (index - (count - 1) / 2) * (140 / count);
        // 펼쳐졌을 때 멀리 퍼지는 거리
        const radius = phase === 'GATHER' ? 0 : 160;

        return (
          <motion.div
            key={item}
            animate={{
              // 삼각함수를 이용해 부채꼴 좌표 계산
              x: Math.sin(rotation * (Math.PI / 180)) * radius,
              y: -Math.cos(rotation * (Math.PI / 180)) * radius + 100,
              rotate: rotation,
              scale: phase === 'GATHER' ? 1.1 : 1,
              zIndex: phase === 'GATHER' ? index : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
            // 실제 카드 크기와 비슷하게 맞춤
            className="absolute w-24 h-32 md:w-32 md:h-44 bg-white rounded-2xl shadow-2xl border-4 border-blue-400 flex items-center justify-center overflow-hidden origin-bottom"
          >
            <div className="w-full h-full bg-gradient-to-b from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-4xl shadow-sm">✨</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}