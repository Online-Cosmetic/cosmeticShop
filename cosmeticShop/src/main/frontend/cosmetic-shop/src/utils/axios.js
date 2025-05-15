import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// axios 인스턴스 생성
const instance = axios.create({
    baseURL: 'http://localhost:9000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // CORS 요청에서 쿠키 전송을 위해 필요
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 토큰 재발급 시도를 하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 토큰 재발급 요청
                const response = await instance.post('/auth/reissue');
                const { accessToken } = response.data;

                // 새 토큰 저장
                localStorage.setItem('accessToken', accessToken);

                // 원래 요청의 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // 실패했던 요청 재시도
                return instance(originalRequest);
            } catch (refreshError) {
                // 리프레시 토큰도 만료된 경우
                localStorage.removeItem('accessToken');

                // 로그인 페이지로 리다이렉트
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API 요청 함수들
export const authAPI = {
    login: (credentials) => instance.post('/auth/login', credentials),
    logout: () => instance.post('/auth/logout'),
    signup: {
        user: (data) => instance.post('/auth/signup/user', data),
        company: (data) => instance.post('/auth/signup/company', data)
    },
    me: () => instance.get('/auth/me'),
    refresh: () => instance.post('/auth/reissue')
};

export const userAPI = {
    getProfile: () => instance.get('/user/profile'),
    updateProfile: (data) => instance.put('/user/profile', data),
    getCart: () => instance.get('/user/cart'),
    addToCart: (productId, quantity) => instance.post('/user/cart', { productId, quantity }),
    removeFromCart: (productId) => instance.delete(`/user/cart/${productId}`)
};

export const companyAPI = {
    getProfile: () => instance.get('/company/profile'),
    updateProfile: (data) => instance.put('/company/profile', data),
    getProducts: () => instance.get('/company/products'),
    addProduct: (data) => instance.post('/company/products', data),
    updateProduct: (productId, data) => instance.put(`/company/products/${productId}`, data),
    deleteProduct: (productId) => instance.delete(`/company/products/${productId}`)
};

export const productAPI = {
    getAll: () => instance.get('/products'),
    getById: (id) => instance.get(`/products/${id}`),
    search: (query) => instance.get('/products/search', { params: { query } })
};

export default instance;