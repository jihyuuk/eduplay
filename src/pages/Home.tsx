import { Gamepad2, Play, LayoutGrid, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Game {
    id: number;
    title: string;
    icon: React.ReactNode;
    color: string;
    path: string;
}

const gameList: Game[] = [
    { id: 1, title: "카드 뒤집기", icon: <LayoutGrid />, color: "text-purple-500", path: "/flip-card" },
    { id: 2, title: "버튼 예제", icon: <Gamepad2 />, color: "text-blue-500", path: "/chunkybutton-example" },
    { id: 3, title: "얼굴 맞추기", icon: <UserCircle />, color: "text-green-500", path: "/game3" },
];


export default function Home() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="max-w-4xl mx-auto mb-10">
                <h1 className="text-4xl font-black text-slate-800 flex items-center gap-3">
                    EduPlay <span className="text-sm font-normal text-slate-400">v1.0</span>
                </h1>
            </header>

            <main className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gameList.map((game) => (
                    <div
                        key={game.id}
                        className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100"
                    >
                        <div className={`mb-4 ${game.color} group-hover:scale-110 transition-transform`}>
                            {/* 아이콘 크기 조절도 가능합니다 */}
                            {game.icon}
                        </div>

                        <h2 className="text-xl font-bold text-slate-700 mb-6">{game.title}</h2>

                        <button
                            onClick={() => navigate(game.path)}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold"
                        >
                            <Play size={18} fill="currentColor" /> 시작하기
                        </button>
                    </div>
                ))}
            </main>
        </div>
    );
}