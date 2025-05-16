import React from "react";

function Cart() {

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <div className="max-w-screen-xl mx-auto px-20 py-8">
                    {/* Cart */}
                    <h2 className="text-3xl font-bold text-neutral-800 mb-6">Cart</h2>
                    {/* 상품 목록 + 주문 요약 */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* 상품 목록 */}
                        <div className="flex-1 min-w-0 space-y-8">
                            {[1, 2].map((item) => (
                                <div key={item} className="flex gap-4 border-b pb-4 w-full">
                                    <input type="checkbox" className="mt-2" />
                                    <img src="/product(1).png" className="w-44 h-44 rounded-xl" />
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xl font-bold">Product brand</p>
                                        <p>Product name</p>
                                        <div className="flex items-center gap-2">
                                            <button className="text-2xl">−</button>
                                            <span>Count</span>
                                            <button className="text-2xl">+</button>
                                        </div>
                                        <p className="font-semibold">Price</p>
                                        <p className="text-red-400 font-bold">Promotion</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 주문 요약 */}
                        <div className="w-full max-w-sm flex-shrink-0 border rounded-lg p-6 shadow self-left lg:self-auto">
                            <div className="flex justify-between mb-3 text-lg">
                                <span>Total Price</span>
                                <span>₩25,000</span>
                            </div>
                            <div className="flex justify-between mb-3 text-lg">
                                <span>Shipping Fee</span><span>₩2,500</span>
                            </div>
                            <div className="flex justify-between mb-3 text-lg font-bold">
                                <span>Promo Info</span>
                                <span>- ₩7,500</span>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between mb-6 text-lg font-bold">
                                <span>Order Total</span><span>₩20,000</span>
                            </div>
                            <button className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg">Checkout</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Cart;