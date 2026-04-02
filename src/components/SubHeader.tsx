import React, { type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import ChunkyIconButton from './ChunkyIconButton';
import { useNavigate } from 'react-router-dom';

interface SubHeaderProps {
  title: string;
  rightElement?: ReactNode;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title, rightElement }) => {

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b-2 md:border-b-4 border-pink-50 px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto relative">

        {/* 왼쪽: 뒤로가기 (고정 너비 확보) */}
        <div className="z-10">
          <ChunkyIconButton onClick={handleGoBack} variant='white' icon={ChevronLeft} className='!px-3' strokeWidth={3} />
        </div>

        {/* 중앙: 타이틀 (절대 위치로 중앙 정렬 보장) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg sm:text-xl md:text-2xl text-pink-500 drop-shadow-sm truncate max-w-[60%] text-center px-2 mt-[4px] md:mt-[6px]">
            {title}
          </h1>
        </div>

        {/* 오른쪽: 유틸리티 */}
        <div className="z-10 flex justify-end gap-2">
          {rightElement ? (
            rightElement
          ) : (
            <div className="w-[40px] sm:w-[44px]" />
          )}
        </div>
      </div>
    </header>
  );
};

export default SubHeader;