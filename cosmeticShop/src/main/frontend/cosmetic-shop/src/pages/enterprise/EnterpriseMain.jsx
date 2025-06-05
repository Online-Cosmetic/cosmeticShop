// src/pages/enterprise/EnterpriseMain.jsx
import React, {useState, useEffect} from "react";
import {companyAPI} from "../../utils/customAxios.js";

const EnterpriseMain = () => {
    // 상태 관리
    const [salesData, setSalesData] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [transactionPage, setTransactionPage] = useState(0);
    const [loading, setLoading] = useState({
        sales: true,
        products: true,
        transactions: true
    });
    const [error, setError] = useState({
        sales: null,
        products: null,
        transactions: null
    });

    // 현재 로그인한 기업 정보 (localStorage 또는 context에서 가져오기)
    const companyName = localStorage.getItem('userName') || 'TestCompany';

    // 처음 로드될 때 데이터 가져오기
    useEffect(() => {
        fetchWeeklySalesData();
        fetchTopProducts();
        fetchTransactions();
    }, []);

    // 1. 주간 판매 통계 가져오기
    const fetchWeeklySalesData = async () => {
        try {
            setLoading(prev => ({...prev, sales: true}));
            const response = await companyAPI.product.getWeeklySalesData(companyName);
            setSalesData(response.data);
            setError(prev => ({...prev, sales: null}));
        } catch (err) {
            console.error('주간 판매 통계 조회 실패:', err);
            setError(prev => ({...prev, sales: '데이터를 불러오는데 실패했습니다.'}));
        } finally {
            setLoading(prev => ({...prev, sales: false}));
        }
    };

    // 2. TOP 5 제품 가져오기
    const fetchTopProducts = async () => {
        try {
            setLoading(prev => ({...prev, products: true}));
            const response = await companyAPI.product.getTopProducts(companyName);
            setTopProducts(response.data);
            setError(prev => ({...prev, products: null}));
        } catch (err) {
            console.error('인기 상품 조회 실패:', err);
            setError(prev => ({...prev, products: '데이터를 불러오는데 실패했습니다.'}));
        } finally {
            setLoading(prev => ({...prev, products: false}));
        }
    };

    // 3. 트랜잭션 기록 가져오기
    const fetchTransactions = async (page = 0) => {
        try {
            setLoading(prev => ({...prev, transactions: true}));
            const response = await companyAPI.product.getTransactions(companyName, page, 5);
            if (page === 0) {
                setTransactions(response.data);
            } else {
                // 기존 데이터와 병합
                setTransactions(prev => [...prev, ...response.data]);
            }
            setTransactionPage(page);
            setError(prev => ({...prev, transactions: null}));
        } catch (err) {
            console.error('트랜잭션 조회 실패:', err);
            setError(prev => ({...prev, transactions: '데이터를 불러오는데 실패했습니다.'}));
        } finally {
            setLoading(prev => ({...prev, transactions: false}));
        }
    };

    // 차트 데이터 준비 (주간 판매 통계)
    const prepareChartData = () => {
        if (!salesData || Object.keys(salesData).length === 0) return [];

        const dates = Object.keys(salesData).sort().reverse(); // 최근 날짜순
        const maxValue = Math.max(...Object.values(salesData));
        const chartHeight = 200; // 차트 높이

        return dates.map(date => {
            const value = salesData[date] || 0;
            const height = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
            return {date, value, height};
        });
    };

    const chartData = prepareChartData();
    const maxValue = salesData ? Math.max(...Object.values(salesData)) : 0;

    // 로드 더 많은 트랜잭션
    const loadMoreTransactions = () => {
        fetchTransactions(transactionPage + 1);
    };

    return (
        <div className="flex">
            {/* 메인 콘텐츠 */}
            <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
                {/* 1. 주간 판매 차트 */}
                <div className="bg-white border rounded-2xl shadow px-10 pt-8 pb-4 flex flex-col">
                    <div className="w-full flex flex-col gap-7">
                        <div className="flex items-center justify-between">
                            <h2 className="text-gray-900 text-xl font-bold">
                                주간 판매 현황 ({companyName})
                            </h2>
                            <button
                                onClick={fetchWeeklySalesData}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                새로고침
                            </button>
                        </div>

                        {loading.sales ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-gray-500">데이터 로딩 중...</div>
                            </div>
                        ) : error.sales ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-red-500">{error.sales}</div>
                            </div>
                        ) : (
                            <div className="flex gap-10">
                                {/* Y축 레이블 */}
                                <div className="flex flex-col justify-between h-48">
                                    {Array.from({length: 6}, (_, i) => {
                                        const value = Math.round((maxValue * (5 - i)) / 5);
                                        return (
                                            <div key={i} className="text-gray-500 text-sm font-semibold">
                                                {value.toLocaleString()}원
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 차트 영역 */}
                                <div className="flex-1 relative h-48">
                                    {/* 격자선 */}
                                    {Array.from({length: 6}).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-full border-t border-gray-100"
                                            style={{top: `${(i * 100) / 5}%`}}
                                        />
                                    ))}

                                    {/* 데이터 바 */}
                                    <div className="flex items-end justify-between h-full pt-2">
                                        {chartData.map((item, index) => (
                                            <div
                                                key={index}
                                                className="relative flex flex-col items-center"
                                                style={{width: `${100 / chartData.length}%`}}
                                            >
                                                <div
                                                    className="bg-blue-500 rounded-t w-8 relative group cursor-pointer"
                                                    style={{height: `${item.height}px`}}
                                                >
                                                    {/* 툴팁 */}
                                                    <div
                                                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                                        {item.value.toLocaleString()}원
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* X축 레이블 */}
                        {!loading.sales && !error.sales && (
                            <div className="w-full flex justify-between text-gray-500 text-sm font-semibold pl-20">
                                {chartData.map((item, index) => (
                                    <div key={index} className="text-center"
                                         style={{width: `${100 / chartData.length}%`}}>
                                        {new Date(item.date).toLocaleDateString('ko-KR', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Top Products & 트랜잭션 목록 섹션 */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Top 5 Products */}
                    <div className="w-full md:w-1/3 bg-white border rounded-2xl shadow p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-gray-900 text-xl font-semibold">인기 상품 Top 5</h3>
                            <button
                                onClick={fetchTopProducts}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                새로고침
                            </button>
                        </div>

                        {loading.products ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-gray-500">데이터 로딩 중...</div>
                            </div>
                        ) : error.products ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-red-500">{error.products}</div>
                            </div>
                        ) : (
                            <>
                                {topProducts.length === 0 ? (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="text-gray-500">등록된 상품이 없습니다.</div>
                                    </div>
                                ) : (
                                    topProducts.map((product, i) => (
                                        <div key={i}
                                             className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <div>
                                                <div className="text-gray-900 font-semibold">{product.productName}</div>
                                                <div
                                                    className="text-gray-500 text-xs">가격: {product.price?.toLocaleString()}원
                                                </div>
                                            </div>
                                            <div className="text-gray-600 text-base">
                                                <span
                                                    className="text-gray-900 font-semibold">{product.totalQuantity}</span> 판매
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>

                    {/* 3. 트랜잭션 목록 */}
                    <div className="w-full md:w-2/3 bg-white border rounded-2xl shadow p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-gray-900 text-xl font-semibold">최근 트랜잭션</h3>
                            <button
                                onClick={() => fetchTransactions(0)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                새로고침
                            </button>
                        </div>

                        {loading.transactions && transactions.length === 0 ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-gray-500">데이터 로딩 중...</div>
                            </div>
                        ) : error.transactions ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-red-500">{error.transactions}</div>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 font-semibold">
                                        <tr>
                                            <th className="p-2">주문 ID</th>
                                            <th className="p-2">구매자</th>
                                            <th className="p-2">결제일시</th>
                                            <th className="p-2">금액</th>
                                            <th className="p-2">상태</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                                    결제 내역이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx, i) => (
                                                <tr key={i} className="border-b border-gray-200">
                                                    <td className="p-2 text-gray-900">#{tx.orderId}</td>
                                                    <td className="p-2 text-gray-900">{tx.buyerName}</td>
                                                    <td className="p-2 text-gray-500">
                                                        {new Date(tx.createdAt).toLocaleString('ko-KR')}
                                                    </td>
                                                    <td className="p-2 text-gray-900 font-medium">
                                                        {tx.amount?.toLocaleString()}원
                                                    </td>
                                                    <td className="p-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            tx.status === "paid"
                                                                ? "bg-green-100 text-emerald-900"
                                                                : tx.status === "cancelled"
                                                                    ? "bg-rose-200 text-red-800"
                                                                    : "bg-sky-100 text-blue-800"
                                                        }`}>
                                                            {tx.status === "paid" ? "완료" :
                                                                tx.status === "cancelled" ? "취소" : "진행중"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                {transactions.length > 0 && (
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={loadMoreTransactions}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                            disabled={loading.transactions}
                                        >
                                            {loading.transactions ? "로딩 중..." : "더 보기"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EnterpriseMain;