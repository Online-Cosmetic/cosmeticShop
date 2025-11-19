import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../utils/customAxios";
import Footer from "../../components/common/Footer.jsx";

function EnterpriseSignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userId: "",
        password: "",
        passwordConfirm: "",
        companyName: "",
        email: "",
        phoneNumber: "",
        businessRegistrationNumber: "",
        representativeName: "",
        businessType: "",
        businessAddress: "",
        contactPersonName: "",
        contactPhoneNumber: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // 오류가 발생한 필드를 시각적으로 표시
    const [errorFields, setErrorFields] = useState([]);
    // 사업자등록증 파일
    const [businessLicenseFile, setBusinessLicenseFile] = useState(null);
    const [businessLicensePreview, setBusinessLicensePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
        
        // 해당 필드의 오류 하이라이트 제거
        if (errorFields.includes(name)) {
            setErrorFields(prev => prev.filter(field => field !== name));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 검증 (10MB 제한)
            if (file.size > 10 * 1024 * 1024) {
                setError("파일 크기는 10MB 이하여야 합니다.");
                return;
            }
            // 파일 타입 검증 (이미지 파일만)
            if (!file.type.startsWith('image/')) {
                setError("이미지 파일만 업로드 가능합니다.");
                return;
            }
            setBusinessLicenseFile(file);
            setBusinessLicensePreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleRemoveFile = () => {
        if (businessLicensePreview) {
            URL.revokeObjectURL(businessLicensePreview);
        }
        setBusinessLicenseFile(null);
        setBusinessLicensePreview(null);
    };

    // 컴포넌트 언마운트 시 URL 정리
    useEffect(() => {
        return () => {
            if (businessLicensePreview) {
                URL.revokeObjectURL(businessLicensePreview);
            }
        };
    }, [businessLicensePreview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setErrorFields([]);

        // 비밀번호 일치 검증
        if (form.password !== form.passwordConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            highlightField("password");
            highlightField("passwordConfirm");
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 사업자등록증 파일 검증
        if (!businessLicenseFile) {
            setError("사업자등록증 파일을 업로드해주세요.");
            highlightField("businessLicense");
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            // FormData 생성
            const formData = new FormData();
            formData.append('userId', form.userId);
            formData.append('password', form.password);
            formData.append('companyName', form.companyName);
            formData.append('email', form.email);
            formData.append('phoneNumber', form.phoneNumber);
            formData.append('businessRegistrationNumber', form.businessRegistrationNumber);
            formData.append('representativeName', form.representativeName);
            formData.append('businessType', form.businessType || '');
            formData.append('businessAddress', form.businessAddress);
            formData.append('contactPersonName', form.contactPersonName);
            formData.append('contactPhoneNumber', form.contactPhoneNumber);
            formData.append('businessLicense', businessLicenseFile);

            // FormData로 회원가입 요청
            await authAPI.signup.company(formData);

            // 회원가입 성공 시 감사 페이지로 이동
            navigate("/thanks-for-enterprise-signup");
        } catch (err) {
            console.error("회원가입 오류:", err);

            // 백엔드에서 전송된 오류 메시지 확인
            if (err.response && err.response.data) {
                // 백엔드에서 반환된 오류 메시지가 문자열인 경우 직접 사용
                const errorMessage = err.response.data;
                
                // 특정 오류 메시지에 따라 필드 하이라이트
                if (errorMessage.includes("아이디")) {
                    highlightField("userId");
                } else if (errorMessage.includes("전화번호")) {
                    highlightField("phoneNumber");
                } else if (errorMessage.includes("이메일")) {
                    highlightField("email");
                } else if (errorMessage.includes("회사")) {
                    highlightField("companyName");
                } else if (errorMessage.includes("사업자등록번호")) {
                    highlightField("businessRegistrationNumber");
                }
                
                setError(errorMessage);
            } else if (err.message === "Network Error") {
                setError("네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인해주세요.");
            } else {
                setError("회원가입에 실패했습니다. 입력 정보를 확인하거나 잠시 후 다시 시도해주세요.");
            }
            // 에러 발생 시 스크롤을 맨 위로 이동
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };
    
    // 필드 하이라이트 함수
    const highlightField = (fieldName) => {
        setErrorFields(prev => [...prev, fieldName]);
        // 3초 후 하이라이트 제거
        setTimeout(() => {
            setErrorFields(prev => prev.filter(field => field !== fieldName));
        }, 3000);
    };
    
    // 입력 필드 클래스 결정 함수
    const getFieldClass = (fieldName) => {
        const baseClass = "w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2";
        if (errorFields.includes(fieldName)) {
            return `${baseClass} border-red-500 focus:ring-red-400 animate-pulse`;
        }
        return `${baseClass} focus:ring-emerald-400`;
    };

    return (
        <>
            <header className="w-full border-b border-neutral-200">
                <div className="max-w-screen-xl px-12 py-4 flex items-center justify-between">
                    <Link to="/company/dashboard" className="text-2xl text-black">
                        cosMall Enterprise
                    </Link>
                </div>
            </header>
            <div className="flex justify-center items-center bg-gray-100 py-6">
                <div className="w-[900px] bg-white rounded-[30px] my-8 px-8 py-16 shadow-md">
                    {/* 헤더 */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-semibold text-gray-900">Sign Up</h1>
                        <p className="text-xl text-slate-700 mt-4">
                            Your seller journey starts here.
                        </p>
                    </div>

                    {/* 오류 메시지 표시 섹션 - 상단에 배치 */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-600 font-medium">회원가입 실패</span>
                            </div>
                            <p className="text-red-500 mt-1 ml-7">{error}</p>
                        </div>
                    )}

                    {/* 회원가입 폼 */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* 기본 계정 정보 */}
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 계정 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">ID <span className="text-red-500">*</span></label>
                                    <input
                                        name="userId"
                                        value={form.userId}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="User ID"
                                        className={getFieldClass("userId")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="At least 8 characters"
                                        className={getFieldClass("password")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Password Confirm <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="passwordConfirm"
                                        value={form.passwordConfirm}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="Confirm your password"
                                        className={getFieldClass("passwordConfirm")}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 기업 정보 */}
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">기업 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="companyName"
                                        value={form.companyName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="ex) CosMall Co."
                                        className={getFieldClass("companyName")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Business Registration Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="businessRegistrationNumber"
                                        value={form.businessRegistrationNumber}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="123-45-67890"
                                        className={getFieldClass("businessRegistrationNumber")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Representative Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="representativeName"
                                        value={form.representativeName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="대표자명"
                                        className={getFieldClass("representativeName")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Business Type
                                    </label>
                                    <input
                                        name="businessType"
                                        value={form.businessType}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="업종/업태 (예: 도매 및 소매업)"
                                        className={getFieldClass("businessType")}
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Business Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="businessAddress"
                                        value={form.businessAddress}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="사업장 주소"
                                        className={getFieldClass("businessAddress")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Business License <span className="text-red-500">*</span>
                                    </label>
                                    {businessLicensePreview ? (
                                        <div className="relative">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={businessLicensePreview}
                                                    alt="사업자등록증 미리보기"
                                                    className="w-32 h-32 object-cover border-2 border-gray-300 rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {businessLicenseFile?.name}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveFile}
                                                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                                    >
                                                        파일 제거
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                name="businessLicense"
                                            />
                                            <div className="text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    클릭하여 사업자등록증 업로드
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    (JPG, PNG, WEBP, 최대 10MB)
                                                </p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 연락처 정보 */}
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">연락처 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Business Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="example@email.com"
                                        className={getFieldClass("email")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Business Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="phoneNumber"
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="02-123-4567 or 010-1234-5678"
                                        className={getFieldClass("phoneNumber")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Contact Person Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="contactPersonName"
                                        value={form.contactPersonName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="담당자명"
                                        className={getFieldClass("contactPersonName")}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-900 text-sm block mb-2">
                                        Contact Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="contactPhoneNumber"
                                        value={form.contactPhoneNumber}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="010-1234-5678"
                                        className={getFieldClass("contactPhoneNumber")}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 bg-emerald-500 text-white text-lg font-medium rounded-xl hover:bg-emerald-600"
                            disabled={loading}
                        >
                            {loading ? "처리 중..." : "Sign Up"}
                        </button>

                        <div className="text-right mt-10">
                            <span className="text-slate-700 mr-1">Already have an account?</span>
                            <Link
                                to="/enterprise/login"
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            {/* 푸터 */}
            <Footer/>
        </>
    );
}

export default EnterpriseSignUp;