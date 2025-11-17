import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
    const { user } = useAuth();
    const { pathname } = useLocation();

    const menuItems = [
        { label: "Q&A 관리", path: "/admin/qna" },
        { label: "기업 Q&A 관리", path: "/admin/company-qna" },
        { label: "쿠폰 발급", path: "/admin/coupon" },
        { label: "유해 키워드 관리", path: "/admin/badkeyword" }
    ];

    return (
        <div className="min-w-[200px] max-w-[240px] w-full md:w-60 bg-white px-6 py-8 flex flex-col gap-4">
            {menuItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`text-lg font-medium hover:text-emerald-600 ${
                        pathname === item.path ? "text-emerald-600 font-semibold" : "text-gray-800"
                    }`}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}
