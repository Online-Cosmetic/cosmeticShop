import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";

function ProductList({ products, title }) {
    const navigate = useNavigate();

    // 할인된 가격 계산 함수
    const calculateDiscountedPrice = (price, discountRate) => {
        return Math.floor(price * (1 - discountRate / 100));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 capitalize">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length === 0 ? (
                    <p className="col-span-3 text-center text-gray-500">해당 카테고리에 상품이 없습니다.</p>
                ) : (
                    products.map((product) => {
                        // 할인된 가격 계산
                        const discountRate = product.discountRate || 0;
                        const discountedPrice = calculateDiscountedPrice(product.price, discountRate);

                        return (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/detail/${product.id}`, { state: { mainImageUrl: product.imageUrl } })}
                                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 group"
                            >
                                <div className="relative">
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={product.imageUrl || "https://via.placeholder.com/300x300.png?text=No+Image"}
                                            alt={product.title}
                                            className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300x300.png?text=No+Image";
                                            }}
                                        />
                                    </div>

                                    {/* 할인율 배지 */}
                                    {discountRate > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                                            {discountRate}% OFF
                                        </div>
                                    )}

                                    {/* 하트 버튼 */}
                                    <button
                                        className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full text-gray-400 hover:text-rose-500 hover:bg-white transition-all duration-300 shadow-sm"
                                        onClick={(e) => {
                                            e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
                                            // 좋아요 기능 구현 예정
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-200">{product.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">{product.content}</p>

                                    {/* 할인율과 가격 정보 추가 */}
                                    <div className="mt-2">
                                        {discountRate > 0 ? (
                                            <div className="flex items-center mb-1">
                                                <span className="text-gray-500 text-sm line-through mr-2">{product.price.toLocaleString()}원</span>
                                                <span className="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded">{discountRate}% 할인</span>
                                            </div>
                                        ) : (
                                            <div className="h-6">{/* 할인이 없을 때 공간 유지 */}</div>
                                        )}
                                        <p className="font-bold text-lg text-gray-900">
                                            {discountedPrice.toLocaleString()}원
                                        </p>
                                    </div>

                                    {/* 빠른 보기 버튼 (호버 시 표시) */}
                                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            className="w-full bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg py-2 text-sm font-medium hover:bg-emerald-100 transition-colors duration-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/detail/${product.id}`, { state: { mainImageUrl: product.imageUrl } });
                                            }}
                                        >
                                            빠른 보기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ProductList;
