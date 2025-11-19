import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../../utils/customAxios";
import { getImageUrl } from "../../utils/imageUtils";
import { SparklesIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";

/**
 * AiTEMS 개인화 추천 섹션 컴포넌트
 * 비로그인 유저도 볼 수 있으며, 로그인 유도 메시지 표시
 * 기존 추천상품과 동일한 페이드 인/아웃 슬라이드 형태
 */
const RecommendationSection = ({ user }) => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fadeIn, setFadeIn] = useState(true);
    const [ageGroup, setAgeGroup] = useState(null);
    const [gender, setGender] = useState(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await userAPI.recommend.personalized();
                if (response.data && response.data.products && Array.isArray(response.data.products)) {
                    setRecommendedProducts(response.data.products);
                    setAgeGroup(response.data.ageGroup);
                    setGender(response.data.gender);
                } else {
                    setRecommendedProducts([]);
                }
            } catch (err) {
                console.error("개인화 추천 조회 실패:", err);
                setError("추천 상품을 불러오는데 실패했습니다.");
                setRecommendedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    // 자동 슬라이드 (5초마다)
    useEffect(() => {
        if (recommendedProducts.length <= 1) return;

        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % recommendedProducts.length);
                setFadeIn(true);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, [recommendedProducts.length]);

    // 추천 이유 텍스트 생성
    const getRecommendationReason = () => {
        if (!ageGroup || !gender) return "";
        
        const genderText = gender === "M" ? "남자" : gender === "F" ? "여자" : "";
        const ageText = ageGroup ? `${ageGroup.replace("s", "대")}` : "";
        
        const reasons = [];
        if (ageText) reasons.push(ageText);
        if (genderText) reasons.push(genderText);
        
        return reasons.length > 0 ? `${reasons.join(", ")} 고객님을 위한` : "";
    };

    // 비로그인 유저를 위한 UI
    if (!user) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-gray-800 product-name">
                        AI 개인화 추천
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border-2 border-dashed border-emerald-300">
                    <div className="text-center space-y-4">
                        <SparklesIcon className="w-16 h-16 text-emerald-500 mx-auto" />
                        <div>
                            <p className="text-xl font-bold text-gray-800 mb-2">
                                로그인하여 나만의 맞춤 추천을 받아보세요!
                            </p>
                            <p className="text-gray-600 mb-4">
                                AI가 당신의 취향을 분석하여 최적의 상품을 추천해드립니다.
                            </p>
                        </div>
                        <Link 
                            to="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                        >
                            로그인하기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-gray-800 product-name">
                        AI 개인화 추천
                    </h2>
                </div>
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-gray-500 product-description">추천 상품을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-gray-800 product-name">
                        AI 개인화 추천
                    </h2>
                </div>
                <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-500 product-description">{error}</p>
                </div>
            </div>
        );
    }

    if (recommendedProducts.length === 0) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-gray-800 product-name">
                        AI 개인화 추천
                    </h2>
                </div>
                <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-500 product-description">추천 상품이 없습니다.</p>
                </div>
            </div>
        );
    }

    const currentProduct = recommendedProducts[currentIndex];
    const reasonText = getRecommendationReason();

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-gray-800 product-name">
                    AI 개인화 추천
                </h2>
                {reasonText && (
                    <span className="text-sm text-gray-500 font-normal">
                        ({reasonText} 추천)
                    </span>
                )}
            </div>

            <div className="relative">
                <div 
                    className={`flex flex-col md:flex-row items-center gap-10 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="w-full max-w-md h-64 relative overflow-hidden rounded-lg order-1 md:order-none shadow-md">
                        <img 
                            src={getImageUrl(currentProduct?.thumbImgUrl)}
                            alt={currentProduct?.productName || "추천 상품"} 
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold product-price">
                                        {currentProduct?.discountRate > 0 ? (
                                            <span className="text-red-400 mr-2">{currentProduct?.discountRate}% 할인</span>
                                        ) : null}
                                        {currentProduct?.price?.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="flex space-x-1">
                                    {recommendedProducts.map((_, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => {
                                                setFadeIn(false);
                                                setTimeout(() => {
                                                    setCurrentIndex(index);
                                                    setFadeIn(true);
                                                }, 500);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentIndex ? 'bg-white scale-110' : 'bg-white/50'
                                            }`}
                                            aria-label={`Go to recommended product ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 order-2 md:order-none">
                        <h3 className="text-xl font-bold mb-2 product-name">{currentProduct?.productName}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 product-description">
                            {currentProduct?.description || "상품 설명이 없습니다."}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                            {currentProduct?.discountRate > 0 && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-sm font-medium product-price">
                                    {currentProduct?.discountRate}% 할인
                                </span>
                            )}
                            <span className="text-xl font-bold product-price">{currentProduct?.price?.toLocaleString()}원</span>
                        </div>
                        <Link 
                            to={`/detail/${currentProduct?.productId}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                            <ShoppingBagIcon className="w-5 h-5" />
                            상품 보기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationSection;

