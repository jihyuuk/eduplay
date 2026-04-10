import React, { useState } from 'react';
import { Cloud, Github, Mail, Settings, Share2, Sparkles } from 'lucide-react';
import HomeChunkyButton from '../components/HomeChunkyButton';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import GameSettingModal from '../components/GameSettingModal';
import { games, type GameOption } from '../types/game';


// --- 애니메이션 및 글로벌 스타일 (TS Template Literal) ---
const globalStyles: string = `
  @keyframes floating {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(2deg); }
  }

  @keyframes jelly {
    0% { transform: scale(1, 1); }
    30% { transform: scale(1.1, 0.9); }
    40% { transform: scale(0.9, 1.1); }
    50% { transform: scale(1.05, 0.95); }
    100% { transform: scale(1, 1); }
  }

  .floating { animation: floating 4s ease-in-out infinite; }
  .floating-delayed { animation: floating 5s ease-in-out infinite 1s; }
  .jelly-hover:hover { animation: jelly 0.5s both; }
  
  .card-gradient-1 { background: linear-gradient(135deg, #ffed4a 0%, #ffc107 100%); }
  .card-gradient-2 { background: linear-gradient(135deg, #f687b3 0%, #ed64a6 100%); }
  .card-gradient-3 { background: linear-gradient(135deg, #63b3ed 0%, #4299e1 100%); }
  .card-gradient-4 { background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); }
`;

// --- 배경 구름 컴포넌트 ---
const CloudDecoration: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
    <Cloud className="absolute top-[5%] left-[-2%] w-40 h-40 text-white fill-current drop-shadow-md floating" />
    <Cloud className="absolute top-[8%] right-[5%] w-28 h-28 text-white fill-current drop-shadow-md floating-delayed" />
    <Cloud className="absolute top-[40%] left-[12%] w-24 h-24 text-white fill-current floating" />
    <Cloud className="absolute top-[45%] right-[-5%] w-44 h-44 text-white fill-current drop-shadow-lg floating-delayed" />
    <Cloud className="absolute bottom-[20%] left-[8%] w-32 h-32 text-white fill-current floating" />
  </div>
);

