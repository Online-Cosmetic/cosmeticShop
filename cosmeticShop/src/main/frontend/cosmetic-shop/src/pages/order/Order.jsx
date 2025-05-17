import React, {useMemo} from "react";
import Footer from "../../components/common/Footer.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import AddressForm from "../../components/user/AddressForm.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import BankPaymentForToss from "../../components/payment/BankTransferPayment.jsx";
// import EasyPayment from "../../components/payment/EasyPayment.jsx";
// import CardPaymentForToss from "../../components/payment/CardPaymentForToss.jsx";


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

    // 총액 계산
    const totalPrice = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    );
    // 프로모션(%) 파싱
    const discountRate = useMemo(
        () =>
            cartItems.reduce((acc, item) => {
                const pct = parseInt(item.promotion.match(/\d+/)?.[0] || "0", 10);
                return acc + (item.price * item.quantity * pct) / 100;
            }, 0),
        [cartItems]
    );
    const orderTotal = totalPrice - discountRate;


    return (
        <>
            <main className="max-w-screen-xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">
                {/* 좌측: 주소 + 상품목록 */}
                <div className="flex-1 space-y-12">
                    <AddressForm
                        savedAddresses={[
                            { id: "1", city: "경상북도", street: "경산시", detail: "대학로 280" },
                            { id: "2", city: "대구광역시", street: "수성구", detail: "달구벌대로 3109" },
                        ]}
                    />
                    <h2 className="text-2xl font-semibold">Order Items</h2>
                    <div className="space-y-8">
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

                {/* 우측: 결제 정보 */}
                <div className="w-full max-w-sm flex-shrink-0 border rounded-lg p-6 shadow">
                    <div className="flex justify-between mb-3 text-lg">
                        <span>Total Price</span>
                        <span>₩{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-3 text-lg text-red-500">
                        <span>Discount</span>
                        <span>- ₩{discountRate.toLocaleString()}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between mb-6 text-xl font-bold">
                        <span>Order Total</span>
                        <span>₩{orderTotal.toLocaleString()}</span>
                    </div>
                    {/* 카드 / 계좌 / 간편결제 선택해서 호출*/}
                    {/*<CardPaymentForToss />*/}
                    <BankPaymentForToss />
                    {/*<EasyPayment/>*/}
                </div>

                {/*<CartSummary />*/}
            </main>
            <Footer />
        </>
    );
}

export default Order;

