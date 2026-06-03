import { useState } from "react";
import ChunkyButton from "../../components/ChunkyButton";
import { Home, X, ShoppingBasket, Plus, Minus } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import type { KioskOutletContext } from "./KioskLayout";

export type Category = "과자" | "라면" | "음료수" | "아이스크림";
const categories: Category[] = ["과자", "라면", "음료수", "아이스크림"]

export type Product = {
    id: number;
    imgUrl: string;
    name: string;
    price: number;
    quantity: number;
    category: Category;
}

export default function KioskOrderPage() {
    const navigate = useNavigate();
    const { products, setProducts } = useOutletContext<KioskOutletContext>();
    const [selectedCategory, setSelectedCategory] = useState("과자");

    const showProducts = products.filter(p => p.category === selectedCategory);
    const totalAmount = products.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalQuantity, setModalQuantity] = useState(1);

    const showQtyModal = (product: Product) => {
        setSelectedProduct(product);
        setModalQuantity(1);
    }

    const closeQtyModal = () => {
        setSelectedProduct(null);
        setModalQuantity(1);
    }

    const addToCart = () => {
        setProducts(prev =>
            prev.map(product =>
                product.id === selectedProduct?.id ? { ...product, quantity: product.quantity + modalQuantity } : product
            )
        );
        closeQtyModal();
        toast.success(
            selectedProduct?.name + " " + modalQuantity + "개 장바구니에 쏘옥~",
            {
                position: "bottom-center", // 하단 중앙에 띄우기
                style: {
                    marginBottom: "120px", // ⭐ 이 값을 늘릴수록 하단에서 더 위로 올라갑니다!
                },
            }
        );
    }

    const goToCartPage = () => {
        navigate("/kiosk/cart");
    }

    return (
        <div className="bg-gradient-to-tr from-rose-100 via-sky-50 to-amber-100 bg-fixed min-h-[100dvh] flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm h-screen !h-[100dvh] w-full max-w-3xl mx-auto flex flex-col shadow-2xl relative">

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


                {/* 헤더 (카테고리 탭) */}
                <header className="shrink-0 flex gap-2.5 items-center p-4 bg-white shadow-sm overflow-x-auto no-scrollbar">
                    {categories.map((category) => (
                        <div
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`
                                px-6 py-3 rounded-2xl font-black text-lg cursor-pointer transition-all duration-100 border-4 select-none whitespace-nowrap
                                ${selectedCategory === category
                                    ? "bg-sky-400 text-white border-sky-500 shadow-[0_4px_0_0_#0284c7] translate-y-[-2px]"
                                    : "bg-gray-50 text-gray-500 border-gray-200 shadow-[0_4px_0_0_#e5e7eb] active:translate-y-[2px] active:shadow-none"
                                }
                            `}
                        >
                            {category}
                        </div>
                    ))}
                </header>

                {/* 메인 (상품 목록) */}
                <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50/50 p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {showProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => showQtyModal(product)}
                                className="w-full bg-white border-4 border-purple-100/80 rounded-2xl p-2 cursor-pointer shadow-[0_8px_16px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group"
                            >
                                {/* 상품 이미지 컨테이너 */}
                                <div className="w-full aspect-square overflow-hidden rounded-2xl bg-pink-50/60 p-2 flex items-center justify-center relative">
                                    <img
                                        src={product.imgUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover rounded-xl mix-blend-multiply"
                                    />
                                    {product.quantity > 0 && (
                                        <div className="absolute top-2 right-2 bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md animate-pulse">
                                            {product.quantity}개 담김
                                        </div>
                                    )}
                                </div>

                                {/* 상품 정보 */}
                                <div className="mt-3 px-1 text-center">
                                    <div className="text-xl font-black text-gray-700 tracking-tight line-clamp-1">
                                        {product.name}
                                    </div>
                                    <div className="mt-1 text-lg font-extrabold text-amber-500">
                                        {product.price.toLocaleString()}원
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* 하단 취소 및 결제 버튼 영역 */}
                <footer className="h-[100px] flex p-4 gap-4 justify-center shrink-0 bg-white border-t border-gray-100 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] z-10">
                    <ChunkyButton onClick={() => navigate(-1)} icon={Home} variant="secondary" className="shrink-0 font-black text-lg px-6 !h-full">
                        홈으로
                    </ChunkyButton>

                    <ChunkyButton
                        icon={ShoppingBasket}
                        className="w-full font-black text-xl bg-gradient-to-r from-orange-400 to-rose-400 border-orange-500 shadow-[0_5px_0_0_#ea580c] !h-full"
                        onClick={goToCartPage}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span>{totalAmount.toLocaleString()}원</span>
                            <span className="opacity-60">|</span>
                            <span>장바구니 확인</span>
                        </div>
                    </ChunkyButton>
                </footer>
            </div>

            {/* 수량 선택 모달 (Chunky Pop) */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="relative w-full max-w-sm rounded-[2.5rem] border-8 border-amber-100 bg-white p-6 shadow-2xl transition-all transform scale-100">

                        {/* 닫기 버튼 */}
                        <button
                            onClick={closeQtyModal}
                            className="absolute -right-2 -top-2 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 border-4 border-white text-gray-500 shadow-md hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>

                        {/* 모달 이미지 윈도우 */}
                        <div className="mx-auto mb-4 h-44 w-44 overflow-hidden rounded-3xl flex items-center justify-center">
                            <img
                                src={selectedProduct.imgUrl}
                                alt={selectedProduct.name}
                                className="h-full w-full object-cover rounded-2xl mix-blend-multiply"
                            />
                        </div>

                        {/* 상품명 & 가격 */}
                        <div className="text-center">
                            <div className="text-3xl font-black text-gray-800 tracking-tight">
                                {selectedProduct.name}
                            </div>
                            <div className="mt-1.5 inline-block bg-sky-50 text-sky-600 text-xl font-extrabold px-4 py-1 rounded-full border border-sky-100">
                                {selectedProduct.price.toLocaleString()}원
                            </div>
                        </div>

                        {/* 청키 수량 조절 컨트롤러 */}
                        <div className="mt-6 flex items-center justify-center gap-6">
                            <button
                                onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 border-4 border-rose-200 text-rose-500 text-2xl font-black shadow-[0_4px_0_0_#fecdd3] active:translate-y-[4px] active:shadow-none transition-all"
                            >
                                <Minus size={24} strokeWidth={3} />
                            </button>

                            <div className="w-14 text-center text-4xl font-black text-gray-700 font-mono">
                                {modalQuantity}
                            </div>

                            <button
                                onClick={() => setModalQuantity(q => q + 1)}
                                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400 border-4 border-sky-500 text-white text-2xl font-black shadow-[0_4px_0_0_#0284c7] active:translate-y-[4px] active:shadow-none transition-all"
                            >
                                <Plus size={24} strokeWidth={3} />
                            </button>
                        </div>

                        {/* 장바구니 담기 버튼 */}
                        <button
                            onClick={addToCart}
                            className="mt-6 h-16 w-full rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 border-4 border-orange-500 text-white text-2xl font-black shadow-[0_6px_0_0_#ea580c] active:translate-y-[6px] active:shadow-none transition-all"
                        >
                            장바구니 담기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}