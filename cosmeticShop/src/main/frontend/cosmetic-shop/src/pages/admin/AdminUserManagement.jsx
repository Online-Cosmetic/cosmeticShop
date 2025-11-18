// src/pages/admin/AdminUserManagement.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/customAxios";

export default function AdminUserManagement() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    // Fetch user data
    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.user.getUserList(searchTerm, currentPage, pageSize);
            setUserList(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            console.error("Error fetching users:", error);
            setUserList([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    // 날짜 포맷 함수
    const formatDate = (iso) => {
        if (!iso) return '-';
        const date = new Date(iso);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-2">
                {/* 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">사용자 관리</h2>
                    <div className="text-sm text-gray-500">
                        총 {totalElements}명
                    </div>
                </div>

                {/* 검색 */}
                <div className="flex justify-end items-center mt-4">
                    <div className="w-full max-w-xs flex-shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="아이디, 닉네임, 이메일을 검색하세요"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 테이블 헤더 */}
                <div className="w-full bg-zinc-100 rounded-t-lg border-b border-neutral-200 flex items-center mt-6 py-2 px-4 text-lg text-black font-normal">
                    <div className="w-20 text-center">ID</div>
                    <div className="w-32 text-center">아이디</div>
                    <div className="w-32 text-center">닉네임</div>
                    <div className="flex-1 text-center">이메일</div>
                    <div className="w-32 text-center">이름</div>
                    <div className="w-36 text-center">가입일</div>
                    <div className="w-24 text-center">상세</div>
                </div>

                {/* 로딩 상태 */}
                {loading ? (
                    <div className="w-full py-8 text-center text-gray-500">Loading...</div>
                ) : userList.length === 0 ? (
                    <div className="w-full py-8 text-center text-gray-500">
                        {searchTerm 
                            ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
                            : '사용자가 없습니다.'}
                    </div>
                ) : (
                    /* 테이블 항목 */
                    userList.map((user) => (
                        <div
                            key={user.id}
                            className="w-full bg-white border-b border-neutral-200 flex items-center py-2 px-4 text-md text-black font-normal hover:bg-zinc-50 transition-colors"
                        >
                            <div className="w-20 text-center">{user.id}</div>
                            <div className="w-32 text-center">{user.userId}</div>
                            <div className="w-32 text-center">{user.nickname}</div>
                            <div className="flex-1 text-center">{user.email || '-'}</div>
                            <div className="w-32 text-center">{user.username}</div>
                            <div className="w-36 text-center">{formatDate(user.createdAt)}</div>
                            <div className="w-24 text-center">
                                <button
                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                    className="px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                >
                                    상세
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* 페이지네이션 */}
                {!loading && totalPages > 0 && (
                    <div className="flex justify-center items-center gap-5 mt-4">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                            className={`text-2xl ${currentPage === 0 ? 'text-gray-300' : 'text-neutral-600'} rotate-180`}
                        >
                            ▶
                        </button>
                        <div className="text-lg">
                            Page {currentPage + 1} of {totalPages}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage >= totalPages - 1}
                            className={`text-2xl ${currentPage >= totalPages - 1 ? 'text-gray-300' : 'text-neutral-600'}`}
                        >
                            ▶
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

