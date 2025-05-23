import React from "react";
import { useNavigate } from "react-router-dom";

function CartSummary({ cartItems = [] }) {
    const navigate = useNavigate();
    // 실제 합계 계산
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = totalPrice > 0 ? 2500 : 0;
    const promo = Math.floor(totalPrice * 0.1); // 예시: 10% 할인
    const orderTotal = totalPrice + shippingFee - promo;
    return (
        <div className="w-full max-w-sm flex-shrink-0 border rounded-lg p-6 shadow">
            <div className="flex justify-between mb-3 text-lg">
                <span>Total Price</span>
                <span>₩{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3 text-lg">
                <span>Shipping Fee</span>
                <span>₩{shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3 text-lg font-bold">
                <span>Promo Info</span>
                <span>- ₩{promo.toLocaleString()}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Order Total</span>
                <span>₩{orderTotal.toLocaleString()}</span>
            </div>
            {/*<button*/}
            {/*    className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg"*/}
            {/*    onClick={() => navigate("/order")}>*/}
            {/*    Checkout*/}
            {/*</button>*/}
        </div>
    );
}
export default CartSummary;