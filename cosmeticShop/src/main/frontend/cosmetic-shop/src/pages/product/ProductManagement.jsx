import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { companyAPI, userAPI } from "../../utils/customAxios.js";
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
    const [searchKeyword, setSearchKeyword] = useState('');
    const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('');
    const [sortOption, setSortOption] = useState('latest'); // 기본값: 등록시간순

    // 수정 관련 상태
    const [editingProductId, setEditingProductId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [showDescription, setShowDescription] = useState(null);
    const [editDescription, setEditDescription] = useState("");

    // 이미지 업로드 관련 상태
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    // 기존 등록된 추가 이미지의 "원본 경로" 목록 (예: /images/..., DB에 저장된 값 그대로)
    const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);
    const [mainImageDeleted, setMainImageDeleted] = useState(false); // 메인 이미지 삭제 플래그
    const [additionalImagesDeleted, setAdditionalImagesDeleted] = useState(false); // 추가 이미지 삭제 플래그

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
            console.log("상품 목록 요청:", { page, keyword: appliedSearchKeyword, sort: sortOption });
            const response = await companyAPI.product.getProducts(page, 10, appliedSearchKeyword, sortOption);
            const newProducts = response.data.content;
            console.log("검색 결과:", { keyword: appliedSearchKeyword, sort: sortOption, count: newProducts?.length });

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
    }, [page, appliedSearchKeyword, sortOption]);

    // 검색어 또는 정렬 옵션 변경 시 페이지 초기화
    useEffect(() => {
        setPage(0);
        setProducts([]);
        setHasMore(true);
    }, [appliedSearchKeyword, sortOption]);

    // 페이지 또는 검색어 변경 시 상품 목록 불러오기
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // 편집 모드 시작
    const handleEdit = async (product) => {
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

        // 이미지 관련 상태 초기화 (편집 시작 시)
        setMainImage(null);
        setAdditionalImages([]);
        setMainImageDeleted(false);
        setAdditionalImagesDeleted(false);

        // 기존 추가 이미지 불러오기
        try {
            const response = await userAPI.product.getById(product.id);
            const productImageDTO = response.data.productImageDTO;

            console.log("기존 추가 이미지 불러오기 - productImageDTO:", productImageDTO);

            if (productImageDTO && productImageDTO.images && productImageDTO.images.length > 0) {
                // DB에 저장된 원본 이미지 경로만 상태로 저장
                const originalImagePaths = productImageDTO.images
                    .map(img => img.imageUrl)
                    .filter(path => path); // null/undefined 제거
                console.log("기존 추가 이미지 경로 추출:", originalImagePaths);
                setExistingAdditionalImages(originalImagePaths);
            } else {
                console.log("기존 추가 이미지가 없습니다.");
                setExistingAdditionalImages([]);
            }
        } catch (error) {
            console.error("기존 추가 이미지 불러오기 실패:", error);
            setExistingAdditionalImages([]);
        }
    };

    // 상품 설명 저장 함수 (handleSave에서 호출됨)
    const handleSaveDescription = async (productId) => {
        try {
            await companyAPI.product.updateProductDescription(productId, editDescription);
            // 상태 업데이트는 handleSave에서 처리하므로 여기서는 API 호출만
        } catch (error) {
            console.error("상품 설명 수정 실패:", error);
            throw error; // 에러를 상위로 전달하여 handleSave에서 처리
        }
    };

    // 상품 정보 저장 함수 (handleSave에서 호출됨)
    const handleSaveInfo = async (productId) => {
        try {
            await companyAPI.product.updateProduct(productId, {
                productName: editValues.productName,
                categoryId: editValues.categoryId,
                price: editValues.price,
                stock: editValues.stock,
                discountRate: editValues.discountRate
            });
            // 상태 업데이트와 토스트 메시지는 handleSave에서 처리
        } catch (error) {
            console.error("상품 정보 수정 실패:", error);
            throw error; // 에러를 상위로 전달하여 handleSave에서 처리
        }
    };

    // 이미지 저장 중 상태
    const [savingImages, setSavingImages] = useState(false);

    // 이미지만 업데이트하는 함수
    const handleSaveImages = async (productId) => {
        try {
            setSavingImages(true);
            const formData = new FormData();

            // 이미지 삭제 여부 플래그 - 메인 이미지와 추가 이미지 분리
            // 메인 이미지: 메인 이미지 삭제 플래그가 true이고 새 이미지가 없을 때만 삭제
            const shouldDeleteMain = mainImageDeleted && !mainImage;
            
            // 유지할 기존 추가 이미지 목록 (null이 아닌 원본 경로)
            const remainingExistingImages = existingAdditionalImages.filter(url => url && url !== null);
            // 기존 추가 이미지 중 삭제된 것이 있는지 확인
            const hasDeletedExistingImages = existingAdditionalImages.length > remainingExistingImages.length;
            
            // 추가 이미지 삭제 플래그 설정
            // - deleteAdditionalImages = true  : 모든 기존 추가 이미지를 삭제
            // - remainingAdditionalImageUrls 사용: 일부만 남기고 나머지만 삭제 (부분 삭제)
            //   → hasDeletedExistingImages가 true라도, remainingExistingImages 정보를 함께 보내므로
            //     deleteAdditionalImages는 "전체 삭제" 경우에만 true로 유지
            const shouldDeleteAdditional =
                (additionalImagesDeleted && additionalImages.length === 0 && remainingExistingImages.length === 0);
            
            console.log("추가 이미지 삭제 플래그 계산:", {
                existingAdditionalImages: existingAdditionalImages,
                remainingExistingImages: remainingExistingImages,
                hasDeletedExistingImages,
                remainingExistingImagesCount: remainingExistingImages.length,
                additionalImagesDeleted,
                additionalImagesCount: additionalImages.length,
                shouldDeleteAdditional
            });
            
            console.log("이미지 저장 전 체크:", {
                shouldDeleteMain,
                shouldDeleteAdditional,
                hasMainImage: !!mainImage,
                additionalImagesCount: additionalImages.length,
                existingAdditionalImagesCount: existingAdditionalImages.filter(url => url).length,
                hasDeletedExistingImages,
                mainImageDeleted,
                additionalImagesDeleted,
                existingAdditionalImages: existingAdditionalImages.filter(url => url)
            });
            
            formData.append('deleteMainImage', shouldDeleteMain ? 'true' : 'false');
            formData.append('deleteAdditionalImages', shouldDeleteAdditional ? 'true' : 'false');

            // 유지할 기존 추가 이미지 URL 목록을 함께 전송 (부분 삭제 지원)
            // existingAdditionalImages에는 DB에 저장된 원본 경로가 담겨 있음
            // 새 이미지만 추가하는 경우에도 기존 이미지 URL을 명시적으로 전송하여 유지 보장
            console.log("유지할 기존 추가 이미지 URL 전송:", remainingExistingImages);
            remainingExistingImages.forEach(url => {
                formData.append('remainingAdditionalImageUrls', url);
                console.log("FormData에 추가된 remainingAdditionalImageUrl:", url);
            });
            
            console.log("FormData 전송 값:", {
                deleteMainImage: shouldDeleteMain ? 'true' : 'false',
                deleteAdditionalImages: shouldDeleteAdditional ? 'true' : 'false',
                remainingAdditionalImageUrlsCount: remainingExistingImages.length,
                hasMainImage: !!mainImage,
                additionalImagesCount: additionalImages.length
            });

            // 메인 이미지가 있으면 추가 (새로 업로드된 경우)
            if (mainImage) {
                formData.append('mainImage', mainImage);
            }

            // 추가 이미지가 있으면 추가 (새로 업로드된 경우)
            if (additionalImages.length > 0) {
                additionalImages.forEach(image => {
                    formData.append('additionalImages', image);
                });
            }

            // 이미지 업데이트 API 호출
            const response = await companyAPI.product.updateProductImages(productId, formData);

            console.log("이미지 저장 API 응답:", response.status, response.data);

            // 200 OK 또는 204 No Content 모두 성공으로 처리
            if (response.status === 200 || response.status === 204) {
                // 응답에서 이미지 정보 확인
                if (response.data?.product?.thumbnailImageUrl) {
                    console.log("저장된 이미지 URL:", response.data.product.thumbnailImageUrl);
                }
                
                // 응답에서 추가 이미지 정보 업데이트
                if (response.data?.images?.images) {
                    const updatedImageUrls = response.data.images.images
                        .map(img => img.imageUrl)
                        .filter(url => url);
                    console.log("저장 후 업데이트된 추가 이미지 URL:", updatedImageUrls);
                    setExistingAdditionalImages(updatedImageUrls);
                } else {
                    // 응답에 이미지 정보가 없으면 서버에서 다시 불러오기
                    try {
                        const imageResponse = await userAPI.product.getById(productId);
                        const productImageDTO = imageResponse.data.productImageDTO;
                        if (productImageDTO && productImageDTO.images && productImageDTO.images.length > 0) {
                            const originalImagePaths = productImageDTO.images
                                .map(img => img.imageUrl)
                                .filter(path => path);
                            console.log("서버에서 다시 불러온 추가 이미지 URL:", originalImagePaths);
                            setExistingAdditionalImages(originalImagePaths);
                        } else {
                            setExistingAdditionalImages([]);
                        }
                    } catch (error) {
                        console.error("추가 이미지 정보 다시 불러오기 실패:", error);
                        setExistingAdditionalImages([]);
                    }
                }
                
                toast.success("상품 이미지가 성공적으로 수정되었습니다.");

                // 새로 업로드한 이미지 상태 초기화 (기존 이미지는 위에서 업데이트됨)
                setMainImage(null);
                setAdditionalImages([]);
                setMainImageDeleted(false);
                setAdditionalImagesDeleted(false);
                
                // 상품 목록 새로고침 (다른 정보 변경 반영)
                await fetchProducts();
            } else {
                toast.error(`상품 이미지 수정에 실패했습니다. 상태 코드: ${response.status}`);
            }
        } catch (error) {
            console.error("상품 이미지 수정 실패:", error);
            toast.error(`상품 이미지 수정에 실패했습니다. 오류: ${error.response?.status || error.message}`);
        } finally {
            setSavingImages(false);
        }
    };

    // 단일 저장 버튼으로 모든 정보를 저장하는 함수
    const handleSave = async (productId) => {
        // 저장 시작 시 상태 초기화
        setSavingImages(true);
        
        try {
            // 1. 상품 정보 업데이트
            await handleSaveInfo(productId);

            // 2. 설명 업데이트
            await handleSaveDescription(productId);

            // 3. 이미지가 실제로 변경되었을 때만 이미지 업데이트
            // 메인 이미지 또는 추가 이미지 삭제 플래그가 true이거나, 새 이미지가 업로드된 경우만
            const hasImageChanges = mainImageDeleted || additionalImagesDeleted || mainImage || additionalImages.length > 0;
            
            console.log("이미지 변경 체크:", {
                mainImageDeleted,
                additionalImagesDeleted,
                hasMainImage: !!mainImage,
                additionalImagesCount: additionalImages.length,
                hasImageChanges
            });

            if (hasImageChanges) {
                await handleSaveImages(productId);
            } else {
                console.log("이미지 변경이 없어 이미지 업데이트 API를 호출하지 않습니다.");
                // 이미지 변경이 없어도 목록 새로고침 (다른 정보 변경 반영)
                await fetchProducts();
            }
            
            // 모든 작업 성공 시 토스트 메시지
            toast.success("상품 정보가 성공적으로 저장되었습니다.");

            // 모든 작업이 완료되면 편집 상태 초기화
            resetEditState();
            
            // 편집 모드 종료 (이미 fetchProducts()에서 최신 데이터를 가져왔으므로)
            setEditingProductId(null);
        } catch (error) {
            console.error("상품 수정 실패:", error);
            const errorMessage = error.response?.data?.message || error.message || "상품 수정에 실패했습니다.";
            toast.error(errorMessage);
            // 에러 발생 시에도 편집 상태는 유지 (사용자가 재시도할 수 있도록)
        } finally {
            // 성공/실패 여부와 관계없이 저장 상태 해제
            setSavingImages(false);
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
        setExistingAdditionalImages([]);
        setMainImageDeleted(false);
        setAdditionalImagesDeleted(false);
        setSavingImages(false);
    };

    // 메인 이미지 삭제 처리
    const handleDeleteMainImage = () => {
        setMainImageDeleted(true);
    };

    // 추가 이미지 삭제 처리 (별도 플래그 사용)

    // 메인 이미지 선택 처리
    const handleMainImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // GIF 파일 체크
            if (file.type === 'image/gif') {
                toast.error("GIF 이미지는 업로드할 수 없습니다.");
                e.target.value = ''; // 파일 입력 초기화
                return;
            }
            
            setMainImage(file);
        }
    };

    // 추가 이미지 선택 처리
    const handleAdditionalImagesUpload = (e) => {
        if (e.target.files) {
            // 현재 기존 이미지 개수 확인
            const existingCount = existingAdditionalImages.filter(url => url).length;
            const currentNewCount = additionalImages.length;
            const availableSlots = 5 - existingCount - currentNewCount;
            
            if (availableSlots <= 0) {
                toast.warning("추가 이미지는 최대 5개까지 등록 가능합니다.");
                return;
            }
            
            // GIF 파일 필터링
            const files = Array.from(e.target.files);
            const gifFiles = files.filter(file => file.type === 'image/gif');
            const validFiles = files.filter(file => file.type !== 'image/gif');
            
            if (gifFiles.length > 0) {
                toast.error("GIF 이미지는 업로드할 수 없습니다.");
            }
            
            if (validFiles.length === 0) {
                e.target.value = ''; // 파일 입력 초기화
                return;
            }
            
            // 선택한 파일 중 사용 가능한 개수만큼만 추가
            const selectedFiles = validFiles.slice(0, availableSlots);
            
            // 기존 새 이미지에 추가 (교체가 아닌 추가)
            setAdditionalImages(prev => [...prev, ...selectedFiles]);
            
            // 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
            e.target.value = '';
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

    // 검색어 입력 처리
    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // 엔터 키로 검색 실행
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            setAppliedSearchKeyword(searchKeyword.trim());
        }
    };

    // 전체 보기 (검색 초기화)
    const handleViewAll = () => {
        setSearchKeyword('');
        setAppliedSearchKeyword('');
    };

    // 정렬 옵션 변경 처리
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-0">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-4xl font-bold text-black">상품 관리</h2>
                    <div className="w-full max-w-xs flex-shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="상품명 검색"
                                value={searchKeyword}
                                onChange={handleSearchInputChange}
                                onKeyPress={handleSearchKeyPress}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 정렬 선택 */}
                <div className="flex items-center justify-end gap-2 mb-4">
                    <label className="text-sm font-medium text-gray-700">정렬:</label>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="latest">등록시간순</option>
                        <option value="priceAsc">가격 낮은순</option>
                        <option value="priceDesc">가격 높은순</option>
                    </select>
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
                                className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 py-6"
                            >
                                {/* 이미지 영역 */}
                                <div className="relative w-[104px] h-[104px] flex-shrink-0">
                                    {savingImages && editingProductId === product.id ? (
                                        // 저장 중 로딩 표시
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded border-2 border-gray-300">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : isEditing ? (
                                        // 편집 모드
                                        <div className="relative w-full h-full">
                                            {mainImageUrl ? (
                                                // 새 이미지 미리보기
                                                <>
                                                    <img
                                                        src={mainImageUrl}
                                                        alt="미리보기"
                                                        className="w-full h-full rounded object-cover border-2 border-blue-300"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setMainImage(null);
                                                            URL.revokeObjectURL(mainImageUrl);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
                                                        title="이미지 제거"
                                                    >
                                                        ×
                                                    </button>
                                                </>
                                            ) : mainImageDeleted ? (
                                                // 이미지 삭제됨 - 업로드 영역
                                                <label className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-400 rounded bg-gray-50 hover:bg-gray-100 transition-colors group">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleMainImageUpload}
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    />
                                                    <span className="text-2xl text-gray-400 group-hover:text-gray-600">+</span>
                                                </label>
                                            ) : (
                                                // 기존 이미지 표시 및 삭제 버튼
                                                <>
                                                    <img
                                                        src={product.mainImageUrl 
                                                            ? getImageUrl(product.mainImageUrl) 
                                                            : "https://placehold.co/64x64"}
                                                        alt={product.productName || "상품 이미지"}
                                                        className="w-full h-full rounded object-cover border-2 border-gray-200"
                                                        onError={(e) => {
                                                            console.error("이미지 로드 실패:", product.mainImageUrl);
                                                            e.target.src = "https://placehold.co/80x80";
                                                        }}
                                                    />
                                                    <button
                                                        onClick={handleDeleteMainImage}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
                                                        title="이미지 삭제"
                                                    >
                                                        ×
                                                    </button>
                                                    <label className="absolute inset-0 cursor-pointer rounded opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-20 flex items-center justify-center">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={handleMainImageUpload}
                                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        />
                                                        <span className="text-white text-xs font-medium px-2 py-1 bg-blue-500 rounded">변경</span>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        // 일반 보기 모드
                                        <img
                                            src={product.mainImageUrl 
                                                ? getImageUrl(product.mainImageUrl) 
                                                : "https://placehold.co/64x64"}
                                            alt={product.productName || "상품 이미지"}
                                            className="w-full h-full rounded object-cover border border-gray-200"
                                            onError={(e) => {
                                                console.error("이미지 로드 실패:", product.mainImageUrl);
                                                e.target.src = "https://placehold.co/80x80";
                                            }}
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
                                <div className="flex gap-2 items-center">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(product.id)}
                                                disabled={savingImages}
                                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    savingImages 
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow'
                                                }`}
                                            >
                                                {savingImages ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                                                        저장 중...
                                                    </span>
                                                ) : (
                                                    '저장'
                                                )}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                disabled={savingImages}
                                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    savingImages 
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm hover:shadow'
                                                }`}
                                            >
                                                취소
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="px-4 py-1.5 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow transition-all duration-200"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="px-4 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow transition-all duration-200"
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
                                    <div className="mb-2">
                                        <h3 className="font-semibold">상품 설명</h3>
                                        <p className="text-xs text-gray-500 mt-1">설명은 상단의 '저장' 버튼을 눌러 저장됩니다.</p>
                                    </div>
                                    <textarea
                                        value={editDescription}
                                        onChange={handleDescriptionChange}
                                        className="w-full h-32 p-2 border rounded"
                                        placeholder="상품 설명을 입력하세요"
                                    />
                                </div>
                            )}

                            {/* 추가 이미지 업로드 영역 (편집 모드일 때만 표시) */}
                            {isEditing && (
                                <div className="col-span-7 bg-gray-50 p-4 rounded-md mt-2 mb-4">
                                    <h3 className="font-semibold mb-3 text-gray-800">
                                        추가 이미지 
                                        <span className="text-sm text-gray-500 ml-1">
                                            ({(existingAdditionalImages.filter(url => url).length + additionalImages.length)}/5)
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {(existingAdditionalImages.filter(url => url).length + additionalImages.length) < 5 && (
                                            <label className="cursor-pointer flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-400 rounded bg-white hover:bg-gray-50 transition-colors group">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleAdditionalImagesUpload}
                                                    multiple
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                />
                                                <span className="text-3xl text-gray-400 group-hover:text-gray-600">+</span>
                                            </label>
                                        )}

                                        {/* 기존 등록된 추가 이미지 표시 */}
                                        {existingAdditionalImages.map((imagePath, idx) => {
                                            // 삭제된 이미지는 건너뛰기 (null로 표시)
                                            if (!imagePath) return null;
                                            
                                            return (
                                                <div key={`existing-${idx}`} className="relative group">
                                                    <img
                                                        src={getImageUrl(imagePath)}
                                                        alt={`기존 추가 이미지 ${idx + 1}`}
                                                        className="w-20 h-20 object-cover rounded border-2 border-blue-300"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            // 해당 인덱스의 이미지를 null로 표시하여 삭제 표시
                                                            const newImages = [...existingAdditionalImages];
                                                            newImages[idx] = null;
                                                            setExistingAdditionalImages(newImages);
                                                            setAdditionalImagesDeleted(true); // 추가 이미지 삭제 플래그 설정
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
                                                        title="이미지 제거"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        {/* 새로 선택한 추가 이미지 미리보기 */}
                                        {additionalImages.map((image, idx) => (
                                            <div key={`new-${idx}`} className="relative group">
                                                <img
                                                    src={additionalImageUrls[idx]}
                                                    alt={`새 추가 이미지 ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded border-2 border-green-300"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newImages = [...additionalImages];
                                                        URL.revokeObjectURL(additionalImageUrls[idx]);
                                                        newImages.splice(idx, 1);
                                                        setAdditionalImages(newImages);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
                                                    title="이미지 제거"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {existingAdditionalImages.filter(url => url).length === 0 && additionalImages.length === 0 && (
                                            <p className="text-sm text-gray-500">추가 이미지를 선택하세요 (최대 5개)</p>
                                        )}
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
                    <div className="col-span-7 text-center py-16">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-300 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {appliedSearchKeyword 
                                ? `"${appliedSearchKeyword}" 검색 결과가 없습니다.`
                                : "등록된 상품이 없습니다."}
                        </h3>
                        {appliedSearchKeyword && (
                            <>
                                <p className="text-gray-500 mb-6">
                                    다른 검색어로 시도해보세요.
                                </p>
                                <button
                                    onClick={handleViewAll}
                                    className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-md font-medium hover:bg-emerald-100 transition-colors duration-200"
                                >
                                    전체 상품 보기
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductManagement;