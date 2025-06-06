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
    
    // 주문 상품 정보 보완
    const orderItem = {
      id: product.productId,
      productId: product.productId,
      productName: product.productName,
      quantity: quantity,
      price: product.price,
      discountRate: product.discountRate || 0,
      thumbnailImage: imageUrls[0], // 여기는 product.data.productDTO.thumbnailImageUrl 로 수정해야할지도
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
    <div className="min-h-screen bg-white-100 w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* 상품 상세 컨텐츠 */}
      <main className="w-[90%] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 bg-gray-100 p-6 rounded-lg shadow">
          {/* 왼쪽: 이미지 슬라이더 */}
          <div className="md:w-1/2 w-full flex flex-col">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={imageUrls[currentImageIndex]}
                alt={product.productName}
                className="w-full h-[450px] object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/450x450.png?text=No+Image";
                }}
              />
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 text-gray-800 shadow-md transition"
                    aria-label="이전 이미지"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 text-gray-800 shadow-md transition"
                    aria-label="다음 이미지"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          currentImageIndex === index ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                        aria-label={`이미지 ${index + 1}로 이동`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="mt-4 flex space-x-2 overflow-x-auto">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-emerald-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.productName} 썸네일 ${index + 1}`}
                      className="w-full h-full object-cover"
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
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{product.productName}</h1>
                {/* 하트 아이콘(찜) */}
                <button className="text-gray-400 hover:text-rose-500 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0
                      116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                  </svg>
                </button>
              </div>
              <p className="mt-4 text-gray-600 text-lg">{product.description || "상세 설명이 없습니다."}</p>
              
              {/* 가격 정보 영역 - 할인율 적용 */}
              <div className="mt-4">
                <div className="text-gray-500">
                  <span>{discountRate}%</span>
                  <span className="line-through ml-1">{product.price.toLocaleString()}원</span>
                </div>
                <p className={`font-bold text-2xl text-red-500`}>
                  {discountedPrice.toLocaleString()}원
                </p>
              </div>

              {/* 재고 정보 */}
              <p className="mt-2 text-gray-600 text-sm">재고: {product.stock}개</p>

              {/* 수량 선택 */}
              <div className="mt-4 flex items-center">
                <span className="mr-3 text-sm">수량:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-lg"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-lg"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 총 가격 - 할인된 가격 반영 */}
              <p className="mt-2 text-lg font-semibold">
                총 가격: <span className={discountRate > 0 ? 'text-red-500' : ''}>{totalDiscountedPrice.toLocaleString()}원</span>
              </p>

              {/* 버튼 영역 */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock <= 0}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
                >
                  {addingToCart ? "추가 중..." : "장바구니 담기"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  즉시 구매하기
                </button>

                <button
                  className="w-full border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  쿠폰받기
                </button>
              </div>

              {product.stock <= 0 && (
                <p className="mt-2 text-red-500 text-center">품절된 상품입니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* 관련 상품 영역 */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              비슷한 상품들
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                // 관련 상품의 할인된 가격 계산
                const relatedDiscountRate = relatedProduct.discountRate || 0;
                const relatedDiscountedPrice = calculateDiscountedPrice(relatedProduct.price, relatedDiscountRate);
                
                return (
                  <div key={relatedProduct.id}
                    onClick={() => navigate(`/detail/${relatedProduct.id}`)}
                    className="bg-white rounded-lg shadow overflow-hidden cursor-pointer">
                    <div className="relative">
                      <img
                        src={relatedProduct.imageUrl || "https://via.placeholder.com/300x200.png?text=No+Image"}
                        alt={relatedProduct.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200.png?text=No+Image";
                        }}
                      />
                      {/* 하트 버튼 */}
                      <button
                        className="absolute top-2 right-2 p-1 bg-white bg-opacity-70 rounded-full text-gray-400 hover:text-rose-500 transition"
                        onClick={(e) => {
                          e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
                          // 좋아요 기능 구현 예정
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{relatedProduct.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{relatedProduct.content}</p>
                      
                      {/* 할인율과 가격 정보 추가 */}
                      <div className="mt-2">
                        <div className="text-gray-500">
                          <span>{relatedDiscountRate}%</span>
                          <span className="line-through ml-1">{relatedProduct.price.toLocaleString()}원</span>
                        </div>
                        <p className={`font-bold text-lg text-red-500`}>
                          {relatedDiscountedPrice.toLocaleString()}원
                        </p>
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