package Midas.cosmeticshop.service;

import Midas.cosmeticshop.entity.RefreshToken;
import Midas.cosmeticshop.entity.user.BaseUser;
import Midas.cosmeticshop.exception.TokenRefreshException;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import Midas.cosmeticshop.repository.RefreshTokenRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Value("${spring.jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final BaseUserRepository baseUserRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, BaseUserRepository baseUserRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.baseUserRepository = baseUserRepository;
    }

    // 새로 추가: refresh token을 조회하는 메소드
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /* 리프레시 토큰을 만들때 일반/기업 회원 모두 만들 수 있도록 수정하자 */
    // 리프레시 토큰을 만들고 저장까지 한번에 처리
    @Transactional
    public RefreshToken createRefreshToken(String userId, String refreshToken) {

        Optional<BaseUser> userOpt = baseUserRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            throw new TokenRefreshException(userId, "해당 권한의 사용자를 찾을 수 없습니다.");
        }

        BaseUser user = userOpt.get();

        // 기존 refresh token 제거 (트랜잭션 내에서 실행)
        refreshTokenRepository.deleteByUserId(user.getUserId());

        RefreshToken token = new RefreshToken();
        token.setUserId(user.getUserId());
        token.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        token.setToken(refreshToken);

        return refreshTokenRepository.save(token);
    }

    /* 리프레시 토큰이 만료되면 재발급 로직도 필요할듯 */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "만료된 RefreshToken입니다.");
        }
        return token;
    }



    /** 로그아웃 시 하나의 리프레시 토큰만 폐기 */
    @Transactional
    public void invalidate(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }

    /** (선택) 유저의 모든 리프레시 토큰 폐기 – 강제 로그아웃 */
    @Transactional
    public void invalidateAllByUserId(String userId) {
        refreshTokenRepository.deleteAllByUserId(userId);
    }

    public Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }

    public String getRefreshFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        for(Cookie cookie : cookies) {
            if(cookie.getName().equals("refreshToken")) {
                return cookie.getValue();
            }
        }

        return null;
    }

    public boolean isValid(String refreshToken) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isValid'");
    }
}
