import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-neutral-100 border-t text-gray-600 text-sm">
            <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="mb-2 sm:mb-0">&copy; 2025 cosMall. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a href="#" className="hover:underline">Github</a>
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Contact</a>
                </div>
            </div>

            {/* 임시 /company, /admin 이동 */}
            <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-center gap-6">
                <Link
                    to="/company"
                    className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg"
                >
                    (임시) 기업 페이지
                </Link>
                <Link
                    to="/admin/qna"
                    className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg"
                >
                    (임시) 관리자 페이지
                </Link>
            </div>
        </footer>
    );
}

export default Footer;