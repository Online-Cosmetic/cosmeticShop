import React, { useState, useEffect } from "react";
import ProductList from "./ProductList.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../../utils/customAxios";
import { getImageUrl } from "../../utils/imageUtils";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Detail({ title }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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

  // 주문하기 함수
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login", { state: { from: `/detail/${id}` } });
      return;
    }

    // 주문 상품 정보를 로컬 스토리지에 저장하고 주문 페이지로 이동
    const orderItem = {
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      quantity: quantity,
      image: product.images && product.images.length > 0 ? product.images[0].imageUrl : null
    };

    localStorage.setItem('directOrderItem', JSON.stringify(orderItem));
    navigate('/user/order', { state: { directOrder: true } });
  };

  if (loading) return <div className="text-center py-10">상품 정보를 불러오는 중입니다...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">상품을 찾을 수 없습니다.</div>;

  // 메인 이미지 URL 찾기
  const mainImageUrl = product.images && product.images.length > 0
    ? getImageUrl(product.images[0].imageUrl)
    : "https://via.placeholder.com/300x200.png?text=No+Image";

  return (
      <div className="flex flex-col min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="pt-5 max-w-screen-xl mx-auto px-4 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 이미지 영역 */}
            <div className="w-full md:w-1/2">
              <div className="rounded-lg overflow-hidden">
                <img
                    src={mainImageUrl}
                    alt={product.productName}
                    className="w-full h-[300px] object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200.png?text=No+Image";
                    }}
                />
              </div>
            </div>

            {/* 텍스트 영역 */}
            <div className="w-full md:w-1/2">
              <h4 className="text-2xl font-semibold pt-5">{product.productName}</h4>
              <p className="pt-2 text-gray-500 text-base font-light">
                {product.description}
              </p>
              <p className="pt-1 text-black text-base font-light">
                {product.price.toLocaleString()}원
              </p>
              <p className="pt-2 text-gray-500 text-sm leading-snug">
                {product.description || "상세 설명이 없습니다."}
              </p>

              {/* 재고 정보 */}
              <p className="pt-2 text-gray-600 text-sm">
                재고: {product.stock}개
              </p>

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

              {/* 총 가격 */}
              <p className="mt-4 text-lg font-semibold">
                총 가격: {(product.price * quantity).toLocaleString()}원
              </p>

              {/* 버튼 영역 */}
              <div className="flex flex-col gap-2 mt-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock <= 0}
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:bg-gray-400"
                >
                  {addingToCart ? "추가 중..." : "장바구니에 추가"}
                </button>
                
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  바로 구매하기
                </button>
              </div>

              {product.stock <= 0 && (
                <p className="mt-2 text-red-500 text-center">품절된 상품입니다.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* 관련 상품 */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <ProductList products={relatedProducts} title={title || "관련 상품"} />
          </div>
        )}
      </div>
  );
}

export default Detail;