import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductList from "./ProductList";
import { userAPI, companyAPI } from "../../utils/customAxios";
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
    const [sortOption, setSortOption] = useState('latest'); // 정렬 옵션 상태 추가
    const [companies, setCompanies] = useState([]); // 회사 목록 상태 추가
    const [selectedCompany, setSelectedCompany] = useState(null); // 선택된 회사 상태 추가
    const [companyLoading, setCompanyLoading] = useState(true); // 회사 목록 로딩 상태 추가
    const itemsPerPage = 9;
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가

    // 회사 목록 가져오기
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setCompanyLoading(true);
                const response = await companyAPI.getAllCompanyNames();
                // 전체 선택 옵션 추가
                setCompanies([{ id: null, name: "전체 회사" }, ...response.data.companyNames.map((name, index) => ({
                    id: index + 1, // 임시 ID 할당 (실제로는 API에서 ID를 제공해야 함)
                    name
                }))]);
            } catch (err) {
                console.error("회사 목록 로딩 중 오류 발생:", err);
            } finally {
                setCompanyLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response;

                // 회사 필터링 및 정렬 옵션에 따라 API 호출 분기
                if (selectedCompany && selectedCompany.id) {
                    // 회사 필터링이 적용된 경우
                    if (selectedCategory.toLowerCase() === "all") {
                        // 전체 카테고리 + 특정 회사
                        response = await userAPI.product.getByCompany(selectedCompany.id, sortOption);
                    } else {
                        // 특정 카테고리 + 특정 회사
                        response = await userAPI.product.getByCategoryAndCompany(selectedCategory, selectedCompany.id, sortOption);
                    }
                } else {
                    // 회사 필터링이 적용되지 않은 경우 (기존 로직)
                    // 카테고리별 상품 (정렬 옵션 전달)
                       response = await userAPI.product.getByCategory(selectedCategory, sortOption);
//                     if (sortOption === 'popular') {
//                         // 인기순(좋아요 순) 정렬
//                         response = await userAPI.product.getPopular();
//                     } else if (sortOption === 'priceAsc') {
//                         // 가격 낮은순 정렬
//                         response = await userAPI.product.getPriceOrdered('asc');
//                     } else if (sortOption === 'priceDesc') {
//                         // 가격 높은순 정렬
//                         response = await userAPI.product.getPriceOrdered('desc');
//                     } else if (selectedCategory.toLowerCase() === "all") {
//                         // 전체 상품 최신순 정렬
//                         response = await userAPI.product.getLatest();
//                     } else {
//                         // 카테고리별 상품 (정렬 옵션 전달)
//                         response = await userAPI.product.getByCategory(selectedCategory, sortOption);
//                     }
                }

                // API 응답 구조에 맞게 데이터 추출
                const productData = response.data.batchesPreviews || [];

                // 받아온 데이터를 ProductList 컴포넌트에 맞게 변환
                const formattedProducts = productData.map(product => ({
                    id: product.productId,
                    title: product.productName,
                    content: product.description,
                    price: product.price,
                    discountRate: product.discountRate || 0,
                    imageUrl: product.thumbImgUrl ? getImageUrl(product.thumbImgUrl) : null
                }));

                setProducts(formattedProducts);
                setCurrentPage(1); // 필터링 옵션 변경 시 첫 페이지로 리셋
            } catch (err) {
                console.error("상품 로딩 중 오류 발생:", err);
                setError("상품을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, sortOption, selectedCompany]);

    const filteredProducts = products.filter((p) => {
        if (!searchQuery.trim()) return true; // 검색어가 없으면 전체 상품 표시
        const q = searchQuery.toLowerCase();  // 대소문자 구분 없이 검색
        return (
            p.title.toLowerCase().includes(q) ||
            (p.content && p.content.toLowerCase().includes(q))
        );
    });

    const handleViewAll = () => {
        setSearchQuery("");
        setSelectedCompany(null);   // 회사 필터도 초기화 하고 싶으면
        setCurrentPage(1);          // 페이지도 1페이지로
        navigate("/products/all");
    };

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);

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
        <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
            {/* 카테고리 네비게이션 */}
            {/* 카테고리 네비게이션 + 검색 */}
            <div className="mb-8">
                <div className="flex items-center justify-between gap-4">
                    {/* 왼쪽: 카테고리 탭 */}
                    <div className="flex overflow-x-auto pb-2 hide-scrollbar flex-1">
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

                    {/* 오른쪽: 검색창 */}
                    <div className="w-full max-w-xs flex-shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="상품명/설명을 검색하세요"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // 검색어 바뀌면 1페이지로 리셋
                                }}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 회사 필터링 옵션 */}
            {!companyLoading && companies.length > 1 && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-3">
                        {companies.map((company) => (
                            <label key={company.name} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="company"
                                    checked={selectedCompany === company}
                                    onChange={() => setSelectedCompany(company)}
                                    className="form-radio text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-gray-700">{company.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* 상품 정렬 옵션 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {CATEGORY_NAMES[selectedCategory]}
                    <span className="text-emerald-600 ml-2 text-lg">({filteredProducts.length})</span>
                    {selectedCompany && selectedCompany.id && (
                        <span className="text-emerald-600 ml-2 text-lg">- {selectedCompany.name}</span>
                    )}
                </h1>

                <div className="flex items-center">
                    <select
                        className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="latest">최신상품순</option>
                        <option value="popular">인기순</option>
                        <option value="priceAsc">낮은 가격순</option>
                        <option value="priceDesc">높은 가격순</option>
                    </select>
                </div>
            </div>

            {/* 상품 목록 영역 + 상품이 없을 때 메세지 - 너비와 높이를 고정 */}
            <div className="min-h-[800px] w-full flex items-start justify-center">
                {filteredProducts.length === 0 && !loading && !error ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-300 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            상품이 없습니다
                        </h3>
                        <p className="text-gray-500 mb-6">
                            해당 카테고리에 상품이 없습니다. 다른 카테고리를 확인해보세요.
                        </p>
                        <button
                            onClick={handleViewAll}
                            className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-md font-medium hover:bg-emerald-100 transition-colors duration-200"
                        >
                            전체 상품 보기
                        </button>
                    </div>
                ) : (
                    <ProductList products={currentProducts} title="" />
                )}
            </div>

            {/* 페이지네이션 */}
            {filteredProducts.length > itemsPerPage && (
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
        </div>
    );
}

export default ProductPage;