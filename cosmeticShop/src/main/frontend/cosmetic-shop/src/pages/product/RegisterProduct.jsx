import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";

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
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageUpload = (e, isMain) => {
        const files = Array.from(e.target.files);
        if (isMain) {
            setMainImage(files[0]);
        } else {
            // 최대 5장 체크: 추가 이미지가 5장을 넘지 않도록 함
            const selectedFiles = files.slice(0, 5);
            if (files.length > 5) {
                alert('추가 이미지는 최대 5장까지 선택할 수 있습니다.');
            }
            setAdditionalImages(selectedFiles);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        if (mainImage) {
            formDataToSend.append('mainImage', mainImage);
        }

        additionalImages.forEach(image => {
            formDataToSend.append('additionalImages', image);
        });

        try {
            await axios.post('/api/products', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            navigate('/products');
        } catch (error) {
            console.error('상품 등록 중 오류 발생:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>상품 등록</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">카테고리</label>
                        <select
                            className="form-select"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleInputChange}
                        >
                            <option value="">카테고리 선택</option>
                            <option value="1">Skin Care</option>
                            <option value="2">Hair Care</option>
                            <option value="3">Make Up</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">상품명</label>
                        <input
                            type="text"
                            className="form-control"
                            name="productName"
                            value={formData.productName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">상품 설명</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">가격</label>
                        <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">재고</label>
                        <input
                            type="number"
                            className="form-control"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">메인 이미지</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => handleImageUpload(e, true)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">추가 이미지 (최대 5장)</label>
                        <input
                            type="file"
                            className="form-control"
                            multiple
                            onChange={(e) => handleImageUpload(e, false)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">상품 등록</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default RegisterProduct;