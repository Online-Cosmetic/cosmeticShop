import axios from 'axios';
import mitt from 'mitt';

export const emitter = mitt();

const customAxios = axios.create({
    baseURL: 'http://localhost:9000',
    withCredentials: true,
    // 리다이렉트 방지
    maxRedirects: 0,
    // 추가: 명시적인 Content-Type 헤더 설정
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터에 중복 요청 방지 로직 추가
customAxios.interceptors.request.use(
    config => {
        // FormData 객체인 경우 Content-Type 헤더 제거 (브라우저가 자동으로 multipart/form-data 설정)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        if (config.url?.includes('/api/auth/reissue')) return config;
        const token = localStorage.getItem('accessToken');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// customAxios.js 파일의 인터셉터 부분
customAxios.interceptors.response.use(
    response => {
        return response;
    },
    async err => {
        // err.config이 존재하는지 확인하는 안전 장치 추가
        if (!err.config) {
            console.error('에러 처리 중 config 객체가 없습니다:', err);
            return Promise.reject(err);
        }

        const orig = err.config;

        // URL이 undefined인지 확인하는 안전 장치 추가
        if (!orig.url) {
            console.error('에러 처리 중 URL이 없습니다:', err);
            return Promise.reject(err);
        }

        /* /api/auth/me 실패에 대해 재발급 로직을 트리거하지 않도록 스킵 */
        if (orig.url.includes('/api/auth/me')) {
            return Promise.reject(err);
        }

        if (orig.url.includes('/api/auth/reissue') || orig._retry) {
            return Promise.reject(err);
        }

        if (err.response?.status === 401 &&
            !orig.url.includes('/api/auth/reissue') &&
            !orig._retry
        ) {
            orig._retry = true;
            try {
                const { data } = await customAxios.post('/api/auth/reissue', {});
                localStorage.setItem('accessToken', data.accessToken);
                orig.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return customAxios(orig);
            } catch (refreshErr) {
                // 인터셉터 안에서 직접 리다이렉트 하지 말고, App 에 이벤트 전달
                emitter.emit('logout');
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(err);
    }
);


// 인증 상태 변경 이벤트를 전역으로 발행하는 헬퍼 함수 추가
export const authEvents = {
    login: (userData) => {
        emitter.emit('auth:login', userData);
    },
    logout: () => {
        emitter.emit('auth:logout');
    }
};


// API 요청 함수들
export const authAPI = {
    login: async (credentials) => {
        const response = await customAxios.post('/api/auth/login', credentials);
        if (response.data.accessToken) {
            // 로그인 성공 시 이벤트 발행
            authEvents.login(response.data);
        }
        return response;
    },
    logout: async () => {
        const response = await customAxios.post('/api/auth/logout');
        // 로그아웃 성공 시 이벤트 발행
        authEvents.logout();
        return response;
    },
    signup: {
        user: (data) => customAxios.post('/api/auth/signup/user', data),
        company: (data) => customAxios.post('/api/auth/signup/company', data)
    },
    me: () => customAxios.get('/api/auth/me'),
    refresh: () => customAxios.post('/api/auth/reissue')
};

export const userAPI = {
    profile: {
        getProfile: () => customAxios.get('/api/user/profile'),
        updateProfile: (data) => customAxios.put('/api/user/profile', data),
        checkUser: (data) => customAxios.post('/api/user/check', data),
        sendCode: (data) => customAxios.post('/api/user/send-code', data),
        verifyCode: (data) => customAxios.post('/api/user/verify-code', data),
        changePassword: (data) => customAxios.post('/api/user/change-password', data),
        changeNickname: (data) => customAxios.post('/api/user/me/nickName', data)
    },

    cart: {
        getAllCarts: () => customAxios.get('/api/carts'),
        getSelectedCarts: (cartIds) => customAxios.post('/api/carts/selected', cartIds),
        addToCart: (productId, quantity) => customAxios.post('/api/carts', { productId, quantity }),
        removeFromCart: (productId) => customAxios.delete(`/api/carts/${productId}`),
        updateQuantity: (cartId, quantity) => customAxios.put(`/api/carts/${cartId}`, null, {
            params: { quantity }
        }),
    },

    addresses: {
        getAll: () => customAxios.get('/api/addresses'),
        add: (addressData) => customAxios.post('/api/addresses', addressData),
        update: (addressId, addressData) => customAxios.put(`/api/addresses/${addressId}`, addressData),
        delete: (addressId) => customAxios.delete(`/api/addresses/${addressId}`),
        setDefault: (addressId) => customAxios.put(`/api/addresses/${addressId}/default`)
    },

    product: {
        getAll: () => customAxios.get('/api/products'),
        getById: (id) => customAxios.get(`/api/products/${id}`),
        search: (query) => customAxios.get('/api/products/search', {params: {query}}),
        // 추가: 최신순으로 전체 상품 조회
        getLatest: () => customAxios.get('/api/products/batch/latest'),
        // 추가: 인기순(좋아요 순)으로 전체 상품 조회
        getPopular: () => customAxios.get('/api/products/batch/popular'),
        // 추가: 카테고리별 상품 조회
        getByCategory: (categoryName) => {
            // 카테고리 이름을 카테고리 ID로 변환
            const categoryMap = {
                // 전체 상품은 CategoryID 0으로 가정
                'all': 0, 'makeup': 1, 'skincare': 2, 'hair': 3, 'body': 4
            };
            const categoryId = categoryMap[categoryName.toLowerCase()] || 0;
            return customAxios.get(`/api/products/batch/${categoryId}`);
        },
        // 상품 좋아요 관련 API
        likes: {
            // 좋아요한 상품 목록 조회
            getLikedProducts: () => customAxios.get('/api/products/likes'),
            // 상품 좋아요 토글 (좋아요 추가/삭제)
            toggleLike: (productId) => customAxios.post(`/api/products/${productId}/likes/toggle`)
        }
    },

    order: {
        getSingleOrderDetail: (orderId) => customAxios.get(`/api/orders/${orderId}`),
        createOrder: (orderRequest) => customAxios.post('/api/orders', orderRequest),
        createOrders: (orderBatchRequest) => customAxios.post('/api/orders/batch', orderBatchRequest),
        getMyOrders: () => customAxios.get('/api/orders/my'),
        getMyOrdersByDeliveryStatus: () => customAxios.get(`/api/orders/my/${deliveryStatus}`),
    },

    qna: {
        // 내 QnA 목록 조회
        getMyQnas: () => customAxios.get('/api/qnas/me'),

        // 전체 QnA 목록 조회
        getAllQnas: () => customAxios.get('/api/qnas/all'),

        // 사용자 닉네임으로 QnA 검색
        searchByUser: (nickname) => customAxios.get(`/api/qnas/search/user`, {
            params: { nickname }
        }),

        // 제목으로 QnA 검색
        searchByTitle: (title) => customAxios.get(`/api/qnas/search/title`, {
            params: { title }
        }),
        searchMyQnasByTitle: (title) => customAxios.get('/api/qnas/me/search/title', { params: { title } }),

        // QnA 상세 정보 조회
        getDetail: (qnaId) => customAxios.get(`/api/qnas/detail/${qnaId}`),

        // QnA 작성
        create: (qnaData) => customAxios.post('/api/qnas', qnaData),

        // QnA 수정
        update: (qnaId, qnaData) => customAxios.put(`/api/qnas/${qnaId}`, qnaData),

        // QnA 답변 작성
        updateAnswer: (qnaId, answer) => customAxios.put(`/api/qnas/${qnaId}/answers`, null, {
            params: { answer }
        }),

        // QnA 삭제
        delete: (qnaId) => customAxios.delete(`/api/qnas/${qnaId}`)
    },

    payment: {
        // 결제 요청 생성
        createPayment: (paymentData) => customAxios.post('/api/payments', paymentData),

        // 결제 상태 확인
        getPaymentStatus: (orderId) => customAxios.get(`/api/payments/${orderId}`),

        // 결제 완료 처리
        completePayment: (paymentId, data) => customAxios.post(`/api/payments/${paymentId}/complete`, data),

        // 결제 취소
        cancelPayment: (paymentId, reason) => customAxios.post(`/api/payments/${paymentId}/cancel`, {reason}),

        // 결제 내역 조회
        getPaymentHistory: () => customAxios.get('/api/payments/history'),

        // 카드 결제
        processCardPayment: (paymentData) => customAxios.post('/api/payments/card', paymentData),

        // 계좌이체
        processBankTransfer: (paymentData) => customAxios.post('/api/payments/bank-transfer', paymentData),

        // 간편결제 (카카오페이)
        processKakaoPay: (paymentData) => customAxios.post('/api/payments/kakao-pay', paymentData),

        // 간편결제 (KG이니시스)
        processKGinisis: (paymentData) => customAxios.post('/api/payments/kginisis', paymentData)
    },

    review: {
        getProductReviews: (productId) => customAxios.get('/api/reviews', {
            params: { productId }
        }),
        getMyProductReviews: (productId) => customAxios.get('/api/reviews/me', {
            params: productId ? { productId } : {}
        }),
        createReview: (reviewData) => customAxios.post('/api/reviews', reviewData),
        updateReview: (reviewId, reviewData) => customAxios.put(`/api/reviews/${reviewId}`, reviewData),
        deleteReview: (reviewId) => customAxios.delete(`/api/reviews/${reviewId}`),
        toggleLike: (reviewId) => customAxios.post(`/api/reviews/${reviewId}/likes/toggle`),
        uploadImages: (formData) => customAxios.post('/api/reviews/images', formData),
        checkPurchased: (productId) => customAxios.get(`/api/reviews/check-purchased/${productId}`),
        checkReviewed: (productId) => customAxios.get(`/api/reviews/check-reviewed/${productId}`)
    }
};

export const companyAPI = {
    profile: {
        getProfile: () => customAxios.get('/api/company/profile'),
        updateProfile: (data) => customAxios.put('/api/company/profile', data),
    },

    product: {
        // 회사 제품 목록 조회 (페이징)
        getProducts: (page = 0, size = 10) =>
            customAxios.get(`/api/company/products`, { params: { page, size }}),

        // 상품 정보 업데이트 (JSON)
        updateProduct: (productId, data) => {
            return customAxios.put(`/api/products/${productId}`, data);
        },

        // 상품 설명만 업데이트
        updateProductDescription: (productId, description) => {
            return customAxios.patch(`/api/products/${productId}/description`, { description });
        },

        // 이미지만 업데이트하는 개선된 함수
        updateProductImages: (productId, formData) => {
            return customAxios.put(`/api/products/${productId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        },

        // 제품 삭제
        deleteProduct: (productId) =>
            customAxios.delete(`/api/products/${productId}`),

        // 새로 추가하는 API 함수들
        getWeeklySalesData: (companyName) => customAxios.get(`/api/payments/statistics/weekly/${companyName}`),
        getTopProducts: (companyName) => customAxios.get(`/api/payments/statistics/top-products/${companyName}`),
        getTransactions: (companyName, page, size) => customAxios.get(`/api/payments/transactions/${companyName}`, {
            params: {page, size}
        })
    },

    order: {
        getCompanyOrderItems: (companyName) => customAxios.get(`/api/orders/company/${companyName}`),
        updateDeliveryStatus: (orderItemId, statusData) => customAxios.patch(`/api/orders/${orderItemId}`, statusData),
    }
};

export default customAxios;