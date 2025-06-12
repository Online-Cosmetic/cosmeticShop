import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { companyAPI } from "../../utils/customAxios.js";
import { getImageUrl } from "../../utils/imageUtils.js";

// 카테고리 매핑 (categoryId -> 카테고리명)
const CATEGORY_MAP = {
    1: "Makeup",
    2: "Skincare",
    3: "Hair",
    4: "Body"
};

function ProductManagement() {
    // 상품 목록 상태
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    // 수정 관련 상태
    const [editingProductId, setEditingProductId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [showDescription, setShowDescription] = useState(null);
    const [editDescription, setEditDescription] = useState("");

    // 이미지 업로드 관련 상태
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [imagesDeleted, setImagesDeleted] = useState(false);

    // 이미지 URL 메모이제이션 (불필요한 재생성 방지)
    const mainImageUrl = useMemo(() => {
        return mainImage ? URL.createObjectURL(mainImage) : null;
    }, [mainImage]);

    const additionalImageUrls = useMemo(() => {
        return additionalImages.map(image => URL.createObjectURL(image));
    }, [additionalImages]);

    // 이미지 URL 정리 (메모리 누수 방지)
    useEffect(() => {
        return () => {
            // 컴포넌트 언마운트 시 URL 객체 해제
            if (mainImageUrl) {
                URL.revokeObjectURL(mainImageUrl);
            }
            additionalImageUrls.forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, [mainImageUrl, additionalImageUrls]);

    // 무한 스크롤을 위한 참조
    const observer = useRef();
    const lastProductRef = useCallback(node => {
        if (loading) return;
        if (!hasMore) return; // hasMore가 false면 더 이상 관찰하지 않음
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // 상품 목록 불러오기
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await companyAPI.product.getProducts(page, 10);
            const newProducts = response.data.content;

            // 응답 데이터 구조 확인을 위한 로깅
            console.log("API 응답 데이터:", response.data);
            console.log("상품 목록 데이터:", newProducts);

            if (newProducts && newProducts.length > 0) {
                console.log("첫 번째 상품 데이터:", newProducts[0]);
                console.log("이미지 URL:", newProducts[0].mainImageUrl);
            }

            // 가져온 상품이 없으면 더 이상 불러올 상품이 없는 것으로 간주
            if (!newProducts || newProducts.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            // 첫 페이지면 목록 교체, 아니면 추가
            if (page === 0) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
            }

            // 마지막 페이지 여부 확인
            setHasMore(!response.data.last);
        } catch (error) {
            console.error("상품 목록 조회 실패:", error);
            toast.error("상품 목록을 불러오는데 실패했습니다.");
            setHasMore(false); // 오류 발생 시에도 더 이상 요청하지 않도록 설정
        } finally {
            setLoading(false);
        }
    }, [page]);

    // 페이지 변경 시 상품 목록 불러오기
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // 편집 모드 시작
    const handleEdit = (product) => {
        // 이미 편집 중인 상품이 있으면 취소
        if (editingProductId) {
            handleCancel();
        }

        setEditingProductId(product.id);
        setEditValues({
            productName: product.productName,
            categoryId: product.categoryId,
            price: product.price,
            stock: product.stock,
            discountRate: product.discountRate
        });

        // 상세 설명 표시
        setShowDescription(product.id);
        setEditDescription(product.description || "");
    };

    // 상품 설명만 저장하는 함수
    const handleSaveDescription = async (productId) => {
        try {
            await companyAPI.product.updateProductDescription(productId, editDescription);
            toast.success("상품 설명이 성공적으로 수정되었습니다.");

            // 상태 업데이트 (전체 리로드 없이)
            setProducts(prev => prev.map(p => {
                if (p.id === productId) {
                    return {...p, description: editDescription};
                }
                return p;
            }));

            // 편집 모드 유지 (전체 취소 없이)
            setShowDescription(null);
        } catch (error) {
            console.error("상품 설명 수정 실패:", error);
            toast.error("상품 설명 수정에 실패했습니다.");
        }
    };

    // 상품 정보만 저장하는 함수
    const handleSaveInfo = async (productId) => {
        try {
            await companyAPI.product.updateProduct(productId, {
                productName: editValues.productName,
                categoryId: editValues.categoryId,
                price: editValues.price,
                stock: editValues.stock,
                discountRate: editValues.discountRate
            });

            toast.success("상품 정보가 성공적으로 수정되었습니다.");

            // 상태 업데이트 (전체 리로드 없이)
            setProducts(prev => prev.map(p => {
                if (p.id === productId) {
                    return {...p, ...editValues};
                }
                return p;
            }));
        } catch (error) {
            console.error("상품 정보 수정 실패:", error);
            toast.error("상품 정보 수정에 실패했습니다.");
        }
    };

    // 이미지만 업데이트하는 함수
    const handleSaveImages = async (productId) => {
        try {
            const formData = new FormData();

            // 이미지 삭제 여부 플래그 추가 - 항상 명시적으로 설정
            formData.append('deleteMainImage', imagesDeleted ? 'true' : 'false');
            formData.append('deleteAdditionalImages', imagesDeleted ? 'true' : 'false');

            // 메인 이미지가 있으면 추가
            if (mainImage) {
                formData.append('mainImage', mainImage);
            }

            // 추가 이미지가 있으면 추가
            if (additionalImages.length > 0) {
                additionalImages.forEach(image => {
                    formData.append('additionalImages', image);
                });
            }

            // 이미지 업데이트 API 호출
            const response = await companyAPI.product.updateProductImages(productId, formData);

            if (response.status === 204) { // No Content 성공 응답
                toast.success("상품 이미지가 성공적으로 수정되었습니다.");

                // 이미지 정보는 서버에서 새로 가져와야 함
                fetchProducts();

                // 이미지 상태 초기화
                setMainImage(null);
                setAdditionalImages([]);
                setImagesDeleted(false);
            }
        } catch (error) {
            console.error("상품 이미지 수정 실패:", error);
            toast.error(`상품 이미지 수정에 실패했습니다. 오류: ${error.response?.status || error.message}`);
        }
    };

    // 기존 handleSave 함수는 모든 작업을 하나로 묶는 함수로 수정
    const handleSave = async (productId) => {
        try {
            // 1. 상품 정보 업데이트
            await handleSaveInfo(productId);

            // 2. 설명 업데이트
            await handleSaveDescription(productId);

            // 3. 이미지가 변경되었다면 이미지도 업데이트
            if (imagesDeleted || mainImage || additionalImages.length > 0) {
                await handleSaveImages(productId);
            }
            
            // 페이지 자동 새로고침 (또는 데이터 다시 불러오기)
            window.location.reload(); // 전체 페이지 새로고침 방식

            // 모든 작업이 완료되면 편집 상태 초기화
            resetEditState();
        } catch (error) {
            console.error("상품 수정 실패:", error);
            toast.error("상품 수정에 실패했습니다.");
        }
    };

    // 삭제 처리
    const handleDelete = async (productId) => {
        if (!window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            return;
        }

        try {
            await companyAPI.product.deleteProduct(productId);
            toast.success("상품이 성공적으로 삭제되었습니다.");

            // 상품 목록에서 제거
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error("상품 삭제 실패:", error);
            toast.error("상품 삭제에 실패했습니다.");
        }
    };

    // 취소 처리
    const handleCancel = () => {
        resetEditState();
    };

    // 편집 상태 초기화
    const resetEditState = () => {
        setEditingProductId(null);
        setEditValues({});
        setShowDescription(null);
        setEditDescription("");
        setMainImage(null);
        setAdditionalImages([]);
        setImagesDeleted(false);
    };

    // 이미지 삭제 처리
    const handleDeleteImage = () => {
        setImagesDeleted(true);
    };

    // 메인 이미지 선택 처리
    const handleMainImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0]);
        }
    };

    // 추가 이미지 선택 처리
    const handleAdditionalImagesUpload = (e) => {
        if (e.target.files) {
            // 최대 5개까지만 선택 가능
            const selectedFiles = Array.from(e.target.files).slice(0, 5);
            setAdditionalImages(selectedFiles);
        }
    };

    // 필드 값 변경 처리
    const handleFieldChange = (productId, field, value) => {
        setEditValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 설명 변경 처리
    const handleDescriptionChange = (e) => {
        setEditDescription(e.target.value);
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-12">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-4xl font-bold text-black">상품 관리</h2>
                    <input
                        type="text"
                        placeholder="상품명 검색"
                        className="w-64 px-4 py-2 border border-gray-300 rounded-full shadow-sm"
                    />
                </div>

                {/* 표 Header (7컬럼) */}
                <div className="grid grid-cols-7 gap-4 font-semibold text-sm text-gray-700 border-b border-gray-300 pb-2">
                    <div>이미지</div>
                    <div>상품명</div>
                    <div>카테고리</div>
                    <div>가격</div>
                    <div>재고</div>
                    <div>할인율</div>
                    <div>작업</div>
                </div>

                {/* 상품 목록 */}
                {products.map((product, index) => {
                    const isEditing = editingProductId === product.id;
                    const isLast = index === products.length - 1;

                    return (
                        <React.Fragment key={product.id}>
                            <div
                                ref={isLast ? lastProductRef : null}
                                className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 py-2"
                            >
                                {/* 이미지 영역 */}
                                <div className="relative">
                                    {isEditing && (
                                        <>
                                            {!imagesDeleted && !mainImage && (
                                                <button
                                                    onClick={handleDeleteImage}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                                                >
                                                    X
                                                </button>
                                            )}
                                            {(imagesDeleted || mainImage) && (
                                                <label className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleMainImageUpload}
                                                        accept="image/*"
                                                    />
                                                    <span className="text-4xl text-gray-400">+</span>
                                                </label>
                                            )}
                                        </>
                                    )}
                                    {(!isEditing || (!imagesDeleted && !mainImage)) && (
                                        <img
                                            src={product.mainImageUrl 
                                                ? getImageUrl(product.mainImageUrl) 
                                                : "https://placehold.co/64x64"}
                                            alt={product.productName || "상품 이미지"}
                                            className="rounded w-16 h-16 object-cover"
                                            onError={(e) => {
                                                console.error("이미지 로드 실패:", product.mainImageUrl);
                                                e.target.src = "https://placehold.co/64x64";
                                            }}
                                        />
                                    )}
                                    {isEditing && mainImageUrl && (
                                        <img
                                            src={mainImageUrl}
                                            alt="미리보기"
                                            className="rounded w-16 h-16 object-cover"
                                        />
                                    )}
                                </div>

                                {/* 상품명 (수정 불가) */}
                                <div className="font-medium text-gray-800">
                                    {product.productName}
                                </div>

                                {/* 카테고리 */}
                                <div className="text-gray-500">
                                    {isEditing ? (
                                        <select
                                            value={editValues.categoryId || product.categoryId}
                                            onChange={(e) => handleFieldChange(product.id, 'categoryId', parseInt(e.target.value))}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value={1}>Makeup</option>
                                            <option value={2}>Skincare</option>
                                            <option value={3}>Hair</option>
                                            <option value={4}>Body</option>
                                        </select>
                                    ) : (
                                        CATEGORY_MAP[product.categoryId] || "기타"
                                    )}
                                </div>

                                {/* 가격 */}
                                <div className="text-gray-800 font-semibold">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editValues.price ?? product.price}
                                            onChange={(e) => handleFieldChange(product.id, 'price', parseInt(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            min="0"
                                        />
                                    ) : (
                                        `₩${product.price.toLocaleString()}`
                                    )}
                                </div>

                                {/* 재고 */}
                                <div className="text-gray-600">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editValues.stock ?? product.stock}
                                            onChange={(e) => handleFieldChange(product.id, 'stock', parseInt(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            min="0"
                                        />
                                    ) : (
                                        product.stock
                                    )}
                                </div>

                                {/* 할인율 */}
                                <div className="text-gray-600">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editValues.discountRate ?? product.discountRate}
                                            onChange={(e) => handleFieldChange(product.id, 'discountRate', parseInt(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            min="0"
                                            max="100"
                                        />
                                    ) : (
                                        `${product.discountRate}%`
                                    )}
                                </div>

                                {/* 작업 버튼 */}
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(product.id)}
                                                className="text-green-600 hover:underline"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="text-gray-600 hover:underline"
                                            >
                                                취소
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* 상세 설명 (수정 버튼 클릭 시 표시) */}
                            {showDescription === product.id && (
                                <div className="col-span-7 bg-gray-50 p-4 rounded-md mt-2 mb-4">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-semibold">상품 설명</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    // 설명만 업데이트
                                                    handleSaveDescription(product.id);
                                                }}
                                                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowDescription(null);
                                                    setEditDescription("");
                                                }}
                                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                    <textarea
                                        value={editDescription}
                                        onChange={handleDescriptionChange}
                                        className="w-full h-32 p-2 border rounded"
                                        placeholder="상품 설명을 입력하세요"
                                    />
                                </div>
                            )}

                            {/* 추가 이미지 업로드 영역 (메인 이미지가 있을 때만 표시) */}
                            {isEditing && mainImage && (
                                <div className="col-span-7 bg-gray-50 p-4 rounded-md mt-2 mb-4">
                                    <h3 className="font-semibold mb-2">추가 이미지 (최대 5개)</h3>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleAdditionalImagesUpload}
                                                multiple
                                                accept="image/*"
                                            />
                                            <span className="text-4xl text-gray-400">+</span>
                                        </label>

                                        {/* 선택된 추가 이미지 미리보기 */}
                                        {additionalImages.map((image, idx) => (
                                            <div key={idx} className="relative">
                                                <img
                                                    src={additionalImageUrls[idx]}
                                                    alt={`추가 이미지 ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newImages = [...additionalImages];
                                                        newImages.splice(idx, 1);
                                                        setAdditionalImages(newImages);
                                                    }}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}

                {/* 로딩 표시 */}
                {loading && (
                    <div className="col-span-7 text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-500">상품을 불러오는 중...</p>
                    </div>
                )}

                {/* 데이터 없음 표시 */}
                {!loading && products.length === 0 && (
                    <div className="col-span-7 text-center py-8">
                        <p className="text-gray-500">등록된 상품이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductManagement;