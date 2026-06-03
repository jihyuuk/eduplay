import { Outlet } from "react-router-dom";
import { useState } from "react";
import type { Product } from "./KioskOrderPage";

export type KioskOutletContext = {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const productsData: Product[] = [
    // 과자
    { id: 1, imgUrl: "https://image.nongshim.com/non/pro/1661932422286.jpg", name: "고구마깡", price: 1700, quantity: 0, category: "과자" },
    { id: 2, imgUrl: "https://image.nongshim.com/non/pro/honeytwistsnack1.jpg", name: "꿀꽈배기", price: 1700, quantity: 0, category: "과자" },
    { id: 3, imgUrl: "https://image.nongshim.com/non/pro/1745223663968.jpg", name: "메론킥", price: 1700, quantity: 0, category: "과자" },
    { id: 4, imgUrl: "https://image.nongshim.com/non/pro/1529458238593.jpg", name: "감자깡", price: 1700, quantity: 0, category: "과자" },
    { id: 5, imgUrl: "https://image.nongshim.com/non/pro/1448612781686.jpg", name: "바나나킥", price: 1500, quantity: 0, category: "과자" },
    { id: 6, imgUrl: "https://image.nongshim.com/non/pro/1594682430086.jpg", name: "새우깡", price: 6000, quantity: 0, category: "과자" },

    // 라면
    { id: 7, imgUrl: "https://image.nongshim.com/non/pro/1734997151278.jpg", name: "신라면", price: 1200, quantity: 0, category: "라면" },
    { id: 8, imgUrl: "https://image.nongshim.com/non/pro/434_zahwang1_0.jpg", name: "짜왕", price: 1100, quantity: 0, category: "라면" },
    { id: 9, imgUrl: "https://image.nongshim.com/non/pro/1647994108215.jpg", name: "짜파게티", price: 1400, quantity: 0, category: "라면" },
    { id: 10, imgUrl: "https://image.nongshim.com/non/pro/434_red.jpg", name: "너구리", price: 1400, quantity: 0, category: "라면" },
    { id: 11, imgUrl: "https://image.nongshim.com/non/pro/1766033907293.jpg", name: "안성탕면", price: 1300, quantity: 0, category: "라면" },
    { id: 12, imgUrl: "https://image.nongshim.com/non/pro/434_6cup.jpg", name: "육개장", price: 1800, quantity: 0, category: "라면" },

    // 음료수
    { id: 13, imgUrl: "https://www.lghnh.com/images/brand/best/refreshing/R001_1.jpg", name: "코카콜라", price: 2000, quantity: 0, category: "음료수" },
    { id: 14, imgUrl: "https://www.lghnh.com/images/brand/best/refreshing/R007_3.jpg", name: "사이다", price: 2000, quantity: 0, category: "음료수" },
    { id: 15, imgUrl: "https://www.lghnh.com/images/brand/best/refreshing/R072_1.jpg", name: "코코팜", price: 2500, quantity: 0, category: "음료수" },
    { id: 16, imgUrl: "https://www.lghnh.com/images/brand/best/refreshing/R036_1.jpg", name: "토레타", price: 2500, quantity: 0, category: "음료수" },
    { id: 17, imgUrl: "https://www.lghnh.com/images/brand/best/refreshing/R008_2.jpg", name: "파워에이드", price: 2200, quantity: 0, category: "음료수" },
    { id: 18, imgUrl: "https://image.nongshim.com/non/pro/1647994108215.jpg", name: "생수", price: 1000, quantity: 0, category: "음료수" },

    // 아이스크림
    { id: 19, imgUrl: "https://www.bing.co.kr/upload/product/taste_melona_original.png", name: "메로나", price: 1500, quantity: 0, category: "아이스크림" },
    { id: 20, imgUrl: "https://www.bing.co.kr/upload/brand/2026/04/e2b19b47-f595-4946-a32f-1ab21a48ce69.png", name: "누가바", price: 2500, quantity: 0, category: "아이스크림" },
    { id: 21, imgUrl: "https://www.bing.co.kr/upload/product/taste_bibibig_original.png", name: "비비빅", price: 1500, quantity: 0, category: "아이스크림" },
    { id: 22, imgUrl: "https://www.bing.co.kr/upload/brand/2026/03/caac679b-536c-4d9e-91a6-11955f81cefe.png", name: "바밤바", price: 1500, quantity: 0, category: "아이스크림" },
    { id: 23, imgUrl: "https://www.bing.co.kr/upload/brand/2026/03/68065267-94cb-452b-b6e3-d76590f6a799.png", name: "쌍쌍바", price: 1800, quantity: 0, category: "아이스크림" },
    { id: 24, imgUrl: "https://www.bing.co.kr/upload/brand/2026/03/7a39569a-b6fe-49bb-a55a-4431dda99a6e.png", name: "폴라포", price: 1800, quantity: 0, category: "아이스크림" },
];

export default function KioskLayout() {

    const [products, setProducts] = useState<Product[]>(productsData);

    return <Outlet context={{ products, setProducts }} />;
}