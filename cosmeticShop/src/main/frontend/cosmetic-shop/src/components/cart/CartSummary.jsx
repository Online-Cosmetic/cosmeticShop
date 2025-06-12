import React from "react";
import { useNavigate } from "react-router-dom";

function CartSummary({ cartItems = [] }) {
    const navigate = useNavigate();

    // 각 상품별 원가 계산
    const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 각 상품별 할인된 가격 계산
    let totalDiscountedPrice = 0;
    let totalDiscountAmount = 0;

    cartItems.forEach(item => {
        // 상품의 할인율 적용 (할인율이 없는 경우 0으로 처리)
        const discountRate = item.discountRate || 0;
        // 개별 상품의 할인된 가격 계산 (이미 계산된 값이 있으면 사용, 없으면 계산)
        const discountedPrice = item.discountedPrice || Math.floor(item.price * (1 - discountRate / 100));
        // 할인된 총 가격 (할인가 * 수량)
        const itemTotalDiscountedPrice = discountedPrice * item.quantity;
        // 할인 금액 (원가 - 할인가) * 수량
        const itemDiscountAmount = (item.price - discountedPrice) * item.quantity;

        totalDiscountedPrice += itemTotalDiscountedPrice;
        totalDiscountAmount += itemDiscountAmount;
    });

    const shippingFee = totalOriginalPrice > 0 ? 3000 : 0;
    const finalPrice = totalDiscountedPrice + shippingFee;

    return (
        <div className="w-full">
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="text-gray-900 font-medium">{totalOriginalPrice.toLocaleString()}원</span>
                </div>

                {totalDiscountAmount > 0 && (
                    <div className="flex justify-between items-center text-base">
                        <span className="text-red-500 font-medium">할인 금액</span>
                        <span className="text-red-500 font-medium">- {totalDiscountAmount.toLocaleString()}원</span>
                    </div>
                )}

                <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600">배송비</span>
                    <span className="text-gray-900 font-medium">{shippingFee.toLocaleString()}원</span>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">결제 예정 금액</span>
                    <span className="text-xl font-bold text-red-600">{finalPrice.toLocaleString()}원</span>
                </div>

                {totalDiscountAmount > 0 && (
                    <div className="mt-2 text-right text-sm text-gray-500">
                        (총 {totalDiscountAmount.toLocaleString()}원 할인 적용)
                    </div>
                )}
            </div>
            
            {/* 선택된 상품 갯수 표시 */}
            <div className="mt-4 text-center text-sm text-gray-500">
                {cartItems.length > 0 ? 
                    `${cartItems.length}개 상품 선택됨` : 
                    "선택된 상품이 없습니다"}
            </div>
        </div>
    );
}

export default CartSummary;