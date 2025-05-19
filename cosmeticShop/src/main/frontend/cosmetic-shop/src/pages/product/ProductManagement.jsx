import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EnterpriseHeader from "../../components/enterprise/EnterpriseHeader.jsx";
import Footer from "../../components/common/Footer.jsx";
import EnterpriseSidebar from "../../components/enterprise/EnterpriseSidebar.jsx";

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 페이지당 상품 수

    // 임시 더미 데이터
    useEffect(() => {
        const dummy = [
            {
                id: 1,
                image: "https://placehold.co/64x64",
                name: "Product A",
                category: "Hair",
                price: 4000,
                stock: 10,
            },
            {
                id: 2,
                image: "https://placehold.co/64x64",
                name: "Product B",
                category: "Makeup",
                price: 12000,
                stock: 5,
            },
        ];
        setProducts(dummy);
    }, []);

    const totalPages = 78;
    const startIndex = 1;
    // const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

    {/* 상품목록 이동
    useEffect(() => {
        axios.get(`/api/products?page=${page}&size=${PAGE_SIZE}`)
            .then(res => {
                setProducts(res.data.products);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
            });
    }, [page]);
    */}
    return (

        <>
            {/* 헤더 */}
            <EnterpriseHeader />
            {/* 사이드바 */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="w-1/6 border-r border-gray-500">
                    <EnterpriseSidebar />
                </div>
                {/* 본문 */}
                <div className="flex-1 flex justify-center">
                    <div className="w-full mx-auto px-20 py-20 rounded-2xl flex flex-col gap-4">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-4xl font-bold text-black">Product Management</h2>
                            <input
                                type="text"
                                placeholder="Search product name"
                                className="w-64 px-4 py-2 border border-gray-300 rounded-full shadow-sm"
                            />
                        </div>

                        {/* 표 Header */}
                        <div className="grid grid-cols-6 gap-4 font-semibold text-sm text-gray-700 border-b border-gray-300 pb-2">
                            <div>Image</div>
                            <div>Product Name</div>
                            <div>Category</div>
                            <div>Price</div>
                            <div>Stock</div>
                            <div>Actions</div>
                        </div>

                        {/* 상품 목록 */}
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="grid grid-cols-6 gap-4 items-center border-b border-gray-100 py-2"
                            >
                                <img src={product.image} alt={product.name} className="rounded" />
                                <div className="font-medium text-gray-800">{product.name}</div>
                                <div className="text-gray-500">{product.category}</div>
                                <div className="text-gray-800 font-semibold">₩{product.price.toLocaleString()}</div>
                                <div className="text-gray-600">{product.stock}</div>
                                <div className="flex gap-2">
                                    <button className="text-blue-600 hover:underline">Edit</button>
                                    <button className="text-red-600 hover:underline">Delete</button>
                                </div>
                            </div>
                        ))}
                        {/* 페이지네이션 */}
                        <div className="flex items-center justify-between mt-6 700 border-t pt-6 border-gray-300">
                            <span className="text-sm text-gray-600">
                              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, products.length)} of {products.length}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    // onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    className="px-2 py-1 border rounded disabled:opacity-50"
                                    // disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>
                                <button
                                    // onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    className="px-2 py-1 border rounded disabled:opacity-50"
                                    // disabled={currentPage === totalPages}
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProductManagement;