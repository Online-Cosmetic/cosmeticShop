// src/pages/order/Order.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartSummary from "../../components/cart/CartSummary.jsx";
import AddressForm from "../../components/order/AddressForm.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import { userAPI } from "../../utils/customAxios";
import BankTransferPayment from "../../components/payment/BankTransferPayment.jsx";
import CardPaymentForToss from "../../components/payment/CardPaymentForToss.jsx";
import EasyPayment from "../../components/payment/EasyPayment.jsx";

function Order() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("card");
    // 더미 데이터로 cartItems 초기화
    const DUMMY_CART_ITEMS = [
        { id: 1, name: "립스틱 A", brand: "브랜드A", price: 12000, quantity: 2, productImage: "lipstick.jpg" },
        { id: 2, name: "쿠션 팩트", brand: "브랜드B", price: 20000, quantity: 1, productImage: "cushion.jpg" },
        { id: 3, name: "아이섀도우", brand: "브랜드C", price: 17000, quantity: 3, productImage: "shadow.jpg" },
        { id: 4, name: "아이라이너", brand: "브랜드D", price: 11000, quantity: 1, productImage: "liner.jpg" },
    ];
    const [cartItems, setCartItems] = useState(DUMMY_CART_ITEMS);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false); // 더미라서 false
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [orderPrice, setOrderPrice] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // 구매자 정보
    const buyerInfo = {
        email: localStorage.getItem("userEmail"),
        name: localStorage.getItem("userName"),
        addr: selectedAddress
            ? `${selectedAddress.city} ${selectedAddress.street} ${selectedAddress.detail}`.trim()
            : "",
    };

    // 필수 구매자 정보 검증
    const validateBuyerInfo = () => {
        if (!buyerInfo.email || !buyerInfo.name) {
            setErrorMsg("구매자 정보가 부족합니다. 프로필에서 정보를 확인해주세요.");
            return false;
        }
        return true;
    };

    // 주문 생성 후 결제창 띄우기
    const handleProceedOrder = async () => {
        setErrorMsg("");
        setShowPayment(false);

        if (!selectedAddress) {
            setErrorMsg("배송지를 선택해주세요.");
            return;
        }
        if (cartItems.length === 0) {
            setErrorMsg("장바구니가 비어있습니다.");
            return;
        }
        if (!validateBuyerInfo()) {
            return;
        }

        try {
            const orderRequest = {
                orderItemDTO: cartItems.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                })),
                addressDTO: selectedAddress,
                recipientName: buyerInfo.name,
                totalPrice: orderPrice,
                orderStatus: "PENDING", // 초기 주문 상태
                orderDate: new Date().toISOString(), // 주문 일시
            };

            const res = await userAPI.order.createOrder(orderRequest);
            const newOrderId = res.data.orderId;
            if (!newOrderId) {
                throw new Error("주문 ID를 받지 못했습니다.");
            }
            setOrderId(newOrderId);
            setShowPayment(true);
        } catch (e) {
            setErrorMsg("주문 생성에 실패했습니다.");
        }
    };

    // 결제 성공 시
    const handlePaymentSuccess = () => {
        navigate(`/user/order/complete?orderId=${orderId}`);
    };

    // 결제 실패 시
    const handlePaymentFail = () => {
        setErrorMsg("결제 실패 또는 취소되었습니다.");
        setShowPayment(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto my-auto">
            <main className="flex-grow">
                <h2 className="text-3xl font-bold text-neutral-800 mb-6">Order</h2>
                <div className="flex gap-6 border rounded-lg p-6 shadow min-h-[600px] h-[calc(100vh-200px)]">
                    {/* 왼쪽: 주소 + 주문 상품 */}
                    <div className="flex-1 flex flex-col space-y-8 overflow-y-auto min-h-0">
                        <AddressForm
                            savedAddresses={addresses}
                            onAddressSelect={(addr) => setSelectedAddress(addr)}
                        />
                        <section className="flex-1 flex flex-col border rounded-lg p-6 shadow min-h-0">
                            <h3 className="text-2xl font-semibold mb-4">Order Items</h3>
                            <div className="space-y-4 overflow-y-auto flex-1 pr-2 min-h-0">
                                {loading ? (
                                    <div>로딩 중...</div>
                                ) : cartItems.length === 0 ? (
                                    <div>주문할 상품이 없습니다.</div>
                                ) : (
                                    cartItems.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onQuantityChange={() => {}}
                                            editable={false}
                                            isOrderPage={true}
                                        />
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* 오른쪽: 요약 + 결제 */}
                    <div className="w-96 flex-shrink-0 flex flex-col justify-between space-y-6 min-h-0">
                        {/* Order Summary */}
                        <div className="border rounded-lg p-6 shadow">
                            <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                            <CartSummary cartItems={cartItems} />
                        </div>

                        {/* Select Payment Method */}
                        <div className="border rounded-lg p-6 shadow">
                            <h3 className="text-2xl font-semibold mb-4">
                                Select Payment Method
                            </h3>
                            <div className="space-y-4">
                                {/* 신용/체크카드 섹션 */}
                                <div className="space-y-2">
                                    <label className="block text-md font-medium text-neutral-700">
                                        신용/체크카드
                                    </label>
                                    {/* TossPayments 버튼 */}
                                    <button
                                        onClick={() => {
                                            setMethod("card");
                                            handleProceedOrder();
                                        }}
                                        className="w-full px-4 py-1 bg-white border rounded-lg shadow hover:brightness-95 transition flex items-center justify-center"
                                    >
                                        <img
                                            src="/ui/TossPayments_Logo_Primary.png"
                                            alt="토스페이먼츠"
                                            className="h-10"
                                        />
                                    </button>
                                </div>

                                {/* 계좌이체 섹션 */}
                                <div className="space-y-2">
                                    <label className="block text-md font-medium text-neutral-700">
                                        계좌이체
                                    </label>
                                    {/* KG이니시스 버튼 */}
                                    <button
                                        onClick={() => {
                                            setMethod("bank");
                                            handleProceedOrder();
                                        }}
                                        className="w-full px-4 py-1 bg-white border rounded-lg shadow hover:brightness-95 transition flex items-center justify-center"
                                    >
                                        <img
                                            src="/ui/kg_inicis.svg"
                                            alt="KG이니시스"
                                            className="h-8"
                                        />
                                    </button>
                                </div>

                                {/* 간편결제 (예: 카카오페이) 섹션 */}
                                <div className="space-y-2">
                                    <label className="block text-md font-medium text-neutral-700">
                                        간편결제
                                    </label>
                                    <button
                                        onClick={() => {
                                            setMethod("simple");
                                            handleProceedOrder();
                                        }}
                                        className="w-full px-4 py-3 bg-[#FEE500] rounded-lg shadow hover:brightness-95 transition flex items-center justify-center"
                                    >
                                        <img
                                            src="/ui/카카오페이_CI_combination.svg"
                                            alt="카카오페이 결제"
                                            className="h-6"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="text-red-600 text-center mt-2">{errorMsg}</div>
                        )}
                        {showPayment && orderId && (
                            <div className="mt-4">
                                {method === "card" && (
                                    <CardPaymentForToss
                                        orderId={orderId}
                                        amount={orderPrice}
                                        orderName={cartItems[0]?.name}
                                        buyerInfo={buyerInfo}
                                        onSuccess={handlePaymentSuccess}
                                        onFail={handlePaymentFail}
                                    />
                                )}
                                {method === "bank" && (
                                    <BankTransferPayment
                                        orderId={orderId}
                                        amount={orderPrice}
                                        orderName={cartItems[0]?.name}
                                        buyerInfo={buyerInfo}
                                        onSuccess={handlePaymentSuccess}
                                        onFail={handlePaymentFail}
                                    />
                                )}
                                {method === "simple" && (
                                    <EasyPayment
                                        orderId={orderId}
                                        amount={orderPrice}
                                        orderName={cartItems[0]?.name}
                                        buyerInfo={buyerInfo}
                                        onSuccess={handlePaymentSuccess}
                                        onFail={handlePaymentFail}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Order;