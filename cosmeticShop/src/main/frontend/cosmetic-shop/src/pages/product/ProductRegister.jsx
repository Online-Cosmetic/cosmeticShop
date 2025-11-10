import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../utils/customAxios.js';

function ProductRegister() {
  // access token
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  // 기본 단건 등록
  const [formData, setFormData] = useState({
    categoryId: '',
    productName: '',
    description: '',
    price: '',
    stock: ''
  });
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // ZIP 모달 상태
  const [showZipModal, setShowZipModal] = useState(false);
  const openZipModal = () => setShowZipModal(true);
  const closeZipModal = () => setShowZipModal(false);

  // 카테고리
  const categories = [
    { id: 1, name: "Makeup" },
    { id: 2, name: "Skincare" },
    { id: 3, name: "Hair" },
    { id: 4, name: "Body" },
  ];

  // 입력 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드(메인/서브)
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
  const handleFilesUpload = (e, isMain) => {
    const files = Array.from(e.target.files);
    if (isMain) {
      setMainImage(files[0]);
    } else {
      const selected = files.slice(0, 5);
      if (files.length > 5) alert("최대 5장까지 가능합니다.");
      setAdditionalImages(selected);
    }
  };

  // 단건 등록 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (mainImage) data.append('mainImage', mainImage);
    additionalImages.forEach(img => data.append('additionalImages', img));

    try {
      await customAxios.post('/api/products', data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      navigate('/products');
    } catch (err) {
      console.error('상품 등록 실패', err);
      alert('상품 등록에 실패했습니다.');
    }
  };

  return (
    <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
      <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-8">
        <h2 className="text-4xl font-bold text-black">상품 등록</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* 카테고리 */}
          <div className="flex items-center gap-10">
            <label className="w-1/4 text-2xl font-medium">Category</label>
            <div className="w-full relative">
              <button
                type="button"
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

          {/* 메인 이미지 */}
          <div className="flex items-center gap-10">
            <label className="w-1/4 text-2xl font-medium">Main Image</label>
            <input
              type="file"
              onChange={(e) => handleImageUpload(e, true)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-600 file:text-white hover:file:bg-neutral-700 w-full text-sm text-gray-500"
            />
          </div>

          {/* 추가 이미지 */}
          <div className="flex items-center gap-10">
            <label className="w-1/4 text-2xl font-medium">Sub Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e, false)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-600 file:text-white hover:file:bg-neutral-700 w-full text-sm text-gray-500"
            />
          </div>

          {/* Sub Files */}
          <div className="flex items-center gap-10">
            <label className="w-1/4 text-2xl font-medium">Sub Files</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFilesUpload(e, false)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-600 file:text-white hover:file:bg-neutral-700 w-full text-sm text-gray-500"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={openZipModal}
              className="px-6 py-3 bg-neutral-800 text-white rounded-xl text-lg font-semibold"
            >
              ZIP 등록
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-neutral-800 text-white rounded-xl text-lg font-semibold"
            >
              상품 등록
            </button>
          </div>
        </form>
      </div>

      {/* ZIP 업로드 모달 */}
      {showZipModal && (
        <ZipUploadModal
          onClose={closeZipModal}
          token={token}
        />
      )}
    </div>
  );
}

