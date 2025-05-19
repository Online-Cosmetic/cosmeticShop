import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";

function Cart() {
  const navigate = useNavigate();
  const cartItems = [
    {
      id: 1,
      brand: "Brand A",
      name: "Product A",
      quantity: 2,
      price: 12000,
      image: "/product(1).png",
      promotion: "10% off",
    },
    {
      id: 2,
      brand: "Brand B",
      name: "Product B",
      quantity: 1,
      price: 15000,
      image: "/product(2).png",
      promotion: "10% off",
    },
    {
      id: 3,
      brand: "Brand C",
      name: "Product C",
      quantity: 3,
      price: 8000,
      image: "/product(3).png",
      promotion: "10% off",
    },
  ];
  return (
    <div className="w-full max-w-5xl mx-auto">
      <main className="flex-grow">
        <div className="">
          {/* Cart */}
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">Cart</h2>
          {/* (좌)상품 목록 + (우)주문 요약 */}
          <div className="flex gap-6 border rounded-lg p-6 shadow">
            {/* 상품 목록 */}
            <div className="flex flex-1 flex-col">
              {cartItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuantityChange={() => {}}
                  editable={false}
                />
              ))}
            </div>

            {/* 주문 요약 + 버튼 */}
            <div className="w-96 flex-shrink-0 space-y-6">
              <div className="border rounded-lg p-6 shadow">
                <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                <div className="flex flex-col gap-6">
                  <CartSummary />
                  <button
                    className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg"
                    onClick={() => navigate("/user/order")}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cart;
