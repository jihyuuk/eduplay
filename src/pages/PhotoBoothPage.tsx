import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Download, RefreshCcw } from 'lucide-react';

// ==========================================
// ⚙️ 포토부스 설정 상수
// ==========================================
const TOTAL_SHOTS = 4;
const SELECT_COUNT = 4;
const COUNTDOWN_SECONDS = 5;

const TARGET_RATIO = 3 / 2;      // 원하는 사진 비율 (3:2)
const CANVAS_WIDTH = 600;        // 저장될 사진 가로 해상도
const CANVAS_HEIGHT = 400;       // 저장될 사진 세로 해상도
const FLASH_DURATION = 150;      // 플래시 깜빡임 시간 (ms)

const PhotoBoothPage = () => {

  const [photos, setPhotos] = useState<string[]>([]);
  const [lastCaptured, setLastCaptured] = useState<string | null>(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  const takeSelfie = () => {

    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
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
        canvasRef.current.width = CANVAS_WIDTH;
        canvasRef.current.height = CANVAS_HEIGHT;

        //좌우반전
        context.save();
        context.translate(CANVAS_WIDTH, 0);
        context.scale(-1, 1);

        //비디오 프레임 캡처
        context.drawImage(videoRef.current, (vW - drawW) / 2, (vH - drawH) / 2, drawW, drawH, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.restore(); // 변형된 좌표계를 원래대로 복구

        //캔버스를 PNG 이미지로 변환
        const dataUrl = canvasRef.current.toDataURL('image/png');

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
    setIsCapturing(true);
    setLastCaptured(null);

    // 1. 버튼 클릭 직후 카메라 스트림을 연결하여 자동재생 락 해제
    const activeStream = await startCamera();
    if (!activeStream) {
      alert("카메라를 시작할 수 없습니다. 권한을 확인해주세요.");
      setIsCapturing(false);
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
      const captured = takeSelfie();
      if (captured) {
        setPhotos(prev => [...prev, captured]);
        setLastCaptured(captured); // ✨ 방금 찍은 사진 팝업 노출
      }

      // 👍 아이들이 결과물을 확인할 수 있도록 2초간 멈춤 대기
      await new Promise(r => setTimeout(r, 2000));
    }

    // 4. 촬영 완료 후 정리 및 카메라 Off ➡️ 사진 고르기 UI 자동 진입
    setIsCapturing(false);
    setLastCaptured(null);
    stopCamera();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-[#FFF5F7] min-h-screen">
      <header className="w-full max-w-4xl flex items-center justify-between mb-6">
        <button className="p-3 bg-white rounded-full shadow-md text-gray-600"><ArrowLeft size={24} /></button>
        <h1 className="text-2xl font-black text-pink-500 tracking-tight">📸 EDU-PLAY PHOTOBOOTH</h1>
        <div className="w-12" />
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        {/* [조건식 복구] 촬영 중이거나, 촬영 전 초기 대기 상태일 때 비디오 스크린 노출 */}
        {(isCapturing || photos.length === 0) && (
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <div className="relative w-full aspect-[3/2] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white" style={{ transform: 'translateZ(0)' }}>
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

              {isCapturing && !lastCaptured && (
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
            {!isCapturing && (
              <button onClick={startSequence} className="w-full py-6 bg-orange-400 text-white rounded-3xl font-black text-2xl shadow-[0_8px_0_rgb(234,88,12)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
                <Camera size={32} /> 사진 촬영 시작!
              </button>
            )}
          </div>
        )}

        {/* 촬영 완료 후 4컷 선택 UI 완벽 노출 */}
        {photos.length === TOTAL_SHOTS && !isCapturing && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 animate-in fade-in duration-700">

            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[280px] aspect-[1/3] bg-[#FFDEE9] rounded-xl shadow-2xl p-5 flex flex-col gap-4 border-[12px] border-white relative">
                {Array.from({ length: SELECT_COUNT }).map((_, slot) => (
                  <div key={slot} className="w-full aspect-[3/2] bg-white/50 rounded-lg overflow-hidden flex items-center justify-center border-2 border-pink-200">
                    {photos[slot] !== undefined ? (
                      <img src={photos[slot]} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
                    ) : (
                      <Camera className="text-pink-200" size={40} />
                    )}
                  </div>
                ))}
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                  <p className="text-[12px] font-black text-pink-500 tracking-widest">EDUPLAY PHOTO</p>
                  <p className="text-[10px] text-pink-400 font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <button
                className={`w-full mt-8 py-5 rounded-3xl font-black text-xl shadow-lg transition-all ${photos.length === SELECT_COUNT
                  ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-[0_6px_0_rgb(190,24,93)] active:translate-y-1 active:shadow-none'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <Download className="inline-block mr-2" /> 사진 저장하기
              </button>
            </div>
          </div>
        )}
      </main>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoBoothPage;