import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingShuffleProps {
  count: number;
  gridConfig: string;
}

function shuffle<T>(array: T[]): T[] {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

export default function LoadingShuffle({ count, gridConfig }: LoadingShuffleProps) {
  // 가짜 카드 배열 생성 (0, 1, 2...)
  const [items, setItems] = useState(() => Array.from({ length: count }, (_, i) => i));

  // 2. useEffect 내부의 타이머 수정
  useEffect(() => {
    const timer = setInterval(() => {
      setItems((prev) => shuffle(prev));
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`grid justify-center w-full ${gridConfig}`}>
      {items.map((item) => (
        <motion.div
          key={item}
          layout // 이 속성이 핵심입니다! 위치 변경을 부드러운 애니메이션으로 만듭니다.
          //transition={{ type: "spring", stiffness: 300, damping: 25 }}
          transition={{ type: "spring", stiffness: 200, damping: 23 }}
          //transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="aspect-[3/4] w-full bg-white rounded-xl shadow-md border-4 border-white flex items-center justify-center"
        >
          {/* 카드 뒷면 무늬 (햇살반 느낌의 아이콘이나 패턴) */}
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white opacity-50">✨</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}