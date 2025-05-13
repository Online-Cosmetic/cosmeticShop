import React from "react";
import axios from "axios";

function ProductCard({ product, onQuantityChange, editable = true }) {
    const handleIncrease = () => {
        axios.patch(`/api/cart/${product.id}`, { quantity: product.quantity + 1 })
            .then(() => onQuantityChange())
            .catch((err) => console.error("수량 증가 실패", err));
    };

    const handleDecrease = () => {
        if (product.quantity <= 1) return;
        axios.patch(`/api/cart/${product.id}`, { quantity: product.quantity - 1 })
            .then(() => onQuantityChange())
            .catch((err) => console.error("수량 감소 실패", err));
    };

    return (
        <div className="flex gap-4 border-b pb-4 w-full">
            <input type="checkbox" className="mt-2" />
            <img src={product.image} className="w-44 h-44 rounded-xl" alt={product.name} />
            <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">{product.brand}</p>
                <p>{product.name}</p>
                {editable ? ( // Cart에서는 수량조정가능, Order에서는 수량조절불가
                    <div className="flex items-center gap-2">
                        <button className="text-2xl" onClick={handleDecrease}>−</button>
                        <span>{product.quantity}</span>
                        <button className="text-2xl" onClick={handleIncrease}>+</button>
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