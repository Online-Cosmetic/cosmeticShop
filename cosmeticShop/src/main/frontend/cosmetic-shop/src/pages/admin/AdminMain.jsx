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

                // Calculate totals from the daily stats
                const dailyStats = statsResponse.data;
                const totalSales = dailyStats.reduce((sum, day) => sum + (day.totalSales || 0), 0);
                const totalOrders = dailyStats.reduce((sum, day) => sum + (day.orderCount || 0), 0);

                // Update the stats state
                setStats({
                    totalQnAs: answeredQnAs.data.length + unansweredQnAs.data.length,
                    pendingQnAs: unansweredQnAs.data.length,
                    totalCoupons: 0, // We don't have an API for this yet
                    activeUsers: 0,  // We don't have an API for this yet
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
                    <h2 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h2>
                    {user && (
                        <div className="text-lg text-gray-600">
                            Welcome, {user.name || "Admin"}
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="text-xl text-gray-500">Loading dashboard data...</div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="text-xl text-red-500">{error}</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
                        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-800">Total Q&As</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalQnAs}</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-red-800">Pending Q&As</h3>
                            <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingQnAs}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-green-800">Active Coupons</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalCoupons}</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-800">Active Users</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.activeUsers}</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-amber-800">Total Sales</h3>
                            <p className="text-3xl font-bold text-amber-600 mt-2">₩{stats.totalSales?.toLocaleString()}</p>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-indigo-800">Total Orders</h3>
                            <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalOrders}</p>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link 
                            to="/admin/qna" 
                            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="text-5xl text-emerald-500 mb-4">📝</div>
                            <h4 className="text-lg font-semibold text-neutral-800">Manage Q&A</h4>
                            <p className="text-gray-600 mt-2">Review and respond to customer questions</p>
                        </Link>
                        <Link 
                            to="/admin/coupon" 
                            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="text-5xl text-emerald-500 mb-4">🎟️</div>
                            <h4 className="text-lg font-semibold text-neutral-800">Issue Coupons</h4>
                            <p className="text-gray-600 mt-2">Create and manage discount coupons</p>
                        </Link>
                        <Link 
                            to="/admin/statistics" 
                            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="text-5xl text-emerald-500 mb-4">📊</div>
                            <h4 className="text-lg font-semibold text-neutral-800">View Statistics</h4>
                            <p className="text-gray-600 mt-2">Analyze sales and user activity data</p>
                        </Link>
                        <Link 
                            to="/admin/badkeyword" 
                            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="text-5xl text-emerald-500 mb-4">⚠️</div>
                            <h4 className="text-lg font-semibold text-neutral-800">Manage BadKeywords</h4>
                            <p className="text-gray-600 mt-2">Manage bad keywords and filter reviews</p>
                        </Link>
                    </div>
                </div>

                {/* Statistics Summary */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">Statistics Summary</h3>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        {loading ? (
                            <div className="text-center text-gray-500 py-8">
                                Loading statistics data...
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-8">
                                {error}
                            </div>
                        ) : (
                            <div className="py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-neutral-700 mb-3">Last 30 Days Summary</h4>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Total Sales:</span>
                                                <span className="font-medium">₩{stats.totalSales?.toLocaleString()}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Total Orders:</span>
                                                <span className="font-medium">{stats.totalOrders}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Average Order Value:</span>
                                                <span className="font-medium">
                                                    ₩{stats.totalOrders ? Math.round(stats.totalSales / stats.totalOrders).toLocaleString() : 0}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-neutral-700 mb-3">Customer Support</h4>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Total Q&As:</span>
                                                <span className="font-medium">{stats.totalQnAs}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Pending Q&As:</span>
                                                <span className="font-medium">{stats.pendingQnAs}</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span className="text-gray-600">Response Rate:</span>
                                                <span className="font-medium">
                                                    {stats.totalQnAs ? Math.round(((stats.totalQnAs - stats.pendingQnAs) / stats.totalQnAs) * 100) : 0}%
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <Link 
                                        to="/admin/statistics" 
                                        className="text-emerald-600 hover:text-emerald-800 font-medium"
                                    >
                                        View detailed statistics →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
