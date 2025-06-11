// src/pages/enterprise/EnterpriseMain.jsx
import React, { useState, useEffect, useCallback } from "react";
import { companyAPI } from "../../utils/customAxios.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowPathIcon, ChartBarIcon, ShoppingBagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const EnterpriseMain = () => {
    // QueryClient 인스턴스 가져오기
    const queryClient = useQueryClient();

    // 현재 로그인한 기업 정보
    const companyName = localStorage.getItem('userName') || 'TestCompany';
    const [transactionPage, setTransactionPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    // 페이지 데이터 새로고침 함수
    const refreshData = useCallback(() => {
        // 강제로 쿼리 무효화하고 다시 가져오기
        queryClient.invalidateQueries(['transactions', companyName, transactionPage]);
    }, [queryClient, companyName, transactionPage]);

    // 첫 페이지로 이동하는 함수
    const goToFirstPage = useCallback(() => {
        setTransactionPage(0);
        // 상태 변경 후 바로 쿼리 무효화 및 새로고침
        setTimeout(() => {
            queryClient.invalidateQueries(['transactions', companyName, 0]);
        }, 0);
    }, [queryClient, companyName]);

    // 3. 트랜잭션 쿼리
    const {
        data: transactions = [],
        isLoading: transactionsLoading,
        isError: transactionsError,
        refetch: refetchTransactions
    } = useQuery({
        queryKey: ['transactions', companyName, transactionPage],
        queryFn: async () => {
            const response = await companyAPI.product.getTransactions(companyName, transactionPage, 5);

            // 여기서 isLastPage 상태를 즉시 업데이트
            const isLast = response.data.length < 5;
            setIsLastPage(isLast);

            return response.data;
        },
        // 항상 최신 데이터 사용
        staleTime: 0,
        cacheTime: 0
    });

    // 페이지 네비게이션 함수들
    const goToPreviousPage = useCallback(() => {
        if (transactionPage > 0) {
            setTransactionPage(prev => prev - 1);
        }
    }, [transactionPage]);

    const goToNextPage = useCallback(() => {
        if (!isLastPage) {
            setTransactionPage(prev => prev + 1);
        }
    }, [isLastPage]);

    // 1. 주간 판매 통계 쿼리
    const {
        data: salesData = {},
        isLoading: salesLoading,
        isError: salesError,
        refetch: refetchSalesData
    } = useQuery({
        queryKey: ['weeklySales', companyName],
        queryFn: async () => {
            try {
                const response = await companyAPI.product.getWeeklySalesData(companyName);
                return response.data;
            } catch (error) {
                console.error("Error fetching weekly sales data:", error);
                throw error;
            }
        },
        retry: 1,
        staleTime: 60000 // 1 minute
    });

    // 2. TOP 5 제품 쿼리
    const {
        data: topProducts = [],
        isLoading: productsLoading,
        isError: productsError,
        refetch: refetchTopProducts
    } = useQuery({
        queryKey: ['topProducts', companyName],
        queryFn: async () => {
            try {
                const response = await companyAPI.product.getTopProducts(companyName);
                return response.data;
            } catch (error) {
                console.error("Error fetching top products:", error);
                throw error;
            }
        },
        retry: 1,
        staleTime: 60000 // 1 minute
    });

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
    const maxValue = salesData && Object.keys(salesData).length > 0
        ? Math.max(...Object.values(salesData))
        : 0;

    // 현재 페이지 트랜잭션 데이터
    const allTransactions = transactions;

    // 총 판매액 계산
    const totalSales = Object.values(salesData).reduce((sum, value) => sum + value, 0);

    // 총 판매 수량 계산 (예시 데이터)
    const totalQuantity = topProducts.reduce((sum, product) => sum + (product.totalQuantity || 0), 0);

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-6">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-neutral-800">기업 대시보드</h1>
                <div className="text-lg text-gray-600">
                    {companyName} 님, 환영합니다
                </div>
            </div>

            {/* 요약 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center">
                    <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                        <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-emerald-800">총 판매액</h3>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">₩{totalSales.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-800">총 판매 수량</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{totalQuantity.toLocaleString()}개</p>
                    </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-100 flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                        <ChartBarIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-purple-800">인기 상품</h3>
                        <p className="text-xl font-bold text-purple-600 mt-1 truncate max-w-[200px]">
                            {topProducts.length > 0 ? topProducts[0]?.productName : "데이터 없음"}
                        </p>
                    </div>
                </div>
            </div>

            {/* 1. 주간 판매 차트 */}
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                        <ChartBarIcon className="h-5 w-5 text-emerald-600" />
                        주간 판매 현황
                    </h2>
                    <button
                        onClick={() => refetchSalesData()}
                        className="p-2 text-gray-500 rounded-lg hover:text-emerald-600 hover:bg-gray-100 transition-all"
                        aria-label="주간 판매 데이터 새로고침"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                    </button>
                </div>

                {salesLoading ? (
                    <div className="flex justify-center items-center h-60">
                        <div className="text-xl text-gray-500">데이터 로딩 중...</div>
                    </div>
                ) : salesError ? (
                    <div className="flex justify-center items-center h-60 bg-red-50 rounded-lg">
                        <div className="text-xl text-red-500">데이터를 불러오는데 실패했습니다.</div>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex justify-center items-center h-60 bg-gray-50 rounded-lg">
                        <div className="text-xl text-gray-500">판매 데이터가 없습니다.</div>
                    </div>
                ) : (
                    <div className="flex gap-10">
                        {/* Y축 레이블 */}
                        <div className="flex flex-col justify-between h-60">
                            {Array.from({length: 6}, (_, i) => {
                                const value = Math.round((maxValue * (5 - i)) / 5);
                                return (
                                    <div key={i} className="text-gray-500 text-sm font-medium">
                                        ₩{value.toLocaleString()}
                                    </div>
                                );
                            })}
                        </div>

                        {/* 차트 영역 */}
                        <div className="flex-1 relative h-60">
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
                                            className="bg-emerald-500 rounded-t w-12 relative group cursor-pointer transition-all hover:bg-emerald-600"
                                            style={{height: `${item.height}px`}}
                                        >
                                            {/* 툴팁 */}
                                            <div
                                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                                                ₩{item.value.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* X축 레이블 */}
                {!salesLoading && !salesError && chartData.length > 0 && (
                    <div className="w-full flex justify-between text-gray-500 text-sm font-medium pl-20 mt-4">
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

            {/* 2. Top Products & 트랜잭션 목록 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top 5 Products */}
                <div className="bg-white border rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                            <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                            인기 상품 Top 5
                        </h3>
                        <button
                            onClick={() => refetchTopProducts()}
                            className="p-2 text-gray-500 rounded-lg hover:text-blue-600 hover:bg-gray-100 transition-all"
                            aria-label="인기 상품 새로고침"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {productsLoading ? (
                        <div className="flex justify-center items-center h-60">
                            <div className="text-xl text-gray-500">데이터 로딩 중...</div>
                        </div>
                    ) : productsError ? (
                        <div className="flex justify-center items-center h-60 bg-red-50 rounded-lg">
                            <div className="text-xl text-red-500">데이터를 불러오는데 실패했습니다.</div>
                        </div>
                    ) : topProducts.length === 0 ? (
                        <div className="flex justify-center items-center h-60 bg-gray-50 rounded-lg">
                            <div className="text-xl text-gray-500">등록된 상품이 없습니다.</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topProducts.map((product, i) => (
                                <div key={i}
                                     className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="text-neutral-800 font-medium">{product.productName}</div>
                                            <div className="text-gray-500 text-sm">₩{product.price?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {product.totalQuantity}개 판매
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. 트랜잭션 목록 */}
                <div className="bg-white border rounded-xl shadow-sm p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                            <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
                            최근 트랜잭션
                        </h3>
                        <button
                            onClick={() => {
                                setTransactionPage(0);
                                setIsLastPage(false);
                                setTimeout(() => {
                                    refetchTransactions();
                                }, 0);
                            }}
                            className="p-2 text-gray-500 rounded-lg hover:text-purple-600 hover:bg-gray-100 transition-all"
                            aria-label="트랜잭션 새로고침"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {transactionsLoading ? (
                        <div className="flex justify-center items-center h-60">
                            <div className="text-xl text-gray-500">데이터 로딩 중...</div>
                        </div>
                    ) : transactionsError ? (
                        <div className="flex justify-center items-center h-60 bg-red-50 rounded-lg">
                            <div className="text-xl text-red-500">데이터를 불러오는데 실패했습니다.</div>
                        </div>
                    ) : allTransactions.length === 0 ? (
                        <div className="flex justify-center items-center h-60 bg-gray-50 rounded-lg">
                            <div className="text-xl text-gray-500">결제 내역이 없습니다.</div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold rounded-tl-lg">주문 ID</th>
                                        <th className="px-4 py-3 font-semibold">구매자</th>
                                        <th className="px-4 py-3 font-semibold">결제일시</th>
                                        <th className="px-4 py-3 font-semibold">금액</th>
                                        <th className="px-4 py-3 font-semibold rounded-tr-lg">상태</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {allTransactions.map((tx, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-neutral-800 font-medium">#{tx.orderId}</td>
                                            <td className="px-4 py-3 text-neutral-800">{tx.buyerName}</td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(tx.createdAt).toLocaleString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-800 font-medium">
                                                ₩{tx.amount?.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    tx.status === "COMPLETED"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : tx.status === "cancelled"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-blue-100 text-blue-800"
                                                }`}>
                                                    {tx.status === "COMPLETED" ? "완료" :
                                                        tx.status === "cancelled" ? "취소" : "진행중"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 페이지네이션 */}
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-gray-500">
                                    페이지 {transactionPage + 1} {isLastPage ? "(마지막 페이지)" : ""}
                                </div>

                                <div className="flex gap-2">
                                    {transactionPage > 0 && (
                                        <button
                                            onClick={goToFirstPage}
                                            className="px-4 py-2 bg-white border border-gray-300 text-neutral-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                            disabled={transactionsLoading}
                                        >
                                            처음으로
                                        </button>
                                    )}

                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={transactionPage === 0 || transactionsLoading}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                            transactionPage === 0 || transactionsLoading
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-neutral-700 hover:bg-gray-50'
                                        } transition-colors`}
                                    >
                                        이전
                                    </button>

                                    <button
                                        onClick={goToNextPage}
                                        disabled={isLastPage || transactionsLoading}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                            isLastPage || transactionsLoading
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-neutral-700 hover:bg-gray-50'
                                        } transition-colors`}
                                    >
                                        다음
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnterpriseMain;
