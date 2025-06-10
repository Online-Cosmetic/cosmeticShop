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
                       onDelete = () => {},
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

    // 할인된 가격 계산 (할인율이 없으면 0으로 설정)
    const discountRate = product.discountRate || 0;
    const discountedPrice = Math.floor(product.price * (1 - discountRate / 100));

    // 이미지 URL 처리 로직 수정
    const getProductImageUrl = () => {
        // 디버깅을 위한 로그 추가
        console.log("상품 이미지 정보:", {
            productId: product.productId || product.id,
            thumbnailImage: product.thumbnailImage,
            thumbnailImageUrl: product.thumbnailImageUrl,
            mainImageUrl: product.mainImageUrl
        });

        // 완전한 URL이 이미 있는 경우 (http:// 또는 https://로 시작하는 경우)
        if (product.mainImageUrl && (product.mainImageUrl.startsWith('http://') || product.mainImageUrl.startsWith('https://'))) {
            return product.mainImageUrl;
        }

        if (product.thumbnailImageUrl && (product.thumbnailImageUrl.startsWith('http://') || product.thumbnailImageUrl.startsWith('https://'))) {
            return product.thumbnailImageUrl;
        }

        // 이미지 우선순위: thumbnailImage -> thumbnailImageUrl -> mainImageUrl -> productImage -> 기본 이미지
        if (product.thumbnailImage) {
            return getImageUrl(product.thumbnailImage);
        } else if (product.thumbnailImageUrl) {
            return getImageUrl(product.thumbnailImageUrl);
        } else if (product.mainImageUrl) {
            return getImageUrl(product.mainImageUrl);
        } else if (product.productImage) {
            return getImageUrl(product.productImage);
        } else {
            return "https://via.placeholder.com/300x200.png?text=No+Image";
        }
    };

    return (
        <div
            className={`flex gap-6 border-b border-gray-100 w-full items-start ${
                isOrderPage ? "h-auto py-6" : "py-6"
            } hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4`}
        >
            {!isOrderPage && (
                <div className="pt-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={onCheck}
                        className="w-5 h-5 accent-emerald-600 cursor-pointer rounded focus:ring-emerald-500"
                    />
                </div>
            )}

            <div className="flex-shrink-0">
                <div className="relative overflow-hidden rounded-lg shadow-sm group">
                    <img
                        src={getProductImageUrl()}
                        alt={product.productName || product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                            console.error("이미지 로드 실패");
                            e.target.src = "https://placehold.co/600x400";
                        }}
                    />
                    {discountRate > 0 && (
                        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-md">
                            {discountRate}%
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <div>
                    {product.brand && (
                        <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                    )}
                    <p className="text-lg font-semibold text-gray-900">{product.productName || product.name}</p>
                </div>

                {editable ? (
                    <div className="flex items-center mt-1">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <button
                                onClick={handleDecrease}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
                                disabled={product.quantity <= 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <span className="px-3 py-1.5 min-w-[2.5rem] text-center font-medium">{product.quantity}</span>
                            <button
                                onClick={handleIncrease}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-base font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-md inline-block">
                        {product.quantity}개
                    </div>
                )}

                {/* 할인율과 가격 정보 - 할인율이 0%여도 표시 */}
                <div className="mt-1">
                    {discountRate > 0 ? (
                        <div className="flex items-center mb-1">
                            <span className="text-gray-500 text-sm line-through mr-2">{product.price.toLocaleString()}원</span>
                            <span className="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded">{discountRate}% 할인</span>
                        </div>
                    ) : (
                        <div className="h-5">{/* 할인이 없을 때 공간 유지 */}</div>
                    )}
                    <p className="font-bold text-xl text-gray-900">
                        {discountedPrice.toLocaleString()}원
                    </p>
                </div>

                {product.promotion && (
                    <div className="mt-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-md text-sm font-medium inline-block">
                        {product.promotion}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end gap-2">
                {!editable && (
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                        aria-label="삭제"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}

                {/* 총 가격 표시 (수량 * 할인가) */}
                <div className="text-right mt-auto">
                    <p className="text-sm text-gray-500">총 상품 금액</p>
                    <p className="font-bold text-lg text-emerald-600">
                        {(discountedPrice * product.quantity).toLocaleString()}원
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
