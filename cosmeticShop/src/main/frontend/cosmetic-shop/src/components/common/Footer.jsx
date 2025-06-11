import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-neutral-100 border-t text-gray-600 text-sm">
            <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
                <p className="mb-2 sm:mb-0">&copy; 2025 cosMall. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a
                        href="https://github.com/Online-Cosmetic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center space-x-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.57v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.33-1.78-1.33-1.78-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.13 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.3c0 .32.21.69.83.57A12 12 0 0 0 12 .5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Github</span>
                    </a>
                </div>
            </div>

            {/* 수정된 임시 링크 부분 */}
            <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-center gap-6">
                <Link
                    to="/company"
                    className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg"
                >
                    (임시) 기업 페이지
                </Link>
                <Link
                    to="/admin/login"
                    className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg"
                >
                    (임시) 관리자 페이지
                </Link>
            </div>
        </footer>
    );
}

export default Footer;