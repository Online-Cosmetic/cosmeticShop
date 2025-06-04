import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 페이지당 상품 수

    // 임시 더미 데이터에 discountRate 필드를 추가
    useEffect(() => {
        const dummy = [
            {
                id: 1,
                image: "https://placehold.co/64x64",
                name: "Product A",
                category: "Hair",
                price: 4000,
                stock: 10,
                discountRate: 5, // 5%
            },
            {
                id: 2,
                image: "https://placehold.co/64x64",
                name: "Product B",
                category: "Makeup",
                price: 12000,
                stock: 5,
                discountRate: 10, // 10%
            },
            // … 필요에 따라 더 추가
        ];
        setProducts(dummy);
    }, []);

    const totalPages = 78;
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-12">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-4xl font-bold text-black">Product Management</h2>
                    <input
                        type="text"
                        placeholder="Search product name"
                        className="w-64 px-4 py-2 border border-gray-300 rounded-full shadow-sm"
                    />
                </div>

                {/* 표 Header (7컬럼) */}
                <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-gray-700 border-b border-gray-300 pb-2">
                    <div>Image</div>
                    <div>Product Name</div>
                    <div>Category</div>
                    <div>Price</div>
                    <div>Stock</div>
                    <div>Discount Rate</div>
                    <div>Actions</div>
                </div>

                {/* 상품 목록 (각 행에 discountRate 추가) */}
                {products.slice(startIndex, startIndex + itemsPerPage).map((product) => (
                    <div
                        key={product.id}
                        className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 py-2"
                    >
                        <img src={product.image} alt={product.name} className="rounded" />
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-gray-500">{product.category}</div>
                        <div className="text-gray-800 font-semibold">
                            ₩{product.price.toLocaleString()}
                        </div>
                        <div className="text-gray-600">{product.stock}</div>
                        <div className="text-gray-600">
                            {product.discountRate != null ? `${product.discountRate}%` : "-"}
                        </div>
                        <div className="flex gap-2">
                            <button className="text-blue-600 hover:underline">Edit</button>
                            <button className="text-red-600 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}

                {/* 페이지네이션 */}
                <div className="flex items-center justify-between mt-6 border-t pt-6 border-gray-300">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, products.length)} of {products.length}
          </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductManagement;