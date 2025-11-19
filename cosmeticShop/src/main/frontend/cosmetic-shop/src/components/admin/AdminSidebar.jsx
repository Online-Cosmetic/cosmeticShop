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
        { label: "Bad Keyword 관리", path: "/admin/badkeyword" },
        { label: "사용자 관리", path: "/admin/users" },
        { label: "기업 회원 관리", path: "/admin/companies" }
    ];

    const isActive = (path) => {
        if (path === '/admin/companies') {
            return pathname.startsWith('/admin/companies');
        }
        return pathname === path;
    };

    return (
        <div className="min-w-[200px] max-w-[240px] w-full md:w-60 bg-white px-6 py-8 flex flex-col gap-4">
            {menuItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`text-lg font-medium hover:text-emerald-600 ${
                        isActive(item.path) ? "text-emerald-600 font-semibold" : "text-gray-800"
                    }`}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}
