package Midas.cosmeticshop.controller.auth;

import Midas.cosmeticshop.entity.RefreshToken;
import Midas.cosmeticshop.exception.TokenRefreshException;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.repository.RefreshTokenRepository;
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

    private final RefreshTokenRepository refreshTokenRepository; // Service 로 이동하고 여기선 삭제예정
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    /* ------------------------------------------------------------------
     * 1) AccessToken 재발급
     * POST /api/auth/reissue
     * 메소드 추출해서 RefreshTokenService.java 로 코드 분리 필요
     * ------------------------------------------------------------------*/
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(
        HttpServletRequest request, HttpServletResponse response) {

        // 1. 리프레시 토큰을 클라이언트가 보낸 쿠키로 부터 가져온다
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(refreshTokenService.getRefreshFromCookie(request));

        if(refreshToken.getToken() == null || refreshToken.getToken().isEmpty()) {
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        // 2. 리프레시 토큰의 expired 체크
        try {
            refreshToken = refreshTokenService.verifyExpiration(refreshToken);
        } catch (TokenRefreshException e) {
            return new ResponseEntity<>("만료된 RefreshToken입니다.", HttpStatus.BAD_REQUEST);
        }

        // 3. 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refreshToken.getToken());

        if (!category.equals("refresh")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        // 4. DB에 저장되어 있는지 확인
        Boolean isExist = refreshTokenRepository.existsByToken(refreshToken);
        if (!isExist) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        String userId = jwtUtil.getUserId(refreshToken.getToken());
        String role = jwtUtil.getRole(refreshToken.getToken());

        // 새로운 JWT 를 생성
        String newAccess = jwtUtil.createJwt("access", userId, role, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", userId, role, 604800000L); // 7일

        // 기존 리프레시 토큰을 삭제하고 재발급 후 DB에 저장 : delete & save
        refreshTokenService.createRefreshToken(userId, newRefresh);

        // response
//        response.addHeader("access", accessToken); // 쿠키로 내려줘야 하는데 헤더로 내려준 이게 문제였다
        response.addCookie(jwtUtil.createCookie("access", newAccess, jwtUtil.getValidity("access")));
        response.addCookie(refreshTokenService.createCookie("refresh", newRefresh));

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
