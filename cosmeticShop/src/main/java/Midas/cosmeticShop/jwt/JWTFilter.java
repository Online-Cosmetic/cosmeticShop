package Midas.cosmeticshop.jwt;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.entity.user.BaseUser;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Optional;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final BaseUserRepository baseUserRepository;

    public JWTFilter(JWTUtil jwtUtil, BaseUserRepository baseUserRepository) {
        this.jwtUtil = jwtUtil;
        this.baseUserRepository = baseUserRepository;
    }

    private Claims parseTokenClaims(String token, SecretKey key) {
        return Jwts.parser()
            .setSigningKey(key).clockSkewSeconds(60)
            .build().parseSignedClaims(token).getPayload();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            SecretKey key = jwtUtil.getSecretKey();

            try {
                Claims claims = parseTokenClaims(token, key);

                String userId = claims.get("userId", String.class);
                // … DB 조회 → BaseUserDetails 생성 → Authentication 세팅 …
                Optional<BaseUser> userOpt = baseUserRepository.findByUserId(userId);
                if (userOpt.isPresent()) {
                    BaseUser user = userOpt.get();

                    // 2) 엔티티 → UserDetails 변환
                    BaseUserDetails userDetails = new BaseUserDetails(user);

                    // 3) 권한 세팅 (ROLE_ 접두어) : PASS

                    // 4) AuthenticationToken 생성
                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (ExpiredJwtException e) {
                // ☆ 토큰 만료 시 401 응답하고 체인 중단
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (JwtException | IllegalArgumentException e) {
                // ☆ 토큰이 잘못된 경우 (signature 불일치 등)에는
                // 그냥 인증 없이 다음 필터로 넘기면, permitAll 경로만 통과됨
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/login")
            || path.startsWith("/api/auth/reissue")
            || path.startsWith("/api/auth/me")
            || path.startsWith("/api/auth/logout");
    }
}
