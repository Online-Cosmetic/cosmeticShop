import React from "react";

const FilterBar = ({ filters, onChange, onReset }) => {
    const { date, type, status } = filters;

    return (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-xl px-6 py-4 w-full">
            {/* 왼쪽 필터들 */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V20l-6-2v-4.586L3.293 6.707A1 1 0 013 6V4z"
                        />
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">Filter By</span>
                </div>

                {/* 날짜 필터 */}
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => onChange("date", e.target.value)}
                        className="text-sm text-gray-800 border border-gray-300 rounded px-2 py-1"
                    />
                </div>

                {/* 주문 타입 필터 */}
                <div className="flex items-center gap-2">
                    <select
                        value={type}
                        onChange={(e) => onChange("type", e.target.value)}
                        className="text-sm text-gray-800 border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="">Order Type</option>
                        <option value="card">Card</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="simple">Simple Payment</option>
                    </select>
                </div>

                {/* 주문 상태 필터 */}
                <div className="flex items-center gap-2">
                    <select
                        value={status}
                        onChange={(e) => onChange("status", e.target.value)}
                        className="text-sm text-gray-800 border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="">Order Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* 오른쪽 Search 버튼 (돋보기 아이콘) */}
            <button
                onClick={onReset}
                className="flex items-center gap-1 text-gray-700 text-sm font-semibold hover:text-emerald-600"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1010 17.5a7.5 7.5 0 006.65-6.65z"
                    />
                </svg>
                <span>Search</span>
            </button>
        </div>
    );
};

export default FilterBar;
