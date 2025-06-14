// src/pages/admin/AdminBadKeywordManagement.jsx

import React, { useState, useEffect } from "react";
import { adminAPI } from "../../utils/customAxios";

export default function AdminBadKeywordManagement() {
    const [badKeywords, setBadKeywords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newKeyword, setNewKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch BadKeywords
    useEffect(() => {
        fetchBadKeywords();
    }, []);

    const fetchBadKeywords = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminAPI.badKeyword.getAllBadKeywords();
            setBadKeywords(response.data);
        } catch (error) {
            console.error("Error fetching BadKeywords:", error);
            setError("Failed to load bad keywords. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Add new BadKeyword
    const handleAddKeyword = async () => {
        if (!newKeyword.trim()) {
            alert("Please enter a keyword");
            return;
        }

        try {
            await adminAPI.badKeyword.addBadKeyword(newKeyword);
            setNewKeyword(""); // Clear input field
            fetchBadKeywords(); // Refresh the list
        } catch (error) {
            console.error("Error adding BadKeyword:", error);
            alert("Failed to add keyword. Please try again.");
        }
    };

    // Delete BadKeyword
    const handleDeleteKeyword = async (badKeywordId) => {
        if (window.confirm("Are you sure you want to delete this keyword?")) {
            try {
                await adminAPI.badKeyword.deleteBadKeyword(badKeywordId);
                fetchBadKeywords(); // Refresh the list
            } catch (error) {
                console.error("Error deleting BadKeyword:", error);
                alert("Failed to delete keyword. Please try again.");
            }
        }
    };

    // Delete all reviews with BadKeywords
    const handleDeleteReviews = async () => {
        if (window.confirm("모든 불량 키워드가 포함된 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            try {
                await adminAPI.badKeyword.deleteReviewsWithBadKeywords();
                alert("불량 키워드가 포함된 모든 리뷰가 삭제되었습니다.");
            } catch (error) {
                console.error("리뷰 삭제 오류:", error);
                alert("리뷰 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
        }
    };

    // Pagination
    const totalPages = Math.ceil(badKeywords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = badKeywords.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">Bad Keyword 관리</h2>
                </div>

                {/* Add new keyword section */}
                <div className="mt-2 p-6 bg-gray-50 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800">등록</h3>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Enter new bad keyword..."
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button
                            onClick={handleAddKeyword}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                            등록
                        </button>
                    </div>
                </div>

                {/* Delete reviews with bad keywords button */}
                <div className="mt-2 flex justify-end">
                    <button
                        onClick={handleDeleteReviews}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                    >
                        <span>모든 악성리뷰 일괄삭제</span>
                    </button>
                </div>

                {/* Keywords List */}
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800">목록</h3>

                    {/* Loading state */}
                    {loading ? (
                        <div className="flex justify-center items-center h-40 bg-white rounded-lg border shadow-sm">
                            <div className="text-xl text-gray-500">Loading keywords...</div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-40 bg-white rounded-lg border shadow-sm">
                            <div className="text-xl text-red-500">{error}</div>
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className="flex justify-center items-center h-40 bg-white rounded-lg border shadow-sm">
                            <div className="text-xl text-gray-500">No bad keywords found.</div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                            {/* Table header */}
                            <div className="w-full bg-gray-100 flex items-center py-3 px-6 text-lg font-semibold text-neutral-700">
                                <div className="w-28 text-center">ID</div>
                                <div className="flex-1 text-center">Keyword</div>
                                <div className="w-32 text-center">Actions</div>
                            </div>

                            {/* Table items */}
                            {currentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-full border-t border-gray-200 flex items-center py-4 px-6 text-md hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-28 text-center text-gray-600">{item.id}</div>
                                    <div className="flex-1 text-center font-medium text-neutral-800">{item.keyword}</div>
                                    <div className="w-32 text-center">
                                        <button
                                            onClick={() => handleDeleteKeyword(item.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && badKeywords.length > 0 && (
                        <div className="flex justify-center items-center gap-5 mt-6">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === 1 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white border border-gray-300 text-neutral-700 hover:bg-gray-50'
                                } transition-colors`}
                            >
                                Previous
                            </button>
                            <div className="text-lg font-medium text-neutral-700">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === totalPages 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white border border-gray-300 text-neutral-700 hover:bg-gray-50'
                                } transition-colors`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
