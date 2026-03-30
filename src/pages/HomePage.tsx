import React, { useState } from 'react';
import {
  Gamepad2,
  Palette,
  Music,
  Star,
  Cloud,
  User,
  Sparkles,
  Settings,
  type LucideIcon,
  ImageUp,
  ChevronRight
} from 'lucide-react';
import ChunkyButton from '../components/ChunkyButton';
import { useNavigate } from 'react-router-dom';

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
  @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');

  * {
    font-family: 'Jua', sans-serif;
  }

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
  // 상태 타입 추론 (number, string)
  const [studentCount] = useState<number>(24);
  const [groupName] = useState<string>("기린");

  const navigate = useNavigate();

  const handleClick = (url:string) => {
    navigate(url);
  }

  const games: GameMenu[] = [
    {
      id: 'face-quiz',
      title: '친구들 뒤집기',
      description: '누구일까~요?',
      icon: "flip-kid-crop.png",
      variant: 'primary',
      badge: '인기',
      url:"/flip-card"
    },
    {
      id: 'music-play',
      title: '과일 뒤집기',
      description: '신나게 불러요',
      icon:  "flip-fruit-crop.png",
      variant: 'secondary',
      badge: '신규',
      url:"/flip-card-fruit/hard"
    },
    {
      id: 'art-play',
      title: '뒤집기 대결',
      description: '알록달록 그려요',
      icon: "flip-match-crop.png",
      variant: 'info',
      url:"/flip-card-battle/hard"
    },
     {
      id: 'face-quiz',
      title: '너의 눈코입',
      description: '알록달록 그려요',
      icon: "face-quiz.png",
      variant: 'success',
      url:"/flip-card"
    },
  ];

  return (
   <div className="min-h-screen !min-h-[100dvh] bg-gradient-to-b from-[#e0f2fe] to-[#f5f3ff] flex flex-col items-center justify-center relative overflow-hidden p-4">
  <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
  <CloudDecoration />

  {/* <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
  <button className="p-3 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-all group">
    <Settings className="w-6 h-6 md:w-8 md:h-8 text-purple-400 group-hover:rotate-90 transition-transform duration-300" />
  </button>
</div> */}

  {/* 메인 콘텐츠 영역: flex-col로 제목과 그리드를 묶음 */}
  <div className="max-w-5xl w-full z-10 flex flex-col items-center gap-12 md:gap-16">
    
    {/* 헤더 섹션: 상단 고정이 아니라 콘텐츠와 함께 중앙에 위치 */}
    <div className="text-center relative mt-10">
      <div className="inline-block relative">
        <h1 className="text-5xl md:text-7xl font-black text-purple-600 drop-shadow-md mb-4">
          우리반 <span className="text-pink-500">놀이터</span>
        </h1>
        <div className="absolute -top-8 -right-12 text-yellow-400 animate-bounce">
          <Sparkles className="fill-current w-14 h-14" />
        </div>
      </div>
      <p className="text-xl md:text-3xl text-purple-400 font-bold tracking-tight">
        오늘은 어떤 재미있는 놀이를 할까요?
      </p>
    </div>

    {/* 메인 게임 메뉴 그리드: 내부 아이템들을 중앙 정렬 */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
      {games.map((game, index) => (
        <ChunkyButton 
          key={index}
          variant={game.variant} 
          size='lg' 
          onClick={()=>handleClick(game.url)}
          className='rounded-[32px] relative w-full aspect-square flex items-center justify-center'
        >
          <div className="flex flex-col items-center text-center p-2">
            {game.badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-md animate-bounce z-20">
                {game.badge}
              </span>
            )}
            <div className="mb-4 transform hover:scale-110 transition-transform">
              <img src={game.icon} alt={game.title} className="w-20 h-20 md:w-28 md:h-28 object-contain" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-sm">
              {game.title}
            </h3>
          </div>
        </ChunkyButton>
      ))}
    </div>
  </div>

 
  {/* 하단 바닥 잔디 데코레이션 */}
  <div className="fixed bottom-0 left-0 w-full h-16 pointer-events-none z-0 overflow-hidden">
    <div className="absolute bottom-[-20px] left-[-5%] w-[110%] h-24 bg-green-400/20 rounded-[100%]"></div>
    <div className="absolute bottom-[-10px] left-0 w-full h-16 bg-green-500/10 rounded-[100%] scale-x-110"></div>
  </div>
</div>
  );
}