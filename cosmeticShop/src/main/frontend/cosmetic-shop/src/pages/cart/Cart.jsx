// src/pages/cart/Cart.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";

// 더미 장바구니 데이터
const DUMMY_CART_ITEMS = [
    { id: 1, name: "립스틱 A", brand: "브랜드A", price: 12000, quantity: 2, productImage: "lipstick.jpg" },
    { id: 2, name: "쿠션 팩트", brand: "브랜드B", price: 20000, quantity: 1, productImage: "cushion.jpg" },
    { id: 3, name: "아이섀도우", brand: "브랜드C", price: 17000, quantity: 3, productImage: "shadow.jpg" },
    { id: 4, name: "아이라이너", brand: "브랜드D", price: 11000, quantity: 1, productImage: "liner.jpg" },
];

function Cart() {
    const navigate = useNavigate();

    // 더미 데이터로 초기화
    const [cartItems, setCartItems] = useState(DUMMY_CART_ITEMS);

    // 체크된 상품 ID를 보관
    const [checkedItems, setCheckedItems] = useState(new Set());

    // 체크박스 토글 핸들러
    const handleCheckItem = (productId) => {
        setCheckedItems((prev) => {
            const newChecked = new Set(prev);
            if (newChecked.has(productId)) {
                newChecked.delete(productId);
            } else {
                newChecked.add(productId);
            }
            return newChecked;
        });
    };

    // 개별 삭제 핸들러
    const handleDeleteItem = (productId) => {
        if (!window.confirm("상품을 삭제하시겠습니까?")) {
            return;
        }
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
        setCheckedItems((prev) => {
            const newChecked = new Set(prev);
            newChecked.delete(productId);
            return newChecked;
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-8">
            {/* 페이지 제목 */}
            <h2 className="text-3xl font-bold text-neutral-800 mb-6">Cart</h2>

            {/* 좌측: 상품 목록, 우측: 주문 요약 */}
            <div className="flex gap-16 border rounded-lg p-6 shadow">
                {/* 좌측: 상품 목록 */}
                <div className="flex flex-1 flex-col space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-neutral-500">
                            장바구니가 비어있습니다.
                        </div>
                    ) : (
                        cartItems.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onQuantityChange={() => {}}
                                editable={false}
                                isChecked={checkedItems.has(product.id)}
                                onCheck={() => handleCheckItem(product.id)}
                                onDelete={() => handleDeleteItem(product.id)}
                            />
                        ))
                    )}
                </div>

                {/* 우측: Cart Summary + Checkout 버튼 */}
                <div className="w-96 flex-shrink-0 space-y-6">
                    <div className="border rounded-lg p-6 shadow">
                        <h3 className="text-2xl font-semibold mb-4">Cart Summary</h3>
                        <div className="flex flex-col gap-6">
                            <CartSummary
                                cartItems={cartItems.filter((item) =>
                                    checkedItems.has(item.id)
                                )}
                            />
                            <button
                                className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-900 transition"
                                onClick={() => navigate("/user/order")}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;