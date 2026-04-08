import { type ReactNode } from 'react'; // ReactNode를 type으로 가져옵니다.
import { ChevronLeft } from 'lucide-react';

/**
 * SubHeader Props 타입 정의
 */
interface SubHeaderProps {
    title: string;
    onBack?: () => void;
    rightElement?: ReactNode; // 'type ReactNode' 덕분에 안전하게 사용 가능
}

export default function SubHeader3({ 
  title, 
  onBack, 
  rightElement 
}: SubHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b-4 border-pink-100 px-4 py-4 font-jua">
            <div className="flex items-center justify-between max-w-4xl mx-auto">

                {/* 왼쪽: 뒤로가기 */}
                <div className="flex-1 flex justify-start">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-400 rounded-2xl hover:bg-pink-100 transition-colors shadow-sm active:scale-95"
                        aria-label="뒤로가기"
                    >
                        <ChevronLeft size={28} strokeWidth={3} />
                    </button>
                </div>

                {/* 중앙: 타이틀 */}
                <div className="flex-[3] text-center">
                    <h1 className="text-2xl text-pink-500 tracking-tight truncate">
                        {title}
                    </h1>
                </div>

                {/* 오른쪽: 유틸리티 */}
                <div className="flex-1 flex justify-end gap-2">
                    {rightElement ? (
                        rightElement
                    ) : (
                        <div className="w-10 h-10" />
                    )}
                </div>
            </div>
        </header>

        
    );
};



{/* 예시 1: 유틸리티 버튼이 여러 개일 때 */ }
// <section>
//   <p className="p-4 text-xs text-pink-300 font-sans"># 유틸리티 버튼 2개 + 핑크 테마</p>
//   <SubHeader2 
//     title="우리반 앨범" 
//     onBack={handleBack}
//     rightElement={
//       <>
//         <button className="w-10 h-10 flex items-center justify-center text-pink-400 hover:bg-pink-50 rounded-full transition-colors">
//           <Heart size={24} fill="currentColor" className="opacity-40" />
//         </button>
//         <button className="w-10 h-10 flex items-center justify-center text-pink-400 hover:bg-pink-50 rounded-full transition-colors relative">
//           <Bell size={24} />
//           <span className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full border-2 border-white" />
//         </button>
//       </>
//     }
//   />
//   <div className="h-40 flex items-center justify-center text-pink-200">콘텐츠 영역</div>
// </section>

{/* 예시 2: 유틸리티 버튼이 1개일 때 */ }
// <section>
//   <p className="p-4 text-xs text-pink-300 font-sans"># 유틸리티 버튼 1개</p>
//   <SubHeader2 
//     title="알림장 확인하기" 
//     onBack={handleBack}
//     rightElement={
//       <button className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white rounded-2xl shadow-md shadow-pink-100 hover:bg-pink-600 transition-all">
//         <Home size={22} />
//       </button>
//     }
//   />
//   <div className="h-40 flex items-center justify-center text-pink-200">콘텐츠 영역</div>
// </section>

{/* 예시 3: 유틸리티 버튼이 아예 없을 때 */ }
// <section>
//   <p className="p-4 text-xs text-pink-300 font-sans"># 버튼 없이 타이틀만 있을 때</p>
//   <SubHeader2
//     title="개인정보 설정"
//     onBack={handleBack}
//   />
//   <div className="h-40 flex items-center justify-center text-pink-200">콘텐츠 영역</div>
// </section>

//   주아체의 둥근 느낌을 살리기 위해 버튼도 <br/>
//   각진 사각형 대신 2xl(둥근 사각형)이나 <br/>
//   Full(원형)을 섞어서 사용하면 훨씬 귀여워요!