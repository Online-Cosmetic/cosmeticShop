import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/customAxios';
import { getImageUrl } from '../../utils/imageUtils';

function AdminCompanyDetail() {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchCompanyDetail();
    }, [companyId]);

    const fetchCompanyDetail = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.company.getCompanyDetail(companyId);
            setCompany(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch company detail:', err);
            setError('기업 회원 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('이 기업 회원을 승인하시겠습니까?')) {
            return;
        }

        try {
            setProcessing(true);
            await adminAPI.company.approveCompany(companyId);
            alert('기업 회원이 승인되었습니다.');
            navigate('/admin/companies');
        } catch (err) {
            console.error('Failed to approve company:', err);
            alert('승인 처리 중 오류가 발생했습니다.');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm('이 기업 회원 가입을 거절하시겠습니까? 거절된 회원은 삭제됩니다.')) {
            return;
        }

        try {
            setProcessing(true);
            await adminAPI.company.rejectCompany(companyId);
            alert('기업 회원 가입이 거절되었습니다.');
            navigate('/admin/companies');
        } catch (err) {
            console.error('Failed to reject company:', err);
            alert('거절 처리 중 오류가 발생했습니다.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">로딩 중...</div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="p-8">
                <div className="text-red-500 text-center">{error || '기업 회원 정보를 찾을 수 없습니다.'}</div>
                <button
                    onClick={() => navigate('/admin/companies')}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/companies')}
                    className="text-gray-600 hover:text-gray-900 mb-4"
                >
                    ← 목록으로
                </button>
                <h1 className="text-2xl font-bold">기업 회원 상세 정보</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">회사명</label>
                        <p className="mt-1 text-sm text-gray-900">{company.companyName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">아이디</label>
                        <p className="mt-1 text-sm text-gray-900">{company.userId}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">대표자명</label>
                        <p className="mt-1 text-sm text-gray-900">{company.representativeName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
                        <p className="mt-1 text-sm text-gray-900">{company.businessRegistrationNumber}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">업종/업태</label>
                        <p className="mt-1 text-sm text-gray-900">{company.businessType || '-'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">사업장 주소</label>
                        <p className="mt-1 text-sm text-gray-900">{company.businessAddress}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">연락처 정보</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이메일</label>
                        <p className="mt-1 text-sm text-gray-900">{company.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">전화번호</label>
                        <p className="mt-1 text-sm text-gray-900">{company.phoneNumber}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">담당자명</label>
                        <p className="mt-1 text-sm text-gray-900">{company.contactPersonName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">담당자 휴대폰 번호</label>
                        <p className="mt-1 text-sm text-gray-900">{company.contactPhoneNumber}</p>
                    </div>
                </div>
            </div>

            {company.businessLicensePath && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">사업자등록증</h2>
                    <div className="mt-4">
                        <img
                            src={getImageUrl(company.businessLicensePath)}
                            alt="사업자등록증"
                            className="max-w-full h-auto border border-gray-300 rounded-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">가입 정보</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">가입일</label>
                        <p className="mt-1 text-sm text-gray-900">
                            {new Date(company.createdAt).toLocaleString('ko-KR')}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">승인 상태</label>
                        <p className="mt-1 text-sm">
                            <span className={`px-2 py-1 rounded ${company.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {company.approved ? '승인됨' : '승인 대기'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {!company.approved && (
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-400"
                    >
                        승인
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={processing}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                    >
                        거절
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminCompanyDetail;

