// src/pages/order/Order.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartSummary from "../../components/cart/CartSummary.jsx";
import AddressForm from "../../components/order/AddressForm.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";
import { userAPI } from "../../utils/customAxios";
import BankTransferPayment from "../../components/payment/BankTransferPayment.jsx";
import CardPaymentForToss from "../../components/payment/CardPaymentForToss.jsx";
import EasyPayment from "../../components/payment/EasyPayment.jsx";


function Order() {
    const navigate = useNavigate();
    const location = useLocation();
    const [method, setMethod] = useState("card");
    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [orderPrice, setOrderPrice] = useState(0);

    // 쿠폰 관련 상태 추가
    const [availableCoupons, setAvailableCoupons] = useState({});  // 각 상품별 사용 가능한 쿠폰 목록
    const [selectedCoupons, setSelectedCoupons] = useState({});    // 각 상품별 선택된 쿠폰
    const [loadingCoupons, setLoadingCoupons] = useState(false);   // 쿠폰 로딩 상태
    const [couponDiscounts, setCouponDiscounts] = useState({});    // 각 상품별 쿠폰 할인 금액
    const [selectedAddress, setSelectedAddress] = useState(null);

    // 주소 로딩 상태 참조 - useRef 사용하여 불필요한 리렌더링 방지
    const addressesLoadedRef = useRef(false);
    // 장바구니 아이템 로딩 상태 참조
    const cartItemsLoadedRef = useRef(false);

    // Cart.jsx에서 전달받은 선택된 장바구니 아이템 ID 배열
    const selectedCartIds = location.state?.selectedCartIds || [];
    // 디테일 페이지에서 직접 주문하기로 넘어왔는지 확인
    const isDirectOrder = location.state?.directOrder || false;
    // 디테일 페이지에서 전달받은 상품 데이터
    const directProductData = location.state?.productData || [];
    // 디테일 페이지에서 전달받은 총 가격
    const directTotalPrice = location.state?.totalPrice || 0;

    // 구매자 정보 - 의존성 최소화를 위해 useCallback으로 감싸기
    const getBuyerInfo = useCallback(() => {
        return {
            email: localStorage.getItem('userEmail'),
            name: localStorage.getItem('userName'),
            addr: selectedAddress ? `${selectedAddress.city} ${selectedAddress.street} ${selectedAddress.detail}`.trim() : '',
        };
    }, [selectedAddress]);

    // 장바구니 아이템 로드 함수 - API 호출 메모이제이션
    const loadCartItems = useCallback(async () => {
        // 이미 로드된 경우 중복 호출 방지
        if (cartItemsLoadedRef.current) return { data: { items: cartItems } };

        try {
            if (selectedCartIds.length > 0) {
                const response = await userAPI.cart.getSelectedCarts(selectedCartIds);
                cartItemsLoadedRef.current = true;
                return response;
            }
            return { data: { items: [] } };
        } catch (error) {
            console.error("장바구니 상품 로드 오류:", error);
            return { data: { items: [] } };
        }
    }, [selectedCartIds]); // Removed cartItems from dependencies to prevent re-creation

    // 상품 데이터 로드 함수 - useEffect 밖으로 분리
    const loadProductItems = useCallback(async () => {
        // 이미 로드된 경우 중복 호출 방지
        if (cartItemsLoadedRef.current && cartItems.length > 0) {
            return true;
        }

        try {
            let items = [];

            // 직접 구매인 경우 location state에서 먼저 확인하고 없으면 로컬 스토리지에서 가져오기
            if (isDirectOrder) {
                if (directProductData && directProductData.length > 0) {
                    items = directProductData.map(item => {
                        // 이미지 처리
                        const thumbnailImage = item.thumbnailImage || "";
                        return {
                            ...item,
                            // 이미지 필드를 일관성 있게 설정
                            thumbnailImage: thumbnailImage,
                            thumbnailImageUrl: thumbnailImage
                        };
                    });
                } else {
                    const directOrderItems = JSON.parse(localStorage.getItem('directOrderItems') || '[]');
                    if (directOrderItems.length > 0) {
                        items = directOrderItems.map(item => {
                            // 이미지 처리
                            const thumbnailImage = item.thumbnailImage || "";
                            return {
                                ...item,
                                // 이미지 필드를 일관성 있게 설정
                                thumbnailImage: thumbnailImage,
                                thumbnailImageUrl: thumbnailImage
                            };
                        });
                    }
                }

                // 직접 주문 시 총 가격을 location state에서 먼저 확인하고 없으면 로컬 스토리지에서 가져오기
                if (directTotalPrice > 0) {
                    setOrderPrice(directTotalPrice);
                } else {
                    const storedTotalPrice = localStorage.getItem('directOrderTotalPrice');
                    if (storedTotalPrice) {
                        setOrderPrice(Number(storedTotalPrice));
                    } else {
                        // 가격 계산 - 상품 가격 + 배송비
                        let totalPrice = 0;
                        if (items.length > 0) {
                            totalPrice = items.reduce((sum, item) => {
                                const itemPrice = item.discountedPrice ||
                                    Math.floor(item.price * (1 - (item.discountRate || 0) / 100));
                                return sum + (itemPrice * item.quantity);
                            }, 0);
                        }
                        const shippingFee = totalPrice > 0 ? 3000 : 0;
                        setOrderPrice(totalPrice + shippingFee);
                    }
                }
            }
            // 선택된 장바구니 아이템이 있으면 getSelectedCarts API 호출
            else if (selectedCartIds && selectedCartIds.length > 0) {
                const cartRes = await loadCartItems();
                items = cartRes.data.items || [];

                // 주문 금액 계산
                let totalPrice = 0;
                if (items.length > 0) {
                    totalPrice = items.reduce((sum, item) => {
                        const itemPrice = item.discountedPrice ||
                            Math.floor(item.price * (1 - (item.discountRate || 0) / 100));
                        return sum + (itemPrice * item.quantity);
                    }, 0);
                }
                const shippingFee = totalPrice > 0 ? 3000 : 0;
                setOrderPrice(totalPrice + shippingFee);
            }
            // 그 외의 경우 모든 장바구니 아이템 가져오기
            else if (!isDirectOrder) {
                const cartRes = await userAPI.cart.getAllCarts();
                items = cartRes.data.items || [];

                // 주문 금액 계산
                let totalPrice = 0;
                if (items.length > 0) {
                    totalPrice = items.reduce((sum, item) => {
                        const itemPrice = item.discountedPrice ||
                            Math.floor(item.price * (1 - (item.discountRate || 0) / 100));
                        return sum + (itemPrice * item.quantity);
                    }, 0);
                }
                const shippingFee = totalPrice > 0 ? 3000 : 0;
                setOrderPrice(totalPrice + shippingFee);
            }

            // 이미지 필드를 일관되게 설정
            const processedItems = items.map(item => {
                // 이미지 필드 중 하나가 있으면 사용
                const imageUrl = item.thumbnailImage || item.thumbnailImageUrl || item.mainImageUrl || "";

                return {
                    ...item,
                    // 모든 이미지 필드에 동일한 값 설정
                    thumbnailImage: imageUrl,
                    thumbnailImageUrl: imageUrl,
                    mainImageUrl: imageUrl
                };
            });

            setCartItems(processedItems);
            cartItemsLoadedRef.current = true;
            return true;
        } catch (e) {
            console.error('상품 정보 로딩 오류:', e);
            return false;
        }
    }, [isDirectOrder, selectedCartIds, directProductData, directTotalPrice, loadCartItems]);

    // 주소 데이터 로드 함수 - useEffect 밖으로 분리
    const loadAddressData = useCallback(async () => {
        // 이미 로드된 경우 중복 호출 방지
        if (addressesLoadedRef.current) return true;

        try {
            const addrRes = await userAPI.addresses.getAll();
            const addressData = addrRes.data || [];
            setAddresses(addressData);

            // 기본 배송지를 찾기 (배열의 첫 번째 주소를 기본 배송지로 간주)
            if (addressData.length > 0 && !selectedAddress) {
                setSelectedAddress(addressData[0]);
            }

            addressesLoadedRef.current = true;
            return true;
        } catch (e) {
            console.error('주소 정보 로딩 오류:', e);
            return false;
        }
    }, [selectedAddress]);

    // 쿠폰 관련 함수
    const fetchAvailableCoupons = useCallback(async (productId, companyId) => {
        try {
            setLoadingCoupons(true);

            // 1. 내가 가진 쿠폰 목록 가져오기
            const myCouponsResponse = await userAPI.coupon.getMyCoupons();
            const myCoupons = myCouponsResponse.data || [];

            // 2. 사용 가능한 쿠폰만 필터링 (사용되지 않은 쿠폰)
            const validCoupons = myCoupons.filter(coupon => 
                !coupon.isUsed && 
                new Date(coupon.expirationDate) > new Date() && 
                coupon.companyName === companyId // 해당 회사의 쿠폰만 필터링
            );

            // 3. 상품별 사용 가능한 쿠폰 목록 업데이트
            setAvailableCoupons(prev => ({
                ...prev,
                [productId]: validCoupons
            }));

        } catch (error) {
            console.error(`상품 ${productId}의 쿠폰 정보를 불러오는 중 오류 발생:`, error);
        } finally {
            setLoadingCoupons(false);
        }
    }, []);

    // 쿠폰 선택 처리 함수
    const handleSelectCoupon = useCallback((productId, coupon) => {
        // 선택된 쿠폰 업데이트
        setSelectedCoupons(prev => ({
            ...prev,
            [productId]: coupon
        }));

        // 해당 상품의 할인된 가격 계산
        const product = cartItems.find(item => item.productId === productId);
        if (product) {
            // 상품의 할인율 적용된 가격 계산
            const discountRate = product.discountRate || 0;
            const discountedPrice = Math.floor(product.price * (1 - discountRate / 100));

            // 쿠폰 할인 금액 계산 (할인된 가격에 쿠폰 할인율 적용)
            const couponDiscountAmount = coupon 
                ? Math.floor(discountedPrice * (coupon.discountRate / 100)) 
                : 0;

            // 쿠폰 할인 금액 업데이트
            setCouponDiscounts(prev => ({
                ...prev,
                [productId]: couponDiscountAmount
            }));
        }
    }, [cartItems]);

    // 데이터 로드 useEffect - 한 번만 실행되도록 빈 의존성 배열 사용
    useEffect(() => {
        // 이미 로드된 경우 중복 실행 방지를 위한 플래그
        let isMounted = true;

        async function fetchData() {
            if (!isMounted) return;
            setLoading(true);

            try {
                // 주소 정보 로드 - 가장 먼저 로드하여 UI 렌더링 준비
                const addressesLoaded = await loadAddressData();
                if (!isMounted) return;

                // 상품 정보 로드
                const productsLoaded = await loadProductItems();
                if (!isMounted) return;

                // 상품 정보가 로드되면 각 상품별 쿠폰 정보 로드
                if (productsLoaded && cartItems.length > 0) {
                    for (const item of cartItems) {
                        if (item.productId && item.companyId) {
                            await fetchAvailableCoupons(item.productId, item.companyId);
                        }
                    }
                }

                if (!productsLoaded || !addressesLoaded) {
                    alert('주문 정보를 불러오지 못했습니다.');
                }
            } catch (e) {
                console.error('주문 정보 로딩 오류:', e);
                if (isMounted) {
                    alert('주문 정보를 불러오지 못했습니다.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        // 컴포넌트 언마운트 시 로컬 스토리지 정리 및 플래그 설정
        return () => {
            isMounted = false;
            if (isDirectOrder) {
                localStorage.removeItem('directOrderItems');
                localStorage.removeItem('directOrderTotalPrice');
            }
        };
    }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

    // 필수 구매자 정보 검증
    const validateBuyerInfo = () => {
        const buyerInfo = getBuyerInfo();
        if (!buyerInfo.email || !buyerInfo.name) {
            setErrorMsg("구매자 정보가 부족합니다. 프로필에서 정보를 확인해주세요.");
            return false;
        }
        return true;
    };

    // Order.jsx - handleProceedOrder 함수에서 할인가를 고려한 주문 생성
    const handleProceedOrder = async () => {
        setErrorMsg("");
        setShowPayment(false);

        if (!selectedAddress) {
            setErrorMsg("배송지를 선택해주세요.");
            return;
        }
        if (cartItems.length === 0) {
            setErrorMsg("주문할 상품이 없습니다.");
            return;
        }
        if (!validateBuyerInfo()) {
            return;
        }

        try {
            // 주문 상품 정보에 할인가 적용
            const orderItems = cartItems.map(item => {
                // 할인율 적용 가격 계산
                const discountRate = item.discountRate || 0;
                const discountedPrice = Math.floor(item.price * (1 - discountRate / 100));

                return {
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    discountRate: discountRate,
                    finalPrice: discountedPrice // 할인된 최종 가격 추가
                };
            });

            const orderRequest = {
                orderItemDTO: orderItems,
                addressDTO: {
                    id: selectedAddress.id,
                    city: selectedAddress.city,
                    street: selectedAddress.street,
                    detail: selectedAddress.detail || ""
                },
                recipientName: getBuyerInfo().name,
                totalPrice: orderPrice, // CartSummary에서 계산된 최종 가격
                orderStatus: 'PENDING',
                orderDate: new Date().toISOString(),
            };

            console.log("주문 요청:", orderRequest);

            const res = await userAPI.order.createOrder(orderRequest);
            const newOrderId = res.data.orderId;
            if (!newOrderId) {
                throw new Error('주문 ID를 받지 못했습니다.');
            }
            setOrderId(newOrderId);
            setShowPayment(true);
        } catch (e) {
            setErrorMsg('주문 생성에 실패했습니다.');
            console.error('주문 생성 오류:', e);
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
                    <div className="flex gap-6 border rounded-lg p-6 shadow min-h-[600px] h-[calc(100vh-200px)]">
                        {/* 왼쪽 부분 (AddressForm, Order Items) */}
                        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto min-h-0">
                            <AddressForm
                                savedAddresses={addresses}
                                onAddressSelect={(addr) => {
                                    console.log("Selected address:", addr);
                                    setSelectedAddress(addr);
                                }}
                            />
                            <section className="flex-1 flex flex-col border rounded-lg p-5 shadow min-h-0">
                                <h3 className="text-xl font-semibold mb-3">Order Items</h3>
                                <div className="space-y-4 overflow-y-auto flex-1 pr-2 min-h-0">
                                    {loading ?
                                        <div>로딩 중...</div>
                                        : cartItems.length === 0 ?
                                            <div>주문할 상품이 없습니다.</div>
                                            : cartItems.map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    onQuantityChange={() => {}}
                                                    editable={false}
                                                    isOrderPage={true}
                                                />
                                            ))}
                                </div>
                            </section>
                        </div>

                        {/* 오른쪽: 요약 + 결제 - 전체 높이를 조정 */}
                        <div className="w-96 flex-shrink-0 flex flex-col overflow-y-auto min-h-0">
                            <div className="flex flex-col space-y-3">
                                {/* Order Summary - 패딩 줄임 */}
                                <div className="border rounded-lg p-4 shadow">
                                    <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
                                    <CartSummary cartItems={cartItems}/>
                                </div>

                                {/* Select Payment Method - 패딩 줄임 */}
                                <div className="border rounded-lg p-4 shadow">
                                    <h3 className="text-xl font-semibold mb-3">
                                        Select Payment Method
                                    </h3>
                                    <div className="space-y-2">
                                        {/* 신용/체크카드 섹션 */}
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-neutral-700">
                                                신용/체크카드
                                            </label>
                                            {/* TossPayments 버튼 */}
                                            <button
                                                onClick={() => {
                                                    setMethod("card");
                                                    handleProceedOrder();
                                                }}
                                                className={`w-full h-8 px-3 border rounded-lg shadow flex items-center justify-center
                                                ${method === 'card' ? 'ring-2 ring-neutral-800 bg-neutral-50' : 'bg-white hover:bg-neutral-50'}`}
                                            >
                                                <img
                                                    src="/ui/TossPayments_Logo_Primary.png"
                                                    alt="토스페이먼츠"
                                                    className="h-6"
                                                />
                                            </button>
                                        </div>
                                        {/* 계좌이체 섹션 */}
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-neutral-700">
                                                계좌이체
                                            </label>
                                            {/* KG이니시스 버튼 */}
                                            <button
                                                onClick={() => {
                                                    setMethod("bank");
                                                    handleProceedOrder();
                                                }}
                                                className={`w-full h-8 px-3 border rounded-lg shadow flex items-center justify-center
                                                ${method === 'bank' ? 'ring-2 ring-neutral-800 bg-neutral-50' : 'bg-white hover:bg-neutral-50'}`}
                                            >
                                                <img
                                                    src="/ui/kg_inicis.svg"
                                                    alt="KG이니시스"
                                                    className="h-5"
                                                />
                                            </button>
                                        </div>

                                        {/* 간편결제 (예: 카카오페이) 섹션 */}
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-neutral-700">
                                                간편결제
                                            </label>
                                            <button
                                                onClick={() => {
                                                    setMethod("simple");
                                                    handleProceedOrder();
                                                }}
                                                className={`w-full h-8 px-3 rounded-lg shadow flex items-center justify-center
                                                ${method === 'simple'
                                                    ? 'bg-[#FEE500] ring-2 ring-neutral-800'
                                                    : 'bg-[#FEE500] hover:brightness-95'}`}
                                            >
                                                <img
                                                    src="/ui/카카오페이_CI_combination.svg"
                                                    alt="카카오페이 결제"
                                                    className="h-4"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {errorMsg && <div className="text-red-600 text-center text-sm">{errorMsg}</div>}

                                {/* 결제 버튼 영역 */}
                                {showPayment && orderId && (
                                    <div>
                                        {method === 'card' && (
                                            <CardPaymentForToss
                                                orderId={orderId}
                                                amount={orderPrice}
                                                orderName={cartItems[0]?.productName}
                                                buyerInfo={getBuyerInfo()}
                                                onSuccess={handlePaymentSuccess}
                                                onFail={handlePaymentFail}
                                            />
                                        )}
                                        {method === 'bank' && (
                                            <BankTransferPayment
                                                orderId={orderId}
                                                amount={orderPrice}
                                                orderName={cartItems[0]?.productName}
                                                buyerInfo={getBuyerInfo()}
                                                onSuccess={handlePaymentSuccess}
                                                onFail={handlePaymentFail}
                                            />
                                        )}
                                        {method === 'simple' && (
                                            <EasyPayment
                                                orderId={orderId}
                                                amount={orderPrice}
                                                orderName={cartItems[0]?.productName}
                                                buyerInfo={getBuyerInfo()}
                                                onSuccess={handlePaymentSuccess}
                                                onFail={handlePaymentFail}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Order;
