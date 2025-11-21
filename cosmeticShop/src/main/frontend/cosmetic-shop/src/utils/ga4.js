// src/utils/ga4.js
// index.html에서 이미 GA가 로드되어 있으므로 gtag 함수만 사용

// dataLayer에서 Measurement ID 추출
const getMeasurementId = () => {
  if (typeof window === 'undefined' || !window.dataLayer) return null;
  
  // dataLayer에서 config 호출 찾기
  for (let i = 0; i < window.dataLayer.length; i++) {
    const item = window.dataLayer[i];
    if (Array.isArray(item) && item[0] === 'config') {
      return item[1]; // Measurement ID 반환
    }
  }
  return null;
};

// 페이지뷰 추적 (SPA 라우트 변경 시)
export const trackPageViewSafe = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const measurementId = getMeasurementId();
    if (measurementId) {
      // Measurement ID를 사용하여 페이지뷰 추적
      window.gtag('config', measurementId, {
        page_path: path,
      });
    } else {
      // Measurement ID를 찾을 수 없으면 이벤트 방식으로 추적
      window.gtag('event', 'page_view', {
        page_path: path,
      });
    }
  }
};

// 이벤트 추적
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

