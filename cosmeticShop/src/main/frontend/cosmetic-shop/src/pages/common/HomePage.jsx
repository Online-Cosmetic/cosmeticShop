import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { userAPI } from "../../utils/customAxios.js";
import { Link } from "react-router-dom";
import { StarIcon, SparklesIcon, TrophyIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";

const HomePage = () => {
    const { user } = useAuth();
    const [bestSellers, setBestSellers] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [currentBestSellerIndex, setCurrentBestSellerIndex] = useState(0);
    const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(true);

    // 캐러셀 컨테이너 참조
    const bestSellerContainerRef = useRef(null);

    // 배너 이미지 배열
    const bannerImages = [
        "/banner1.jpg",
        "/banner2.jpg",
        "/banner3.jpg",
        "/banner4.jpg"
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // 인기 상품 가져오기
                const popularResponse = await userAPI.product.getPopular();
                console.log("인기 상품 응답:", popularResponse.data);
                if (popularResponse.data && popularResponse.data.batchesPreviews) {
                    setBestSellers(popularResponse.data.batchesPreviews);
                }

                // 최신 상품 가져오기 (추천 상품으로 사용)
                const latestResponse = await userAPI.product.getLatest();
                console.log("최신 상품 응답:", latestResponse.data);
                if (latestResponse.data && latestResponse.data.batchesPreviews) {
                    setRecommended(latestResponse.data.batchesPreviews);
                }

                setLoading(false);
            } catch (error) {
                console.error("상품 데이터를 가져오는 중 오류 발생:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // 베스트셀러 컨베이어 벨트 효과를 위한 useEffect
    useEffect(() => {
        if (bestSellers.length === 0) return;

        const interval = setInterval(() => {
            if (bestSellerContainerRef.current) {
                const container = bestSellerContainerRef.current;
                const scrollAmount = container.scrollLeft + container.offsetWidth;
                
                // 스크롤이 끝에 도달하면 처음으로 돌아감
                if (scrollAmount >= container.scrollWidth) {
                    container.scrollLeft = 0;
                } else {
                    container.scrollLeft += 300; // 스크롤 속도 조절
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [bestSellers]);

    // 추천 상품 페이드 인/아웃 효과를 위한 useEffect
    useEffect(() => {
        if (recommended.length <= 1) return;

        const fadeInterval = setInterval(() => {
            // 페이드 아웃
            setFadeIn(false);
            
            // 페이드 아웃 후 인덱스 변경
            setTimeout(() => {
                setCurrentRecommendedIndex(prevIndex => 
                    (prevIndex + 1) % recommended.length
                );
                // 페이드 인
                setFadeIn(true);
            }, 500);
        }, 5000);

        return () => clearInterval(fadeInterval);
    }, [recommended]);

    // 배너 이미지 자동 변경
    useEffect(() => {
        const bannerInterval = setInterval(() => {
            setCurrentBannerIndex(prevIndex => 
                (prevIndex + 1) % bannerImages.length
            );
        }, 7000);

        return () => clearInterval(bannerInterval);
    }, [bannerImages.length]);

    return (
        <div className="w-full flex flex-col items-center bg-[#f8f5f0]">
            {/* Banner */}
            <div
                className="w-full aspect-[3/1] relative bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url('${bannerImages[currentBannerIndex]}')` }}
            >
                {/* Shadow */}
                <div className="absolute inset-0 bg-black/40 z-0" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center justify-center h-full text-center gap-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-neutral-200">CosMall</h1>
                    <p className="text-2xl font-medium text-neutral-300 product-description">당신을 위한 특별한 화장품, 코스몰</p>
                </div>

                {/* Banner Navigation Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                    {bannerImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentBannerIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentBannerIndex ? 'bg-white scale-110' : 'bg-white/50'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full max-w-7xl flex flex-col gap-12 px-4 md:px-40 py-16">

                {/* 베스트셀러 - 컨베이어 벨트 스타일 */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <TrophyIcon className="w-6 h-6 text-amber-500" />
                        <h2 className="text-2xl font-bold text-gray-800 product-name">
                            베스트셀러
                        </h2>
                        <StarIcon className="w-5 h-5 text-amber-400 ml-1" />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-lg text-gray-500 product-description">상품을 불러오는 중...</p>
                        </div>
                    ) : bestSellers && bestSellers.length > 0 ? (
                        <div className="relative overflow-hidden">
                            <div 
                                ref={bestSellerContainerRef}
                                className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {bestSellers.map((product, index) => (
                                    <div 
                                        key={`bestseller-${product.productId}-${index}`} 
                                        className="flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
                                    >
                                        <Link to={`/detail/${product.productId}`}>
                                            <div className="h-48 overflow-hidden bg-gray-100 relative">
                                                <img 
                                                    src={product.thumbImgUrl || "/product-placeholder.png"} 
                                                    alt={product.productName} 
                                                    className="w-full h-full object-cover transition-transform hover:scale-105"
                                                />
                                                {index < 3 && (
                                                    <div className="absolute top-2 left-2 bg-amber-400 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                                        <span className="font-medium text-sm">{index + 1}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-1 line-clamp-1 product-name">{product.productName}</h3>
                                                <p className="text-gray-500 text-sm mb-2 line-clamp-2 product-description">
                                                    {product.description?.substring(0, 60) || ""}
                                                    {product.description?.length > 60 ? "..." : ""}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {product.discountRate > 0 && (
                                                            <span className="text-red-500 font-medium mr-2 product-price">{product.discountRate}%</span>
                                                        )}
                                                        <span className="font-bold text-gray-900 product-price">{product.price?.toLocaleString()}원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            
                            {/* 좌우 스크롤 버튼 */}
                            <button 
                                onClick={() => {
                                    bestSellerContainerRef.current.scrollLeft -= 300;
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
                                    bestSellerContainerRef.current.scrollLeft += 300;
                                }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
                                aria-label="다음 상품"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                            <p className="text-lg text-gray-500 product-description">베스트셀러 상품이 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 추천 상품 - 페이드 인/아웃 효과 */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-gray-800 product-name">
                            {user && user.nickname ? `${user.nickname}님을 위한 추천 상품` : "추천 상품"}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-lg text-gray-500 product-description">상품을 불러오는 중...</p>
                        </div>
                    ) : recommended && recommended.length > 0 ? (
                        <div className="relative">
                            <div 
                                className={`flex flex-col md:flex-row items-center gap-10 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <div className="w-full max-w-md h-64 relative overflow-hidden rounded-lg order-1 md:order-none shadow-md">
                                    <img 
                                        src={recommended[currentRecommendedIndex]?.thumbImgUrl || "/product-placeholder.png"} 
                                        alt={recommended[currentRecommendedIndex]?.productName || "추천 상품"} 
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-white font-bold product-price">
                                                    {recommended[currentRecommendedIndex]?.discountRate > 0 ? (
                                                        <span className="text-red-400 mr-2">{recommended[currentRecommendedIndex]?.discountRate}% 할인</span>
                                                    ) : null}
                                                    {recommended[currentRecommendedIndex]?.price?.toLocaleString()}원
                                                </p>
                                            </div>
                                            <div className="flex space-x-1">
                                                {recommended.map((_, index) => (
                                                    <button 
                                                        key={index}
                                                        onClick={() => {
                                                            setFadeIn(false);
                                                            setTimeout(() => {
                                                                setCurrentRecommendedIndex(index);
                                                                setFadeIn(true);
                                                            }, 500);
                                                        }}
                                                        className={`w-2 h-2 rounded-full transition-all ${
                                                            index === currentRecommendedIndex ? 'bg-white scale-110' : 'bg-white/50'
                                                        }`}
                                                        aria-label={`Go to recommended product ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 order-2 md:order-none">
                                    <h3 className="text-xl font-bold mb-2 product-name">{recommended[currentRecommendedIndex]?.productName}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3 product-description">
                                        {recommended[currentRecommendedIndex]?.description || "상품 설명이 없습니다."}
                                    </p>
                                    <div className="flex items-center gap-2 mb-4">
                                        {recommended[currentRecommendedIndex]?.discountRate > 0 && (
                                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-sm font-medium product-price">
                                                {recommended[currentRecommendedIndex]?.discountRate}% 할인
                                            </span>
                                        )}
                                        <span className="text-xl font-bold product-price">{recommended[currentRecommendedIndex]?.price?.toLocaleString()}원</span>
                                    </div>
                                    <Link 
                                        to={`/detail/${recommended[currentRecommendedIndex]?.productId}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors"
                                    >
                                        <ShoppingBagIcon className="w-5 h-5" />
                                        상품 보기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                            <p className="text-lg text-gray-500 product-description">추천상품이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;