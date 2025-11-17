// src/pages/admin/AdminUserDetail.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI } from "../../utils/customAxios";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUtils";

export default function AdminUserDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        username: '',
        age: ''
    });
    const [nicknameError, setNicknameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'orders', 'reviews'

    useEffect(() => {
        fetchUserDetail();
        fetchUserOrders();
        fetchUserReviews();
    }, [id]);

    const fetchUserDetail = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.user.getUserDetail(id);
            setUser(response.data);
            setFormData({
                nickname: response.data.nickname || '',
                email: response.data.email || '',
                username: response.data.username || '',
                age: response.data.age || ''
            });
        } catch (error) {
            console.error("Error fetching user detail:", error);
            toast.error("사용자 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 에러 메시지 초기화
        if (name === 'nickname') {
            setNicknameError('');
        } else if (name === 'email') {
            setEmailError('');
        }
    };

    const handleSave = async () => {
        // 에러 메시지 초기화
        setNicknameError('');
        setEmailError('');

        try {
            const updateData = {
                nickname: formData.nickname || null,
                email: formData.email || null,
                username: formData.username || null,
                age: formData.age ? parseInt(formData.age) : null
            };

            await adminAPI.user.updateUser(id, updateData);
            toast.success("사용자 정보가 수정되었습니다.");
            setEditing(false);
            fetchUserDetail(); // Refresh data
        } catch (error) {
            console.error("Error updating user:", error);
            // 백엔드에서 문자열로 반환하는 경우와 객체로 반환하는 경우 모두 처리
            let errorMessage = "사용자 정보 수정에 실패했습니다.";
            
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            }
            
            // 닉네임 중복 에러 체크
            if (errorMessage.includes("닉네임") || errorMessage.includes("nickname")) {
                setNicknameError("이미 사용 중인 닉네임입니다.");
                toast.error("이미 사용 중인 닉네임입니다.");
            } 
            // 이메일 중복 에러 체크
            else if (errorMessage.includes("이메일") || errorMessage.includes("email")) {
                setEmailError("이미 사용 중인 이메일입니다.");
                toast.error("이미 사용 중인 이메일입니다.");
            } 
            else {
                toast.error(errorMessage);
            }
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setNicknameError('');
        setEmailError('');
        if (user) {
            setFormData({
                nickname: user.nickname || '',
                email: user.email || '',
                username: user.username || '',
                age: user.age || ''
            });
        }
    };

    const fetchUserOrders = async () => {
        setOrdersLoading(true);
        try {
            const response = await adminAPI.user.getUserOrders(id);
            setOrders(response.data || []);
        } catch (error) {
            const errorMessage = error.response?.data?.error 
                || error.response?.data?.message 
                || error.message 
                || "알 수 없는 오류가 발생했습니다.";
            toast.error("주문 내역을 불러오는데 실패했습니다: " + errorMessage);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchUserReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await adminAPI.user.getUserReviews(id);
            setReviews(response.data || []);
        } catch (error) {
            console.error("Error fetching user reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    // 날짜 포맷 함수
    const formatDate = (iso) => {
        if (!iso) return '-';
        const date = new Date(iso);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // 가격 포맷 함수
    const formatPrice = (price) => {
        return price?.toLocaleString() || '0';
    };

    // 주소 포맷 함수
    const formatAddress = (order) => {
        if (!order) return '주소 정보 없음';
        const { city, street, detail } = order;
        if (!city && !street && !detail) return '주소 정보 없음';
        return `${city || ''} ${street || ''} ${detail || ''}`;
    };

    if (loading) {
        return (
            <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
                <div className="text-red-500">사용자를 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
                {/* 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">사용자 상세 정보</h2>
                    <div className="flex gap-2">
                        {!editing ? (
                            <>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => navigate('/admin/users')}
                                    className="px-4 py-2 bg-gray-200 text-neutral-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    목록으로
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-200 text-neutral-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    취소
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 사용자 정보 */}
                <div className="grid grid-cols-2 gap-6">
                    {/* 기본 정보 */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral-800 border-b pb-2">기본 정보</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                {user.id}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                {user.userId}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                            {editing ? (
                                <div>
                                    <input
                                        type="text"
                                        name="nickname"
                                        value={formData.nickname}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                            nicknameError 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'focus:ring-emerald-500'
                                        }`}
                                    />
                                    {nicknameError && (
                                        <p className="mt-1 text-sm text-red-500">{nicknameError}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                    {user.nickname || '-'}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                            {editing ? (
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                            emailError 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'focus:ring-emerald-500'
                                        }`}
                                    />
                                    {emailError && (
                                        <p className="mt-1 text-sm text-red-500">{emailError}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                    {user.email || '-'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 추가 정보 */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-neutral-800 border-b pb-2">추가 정보</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            ) : (
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                    {user.username || '-'}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                            {editing ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="150"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            ) : (
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                    {user.age || '-'}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                {user.gender === 'MALE' ? '남성' : user.gender === 'FEMALE' ? '여성' : user.gender || '-'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">소셜 로그인</label>
                            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                {user.provider || '일반 가입'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                                {formatDate(user.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 탭 메뉴 */}
                <div className="mt-8 border-b border-gray-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'info'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            기본 정보
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'orders'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            주문 내역 ({orders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'reviews'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            작성 리뷰 ({reviews.length})
                        </button>
                    </div>
                </div>

                {/* 탭 컨텐츠 */}
                {activeTab === 'orders' && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-neutral-800 mb-4">주문 내역</h3>
                        {ordersLoading ? (
                            <div className="text-center py-8 text-gray-500">주문 내역을 불러오는 중...</div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                주문 내역이 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, orderIndex) => (
                                    <div key={order.orderId || orderIndex} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="mb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        <strong>주문 ID:</strong> {order.orderId}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        <strong>주문일:</strong> {formatDate(order.createdAt)}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-1">
                                                        <strong>주소:</strong> {formatAddress(order)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-semibold text-emerald-600">
                                                        총 {formatPrice(order.totalPrice)}원
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {order.orderItems && order.orderItems.length > 0 && (
                                            <div className="space-y-2">
                                                {order.orderItems.map((item) => (
                                                    <div key={item.orderItemId} className="bg-white p-3 rounded border">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="font-medium">{item.productName || '상품명 없음'}</div>
                                                                <div className="text-sm text-gray-600 mt-1">
                                                                    수량: {item.quantity}개 | 
                                                                    가격: {formatPrice(item.price)}원
                                                                </div>
                                                                <div className="text-sm mt-1">
                                                                    <span className={`px-2 py-1 rounded ${
                                                                        item.deliveryStatus === 'COMP' ? 'bg-emerald-100 text-emerald-800' :
                                                                        item.deliveryStatus === 'PROG' ? 'bg-blue-100 text-blue-800' :
                                                                        item.deliveryStatus === 'READY' ? 'bg-orange-100 text-orange-800' :
                                                                        item.deliveryStatus === 'CANC' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {item.deliveryStatus === 'COMP' ? '배송완료' :
                                                                         item.deliveryStatus === 'PROG' ? '배송중' :
                                                                         item.deliveryStatus === 'READY' ? '배송준비중' :
                                                                         item.deliveryStatus === 'CANC' ? '주문취소' :
                                                                         '상태 미정'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-neutral-800 mb-4">작성 리뷰</h3>
                        {reviewsLoading ? (
                            <div className="text-center py-8 text-gray-500">리뷰를 불러오는 중...</div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                작성한 리뷰가 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-start gap-4">
                                            {review.product?.thumbnailImageUrl && (
                                                <img
                                                    src={getImageUrl(review.product.thumbnailImageUrl)}
                                                    alt={review.product.productName}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/80x80.png?text=No+Image";
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-semibold text-lg mb-1">
                                                    {review.product?.productName || '상품명 없음'}
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i}>
                                                                {i < review.rating ? '★' : '☆'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(review.createdAt)}
                                                    </span>
                                                </div>
                                                {review.reviewImages && review.reviewImages.length > 0 && (
                                                    <div className="flex gap-2 mb-2 overflow-x-auto">
                                                        {review.reviewImages.map((image, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={getImageUrl(image.imageUrl)}
                                                                alt={`리뷰 이미지 ${idx + 1}`}
                                                                className="w-16 h-16 object-cover rounded flex-shrink-0"
                                                                onError={(e) => {
                                                                    e.target.src = "https://via.placeholder.com/64x64.png?text=No+Image";
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-gray-700 mt-2">{review.content}</p>
                                                {review.liked > 0 && (
                                                    <div className="text-sm text-gray-500 mt-2">
                                                        <span className="font-medium text-emerald-600">{review.liked}</span>명이 이 리뷰를 좋아합니다
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

