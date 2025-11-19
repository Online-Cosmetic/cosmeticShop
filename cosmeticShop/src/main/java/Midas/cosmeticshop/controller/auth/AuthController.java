package Midas.cosmeticshop.controller.auth;

import Midas.cosmeticshop.dto.auth.LoginResponse;
import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.auth.LoginRequest;
import Midas.cosmeticshop.dto.auth.UserDTO;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import Midas.cosmeticshop.service.RefreshTokenService;
import Midas.cosmeticshop.entity.user.BaseUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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

        // 소셜 로그인 사용자인지 확인
        Optional<BaseUser> userOptional = baseUserRepository.findByUserId(loginRequest.getUserId());
        if (userOptional.isPresent() && userOptional.get() instanceof User) {
            User user = (User) userOptional.get();
            // 소셜 로그인 사용자는 provider 필드에 값이 있음
            if (user.getProvider() != null && !user.getProvider().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("소셜 로그인으로 가입된 계정입니다. 해당 소셜 로그인을 이용해주세요."));
            }
        }

        // 역할이 지정되지 않았으면 역할 할당
        if (loginRequest.getRole() == null) {
            try {
                assignRole(loginRequest);
            } catch (Exception e) {
                // 사용자를 찾을 수 없는 경우 등의 예외 처리
                return ResponseEntity.badRequest()
                    .body(new LoginResponse("아이디 또는 비밀번호가 잘못되었습니다."));
            }
        }

        try {

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
            String role = userDetails.getAuthorities()
                .iterator().next().getAuthority(); // "ROLE_" 접두어가 붙은 값

            // 역할 검증
            String requestedRole = loginRequest.getRole();
            if (!role.equals(requestedRole)) {
                String errorMessage = "잘못된 로그인 페이지입니다. 올바른 로그인 페이지를 이용해주세요.";
                LoginResponse errorResponse = new LoginResponse(errorMessage);
                return ResponseEntity.status(403).body(errorResponse);
            }

            // 3) 토큰 생성
            String accessToken  = jwtUtil.createJwt("access",  userId, role, jwtUtil.getValidity("access"));
            String refreshToken = jwtUtil.createJwt("refresh", userId, role, jwtUtil.getValidity("refresh"));

            // 4) DB에 리프레시 토큰 저장
            refreshSvc.createRefreshToken(userId, refreshToken);

            // 5) HttpOnly 리프레시 토큰 쿠키 설정
            Cookie refreshCookie = jwtUtil.createCookie("refresh", refreshToken, jwtUtil.getValidity("refresh"));
            response.addCookie(refreshCookie);

            // 6) 사용자 정보 조회
            BaseUser user = baseUserRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // 7) 응답 본문에 액세스 토큰과 유저 정보 포함
            LoginResponse body;
            if(user.getRole().equals("USER")) {
                User commonUser = (User) user;
                body = new LoginResponse(
                    userId,
                    role,
                    accessToken,
                    commonUser.getEmailAddress(),
                    commonUser.getUsername(),
                    commonUser.getNickName()
                );
            } else if(user.getRole().equals("COMPANY")) {
                Company company = (Company) user;
                body = new LoginResponse(
                    userId,
                    role,
                    accessToken,
                    company.getEmailAddress(),
                    company.getCompanyName(),
                    company.isApproved()
                    null
                );
            } else { // ADMIN
                body = new LoginResponse(
                    userId,
                    role,
                    accessToken
                );
            }
            return ResponseEntity.ok(body);
        } catch (Exception e) {
            return ResponseEntity.status(401)
                .body(new LoginResponse("아이디 또는 비밀번호가 잘못되었습니다."));
        }

    }

    // localhost:9000 에서 API 테스트 할때만 호출될 메소드
    private void assignRole(LoginRequest loginRequest) {
        BaseUser user = baseUserRepository
            .findByUserId(loginRequest.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        loginRequest.setRole("ROLE_" + user.getRole());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
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
            
            // CORS 헤더 추가
            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
            response.setHeader("Access-Control-Allow-Credentials", "true");
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 오류가 발생해도 200 OK 응답 반환
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken() {
        return ResponseEntity.ok().build();
    }
}