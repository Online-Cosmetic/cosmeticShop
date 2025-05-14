import React from "react";
import { Link, useLocation } from "react-router-dom";

function EnterpriseSidebar() {
    const { pathname } = useLocation();

    const menuItems = [
        { label: "Dashboard", path: "/enterprise/dashboard" },
        { label: "Register Product", path: "/enterprise/product/register" },
        { label: "Manage Products", path: "/enterprise/products/manage" },
        { label: "Order & Delivery", path: "/enterprise/orders" },
        { label: "My Page", path: "/enterprise/profile" },
    ];

    return (
        <div className="w-60 min-h-screen bg-white border-r border-gray-300 px-6 py-8 flex flex-col gap-4">
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

export default EnterpriseSidebar;