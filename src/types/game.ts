import type { ButtonVariant } from "../components/ChunkyButton";

// --- 타입 정의 ---
export interface GameOption {
  id: string;
  title: string;
  icon: string;
  variant: ButtonVariant;
  badge?: string;
  url: string; // 기본 경로
  disabled?: boolean;
  // 게임별 선택지 (난이도, 레벨 등)
  settings?: {
    label: string; // 버튼에 표시될 텍스트 (예: "쉬움", "Level 1")
    path: string;  // 이동할 최종 경로 (예: "easy", "level1")
    variant: ButtonVariant; // 버튼 색상 (선택사항)
  }[];
}


export const games: GameOption[] = [
  {
    id: 'flip-kid',
    title: '친구들 뒤집기',
    icon: "/game-icons/flip-kid.png",
    variant: 'primary',
    url: "/flip-card-kid",
    settings: [
      { label: '쉬움', path: '/easy', variant: 'success' },
      { label: '보통', path: '/normal', variant: 'warning' },
      { label: '어려움', path: '/hard', variant: 'error' },
    ]
  },
  {
    id: 'flip-fruit',
    title: '과일 뒤집기',
    icon: "/game-icons/flip-fruit.png",
    variant: 'secondary',
    url: "/flip-card-fruit",
    settings: [
      { label: '쉬움', path: '/easy', variant: 'success' },
      { label: '보통', path: '/normal', variant: 'warning' },
      { label: '어려움', path: '/hard', variant: 'error' },
    ]
  },
  {
    id: 'flip-battle',
    title: '뒤집기 대결',
    icon: "/game-icons/flip-match.png",
    variant: 'info',
    url: "/flip-card-battle",
    settings: [
      { label: '쉬움', path: '/easy', variant: 'success' },
      { label: '보통', path: '/normal', variant: 'warning' },
      { label: '어려움', path: '/hard', variant: 'error' },
      // { label: '둘이서 대결', path: '/2p', variant: 'primary' },
    ]
  },
  {
    id: 'face-quiz',
    title: '너의 눈코입',
    icon: "/game-icons/face-quiz.png",
    variant: 'disabled',
    url: "/",
    disabled: true
  },
  {
    id: 'journey-rabbit',
    title: '토끼의 모험',
    icon: "/game-icons/rabbit-coding.png",
    variant: 'disabled',
    url: "/",
    disabled: true
  },
  {
    id: 'train-puzzle',
    title: '기차 퍼즐',
    icon: "/game-icons/train-puzzle.png",
    variant: 'disabled',
    url: "/",
    disabled: true
  }
];