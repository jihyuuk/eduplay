import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingShuffleProps {
  count: number;
}

export default function LoadingShuffle4({ count }: LoadingShuffleProps) {
  const [items, setItems] = useState(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      // 초기 흩뿌려진 상태를 위한 랜덤 값들
      randomX: Math.random() * 400 - 200, 
      randomY: Math.random() * 300 - 150,
      randomRotate: Math.random() * 360,
    }))
  );
  
  const [isGathered, setIsGathered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. 가운데로 모으기
      setIsGathered(true);
      
      setTimeout(() => {
        // 2. 모인 상태에서 데이터(순서) 섞고 새로운 흩뿌리기 좌표 생성
        setItems(prev => prev.map(item => ({
          ...item,
          randomX: Math.random() * 500 - 250, // 흩어지는 범위
          randomY: Math.random() * 400 - 200,
          randomRotate: Math.random() * 720 - 360, // 더 많이 회전
        })));
        
        // 3. 다시 흩뿌리기
        setIsGathered(false);
      }, 600); 

    }, 1800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* 배경에 은은한 소용돌이 효과 (선택사항) */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 border-4 border-dashed border-white/20 rounded-full"
      />

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          animate={{
            x: isGathered ? 0 : item.randomX,
            y: isGathered ? 0 : item.randomY,
            rotate: isGathered ? 0 : item.randomRotate,
            scale: isGathered ? 1.2 : 1,
            zIndex: isGathered ? count + index : index,
          }}
          transition={{
            type: "spring",
            stiffness: isGathered ? 180 : 100, // 모일 때 더 빠르게, 흩어질 때 찰랑거리게
            damping: 15,
          }}
          className="absolute w-20 h-28 md:w-28 md:h-36 bg-white rounded-xl shadow-2xl border-[3px] border-emerald-400 flex items-center justify-center"
        >
          {/* 카드 뒷면: 네잎클로버 패턴 (행운 테마) */}
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center relative">
            <div className="absolute inset-1 border border-white/30 rounded-lg" />
            <span className="text-3xl">🍀</span>
          </div>
        </motion.div>
      ))}

      {/* 중앙에서 모일 때 반짝이는 효과 */}
      <motion.div
        animate={{
          scale: isGathered ? [0, 1.5, 0] : 0,
          opacity: isGathered ? [0, 0.8, 0] : 0,
        }}
        className="absolute w-32 h-32 bg-yellow-200 rounded-full blur-3xl"
      />
    </div>
  );
}