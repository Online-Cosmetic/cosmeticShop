package Midas.cosmeticshop.controller.auth;

import Midas.cosmeticshop.dto.auth.ReissueResponse;
import Midas.cosmeticshop.entity.RefreshToken;
import Midas.cosmeticshop.exception.TokenRefreshException;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class ReissueController {

//    private final RefreshTokenRepository refreshTokenRepository; // Service 로 이동하고 여기선 삭제예정
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshSvc;

    /* ------------------------------------------------------------------
     * 1) AccessToken 재발급
     * POST /api/auth/reissue
     * ------------------------------------------------------------------*/
    @PostMapping("/reissue")
    public ResponseEntity<ReissueResponse> reissue(
        HttpServletRequest request, HttpServletResponse response
    ) {
        String refreshToken = refreshSvc.getRefreshFromCookie(request);
        if (refreshToken == null) {
            return ResponseEntity.badRequest().build();
        }

        RefreshToken tokenEntity;
        try {
            tokenEntity = refreshSvc.verifyExpiration(new RefreshToken(refreshToken));
        } catch (TokenRefreshException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!"refresh".equals(jwtUtil.getCategory(refreshToken))) {
            return ResponseEntity.badRequest().build();
        }

        // 기존 토큰 삭제 & 새로 발급
        String userId = jwtUtil.getUserId(refreshToken);
        String role   = jwtUtil.getRole(refreshToken);
        String newAccess  = jwtUtil.createJwt("access",  userId, role, jwtUtil.getValidity("access"));
        String newRefresh = jwtUtil.createJwt("refresh", userId, role, jwtUtil.getValidity("refresh"));

        refreshSvc.createRefreshToken(userId, newRefresh);
        // 새 리프레시 토큰 쿠키
        response.addCookie(jwtUtil.createCookie("refresh", newRefresh, jwtUtil.getValidity("refresh")));

        // JSON 응답: 새 액세스 토큰
        return ResponseEntity.ok(new ReissueResponse(newAccess));
    }
}
