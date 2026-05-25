import { useState } from "react";
import SubHeader from "../../components/SubHeader";
import FlipCardSetting from "./components/FlipCardSetting";
import FaceQuizSetting from "./components/FaceQuizSetting";
import InfoSetting from "./components/InfoSetting";

// 탭 종류 정의
type TabType = 'info' | 'flipCard' | 'faceQuiz';

export default function SettingPage() {

    const [activeTab, setActiveTab] = useState<TabType>('info');

    return (
        <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">

            {/* 서브 헤더 */}
            <SubHeader title="설정" />

            {/* 메인 콘텐츠 */}
            <main className="w-full max-w-4xl p-4">

                <div className="mb-6 bg-white p-2 rounded-2xl grid grid-cols-3 gap-2 shadow-md border-2 border-purple-100">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`py-3 rounded-xl font-black text-sm md:text-base transition-all text-center cursor-pointer
                                ${activeTab === 'info'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-50 text-slate-400 hover:text-slate-500 hover:bg-slate-100'}`}
                    >
                        안내
                    </button>
                    <button
                        onClick={() => setActiveTab('flipCard')}
                        className={`py-3 rounded-xl font-black text-sm md:text-base transition-all text-center cursor-pointer
                                ${activeTab === 'flipCard'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-50 text-slate-400 hover:text-slate-500 hover:bg-slate-100'}`}
                    >
                        카드 뒤집기
                    </button>
                    <button
                        onClick={() => setActiveTab('faceQuiz')}
                        className={`py-3 rounded-xl font-black text-sm md:text-base transition-all text-center cursor-pointer
                                ${activeTab === 'faceQuiz'
                                ? 'bg-sky-100 text-sky-700'
                                : 'bg-slate-50 text-slate-400 hover:text-slate-500 hover:bg-slate-100'}`}
                    >
                        얼굴 퀴즈
                    </button>
                </div>

                {activeTab === 'info' &&
                    <InfoSetting />
                }

                {activeTab === 'flipCard' &&
                    <FlipCardSetting />
                }

                {activeTab === 'faceQuiz' &&
                    <FaceQuizSetting />
                }
            </main>

        </div>
    );
}
