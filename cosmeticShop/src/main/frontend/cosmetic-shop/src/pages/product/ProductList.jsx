import React from "react";
import { useNavigate } from "react-router-dom";

function ProductList({ products, title }) {
    let navigate = useNavigate();

    return (
        <>
            <div className="max-w-screen-xl mx-auto px-4 pt-5">
                <div className="mb-6">
                    <h4 className="text-2xl font-semibold capitalize">{title}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/detail/${product.id}`)}
                                className="cursor-pointer"
                            >
                                <Product product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            이 카테고리에 상품이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function Product({ product }) {
    return (
        <div className="cursor-pointer p-4 w-full">
            <div className="relative w-full h-[200px] mb-2 overflow-hidden rounded-lg">
                <img
                    src={product.imageUrl || "https://via.placeholder.com/300x200.png?text=No+Image"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200.png?text=No+Image";
                    }}
                />
            </div>
            <h5 className="text-lg font-semibold my-0.5">{product.title}</h5>
            <p className="text-gray-600 text-sm mb-0.5">{product.content}</p>
            <p className="text-black-600 text-lg">{product.price.toLocaleString()}원</p>
        </div>
    );
}

export default ProductList;