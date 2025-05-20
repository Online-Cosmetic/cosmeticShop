import React from "react";
import axios from "axios";

function ProductCard({
  product,
  onQuantityChange,
  editable = true,
  isOrderPage = false,
}) {
  const handleIncrease = () => {
    axios
      .patch(`/api/cart/${product.id}`, { quantity: product.quantity + 1 })
      .then(() => onQuantityChange())
      .catch((err) => console.error("수량 증가 실패", err));
  };

  const handleDecrease = () => {
    if (product.quantity <= 1) return;
    axios
      .patch(`/api/cart/${product.id}`, { quantity: product.quantity - 1 })
      .then(() => onQuantityChange())
      .catch((err) => console.error("수량 감소 실패", err));
  };

  return (
    <div
      className={`flex gap-6 border-b w-full items-start ${isOrderPage ? "h-[160px]" : "py-4"}`}
    >
      {!isOrderPage && (
        <input
          type="checkbox"
          className="w-5 h-5 mt-2 accent-emerald-600 cursor-pointer"
        />
      )}
      <img
        src={product.image}
        className="w-36 h-36 rounded-xl"
        alt={product.name}
      />
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold">{product.brand}</p>
        <p>{product.name}</p>
        {editable ? ( // Cart에서는 수량조정가능, Order에서는 수량조절불가
          <div className="flex items-center gap-2">
            <button className="text-2xl" onClick={handleDecrease}>
              −
            </button>
            <span>{product.quantity}</span>
            <button className="text-2xl" onClick={handleIncrease}>
              +
            </button>
          </div>
        ) : (
          <div className="text-base">{product.quantity} items</div>
        )}
        <p className="font-semibold">₩{product.price.toLocaleString()}</p>
        <p className="text-red-400 font-bold">{product.promotion}</p>
      </div>
    </div>
  );
}

export default ProductCard;
