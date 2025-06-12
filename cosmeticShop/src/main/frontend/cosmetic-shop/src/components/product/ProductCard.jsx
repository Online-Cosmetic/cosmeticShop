
import React, { useState, useEffect } from "react";
import { userAPI } from "../../utils/customAxios";
import { getImageUrl } from '../../utils/imageUtils';

function ProductCard({
                         product,
                         onQuantityChange,
                         editable = true,
                         isOrderPage = false,
                         isChecked = false,
                         onCheck = () => {},
                         onDelete = () => {},
                         // 쿠폰 선택 관련 콜백 함수
                         onSelectCoupon = () => {},
                         // 적용된 쿠폰 할인 금액
                         couponDiscount = 0,
                         // 선택된 쿠폰 정보
                         selectedCoupon = null,
                         showQuantityControls = false,
                     }) {
    // 컴포넌트 내부에서 쿠폰 관리
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loadingCoupons, setLoadingCoupons] = useState(false);

    // 쿠폰 정보 로드
    useEffect(() => {
        if (!isOrderPage || !product?.companyId) return;

        const fetchCoupons = async () => {
            setLoadingCoupons(true);
            try {
                const { data } = await userAPI.coupon.getAvailableCouponsForOrder(
                    product.companyId
                );
                setAvailableCoupons(data);
            } catch (err) {
                console.error("쿠폰 정보 로드 실패:", err);
            } finally {
                setLoadingCoupons(false);
            }
        };

        fetchCoupons();
    }, [isOrderPage, product?.companyId]);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await userAPI.cart.updateQuantity(product.id, newQuantity);
            onQuantityChange();
        } catch (error) {
            console.error(`수량 변경 실패: ${error.message}`);
        }
    };

    const handleIncrease = () => handleQuantityChange(product.quantity + 1);
    const handleDecrease = () => handleQuantityChange(product.quantity - 1);

    // 할인된 가격 계산 (할인율이 없으면 0으로 설정)
    const discountRate = product.discountRate || 0;
    const discountedPrice = Math.floor(product.price * (1 - discountRate / 100));

    // 쿠폰 선택 핸들러
    const handleSelectCoupon = (coupon) => {
        // 상위 컴포넌트의 콜백 함수 호출
        onSelectCoupon(product.productId || product.id, coupon);
    };

    // 이미지 URL 처리 로직 수정
    const getProductImageUrl = () => {
        // 완전한 URL이 이미 있는 경우 (http:// 또는 https://로 시작하는 경우)
        if (product.mainImageUrl && (product.mainImageUrl.startsWith('http://') || product.mainImageUrl.startsWith('https://'))) {
            return product.mainImageUrl;
        }

        if (product.thumbnailImageUrl && (product.thumbnailImageUrl.startsWith('http://') || product.thumbnailImageUrl.startsWith('https://'))) {
            return product.thumbnailImageUrl;
        }

        // 이미지 우선순위: thumbnailImage -> thumbnailImageUrl -> mainImageUrl -> productImage -> 기본 이미지
        if (product.thumbnailImage) {
            return getImageUrl(product.thumbnailImage);
        } else if (product.thumbnailImageUrl) {
            return getImageUrl(product.thumbnailImageUrl);
        } else if (product.mainImageUrl) {
            return getImageUrl(product.mainImageUrl);
        } else if (product.productImage) {
            return getImageUrl(product.productImage);
        } else {
            return "https://via.placeholder.com/300x200.png?text=No+Image";
        }
    };

    // 할인율 배지 컴포넌트 추가
    const DiscountBadge = ({ discountRate }) => {
        if (!discountRate || discountRate <= 0) return null;

        return (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-md">
                {discountRate}%
            </div>
        );
    };

    return (
        <div
            className={`flex gap-6 border-b border-gray-100 w-full items-start ${
                isOrderPage ? "h-auto py-6" : "py-6"
            } hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4`}
        >
            {!isOrderPage && (
                <div className="pt-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={onCheck}
                        className="w-5 h-5 accent-emerald-600 cursor-pointer rounded focus:ring-emerald-500"
                    />
                </div>
            )}

            <div className="flex-shrink-0">
                <div className="relative overflow-hidden rounded-lg shadow-sm group">
                    <img
                        src={getProductImageUrl()}
                        alt={product.productName || product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                            console.error("이미지 로드 실패");
                            e.target.src = "https://placehold.co/600x400";
                        }}
                    />
                    <DiscountBadge discountRate={discountRate} />
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <div>
                    {product.brand && (
                        <p className="text-sm text-gray-500 font-medium product-description">{product.brand}</p>
                    )}
                    <p className="text-lg font-semibold text-gray-900 product-name">{product.productName || product.name}</p>
                </div>

                {/* 수량 조절 UI를 showQuantityControls prop으로 제어 */}
                {editable && showQuantityControls ? (
                    <div className="flex items-center mt-1">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <button
                                onClick={handleDecrease}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
                                disabled={product.quantity <= 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="px-3 py-1.5 min-w-[2.5rem] text-center font-medium">{product.quantity}</span>
                            <button
                                onClick={handleIncrease}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-base font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-md inline-block">
                        {product.quantity}개
                    </div>
                )}

                {/* 할인율과 가격 정보 */}
                <div className="mt-1">
                    {discountRate > 0 && (
                        <span className="text-red-500 font-medium mr-2 product-price">{discountRate}%</span>
                    )}
                    <span className="font-bold text-gray-900 product-price">{discountedPrice.toLocaleString()}원</span>
                    {discountRate > 0 && (
                        <span className="text-gray-400 text-sm line-through ml-2 product-price">{product.price?.toLocaleString()}원</span>
                    )}
                </div>
            </div>

            {/* 오른쪽 영역 추가 - 쿠폰 버튼 및 선택 UI */}
            {isOrderPage && (
                <div className="flex-shrink-0 flex flex-col items-end ml-2 min-w-[120px]">
                    {/* 쿠폰 로딩 중 표시 */}
                    {loadingCoupons ? (
                        <div className="text-sm text-gray-500 italic">쿠폰 정보 로딩 중...</div>
                    ) : availableCoupons.length > 0 ? (
                        <div className="flex flex-col items-end w-full">
                            <button
                                onClick={() => {
                                    const dropdown = document.getElementById(`coupon-dropdown-${product.productId || product.id}`);
                                    if (dropdown) {
                                        dropdown.classList.toggle('hidden');
                                    }
                                }}
                                className="mb-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors duration-200 flex items-center shadow-sm whitespace-nowrap font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                쿠폰 사용
                            </button>

                            {/* 쿠폰 선택 드롭다운 */}
                            <div
                                id={`coupon-dropdown-${product.productId || product.id}`}
                                className="w-full mt-1 hidden shadow-md rounded-md border border-gray-200 bg-white z-10"
                            >
                                <div className="p-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1.5">사용 가능한 쿠폰</div>
                                    <select
                                        value={selectedCoupon ? selectedCoupon.id : ""}
                                        onChange={(e) => {
                                            const couponId = e.target.value;
                                            if (couponId === "") {
                                                handleSelectCoupon(null);
                                            } else {
                                                const selected = availableCoupons.find(c => c.id.toString() === couponId);
                                                handleSelectCoupon(selected);
                                                // 선택 후 드롭다운 닫기
                                                const dropdown = document.getElementById(`coupon-dropdown-${product.productId || product.id}`);
                                                if (dropdown) dropdown.classList.add('hidden');
                                            }
                                        }}
                                        className="text-sm border border-gray-300 rounded-md p-1.5 pr-8 w-full"
                                    >
                                        <option value="">쿠폰 선택</option>
                                        {availableCoupons.map(coupon => (
                                            <option key={coupon.id} value={coupon.id}>
                                                {coupon.couponName} ({coupon.discountRate}%)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 쿠폰 할인 정보 표시 */}
                            {selectedCoupon && couponDiscount > 0 && (
                                <div className="text-sm text-red-500 font-medium mt-1">
                                    - {couponDiscount.toLocaleString()}원
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 italic">사용 가능한 쿠폰 없음</div>
                    )}
                </div>
            )}

            {/* 삭제 버튼 (장바구니 페이지에서만 표시) */}
            {!isOrderPage && editable && (
                <button
                    onClick={() => onDelete(product.id)}
                    className="px-2 py-2 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="상품 삭제"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default ProductCard;