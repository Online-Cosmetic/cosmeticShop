package Midas.cosmeticShop.jwt;

import Midas.cosmeticShop.dto.BaseUserDetails;
import Midas.cosmeticShop.entity.Users.BaseUser;
import Midas.cosmeticShop.repository.Users.BaseUserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
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

        // 변경 헤더에서 access키에 담긴 토큰을 꺼냄 -> 쿠키에서 꺼내기
//        String accessToken = request.getHeader("access");
        String accessToken = null;
        if(request.getCookies() != null) {
            for(Cookie cookie : request.getCookies()) {
                if("access".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        // 토큰이 없다면 다음 필터로 넘김
        if (accessToken == null || accessToken.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

         // 토큰 유효성 검증: 유효한 토큰이 아니면 에러 처리
        if (!jwtUtil.validateToken(accessToken)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired access token");
            return;
        }

        // 토큰이 access인지 확인 (발급 시 페이로드에 명시)
        String category = jwtUtil.getCategory(accessToken);
        if (!"access".equals(category)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "invalid access token");
            return;
        }

        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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
        Authentication authToken = new UsernamePasswordAuthenticationToken(baseUserDetails, null, baseUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
