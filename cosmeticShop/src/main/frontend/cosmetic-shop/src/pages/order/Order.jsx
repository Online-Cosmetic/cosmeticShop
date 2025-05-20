import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartSummary from "../../components/cart/CartSummary.jsx";
import AddressForm from "../../components/user/AddressForm.jsx";
import ProductCard from "../../components/product/ProductCard.jsx";

function Order() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");
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

  const handlePayment = () => {
    if (method === "card") navigate("/payment/toss");
    else if (method === "bank") navigate("/payment/bank");
    else if (method === "simple") navigate("/payment/simple");
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-auto">
      <main className="flex-grow">
        <div className="">
          {/* Order */}
          <h2 className="text-3xl font-bold text-neutral-800 mb-6">Order</h2>
          {/* (좌)주소, 상품 목록 + (우)주문 요약, 결제 수단 */}
          <div className="flex gap-6 max-h-[calc(100vh-200px)] overflow-hidden border rounded-lg p-6 shadow">
            {/* 좌측 영역: 주소 + 상품 목록 */}
            <div className="flex-1 min-w-0 space-y-8">
              <AddressForm
                savedAddresses={[
                  {
                    id: "1",
                    city: "경상북도",
                    street: "경산시",
                    detail: "대학로 280",
                  },
                  {
                    id: "2",
                    city: "대구광역시",
                    street: "수성구",
                    detail: "달구벌대로 3109",
                  },
                ]}
              />
              {/* 상품 목록 */}
              <section className="flex-1 flex flex-col border rounded-lg p-6 shadow">
                <h3 className="text-2xl font-semibold mb-4">Order Items</h3>
                <div className="space-y-4 max-h-[320px] overflow-y-scroll pr-2">
                  {cartItems.map((product) => (
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

            {/* 우측 영역: 결제 요약 + 결제 수단 선택 */}
            <div className="w-96 flex-shrink-0 space-y-6">
              <div className="border rounded-lg p-6 shadow">
                <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                <CartSummary />
              </div>

              <div className="border rounded-lg p-6 shadow">
                <h3 className="text-2xl font-semibold mb-4">
                  Select Payment Method
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "신용/체크카드", value: "card" },
                    { label: "계좌이체", value: "bank" },
                    { label: "간편결제", value: "simple" },
                  ].map(({ label, value }) => (
                    <label key={value} className="block">
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={method === value}
                        onChange={() => setMethod(value)}
                        className="peer hidden"
                      />
                      <div
                        className="w-full px-4 py-3 border rounded-lg cursor-pointer
                          peer-checked:border-emerald-600
                          peer-checked:bg-emerald-50
                          peer-checked:text-emerald-700
                          transition-colors"
                      >
                        {label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg"
                onClick={handlePayment}
              >
                Proceed with{" "}
                {method === "card"
                  ? "Card"
                  : method === "bank"
                    ? "Bank Transfer"
                    : "Simple Pay"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Order;
