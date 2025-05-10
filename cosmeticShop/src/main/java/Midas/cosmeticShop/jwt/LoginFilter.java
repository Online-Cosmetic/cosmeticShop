package Midas.cosmeticShop.jwt;

import Midas.cosmeticShop.dto.BaseUserDetails;
import Midas.cosmeticShop.dto.Auth.LoginDTO;
import Midas.cosmeticShop.service.RefreshTokenService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenService refreshSvc) {
        super.setFilterProcessesUrl("/api/auth/login");
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshSvc;
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
        HttpServletResponse response) throws AuthenticationException {
        /*
            obtainUsername() 메소드는 JSON 형태로 넘어온 body 내용을 직접 뽑아내지 못하기 때문에
            objectMapper 를 통해 username 과 password 를 추출한다
        */

        LoginDTO loginDTO;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginDTO = objectMapper.readValue(messageBody, LoginDTO.class);
        }
            catch (IOException e) {
                throw new AuthenticationServiceException("Invalid login request", e);
        }
        String userId = loginDTO.getUserId();
        String password = loginDTO.getPassword();


        if (userId == null || password == null) {
            throw new AuthenticationServiceException("UserId or Password not provided");
        }

        UsernamePasswordAuthenticationToken authToken
            = new UsernamePasswordAuthenticationToken(userId, password);

        return authenticationManager.authenticate(authToken);
    }

    private record UserAuthInfo(String userId, String role) {}

    /* 관리자, 일반/기업 회원 role 에 따라 userDetails 의 타입만 다르게 설정 */
    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authentication)
                                            throws IOException, ServletException {

        UserAuthInfo authInfo = extractUserAuthInfo(authentication);

        String accessToken = jwtUtil.createJwt("access", authInfo.userId, authInfo.role, 600000L); // AccessToken
        String refreshToken = jwtUtil.createJwt("refresh", authInfo.userId, authInfo.role, 604800000L);

        // create & save
        refreshTokenService.createRefreshToken(authInfo.userId, refreshToken);

        // JSON 응답
        response.addCookie(jwtUtil.createCookie("access", accessToken, jwtUtil.getValidity("access")));
        response.addCookie(jwtUtil.createCookie("refresh", refreshToken, jwtUtil.getValidity("refresh")));
        response.setStatus(200);
    }

    /* 로그인하는 사용자의 Role 에 맞춰 userId 와 role 을 담은 객체를 반환 */
    private UserAuthInfo extractUserAuthInfo(Authentication authentication) {

        BaseUserDetails details = (BaseUserDetails) authentication.getPrincipal();
        String userId = details.getUsername();  // == BaseUser.getUserId()

        // 권한이 여러 개라면 첫 번째만 JWT에 담는다
        String role  = details.getAuthorities()
            .iterator()
            .next()
            .getAuthority();    // ex) ROLE_COMPANY

        return new UserAuthInfo(userId, role);
    }


    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        /* 로그인 실패시 401 응답 코드 반환*/
        response.setStatus(401);
    }
}