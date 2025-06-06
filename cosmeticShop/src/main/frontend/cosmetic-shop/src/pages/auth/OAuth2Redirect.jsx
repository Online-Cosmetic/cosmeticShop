// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
//
// export default function OAuth2Redirect() {
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const accessToken = params.get('accessToken');
//         const refreshToken = params.get('refreshToken');
//         if (accessToken) localStorage.setItem('accessToken', accessToken);
//         if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
//         navigate('/');
//     }, [navigate]);
//
//     return <div>소셜 로그인 처리 중...</div>;
// }