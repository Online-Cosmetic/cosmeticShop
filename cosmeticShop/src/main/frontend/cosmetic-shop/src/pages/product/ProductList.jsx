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
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-w-3 aspect-h-2 overflow-hidden">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/300x200.png?text=No+Image"}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200.png?text=No+Image";
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.content}</p>
                  
                  {/* 할인율과 가격 정보 추가 */}
                  <div className="mt-2">
                    <div className="text-gray-500">
                      <span>{discountRate}%</span>
                      <span className="line-through ml-1">{product.price.toLocaleString()}원</span>
                    </div>
                    {/*<p className={`font-bold text-xl ${discountRate > 0 ? 'text-red-500' : 'text-gray-900'}`}>*/}
                    <p className={`font-bold text-xl text-red-500`}>
                      {discountedPrice.toLocaleString()}원
                    </p>
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