// src/main/resources/static/userLogin.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        /* 1. 입력값 수집 */
        const userId   = document.getElementById('userId').value.trim();
        const password = document.getElementById('password').value;
        const loginType = 'USER'

        if (!userId || !password) {
            alert('아이디와 비밀번호를 모두 입력해 주세요.');
            return;
        }

        /* 2. 로그인 요청 */
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password, loginType })
            });

            /* 3. 실패 처리 */
            if (!res.ok) {
                const errMsg = await res.text();
                alert(`로그인 실패 (${res.status}) : ${errMsg || '서버 오류'}`);
                return;
            }

            /* 4. 성공 → 토큰 저장 */
            const { accessToken, refreshToken } = await res.json();
            localStorage.setItem('ACCESS_TOKEN', accessToken);
            localStorage.setItem('REFRESH_TOKEN', refreshToken);

            alert('로그인 성공!');

            /* 필요 시 토큰에서 role claim 을 파싱해 대시보드 분기 가능 */
            window.location.href = '/';
        } catch (err) {
            console.error(err);
            alert('로그인 중 오류가 발생했습니다.');
        }
    });
});
