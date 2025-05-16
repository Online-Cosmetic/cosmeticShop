import React from 'react';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">상품 관리</h1>
                <Link 
                    to="/company/product/register" 
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                >
                    새 상품 등록
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">등록된 상품이 없습니다.</p>
            </div>
        </div>
    );
};

export default ProductManagement; 