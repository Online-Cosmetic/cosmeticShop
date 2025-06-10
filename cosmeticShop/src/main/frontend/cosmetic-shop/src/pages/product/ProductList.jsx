import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";

function ProductList({ products, title }) {
    const navigate = useNavigate();
    // 좋아요 상태 관리
    const [likedProducts, setLikedProducts] = useState({}); // 개별 상품 상태 저장

    const toggleLike = (productId) => {
        setLikedProducts((prev) => ({
            ...prev,
            [productId]: !prev[productId], // 해당 상품 id만 토글
        }));
    };

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
                        const isLiked = likedProducts[product.id] || false;

                        return (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/detail/${product.id}`, { state: { mainImageUrl: product.imageUrl } })}
                                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 group"
                            >
                                <div className="relative">
                                    <div className="relative w-full h-64 overflow-hidden bg-white">
                                        <img
                                            src={product.imageUrl || "https://via.placeholder.com/300x300.png?text=No+Image"}
                                            alt={product.title}
                                            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
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
                                            e.stopPropagation();
                                            toggleLike(product.id);
                                        }}
                                    >
                                        {isLiked ? (
                                            <SolidHeartIcon className="h-5 w-5 text-rose-500" />
                                        ) : (
                                            <HeartIcon className="h-5 w-5 text-gray-400 hover:text-rose-500" />
                                        )}
                                    </button>
                                </div>

                                <div className="p-5 space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                                        {product.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {product.content}
                                    </p>

                                    <div className="space-y-1">
                                        {discountRate > 0 && (
                                            <div className="flex items-center">
                <span className="text-gray-500 text-sm line-through mr-2">
                    {product.price.toLocaleString()}원
                </span>
                                                <span className="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded">
                    {discountRate}% 할인
                </span>
                                            </div>
                                        )}
                                        <p className="font-bold text-lg text-gray-900">
                                            {discountedPrice.toLocaleString()}원
                                        </p>
                                    </div>

                                    {/*/!* 빠른 보기 버튼 (호버 시 표시) *!/*/}
                                    {/*<div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">*/}
                                    {/*    <button*/}
                                    {/*        className="w-full bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg py-2 text-sm font-medium hover:bg-emerald-100 transition-colors duration-200"*/}
                                    {/*        onClick={(e) => {*/}
                                    {/*            e.stopPropagation();*/}
                                    {/*            navigate(`/detail/${product.id}`, { state: { mainImageUrl: product.imageUrl } });*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        빠른 보기*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}
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
