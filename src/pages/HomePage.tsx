import React from 'react';
import { Cloud, Github, Mail, Sparkles } from 'lucide-react';
import HomeChunkyButton from '../components/HomeChunkyButton';

// --- 타입 정의 ---
interface GameMenu {
  id: string;
  title: string;
  description: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'disabled';
  badge?: string;
  url: string;
}

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

  const games: GameMenu[] = [
    {
      id: 'face-quiz',
      title: '친구들 뒤집기',
      description: '누구일까~요?',
      icon: "flip-kid-crop.png",
      variant: 'primary',
      badge: '인기',
      url: "/flip-card"
    },
    {
      id: 'music-play',
      title: '과일 뒤집기',
      description: '신나게 불러요',
      icon: "flip-fruit-crop.png",
      variant: 'secondary',
      badge: '신규',
      url: "/flip-card-fruit/hard"
    },
    {
      id: 'art-play',
      title: '뒤집기 대결',
      description: '알록달록 그려요',
      icon: "flip-match-crop.png",
      variant: 'info',
      url: "/flip-card-battle/level5"
    },
    {
      id: 'face-quiz',
      title: '너의 눈코입',
      description: '알록달록 그려요',
      icon: "face-quiz.png",
      variant: 'success',
      url: "/flip-card"
    },
    {
      id: 'face-quiz',
      title: '친구들 뒤집기',
      description: '누구일까~요?',
      icon: "flip-kid-crop.png",
      variant: 'primary',
      badge: '인기',
      url: "/flip-card"
    },
    {
      id: 'music-play',
      title: '과일 뒤집기',
      description: '신나게 불러요',
      icon: "flip-fruit-crop.png",
      variant: 'secondary',
      badge: '신규',
      url: "/flip-card-fruit/hard"
    },
    {
      id: 'art-play',
      title: '뒤집기 대결',
      description: '알록달록 그려요',
      icon: "flip-match-crop.png",
      variant: 'info',
      url: "/flip-card-battle/level5"
    },
    {
      id: 'face-quiz',
      title: '너의 눈코입',
      description: '알록달록 그려요',
      icon: "face-quiz.png",
      variant: 'success',
      url: "/flip-card"
    },
    {
      id: 'face-quiz',
      title: '친구들 뒤집기',
      description: '누구일까~요?',
      icon: "flip-kid-crop.png",
      variant: 'primary',
      badge: '인기',
      url: "/flip-card"
    },
    {
      id: 'music-play',
      title: '과일 뒤집기',
      description: '신나게 불러요',
      icon: "flip-fruit-crop.png",
      variant: 'secondary',
      badge: '신규',
      url: "/flip-card-fruit/hard"
    },
    {
      id: 'art-play',
      title: '뒤집기 대결',
      description: '알록달록 그려요',
      icon: "flip-match-crop.png",
      variant: 'info',
      url: "/flip-card-battle/level5"
    },
    {
      id: 'face-quiz',
      title: '너의 눈코입',
      description: '알록달록 그려요',
      icon: "face-quiz.png",
      variant: 'success',
      url: "/flip-card"
    },
  ];

  return (
    <div className="min-h-screen !min-h-[100dvh] bg-gradient-to-b from-[#e0f2fe] to-[#f5f3ff] flex flex-col items-center justify-center relative overflow-hidden p-4">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <CloudDecoration />

      {/* 메인 콘텐츠 영역: flex-col로 제목과 그리드를 묶음 */}
      <div className="max-w-5xl w-full z-10 flex flex-col items-center gap-12 md:gap-16 mb-10">

        {/* 헤더 섹션: 상단 고정이 아니라 콘텐츠와 함께 중앙에 위치 */}
        <div className="text-center relative mt-10">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-7xl font-black text-purple-600 drop-shadow-md mb-4">
              우리반 <span className="text-pink-500">놀이터</span>
            </h1>
            <div className="absolute -top-6 -right-10 md:-top-8 md:-right-12 text-yellow-400 animate-bounce">
              <Sparkles className="fill-current w-10 h-10 md:w-14 md:h-14" />
            </div>
          </div>
          <p className="text-xl md:text-3xl text-purple-400 font-bold tracking-tight">
            오늘은 어떤 재미있는 놀이를 할까요?
          </p>
        </div>

        {/* 메인 게임 메뉴 그리드: 내부 아이템들을 중앙 정렬 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-md sm:max-w-xl md:max-w-4xl">
          {games.map((game, index) => (
            <HomeChunkyButton
              key={index}
              variant={game.variant}
              title={game.title}
              icon={game.icon}
              badge={game.badge}
              url={game.url}
            />
          ))}
        </div>

        <footer className="w-full flex flex-col items-center justify-center mt-12 pb-12 md:mt-20 md:pb-20 text-center z-10">

          {/* 1. 메인 슬로건 (모바일 줄바꿈 최적화) */}
            <p className="text-purple-400/80 text-sm md:text-base font-bold tracking-wide leading-relaxed break-keep select-none">
              본 사이트는 아이들의 즐거운 놀이를 위해 만든 공간이에요.<br className="hidden sm:block" />
              아이들과 함께 웃는 시간이 되길 바라요 😊
            </p>

          {/* 2. 링크 모음 (깃허브 & 출처) */}
          <div className="flex items-center gap-4 text-xs md:text-sm font-medium text-purple-300/80 mt-5">

            {/* 깃허브 링크 */}
            <a href="https://github.com/여기에_깃허브_주소_입력" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-purple-500 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <span>|</span>

            {/* 과일 사진 출처 링크 */}
            <a href="https://여기에_과일사진_출처_주소_입력" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-purple-500 transition-colors"
            >
               <Mail className="w-4 h-4" />
              <span>jihyuk.dev@gmail.com</span>
            </a>
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


      {/* 하단 바닥 잔디 데코레이션 */}
      <div className="fixed bottom-0 left-0 w-full h-16 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-[-20px] left-[-5%] w-[110%] h-24 bg-green-400/20 rounded-[100%]"></div>
        <div className="absolute bottom-[-10px] left-0 w-full h-16 bg-green-500/10 rounded-[100%] scale-x-110"></div>
      </div>
    </div>
  );
}