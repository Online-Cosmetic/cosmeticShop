// src/pages/enterprise/EnterpriseMain.jsx
import React, { useState, useEffect, useCallback } from "react";
import { companyAPI } from "../../utils/customAxios.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
            console.log("트랜잭션 데이터 로드 - 페이지:", transactionPage, "개수:", response.data.length);

            // 여기서 isLastPage 상태를 즉시 업데이트
            const isLast = response.data.length < 5;
            setIsLastPage(isLast);
            console.log("마지막 페이지 여부:", isLast);

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
            const response = await companyAPI.product.getWeeklySalesData(companyName);
            return response.data;
        }
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
            const response = await companyAPI.product.getTopProducts(companyName);
            return response.data;
        }
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

    // 디버깅용 로그

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
                                onClick={() => refetchSalesData()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                새로고침
                            </button>
                        </div>

                        {salesLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-gray-500">데이터 로딩 중...</div>
                            </div>
                        ) : salesError ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
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
                        {!salesLoading && !salesError && (
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
                                onClick={() => refetchTopProducts()}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                새로고침
                            </button>
                        </div>

                        {productsLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-gray-500">데이터 로딩 중...</div>
                            </div>
                        ) : productsError ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
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
                    <div className="w-full md:w-2/3 bg-white border rounded-2xl shadow p-6 flex flex-col gap-4 relative">
                        <div className="flex justify-between items-center">
                            <h3 className="text-gray-900 text-xl font-semibold">최근 트랜잭션</h3>
                            <button
                                onClick={() => {
                                    setTransactionPage(0);
                                    setIsLastPage(false);
                                    setTimeout(() => {
                                        refetchTransactions();
                                    }, 0);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                새로고침
                            </button>
                        </div>

                        {transactionsLoading && allTransactions.length === 0 ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-gray-500">데이터 로딩 중...</div>
                            </div>
                        ) : transactionsError ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
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
                                        {allTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                                    결제 내역이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            allTransactions.map((tx, i) => (
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

                                {/* 페이지네이션 화살표 UI */}
                                {allTransactions.length > 0 && (
                                    <div className="flex justify-center items-center gap-4 mt-4">
                                        {/* 이전 페이지 버튼 (첫 페이지에서는 숨김) */}
                                        {transactionPage > 0 && (
                                            <button
                                                onClick={goToPreviousPage}
                                                className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                                disabled={transactionsLoading}
                                            >
                                                &lt;
                                            </button>
                                        )}

                                        {/* 페이지 표시 */}
                                        <span className="text-gray-600">
                                            {transactionPage + 1}
                                        </span>

                                        {/* 다음 페이지 버튼 (마지막 페이지에도 항상 표시) */}
                                        <button
                                            disabled={transactionsLoading || isLastPage}
                                            onClick={goToNextPage}
                                            className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                )}

                                {/* 처음으로 버튼 (우측 하단에 추가) */}
                                {transactionPage > 0 && (
                                    <button
                                        onClick={goToFirstPage}
                                        className="absolute bottom-4 right-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                        disabled={transactionsLoading}
                                    >
                                        처음으로
                                    </button>
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