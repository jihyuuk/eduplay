import React from "react";
import type { Card } from "../pages/FlipCardBattlePage";

type GameCardBattleProps = {
  card: Card;
  isFlipped: boolean;
  onPointerDown: (card: Card) => void;
};

function GameCardBattleComponent({
  card,
  isFlipped,
  onPointerDown = () => { },
}: GameCardBattleProps) {
  return (
    <div
      onPointerDown={() => onPointerDown(card)}
      className={`card`}
    >
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
        {/* 뒷면 (물음표) */}
        <div className="card-battle-back" />

        {/* 앞면 (사진) */}
        <div className={`card-battle-front`} />

      </div>
    </div>
  );
}

const GameCardBattle = React.memo(GameCardBattleComponent);

export default GameCardBattle;