export default function HomePage() {

  const navigate = useNavigate();

  const [selectedGame, setSelectedGame] = useState<GameOption | null>(null);

  const moveToSettingPage = () => {
    navigate("/setting");
  }

  //게임 클릭시 난이도 선택 모달
  const handleGameClick = (game: GameOption) => {
      if (game.disabled) return; // 비활성화된 게임은 무시

      // 2. 설정(난이도 등)이 있는 게임이면 모달을 열고, 없으면 바로 이동
      if (game.settings && game.settings.length > 0) {
        setSelectedGame(game);
      } else {
        navigate(game.url);
      }
    };


  // 이메일 복사 버튼
  const handleCopyEmail = async () => {
    const email = "jihyuk.dev@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      toast.success("이메일 주소가 복사되었습니다! 😊");
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  // 공유하기 버튼
  const handleShare = async () => {
    const url = "https://eduplay.kr";

    const shareData = {
      title: "에듀플레이",
      url,
    };

    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 복사되었습니다! 👍");

      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
        return;
      }
    } catch (err: any) {
      console.log("공유 실패:", err);
    }
  };


  return (
    <div className="min-h-screen !min-h-[100dvh] bg-gradient-to-b from-[#e0f2fe] to-[#f5f3ff] flex flex-col items-center relative">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <CloudDecoration />

      {/* --- 상단 내비게이션 (Sticky 적용 x) --- */}
     <nav className="w-full transition-all duration-300 bg-transparent">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
          {/* 좌측: 로고 */}
          <div
            className="flex items-center cursor-pointer group transition-transform hover:scale-105 active:scale-95"
            onClick={() => (window.location.href = "/")}
          >
            {/* 모바일에서는 w-24, 태블릿 이상에서는 w-28, PC에서는 w-32로 가변 조정 */}
            <div className="relative w-28 sm:w-32 md:w-36 transition-all duration-300">
              <img
                src="/eduplay-logo.webp"
                alt="에듀플레이 로고"
                className="w-full h-auto object-contain" // h-full 대신 h-auto가 비율 유지에 좋습니다.
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* 우측: 설정 버튼 */}
          <button
            onClick={moveToSettingPage}
            // 모바일에서는 버튼 크기를 살짝 줄여서 공간을 확보합니다 (p-2 -> md:p-2.5)
            className="p-2 md:p-2.5 bg-white/60 backdrop-blur-sm rounded-full shadow-sm border border-white/50 hover:bg-white/90 transition-all active:scale-95 group cursor-pointer"
          >
            {/* 아이콘 크기도 반응형으로 조절 (w-5 -> md:w-6) */}
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-purple-500 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역: flex-col로 제목과 그리드를 묶음 */}
      <div className="max-w-5xl w-full z-10 flex flex-col items-center gap-12 md:gap-16 mb-10 p-4">

        {/* 헤더 섹션: 상단 고정이 아니라 콘텐츠와 함께 중앙에 위치 */}
        <div className="text-center relative mt-6">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-7xl font-black text-purple-600 drop-shadow-md mb-4">
              우리반 <span className="text-pink-500">놀이터</span>
            </h1>
            <div className="absolute -top-6 -right-10 md:-top-8 md:-right-12 text-yellow-400 floating">
              <Sparkles className="fill-current w-10 h-10 md:w-14 md:h-14" />
            </div>
          </div>
          <p className="text-xl md:text-3xl text-purple-400 font-bold tracking-tight">
            오늘은 어떤 재미있는 놀이를 할까요?
          </p>
        </div>

        {/* 메인 게임 메뉴 그리드: 내부 아이템들을 중앙 정렬 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-md sm:max-w-xl md:max-w-2xl">
          {games.map((game, index) => (
            <HomeChunkyButton
              key={index}
              variant={game.variant}
              title={game.title}
              icon={game.icon}
              badge={game.badge}
              onClick={()=>handleGameClick(game)}
              disabled={game.disabled}
            />
          ))}
        </div>

        <footer className="w-full flex flex-col items-center justify-center mt-12 pb-5 md:mt-20 md:pb-10 text-center z-10">

          {/* 1. 메인 슬로건 (모바일 줄바꿈 최적화) */}
          <p className="text-purple-400/80 text-sm md:text-base font-bold tracking-wide leading-relaxed break-keep select-none">
            본 사이트는 아이들의 즐거운 놀이를 위해 만든 공간이에요.<br className="hidden sm:block" />
            아이들과 함께 웃는 시간이 되길 바라요 😊
          </p>

          {/* 2. 링크 모음 (깃허브 & 출처) */}
          <div className="flex items-center gap-4 text-xs md:text-sm font-medium text-purple-300/80 mt-5">

            {/* 깃허브 링크 */}
            <a href="https://github.com/jihyuuk/eduplay" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-purple-500 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <span>|</span>

            {/* 이메일 복사 */}
            <div
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 hover:text-purple-500 transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>jihyuk.dev@gmail.com</span>
            </div>

            <span>|</span>

            {/* 공유하기 */}
            <div
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-purple-500 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>공유하기</span>
            </div>
          </div>

          {/* 카피라이트 */}
          <p className="hover:text-purple-500 transition-colors text-xs md:text-sm font-medium text-purple-300/60 mt-5 select-none">
            © 2026 EduPlay. All rights reserved.
          </p>

          {/* 기타 저작권 표시 */}
          <p className="hover:text-purple-500 transition-colors text-xs md:text-sm font-medium text-purple-300/60">
            <a href="https://www.vecteezy.com/free-vector/fruit">Fruit Vectors by Vecteezy</a>
          </p>
        </footer>

      </div>

{/* 4. selectedGame에 데이터가 있을 때만 모달을 렌더링 */}
      {selectedGame && (
        <GameSettingModal 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} // 닫기 누르면 다시 null로
        />
      )}

      {/* 하단 바닥 잔디 데코레이션 */}
      <div className="fixed bottom-0 left-0 w-full h-16 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-[-20px] left-[-5%] w-[110%] h-24 bg-green-400/20 rounded-[100%]"></div>
        <div className="absolute bottom-[-10px] left-0 w-full h-16 bg-green-500/10 rounded-[100%] scale-x-110"></div>
      </div>
    </div>
  );
}