// src/components/enterprise/EnterpriseSidebar.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useLocation } from 'react-router-dom';

export default function EnterpriseSidebar() {
    const { user } = useAuth();
    const { pathname } = useLocation();

    const menuItems = [
        { label: "Overview", path: "/company/dashboard" },
        { label: "Register Product", path: "/company/product/register" },
        { label: "Manage Products", path: "/company/product/manage" },
        { label: "Order & Delivery", path: "/company/orders" },      // 아직 라우팅 안 되어 있음
        { label: "My Page", path: "/company/profile" }               // 아직 라우팅 안 되어 있음
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