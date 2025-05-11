package Midas.cosmeticshop.controller.auth;

import Midas.cosmeticshop.dto.auth.LoginRequest;
import Midas.cosmeticshop.dto.auth.LogoutRequest;
import Midas.cosmeticshop.dto.auth.UserResponse;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.service.RefreshTokenService;
import Midas.cosmeticshop.util.AuthResponseUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")  // ★ 통합 루트 (기존 : /refresh-token)
@RequiredArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshSvc;
    private final JWTUtil jwtUtil;
    private final HttpServletResponse response;

    /*------------------------------------------------------------------
     * 1) 로그인
     * POST /api/auth/login
     * 기존 LoginFilter에 의해 인증이 완료되었다고 가정하고, 로그인 엔드포인트를 구현합니다.
     * ------------------------------------------------------------------*/
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        // 실제 Authentication 객체에 의한 인증이 별도로 진행된다면 해당 정보를 사용하겠지만,
        // 여기서는 클라이언트가 보낸 loginRequest를 기반으로 응답을 생성합니다.
        AuthResponseUtil responseUtil = new AuthResponseUtil(jwtUtil);
        UserResponse userResponse = responseUtil.buildAuthResponse(loginRequest, response);
        return ResponseEntity.ok(userResponse);
    }


    /* ------------------------------------------------------------------
     * 2) 로그아웃
     * POST /api/auth/logout
     * ------------------------------------------------------------------*/
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest dto) {

        /* 1) DB에 있는 리프레시 토큰 삭제 */
        refreshSvc.invalidate(dto.getRefreshToken());

        // 2) 응답 쿠키 만료
        response.addCookie(jwtUtil.createDeleteCookie("access"));
        response.addCookie(jwtUtil.createDeleteCookie("refresh"));
        
        /* 3) (선택) 현재 SecurityContext 초기화  :  관례상 로그아웃 → 컨텍스트 클리어 */
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            SecurityContextHolder.clearContext();
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken() {
        // SecurityContext에 인증 정보가 있으면 200 반환
        return ResponseEntity.ok().build();
    }

     /*------------------------------------------------------------------
     * 1) 로그인 : 나중에 LoginFilter 에서 분리해오도록 할게요..
     * POST /api/auth/login
     * ------------------------------------------------------------------*/
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
