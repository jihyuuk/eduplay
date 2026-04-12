import { Pointer } from "lucide-react";
import React from "react";

type GameCardBattleProps = {
  index: number;
  isFlipped: boolean;
  isTimeOver: boolean;
  onPointerDown: (idx: number) => void;
  count: number | null;
};

function GameCardBattleComponent({
  index,
  isFlipped,
  isTimeOver,
  onPointerDown,
  count
}: GameCardBattleProps) {
  return (
    <div
      onPointerDown={() => onPointerDown(index)}
      className="card-battle"
    >
      <div className={`card-battle-inner ${isFlipped ? "flipped" : ""}`}>
        {/* 뒷면 */}
        <div className="card-battle-back flex flex-col items-center justify-center text-red-700 text-4xl">

          {count ? count : ""}

          {!isTimeOver &&
            <>
              <Pointer className="text-white w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              {/* <div className="mt-3 text-sm sm:text-base md:text-lg lg:text-xl text-white">
                여기!
              </div> */}
            </>
          }
        </div>

        {/* 앞면 */}
        <div className="card-battle-front flex flex-col items-center justify-center text-blue-600 text-4xl">
          {count ? count : ""}
        </div>

      </div>
    </div>
  );
}

const GameCardBattle = React.memo(GameCardBattleComponent);

export default GameCardBattle;
