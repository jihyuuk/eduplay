import { X, Plus, Minus, CreditCard, ShoppingBag, ChevronLeft } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ChunkyButton from "../../components/ChunkyButton";
import type { KioskOutletContext } from "./KioskLayout";
import toast from "react-hot-toast";

export default function KioskCartPage() {
    const { products, setProducts } = useOutletContext<KioskOutletContext>();
    const navigate = useNavigate();
    const cartItems = products.filter(product => product.quantity > 0);
    const totalPrice = cartItems.reduce((sum, product) => sum + product.price * product.quantity, 0);

    const removeItem = (productId: number) => {
        setProducts(prev =>
            prev.map(product => product.id === productId ? { ...product, quantity: 0 } : product)
        );
    };

    const increaseQuantity = (productId: number) => {
        setProducts(prev =>
            prev.map(product => product.id === productId ? { ...product, quantity: product.quantity + 1 } : product)
        );
    };

    const decreaseQuantity = (productId: number) => {
        setProducts(prev =>
            prev.map(product => product.id === productId ? { ...product, quantity: Math.max(1, product.quantity - 1) } : product)
        );
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

                {/* 헤더 */}
                <header className="shrink-0 p-5 bg-white shadow-sm text-center">
                    <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400 drop-shadow-sm">
                        장바구니
                    </h1>
                </header>

                {/* 메인 리스트 영역 */}
                <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50/50 p-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-400">
                            <ShoppingBag size={80} strokeWidth={1.5} className="text-gray-300 animate-bounce" />
                            <div className="text-2xl font-black">담은 상품이 없어요</div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cartItems.map(product => (
                                <div
                                    key={product.id}
                                    className="relative flex gap-4 rounded-[2rem] border-4 border-purple-100/80 bg-white p-4 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.05)] transition-all"
                                >
                                    {/* 청키 스타일 삭제 버튼 */}
                                    <button
                                        onClick={() => removeItem(product.id)}
                                        className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 border-4 border-white text-gray-400 shadow-md hover:bg-rose-100 hover:text-rose-500 transition-colors z-10"
                                    >
                                        <X size={18} strokeWidth={3} />
                                    </button>

                                    {/* 이미지 윈도우 */}
                                    <div className="h-24 w-24 shrink-0 rounded-2xl border-2 border-purple-50 bg-pink-50/40 p-2 flex items-center justify-center overflow-hidden">
                                        {/* <img
                                            src={product.imgUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover rounded-xl mix-blend-multiply"
                                        /> */}

                                        <div className="text-4xl">
                                            {product.emoji}
                                        </div>
                                    </div>

                                    {/* 상품 상세 및 수량 조절 */}
                                    <div className="flex-1 pr-4 flex flex-col justify-between">
                                        <div>
                                            <div className="text-2xl font-black text-gray-700 tracking-tight">
                                                {product.name}
                                            </div>
                                            <div className="mt-0.5 text-sm text-gray-400 font-extrabold">
                                                단가 {product.price.toLocaleString()}원
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-end justify-between gap-2">
                                            {/* 미니 청키 수량 조절 바 */}
                                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                                <button
                                                    onClick={() => decreaseQuantity(product.id)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 border-2 border-rose-200 text-rose-500 text-lg font-black shadow-[0_2px_0_0_#fecdd3] active:translate-y-[2px] active:shadow-none transition-all"
                                                >
                                                    <Minus size={14} strokeWidth={3} />
                                                </button>

                                                <div className="w-8 text-center text-lg font-black font-mono text-gray-700">
                                                    {product.quantity}
                                                </div>

                                                <button
                                                    onClick={() => increaseQuantity(product.id)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400 border-2 border-sky-500 text-white text-lg font-black shadow-[0_2px_0_0_#0284c7] active:translate-y-[2px] active:shadow-none transition-all"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </button>
                                            </div>

                                            {/* 아이템별 합계 */}
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-gray-400">합계</div>
                                                <div className="text-xl font-black text-amber-500">
                                                    {(product.price * product.quantity).toLocaleString()}원
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* 하단 총합 금액 및 버튼 영역 */}
                <footer className="shrink-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] z-10">
                    <div className="mb-4 flex items-center justify-between px-2">
                        <span className="text-2xl font-black text-gray-700">총 결제금액</span>
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 drop-shadow-sm">
                            {totalPrice.toLocaleString()}원
                        </span>
                    </div>

                    <div className="flex gap-3 h-[67px]">
                        <ChunkyButton
                            icon={ChevronLeft}
                            variant="secondary"
                            className="shrink-0 font-black text-lg"
                            onClick={() => navigate(-1)}
                        >
                            더 담기
                        </ChunkyButton>

                        <ChunkyButton
                            icon={CreditCard}
                            className="w-full font-black text-xl bg-gradient-to-r from-orange-400 to-rose-400 border-orange-500 shadow-[0_5px_0_0_#ea580c]"
                            onClick={() => {
                                if (totalPrice <= 0) {

                                    toast.error(
                                        "결제할 상품이 없어요",
                                        {
                                            position: "bottom-center", // 하단 중앙에 띄우기
                                            style: {
                                                marginBottom: "120px", // ⭐ 이 값을 늘릴수록 하단에서 더 위로 올라갑니다!
                                            },
                                        }
                                    );

                                    return;
                                }
                                navigate("/kiosk/payment")
                            }
                            }
                        >
                            결제하기
                        </ChunkyButton>
                    </div>
                </footer>
            </div>
        </div>
    );
}