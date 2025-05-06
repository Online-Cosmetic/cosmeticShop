package Midas.cosmeticShop.controller.Auth;

import Midas.cosmeticShop.dto.Auth.LogoutRequest;
import Midas.cosmeticShop.jwt.JWTUtil;
import Midas.cosmeticShop.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")  // ★ 통합 루트 (기존 : /refresh-token)
@RequiredArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshSvc;
    private final JWTUtil jwtUtil;

    // 1) 로그인 로직은 LoginFilter.java 에서 분리해 가져올 예정입니다.

    /* ------------------------------------------------------------------
     * 2) 로그아웃
     * POST /api/auth/logout
     * ------------------------------------------------------------------*/
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest dto) {

        /* 1) DB 에서 해당 리프레시 토큰 삭제 */
        refreshSvc.invalidate(dto.getRefreshToken());

        /* 2) (선택) 현재 SecurityContext 초기화 */
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            SecurityContextHolder.clearContext();
        }

        return ResponseEntity.ok().build();
    }

    //    /* ------------------------------------------------------------------
//     * 1) 로그인 : 언젠간 LoginFilter 에서 가져오도록 할게요..
//     * POST /api/auth/login
//     * ------------------------------------------------------------------*/
//    @PostMapping("/login")
//    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest loginRequest,
//                                              HttpServletResponse response) {
//        // 1) 인증 시도
//        Authentication auth = authenticationManager.authenticate(
//            new UsernamePasswordAuthenticationToken(
//                loginRequest.getUserId(),
//                loginRequest.getPassword()
//            )
//        );
//
//        // 2) JWT 생성
//        String accessToken = jwtUtil.createJwt(auth);
//
//        // 3) HttpOnly 쿠키 설정
//        Cookie jwtCookie = new Cookie("accessToken", accessToken);
//        jwtCookie.setHttpOnly(true);
//        jwtCookie.setSecure(true);            // HTTPS 환경일 때만
//        jwtCookie.setPath("/");
//        jwtCookie.setMaxAge(tokenProvider.getAccessTokenValiditySeconds());
//        jwtCookie.setSameSite("Lax");         // Spring Boot 2.7+ 지원
//        response.addCookie(jwtCookie);
//
//        // 4) 사용자 정보 응답
//        UserResponse userInfo = tokenProvider.getUserFromAuthentication(auth);
//        return ResponseEntity.ok(userInfo);
//    }

}
