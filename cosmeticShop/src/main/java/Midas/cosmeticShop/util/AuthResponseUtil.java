package Midas.cosmeticshop.util;

import Midas.cosmeticshop.dto.auth.LoginRequest;
import Midas.cosmeticshop.dto.auth.UserResponse;
import Midas.cosmeticshop.jwt.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class AuthResponseUtil {

    private final JWTUtil jwtUtil;

    public AuthResponseUtil(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * LoginRequest 객체를 기반으로 JWT와 쿠키를 생성한 후, UserResponse를 빌드하여 반환
     */
    public UserResponse buildAuthResponse(LoginRequest loginRequest, HttpServletResponse response) {
        // JWT 생성: access와 refresh 토큰 생성 (유효시간은 예시)
        String accessToken = jwtUtil.createJwt("access", loginRequest.getUserId(), loginRequest.getRole(), 600000L);
        String refreshToken = jwtUtil.createJwt("refresh", loginRequest.getUserId(), loginRequest.getRole(), 604800000L);

        // 쿠키 생성 후 응답에 추가
        Cookie accessCookie = jwtUtil.createCookie("access", accessToken, jwtUtil.getValidity("access"));
        Cookie refreshCookie = jwtUtil.createCookie("refresh", refreshToken, jwtUtil.getValidity("refresh"));
        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        // UserResponse 빌드: loginRequest의 role 필드를 loginType 필드로 사용
        UserResponse userResponse = new UserResponse();
        userResponse.setUserId(loginRequest.getUserId());
        userResponse.setRole(loginRequest.getRole());
        userResponse.setRefreshToken(refreshToken);

        return userResponse;
    }
}