import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { userAPI } from "../../utils/customAxios";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductList({ products, title, onSortChange }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    // 좋아요 상태 관리
    const [likedProducts, setLikedProducts] = useState({}); // 개별 상품 상태 저장
    const [productLikedCounts, setProductLikedCounts] = useState({}); // 각 상품의 찜한 사람 수 관리
    const [isLoading, setIsLoading] = useState(false);
    
    // 초기 찜한 사람 수 설정
    useEffect(() => {
        const initialCounts = {};
        products.forEach(product => {
            if (product.liked !== undefined) {
                initialCounts[product.id] = product.liked;
            }
        });
        setProductLikedCounts(prev => ({ ...prev, ...initialCounts }));
    }, [products]);

    // 로그인한 사용자의 좋아요 상품 목록 가져오기
    useEffect(() => {
        if (isAuthenticated) {
            const fetchLikedProducts = async () => {
                try {
                    const response = await userAPI.product.likes.getLikedProducts();
                    const likedMap = {};
                    response.data.forEach(item => {
                        likedMap[item.productId] = true;
                    });
                    setLikedProducts(likedMap);
                } catch (error) {
                    console.error("좋아요 목록을 가져오는데 실패했습니다:", error);
                }
            };
            fetchLikedProducts();
        }
    }, [isAuthenticated]);

    const toggleLike = async (productId) => {
        if (!isAuthenticated) {
            toast.error("로그인이 필요한 서비스입니다.");
            navigate("/login");
            return;
        }

        setIsLoading(true);
        const previousLiked = likedProducts[productId] || false;
        const currentLikedCount = productLikedCounts[productId] !== undefined 
            ? productLikedCounts[productId] 
            : (products.find(p => p.id === productId)?.liked || 0);
        
        // 낙관적 업데이트: 즉시 UI 업데이트
        setLikedProducts(prev => ({
            ...prev,
            [productId]: !previousLiked
        }));
        
        // 찜한 사람 수도 즉시 업데이트 (현재 값 기준으로 정확하게 계산)
        setProductLikedCounts(prev => ({
            ...prev,
            [productId]: currentLikedCount + (previousLiked ? -1 : 1)
        }));
        
        try {
            const response = await userAPI.product.likes.toggleLike(productId);
            const isLiked = response.data; // 토글 후 좋아요 상태 (true/false)

            // 서버 응답으로 최종 상태 동기화
            setLikedProducts(prev => ({
                ...prev,
                [productId]: isLiked
            }));
            
            // 찜 토글 후 상품 정보를 다시 가져와서 정확한 liked 값 동기화
            try {
                const productResponse = await userAPI.product.getById(productId);
                const updatedLiked = productResponse.data?.productDTO?.liked;
                if (updatedLiked !== undefined) {
                    setProductLikedCounts(prev => ({
                        ...prev,
                        [productId]: updatedLiked
                    }));
                }
            } catch (fetchError) {
                console.error("상품 정보를 다시 가져오는데 실패했습니다:", fetchError);
                // 실패해도 낙관적 업데이트 값은 유지
            }
            
            toast.success(isLiked ? "상품을 찜 목록에 추가했습니다." : "상품을 찜 목록에서 제거했습니다.");
        } catch (error) {
            console.error("좋아요 토글에 실패했습니다:", error);
            // 실패 시 이전 상태로 롤백
            setLikedProducts(prev => ({
                ...prev,
                [productId]: previousLiked
            }));
            setProductLikedCounts(prev => ({
                ...prev,
                [productId]: currentLikedCount
            }));
            toast.error("찜하기에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 할인된 가격 계산 함수
    const calculateDiscountedPrice = (price, discountRate) => {
        return Math.floor(price * (1 - discountRate / 100));
    };


    return (
        <div>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex justify-between items-center mb-8">
                {/*<h2 className="text-3xl font-bold capitalize">{title}</h2>*/}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                     // 할인된 가격 계산 - 백엔드에서 받은 discountRate 사용
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

                                 {/* 찜한 사람 수 및 하트 버튼 */}
                                 <div className="absolute top-2 right-2 flex items-center gap-2">
                                     {/* 찜한 사람 수 */}
                                     <div className="bg-white bg-opacity-90 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                                             <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                                         </svg>
                                         <span className="text-xs font-medium text-gray-700">
                                             {productLikedCounts[product.id] !== undefined 
                                                 ? productLikedCounts[product.id] 
                                                 : (product.liked || 0)}
                                         </span>
                                     </div>
                                     {/* 하트 버튼 */}
                                     <button
                                         className="p-2 bg-white bg-opacity-80 rounded-full text-gray-400 hover:text-rose-500 hover:bg-white transition-all duration-300 shadow-sm"
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
                             </div>

                             <div className="p-5 space-y-2">
                                 <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                                     {product.title || product.productName}
                                 </h3>

                                 <p className="text-sm text-gray-500 line-clamp-2">
                                     {product.content || product.description}
                                 </p>

                                 <div className="space-y-1 mt-2">
                                     {discountRate > 0 ? (
                                         <>
                                             <div className="flex items-center">
                                                 <span className="text-gray-500 text-sm line-through mr-2">
                                                     {product.price.toLocaleString()}원
                                                 </span>
                                                 <span className="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded font-medium">
                                                     {discountRate}% 할인
                                                 </span>
                                             </div>
                                             <p className="font-bold text-lg text-red-600">
                                                 {discountedPrice.toLocaleString()}원
                                             </p>
                                         </>
                                     ) : (
                                         <p className="font-bold text-lg text-gray-900">
                                             {product.price.toLocaleString()}원
                                         </p>
                                     )}
                                 </div>
                             </div>
                         </div>
                     );
                })}
            </div>
        </div>
    );
}

export default ProductList;