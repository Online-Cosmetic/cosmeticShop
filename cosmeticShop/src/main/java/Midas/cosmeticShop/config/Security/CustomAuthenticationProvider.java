package Midas.cosmeticShop.config.Security;

import Midas.cosmeticShop.dto.BaseUserDetails;
import Midas.cosmeticShop.dto.LoginRequestDetails;
import Midas.cosmeticShop.service.BaseUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final BaseUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        System.out.println(">>> CustomAuthProvider called!");   // 임시 로그

        String userId = authentication.getName();
        String password = authentication.getCredentials().toString();

        String loginType = Optional.ofNullable(
                ((LoginRequestDetails) authentication.getDetails()).getLoginType())
            .orElseThrow(() -> new BadCredentialsException("loginType 누락"))
            .replaceFirst("^ROLE_", "");   // ROLE_ 접두어 제거


        BaseUserDetails userDetails = userDetailsService.loadUserByUsername(userId);

        // 1) 비밀번호
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        // 2) Role <-> loginType 매칭
        boolean isCompany = userDetails.getAuthorities()
                                        .stream()
                                        .anyMatch(a -> a.getAuthority().equals("COMPANY"));

        if("COMPANY".equalsIgnoreCase(loginType) != isCompany) {
            throw new BadCredentialsException("로그인 유형이 올바르지 않습니다.");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    /* 주의 : 반환이 false 면 Spring이 이 Provider를 건너뜁니다 */
    @Override
    public boolean supports(Class<?> auth) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(auth);
    }

}
