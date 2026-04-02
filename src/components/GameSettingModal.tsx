import { ArrowLeft } from "lucide-react";
import type { GameOption } from "../types/game";
import ChunkyButton from "./ChunkyButton";
import { useNavigate } from "react-router-dom";



export default function GameSettingModal({ game, onClose }: { game: GameOption; onClose: () => void }) {

  if (!game) return null;

  const navigate = useNavigate();

  const handleClick = (url: string) => {
    navigate(url);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100] p-6 transition-all overflow-hidden">

      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-[32px] p-5 md:p-6 w-full max-w-md text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        {/* 사진 */}
        <div className="flex justify-center">
          <img
            src={game.icon}
            alt={game.title}
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>

        {/* 텍스트 */}
        <div className="mt-6">
          <h2 className="text-3xl md:text-4xl font-black text-purple-600 mb-4 drop-shadow-sm">
            {game.title}
          </h2>
          <p className="text-purple-400 font-bold mb-5 text-lg">난이도 선택</p>
        </div>

        {/* 난이도 리스트 */}
        <div className="space-y-4">
          {game.settings?.map((opt: any) => (
            <ChunkyButton
              key={opt.path}
              variant={opt.variant}
              size="lg"
              className="w-full"
              onClick={() => {
                handleClick(`${game.url}${opt.path}`);
              }}
            >
              <span className="relative z-10">{opt.label}</span>
            </ChunkyButton>
          ))}

        </div>

        {/* 하단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="mt-8 px-6 py-2 text-gray-400 font-bold hover:text-purple-400 transition-all hover:scale-110 active:scale-95 flex items-center justify-center mx-auto gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-colors group-hover:text-purple-500" />
          <span>나가기</span>
        </button>
      </div>
    </div>
  );
}