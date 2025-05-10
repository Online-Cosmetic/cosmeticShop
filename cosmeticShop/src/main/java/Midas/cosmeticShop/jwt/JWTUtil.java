//package Midas.cosmeticShop.jwt;
//
//import io.jsonwebtoken.Jwts;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import javax.crypto.spec.SecretKeySpec;
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//
//
//@Component
//public class JWTUtil { // 토큰 발급과 검증 기능을 구현할 클래스
//
//    private SecretKey secretKey;
//
//    public JWTUtil(@Value("${spring.jwt.secretKey}")String secret) {
//        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
//    }
//
//    /* 아래 메소드 : 토큰의 특정 요소를 검증 */
//    public String getUserId(String token) {
//        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userId", String.class);
//    }
////    public String getUserName(String token) {
////        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
////    }
//    public String getRole(String token) {
//        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
//    }
//    public Boolean isExpired(String token) {
//        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
//    }
//
//    public String getCategory(String token) {
//        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
//    }
//
//
//    /* JWT 를 발행하는 메서드 */
//    public String createJwt(String category, String userId, String role, Long expireMs) {
//        return Jwts.builder()
//            .claim("category", category)
//            .claim("userId", userId)
//            .claim("role", role)
//            .issuedAt(new Date(System.currentTimeMillis()))
//            .expiration(new Date(System.currentTimeMillis() + expireMs))
//            .signWith(secretKey)
//            .compact();
//    }
//}

package Midas.cosmeticShop.jwt;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private final SecretKey secretKey;
    private final UserDetailsService userDetailsService;

    // 토큰 유효시간(ms) 상수 (필요 시 application.properties로 이동 가능)
    private final long accessTokenValidityMs  = 600_000L;       // 10분
    private final long refreshTokenValidityMs = 604_800_000L;   // 7일

    public JWTUtil(@Value("${spring.jwt.secretKey}") String secret,
                   UserDetailsService userDetailsService) {
        this.secretKey = new SecretKeySpec(
            secret.getBytes(StandardCharsets.UTF_8),
            Jwts.SIG.HS256.key().build().getAlgorithm()
        );
        this.userDetailsService = userDetailsService;
    }

    // — 기존에 있던 메소드들 —
    public String getUserId(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(token)
            .getPayload()
            .get("userId", String.class);
    }

    public String getRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(token)
            .getPayload()
            .get("role", String.class);
    }

    public Boolean isExpired(String token) {
        Date exp = Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(token)
            .getPayload()
            .getExpiration();
        return exp.before(new Date());
    }

    public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(token)
            .getPayload()
            .get("category", String.class);
    }

    public String createJwt(String category, String userId, String role, Long expireMs) {
        return Jwts.builder()
            .claim("category", category)
            .claim("userId", userId)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expireMs))
            .signWith(secretKey)
            .compact();
    }

    // — 새로 추가된 메소드들 —

    /** 토큰이 유효한지(서명+만료) 검사 */
    public boolean validateToken(String token) {
        try {
            var claims = Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload();
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    /** 쿠키에서 꺼낸 토큰으로 Authentication 생성 */
    public Authentication getAuthentication(String token) {
        String userId = getUserId(token);
        var userDetails = userDetailsService.loadUserByUsername(userId);
        return new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
        );
    }

    /** HttpOnly 쿠키 생성 (access, refresh 공통) */
    // SAMESITE = NONE 설정을 위해,  Cookie -> ResponseCookie 클래스로 변경
    // 이렇게 안하면 클라이언트에서 서버로 쿠키가 안넘어간대
    public Cookie createCookie(String name, String token, long maxAgeMs) {
        Cookie cookie = new Cookie(name, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);           // HTTPS 환경에서만 전송
        cookie.setPath("/");
        cookie.setMaxAge((int)(maxAgeMs / 1000));
        // SameSite 설정은 Spring Boot 2.6+ 에서 application.properties 또는 response 헤더로 제어
        return cookie;
    }

    /** 로그아웃 / 만료 처리용 쿠키 삭제 */
    public Cookie createDeleteCookie(String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        return cookie;
    }

    /** access/refresh 토큰 만료시간 조회 */
    public long getValidity(String category) {
        if ("access".equals(category))  return accessTokenValidityMs;
        if ("refresh".equals(category)) return refreshTokenValidityMs;
        throw new IllegalArgumentException("Unknown token category: " + category);
    }
}
