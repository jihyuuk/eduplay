
//좌푯값은 모두 % 기준
export type BoxRegion = {
    x: number;      // minX (시작점 X)
    y: number;      // minY (시작점 Y)
    w: number;  // 가로 폭
    h: number; // 세로 높이
};

type FacePartProps = {
    image: string;
    part: BoxRegion;
    visible: boolean;
};


// 4개의 꼭짓점 배열을 CSS polygon 구조로 변경하는 함수
function boxToEllipse(rect: BoxRegion) {
    if (!rect) return "none";

    //radius를 위한 중앙 값 구하기
    const centerX = rect.x + (rect.w / 2);
    const centerY = rect.y + (rect.h / 2);

    const rx = rect.w / 2;
    const ry = rect.h / 2;

    return `ellipse(${rx}% ${ry}% at ${centerX}% ${centerY}%)`;
}

export default function FacePart({ image, part, visible }: FacePartProps) {
    return (
        <img
            src={image}
            alt="눈코입"
            className={`
                absolute inset-0 w-full h-full object-cover z-10
                transition-all duration-300 origin-center
                ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
            style={{
                clipPath: boxToEllipse(part),
            }}
        />
    );
}