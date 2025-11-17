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

    // 선택된 주소 상태 추가
    const [selectedAddress, setSelectedAddress] = useState(null);

    // 쿠폰 관련 상태 추가
    const [availableCoupons, setAvailableCoupons] = useState({});  // 각 상품별 사용 가능한 쿠폰 목록
    const [selectedCoupons, setSelectedCoupons] = useState({});    // 각 상품별 선택된 쿠폰
    const [loadingCoupons, setLoadingCoupons] = useState(false);   // 쿠폰 로딩 상태
    const [couponDiscounts, setCouponDiscounts] = useState({});    // 각 상품별 쿠폰 할인 금액
    const [totalCouponDiscount, setTotalCouponDiscount] = useState(0); // 총 쿠폰 할인 금액
    // 쿠폰 적용 유도 상태 추가
    const [showCouponGuide, setShowCouponGuide] = useState(true);  // 쿠폰 적용 유도 메시지 표시 여부
    const [stockWarningShown, setStockWarningShown] = useState(false); // 재고 경고 표시 여부

    // 주소 로딩 상태 참조 - useRef 사용하여 불필요한 리렌더링 방지
    const addressesLoadedRef = useRef(false);
    // 장바구니 아이템 로딩 상태 참조
    const cartItemsLoadedRef = useRef(false);
    // 주문 생성 중인지 추적하는 ref
    const isCreatingOrderRef = useRef(false);

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

    // 쿠폰 관련 함수 수정
    const fetchAvailableCoupons = useCallback(async (productId, companyId) => {
        console.log('쿠폰 로드 시도:', { productId, companyId });
        console.log('userAPI 객체:', userAPI);
        console.log('userAPI.coupon 객체:', userAPI.coupon);
        try {
            setLoadingCoupons(true);

            // API 호출 방식 변경 - getAvailableCouponsByCompany 사용
            const response = await userAPI.coupon.getAvailableCouponsByCompany(companyId);
            console.log(`상품 ${productId}의 쿠폰 정보:`, response);
            const availableCoupons = response.data || [];

            // 상품별 사용 가능한 쿠폰 목록 업데이트
            setAvailableCoupons(prev => ({
                ...prev,
                [productId]: availableCoupons
            }));

        } catch (error) {
            console.error(`상품 ${productId}의 쿠폰 정보를 불러오는 중 오류 발생:`, error);
            console.error("상세 오류:", error.response || error.message || error);

            // 오류 발생 시 빈 배열로 설정하여 UI가 깨지지 않도록 처리
            setAvailableCoupons(prev => ({
                ...prev,
                [productId]: []
            }));
        } finally {
            setLoadingCoupons(false);
        }
    }, []);

    // ProductCard에서 쿠폰 선택 시 호출되는 함수
    const handleSelectCoupon = useCallback((productId, coupon) => {
        // 선택된 쿠폰 업데이트
        setSelectedCoupons(prev => ({
            ...prev,
            [productId]: coupon
        }));

        // 해당 상품의 할인된 가격 계산
        const product = cartItems.find(item => item.productId === productId || item.id === productId);
        if (product) {
            console.log('상품 객체 전체:', product);
            console.log('상품 ID와 회사 ID:', {
                id: product.id,
                productId: product.productId,
                companyId: product.companyId
            });

            // 상품의 할인율 적용된 가격 계산
            const discountRate = product.discountRate || 0;
            const discountedPrice = Math.floor(product.price * (1 - discountRate / 100));

            // 쿠폰 할인 금액 계산 (할인된 가격에 쿠폰 할인율 적용)
            const couponDiscountAmount = coupon
                ? Math.floor(discountedPrice * (coupon.discountRate / 100) * product.quantity)
                : 0;

            // 쿠폰 할인 금액 업데이트
            setCouponDiscounts(prev => {
                const updated = {
                    ...prev,
                    [productId]: couponDiscountAmount
                };

                // 총 쿠폰 할인 금액 계산
                const totalDiscount = Object.values(updated).reduce((sum, discount) => sum + discount, 0);
                setTotalCouponDiscount(totalDiscount);

                return updated;
            });
        }

        // 쿠폰이 선택되면 쿠폰 가이드 메시지 숨기기
        setShowCouponGuide(false);
    }, [cartItems]);

    // 데이터 로드 useEffect
    useEffect(() => {
        // 이미 로드된 경우 중복 실행 방지를 위한 플래그
        let isMounted = true;

        async function fetchData() {
            if (!isMounted) return;
            setLoading(true);

            try {
                // 주소 정보 로드
                const addressesLoaded = await loadAddressData();
                if (!isMounted) return;

                // 상품 정보 로드
                const productsLoaded = await loadProductItems();
                if (!isMounted) return;

                // 상품 정보가 로드되면 각 상품별 쿠폰 정보 로드
                if (productsLoaded && cartItems.length > 0) {
                    // 재고 부족 상품 확인
                    const stockIssues = cartItems.filter(item => {
                        const stock = item.stock || 0;
                        const quantity = item.quantity || 0;
                        return quantity > stock;
                    });

                    if (stockIssues.length > 0 && !stockWarningShown) {
                        const issueMessages = stockIssues.map(item => 
                            `${item.productName || item.name}: 주문 수량 ${item.quantity}개, 현재 재고 ${item.stock || 0}개`
                        ).join('\n');
                        alert(`재고가 부족한 상품이 있습니다:\n${issueMessages}\n\n장바구니에서 수량을 조정해주세요.`);
                        setStockWarningShown(true);
                    }

                    for (const item of cartItems) {
                        // productId와 companyId가 있는 경우에만 쿠폰 정보 로드
                        const productId = item.productId || item.id;
                        const companyId = item.companyId;

                        if (productId && companyId) {
                            await fetchAvailableCoupons(productId, companyId);
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
    }, [loadAddressData, loadProductItems, fetchAvailableCoupons, isDirectOrder, cartItems.length]);

    // 필수 구매자 정보 검증
    const validateBuyerInfo = () => {
        const buyerInfo = getBuyerInfo();
        if (!buyerInfo.email || !buyerInfo.name) {
            setErrorMsg("구매자 정보가 부족합니다. 프로필에서 정보를 확인해주세요.");
            return false;
        }
        return true;
    };

    // 재고 검증 함수
    const validateStock = () => {
        const stockIssues = [];
        cartItems.forEach(item => {
            const stock = item.stock || 0;
            const quantity = item.quantity || 0;
            if (quantity > stock) {
                stockIssues.push({
                    productName: item.productName || item.name,
                    quantity: quantity,
                    stock: stock
                });
            }
        });

        if (stockIssues.length > 0) {
            const issueMessages = stockIssues.map(issue => 
                `${issue.productName}: 주문 수량 ${issue.quantity}개, 현재 재고 ${issue.stock}개`
            ).join('\n');
            setErrorMsg(`재고가 부족한 상품이 있습니다:\n${issueMessages}`);
            return false;
        }
        return true;
    };

    // Order.jsx - handleProceedOrder 함수에서 할인가를 고려한 주문 생성
    const handleProceedOrder = async () => {
        setErrorMsg("");
        
        // 이미 주문이 생성되어 있으면 주문을 다시 생성하지 않음
        if (orderId) {
            setShowPayment(true);
            return;
        }

        // 주문 생성 중이면 중복 호출 방지
        if (isCreatingOrderRef.current) {
            console.log("주문 생성 중입니다. 중복 호출을 방지합니다.");
            return;
        }

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

        // 재고 검증
        if (!validateStock()) {
            return;
        }

        isCreatingOrderRef.current = true;
        try {
            // 주문 상품 정보에 할인가 적용
            const orderItems = cartItems.map(item => {
                const productId = item.productId || item.id;

                // 할인율 적용 가격 계산
                const discountRate = item.discountRate || 0;
                const discountedPrice = Math.floor(item.price * (1 - discountRate / 100));

                // 쿠폰 할인 적용 (선택된 쿠폰이 있는 경우)
                const selectedCoupon = selectedCoupons[productId];
                const couponDiscount = couponDiscounts[productId] || 0;
                const finalPrice = discountedPrice - Math.floor(couponDiscount / item.quantity);

                return {
                    productId: productId,
                    productName: item.productName || item.name,
                    quantity: item.quantity,
                    price: item.price,
                    discountRate: discountRate,
                    couponId: selectedCoupon ? selectedCoupon.couponId : null,
                    couponDiscountRate: selectedCoupon ? selectedCoupon.discountRate : 0,
                    finalPrice: finalPrice
                };
            });

            // 쿠폰 할인을 적용한 최종 가격 계산
            const finalTotalPrice = orderPrice - totalCouponDiscount;

            const orderRequest = {
                orderItemDTO: orderItems,
                addressDTO: {
                    id: selectedAddress.id,
                    city: selectedAddress.city,
                    street: selectedAddress.street,
                    detail: selectedAddress.detail || ""
                },
                recipientName: getBuyerInfo().name,
                totalPrice: finalTotalPrice, // 쿠폰 할인이 적용된 최종 가격
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
            console.error('주문 생성 오류:', e);
            // 재고 부족 에러 처리
            if (e.response?.data?.message || e.message?.includes('재고')) {
                const errorMessage = e.response?.data?.message || e.message || '재고가 부족합니다.';
                setErrorMsg(errorMessage);
                // 재고 부족 시 장바구니 새로고침하여 최신 재고 정보 가져오기
                if (loadProductItems) {
                    await loadProductItems();
                }
            } else {
                setErrorMsg('주문 생성에 실패했습니다.');
            }
        } finally {
            isCreatingOrderRef.current = false;
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

    // 사용 가능한 쿠폰이 있는지 확인하는 함수
    const hasCouponsAvailable = useCallback(() => {
        return Object.values(availableCoupons).some(coupons => coupons && coupons.length > 0);
    }, [availableCoupons]);

    // 쿠폰이 적용되었는지 확인
    const hasAppliedCoupons = useCallback(() => {
        return Object.keys(selectedCoupons).length > 0;
    }, [selectedCoupons]);

    // JSX 부분
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

                                {/* 쿠폰 적용 유도 안내 메시지 */}
                                {!loading && showCouponGuide && hasCouponsAvailable() && !hasAppliedCoupons() && (
                                    <div className="bg-blue-50 p-3 mb-3 rounded-lg border border-blue-200 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-blue-700 font-medium">사용 가능한 쿠폰이 있습니다! 쿠폰을 적용하여 할인받으세요.</span>
                                        </div>
                                        <button
                                            onClick={() => setShowCouponGuide(false)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {/* 쿠폰 일괄 적용 버튼 */}
                                {!loading && cartItems.length > 0 && hasCouponsAvailable() && (
                                    <div className="mb-3 flex justify-end">
                                        <button
                                            onClick={() => {
                                                // 각 상품에 최고 할인율의 쿠폰 자동 적용
                                                cartItems.forEach(item => {
                                                    const productId = item.productId || item.id;
                                                    const productCoupons = availableCoupons[productId] || [];

                                                    if (productCoupons.length > 0) {
                                                        // 할인율이 가장 높은 쿠폰 찾기
                                                        const bestCoupon = productCoupons.reduce((best, current) =>
                                                                (current.discountRate > best.discountRate) ? current : best,
                                                            productCoupons[0]
                                                        );

                                                        // 선택된 쿠폰이 없거나 현재 쿠폰이 더 좋은 경우에만 적용
                                                        const currentCoupon = selectedCoupons[productId];
                                                        if (!currentCoupon || bestCoupon.discountRate > currentCoupon.discountRate) {
                                                            handleSelectCoupon(productId, bestCoupon);
                                                        }
                                                    }
                                                });

                                                // 가이드 메시지 숨기기
                                                setShowCouponGuide(false);
                                            }}
                                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md shadow-sm hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H14a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
                                            </svg>
                                            최적 쿠폰 적용
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-4 overflow-y-auto flex-1 pr-2 min-h-0">
                                    {loading ?
                                        <div>로딩 중...</div>
                                        : cartItems.length === 0 ?
                                            <div>주문할 상품이 없습니다.</div>
                                            : cartItems.map((product) => {
                                                const productId = product.productId || product.id;
                                                // 콘솔에 쿠폰 정보를 출력하여 디버깅
                                                console.log(`상품 ${productId}의 쿠폰 목록:`, availableCoupons[productId]);
                                                const productCoupons = availableCoupons[productId] || [];

                                                // 재고 부족 확인
                                                const stock = product.stock || 0;
                                                const quantity = product.quantity || 0;
                                                const isStockInsufficient = quantity > stock;

                                                return (
                                                    <div key={productId} className={`border rounded-lg overflow-hidden ${isStockInsufficient ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                                                        {isStockInsufficient && (
                                                            <div className="bg-red-100 border-b border-red-200 p-3 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-red-700 font-medium text-sm">
                                                                    재고 부족: 주문 수량 {quantity}개, 현재 재고 {stock}개
                                                                </span>
                                                            </div>
                                                        )}
                                                        <ProductCard
                                                            key={productId}
                                                            product={product}
                                                            onQuantityChange={() => {}}
                                                            editable={false}
                                                            isOrderPage={true}
                                                            // 쿠폰 관련 props 전달 - 각 상품이 자체적으로 쿠폰 정보를 로드
                                                            selectedCoupon={selectedCoupons[productId]}
                                                            onSelectCoupon={handleSelectCoupon}
                                                            couponDiscount={couponDiscounts[productId] || 0}
                                                        />

                                                        {/* 쿠폰 유도 알림 표시 */}
                                                        {productCoupons.length > 0 && !selectedCoupons[productId] && (
                                                            <div className="bg-amber-50 p-2 border-t border-amber-100 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2 3a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1H7z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-amber-700 text-sm">
                                                                    최대 <span className="font-bold">{Math.max(...productCoupons.map(c => c.discountRate))}%</span> 할인 쿠폰을 적용할 수 있어요!
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                </div>
                            </section>
                        </div>

                        {/* 오른쪽: 요약 + 결제 - 전체 높이를 조정 */}
                        <div className="w-96 flex-shrink-0 flex flex-col overflow-y-auto min-h-0">
                            <div className="flex flex-col space-y-3">
                                {/* Order Summary - 패딩 줄임 */}
                                <div className="border rounded-lg p-4 shadow">
                                    <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
                                    <CartSummary
                                        cartItems={cartItems}
                                        couponDiscount={totalCouponDiscount}
                                    />

                                    {/* 쿠폰 할인 요약 표시 */}
                                    {totalCouponDiscount > 0 && (
                                        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                            <div className="flex justify-between text-emerald-600 font-medium">
                                                <span>총 쿠폰 할인:</span>
                                                <span>-{totalCouponDiscount.toLocaleString()}원</span>
                                            </div>
                                        </div>
                                    )}
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
                                                amount={orderPrice - totalCouponDiscount}
                                                orderName={cartItems[0]?.productName}
                                                buyerInfo={getBuyerInfo()}
                                                onSuccess={handlePaymentSuccess}
                                                onFail={handlePaymentFail}
                                            />
                                        )}
                                        {method === 'bank' && (
                                            <BankTransferPayment
                                                orderId={orderId}
                                                amount={orderPrice - totalCouponDiscount}
                                                orderName={cartItems[0]?.productName}
                                                buyerInfo={getBuyerInfo()}
                                                onSuccess={handlePaymentSuccess}
                                                onFail={handlePaymentFail}
                                            />
                                        )}
                                        {method === 'simple' && (
                                            <EasyPayment
                                                orderId={orderId}
                                                amount={orderPrice - totalCouponDiscount}
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