function ZipUploadModal({ onClose, token }) {
  const [zipFile, setZipFile] = useState(null);
  const [zipError, setZipError] = useState('');
  const [zipProgress, setZipProgress] = useState(0);
  const [zipResult, setZipResult] = useState(null);
  const [zipLoading, setZipLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const zipInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isZip = (f) => {
    if (!f) return false;
    const nameOk = f.name.toLowerCase().endsWith('.zip');
    const typeOk = [
      'application/zip',
      'application/x-zip-compressed',
      'multipart/x-zip',
      'application/octet-stream',
    ].includes(f.type) || nameOk;
    return nameOk || typeOk;
  };

  const handleZipPick = () => zipInputRef.current?.click();

  const handleZipChange = (e) => {
    const f = e.target.files?.[0];
    setZipError('');
    setZipResult(null);
    if (!f) return;
    if (!isZip(f)) {
      setZipFile(null);
      setZipError('.zip 만 업로드할 수 있습니다.');
      return;
    }
    setZipFile(f);
  };

  const handleZipDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    setZipError('');
    setZipResult(null);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!isZip(f)) {
      setZipFile(null);
      setZipError('.zip 만 업로드할 수 있습니다.');
      return;
    }
    setZipFile(f);
  };
  const handleZipDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleZipDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };

  const uploadZip = async () => {
    if (!zipFile) {
      setZipError('먼저 .zip 파일을 선택하세요.');
      return;
    }
    setZipLoading(true);
    setZipError('');
    setZipProgress(0);
    setZipResult(null);

    try {
      const form = new FormData();
      form.append('file', zipFile);

      const res = await customAxios.post('/api/products/batch', form, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const p = Math.round((evt.loaded / evt.total) * 100);
          setZipProgress(p);
        },
      });

      const data = res?.data || {};
      setZipResult({
        successfulRegistrations: Number(data.successfulRegistrations ?? 0),
        failedRegistrations: Number(data.failedRegistrations ?? 0),
      });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || '업로드에 실패했습니다.';
      setZipError(msg);
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-[640px] bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">ZIP 등록</h3>
          <button
            className="text-gray-500 hover:text-black"
            aria-label="닫기"
            onClick={onClose}
          >
            ✕
          </button>
    // 로그인 시 저장한 access token을 로컬 스토리지에서 가져옵니다.
    const token = localStorage.getItem('accessToken');
    // console.log('access token:', token);
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
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const categories = [
        { id: 1, name: "Makeup" },
        { id: 2, name: "Skincare" },
        { id: 3, name: "Hair" },
        { id: 4, name: "Body" },
    ];

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
        
        // 필수 필드 검증
        if (!formData.categoryId || !formData.productName || !formData.price || !formData.stock) {
            alert("필수 항목을 모두 입력해주세요. (카테고리, 상품명, 가격, 재고)");
            return;
        }
        
        if (!mainImage) {
            alert("메인 이미지를 등록해주세요.");
            return;
        }
        
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));
        if (mainImage) data.append("mainImage", mainImage);
        additionalImages.forEach(img => data.append("additionalImages", img));

        try {
            await customAxios.post("/api/products", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            alert("상품이 성공적으로 등록되었습니다.");
            navigate("/enterprise/product/manage");
        } catch (err) {
            console.error("상품 등록 실패", err);
            const errorMessage = err.response?.data?.message || err.response?.data || "상품 등록에 실패했습니다. 다시 시도해주세요.";
            alert(errorMessage);
        }
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
        <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-12">
            <h2 className="text-4xl font-bold text-black">상품 등록</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* 카테고리 */}
                <div className="flex items-center gap-10">
                    <label className="w-1/4 text-2xl font-medium">Category</label>
                    <div className="w-full relative">
                        <button
                            type="button"
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

                {/* 메인 이미지 */}
                <div className="flex items-center gap-10">
                    <label className="w-1/4 text-2xl font-medium">Main Image</label>
                    <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-600 file:text-white hover:file:bg-neutral-700 w-full text-sm text-gray-500"
                    />
                </div>

                {/* 추가 이미지 */}
                <div className="flex items-center gap-10">
                    <label className="w-1/4 text-2xl font-medium">Sub Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-600 file:text-white hover:file:bg-neutral-700 w-full text-sm text-gray-500"
                    />
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    className="mt-6 px-6 py-3 bg-neutral-800 text-white rounded-xl text-lg font-semibold self-end"
                >
                    상품 등록
                </button>
            </form>
        </div>
        <p className="text-gray-600 mb-4">csv + image 폴더를 포함한 .zip 1개를 업로드하세요.</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleZipPick}
            className="px-4 py-2 rounded-2xl border shadow-sm hover:bg-gray-50 text-sm font-semibold"
          >
            파일 선택 (.zip)
          </button>
          {zipFile && (
            <span className="text-xs text-gray-600 truncate">
              선택됨: {zipFile.name}
            </span>
          )}
        </div>

        <input
          ref={zipInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          onChange={handleZipChange}
          className="hidden"
        />

        <div
          onDrop={handleZipDrop}
          onDragOver={handleZipDragOver}
          onDragLeave={handleZipDragLeave}
          className={`mt-4 border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
        >
          <p className="text-sm">
            여기로 <b>.zip</b> 파일을 끌어다 놓거나, 위 버튼으로 선택하세요.
          </p>
          <p className="text-xs text-gray-500 mt-1">(csv + image 폴더를 포함한 zip 1개)</p>
        </div>

        <div className="mt-4 flex gap-2 items-center">
          <button
            type="button"
            onClick={uploadZip}
            disabled={zipLoading}
            className="px-4 py-2 rounded-2xl bg-black text-white text-sm font-semibold disabled:opacity-50"
          >
            {zipLoading ? '업로드 중...' : '업로드 실행'}
          </button>
          {zipProgress > 0 && zipLoading && (
            <div className="flex-1 h-2 bg-gray-100 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${zipProgress}%` }} />
            </div>
          )}
        </div>

        {zipError && <div className="mt-3 text-red-600 text-sm">{zipError}</div>}
        {zipResult && (
          <div className="mt-4 border rounded-2xl p-4 bg-gray-50">
            <div className="text-sm font-bold mb-2">등록 결과</div>
            <div className="text-sm">성공: {zipResult.successfulRegistrations}</div>
            <div className="text-sm">실패: {zipResult.failedRegistrations}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductRegister;
