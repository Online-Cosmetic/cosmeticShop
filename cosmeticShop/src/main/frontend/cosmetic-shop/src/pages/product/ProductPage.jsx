import React, { useState, useEffect, useCallback, useRef } from "react";
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

    const PAGE_SIZE = 9;

    const [products, setProducts] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [loadMoreError, setLoadMoreError] = useState(null);
    const [sortOption, setSortOption] = useState('latest'); // 정렬 옵션 상태 추가
    const [companies, setCompanies] = useState([]); // 회사 목록 상태 추가
    const [selectedCompany, setSelectedCompany] = useState(null); // 선택된 회사 상태 추가
    const [companyLoading, setCompanyLoading] = useState(true); // 회사 목록 로딩 상태 추가
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
    const [appliedSearch, setAppliedSearch] = useState("");
    const [page, setPage] = useState(-1);
    const [hasNext, setHasNext] = useState(true);
    const [totalCount, setTotalCount] = useState(null);

    const fetchIdRef = useRef(0);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);
    const lastFetchedPageRef = useRef(-1);

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
        const handler = setTimeout(() => {
            setAppliedSearch(searchQuery.trim());
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const companyFilterId = selectedCompany && selectedCompany.id ? selectedCompany.id : null;

    const fetchProducts = useCallback(async (pageToLoad = 0, reset = false) => {
        const fetchId = ++fetchIdRef.current;
        const safePageToLoad = Math.max(pageToLoad, 0);

        if (!reset && safePageToLoad <= lastFetchedPageRef.current) {
            return;
        }

        if (reset) {
            setError(null);
        }
        setLoadMoreError(null);
        setIsFetchingMore(true);
        if (reset) {
            setIsInitialLoading(true);
        }

        try {
            let response;

            if (companyFilterId) {
                if (selectedCategory.toLowerCase() === "all") {
                    response = await userAPI.product.getByCompany(companyFilterId, sortOption, safePageToLoad, PAGE_SIZE, appliedSearch);
                } else {
                    response = await userAPI.product.getByCategoryAndCompany(selectedCategory, companyFilterId, sortOption, safePageToLoad, PAGE_SIZE, appliedSearch);
                }
            } else {
                response = await userAPI.product.getByCategory(selectedCategory, sortOption, safePageToLoad, PAGE_SIZE, appliedSearch);
            }

            if (fetchId !== fetchIdRef.current) {
                return;
            }

            const productData = response?.data?.batchesPreviews || [];
            const formattedProducts = productData.map(product => ({
                id: product.productId,
                title: product.productName,
                content: product.description,
                price: product.price,
                discountRate: product.discountRate || 0,
                imageUrl: product.thumbImgUrl ? getImageUrl(product.thumbImgUrl) : null
            }));

            const batchUnique = [];
            const batchIds = new Set();
            formattedProducts.forEach(product => {
                if (!batchIds.has(product.id)) {
                    batchIds.add(product.id);
                    batchUnique.push(product);
                }
            });

            let uniqueCount = 0;

            setProducts(prev => {
                if (reset) {
                    uniqueCount = batchUnique.length;
                    return batchUnique;
                }
                const prevIds = new Set(prev.map(prod => prod.id));
                const uniqueNew = batchUnique.filter(prod => !prevIds.has(prod.id));
                uniqueCount = uniqueNew.length;
                return uniqueNew.length > 0 ? [...prev, ...uniqueNew] : prev;
            });
            setPage(safePageToLoad);
            lastFetchedPageRef.current = safePageToLoad;

            const hasNextFromResponse = response?.data?.hasNext;
            let resolvedHasNext;
            if (typeof hasNextFromResponse === "boolean") {
                resolvedHasNext = hasNextFromResponse;
            } else {
                resolvedHasNext = formattedProducts.length === PAGE_SIZE;
            }
            setHasNext(resolvedHasNext);

            setTotalCount(prev => {
                const total = response?.data?.totalElements;
                if (typeof total === "number") {
                    return total;
                }
                if (total !== undefined && total !== null) {
                    const parsed = Number(total);
                    if (!Number.isNaN(parsed)) {
                        return parsed;
                    }
                }
                if (reset) {
                    return uniqueCount;
                }
                return prev != null ? prev + uniqueCount : uniqueCount;
            });
        } catch (err) {
            if (fetchId !== fetchIdRef.current) {
                return;
            }
            console.error("상품 로딩 중 오류 발생:", err);
            if (reset) {
                setProducts([]);
                setHasNext(false);
                setError("상품을 불러오는 중 오류가 발생했습니다.");
            } else {
                setLoadMoreError("추가 상품을 불러오는 중 오류가 발생했습니다.");
            }
        } finally {
            if (fetchId === fetchIdRef.current) {
                setIsFetchingMore(false);
                if (reset) {
                    setIsInitialLoading(false);
                }
            }
        }
    }, [selectedCategory, sortOption, companyFilterId, appliedSearch]);

    useEffect(() => {
        lastFetchedPageRef.current = -1;
        setProducts([]);
        setPage(-1);
        setHasNext(true);
        setTotalCount(null);
        setLoadMoreError(null);
        fetchProducts(0, true);
    }, [selectedCategory, sortOption, companyFilterId, appliedSearch, fetchProducts]);

    useEffect(() => {
        if (!sentinelRef.current) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry?.isIntersecting && hasNext && !isFetchingMore && !isInitialLoading) {
                    fetchProducts(page + 1);
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(sentinelRef.current);
        observerRef.current = observer;

        return () => {
            observer.disconnect();
        };
    }, [fetchProducts, hasNext, isFetchingMore, isInitialLoading, page]);

    const handleViewAll = () => {
        setSearchQuery("");
        setSelectedCompany(null);   // 회사 필터도 초기화 하고 싶으면
        setPage(-1);                // 페이지도 초기화
        setHasNext(true);
        navigate("/products/all");
    };

    if (error && products.length === 0) return (
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

    const productCountLabel = totalCount ?? products.length;
    const showEmptyState = !isInitialLoading && !error && products.length === 0;

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
                        {companies.map((company) => {
                            const isSelected = selectedCompany
                                ? selectedCompany.id === company.id
                                : company.id == null;

                            return (
                                <label key={company.name} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="company"
                                        checked={isSelected}
                                        onChange={() => setSelectedCompany(company.id == null ? null : company)}
                                        className="form-radio text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <span className="text-gray-700">{company.name}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 상품 정렬 옵션 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {CATEGORY_NAMES[selectedCategory]}
                    <span className="text-emerald-600 ml-2 text-lg">({productCountLabel})</span>
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
                {isInitialLoading ? (
                    // 🔺 상품 영역 안에서만 로딩 UI 렌더
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-emerald-600 font-medium">상품을 불러오는 중입니다...</p>
                        </div>
                    </div>
                ) : showEmptyState ? (
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
                    <div className="w-full">
                        <ProductList products={products} title="" />
                        <div ref={sentinelRef} className="h-1" />
                        {isFetchingMore && (
                            <div className="flex justify-center py-8">
                                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {loadMoreError && (
                            <div className="mt-4 text-center text-sm text-red-500">
                                {loadMoreError}
                            </div>
                        )}
                        {!hasNext && !isFetchingMore && products.length > 0 && (
                            <div className="mt-8 text-center text-sm text-gray-400">
                                모든 상품을 확인했습니다.
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

export default ProductPage;