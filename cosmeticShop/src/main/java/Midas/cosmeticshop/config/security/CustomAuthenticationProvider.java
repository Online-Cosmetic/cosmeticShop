package Midas.cosmeticshop.config.security;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.service.BaseUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


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

        BaseUserDetails userDetails = userDetailsService.loadUserByUsername(userId);

        // 1) 비밀번호
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        System.out.println("userDetails.getAuthorities() = " + userDetails.getAuthorities().toString());
        return new UsernamePasswordAuthenticationToken(userDetails, true, userDetails.getAuthorities());
    }

    /* 주의 : 반환이 false 면 Spring이 이 Provider를 건너뜁니다 */
    @Override
    public boolean supports(Class<?> auth) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(auth);
    }

}
