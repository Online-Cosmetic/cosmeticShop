import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductList from "./ProductList";
import { userAPI } from "../../utils/customAxios";
import { getImageUrl } from "../../utils/imageUtils";

const CATEGORY_LIST = ["all", "makeup", "skincare", "hair", "body"];

function ProductPage() {
    const { category } = useParams();
    const selectedCategory = category || "all";  // 기본값

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response;

                if (selectedCategory.toLowerCase() === "all") {
                    response = await userAPI.product.getLatest();
                } else {
                    response = await userAPI.product.getByCategory(selectedCategory);
                }

                // API 응답 구조에 맞게 데이터 추출
                const productData = response.data.batchesPreviews || [];
                
                // 받아온 데이터를 ProductList 컴포넌트에 맞게 변환
                const formattedProducts = productData.map(product => ({
                    id: product.productId,
                    title: product.productName,
                    content: product.description,
                    price: product.price,
                    imageUrl: product.thumbImgUrl ? getImageUrl(product.thumbImgUrl) : null
                }));
                
                setProducts(formattedProducts);
                setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
            } catch (err) {
                console.error("상품 로딩 중 오류 발생:", err);
                setError("상품을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(offset, offset + itemsPerPage);

    if (loading) return <div className="text-center py-10">상품을 불러오는 중입니다...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-6">
            <ProductList products={currentProducts} title={selectedCategory} />

            <div className="flex justify-center mt-8 gap-2">
                {/* 페이지네이션 */}
                {products.length > itemsPerPage && (
                    <>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 disabled:opacity-50"
                        >
                            ◀
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 ${
                                    currentPage === i + 1 ? "bg-black text-white" : "bg-white"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 disabled:opacity-50"
                        >
                            ▶
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductPage;