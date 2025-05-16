import React from "react";
import UserHeader from "../../components/common/UserHeader.jsx";
import Footer from "../../components/common/Footer.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import AddressForm from "../../components/user/AddressForm.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";

function Order() {
    const cartItems = [ // 이거 임시 테스트용 더미 데이터. API호출해서 받아와야 함.
        {
            id: 1,
            brand: "Brand A",
            name: "Product A",
            quantity: 2,
            price: 12000,
            image: "/product(1).png",
            promotion: "10% off",
        }
    ];
    return (
        <>
            <UserHeader />
            <main className="max-w-screen-xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">
                <div className="flex-1 space-y-12">
                    <AddressForm
                        savedAddresses={[
                            { id: "1", city: "경상북도", street: "경산시", detail: "대학로 280" },
                            { id: "2", city: "대구광역시", street: "수성구", detail: "달구벌대로 3109" },
                        ]}
                    />
                    {/* 상품 목록 */}
                    <h2 className="text-2xl font-semibold">Order Itmes</h2>
                    <div className="flex-1 min-w-0 space-y-8">
                        {cartItems.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onQuantityChange={() => {
                                    // TODO: 수량변경시 호출해서 반영 후 이 부분 UI만 갱신해야함
                                }}
                                editable={false}
                            />
                        ))}
                    </div>
                </div>
                <CartSummary />
            </main>
            <Footer />
        </>
    );
}

export default Order;

