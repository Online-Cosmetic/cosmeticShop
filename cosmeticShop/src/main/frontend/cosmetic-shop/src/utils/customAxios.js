// src/utils/customAxios.js
import axios from 'axios';
import mitt from 'mitt';

export const emitter = mitt();

const customAxios = axios.create({
    baseURL: 'http://localhost:9000',
    withCredentials: true,
});

// 요청 인터셉터: refresh-token 호출이 아니면 로컬의 accessToken 헤더에 셋팅
customAxios.interceptors.request.use(config => {
    if (config.url?.includes('/api/auth/reissue')) return config;
    const token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

// 응답 인터셉터: 401이면 한 번만 reissue 시도
customAxios.interceptors.response.use(
    res => res,
    async err => {
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
        getCart: () => customAxios.get('/api/carts'),
        addToCart: (productId, quantity) => customAxios.post('/api/carts', { productId, quantity }),
        removeFromCart: (productId) => customAxios.delete(`/api/carts/${productId}`),
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
        search: (query) => customAxios.get('/api/products/search', { params: { query } })
    },

    order: {
        getSingleOrderDetail: (orderId) => customAxios.get(`/api/orders/${orderId}`),
        createOrder: (orderRequest) => customAxios.post('/api/orders', orderRequest),
        createOrders: (orderBatchRequest) => customAxios.post('/api/orders/batch', orderBatchRequest),
        getMyOrders: () => customAxios.get('/api/orders'),
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
        deleteProduct: (productId) => customAxios.delete(`/api/company/products/${productId}`)
    }
};

export default customAxios;