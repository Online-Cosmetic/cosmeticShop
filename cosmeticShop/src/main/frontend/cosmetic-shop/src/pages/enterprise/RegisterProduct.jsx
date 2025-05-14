import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EnterpriseHeader from "../../components/enterprise/EnterpriseHeader.jsx";
import Footer from "../../components/common/Footer.jsx";
import EnterpriseSidebar from "../../components/enterprise/EnterpriseSidebar.jsx";

function RegisterProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        categoryId: '',
        productName: '',
        description: '',
        price: '',
        stock: ''
    });
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e, isMain) => {
        const files = Array.from(e.target.files);
        if (isMain) {
            setMainImage(files[0]);
        } else {
            const selected = files.slice(0, 5);
            if (files.length > 5) alert("최대 5장까지 가능합니다.");
            setAdditionalImages(selected);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));
        if (mainImage) data.append("mainImage", mainImage);
        additionalImages.forEach(img => data.append("additionalImages", img));
        try {
            await axios.post("/api/products", data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            navigate("/products");
        } catch (err) {
            console.error("상품 등록 실패", err);
        }
    };

    {/* 카테고리 드롭다운 */}
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const categories = [
        { id: 1, name: "Makeup" },
        { id: 2, name: "Skincare" },
        { id: 3, name: "Hair" },
        { id: 4, name: "Body" },
    ];

    return (
        <>
            {/* 헤더 */}
            <EnterpriseHeader />
            {/* 사이드바 */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="w-1/6 border-r border-gray-20">
                    <EnterpriseSidebar />
                </div>
                {/* 본문 */}
                <div className="flex-1 flex justify-center">
                    <div className="w-full mx-auto px-20 py-20 rounded-2xl flex flex-col gap-12">
                        <h2 className="text-4xl font-bold text-black">Product Registration</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            {/* 카테고리 */}
                            <div className="flex items-center gap-10">
                                <label className="w-1/4 text-2xl font-medium">Category</label>
                                <div className="w-full relative">
                                    <button
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        className="w-full h-10 px-4 py-2 border border-gray-300 rounded-xl text-left"
                                    >
                                        {formData.categoryId
                                            ? categories.find((c) => c.id === Number(formData.categoryId))?.name
                                            : "Select Category"}
                                        <span className="float-right">▼</span>
                                    </button>

                                    {showCategoryDropdown && (
                                        <ul className="absolute mt-2 w-full border rounded bg-white shadow z-10">
                                            {categories.map((cat) => (
                                                <li
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setFormData({ ...formData, categoryId: cat.id });
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {cat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>


                            {/* 상품명 */}
                            <div className="flex items-center gap-10">
                                <label className="w-1/4 text-2xl font-medium">Name</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleInputChange}
                                    className="w-full h-10 px-4 border border-neutral-300 rounded-xl"
                                />
                            </div>

                            {/* 설명 */}
                            <div className="flex items-start gap-10">
                                <label className="w-1/4 text-2xl font-medium">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full h-48 px-4 py-2 border border-neutral-300 rounded-xl appearance-none"
                                />
                            </div>

                            {/* 가격 */}
                            <div className="flex items-center gap-10">
                                    <label className="w-1/4 text-2xl font-medium">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full h-10 px-4 border border-neutral-300 rounded-xl appearance-none"
                                    />
                            </div>

                            {/* 재고 */}
                            <div className="flex items-center gap-10">
                                <label className="w-1/4 text-2xl font-medium">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full h-10 px-4 border border-neutral-300 rounded-xl"
                                />
                            </div>

                            {/* 메인이미지 */}
                            <div className="flex items-center gap-10">
                                <label className="w-1/4 text-2xl font-medium">Main Images</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleImageUpload(e, false)}
                                    className="file:mr-4 file:py-2 file:px-4
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-neutral-600 file:text-white
                                    hover:file:bg-neutral-700
                                    w-full text-sm text-gray-500"
                                />
                            </div>

                            {/* 추가이미지 */}
                            <div className="flex items-center gap-10">
                                <label className="w-1/4 text-2xl font-medium">Sub Images</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleImageUpload(e, false)}
                                    className="file:mr-4 file:py-2 file:px-4
                                    file:rounded-xl file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-neutral-600 file:text-white
                                    hover:file:bg-neutral-700
                                    w-full text-sm text-gray-500"
                                />
                            </div>

                            {/* 제출버튼 */}
                                <button
                                    type="submit"
                                    className="mt-6 px-6 py-3 bg-neutral-800 text-white rounded-xl text-lg font-semibold">
                                    상품 등록
                                </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default RegisterProduct;