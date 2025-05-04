package Midas.cosmeticShop.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;


@Component
public class JWTUtil { // 토큰 발급과 검증 기능을 구현할 클래스

    private SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secretKey}")String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    /* 아래 3개의 메소드 : 토큰의 특정 요소를 검증 */
    public String getUserId(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userId", String.class);
    }
    public String getRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }
    public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }


    /* JWT 를 발행하는 메서드 */
    public String createJwt(String userId, String role, Long expireMs) {
        return Jwts.builder()
            .claim("userId", userId)
            .claim("role", role)
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expireMs))
            .signWith(secretKey)
            .compact();
    }
}
