import { useEffect, useRef, useState } from 'react';
import { Trash, Trash2, X } from 'lucide-react';

interface KidCardProps {
  kidName: string;
  image: Blob | File;
  onRemove: () => void;
  onNameChange: (newName: string) => void;
  isEditMode: boolean;
  maxLength: number;
}

export default function KidCard({ kidName, image, onRemove, onNameChange, isEditMode, maxLength }: KidCardProps) {

  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 이미지 객체가 바뀔 때마다 새로운 URL 생성
    setIsLoaded(false);
    const url = URL.createObjectURL(image);
    setImageUrl(url);

    // 청소: 다음 실행 전이나 언마운트 시 기존 URL 파기
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const handleClearName = () => {
    onNameChange("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative w-full bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-md transition-all duration-300 h-fit">

      {/* 사진 */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">

        {/* 스켈레톤 애니메이션 */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            {/* 아이들 앱에 어울리는 귀여운 아이콘을 넣어도 좋아요 */}
          </div>
        )}

        <img
          src={imageUrl}
          alt={kidName}
          className="w-full h-full object-cover"
          onLoad={() => setIsLoaded(true)}
        />

        {/* 삭제 버튼 */}
        {isEditMode &&
          <div className="absolute top-1.5 right-1.5 z-10">
            <button
              onClick={onRemove}
              className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all active:scale-90">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        }
      </div>

      {/* 이름 */}
      <div className="p-2 bg-white border-t border-purple-50">

        {isEditMode
          ?
          // <input
          //   type="text"
          //   value={kidName}
          //   onChange={(e) => onNameChange(e.target.value)}
          //   onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          //   //className="w-full bg-gray-50 border text-[11px] text-center py-1.5 px-1 rounded-lg outline-none transition-all font-bold text-gray-700"
          // className="w-full bg-yellow-50 border-2 border-dashed border-yellow-300 text-[13px] text-center py-1.5 px-1 rounded-xl outline-none transition-all font-bold text-yellow-900 focus:bg-white focus:border-solid focus:border-purple-400 focus:ring-2 focus:ring-purple-100 placeholder-yellow-300"
          // />

          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={kidName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              maxLength={maxLength}
              placeholder="이름 입력..."
              // 노란색(yellow)을 버리고 보라색(purple)과 분홍색(pink) 계열로 교체
              className="w-full bg-purple-50/50 border-2 border-dashed border-purple-200 py-1.5 pl-2 pr-7 rounded-xl outline-none transition-all font-bold text-purple-700 focus:bg-white focus:border-solid focus:border-purple-400 placeholder-purple-300 text-[13px]"
            />
            {/* 텍스트 전체 삭제 버튼 */}
            {kidName.length > 0 && (
              <button
                onClick={handleClearName}
                className="absolute right-1.5 p-0.5 bg-purple-200 hover:bg-purple-300 rounded-full transition-colors cursor-pointer"
                title="이름 지우기"
              >
                <X className="w-3 h-3 text-purple-600" />
              </button>
            )}
          </div>
          :
          <div className='text-center truncate px-1'>
            {kidName}
          </div>
        }
      </div>
    </div>
  );
};