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

// 요청 인터셉터 수정
customAxios.interceptors.request.use(config => {
    if (config.url?.includes('/api/auth/reissue')) return config;
    const token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

// 응답 인터셉터: 401이면 한 번만 reissue 시도
customAxios.interceptors.response.use(
    res => {
        return res;
    },
    async err => {
        // CORS 오류 확인 및 로깅
        if (err.message && err.message.includes('Network Error')) {
            console.error('CORS 또는 네트워크 오류:', err);
            // 로그인/로그아웃 관련 요청이면 오류 메시지를 더 명확하게 제공
            if (err.config?.url?.includes('/api/auth/')) {
                console.error('인증 관련 요청 실패. 서버에 CORS 설정이 필요할 수 있습니다.');
            }
        }

        const orig = err.config;

        /* /api/auth/me 실패에 대해 재발급 로직을 트리거하지 않도록 스킵 */
        if (orig.url?.includes('/api/auth/me')) {
            return Promise.reject(err);
        }
        if (orig.url?.includes('/api/auth/reissue') || orig._retry) {
            return Promise.reject(err);
        }
        if (err.response?.status === 401 &&
            !orig.url?.includes('/api/auth/reissue') &&
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

// API 요청 함수들
export const authAPI = {
    login: (credentials) => customAxios.post('/api/auth/login', credentials),
    logout: () => customAxios.post('/api/auth/logout'),
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
        delete: (addressId) => customAxios.delete(`/api/addresses/${addressId}`)
    },

    product: {
        getAll: () => customAxios.get('/api/products'),
        getById: (id) => customAxios.get(`/api/products/${id}`),
        search: (query) => customAxios.get('/api/products/search', {params: {query}}),
        // 추가: 최신순으로 전체 상품 조회
        getLatest: () => customAxios.get('/api/products/batch/latest'),
        // 추가: 카테고리별 상품 조회
        getByCategory: (categoryName) => {
            // 카테고리 이름을 카테고리 ID로 변환
            const categoryMap = {
                // 전체 상품은 CategoryID 0으로 가정
                'all': 0, 'makeup': 1, 'skincare': 2, 'hair': 3, 'body': 4
            };
            const categoryId = categoryMap[categoryName.toLowerCase()] || 0;
            return customAxios.get(`/api/products/batch/${categoryId}`);
        }
    },

    order: {
        getSingleOrderDetail: (orderId) => customAxios.get(`/api/orders/${orderId}`),
        createOrder: (orderRequest) => customAxios.post('/api/orders', orderRequest),
        createOrders: (orderBatchRequest) => customAxios.post('/api/orders/batch', orderBatchRequest),
        getMyOrders: () => customAxios.get('/api/orders'),
        getMyOrdersByDeliveryStatus: () => customAxios.get(`/api/orders/status/${deliveryStatus}`),
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
    }
};

export const companyAPI = {
    profile: {
        getProfile: () => customAxios.get('/api/company/profile'),
        updateProfile: (data) => customAxios.put('/api/company/profile', data),
    },

    product: {
        getProducts: () => customAxios.get('/api/company/products'),
        addProduct: (data) => customAxios.post('/api/company/products', data),
        updateProduct: (productId, data) => customAxios.put(`/api/company/products/${productId}`, data),
        deleteProduct: (productId) => customAxios.delete(`/api/company/products/${productId}`),

        // 새로 추가하는 API 함수들
        getWeeklySalesData: (companyName) => customAxios.get(`/api/payments/statistics/weekly/${companyName}`),
        getTopProducts: (companyName) => customAxios.get(`/api/payments/statistics/top-products/${companyName}`),
        getTransactions: (companyName, page, size) => customAxios.get(`/api/payments/transactions/${companyName}`, {
            params: {page, size}
        })
    },

    order: {
        getCompanyOrderItems: (companyName) => customAxios.get(`/api/orders/company/${companyName}`),
    }
};

export default customAxios;