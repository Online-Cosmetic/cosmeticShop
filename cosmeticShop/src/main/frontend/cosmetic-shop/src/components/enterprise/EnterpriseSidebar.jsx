// src/components/enterprise/EnterpriseSidebar.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useLocation } from 'react-router-dom';

export default function EnterpriseSidebar() {
    const { user } = useAuth();
    const { pathname } = useLocation();

    const menuItems = [
        { label: "대시보드", path: "/enterprise/dashboard" },
        { label: "상품 등록", path: "/enterprise/product/register" },
        { label: "상품 관리", path: "/enterprise/product/manage" },
        { label: "주문상품 내역", path: "/enterprise/orders" },
    ];

    if (user?.role !== 'ROLE_COMPANY') return null;

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