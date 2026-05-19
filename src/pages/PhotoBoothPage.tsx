import { useState, useRef, useEffect } from 'react';
import { Camera, Download, RefreshCcw } from 'lucide-react';
import SubHeader from '../components/SubHeader';
import ChunkyButton from '../components/ChunkyButton';

// ==========================================
// ⚙️ 포토부스 설정 상수
// ==========================================
const TOTAL_SHOTS = 4;
const SELECT_COUNT = 4;
const COUNTDOWN_SECONDS = 1;

const TARGET_RATIO = 3 / 2;      // 원하는 사진 비율 (3:2)
const CANVAS_WIDTH = 600;        // 저장될 사진 가로 해상도
const CANVAS_HEIGHT = 400;       // 저장될 사진 세로 해상도
const FLASH_DURATION = 150;      // 플래시 깜빡임 시간 (ms)

type PhotoBoothStep = 'FRAME_SELECT' | 'CAPTURING' | 'RESULT';

const PhotoBoothPage = () => {

  const [step, setStep] = useState<PhotoBoothStep>('FRAME_SELECT');

  const [photos, setPhotos] = useState<string[]>([]);
  const [lastCaptured, setLastCaptured] = useState<string | null>(null);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

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

    if (videoRef.current && captureCanvasRef.current) {
      const context = captureCanvasRef.current.getContext('2d');
      if (context) {
        //비디오 넓이, 높이 가져오기
        const vW = videoRef.current.videoWidth;
        const vH = videoRef.current.videoHeight;

        // 아직 영상 준비 안됐으면 종료
        if (vW === 0 || vH === 0) return "";

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

    const link = document.createElement('a');
    link.download = `eduplay-${Date.now()}.png`;
    link.href = previewCanvasRef.current.toDataURL('image/png');
    link.click();
  };

  const drawResultPreview = async () => {
    if (!previewCanvasRef.current || photos.length !== SELECT_COUNT) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600;
    const h = 1800;

    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = '#FFDEE9';
    ctx.fillRect(0, 0, w, h);

    const padding = 40;
    const imgW = w - padding * 2;
    const imgH = (imgW / 3) * 2;
    const gap = 30;

    const images = await Promise.all(
      photos.map((src) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );

    images.forEach((img, i) => {
      ctx.drawImage(
        img,
        padding,
        padding + i * (imgH + gap),
        imgW,
        imgH
      );
    });

    ctx.fillStyle = '#FF69B4';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EduPlay Photo', w / 2, h - 120);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#888';
    ctx.fillText(new Date().toLocaleDateString(), w / 2, h - 70);
  };

  useEffect(() => {
    if (step === 'RESULT' && photos.length === SELECT_COUNT) {
      drawResultPreview();
    }
  }, [step, photos]);

  return (
    <div className="bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 bg-fixed flex flex-col items-center min-h-screen !min-h-[100dvh]">
      {/* 서브헤더 */}
      <SubHeader title={"네컷사진"} />

      <main className="flex-1 flex flex-col items-center justify-center w-full p-4 relative">

        {step === 'FRAME_SELECT'&& (
          <ChunkyButton onClick={startSequence} icon={Camera}>
            촬영시작
          </ChunkyButton>
        )}


        {step === 'CAPTURING' && (
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <div className="relative w-full aspect-[3/2] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white" style={{ transform: 'translateZ(0)' }}>
              {/* 플래쉬 효과 */}
              {flash && <div className="absolute inset-0 bg-white z-[60] animate-out fade-out duration-150" />}

              {/* 결과물 피드백 팝업 복구 */}
              {lastCaptured && (
                <div className="absolute inset-0 z-50 animate-in fade-in zoom-in duration-300">
                  <img src={lastCaptured} className="w-full h-full object-cover" alt="last captured" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                    멋져요! 👍
                  </div>
                </div>
              )}

              {!lastCaptured && (
                <>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full z-20 border border-white/20">
                    <span className="text-white font-black text-lg">{photos.length + 1} / {TOTAL_SHOTS}</span>
                  </div>

                  {countdown && (
                    <div className="absolute bottom-0 inset-x-0 flex items-center justify-center z-10">
                      <span className="text-[4rem] font-black text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 duration-200">
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
          <div className="flex flex-col items-center">

            {/* 프레임 영역 */}
            {/* <canvas
              ref={previewCanvasRef}
              className="w-full max-w-[280px] rounded-xl shadow-2xl border-8 border-white bg-[#FFDEE9]"
            /> */}

            <canvas
              ref={previewCanvasRef}
              className="h-[60vh] min-h-[600px] w-auto rounded-xl shadow-2xl border-8 border-white bg-[#FFDEE9]"
            />

            {/* 저장버튼 */}
            <button
              onClick={saveResult}
              className={`w-full mt-8 py-5 rounded-3xl font-black text-xl shadow-lg transition-all ${photos.length === SELECT_COUNT
                ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-[0_6px_0_rgb(190,24,93)] active:translate-y-1 active:shadow-none'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              <Download className="inline-block mr-2" /> 사진 저장하기
            </button>
          </div>
        )}
      </main>


      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
};

export default PhotoBoothPage;
