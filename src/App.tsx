import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChunkyButtonExample } from "./components/ChunkyButtonExample";
import FlipCardKidPage from "./pages/FlipCardKidPage";
import HomePage from "./pages/HomePage";
import FlipCardFruitPage from "./pages/FlipCardFruitPage";
import FlipCardBattlePage from "./pages/FlipCardBattlePage";
import SettingPage from "./pages/SettingPage";
import ToastProvider from "./components/ToastProvider";

export default function App() {

  return (
    <BrowserRouter>
      {/* 토스트 */}
      <ToastProvider />
    
      {/* 1. 공통 네비게이션 (모든 페이지에서 보임) */}
      {/* <nav className="p-4 bg-white shadow-sm flex gap-4">
        <Link to="/" className="hover:text-blue-500">홈</Link>
      </nav> */}

      {/* 2. 주소에 따라 갈아끼워질 화면들 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setting" element={<SettingPage/>} />
        <Route path="/flip-card-kid/:difficultyParam" element={<FlipCardKidPage />} />
        <Route path="/flip-card-fruit/:difficultyParam" element={<FlipCardFruitPage />} />
        <Route path="/flip-card-battle/:difficultyParam" element={<FlipCardBattlePage />} />
        <Route path="/chunkybutton-Example" element={<ChunkyButtonExample />} />
      </Routes>
    </BrowserRouter>
  );
}