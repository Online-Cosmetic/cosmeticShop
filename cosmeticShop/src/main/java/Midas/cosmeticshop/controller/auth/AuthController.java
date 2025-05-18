package Midas.cosmeticshop.controller.auth;

import Midas.cosmeticshop.dto.auth.LoginResponse;
import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.auth.LoginRequest;
import Midas.cosmeticshop.dto.auth.UserDTO;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import Midas.cosmeticshop.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final BaseUserRepository baseUserRepository;
    private final RefreshTokenService refreshSvc;
    private final JWTUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal BaseUserDetails principal) {
        // BaseUserDetails 에 username, roles, id 등을 담아둔 상태
        UserDTO dto = UserDTO.from(principal);
        return ResponseEntity.ok(Map.of("user", dto));
    }

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

        if(loginRequest.getRole() == null) {
            assignRole(loginRequest);
        }

        // 2) 유저 정보와 권한 추출
        BaseUserDetails userDetails = (BaseUserDetails) auth.getPrincipal();
        String userId = userDetails.getUsername();
        String role = userDetails.getAuthorities()
                                    .iterator().next().getAuthority(); // "ROLE_" 접두어가 붙은 값

        // 역할 검증
        String requestedRole = loginRequest.getRole();
        if (!role.equals(requestedRole)) {
            return ResponseEntity.status(403)
                .body(new LoginResponse(null, null, null, "잘못된 로그인 페이지입니다. 올바른 로그인 페이지를 이용해주세요."));
        }

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

    // localhost:9000 에서 API 테스트 할때만 호출될 메소드
    private void assignRole(LoginRequest loginRequest) {
        loginRequest.setRole(
            "ROLE_" +
                baseUserRepository
                .findByUserId(loginRequest.getUserId())
                .get()
                .getRole()
        );
    }

    // 삭제: @RequestBody LogoutRequest dto
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request,
                                    HttpServletResponse response) {
        // 1) 쿠키에서 refreshToken 직접 추출
        String refreshToken = refreshSvc.getRefreshFromCookie(request);
        if (refreshToken != null) {
            // 2) DB/로직에서 해당 토큰 무효화
            refreshSvc.invalidate(refreshToken);
        }
        // 3) 만료 쿠키로 덮어쓰기
        response.addCookie(jwtUtil.createDeleteCookie("refresh"));
        // 4) SecurityContext 초기화
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken() {
        return ResponseEntity.ok().build();
    }
    @PostMapping("/reissue")
public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
    // 1. 쿠키에서 refresh 토큰 추출
    String refreshToken = refreshSvc.getRefreshFromCookie(request);
    if (refreshToken == null || !refreshSvc.isValid(refreshToken)) {
        return ResponseEntity.badRequest().body("Refresh token is missing or invalid.");
    }

    // 2. refreshToken 으로부터 사용자 정보 추출
    String userId = jwtUtil.getUserId(refreshToken);
    String role = jwtUtil.getRole(refreshToken);

    // 3. 새로운 access 토큰 발급
    String newAccessToken = jwtUtil.createJwt("access", userId, role, jwtUtil.getValidity("access"));

    // 4. 클라이언트에 accessToken 전달
    return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
}

}
