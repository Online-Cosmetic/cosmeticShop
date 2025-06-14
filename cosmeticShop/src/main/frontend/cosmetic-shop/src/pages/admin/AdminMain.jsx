// src/pages/admin/AdminMain.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { adminAPI } from "../../utils/customAxios";

export default function AdminMain() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalQnAs: 0,
        pendingQnAs: 0,
        totalCoupons: 0,
        activeUsers: 0,
        totalSales: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch actual data from APIs
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch QnA data
                const [answeredQnAs, unansweredQnAs] = await Promise.all([
                    adminAPI.qna.getAnsweredQnas(),
                    adminAPI.qna.getUnansweredQnas()
                ]);

                // Fetch statistics data for the last 30 days
                const statsResponse = await adminAPI.statistics.getDashboardStats();

                // Fetch dashboard counts (total orders, active users, active coupons)
                const countsResponse = await adminAPI.statistics.getDashboardCounts();

                // Get counts from the dashboard counts response
                const { totalOrders, activeUsers, activeCoupons, totalSales } = countsResponse.data;

                // Update the stats state
                setStats({
                    totalQnAs: answeredQnAs.data.length + unansweredQnAs.data.length,
                    pendingQnAs: unansweredQnAs.data.length,
                    totalCoupons: activeCoupons,
                    activeUsers: activeUsers,
                    totalSales: totalSales,
                    totalOrders: totalOrders
                });
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">관리자 대시보드</h2>
                    {user && (
                        <div className="text-lg text-gray-600">
                            환영합니다, {user.name || "관리자"}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="text-xl text-gray-500">대시보드 데이터 로딩 중...</div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="text-xl text-red-500">{error}</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-800">전체 Q&A</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalQnAs}</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-red-800">대기 중인 Q&A</h3>
                            <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingQnAs}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-green-800">활성 쿠폰</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalCoupons}</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-800">활성 사용자</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.activeUsers}</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-amber-800">총 판매액</h3>
                            <p className="text-2xl font-bold text-amber-600 mt-2">₩{stats.totalSales?.toLocaleString()}</p>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-indigo-800">총 주문 수</h3>
                            <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalOrders}</p>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">빠른 작업</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link 
                            to="/admin/qna" 
                            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="text-5xl text-emerald-500 mb-4">📝</div>
                            <h4 className="text-lg font-semibold text-neutral-800">Q&A 관리</h4>
                            <p className="text-gray-600 mt-2">고객 질문 검토 및 응답</p>
                        </Link>
                        <Link 
                            to="/admin/coupon" 
                            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="text-5xl text-emerald-500 mb-4">🎟️</div>
                            <h4 className="text-lg font-semibold text-neutral-800">쿠폰 발급</h4>
                            <p className="text-gray-600 mt-2">할인 쿠폰 생성 및 관리</p>
                        </Link>
                        <Link 
                            to="/admin/badkeyword" 
                            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="text-5xl text-emerald-500 mb-4">⚠️</div>
                            <h4 className="text-lg font-semibold text-neutral-800">금지어 관리</h4>
                            <p className="text-gray-600 mt-2">금지어 관리 및 리뷰 필터링</p>
                        </Link>
                    </div>
                </div>

                {/* Customer Support */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">고객 지원</h3>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        {loading ? (
                            <div className="text-center text-gray-500 py-8">
                                데이터 로딩 중...
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-8">
                                {error}
                            </div>
                        ) : (
                            <div className="py-4">
                                <div>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">전체 Q&A:</span>
                                            <span className="font-medium">{stats.totalQnAs}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">대기 중인 Q&A:</span>
                                            <span className="font-medium">{stats.pendingQnAs}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">응답률:</span>
                                            <span className="font-medium">
                                                {stats.totalQnAs ? Math.round(((stats.totalQnAs - stats.pendingQnAs) / stats.totalQnAs) * 100) : 0}%
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
