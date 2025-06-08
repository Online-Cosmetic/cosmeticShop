package Midas.cosmeticshop.config.security;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.service.BaseUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final BaseUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication)
        throws AuthenticationException {

        log.info("CustomAuthProvider called!");

        String userId = authentication.getName();
        String password = authentication.getCredentials().toString();

        // BaseUserDetailsService를 통해 사용자 정보 로드
        BaseUserDetails userDetails = userDetailsService.loadUserByUsername(userId);

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            log.error("Password does not match for user: {}", userId);
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        // 인증 성공 로그
        log.info("Authentication success for user: {}", userId);

        // 인증 완료된 토큰 생성 및 반환 (credentials는 보안을 위해 null로 설정)
        UsernamePasswordAuthenticationToken authenticatedToken =
            new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
            );

        return authenticatedToken;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}