import { useState, useRef, useEffect } from 'react';
import { Camera, Check, Download } from 'lucide-react';
import SubHeader from '../components/SubHeader';
import ChunkyButton from '../components/ChunkyButton';

// ==========================================
// ⚙️ 포토부스 설정 상수
// ==========================================
const TOTAL_SHOTS = 4;
const SELECT_COUNT = 4;
const COUNTDOWN_SECONDS = 5;
const FLASH_DURATION = 150;      // 플래시 깜빡임 시간 (ms)

type PhotoBoothStep = 'FRAME_SELECT' | 'CAPTURING' | 'RESULT';

type FrameOption = {
  id: string;
  label: string;
  previewUrl: string;
  ratio: number;
  img_width: number;
  img_height: number;
  frame_width: number;
  frame_height: number;
}

const FRAME_OPTIONS: FrameOption[] = [
  {
    id: '2x6',
    label: '2x6',
    previewUrl: '/photo-frames/2x6.png',
    ratio: 3 / 2,
    img_width: 600,
    img_height: 400,
    frame_width: 600,
    frame_height: 1800
  },
  {
    id: '4x6',
    label: '4x6',
    previewUrl: '/photo-frames/4x6.png',
    ratio: 3 / 4,
    img_width: 600,
    img_height: 800,
    frame_width: 1200,
    frame_height: 1800
  },
];

const FRAME_COLORS = [
  { id: 'pink', hex: '#FFDEE9' },
  { id: 'blue', hex: '#AEE2FF' },
  { id: 'green', hex: '#D9F8C4' },
  { id: 'yellow', hex: '#FFF3B0' },
  // { id: 'white', hex: '#FFFFFF' }, 
  // { id: 'black', hex: '#1A1A1A' }, 
];

