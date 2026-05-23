import { useEffect, useState } from "react";
import ChunkyButton from "../../components/ChunkyButton";
import SubHeader from "../../components/SubHeader";
import FacePart from "./components/FacePart";
import { RefreshCcw, SearchCheck } from "lucide-react";
import confetti from "canvas-confetti";


// 💡 퍼센트 기반 QUIZ 데이터
const QUIZ_DATA_SET_PERCENT = [
  {
    name: "윤혜리",
    imageData: "test-face.jpg",
    parts: {
      leftEye: { x: 33.4, y: 42.8, width: 12.6, height: 5.9 },
      rightEye: { x: 54.0, y: 42.9, width: 12.4, height: 5.9 },
      nose: { x: 44.0, y: 44.1, width: 12.5, height: 14.0 },
      mouth: { x: 38.6, y: 55.9, width: 22.9, height: 9.7 }
    }
  },
  {
    name: "이길동",
    imageData: "test-face.jpg",
    parts: {
      leftEye: { x: 33.4, y: 42.8, width: 12.6, height: 5.9 },
      rightEye: { x: 54.0, y: 42.9, width: 12.4, height: 5.9 },
      nose: { x: 44.0, y: 44.1, width: 12.5, height: 14.0 },
      mouth: { x: 38.6, y: 55.9, width: 22.9, height: 9.7 }
    }
  },
  {
    name: "삼길동",
    imageData: "test-face.jpg",
    parts: {
      leftEye: { x: 33.4, y: 42.8, width: 12.6, height: 5.9 },
      rightEye: { x: 54.0, y: 42.9, width: 12.4, height: 5.9 },
      nose: { x: 44.0, y: 44.1, width: 12.5, height: 14.0 },
      mouth: { x: 38.6, y: 55.9, width: 22.9, height: 9.7 }
    }
  }
];


