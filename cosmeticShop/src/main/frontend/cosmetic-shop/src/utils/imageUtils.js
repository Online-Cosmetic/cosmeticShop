export const getImageUrl = (imagePath) => {
  // imagePath가 이미 /images로 시작하면 그대로 반환
  if (imagePath.startsWith('/images')) {
    return imagePath;
  }
  // 아니면 환경변수의 기본 경로와 결합
  return `${import.meta.env.VITE_IMAGE_BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
};