const PhotoBoothPage = () => {

  const [step, setStep] = useState<PhotoBoothStep>('FRAME_SELECT');
  const [selectedFrame, setSelectedFrame] = useState<FrameOption | null>(null);

  const [photos, setPhotos] = useState<string[]>([]);
  const [lastCaptured, setLastCaptured] = useState<string | null>(null);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const [frameColor, setFrameColor] = useState('#FFDEE9');

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async (): Promise<MediaStream | null> => {
    try {
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      return mediaStream;
    } catch (err) {
      console.error("카메라 권한 획득 또는 재생 실패:", err);
      return null;
    }
  };

  const stopCamera = () => {

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null; // 정리
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // 컴포넌트 언마운트 시 스트림 정리
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // 사진 찍는 함수
  const captureFrame = () => {

    if (videoRef.current && captureCanvasRef.current && selectedFrame) {
      const context = captureCanvasRef.current.getContext('2d');
      if (context) {
        //비디오 넓이, 높이 가져오기
        const vW = videoRef.current.videoWidth;
        const vH = videoRef.current.videoHeight;

        // 아직 영상 준비 안됐으면 종료
        if (vW === 0 || vH === 0) return "";

        const TARGET_RATIO = selectedFrame.ratio;
        const CANVAS_WIDTH = selectedFrame.img_width;
        const CANVAS_HEIGHT = selectedFrame.img_height;

        // 비율 맞추기
        let drawW = vW;
        let drawH = vW / TARGET_RATIO;
        if (drawH > vH) {
          drawH = vH;
          drawW = vH * TARGET_RATIO;
        }

        //캔버스 크기 설정
        captureCanvasRef.current.width = CANVAS_WIDTH;
        captureCanvasRef.current.height = CANVAS_HEIGHT;

        //좌우반전
        context.save();
        context.translate(CANVAS_WIDTH, 0);
        context.scale(-1, 1);

        //비디오 프레임 캡처
        context.drawImage(videoRef.current, (vW - drawW) / 2, (vH - drawH) / 2, drawW, drawH, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.restore(); // 변형된 좌표계를 원래대로 복구

        //캔버스를 PNG 이미지로 변환
        const dataUrl = captureCanvasRef.current.toDataURL('image/png');

        // ⚡ 번쩍이는 플래시 이펙트 복구
        setFlash(true);
        setTimeout(() => setFlash(false), FLASH_DURATION);

        return dataUrl;
      }
    }

    return "";
  };

  // 전반적인 실행 함수
  const startSequence = async () => {
    setPhotos([]);
    setStep('CAPTURING');
    setLastCaptured(null);

    if (selectedFrame === null) {
      alert("프레임을 선택해주세요.");
      setStep('FRAME_SELECT');
      return;
    }

    // 1. 버튼 클릭 직후 카메라 스트림을 연결하여 자동재생 락 해제
    const activeStream = await startCamera();
    if (!activeStream) {
      alert("카메라를 시작할 수 없습니다. 권한을 확인해주세요.");
      setStep('FRAME_SELECT');
      return;
    }

    // 2. 배포 환경에서 비디오가 온전히 화면에 띄워질 때까지 1초 버퍼 대기
    await new Promise(r => setTimeout(r, 1000));

    // 3. 총 6장 촬영 루프 작동
    for (let i = 0; i < TOTAL_SHOTS; i++) {
      setLastCaptured(null); // 이전 촬영 결과물 숨기기 (실시간 카메라 보여주기)

      // 카운트다운 (5초)
      for (let c = COUNTDOWN_SECONDS; c > 0; c--) {
        setCountdown(c);
        await new Promise(r => setTimeout(r, 1000));
      }

      setCountdown(null);
      await new Promise(r => setTimeout(r, 100)); // 찰나의 순간 대기 후 캡처

      // 찰칵! 촬영 및 결과물 상태 저장
      const captured = captureFrame();
      if (captured) {
        setPhotos(prev => [...prev, captured]);
        setLastCaptured(captured); // ✨ 방금 찍은 사진 팝업 노출
      }

      // 👍 아이들이 결과물을 확인할 수 있도록 2초간 멈춤 대기
      await new Promise(r => setTimeout(r, 2000));
    }

    // 4. 촬영 완료 후 정리 및 카메라 Off ➡️ 사진 고르기 UI 자동 진입
    stopCamera();
    setLastCaptured(null);
    setStep("RESULT");
  };

  //이미지 저장 함수
  const saveResult = () => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;

    // 1. 캔버스 데이터를 가벼운 Blob(바이너리) 형태로 변환
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const fileName = `eduplay-${Date.now()}.png`;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);

      // 2. [아이폰] 공유 창 띄우기
      if (isIOS && navigator.canShare) {
        // 파일 객체는 iOS에서 공유할 때만 필요하므로 이 안으로 이동 (메모리 절약)
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: '에듀플레이 네컷사진' });
            return; // 성공 시 여기서 함수 종료
          } catch (error) {
            console.log('공유 취소 또는 실패:', error);
            return;
          }
        }

        return;
      }

      // 3. [맥북/PC/안드로이드] 초고속 다운로드 (최적화 핵심!)
      // 무거운 toDataURL 대신, 만들어둔 blob을 가상 URL로 바로 연결합니다.
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();

      // 4. 메모리 청소
      // 다운로드가 시작될 수 있게 살짝(100ms) 기다렸다가 가상 URL을 삭제합니다.
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

    }, 'image/png');
  };

  const drawResultPreview = async () => {
    if (!previewCanvasRef.current || photos.length !== SELECT_COUNT || selectedFrame === null) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = selectedFrame.frame_width;
    const h = selectedFrame.frame_height;

    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, w, h);


    //이미지 로드 (공통)
    const images = await Promise.all(
      photos.map((src) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );

    // 분기
    if (selectedFrame.id === '2x6') {
      const padding = 40;
      const imgW = w - padding * 2;
      const imgH = (imgW / 3) * 2;
      const gap = 30;

      images.forEach((img, i) => {
        ctx.drawImage(
          img,
          padding,
          padding + i * (imgH + gap),
          imgW,
          imgH
        );
      });
    } else if (selectedFrame.id === '4x6') {
      // [4x6 배치 모드]: 2x2 그리드 (사진 비율 3:4)
      const padding = 40;
      const gap = 30;
      // 전체 가로에서 양쪽 패딩과 가운데 갭을 뺀 뒤 반으로 나눔
      const imgW = (w - padding * 2 - gap) / 2;
      const imgH = imgW * (4 / 3); // 가로 3, 세로 4 비율

      images.forEach((img, i) => {
        const col = i % 2; // 0 (왼쪽) 또는 1 (오른쪽)
        const row = Math.floor(i / 2); // 0 (첫째 줄) 또는 1 (둘째 줄)

        const x = padding + col * (imgW + gap);
        const y = padding + row * (imgH + gap);

        ctx.drawImage(img, x, y, imgW, imgH);
      });
    }


    //로고 이미지(공통)-------------------
    const logo = new Image();
    logo.src = "/eduplay-logo.png";

    await new Promise((resolve) => {
      logo.onload = resolve;
    });

    const logoW = 240;
    const logoH = logo.height * (logoW / logo.width);

    ctx.drawImage(
      logo,
      w / 2 - logoW / 2, // 중앙정렬
      h - 160,            // y 위치
      logoW,
      logoH
    );

    //하단 문구
    ctx.fillStyle = '#FF69B4';
    ctx.font = '60px Jua';
    ctx.textAlign = 'center';
    //ctx.fillText('가나다라마바사아자차카', w / 2, h - 190);

    //날짜
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#888';
    ctx.fillText(new Date().toLocaleDateString(), w / 2, h - 40);
  };

  useEffect(() => {
    if (step === 'RESULT' && photos.length === SELECT_COUNT) {
      drawResultPreview();
    }
  }, [step, photos, frameColor]);

  return (
    <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">
      {/* 서브헤더 */}
      <SubHeader title={"네컷사진"} />

      <main className="flex-1 flex flex-col items-center justify-center w-full p-4 relative">

        {step === 'FRAME_SELECT' && (
          <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in duration-300">
            {/* 안내 문구 */}
            <h2 className="text-2xl md:text-3xl text-pink-600 drop-shadow-sm mb-2">
              프레임을 선택해주세요!
            </h2>

            {/* 프레임 선택 카드 리스트 */}
            <div className="grid grid-cols-2 gap-4 w-full mt-5">
              {FRAME_OPTIONS.map((frame) => {
                const isSelected = selectedFrame?.id === frame.id;
                return (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`bg-slate-50 p-2 rounded-2xl overflow-hidden border-2 transition-all duration-150
                      ${isSelected
                        ? 'border-pink-500 bg-pink-50/30'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    {/* 프레임 이미지 공간 */}
                    <img
                      src={frame.previewUrl}
                      alt={frame.id}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* 촬영 시작 버튼 (프레임 미선택 시 비활성화) */}
            <div className="mt-10">
              <ChunkyButton
                onClick={startSequence}
                icon={Camera}
                disabled={selectedFrame === null}
                className={`transition-opacity duration-500 ${selectedFrame !== null ? 'opacity-100' : 'opacity-0'}`}
              >
                촬영 시작하기!
              </ChunkyButton>
            </div>
          </div>
        )}


        {step === 'CAPTURING' && (
          <div className="w-full flex flex-col gap-6 items-center">
            <div
              className="relative bg-black rounded-xl overflow-hidden shadow-2xl border-2 md:border-3 border-white"
              style={{
                aspectRatio: selectedFrame?.ratio,
                transform: 'translateZ(0)',

                // 2. 가로는 기본적으로 100%를 차지하되
                width: '100%',

                // 3. 세로 길이가 (전체화면 - 헤더 및 상하여백 약 160px)을 넘지 못하게 막습니다.
                maxHeight: 'calc(100dvh - 150px)',

                // 4. (핵심) 세로가 제한되었을 때 가로도 비율에 맞춰 제한되도록 계산합니다.
                maxWidth: `calc((100dvh - 150px) * ${selectedFrame?.ratio})`
              }}
            >
              {/* 플래쉬 효과 */}
              {flash && <div className="absolute inset-0 bg-white z-[60] animate-out fade-out duration-150" />}

              {/* 결과물 피드백 팝업 복구 */}
              {lastCaptured && (
                <div className="absolute inset-0 z-50 animate-in fade-in zoom-in duration-300">
                  <img src={lastCaptured} className="w-full h-full object-cover" alt="last captured" />
                  {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                    멋져요! 👍
                  </div> */}
                </div>
              )}

              {!lastCaptured && (
                <>
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-md px-3 py-1 sm:px-5 sm:py-2 rounded-full z-20 border border-white/20">
                    <span className="text-white font-black text-md sm:text-lg">{photos.length + 1} / {TOTAL_SHOTS}</span>
                  </div>

                  {countdown && (
                    <div className="absolute bottom-0 inset-x-0 flex items-center justify-center z-10">
                      <span className="text-[2rem] sm:text-[4rem] font-black text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 duration-200">
                        {countdown}
                      </span>
                    </div>
                  )}
                </>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
                style={{ backfaceVisibility: 'hidden', willChange: 'transform' }}
              />
            </div>

          </div>
        )}

        {/* 촬영 완료 후 4컷 선택 UI 완벽 노출 */}
        {step === 'RESULT' && (
          <div className="flex flex-col items-center justify-center">

            {/* 프레임 영역 */}
            {/* <canvas
              ref={previewCanvasRef}
              className="w-full max-w-[280px] rounded-xl shadow-2xl border-8 border-white bg-[#FFDEE9]"
            /> */}

            <canvas
              ref={previewCanvasRef}
              className="h-[60vh] min-h-[600px] w-auto max-w-full rounded-xl shadow-2xl border-4 border-white bg-[#FFDEE9]"
            />

            {/* 프레임 색상 선택 */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 mb-2">
              {FRAME_COLORS.map((color) =>
                <button
                  key={color.id}
                  onClick={() => setFrameColor(color.hex)}
                  aria-label={`${color.id} 색상 선택`}
                  style={{ backgroundColor: color.hex }}
                  className={`
          relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-sm
          ${frameColor === color.hex
                      ? 'border-pink-500 scale-110 shadow-md' // 선택됨: 커지고 링(띠) 생성
                      : 'border-white hover:scale-105 hover:shadow-md'              // 안 선택됨: 기본 모양
                    }
        `}
                >
                  {/* 선택된 경우에만 쏙 나타나는 체크 아이콘 */}
                  {frameColor === color.hex && (
                    <Check
                      className="w-7 h-7 animate-in zoom-in duration-200 text-pink-500"
                      strokeWidth={3.5}
                    />
                  )}
                </button>
              )}
            </div>


            {/* 저장버튼 */}
            <div className='mt-4 py-4'>
              <ChunkyButton icon={Download} onClick={saveResult}>
                저장하기
              </ChunkyButton>
            </div>
          </div>
        )}
      </main>


      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
};

export default PhotoBoothPage;
