import { useNavigate } from "react-router-dom";
import ChunkyButton from "./ChunkyButton";

type HomeChunkyButtonProps = {
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'disabled';
    title: string;
    icon: string;
    badge?: string;
    url: string;
    disabled?: boolean;
}

export default function HomeChunkyButton({
    variant,
    title,
    icon,
    badge,
    url,
    disabled = false,
}: HomeChunkyButtonProps) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(url);
    }


    return (
        <ChunkyButton
            variant={variant}
            size='xl'
            onClick={handleClick}
            disabled={disabled}            
            className='relative !p-0 aspect-square flex items-center justify-center overflow-hidden'
        >
            <div className={`flex flex-col items-center justify-center text-center p-2 w-full h-full transition-all duration-300 ${variant === 'disabled' ? ' grayscale optical-80' : ''}`}>
                {badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-md animate-bounce z-20">
                        {badge}
                    </span>
                )}
                <div className="mb-4 transform hover:scale-110 transition-transform">
                    <img src={icon} alt={title} className="w-20 h-20 md:w-28 md:h-28 object-contain" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-sm">
                    {title}
                </h3>
            </div>

            {/* 🚧 공사 중 테이프 오버레이 🚧 */}
            {variant === 'disabled' && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-30 pointer-events-none">
                    
                    {/* 얇은 테이프 */}
                    <div className="absolute w-[150%] h-4 bg-[repeating-linear-gradient(45deg,#fdd835_0px,#fdd835_8px,#212121_8px,#212121_16px)] shadow-md rotate-[10deg] opacity-90 border-y-2 border-[#212121]/50">
                    </div>

                    {/* 대각선 노랑/검정 스트라이프 구현 */}
                    {/* w-[150%]로 회전했을 때 모서리를 다 덮음 */}
                    {/* bg-[repeating-linear-gradient(...)]로 임의의 스트라이프 패턴 적용 */}
                    <div className="absolute w-[150%] h-8 bg-[repeating-linear-gradient(-45deg,#fdd835_0px,#fdd835_10px,#212121_10px,#212121_20px)] shadow-lg rotate-[-15deg] flex items-center justify-center border-y-2 border-[#212121]/50">
                        {/*  테이프 중앙에 글자가 잘 보이게 노란 바탕을 깔고 멘트를 줄임 */}
                        <div className="bg-[#fdd835] px-3 rounded-sm shadow-inner">
                            <span className="text-[#212121] font-black text-sm whitespace-nowrap tracking-wider drop-shadow-sm">
                                🚧 준비중.. 🚧
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </ChunkyButton>
    );
}