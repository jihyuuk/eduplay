import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Check, ReceiptText } from "lucide-react";
import ChunkyButton from "../../components/ChunkyButton";
import { productsData, type KioskOutletContext } from "./KioskLayout";

export default function KioskResultPage() {
    
    const { products, setProducts } = useOutletContext<KioskOutletContext>();
    const navigate = useNavigate();

    const orderNumber = useMemo(() => {
        const randomNumber = Math.floor(Math.random() * 999) + 1;
        return String(randomNumber).padStart(3, "0");
    }, []);

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
                <main className="flex-1 min-h-0 overflow-y-auto p-6 bg-gray-50/50 flex flex-col items-center justify-center gap-8">

                    {/* 완료 상단 섹션 */}
                    <section className="flex flex-col items-center text-center animate-fade-in">
                        {/* 청키 스타일 체크 서클 */}
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400 border-4 border-emerald-500 text-white shadow-[0_6px_0_0_#059669] mb-4 animate-bounce">
                            <Check size={56} strokeWidth={4} />
                        </div>

                        <div className="text-lg font-black text-gray-400">주문번호</div>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 drop-shadow-sm mt-1 mb-2">
                            {orderNumber}번
                        </div>

                        <h1 className="text-3xl font-black text-gray-700 tracking-tight">
                            주문이 완료됐어요!
                        </h1>
                    </section>

                    {/* ★ 슬림하고 깜찍해진 주문 내역 (영수증 콘셉트) */}
                    <div className="w-full max-w-md bg-white border-4 border-purple-100 rounded-[2.5rem] p-6 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col shrink-0 animate-fade-in">

                        {/* 영수증 헤더 */}
                        <div className="mb-4 flex items-center gap-2 border-b-4 border-dashed border-gray-100 pb-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500 border border-orange-100">
                                <ReceiptText size={20} />
                            </div>
                            <h2 className="text-xl font-black text-gray-700">주문 내역</h2>
                        </div>

                        {/* 주문 상품 리스트 (수량에 맞게 콤팩트하게 줄어듦, 많아지면 스크롤) */}
                        <div className="overflow-y-auto max-h-48 pr-1 divide-y-2 divide-gray-50/50">
                            {orderItems.map(product => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between py-3 first:pt-0"
                                >
                                    <div className="text-lg font-extrabold text-gray-600 tracking-tight">
                                        {product.name}
                                    </div>

                                    <div className="rounded-xl bg-sky-50 border border-sky-100 px-3 py-0.5 text-base font-black text-sky-600">
                                        x {product.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 최종 합계 보드 */}
                        <div className="mt-4 rounded-2xl bg-amber-50/70 border-2 border-amber-100 px-4 py-3.5 flex items-center justify-between">
                            <div className="text-lg font-black text-gray-600">총 금액</div>
                            <div className="text-3xl font-black text-amber-500">
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