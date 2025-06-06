import React from "react";
import { useNavigate } from "react-router-dom";

function CartSummary({ cartItems = [] }) {
    const navigate = useNavigate();
    
    // 각 상품별 원가 계산
    const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 각 상품별 할인가 계산 및 할인 총액 계산
    let totalDiscountAmount = 0;
    cartItems.forEach(item => {
        // 상품의 할인율 적용 (할인율이 없는 경우 0으로 처리)
        const discountRate = item.discountRate || 0;
        const itemDiscountAmount = Math.floor(item.price * item.quantity * (discountRate / 100));
        totalDiscountAmount += itemDiscountAmount;
    });
    
    const shippingFee = totalOriginalPrice > 0 ? 3000 : 0;
    const finalPrice = totalOriginalPrice + shippingFee - totalDiscountAmount;
    
    return (
        <div className="w-full max-w-sm flex-shrink-0 border rounded-lg p-6 shadow">
            <div className="flex justify-between mb-3 text-lg">
                <span>Total Price</span>
                <span>₩{totalOriginalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3 text-lg">
                <span>Shipping Fee</span>
                <span>₩{shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3 text-lg font-bold">
                <span>Promo Info</span>
                <span>- ₩{totalDiscountAmount.toLocaleString()}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Order Total</span>
                <span>₩{finalPrice.toLocaleString()}</span>
            </div>
        </div>
    );
}
export default CartSummary;