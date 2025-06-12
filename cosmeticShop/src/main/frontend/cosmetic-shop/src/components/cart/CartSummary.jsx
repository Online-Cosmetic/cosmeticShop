function CartSummary({ cartItems, couponDiscount = 0 }) {
    // 상품 금액 계산
    const subtotal = cartItems.reduce((sum, item) => {
        const discountRate = item.discountRate || 0;
        const discountedPrice = Math.floor(item.price * (1 - discountRate / 100));
        return sum + (discountedPrice * item.quantity);
    }, 0);
    
    // 배송비 계산 (5만원 이상 무료배송)
    const shippingFee = subtotal >= 50000 ? 0 : 3000;
    
    // 최종 결제 금액 계산 (쿠폰 할인 적용)
    const total = subtotal + shippingFee - couponDiscount;
    
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{subtotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
                <span>배송비</span>
                <span>{shippingFee.toLocaleString()}원</span>
            </div>
            {couponDiscount > 0 && (
                <div className="flex justify-between text-red-500">
                    <span>쿠폰 할인</span>
                    <span>-{couponDiscount.toLocaleString()}원</span>
                </div>
            )}
            <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                    <span>총 결제 금액</span>
                    <span>{total.toLocaleString()}원</span>
                </div>
            </div>
        </div>
    );
}

export default CartSummary;