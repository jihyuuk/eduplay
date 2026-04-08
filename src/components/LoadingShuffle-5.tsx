import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface LoadingShuffleProps {
  count: number;
  gridConfig: string;
}

export default function LoadingShuffle5({ count, gridConfig }: LoadingShuffleProps) {
  const [items, setItems] = useState(() => Array.from({ length: count }, (_, i) => i));
  const [isGathered, setIsGathered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. 중앙으로 모으기 시작
      setIsGathered(true);
      
      setTimeout(() => {
        // 2. 뭉쳐있는 동안 순서 섞기
        setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
        
        // 3. 다시 제자리(Grid 위치)로 흩어지기
        setTimeout(() => {
            setIsGathered(false);
        }, 300); // 섞는 동작 시간
      }, 600); 

    }, 2500); // 전체 사이클

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`grid justify-center w-full relative ${gridConfig}`}
    >
      {items.map((item, index) => (
        <CardItem 
            key={item} 
            index={index} 
            isGathered={isGathered} 
            containerRef={containerRef}
        />
      ))}
    </div>
  );
}

// 개별 카드 컴포넌트
function CardItem({ isGathered, containerRef }: any) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isGathered && cardRef.current && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const cardRect = cardRef.current.getBoundingClientRect();

            // 컨테이너 중앙 좌표 계산
            const centerX = containerRect.left + containerRect.width / 2;
            const centerY = containerRect.top + containerRect.height / 2;
            
            // 카드 현재 좌표 계산
            const cardX = cardRect.left + cardRect.width / 2;
            const cardY = cardRect.top + cardRect.height / 2;

            setOffset({
                x: centerX - cardX,
                y: centerY - cardY
            });
        } else {
            setOffset({ x: 0, y: 0 });
        }
    }, [isGathered]);

    return (
        <motion.div
            ref={cardRef}
            layout // 이 속성은 그리드 내의 이동을 담당
            animate={{
                // 실제로 카드를 중앙으로 모으거나 펼치는 시각적 효과
                x: offset.x,
                y: offset.y,
                scale: isGathered ? 1.1 : 1,
                rotateY: isGathered ? 180 : 0, 
                zIndex: isGathered ? 100 : 1,
            }}
            transition={{
                // *** 튀는 버그 해결의 핵심! ***
                // 펼쳐질 때(`!isGathered`)는 x, y 애니메이션을 완전히 꺼서 
                // `layout` 기능과 충돌하지 않게 함
                x: isGathered ? { type: "spring", stiffness: 120, damping: 20 } : { duration: 0 },
                y: isGathered ? { type: "spring", stiffness: 120, damping: 20 } : { duration: 0 },
                layout: { type: "spring", stiffness: 200, damping: 20 },
                rotateY: { duration: 0.4 }
            }}
            className="aspect-[3/4] w-full bg-white rounded-xl shadow-md border-4 border-white flex items-center justify-center overflow-hidden"
        >
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white">
                <span className="text-3xl">🎁</span>
            </div>
        </motion.div>
    );
}