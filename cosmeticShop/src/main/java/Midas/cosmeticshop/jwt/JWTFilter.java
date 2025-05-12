package Midas.cosmeticshop.jwt;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.entity.user.BaseUser;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final BaseUserRepository baseUserRepository;

    public JWTFilter(JWTUtil jwtUtil, BaseUserRepository baseUserRepository) {
        this.jwtUtil = jwtUtil;
        this.baseUserRepository = baseUserRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

//        // 변경 헤더에서 access키에 담긴 토큰을 꺼냄 -> 쿠키에서 꺼내기
////        String accessToken = request.getHeader("access");
//        String accessToken = null;
//        if(request.getCookies() != null) {
//            for(Cookie cookie : request.getCookies()) {
//                if("access".equals(cookie.getName())) {
//                    accessToken = cookie.getValue();
//                    break;
//                }
//            }
//        }

        // 1) Authorization 헤더에서 Bearer 토큰 꺼내기
        String header = request.getHeader("Authorization");
        String accessToken = null;
        if (header != null && header.startsWith("Bearer ")) {
            accessToken = header.substring(7);
        }

        // 2) 토큰 없으면 다음
        if (accessToken == null || accessToken.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3) 서명·만료 검증
        if (!jwtUtil.validateToken(accessToken)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired access token");
            return;
        }
        if (!"access".equals(jwtUtil.getCategory(accessToken))) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid access token category");
            return;
        }

        // 4) 토큰 만료 시
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access token expired");
            return;
        }

        // username, role 값을 획득
        String userId = jwtUtil.getUserId(accessToken);

        Optional<BaseUser> user = baseUserRepository.findByUserId(userId);
        if (user.isEmpty()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
            return;
        }

        BaseUserDetails baseUserDetails = new BaseUserDetails(user.get());
        Authentication authToken = new UsernamePasswordAuthenticationToken(
            baseUserDetails, null, baseUserDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
