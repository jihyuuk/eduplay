import { useNavigate } from "react-router-dom";
import ChunkyButton from "./ChunkyButton";

type HomeChunkyButtonProps = {
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'white' | 'disabled';
    title: string;
    icon: string;
    badge?: string;
    url: string;
}

export default function HomeChunkyButton({
    variant,
    title,
    icon,
    badge,
    url,
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
            className='relative !p-0 aspect-square flex items-center justify-center'
        >
            <div className="flex flex-col items-center text-center p-2">
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
        </ChunkyButton>
    );
}