import { useEffect, useState } from "react";
import ChunkyButton from "../../components/ChunkyButton";
import SubHeader from "../../components/SubHeader";
import FacePart from "./components/FacePart";
import { RefreshCcw, Search, SearchCheck, User } from "lucide-react";
import confetti from "canvas-confetti";
import type { FaceQuizItem } from "../../db";
import { FaceQuizItemRepository } from "../../repositories/FaceQuizItemRepository";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function FaceQuziePage() {

  const navigate = useNavigate();

  const [isImageLoading, setIsImageLoading] = useState(true);

  const [quizItems, setQuizItems] = useState<FaceQuizItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const quizData = quizItems[currentIdx];
  const [imageUrl, setImageUrl] = useState("");

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
    setCurrentIdx(getRandomIdx(quizItems.length, currentIdx));

    // 상태 초기화
    setVisibleParts({
      eyes: false,
      nose: false,
      mouth: false,
    });

    setShowAnswer(false);
  };


  useEffect(() => {
    if (!quizData) return;

    setIsImageLoading(true);

    const url = URL.createObjectURL(quizData.image);
    setImageUrl(url);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      setIsImageLoading(false);
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [quizData]);


  // 처음 로딩 데이터 불러오기
  useEffect(() => {
    const loadQuizItems = async () => {
      const data = await FaceQuizItemRepository.findAll();

      if (data.length <= 0) {
        toast.error("저장된 친구가 없어요");
        navigate("/", { replace: true }); // 설정 페이지로 돌려보내기
        return;
      }

      setQuizItems(data);
      setCurrentIdx(getRandomIdx(data.length));
    };

    loadQuizItems();
  }, []);

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

                {/* 아이콘 */}
                {!showAnswer &&
                  !visibleParts.eyes &&
                  !visibleParts.nose &&
                  !visibleParts.mouth && (

                    <div className="absolute inset-0 flex items-center justify-center z-10">

                      <div className="relative w-full h-full">

                        {/* 사람 아이콘 */}
                        <User className="absolute inset-0 m-auto w-[60%] h-[60%] text-purple-200 fill-current" />

                        {/* 돋보기 */}
                        <div className="absolute inset-0 flex items-center justify-center animate-[search_4s_ease-in-out_infinite]">
                          <div className="relative">
                            <Search className="w-[20vw] h-[20vw] max-w-24 max-h-24 text-purple-300 stroke-[3.5px]" />

                            <div className="absolute top-[18%] left-[18%] w-[15%] h-[15%] bg-white rounded-full opacity-70" />
                          </div>
                        </div>

                      </div>

                    </div>
                  )}
                {!showAnswer &&
                  <>
                    {/* FacePart 레이어 */}
                    <FacePart
                      image={imageUrl}
                      part={quizData.leftEye}
                      visible={visibleParts.eyes}
                    />
                    <FacePart
                      image={imageUrl}
                      part={quizData.rightEye}
                      visible={visibleParts.eyes}
                    />
                    <FacePart
                      image={imageUrl}
                      part={quizData.nose}
                      visible={visibleParts.nose}
                    />
                    <FacePart
                      image={imageUrl}
                      part={quizData.mouth}
                      visible={visibleParts.mouth}
                    />
                  </>
                }

                {/* 정답 전체 이미지 */}
                <img
                  src={imageUrl}
                  alt="정답 얼굴"
                  className={`
                    absolute inset-0 w-full h-full object-cover z-20
                    ${showAnswer
                      ? "opacity-100 transition-all duration-700 ease-out"
                      : "opacity-0 transition-none pointer-events-none"
                    }
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
                  <span className="text-2xl md:text-4xl font-bold text-orange-500">{quizData.kidName}</span>
                  <span className="text-base md:text-xl text-orange-400 ml-2 font-bold">어린이</span>
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


function getRandomIdx(totalLength: number, currentIndex?: number): number {

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