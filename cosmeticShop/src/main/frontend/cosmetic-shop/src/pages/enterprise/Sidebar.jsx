import React from "react";

function SidebarSection() {
    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-xl font-bold mb-4">사이드바 메뉴</h2>
            <ul>
                <li className="mb-2">
                    <a href="#dashboard" className="hover:underline">
                        대시보드
                    </a>
                </li>
                <li className="mb-2">
                    <a href="#settings" className="hover:underline">
                        설정
                    </a>
                </li>
                <li className="mb-2">
                    <a href="#profile" className="hover:underline">
                        프로필
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default SidebarSection;