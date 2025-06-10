export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://placehold.co/64x64";
  }

  // 이미 완전한 URL인 경우 그대로 반환
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 백엔드 서버 URL
  const backendUrl = "http://localhost:9000";

  // 캐시 버스팅을 위한 타임스탬프 생성
  const timestamp = new Date().getTime();

  // imagePath가 /images로 시작하면 백엔드 URL과 결합
  if (imagePath.startsWith('/images')) {
    return `${backendUrl}${imagePath}?t=${timestamp}`;
  }

  // 아니면 환경변수의 기본 경로와 결합
  return `${import.meta.env.VITE_IMAGE_BASE_URL || backendUrl}/${imagePath.replace(/^\/+/, '')}?t=${timestamp}`;
};