export default function FaceQuziePage() {

  const [isImageLoading, setIsImageLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(() => getRandomIdx());
  const quizData = QUIZ_DATA_SET_PERCENT[currentIdx];

  const [showAnswer, setShowAnswer] = useState(false);

  const [visibleParts, setVisibleParts] = useState({
    eyes: false,
    nose: false,
    mouth: false
  });

  const hintText = isImageLoading
    ? "두근두근~ 새로운 친구 등장 준비!"
    : showAnswer
      ? "우와! 정답은 바로바로~"
      : getHintText(
        visibleParts.eyes,
        visibleParts.nose,
        visibleParts.mouth
      );


  const togglePart = (part: keyof typeof visibleParts) => {
    setVisibleParts((prev) => ({ ...prev, [part]: !prev[part] }));
  };


  const handleShowAnswer = () => {

    // 정답 공개
    setShowAnswer(true);

    confetti({
      particleCount: 90,
      spread: 85,
      startVelocity: 40,
      ticks: 100,
      scalar: 1.15,
      origin: { y: 0.65 },
    });

  };

  const handleRetry = () => {

    // 새로운 랜덤 문제
    setCurrentIdx(getRandomIdx(currentIdx));

    // 상태 초기화
    setVisibleParts({
      eyes: false,
      nose: false,
      mouth: false,
    });

    setShowAnswer(false);
  };


  useEffect(() => {

    console.log("이미지 로딩중")
    setIsImageLoading(true);

    const img = new Image();

    img.src = quizData.imageData;

    // img.onload = () => {
    //   setIsImageLoading(false);
    //   console.log("이미지로딩됨");
    // };

    setTimeout(() => {
      setIsImageLoading(false);
      console.log("이미지 로딩됨");
    }, 1000);

  }, [currentIdx]);

  return (
    <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">

      <SubHeader title="얼굴 퀴즈" />

      <main className="flex-1 flex flex-col items-center justify-center p-5 w-full min-h-0">

        {/* 카드 */}
        <div className="flex flex-col gap-6 bg-white rounded-4xl overflow-hidden shadow-lg p-4 w-full max-w-md">

          {/* 사진 영역 */}
          <div className="relative aspect-square w-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-4xl overflow-hidden shadow-inner border-4 border-purple-50">

            {!isImageLoading && (
              <>
                {/* FacePart 레이어 */}
                <FacePart
                  image={quizData.imageData}
                  part={quizData.parts.leftEye}
                  visible={visibleParts.eyes}
                />
                <FacePart
                  image={quizData.imageData}
                  part={quizData.parts.rightEye}
                  visible={visibleParts.eyes}
                />
                <FacePart
                  image={quizData.imageData}
                  part={quizData.parts.nose}
                  visible={visibleParts.nose}
                />
                <FacePart
                  image={quizData.imageData}
                  part={quizData.parts.mouth}
                  visible={visibleParts.mouth}
                />

                {/* 정답 전체 이미지 */}
                <img
                  src={quizData.imageData}
                  alt="정답 얼굴"
                  className={`
                absolute inset-0 w-full h-full object-cover
                transition-all duration-700 ease-out
                z-10
                ${showAnswer ? "opacity-100" : "opacity-0"}
              `}
                />

              </>
            )}
          </div>

          <p className="text-center text-xl text-purple-600">{hintText}</p>

          {/* 버튼 영역 */}
          <div className="flex items-center justify-center h-20">
            {!showAnswer &&
              <div className="grid grid-cols-3 w-full h-full gap-4">
                <ChunkyButton variant="success" onClick={() => togglePart("eyes")} className={`${visibleParts.eyes ? "chunky-pressed" : ""}`} disabled={isImageLoading}>
                  눈
                </ChunkyButton>

                <ChunkyButton variant="info" onClick={() => togglePart("nose")} className={`${visibleParts.nose ? "chunky-pressed" : ""}`} disabled={isImageLoading}>
                  코
                </ChunkyButton>

                <ChunkyButton variant="error" onClick={() => togglePart("mouth")} className={`${visibleParts.mouth ? "chunky-pressed" : ""}`} disabled={isImageLoading}>
                  입
                </ChunkyButton>
              </div>
            }

            {showAnswer &&
              <div className="text-center w-full bounce-in">
                <div className="inline-block bg-orange-100 px-10 py-4 rounded-3xl shadow-inner border-4 border-white">
                  <span className="text-5xl font-bold text-orange-500">{quizData.name}</span>
                  <span className="text-xl text-orange-400 ml-2 font-bold">어린이</span>
                </div>
              </div>
            }

          </div>

          {!showAnswer &&
            <ChunkyButton icon={SearchCheck} className="w-full mb-4" onClick={handleShowAnswer} disabled={isImageLoading}>
              정답 확인하기
            </ChunkyButton>
          }

          {showAnswer &&
            <ChunkyButton icon={RefreshCcw} variant="secondary" className="w-full mb-4" onClick={handleRetry}>
              다시하기
            </ChunkyButton>
          }

        </div>

      </main>
    </div>
  );
}


function getHintText(
  hasEyes: boolean,
  hasNose: boolean,
  hasMouth: boolean
) {
  if (hasEyes && hasNose && hasMouth)
    return "얼굴 친구들이 다 모였네! 누구일까?";

  if (hasEyes && hasNose)
    return "눈이랑 코가 만났어요!";

  if (hasEyes && hasMouth)
    return "예쁜 눈이랑 입이 보여!";

  if (hasNose && hasMouth)
    return "멋진 코랑 예쁜 입이 짠! 눈은 어디 있을까?";

  if (hasEyes)
    return "반짝반짝 예쁜 눈이 나타났네!";

  if (hasNose)
    return "킁킁~ 코가 쏙! 누구일까?";

  if (hasMouth)
    return "냠냠~ 입이 보여요! 누구 입일까?";

  return "궁금한 곳을 눌러봐! 👇";
}


function getRandomIdx(currentIndex?: number): number {

  const totalLength = QUIZ_DATA_SET_PERCENT.length;

  // 1. 안전장치: 데이터가 1개 이하이면 제외할 것도 없으니 무조건 0번 인덱스 반환
  if (totalLength <= 1) {
    return 0;
  }

  let randomIndex = Math.floor(Math.random() * totalLength);

  // 2. 현재 인덱스가 넘어왔을 때만 '중복 제외' 뺑뺑이 돌리기
  if (currentIndex !== undefined) {
    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * totalLength);
    }
  }

  return randomIndex;
}