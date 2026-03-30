import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ChunkyButtonExample } from "./components/ChunkyButtonExample";
import FlipCardSettingPage from "./pages/FlipCardSettingPage";
import FlipCardGamePage from "./pages/FlipCardGamePage";
import HomePage from "./pages/HomePage";
import FlipCardFruitPage from "./pages/FlipCardFruitPage";

export default function App() {

  return (
    <BrowserRouter>
      {/* 1. 공통 네비게이션 (모든 페이지에서 보임) */}
      {/* <nav className="p-4 bg-white shadow-sm flex gap-4">
        <Link to="/" className="hover:text-blue-500">홈</Link>
      </nav> */}

      {/* 2. 주소에 따라 갈아끼워질 화면들 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flip-card" element={<FlipCardSettingPage />} />
        <Route path="/flip-card/:difficultyParam" element={<FlipCardGamePage />} />
        <Route path="/flip-card-fruit/:difficultyParam" element={<FlipCardFruitPage />} />
        <Route path="/chunkybutton-Example" element={<ChunkyButtonExample />} />
      </Routes>
    </BrowserRouter>
  );
}