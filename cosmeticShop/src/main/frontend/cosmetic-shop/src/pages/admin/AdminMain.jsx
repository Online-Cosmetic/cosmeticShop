// src/pages/admin/AdminMain.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminMain() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalQnAs: 0,
        pendingQnAs: 0,
        totalCoupons: 0,
        activeUsers: 0
    });

    // Placeholder for actual API calls
    useEffect(() => {
        // In a real implementation, these would be API calls
        // For now, we'll use dummy data
        setStats({
            totalQnAs: 24,
            pendingQnAs: 5,
            totalCoupons: 12,
            activeUsers: 156
        });
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>
                </div>

                {/* Recent Activity (Placeholder) */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">Recent Activity</h3>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <div className="text-center text-gray-500 py-8">
                            Recent activity will be displayed here in future updates.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}