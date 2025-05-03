package Midas.cosmeticShop.controller;

import Midas.cosmeticShop.dto.LogoutRequest;
import Midas.cosmeticShop.dto.TokenRefreshRequest;
import Midas.cosmeticShop.dto.TokenRefreshResponse;
import Midas.cosmeticShop.entity.RefreshToken;
import Midas.cosmeticShop.exception.TokenRefreshException;
import Midas.cosmeticShop.jwt.JWTUtil;
import Midas.cosmeticShop.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    private final RefreshTokenService refreshSvc;
    private final JWTUtil jwtUtil;

    /* ------------------------------------------------------------------
     * 1) AccessToken 재발급
     * POST /api/auth/refresh
     * ------------------------------------------------------------------*/
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refresh(
        @Valid @RequestBody TokenRefreshRequest req) {

        RefreshToken token = refreshSvc.findByToken(req.getRefreshToken())
            .orElseThrow(() ->
                new TokenRefreshException(req.getRefreshToken(),
                    "존재하지 않는 RefreshToken입니다."));

        refreshSvc.verifyExpiration(token);

        String userId = token.getUser().getUserId();
        String role = token.getUser().getRole();
        String newAccess = jwtUtil.createJwt(userId, role, 15 * 60 * 1000L);

        return ResponseEntity.ok(new TokenRefreshResponse(newAccess, req.getRefreshToken()));
    }


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
}
