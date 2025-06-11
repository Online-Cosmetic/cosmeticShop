// src/pages/admin/AdminBadKeywordManagement.jsx

import React, { useState, useEffect } from "react";
import { adminAPI } from "../../utils/customAxios";

export default function AdminBadKeywordManagement() {
    const [badKeywords, setBadKeywords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newKeyword, setNewKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch BadKeywords
    useEffect(() => {
        fetchBadKeywords();
    }, []);

    const fetchBadKeywords = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.badKeyword.getAllBadKeywords();
            setBadKeywords(response.data);
        } catch (error) {
            console.error("Error fetching BadKeywords:", error);
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
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-2">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">Bad Keyword Management</h2>
                </div>

                {/* Add new keyword section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Add New Bad Keyword</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter new bad keyword..."
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-md"
                        />
                        <button
                            onClick={handleAddKeyword}
                            className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
                        >
                            Add Keyword
                        </button>
                    </div>
                </div>

                {/* Delete reviews with bad keywords button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleDeleteReviews}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        Delete All Reviews with Bad Keywords
                    </button>
                </div>

                {/* Table header */}
                <div className="w-full bg-zinc-100 rounded-t-lg border-b border-neutral-200 flex items-center mt-6 py-2 px-4 text-lg text-black font-normal">
                    <div className="w-28 text-center">ID</div>
                    <div className="flex-1 text-center">Keyword</div>
                    <div className="w-24 text-center">Actions</div>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="w-full py-8 text-center text-gray-500">Loading...</div>
                ) : currentItems.length === 0 ? (
                    <div className="w-full py-8 text-center text-gray-500">No bad keywords found.</div>
                ) : (
                    /* Table items */
                    currentItems.map((item) => (
                        <div
                            key={item.id}
                            className="w-full bg-white border-b border-neutral-200 flex items-center py-2 px-4 text-md text-black font-normal"
                        >
                            <div className="w-28 text-center">{item.id}</div>
                            <div className="flex-1 text-center">{item.keyword}</div>
                            <div className="w-24 text-center">
                                <button
                                    onClick={() => handleDeleteKeyword(item.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination */}
                {!loading && badKeywords.length > 0 && (
                    <div className="flex justify-center items-center gap-5 mt-4">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`text-2xl ${currentPage === 1 ? 'text-gray-300' : 'text-neutral-600'} rotate-180`}
                        >
                            ▶
                        </button>
                        <div className="text-lg">
                            Page {currentPage} of {totalPages}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`text-2xl ${currentPage === totalPages ? 'text-gray-300' : 'text-neutral-600'}`}
                        >
                            ▶
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}