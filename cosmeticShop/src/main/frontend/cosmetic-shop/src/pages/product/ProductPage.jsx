import React from "react";
import { useParams } from "react-router-dom";
import ProductList from "./ProductList";

const CATEGORY_LIST = ["all", "makeup", "skincare", "hair", "body"];

function ProductPage({ products }) {
    const { category } = useParams();
    const selectedCategory = category || "all";  // 기본값

    const filtered = selectedCategory.toLowerCase() === "all"
        ? products
        : products.filter(p =>
            p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;
    const currentProducts = filtered.slice(offset, offset + itemsPerPage);

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-6">
            {/* 임시 products 내에서의 내비게이션

             <div className="flex gap-4 mb-6 justify-center">
                {CATEGORY_LIST.map(cat => (
                    <a
                        key={cat}
                        href={`/products/${cat}`}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                            selectedCategory === cat
                                ? "bg-black text-white"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {cat()}
                    </a>
                ))}
            </div> */}

            <ProductList products={currentProducts} title={selectedCategory} />

            <div className="flex justify-center mt-8 gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 disabled:opacity-50"
                >
                    ◀
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 ${
                            currentPage === i + 1 ? "bg-black text-white" : "bg-white"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 disabled:opacity-50"
                >
                    ▶
                </button>
            </div>
        </div>
    );
}

export default ProductPage;