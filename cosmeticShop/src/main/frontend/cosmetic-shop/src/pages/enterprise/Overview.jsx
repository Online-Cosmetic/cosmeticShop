import React, { useState, useEffect } from "react";
import EnterpriseHeader from "../../components/enterprise/EnterpriseHeader.jsx";
import EnterpriseSidebar from "../../components/enterprise/EnterpriseSidebar.jsx";
import Footer from "../../components/common/Footer.jsx";
import { companyAPI } from "../../utils/customAxios.js";
import { getImageUrl } from "../../utils/imageUtils.js";
import { ShoppingBagIcon, ChartBarIcon, CurrencyDollarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// 카테고리 매핑
const CATEGORY_MAP = {
    1: "Makeup",
    2: "Skincare",
    3: "Hair",
    4: "Body"
};

function Overview() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalSales: 0,
        totalOrders: 0
    });

    // 회사 이름 가져오기 (로컬 스토리지에서)
    const companyName = localStorage.getItem('userName') || 'Company';

    // 상품 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // 상품 데이터 가져오기
                const productsResponse = await companyAPI.product.getProducts(0, 8);
                setProducts(productsResponse.data.content || []);

                // 통계 데이터 가져오기 (가능한 경우)
                try {
                    const salesResponse = await companyAPI.product.getWeeklySalesData(companyName);
                    const topProductsResponse = await companyAPI.product.getTopProducts(companyName);

                    // 총 판매액 계산
                    const totalSales = Object.values(salesResponse.data || {}).reduce((sum, value) => sum + value, 0);

                    setStats({
                        totalProducts: productsResponse.data.totalElements || products.length,
                        totalSales: totalSales,
                        totalOrders: topProductsResponse.data.reduce((sum, product) => sum + (product.totalQuantity || 0), 0)
                    });
                } catch (statsError) {
                    console.error("통계 데이터를 가져오는데 실패했습니다:", statsError);
                    // 통계 데이터 가져오기 실패해도 상품 데이터는 표시
                }
            } catch (err) {
                console.error("데이터를 가져오는데 실패했습니다:", err);
                setError("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyName]);

    // 데이터 새로고침
    const refreshData = () => {
        setLoading(true);
        setProducts([]);
        setStats({
            totalProducts: 0,
            totalSales: 0,
            totalOrders: 0
        });

        // 데이터 다시 가져오기
        const fetchData = async () => {
            try {
                const productsResponse = await companyAPI.product.getProducts(0, 8);
                setProducts(productsResponse.data.content || []);
                setLoading(false);
            } catch (err) {
                console.error("데이터를 가져오는데 실패했습니다:", err);
                setError("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
                setLoading(false);
            }
        };

        fetchData();
    };

    return (
        <>
            {/* 헤더 */}
            <EnterpriseHeader />
            {/* 사이드바 */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="w-1/6">
                    <EnterpriseSidebar />
                </div>
                <div className="flex-1 p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* 페이지 헤더 */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-neutral-800">기업 개요</h2>
                            <div className="text-lg text-gray-600">
                                {companyName} 님, 환영합니다
                            </div>
                        </div>

                        {/* 통계 카드 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center">
                                <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                                    <ShoppingBagIcon className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-emerald-800">총 상품 수</h3>
                                    <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalProducts}</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800">총 판매액</h3>
                                    <p className="text-3xl font-bold text-blue-600 mt-1">₩{stats.totalSales.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-100 flex items-center">
                                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                    <ChartBarIcon className="h-8 w-8 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-800">총 주문 수</h3>
                                    <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalOrders}</p>
                                </div>
                            </div>
                        </div>

                        {/* 상품 목록 */}
                        <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                                    <ShoppingBagIcon className="h-5 w-5 text-emerald-600" />
                                    등록된 상품
                                </h3>
                                <button
                                    onClick={refreshData}
                                    className="p-2 text-gray-500 rounded-lg hover:text-emerald-600 hover:bg-gray-100 transition-all"
                                    aria-label="상품 데이터 새로고침"
                                >
                                    <ArrowPathIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-60">
                                    <div className="text-xl text-gray-500">데이터 로딩 중...</div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-60 bg-red-50 rounded-lg">
                                    <div className="text-xl text-red-500">{error}</div>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="flex justify-center items-center h-60 bg-gray-50 rounded-lg">
                                    <div className="text-xl text-gray-500">등록된 상품이 없습니다.</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                                <img
                                                    src={getImageUrl(product.mainImageUrl)}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover object-center"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/300x300.png?text=No+Image";
                                                    }}
                                                />
                                                {product.discountRate > 0 && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                                                        {product.discountRate}% OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <div className="text-xs text-gray-500 mb-1">
                                                    {CATEGORY_MAP[product.categoryId] || "기타"}
                                                </div>
                                                <h4 className="text-lg font-semibold text-neutral-800 mb-2 truncate">
                                                    {product.productName}
                                                </h4>
                                                <div className="flex justify-between items-center">
                                                    <div className="font-bold text-emerald-600">
                                                        ₩{product.price?.toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        재고: {product.stock}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Overview;
