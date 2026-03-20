import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game1 from "./pages/Game1";
import Game2 from "./pages/Game2";
import Game3 from "./pages/Game3";

export default function App() {

  return (
    <BrowserRouter>
      {/* 1. 공통 네비게이션 (모든 페이지에서 보임) */}
      <nav className="p-4 bg-white shadow-sm flex gap-4">
        <Link to="/" className="hover:text-blue-500">홈</Link>
      </nav>

      {/* 2. 주소에 따라 갈아끼워질 화면들 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game1" element={<Game1 />} />
        <Route path="/game2" element={<Game2 />} />
        <Route path="/game3" element={<Game3 />} />
      </Routes>
    </BrowserRouter>
  );
}