package Midas.cosmeticShop.jwt;

import Midas.cosmeticShop.dto.BaseUserDetails;
import Midas.cosmeticShop.entity.Users.BaseUser;
import Midas.cosmeticShop.repository.Users.BaseUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final BaseUserRepository baseUserRepository;

    public JWTFilter(JWTUtil jwtUtil, BaseUserRepository baseUserRepository) {
        this.jwtUtil = jwtUtil;
        this.baseUserRepository = baseUserRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                    HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // request에서 Authorization 헤더를 찾음
        String authorization= request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authorization.split(" ")[1];

            if (jwtUtil.isExpired(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            // 토큰이 유효한 경우에만 인증 처리
            String userId = jwtUtil.getUserId(token);
            String role = jwtUtil.getRole(token);

            BaseUser baseUser = baseUserRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("없음"));

            BaseUserDetails principal = new BaseUserDetails(baseUser);

            Authentication authToken = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                principal.getAuthorities()   // 여기서 바로 꺼냄
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (Exception e) {
            // 토큰 처리 중 오류 발생 시 인증 실패 처리
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
