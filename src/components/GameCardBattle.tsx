import { Pointer } from "lucide-react";
import React from "react";

type GameCardBattleProps = {
  isFlipped: boolean;
  onPointerDown: () => void;
};

function GameCardBattleComponent({
  isFlipped,
  onPointerDown
}: GameCardBattleProps) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="card"
    >
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
        {/* 뒷면 */}
        <div className="card-battle-back flex flex-col items-center justify-center text-white">
          <Pointer />
          <div className="mt-3">
            뒤집어!!
          </div>
        </div>

        {/* 앞면 */}
        <div className={`card-battle-front`} />

      </div>
    </div>
  );
}

const GameCardBattle = React.memo(GameCardBattleComponent);

export default GameCardBattle;
