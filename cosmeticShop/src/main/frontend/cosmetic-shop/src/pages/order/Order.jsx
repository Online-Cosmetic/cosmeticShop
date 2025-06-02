import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CartSummary from "../../components/cart/CartSummary.jsx";
import AddressForm from "../../components/order/AddressForm.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import {userAPI} from '../../utils/customAxios';
import BankTransferPayment from '../../components/payment/BankTransferPayment';
import CardPaymentForToss from '../../components/payment/CardPaymentForToss';
import EasyPayment from '../../components/payment/EasyPayment';

function Order() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("card");
    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [orderPrice, setOrderPrice] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const cartRes = await userAPI.cart.getCart();
                const items = cartRes.data.items || [];
                setCartItems(items);

                // 주문 금액 계산
                const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const shippingFee = totalPrice > 0 ? 2500 : 0;
                const promo = Math.floor(totalPrice * 0.1); // 10% 할인
                const total = totalPrice + shippingFee - promo;
                setOrderPrice(total);

                const addrRes = await userAPI.addresses.getAll();
                const addresses = addrRes.data || [];
                setAddresses(addresses);
                if (addresses.length > 0) {
                    setSelectedAddress(addresses[0]);
                }
            } catch (e) {
                alert('주문 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // 구매자 정보
    const buyerInfo = {
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName'),
        addr: selectedAddress ? `${selectedAddress.city} ${selectedAddress.street} ${selectedAddress.detail}`.trim() : '',
    };

    // 필수 구매자 정보 검증
    const validateBuyerInfo = () => {
        // if (!buyerInfo.email || !buyerInfo.name || !buyerInfo.tel) {
        if (!buyerInfo.email || !buyerInfo.name) {
            setErrorMsg('구매자 정보가 부족합니다. 프로필에서 정보를 확인해주세요.');
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
                orderItemDTO: cartItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price
                })),
                addressDTO: selectedAddress,
                recipientName: buyerInfo.name,
                totalPrice: orderPrice,
                orderStatus: 'PENDING',  // 초기 주문 상태
                orderDate: new Date().toISOString(),  // 주문 일시
            };

            const res = await userAPI.order.createOrder(orderRequest);
            const newOrderId = res.data.orderId;
            if (!newOrderId) {
                throw new Error('주문 ID를 받지 못했습니다.');
            }
            setOrderId(newOrderId);
            setShowPayment(true);
        } catch (e) {
            setErrorMsg('주문 생성에 실패했습니다.');
        }
    };

    // 결제 성공 시
    const handlePaymentSuccess = () => {
        navigate(`/user/order/complete?orderId=${orderId}`);
    };

    // 결제 실패 시
    const handlePaymentFail = () => {
        setErrorMsg('결제 실패 또는 취소되었습니다.');
        setShowPayment(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto my-auto">
            <main className="flex-grow">
                <div className="">
                    <h2 className="text-3xl font-bold text-neutral-800 mb-6">Order</h2>
                    <div className="flex gap-6 border rounded-lg p-6 shadow min-h-[600px]">
                        <div className="flex-1 min-w-0 space-y-8 overflow-y-auto max-h-[calc(100vh-250px)]">
                            <AddressForm
                                savedAddresses={addresses}
                                onAddressSelect={(addr) => setSelectedAddress(addr)}
                            />
                            <section className="flex-1 flex flex-col border rounded-lg p-6 shadow">
                                <h3 className="text-2xl font-semibold mb-4">Order Items</h3>
                                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                                    {loading ? <div>로딩 중...</div> : cartItems.length === 0 ?
                                        <div>주문할 상품이 없습니다.</div> : cartItems.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onQuantityChange={() => {
                                                }}
                                                editable={false}
                                                isOrderPage={true}
                                            />
                                        ))}
                                </div>
                            </section>
                        </div>

                        <div className="w-96 flex-shrink-0 space-y-6 flex flex-col justify-between">
                            <div className="border rounded-lg p-6 shadow">
                                <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                                <CartSummary cartItems={cartItems}/>
                            </div>

                            <div className="border rounded-lg p-6 shadow">
                                <h3 className="text-2xl font-semibold mb-4">
                                    Select Payment Method
                                </h3>
                                <div className="space-y-2">
                                    <div className="space-y-2">
                                        {/* 카드 */}
                                        <button
                                            onClick={() => {
                                                setMethod("card");
                                                handleProceedOrder();
                                            }}
                                            className="relative w-full px-4 py-3 bg-white border rounded-[12px] shadow hover:brightness-95 transition-all flex items-center justify-between overflow-hidden"
                                        >
                                            <span className="text-base font-medium text-black z-10">신용/체크카드</span>
                                            <img
                                                src="/ui/TossPayments_Logo_Primary.png"
                                                alt="토스페이먼츠"
                                                className="h-14 -my-10 -mr-4"
                                            />
                                        </button>
                                        {/* 계좌이체 */}
                                        <button
                                            onClick={() => {
                                                setMethod("card");
                                                handleProceedOrder();
                                            }}
                                            className="relative w-full px-4 py-3 bg-white border rounded-[12px] shadow hover:brightness-95 transition-all flex items-center justify-between overflow-hidden"
                                        >
                                            <span className="text-base font-medium text-black z-10">계좌이체</span>
                                            <img
                                                src="/ui/kg_inicis.svg"
                                                alt="KG이니시스"
                                                className="h-8 -my-10 mr-2"
                                            />
                                        </button>

                                        {/* 간편결제 */}
                                        <button
                                            onClick={() => {
                                                setMethod("simple");
                                                handleProceedOrder();
                                            }}
                                            className="w-full px-4 py-3 bg-[#FEE500] rounded-[12px] shadow hover:brightness-95 transition-all"
                                        >
                                            <img
                                                src="/ui/카카오페이_CI_combination.svg"
                                                alt="카카오페이 결제"
                                                className="h-5 mx-auto"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {errorMsg && <div className="text-red-600 text-center mt-2">{errorMsg}</div>}
                            {showPayment && orderId && (
                                <div className="mt-4">
                                    {method === 'card' && (
                                        <CardPaymentForToss
                                            orderId={orderId}
                                            amount={orderPrice}
                                            orderName={cartItems[0]?.productName}
                                            buyerInfo={buyerInfo}
                                            onSuccess={handlePaymentSuccess}
                                            onFail={handlePaymentFail}
                                        />
                                    )}
                                    {method === 'bank' && (
                                        <BankTransferPayment
                                            orderId={orderId}
                                            amount={orderPrice}
                                            orderName={cartItems[0]?.productName}
                                            buyerInfo={buyerInfo}
                                            onSuccess={handlePaymentSuccess}
                                            onFail={handlePaymentFail}
                                        />
                                    )}
                                    {method === 'simple' && (
                                        <EasyPayment
                                            orderId={orderId}
                                            amount={orderPrice}
                                            orderName={cartItems[0]?.productName}
                                            buyerInfo={buyerInfo}
                                            onSuccess={handlePaymentSuccess}
                                            onFail={handlePaymentFail}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Order;
