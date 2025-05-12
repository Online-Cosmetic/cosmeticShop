package Midas.cosmeticshop.controller.auth;

import Midas.cosmeticshop.dto.auth.LoginResponse;
import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.auth.LoginRequest;
import Midas.cosmeticshop.dto.auth.LogoutRequest;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshSvc;
    private final JWTUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
        @Valid @RequestBody LoginRequest loginRequest,
        HttpServletResponse response
    ) {
        // 1) 인증 수행
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUserId(),
                loginRequest.getPassword()
            )
        );

        // 2) 유저 정보와 권한 추출
        BaseUserDetails userDetails = (BaseUserDetails) auth.getPrincipal();
        String userId = userDetails.getUsername();
        String role   = userDetails.getAuthorities()
                                    .iterator().next().getAuthority();

        // 3) 토큰 생성
        String accessToken  = jwtUtil.createJwt("access",  userId, role, jwtUtil.getValidity("access"));
        String refreshToken = jwtUtil.createJwt("refresh", userId, role, jwtUtil.getValidity("refresh"));

        // 4) DB에 리프레시 토큰 저장
        refreshSvc.createRefreshToken(userId, refreshToken);

        // 5) HttpOnly 리프레시 토큰 쿠키 설정
        Cookie refreshCookie = jwtUtil.createCookie("refresh", refreshToken, jwtUtil.getValidity("refresh"));
        response.addCookie(refreshCookie);

        // 6) 응답 본문에 액세스 토큰과 유저 정보 포함
        LoginResponse body = new LoginResponse(userId, role, accessToken);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest dto,
                                       HttpServletResponse response) {
        refreshSvc.invalidate(dto.getRefreshToken());
        // 만료 쿠키
        response.addCookie(jwtUtil.createDeleteCookie("refresh"));
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken() {
        return ResponseEntity.ok().build();
    }
}
