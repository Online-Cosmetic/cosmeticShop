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

    // Fetch user data
    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.user.getUserList(searchTerm, currentPage, pageSize);
            setUserList(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Search users
    const handleSearch = async () => {
        setCurrentPage(0); // Reset to first page when searching
        setLoading(true);
        try {
            const response = await adminAPI.user.getUserList(searchTerm, 0, pageSize);
            setUserList(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="아이디, 닉네임, 이메일로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="px-4 py-2 border rounded-md w-64"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
                        >
                            검색
                        </button>
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setCurrentPage(0);
                                    fetchUsers();
                                }}
                                className="px-4 py-2 bg-gray-200 text-neutral-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                초기화
                            </button>
                        )}
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
                    <div className="w-full py-8 text-center text-gray-500">사용자가 없습니다.</div>
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

