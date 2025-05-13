import React from "react";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import CartSummary from "../../components/user/CartSummary.jsx";
import ProductCard from "../../components/user/ProductCard.jsx";

function Cart() {
    const cartItems = [ // 이거 임시 테스트용 더미 데이터. API호출해서 받아와야 함.
        {
            id: 1,
            brand: "Brand A",
            name: "Product A",
            quantity: 2,
            price: 12000,
            image: "/product(1).png",
            promotion: "10% off",
        },
        {
            id: 2,
            brand: "Brand B",
            name: "Product B",
            quantity: 1,
            price: 20000,
            image: "/product(1).png",
            promotion: "",
        },
    ];
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <div className="max-w-screen-xl mx-auto px-20 py-8">
                    <h2 className="text-3xl font-bold text-neutral-800 mb-6">Cart</h2>
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* 상품 목록 */}
                        <div className="flex-1 min-w-0 space-y-8">
                            {cartItems.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onQuantityChange={() => {
                                        // TODO: 수량변경시 호출해서 반영 후 이 부분 UI만 갱신해야함
                                    }}
                                    editable={true}
                                />
                            ))}
                        </div>
                        {/* 주문 요약 */}
                        <CartSummary />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Cart;

