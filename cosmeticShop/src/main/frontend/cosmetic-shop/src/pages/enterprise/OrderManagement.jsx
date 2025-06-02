import React from 'react';
import { useState } from 'react';
import FilterBar from "../../components/enterprise/FilterBar.jsx";

function OrderManagement() {
    const [filters, setFilters] = useState({
        date: "2025-05-14",
        type: "",
        status: ""
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setFilters({ date: "", type: "", status: "" });
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-12">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">Order Lists</h2>
                </div>

                {/* Filter Section */}
                <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

                {/* Table Header */}
                <div className="grid grid-cols-6 bg-neutral-50 p-4 border-b border-neutral-300 font-extrabold text-sm text-neutral-800 rounded-t-2xl">
                    <div>ID</div>
                    <div>Product Name</div>
                    <div>Address</div>
                    <div>Order Date</div>
                    <div>Customer Name</div>
                    <div>Status</div>
                </div>

                {/* Table Rows */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="grid grid-cols-6 items-center py-3 border-b border-gray-100 text-sm">
                        <div className="text-neutral-800 font-semibold">0000{i + 1}</div>
                        <div className="text-neutral-800 font-semibold">Product</div>
                        <div className="text-gray-600">대학로 {242 + i * 10}</div>
                        <div className="text-neutral-800 font-semibold">14 May 2025</div>
                        <div className="text-neutral-800 font-semibold">Customer {i + 1}</div>
                        <div>
                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${i % 3 === 0 ? 'bg-teal-100 text-teal-600' : i % 3 === 1 ? 'bg-violet-100 text-violet-600' : 'bg-red-100 text-red-600'}`}>
                                {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Processing' : 'Rejected'}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 border-t pt-6 border-gray-300">
                    <span className="text-sm text-gray-600">Showing 1–6 of 6</span>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 border rounded">&lt;</button>
                        <button className="px-2 py-1 border rounded">&gt;</button>
                    </div>
                </div>

                {/* Status Legend */}
                <div className="flex justify-center gap-4 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-400 rounded opacity-20" />
                        <span className="text-xs font-bold text-orange-400">On Hold</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-fuchsia-600 rounded opacity-20" />
                        <span className="text-xs font-bold text-fuchsia-600">In Transit</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderManagement;