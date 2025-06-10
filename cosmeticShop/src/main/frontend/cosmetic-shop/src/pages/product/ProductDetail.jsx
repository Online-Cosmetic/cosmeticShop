import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { userAPI } from "../../utils/customAxios";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Detail({ title }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likedRelatedProducts, setLikedRelatedProducts] = useState({});
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 이미지 슬라이더 관련 상태 추가
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 카테고리 ID를 카테고리 이름으로 변환하는 함수
  const getCategoryNameById = (categoryId) => {
    const categoryMap = {
      0: 'all',
      1: 'makeup',
      2: 'skincare',
      3: 'hair',
      4: 'body'
    };
    return categoryMap[categoryId] || 'all';
  };

  // 좋아요 상태 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      const fetchLikedProducts = async () => {
        try {
          const response = await userAPI.product.likes.getLikedProducts();
          const likedProductIds = response.data.map(item => item.productId);

          // 현재 상품이 좋아요 목록에 있는지 확인
          if (product && likedProductIds.includes(product.productId)) {
            setIsLiked(true);
          }

          // 관련 상품 좋아요 상태 설정
          const likedMap = {};
          likedProductIds.forEach(id => {
            likedMap[id] = true;
          });
          setLikedRelatedProducts(likedMap);
        } catch (error) {
          console.error("좋아요 목록을 가져오는데 실패했습니다:", error);
        }
      };
      fetchLikedProducts();
    }
  }, [isAuthenticated, product]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await userAPI.product.getById(id);

        // API 응답에서 필요한 데이터 추출
        const productData = {
          ...response.data.productDTO,
          images: response.data.productImageDTO?.images || []
        };

        setProduct(productData);

        // 썸네일 이미지 URL 가져오기
        const thumbnailImageUrl = productData.thumbnailImageUrl ? getImageUrl(productData.thumbnailImageUrl) : null;

        // 이미지 URL 배열 설정
        let imagesArray = productData.images.map(img => getImageUrl(img.imageUrl));

        // 썸네일 이미지가 있으면 배열 맨 앞에 추가
        if (thumbnailImageUrl && !imagesArray.includes(thumbnailImageUrl)) {
          imagesArray = [thumbnailImageUrl, ...imagesArray];
        }

        // 이미지가 없는 경우 기본 이미지
        if (imagesArray.length === 0) {
          imagesArray = ["https://via.placeholder.com/300x200.png?text=No+Image"];
        }

        setImageUrls(imagesArray);
        setCurrentImageIndex(0); // 항상 첫 번째 이미지부터 시작

        // 관련 상품 가져오기 (같은 카테고리 상품 가정)
        const categoryName = getCategoryNameById(productData.categoryId);
        const categoryResponse = await userAPI.product.getByCategory(categoryName);

        // 받아온 데이터를 ProductList 컴포넌트에 맞게 변환
        const formattedProducts = (categoryResponse.data.batchesPreviews || [])
            .filter(item => item.productId !== Number(id)) // 현재 상품 제외
            .map(item => ({
              id: item.productId,
              title: item.productName,
              content: item.description,
              price: item.price,
              discountRate: item.discountRate || 0,
              imageUrl: item.thumbImgUrl ? getImageUrl(item.thumbImgUrl) : null
            }));

        setRelatedProducts(formattedProducts);
      } catch (err) {
        console.error("상품 상세 정보 로딩 중 오류 발생:", err);
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // 이전 이미지로 이동하는 함수
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  // 다음 이미지로 이동하는 함수
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 좋아요 토글 함수
  const handleToggleLike = async (productId) => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login", { state: { from: `/detail/${id}` } });
      return;
    }

    setIsLikeLoading(true);
    try {
      const response = await userAPI.product.likes.toggleLike(productId);
      const newLikeStatus = response.data; // 토글 후 좋아요 상태 (true/false)

      // 현재 상품의 좋아요 상태 업데이트
      if (productId === product.productId) {
        setIsLiked(newLikeStatus);
      }
      // 관련 상품의 좋아요 상태 업데이트
      else {
        setLikedRelatedProducts(prev => ({
          ...prev,
          [productId]: newLikeStatus
        }));
      }

      toast.success(newLikeStatus ? "상품을 찜 목록에 추가했습니다." : "상품을 찜 목록에서 제거했습니다.");
    } catch (error) {
      console.error("좋아요 토글에 실패했습니다:", error);
      toast.error("찜하기에 실패했습니다.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 장바구니에 추가 함수
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login", { state: { from: `/detail/${id}` } });
      return;
    }

    try {
      setAddingToCart(true);
      await userAPI.cart.addToCart(product.productId, quantity);
      toast.success("장바구니에 상품이 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 중 오류 발생:", error);
      toast.error("장바구니 추가에 실패했습니다.");
    } finally {
      setAddingToCart(false);
    }
  };

  // handleBuyNow 함수 수정
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login", { state: { from: `/detail/${id}` } });
      return;
    }

    // 할인가격 미리 계산
    const discountedPrice = calculateDiscountedPrice(product.price, product.discountRate || 0);

    // 현재 보고 있는 이미지 URL 가져오기 (캐시 버스팅 포함)
    // URL에서 쿼리 파라미터 제거 (캐시 버스팅 타임스탬프 등)
    const cleanImageUrl = imageUrls[currentImageIndex].split('?')[0];

    // 이미지가 백엔드 서버의 절대 경로인지 확인
    const thumbnailImage = cleanImageUrl.includes('/images')
        ? cleanImageUrl.substring(cleanImageUrl.indexOf('/images'))
        : product.thumbnailImageUrl;


    // 주문 상품 정보 보완
    const orderItem = {
      id: product.productId,
      productId: product.productId,
      productName: product.productName,
      quantity: quantity,
      price: product.price,
      discountRate: product.discountRate || 0,
      // thumbnailImageUrl: currentImageUrl,
      // mainImageUrl: currentImageUrl, // 둘 다 설정하여 어떤 필드를 사용하든 이미지가 나오도록 함
      thumbnailImageUrl: thumbnailImage,
      mainImageUrl: thumbnailImage, // 둘 다 설정하여 어떤 필드를 사용하든 이미지가 나오도록 함
      discountedPrice: discountedPrice
    };

    // 배송비 포함 총 가격 계산
    const shippingFee = 3000; // 배송비
    const totalPrice = (discountedPrice * quantity) + shippingFee;

    // 직접 주문 상품 배열 형태로 저장 (단일 상품이지만 배열로 저장)
    localStorage.setItem('directOrderItems', JSON.stringify([orderItem]));

    // 총 주문 가격도 저장
    localStorage.setItem('directOrderTotalPrice', totalPrice.toString());

    navigate('/user/order', {
      state: {
        directOrder: true,
        productData: [orderItem], // 상태로도 전달
        totalPrice: totalPrice    // 총 가격도 함께 전달
      }
    });
  };

  // 할인된 가격 계산
  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100));
  };

  if (loading) return <div className="text-center py-10">상품 정보를 불러오는 중입니다...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">상품을 찾을 수 없습니다.</div>;

  // 상품 할인율 및 할인가 계산
  const discountRate = product.discountRate || 0;
  const discountedPrice = calculateDiscountedPrice(product.price, discountRate);
  const totalDiscountedPrice = discountedPrice * quantity;

  return (
      <div className="min-h-screen  w-full">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* 상품 상세 컨텐츠 */}
        <main className="w-full max-w-7xl mx-auto p-4">
          <div className="flex flex-col md:flex-row gap-10 p-8 rounded-xl shadow-lg">
            {/* 왼쪽: 이미지 슬라이더 */}
            <div className="md:w-1/2 w-full flex flex-col">
              <div className="relative rounded-xl overflow-hidden shadow-md group">
                <img
                    src={imageUrls[currentImageIndex]}
                    alt={product.productName}
                    className="w-full h-[500px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/450x450.png?text=No+Image";
                    }}
                />
                {imageUrls.length > 1 && (
                    <>
                      <button
                          onClick={goToPreviousImage}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 text-gray-800 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          aria-label="이전 이미지"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                          onClick={goToNextImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 text-gray-800 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          aria-label="다음 이미지"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-3">
                        {imageUrls.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentImageIndex === index ? 'bg-emerald-500 scale-125' : 'bg-white bg-opacity-70 hover:bg-opacity-100'
                                }`}
                                aria-label={`이미지 ${index + 1}로 이동`}
                            />
                        ))}
                      </div>
                    </>
                )}
              </div>

              {imageUrls.length > 1 && (
                  <div className="mt-6 flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {imageUrls.map((url, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-md ${
                                currentImageIndex === index ? 'border-emerald-500 shadow-md scale-105' : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                          <img
                              src={url}
                              alt={`${product.productName} 썸네일 ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/80x80.png?text=No+Image";
                              }}
                          />
                        </button>
                    ))}
                  </div>
              )}
            </div>

            {/* 오른쪽: 상품 정보 */}
            <div className="md:w-1/2 w-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.productName}</h1>
                  {/* 하트 아이콘(찜) */}
                  <button
                      onClick={() => handleToggleLike(product.productId)}
                      disabled={isLikeLoading}
                      className={`transition-all duration-300 transform hover:scale-110 p-2 rounded-full ${
                          isLiked ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                  >
                    {isLiked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    )}
                  </button>
                </div>

                {/* 가격 정보 - 할인율이 있는 경우 할인 전 가격 표시 */}
                <div className="mt-6">
                  {discountRate > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center">
                        <span className="text-lg text-gray-500 line-through mr-3">
                          {product.price.toLocaleString()}원
                        </span>
                          <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                          {discountRate}% OFF
                        </span>
                        </div>
                        <div className="flex items-center">
                        <span className="text-3xl font-bold text-red-600">
                          {discountedPrice.toLocaleString()}원
                        </span>
                          <span className="ml-2 text-sm text-gray-500">
                          ({(product.price - discountedPrice).toLocaleString()}원 할인)
                        </span>
                        </div>
                      </div>
                  ) : (
                      <div className="text-3xl font-bold text-gray-900">
                        {product.price.toLocaleString()}원
                      </div>
                  )}
                </div>

                {/* 기존 내용 유지 */}
                <p className="text-gray-700">{product.description}</p>

                {/* 가격 정보 영역 - 할인율 적용 */}
                <div className="bg-white p-5 rounded-lg border border-gray-100">
                  {discountRate > 0 ? (
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md font-semibold text-sm mr-2">{discountRate}% 할인</span>
                        <span className="line-through text-gray-400">{product.price.toLocaleString()}원</span>
                      </div>
                  ) : (
                      <div className="mb-2">
                        <span className="text-gray-500">정상가</span>
                      </div>
                  )}
                  <p className="font-bold text-3xl text-gray-900">
                    {discountedPrice.toLocaleString()}<span className="text-xl ml-1">원</span>
                  </p>
                </div>

                {/* 재고 및 수량 선택 */}
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">재고 상태</span>
                    <span className={`font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                    {product.stock > 10 ? '재고 충분' : product.stock > 0 ? `재고 ${product.stock}개 남음` : '품절'}
                  </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">수량</span>
                    <div className="flex items-center border  rounded-lg overflow-hidden">
                      {/* - 버튼 */}
                      <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 focus:outline-none"
                          disabled={quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      {/* 수량 */}
                      <span className="px-4 py-2 min-w-[3rem] text-center font-medium bg-white">{quantity}</span>

                      {/* + 버튼 */}
                      <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 focus:outline-none"
                          disabled={quantity >= product.stock}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 총 가격 - 할인된 가격 반영 */}
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">총 상품 금액</span>
                  <span className="text-2xl font-bold text-emerald-600">{totalDiscountedPrice.toLocaleString()}원</span>
                </div>

                {/* 버튼 영역 */}
                <div className="flex flex-col gap-3 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart || product.stock <= 0}
                        className="w-full bg-white border-2 border-emerald-600 text-emerald-600 py-3 px-4 rounded-lg hover:bg-emerald-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-sm"
                    >
                      {addingToCart ? (
                          <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        추가 중...
                      </span>
                      ) : (
                          <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        장바구니 담기
                      </span>
                      )}
                    </button>

                    <button
                        onClick={handleBuyNow}
                        disabled={product.stock <= 0}
                        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-sm"
                    >
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      즉시 구매하기
                    </span>
                    </button>
                  </div>

                  <button
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-3.6 2.3L3 8m9 0h9" />
                    </svg>
                    쿠폰받기
                  </button>
                </div>

                {product.stock <= 0 && (
                    <div className="mt-2 bg-red-50 text-red-600 p-3 rounded-lg text-center font-medium">
                      현재 품절된 상품입니다. 재입고 시 알림을 받으실 수 있습니다.
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* 관련 상품 영역 */}
          {relatedProducts.length > 0 && (
              <section className="mt-16 pt-12 border-t border-gray-200">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    비슷한 상품
                  </h2>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center transition-colors duration-200">
                    더보기
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => {
                    // 관련 상품의 할인된 가격 계산
                    const relatedDiscountRate = relatedProduct.discountRate || 0;
                    const relatedDiscountedPrice = calculateDiscountedPrice(relatedProduct.price, relatedDiscountRate);

                    return (
                        <div key={relatedProduct.id}
                             onClick={() => navigate(`/detail/${relatedProduct.id}`)}
                             className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 group">
                          <div className="relative">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                              <img
                                  src={relatedProduct.imageUrl || "https://via.placeholder.com/300x300.png?text=No+Image"}
                                  alt={relatedProduct.title}
                                  className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x300.png?text=No+Image";
                                  }}
                              />
                            </div>

                            {/* 할인율 배지 */}
                            {relatedDiscountRate > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                                  {relatedDiscountRate}% OFF
                                </div>
                            )}

                            {/* 하트 버튼 */}
                            <button
                                className={`absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-sm transition-all duration-300 ${
                                    likedRelatedProducts[relatedProduct.id] ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
                                } hover:bg-white`}
                                onClick={(e) => {
                                  e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
                                  handleToggleLike(relatedProduct.id);
                                }}
                                disabled={isLikeLoading}
                            >
                              {likedRelatedProducts[relatedProduct.id] ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                  </svg>
                              ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                       viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                  </svg>
                              )}
                            </button>
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-200">{relatedProduct.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">{relatedProduct.content}</p>

                            {/* 할인율과 가격 정보 추가 */}
                            <div className="mt-2">
                              {relatedDiscountRate > 0 ? (
                                  <div className="flex items-center mb-1">
                                    <span className="text-gray-500 text-sm line-through mr-2">{relatedProduct.price.toLocaleString()}원</span>
                                    <span className="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded">{relatedDiscountRate}% 할인</span>
                                  </div>
                              ) : (
                                  <div className="h-6">{/* 할인이 없을 때 공간 유지 */}</div>
                              )}
                              <p className="font-bold text-lg text-gray-900">
                                {relatedDiscountedPrice.toLocaleString()}원
                              </p>
                            </div>

                            {/* 빠른 보기 버튼 (호버 시 표시) */}
                            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button className="w-full bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg py-2 text-sm font-medium hover:bg-emerald-100 transition-colors duration-200">
                                빠른 보기
                              </button>
                            </div>
                          </div>
                        </div>
                    );
                  })}
                </div>
              </section>
          )}
        </main>
      </div>
  );
}

export default Detail;