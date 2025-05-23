import React from "react";
import { userAPI } from "../../utils/customAxios";
import { getImageUrl } from '../../utils/imageUtils';

function ProductCard({
  product,
  onQuantityChange,
  editable = true,
  isOrderPage = false,
  isChecked = false,
  onCheck = () => {},
}) {

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

  return (
    <div
      className={`flex gap-6 border-b w-full items-start ${
        isOrderPage ? "h-[160px]" : "py-4"
      }`}
    >
      {!isOrderPage && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheck}
          className="w-5 h-5 mt-2 accent-emerald-600 cursor-pointer"
        />
      )}

      <div className="flex items-center space-x-4">
        <img
          src={getImageUrl(product.productImage)}
          alt={product.productName}
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            console.error(`이미지 로드 실패: ${product.productImage}`);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold">{product.brand}</p>
        <p>{product.name}</p>
        {editable ? (
          <div className="flex items-center gap-2">
            <button
              className="text-2xl px-2 hover:bg-gray-100 rounded"
              onClick={handleDecrease}
              disabled={product.quantity <= 1}
            >
              −
            </button>
            <span className="min-w-[2rem] text-center">{product.quantity}</span>
            <button
              className="text-2xl px-2 hover:bg-gray-100 rounded"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        ) : (
          <div className="text-base">{product.quantity} items</div>
        )}
        <p className="font-semibold">₩{product.price.toLocaleString()}</p>
        {product.promotion && (
          <p className="text-red-400 font-bold">{product.promotion}</p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
