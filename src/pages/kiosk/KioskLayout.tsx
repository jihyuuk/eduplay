import { Outlet } from "react-router-dom";
import { useState } from "react";
import type { Product } from "./KioskOrderPage";

export type KioskOutletContext = {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const productsData: Product[] = [
    // 채소
    { id: 1, imgUrl: "", emoji: "🥕", name: "당근", price: 1500, quantity: 0, category: "채소" },
    { id: 2, imgUrl: "", emoji: "🍅", name: "토마토", price: 1000, quantity: 0, category: "채소" },
    { id: 3, imgUrl: "", emoji: "🍆", name: "가지", price: 1000, quantity: 0, category: "채소" },
    { id: 4, imgUrl: "", emoji: "🌽", name: "옥수수", price: 3000, quantity: 0, category: "채소" },
    { id: 5, imgUrl: "", emoji: "🌶️", name: "고추", price: 1000, quantity: 0, category: "채소" },
    { id: 7, imgUrl: "", emoji: "🫑", name: "파프리카", price: 2000, quantity: 0, category: "채소" },
    { id: 8, imgUrl: "", emoji: "🥔", name: "감자", price: 3500, quantity: 0, category: "채소" },
    { id: 9, imgUrl: "", emoji: "🥬", name: "양배추", price: 4000, quantity: 0, category: "채소" },
    { id: 10, imgUrl: "", emoji: "🥒", name: "오이", price: 1500, quantity: 0, category: "채소" },
    { id: 11, imgUrl: "", emoji: "🫛", name: "완두콩", price: 1500, quantity: 0, category: "채소" },
    { id: 12, imgUrl: "", emoji: "🥬", name: "시금치", price: 2000, quantity: 0, category: "채소" },
    { id: 13, imgUrl: "", emoji: "🥑", name: "아보카도", price: 4500, quantity: 0, category: "채소" },

    // 과일
    { id: 14, imgUrl: "", emoji: "🍎", name: "사과", price: 2000, quantity: 0, category: "과일" },
    { id: 15, imgUrl: "", emoji: "🍏", name: "청사과", price: 2000, quantity: 0, category: "과일" },
    { id: 16, imgUrl: "", emoji: "🍓", name: "딸기", price: 3500, quantity: 0, category: "과일" },
    { id: 17, imgUrl: "", emoji: "🍋", name: "레몬", price: 3000, quantity: 0, category: "과일" },
    { id: 18, imgUrl: "", emoji: "🍇", name: "포도", price: 3500, quantity: 0, category: "과일" },
    { id: 19, imgUrl: "", emoji: "🍍", name: "파인애플", price: 6500, quantity: 0, category: "과일" },
    { id: 20, imgUrl: "", emoji: "🍉", name: "수박", price: 10000, quantity: 0, category: "과일" },
    { id: 21, imgUrl: "", emoji: "🍊", name: "감", price: 6000, quantity: 0, category: "과일" },
    { id: 22, imgUrl: "", emoji: "🍈", name: "멜론", price: 12000, quantity: 0, category: "과일" },
    { id: 23, imgUrl: "", emoji: "🍌", name: "바나나", price: 4500, quantity: 0, category: "과일" },
];

export default function KioskLayout() {

    const [products, setProducts] = useState<Product[]>(productsData);

    return <Outlet context={{ products, setProducts }} />;
}