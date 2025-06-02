import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
    const { user } = useAuth();
    const { pathname } = useLocation();

    const menuItems = [
        // { label: "Main", path: "/admin/dashboard" },
        // { label: "Manage Ent User Sign Up", path: "/admin/enteruser" },
        // { label: "Manage Product Register", path: "/admin/product/register" },
        { label: "Manage Q&A", path: "/admin/qna" },
        // { label: "Coupon Issuance", path: "/admin/coupon" }               // 아직 라우팅 안 되어 있음
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