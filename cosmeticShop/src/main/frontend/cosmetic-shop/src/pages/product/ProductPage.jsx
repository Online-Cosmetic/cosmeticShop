import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductList from "./ProductList";
import { userAPI } from "../../utils/customAxios";
import { getImageUrl } from "../../utils/imageUtils";

const CATEGORY_LIST = ["all", "makeup", "skincare", "hair", "body"];
const CATEGORY_NAMES = {
    all: "전체 상품",
    makeup: "메이크업",
    skincare: "스킨케어",
    hair: "헤어",
    body: "바디"
};

function ProductPage() {
    const { category } = useParams();
    const navigate = useNavigate();
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
                    discountRate: product.discountRate || 0, // 할인율 추가
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-emerald-600 font-medium">상품을 불러오는 중입니다...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-sm max-w-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold mb-2">오류가 발생했습니다</h3>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-100 hover:bg-red-200 text-red-600 font-medium px-4 py-2 rounded-md transition-colors duration-200"
                >
                    다시 시도하기
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            {/* 카테고리 네비게이션 */}
            <div className="mb-8 border-b border-gray-200">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                    {CATEGORY_LIST.map((cat) => (
                        <Link
                            key={cat}
                            to={`/products/${cat}`}
                            className={`whitespace-nowrap px-5 py-3 font-medium text-base transition-colors duration-200 mr-2 ${
                                selectedCategory === cat
                                    ? "text-emerald-600 border-b-2 border-emerald-500"
                                    : "text-gray-600 hover:text-emerald-500"
                            }`}
                        >
                            {CATEGORY_NAMES[cat]}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 상품 정렬 옵션 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {CATEGORY_NAMES[selectedCategory]}
                    <span className="text-emerald-600 ml-2 text-lg">({products.length})</span>
                </h1>

                <div className="flex items-center">
                    <select
                        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        defaultValue="latest"
                    >
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                        <option value="lowPrice">낮은 가격순</option>
                        <option value="highPrice">높은 가격순</option>
                    </select>
                </div>
            </div>

            <ProductList products={currentProducts} title="" />

            {/* 페이지네이션 */}
            {products.length > itemsPerPage && (
                <div className="flex justify-center mt-12 mb-4">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            이전
                        </button>

                        <div className="hidden sm:flex">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 text-sm font-medium border border-gray-300 ${
                                        currentPage === i + 1
                                            ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                    } ${i === 0 ? "" : "border-l-0"} ${i === totalPages - 1 ? "rounded-r-md" : ""}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="sm:hidden px-4 py-2 text-sm font-medium bg-white border border-gray-300 border-l-0">
                            {currentPage} / {totalPages}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed sm:border-l-0"
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}

            {/* 상품이 없을 때 메시지 */}
            {products.length === 0 && !loading && !error && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">상품이 없습니다</h3>
                    <p className="text-gray-500 mb-6">해당 카테고리에 상품이 없습니다. 다른 카테고리를 확인해보세요.</p>
                    <button
                        onClick={() => navigate('/products/all')}
                        className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-md font-medium hover:bg-emerald-100 transition-colors duration-200"
                    >
                        전체 상품 보기
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductPage;
