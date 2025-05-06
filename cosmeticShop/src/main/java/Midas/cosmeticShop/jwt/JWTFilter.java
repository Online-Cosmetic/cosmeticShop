package Midas.cosmeticShop.jwt;

import Midas.cosmeticShop.dto.BaseUserDetails;
import Midas.cosmeticShop.entity.Users.BaseUser;
import Midas.cosmeticShop.repository.Users.BaseUserRepository;
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
import java.io.PrintWriter;
import java.util.Optional;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final BaseUserRepository baseUserRepository;

    public JWTFilter(JWTUtil jwtUtil, BaseUserRepository baseUserRepository) {
        this.jwtUtil = jwtUtil;
        this.baseUserRepository = baseUserRepository;
    }

//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                    HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//
//        // request에서 Authorization 헤더를 찾음
//        String authorization= request.getHeader("Authorization");
//
//        //Authorization 헤더 검증
//        if (authorization == null || !authorization.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid authorization header: " + authorization + " . Should be 'Bearer <token>'");
//            return;
//        }
//
//        try {
//            // Bearer 로 시작하는 유효한 access token 이라면
//            String token = authorization.split(" ")[1];
//
//            // 토큰이 만료됐다면
//            if (jwtUtil.isExpired(token)) {
//                filterChain.doFilter(request, response);
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is Expired.");
//                return;
//            }
//
//            // 토큰이 유효한 경우에만 인증 처리
//            String userId = jwtUtil.getUserId(token);
//            String role = jwtUtil.getRole(token);
//
//            BaseUser baseUser = baseUserRepository.findByUserId(userId)
//                .orElseThrow(() -> new UsernameNotFoundException("없음"));
//
//            BaseUserDetails principal = new BaseUserDetails(baseUser);
//
//            Authentication authToken = new UsernamePasswordAuthenticationToken(
//                principal,
//                true,
//                principal.getAuthorities()   // 여기서 바로 꺼냄
//            );
//
//            SecurityContextHolder.getContext().setAuthentication(authToken);
//
//        } catch (Exception e) {
//            // 토큰 처리 중 오류 발생 시 인증 실패 처리
//            SecurityContextHolder.clearContext();
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
//            return;
//        }
//
//        filterChain.doFilter(request, response);
//    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 헤더에서 access키에 담긴 토큰을 꺼냄
        String accessToken = request.getHeader("access");

        // 토큰이 없다면 다음 필터로 넘김
        if (accessToken == null) {

            filterChain.doFilter(request, response);
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

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(accessToken);

        if (!category.equals("access")) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // username, role 값을 획득
        String userId = jwtUtil.getUserId(accessToken);
        String role = jwtUtil.getRole(accessToken);

        Optional<BaseUser> user = baseUserRepository.findByUserId(userId);
//        user.setUsername(username);
//        user.get().setRole(role);
        BaseUserDetails baseUserDetails = new BaseUserDetails(user.get());

        Authentication authToken = new UsernamePasswordAuthenticationToken(baseUserDetails, null, baseUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
