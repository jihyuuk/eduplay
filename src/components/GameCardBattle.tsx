import { Pointer } from "lucide-react";
import React from "react";

type GameCardBattleProps = {
  isFlipped: boolean;
  isTimeOver: boolean;
  onPointerDown: () => void;
  count: number | null;
};

function GameCardBattleComponent({
  isFlipped,
  isTimeOver,
  onPointerDown,
  count
}: GameCardBattleProps) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="card"
    >
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
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
