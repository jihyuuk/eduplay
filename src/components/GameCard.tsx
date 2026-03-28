import React from "react";
import type { Card } from "../pages/FlipCardGamePage";

type GameCardProps = {
  card: Card;
  isFlipped: boolean;
  isMatched: boolean;
  isWrong: boolean;
  onClick: (card: Card) => void;
};

function GameCardComponent({
  card,
  isFlipped,
  isMatched,
  isWrong,
  onClick,
}: GameCardProps) {
  return (
    <div
      onClick={() => onClick(card)}
      className={`card ${isWrong ? "wrong" : ""}`}
    >
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
        {/* 뒷면 (물음표) */}
        <div className="card-back">
          <span className="text-white text-3xl sm:text-5xl font-bold">?</span>
        </div>

        {/* 앞면 (사진) */}
        <div className={`card-front gap-1 ${isMatched ? "matched" : ""}`}>
          <div className="relative w-full flex-1  min-h-0 overflow-hidden">
            <img
              src={card.kid.imagePath}
              alt={card.kid.name}
              className="w-full h-full object-cover rounded-md"
              // loading="eager"
              //decoding="async"
              decoding="sync"
            />
          </div>
          {/* 이름이 너무 길면 깨질 수 있으니 텍스트 크기 조절 */}
          <p className="text-center font-bold text-xs sm:text-base md:text-lg  truncate w-full">
            {card.kid.name}
          </p>

          {/* 정답일 때 나타나는 체크 표시 뱃지 */}
          {isMatched && (
            <div className="
                absolute top-1 right-1 
                w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 
                p-1 sm:p-1.5 
                bg-green-500 rounded-full shadow-lg badge-appear z-10 
                flex items-center justify-center border border-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const GameCard = React.memo(GameCardComponent);

export default GameCard;