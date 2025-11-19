import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getRecentProducts, removeRecentProduct } from "../../utils/recentProducts";
import { getImageUrl } from "../../utils/imageUtils";
import { XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

/**
 * 최근 본 상품 목록 컴포넌트
 */
const RecentProducts = ({ maxItems = 10, showRemoveButton = true }) => {
    const [recentProducts, setRecentProducts] = useState([]);
    const containerRef = useRef(null);

    // 최근 본 상품 목록 로드
    useEffect(() => {
        const loadRecentProducts = () => {
            const products = getRecentProducts();
            setRecentProducts(products.slice(0, maxItems));
        };

        loadRecentProducts();

        // 스토리지 변경 이벤트 리스너 (다른 탭에서 변경된 경우 대응)
        const handleStorageChange = (e) => {
            if (e.key === 'recentProducts' || !e.key) {
                loadRecentProducts();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        // 커스텀 이벤트 리스너 (같은 탭에서 변경된 경우 대응)
        window.addEventListener('recentProductsUpdated', loadRecentProducts);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('recentProductsUpdated', loadRecentProducts);
        };
    }, [maxItems]);

    // 상품 제거 핸들러
    const handleRemoveProduct = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        removeRecentProduct(productId);
        setRecentProducts(prev => prev.filter(p => p.productId !== productId));
        // 커스텀 이벤트 발생
        window.dispatchEvent(new Event('recentProductsUpdated'));
    };

    if (recentProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <ClockIcon className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">최근 본 상품이 없습니다</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            <div 
                ref={containerRef}
                className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {recentProducts.map((product) => {
                const imageUrl = product.thumbnailImageUrl 
                    ? getImageUrl(product.thumbnailImageUrl)
                    : "https://via.placeholder.com/200x200.png?text=No+Image";
                
                const discountedPrice = product.discountRate > 0
                    ? Math.floor(product.price * (1 - product.discountRate / 100))
                    : product.price;

                return (
                    <div
                        key={product.productId}
                        className="flex-shrink-0 w-48 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white relative group"
                    >
                        <Link to={`/detail/${product.productId}`} className="block">
                            <div className="h-40 overflow-hidden bg-gray-100 relative">
                                <img
                                    src={imageUrl}
                                    alt={product.productName}
                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                />
                                {showRemoveButton && (
                                    <button
                                        onClick={(e) => handleRemoveProduct(e, product.productId)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="최근 본 상품에서 제거"
                                    >
                                        <XMarkIcon className="w-4 h-4 text-white" />
                                    </button>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-800">
                                    {product.productName}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        {product.discountRate > 0 && (
                                            <span className="text-red-500 font-medium text-xs mr-1">
                                                {product.discountRate}%
                                            </span>
                                        )}
                                        <span className="font-bold text-gray-900 text-sm">
                                            {discountedPrice.toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
            </div>
            
            {/* 좌우 스크롤 버튼 */}
            {recentProducts.length > 4 && (
                <>
                    <button 
                        onClick={() => {
                            if (containerRef.current) {
                                containerRef.current.scrollLeft -= 200;
                            }
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
                        aria-label="이전 상품"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => {
                            if (containerRef.current) {
                                containerRef.current.scrollLeft += 200;
                            }
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
                        aria-label="다음 상품"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
};

export default RecentProducts;

