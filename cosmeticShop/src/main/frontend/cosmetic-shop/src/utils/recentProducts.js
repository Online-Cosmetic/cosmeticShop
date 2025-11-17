/**
 * 최근 본 상품 관리 유틸리티
 * 로컬 스토리지를 사용하여 최근 본 상품을 저장하고 조회합니다.
 */

const STORAGE_KEY = 'recentProducts';
const MAX_RECENT_PRODUCTS = 10; // 최대 저장 개수

/**
 * 최근 본 상품에 상품 추가
 * @param {Object} product - 상품 정보 객체
 * @param {number} product.productId - 상품 ID
 * @param {string} product.productName - 상품명
 * @param {string} product.thumbnailImageUrl - 썸네일 이미지 URL
 * @param {number} product.price - 가격
 * @param {number} product.discountRate - 할인율
 */
export const addRecentProduct = (product) => {
    try {
        // 기존 최근 본 상품 목록 가져오기
        const recentProducts = getRecentProducts();
        
        // 이미 존재하는 상품이면 제거 (중복 제거)
        const filteredProducts = recentProducts.filter(
            item => item.productId !== product.productId
        );
        
        // 새 상품을 맨 앞에 추가
        const updatedProducts = [
            {
                productId: product.productId,
                productName: product.productName,
                thumbnailImageUrl: product.thumbnailImageUrl,
                price: product.price,
                discountRate: product.discountRate || 0,
                viewedAt: new Date().toISOString() // 조회 시간 추가
            },
            ...filteredProducts
        ].slice(0, MAX_RECENT_PRODUCTS); // 최대 개수만큼만 유지
        
        // 로컬 스토리지에 저장
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
        
        // 디버깅: 저장 확인
        console.log('✅ 최근 본 상품 저장 완료:', {
            key: STORAGE_KEY,
            count: updatedProducts.length,
            products: updatedProducts.map(p => ({ id: p.productId, name: p.productName }))
        });
        
        // 커스텀 이벤트 발생 (같은 탭에서 변경 감지)
        window.dispatchEvent(new Event('recentProductsUpdated'));
    } catch (error) {
        console.error('최근 본 상품 저장 실패:', error);
    }
};

/**
 * 최근 본 상품 목록 조회
 * @returns {Array} 최근 본 상품 배열 (최신순)
 */
export const getRecentProducts = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        
        const products = JSON.parse(stored);
        // viewedAt 기준으로 정렬 (최신순)
        return products.sort((a, b) => {
            const dateA = new Date(a.viewedAt || 0);
            const dateB = new Date(b.viewedAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error('최근 본 상품 조회 실패:', error);
        return [];
    }
};

/**
 * 최근 본 상품 목록 초기화
 */
export const clearRecentProducts = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        // 커스텀 이벤트 발생 (같은 탭에서 변경 감지)
        window.dispatchEvent(new Event('recentProductsUpdated'));
    } catch (error) {
        console.error('최근 본 상품 초기화 실패:', error);
    }
};

/**
 * 특정 상품을 최근 본 상품에서 제거
 * @param {number} productId - 제거할 상품 ID
 */
export const removeRecentProduct = (productId) => {
    try {
        const recentProducts = getRecentProducts();
        const filteredProducts = recentProducts.filter(
            item => item.productId !== productId
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
        // 커스텀 이벤트 발생 (같은 탭에서 변경 감지)
        window.dispatchEvent(new Event('recentProductsUpdated'));
    } catch (error) {
        console.error('최근 본 상품 제거 실패:', error);
    }
};

