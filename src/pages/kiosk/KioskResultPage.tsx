//import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Check } from "lucide-react";
import ChunkyButton from "../../components/ChunkyButton";
import { productsData, type KioskOutletContext } from "./KioskLayout";

export default function KioskResultPage() {

    const { products, setProducts } = useOutletContext<KioskOutletContext>();
    const navigate = useNavigate();

    // const orderNumber = useMemo(() => {
    //     const randomNumber = Math.floor(Math.random() * 999) + 1;
    //     return String(randomNumber).padStart(3, "0");
    // }, []);

    const orderItems = products.filter(product => product.quantity > 0);

    const totalPrice = orderItems.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    const goHome = () => {
        setProducts(productsData);
        navigate(-4);
    };

    return (
        <div className="bg-gradient-to-tr from-rose-100 via-sky-50 to-amber-100 bg-fixed min-h-[100dvh] flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm h-screen !h-[100dvh] w-full max-w-3xl mx-auto flex flex-col overflow-hidden shadow-2xl relative">

                {/* 귀여운 어닝 (둥근 천막 스타일) */}
                <div className="flex w-full h-16 shrink-0 drop-shadow-md z-10">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-b-full ${i % 2 === 0 ? "bg-rose-400" : "bg-white"
                                }`}
                        />
                    ))}
                </div>

                {/* 메인 스크롤 영역 (요소들을 중앙 정렬하여 여백을 예쁘게 분배) */}
                <main className="flex-1 min-h-0 overflow-y-auto p-6 py-10 bg-gray-50/50 flex flex-col items-center justify-center gap-8">

                    {/* 완료 상단 섹션 */}
                    <section className="flex flex-col items-center text-center animate-fade-in">
                        {/* 청키 스타일 체크 서클 */}
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400 border-4 border-emerald-500 text-white shadow-[0_6px_0_0_#059669] mb-4 ">
                            <Check size={54} strokeWidth={4} />
                        </div>
                        <h1 className="mt-2 text-3xl font-black text-gray-700 tracking-tight">
                            주문이 완료됐어요!
                        </h1>
                    </section>

                    {/* ★ 슬림하고 깜찍해진 주문 내역 (영수증 콘셉트) */}
                    <div className="flex-1 overflow-y-auto relative w-full max-w-md bg-[#FAFAFA] border-x-4 border-purple-100 p-6 pt-10 pb-4 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col shrink-0 animate-fade-in before:absolute before:top-0 before:left-0 before:right-0 before:h-3 before:bg-purple-100 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-3 after:bg-purple-100"
                        style={{
                            // 영수증 상하단 지그재그 모양을 만드는 clip-path 스타일
                            clipPath: "polygon(0% 0%, 5% 3%, 10% 0%, 15% 3%, 20% 0%, 25% 3%, 30% 0%, 35% 3%, 40% 0%, 45% 3%, 50% 0%, 55% 3%, 60% 0%, 65% 3%, 70% 0%, 75% 3%, 80% 0%, 85% 3%, 90% 0%, 95% 3%, 100% 0%, 100% 100%, 95% 97%, 90% 100%, 85% 97%, 80% 100%, 75% 97%, 70% 100%, 65% 97%, 60% 100%, 55% 97%, 50% 100%, 45% 97%, 40% 100%, 35% 97%, 30% 100%, 25% 97%, 20% 100%, 15% 97%, 10% 100%, 5% 97%, 0% 100%)"
                        }}>

                        {/* 영수증 헤더: 구분선을 더 확실한 대시(dashed) 스타일로 변경 */}
                        <div className="mb-5 flex flex-col items-center justify-center border-b-4 border-dashed border-gray-300 pb-4">
                            <h2 className="text-4xl font-black text-gray-700 tracking-wider">영수증</h2>
                            {/* <h2 className="text-md font-black text-gray-500 tracking-wider mt-2">주문번호</h2>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 drop-shadow-sm mt-1 mb-2">
                                {orderNumber}번
                            </div> */}

                        </div>

                        {/* 주문 상품 리스트: 진짜 영수증처럼 폰트를 꾹꾹 눌러쓴 느낌으로 조정 */}
                        <div className="overflow-y-auto flex-1 pr-1 divide-y-2 divide-dashed divide-gray-200/60">
                            {orderItems.map(product => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between py-3.5 first:pt-0"
                                >
                                    <div className="text-lg font-black text-gray-600 tracking-tight">
                                        {product.name}
                                    </div>

                                    <div className="text-lg font-black text-gray-500">
                                        {product.quantity} 개
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 최종 합계 보드: 영수증 하단 위아래 두 줄 라인 포인트 */}
                        <div className="mt-5 border-t-4 border-double border-gray-300 py-4 flex items-center justify-between">
                            <div className="text-xl font-black text-gray-700">합계 금액</div>
                            <div className="text-3xl font-black text-purple-600">
                                {totalPrice.toLocaleString()}원
                            </div>
                        </div>
                    </div>

                </main>

                {/* 하단 완료 완료 버튼 구역 */}
                <footer className="shrink-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] z-10 flex justify-center h-[100px]">
                    <ChunkyButton
                        variant="success"
                        className="w-full"
                        onClick={goHome}
                    >
                        처음으로 돌아가기
                    </ChunkyButton>
                </footer>
            </div>
        </div>
    );
}