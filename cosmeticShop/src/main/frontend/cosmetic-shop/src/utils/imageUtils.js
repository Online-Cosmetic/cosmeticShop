export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://placehold.co/64x64";
  }

  // 백엔드 서버 URL
  const backendUrl = "http://localhost:9000";

  // imagePath가 /images로 시작하면 백엔드 URL과 결합
  if (imagePath.startsWith('/images')) {
    return `${backendUrl}${imagePath}`;
  }

  // 아니면 환경변수의 기본 경로와 결합
  return `${import.meta.env.VITE_IMAGE_BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
};
