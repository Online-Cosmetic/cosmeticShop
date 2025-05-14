import React from "react";
import ProductList from "../../components/user/ProductList.jsx";
import UserHeader from "../../components/user/UserHeader.jsx";
import Footer from "../../components/common/Footer.jsx";
import { useParams } from "react-router-dom";

function Detail({ products, title }) {
  let { id } = useParams();
  let product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <UserHeader/>
      <div className="pt-5 max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 이미지 영역 */}
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <img
                  src={`/product(${product.id + 1}).png`}
                  alt={product.title}
                  className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>
          </div>

          {/* 텍스트 영역 */}
          <div className="w-full md:w-1/2">
            <h4 className="text-2xl font-semibold pt-5">{product.title}</h4>
            <p className="pt-2 text-gray-500 text-base font-light">
              {product.content}
            </p>
            <p className="pt-1 text-black text-base font-light">
              {"$ " + product.price}
            </p>
            <p className="pt-2 text-gray-500 text-sm leading-snug">
              Body text for describing what this product is and why this product
              is simply a must-buy.
            </p>

            {/* 버튼 */}
            <button className="w-full bg-black text-white py-2 mt-4 rounded hover:bg-gray-800 transition">
              Add to Cart
            </button>

            <p className="pt-3 text-gray-400 text-xs leading-snug">
              Text box for additional details or fine print
            </p>
          </div>
        </div>
      </div>
      <ProductList products={products} title={title} />
      <Footer/>
    </>
  );
}

export default Detail;
