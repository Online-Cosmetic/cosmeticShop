import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import AddressForm from "../../components/user/AddressForm.jsx";

function OrderComplete() {
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
      <main className="flex-grow flex flex-col">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">
            Order Complete
          </h2>
          <div>
            <div className="flex flex-col gap-8">
              <article className="flex gap-6 border rounded-lg p-6 shadow">
                {/* 좌측 영역: 배송 정보 + 주문 상품 */}
                <aside className="flex-1 min-w-0 space-y-8">
                  <section className="flex flex-col border rounded-lg p-6 shadow">
                    <h3 className="text-2xl font-semibold mb-4 text-neutral-800">
                      Shipping Information
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-neutral-500">
                          Address Name
                        </span>
                        <span className="text-sm text-neutral-500">
                          Address
                        </span>
                        <span className="text-sm text-neutral-500">
                          Phone Number
                        </span>
                      </div>
                    </div>
                  </section>

                  <section className="flex flex-col border rounded-lg p-6 shadow">
                    <h3 className="text-2xl font-semibold mb-4 text-neutral-800">
                      Payment Information
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-neutral-500">
                          Payment Method
                        </span>
                        <span className="text-sm text-neutral-500">
                          Payer Name
                        </span>
                      </div>
                    </div>
                  </section>
                </aside>

                {/* 우측 영역: 주문 요약 + 버튼 */}
                <aside className="w-96 flex-shrink-0 space-y-6">
                  <div className="border rounded-lg p-6 shadow">
                    <h3 className="text-2xl font-semibold mb-4">
                      Order Summary
                    </h3>
                    <CartSummary />
                  </div>
                </aside>
              </article>
              <button
                className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg"
                onClick={() => navigate("/")}
              >
                Back to Main
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderComplete;
