import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/customAxios';

function AdminCompanyManagement() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Reset to first page when filter or search term changes
    useEffect(() => {
        setCurrentPage(0);
    }, [filter, searchTerm]);

    // Fetch company data
    useEffect(() => {
        fetchCompanies();
    }, [currentPage, filter, searchTerm]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError('');
            let approved = null;
            if (filter === 'pending') {
                approved = false;
            } else if (filter === 'approved') {
                approved = true;
            }
            
            const response = await adminAPI.company.getAllCompanies(approved, searchTerm, currentPage, pageSize);
            const pageData = response.data;
            
            if (pageData && typeof pageData === 'object') {
                const content = Array.isArray(pageData.content) ? pageData.content : [];
                
                // API 응답 구조: { content: [...], page: { totalElements: 4, totalPages: 1, ... } }
                const pageInfo = pageData.page || {};
                
                const totalElementsValue = typeof pageInfo.totalElements === 'number' 
                    ? pageInfo.totalElements 
                    : (typeof pageInfo.totalElements === 'string' 
                        ? parseInt(pageInfo.totalElements, 10) || 0 
                        : (typeof pageData.totalElements === 'number'
                            ? pageData.totalElements
                            : 0));
                        
                const totalPagesValue = typeof pageInfo.totalPages === 'number'
                    ? pageInfo.totalPages
                    : (typeof pageInfo.totalPages === 'string'
                        ? parseInt(pageInfo.totalPages, 10) || 0
                        : (typeof pageData.totalPages === 'number'
                            ? pageData.totalPages
                            : 0));
                
                setCompanies(content);
                setTotalPages(totalPagesValue);
                setTotalElements(totalElementsValue);
            } else {
                setCompanies([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (err) {
            console.error('Failed to fetch companies:', err);
            const errorMessage = err.response?.data?.message || err.message || '기업 회원 목록을 불러오는데 실패했습니다.';
            setError(errorMessage);
            setCompanies([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };


    const handleApprove = async (companyId, e) => {
        e.stopPropagation();
        if (!window.confirm('이 기업 회원을 승인하시겠습니까?')) {
            return;
        }

        try {
            await adminAPI.company.approveCompany(companyId);
            alert('기업 회원이 승인되었습니다.');
            fetchCompanies(); // 목록 새로고침
        } catch (err) {
            console.error('Failed to approve company:', err);
            alert('승인 처리 중 오류가 발생했습니다.');
        }
    };

    const handleReject = async (companyId, e) => {
        e.stopPropagation();
        if (!window.confirm('이 기업 회원 가입을 거절하시겠습니까? 거절된 회원은 삭제됩니다.')) {
            return;
        }

        try {
            await adminAPI.company.rejectCompany(companyId);
            alert('기업 회원 가입이 거절되었습니다.');
            fetchCompanies(); // 목록 새로고침
        } catch (err) {
            console.error('Failed to reject company:', err);
            alert('거절 처리 중 오류가 발생했습니다.');
        }
    };

    const handleViewDetail = (companyId) => {
        navigate(`/admin/companies/${companyId}`);
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-2">
                {/* 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">기업 회원 관리</h2>
                    <div className="text-sm text-gray-500">
                        총 {totalElements}개
                    </div>
                </div>

                {/* 필터 및 검색 */}
                <div className="flex justify-between items-center mt-4 gap-4">
                    {/* 승인 상태 필터 */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                filter === 'all'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                filter === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            승인 대기
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                filter === 'approved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            승인 완료
                        </button>
                    </div>

                    {/* 검색 */}
                    <div className="w-full max-w-md flex-shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="회사명, 대표자명, 사업자등록번호, 이메일을 검색하세요"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 목록 */}
                {loading ? (
                    <div className="w-full py-8 text-center text-gray-500 mt-4">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center mt-4">{error}</div>
                ) : companies.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 mt-4">
                        {searchTerm 
                            ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
                            : filter === 'pending' 
                            ? '승인 대기 중인 기업 회원이 없습니다.'
                            : filter === 'approved'
                            ? '승인된 기업 회원이 없습니다.'
                            : '기업 회원이 없습니다.'}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
                        <table className="w-full divide-y divide-gray-200" style={{ tableLayout: 'fixed' }}>
                            <colgroup>
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '13%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '22%' }} />
                                <col style={{ width: '13%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                            </colgroup>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        회사명
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        대표자명
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        사업자등록번호
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        이메일
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        가입일
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        승인 상태
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        작업
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {companies.map((company) => (
                                    <tr 
                                        key={company.id} 
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleViewDetail(company.id)}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate">
                                            {company.companyName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 truncate">
                                            {company.representativeName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 truncate">
                                            {company.businessRegistrationNumber}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 truncate">
                                            {company.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(company.createdAt).toLocaleDateString('ko-KR')}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded ${
                                                company.approved 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {company.approved ? '승인됨' : '승인 대기'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex gap-2">
                                                {!company.approved && (
                                                    <>
                                                        <button
                                                            onClick={(e) => handleApprove(company.id, e)}
                                                            className="text-emerald-600 hover:text-emerald-900 font-medium"
                                                        >
                                                            승인
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleReject(company.id, e)}
                                                            className="text-red-600 hover:text-red-900 font-medium"
                                                        >
                                                            거절
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 페이지네이션 */}
                {!loading && totalPages > 0 && (
                    <div className="flex justify-center items-center gap-5 mt-4">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                            className={`text-2xl ${currentPage === 0 ? 'text-gray-300' : 'text-neutral-600'} rotate-180`}
                        >
                            ▶
                        </button>
                        <div className="text-lg">
                            Page {currentPage + 1} of {totalPages}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage >= totalPages - 1}
                            className={`text-2xl ${currentPage >= totalPages - 1 ? 'text-gray-300' : 'text-neutral-600'}`}
                        >
                            ▶
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminCompanyManagement;

