import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Download, RefreshCcw } from 'lucide-react';

// ==========================================
// ⚙️ 포토부스 설정 상수 (필요에 따라 변경하세요)
// ==========================================
const TOTAL_SHOTS = 6;  // 총 촬영할 사진 장수 (예: 4장, 6장, 8장 등)
const SELECT_COUNT = 4; // 최종 프레임에 들어갈 선택 장수 (네컷사진이므로 보통 4)
const COUNTDOWN_SECONDS = 5; // 카운트다운 초 설정

const PhotoBoothPage = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastCaptured, setLastCaptured] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("카메라 에러:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const vW = videoRef.current.videoWidth;
        const vH = videoRef.current.videoHeight;
        const targetRatio = 3 / 2;
        
        let drawW = vW;
        let drawH = vW / targetRatio;
        if (drawH > vH) {
          drawH = vH;
          drawW = vH * targetRatio;
        }

        canvasRef.current.width = 600;
        canvasRef.current.height = 400;
        context.translate(600, 0);
        context.scale(-1, 1);
        context.drawImage(videoRef.current, (vW - drawW) / 2, (vH - drawH) / 2, drawW, drawH, 0, 0, 600, 400);
        
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
        
        return dataUrl;
      }
    }
    return "";
  };

  // 설정된 TOTAL_SHOTS 만큼 반복하도록 루프 수정
  const startSequence = async () => {
    setIsCapturing(true);
    setPhotos([]);
    setSelectedPhotos([]);
    
    for (let i = 0; i < TOTAL_SHOTS; i++) {
      setCurrentStep(i + 1);
      setLastCaptured(null);
      
      for (let c = COUNTDOWN_SECONDS; c > 0; c--) {
        setCountdown(c);
        await new Promise(r => setTimeout(r, 1000));
      }
      
      setCountdown(null);
      await new Promise(r => setTimeout(r, 100));
      
      const captured = takeSelfie();
      setPhotos(prev => [...prev, captured]);
      setLastCaptured(captured);
      
      await new Promise(r => setTimeout(r, 2000));
    }
    
    setIsCapturing(false);
    setLastCaptured(null);
    stopCamera();
  };

  // 설정된 SELECT_COUNT 만큼만 선택 가능하도록 제한 수정
  const toggleSelect = (index: number) => {
    if (selectedPhotos.includes(index)) {
      setSelectedPhotos(selectedPhotos.filter(i => i !== index));
    } else if (selectedPhotos.length < SELECT_COUNT) {
      setSelectedPhotos([...selectedPhotos, index]);
    }
  };

  const saveFourCut = () => {
    if (selectedPhotos.length !== SELECT_COUNT || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const w = 600;
    const h = 1800;
    canvasRef.current.width = w;
    canvasRef.current.height = h;

    ctx.fillStyle = '#FFDEE9';
    ctx.fillRect(0, 0, w, h);

    const padding = 40;
    const imgW = w - (padding * 2);
    const imgH = (imgW / 3) * 2;
    const gap = 30;

    selectedPhotos.forEach((photoIndex, i) => {
      const img = new Image();
      img.src = photos[photoIndex];
      img.onload = () => {
        ctx.drawImage(img, padding, padding + (i * (imgH + gap)), imgW, imgH);
        if (i === SELECT_COUNT - 1) {
          ctx.fillStyle = '#FF69B4';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('EduPlay Photo', w / 2, h - 120);
          ctx.font = '24px Arial';
          ctx.fillStyle = '#888';
          ctx.fillText(new Date().toLocaleDateString(), w / 2, h - 70);

          const link = document.createElement('a');
          link.download = `eduplay-${Date.now()}.png`;
          link.href = canvasRef.current!.toDataURL();
          link.click();
        }
      };
    });
  };

  const handleRetry = () => {
    setPhotos([]);
    setSelectedPhotos([]);
    setCurrentStep(0);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-[#FFF5F7] min-h-screen">
      <header className="w-full max-w-4xl flex items-center justify-between mb-6">
        <button className="p-3 bg-white rounded-full shadow-md text-gray-600"><ArrowLeft size={24}/></button>
        <h1 className="text-2xl font-black text-pink-500 tracking-tight">📸 EDU-PLAY PHOTOBOOTH</h1>
        <div className="w-12" />
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        {/* 카메라 영역 */}
        {(isCapturing || (photos.length === 0 && stream)) && (
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <div className="relative w-full aspect-[3/2] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white">
              {/* 플래시 레이어 */}
              {flash && <div className="absolute inset-0 bg-white z-[60] animate-out fade-out duration-150" />}
              
              {/* 방금 찍힌 사진 미리보기 레이어 */}
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
                {/* 상수에 연동된 우측 하단 스텝 카운터 */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full z-20 border border-white/20">
                    <span className="text-white font-black text-lg">{currentStep} / {TOTAL_SHOTS}</span>
                </div>

                {/* 하단 가운데 카운트다운 숫자 */}
                {countdown && (
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-center z-10">
                    <span className="text-[4rem] font-black text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 duration-200">
                    {countdown}
                    </span>
                </div>
                )}
                </>
              )}
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
            </div>
            {!isCapturing && (
              <button onClick={startSequence} className="w-full py-6 bg-orange-400 text-white rounded-3xl font-black text-2xl shadow-[0_8px_0_rgb(234,88,12)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
                <Camera size={32} /> 사진 촬영 시작!
              </button>
            )}
          </div>
        )}

        {/* 촬영 완료 후 UI */}
        {photos.length === TOTAL_SHOTS && !isCapturing && (
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 animate-in fade-in duration-700">
            {/* 사진 선택 리스트 (그리드 레이아웃 유지) */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-pink-100">
                <h2 className="text-center text-xl font-bold text-gray-800 mb-6">마음에 드는 {SELECT_COUNT}장을 순서대로 눌러주세요! ✨</h2>
                <div className="grid grid-cols-2 gap-4">
                  {photos.map((src, i) => (
                    <div key={i} onClick={() => toggleSelect(i)} className={`relative cursor-pointer rounded-2xl overflow-hidden border-8 transition-all ${selectedPhotos.includes(i) ? 'border-pink-500 scale-95' : 'border-gray-50'}`}>
                      <img src={src} className="w-full object-cover" alt={`shot-${i}`} />
                      {selectedPhotos.includes(i) && (
                        <div className="absolute inset-0 bg-pink-500/40 flex items-center justify-center">
                          <div className="bg-white text-pink-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-black">{selectedPhotos.indexOf(i) + 1}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleRetry} className="flex items-center justify-center gap-2 text-gray-400 font-medium hover:text-pink-400 transition-colors">
                <RefreshCcw size={18}/> 다시 촬영하기
              </button>
            </div>

            {/* 인화지 미리보기 (SELECT_COUNT 상수에 맞게 루프 생성) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[280px] aspect-[1/3] bg-[#FFDEE9] rounded-xl shadow-2xl p-5 flex flex-col gap-4 border-[12px] border-white relative">
                {Array.from({ length: SELECT_COUNT }).map((_, slot) => (
                  <div key={slot} className="w-full aspect-[3/2] bg-white/50 rounded-lg overflow-hidden flex items-center justify-center border-2 border-pink-200">
                    {selectedPhotos[slot] !== undefined ? (
                      <img src={photos[selectedPhotos[slot]]} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
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
                onClick={saveFourCut}
                disabled={selectedPhotos.length !== SELECT_COUNT}
                className={`w-full mt-8 py-5 rounded-3xl font-black text-xl shadow-lg transition-all ${
                  selectedPhotos.length === SELECT_COUNT 
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