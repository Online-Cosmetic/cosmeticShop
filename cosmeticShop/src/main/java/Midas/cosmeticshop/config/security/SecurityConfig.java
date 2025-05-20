package Midas.cosmeticshop.config.security;

import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.jwt.JWTFilter;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;
import java.util.List;

/*
    시큐리티 필터를 타는 로그인 방식의 동작은
    SecurityConfig 에서 설정을 하지 않으면 토큰이 리턴되지 않는 문제가 발생
*/

@Configuration
@EnableWebSecurity(debug = false) // 개발환경에서만 true 옵션을 주자
public class SecurityConfig {

    private final JWTUtil jwtUtil;
//    private final CustomAuthenticationProvider customAuthenticationProvider;
    private final BaseUserRepository baseUserRepository;

    public SecurityConfig(JWTUtil jwtUtil,
//                          CustomAuthenticationProvider customAuthenticationProvider, -> SecurityConfig 와 순환참조 발생
                          BaseUserRepository baseUserRepository) {
        this.jwtUtil = jwtUtil;
//        this.customAuthenticationProvider = customAuthenticationProvider;
        this.baseUserRepository = baseUserRepository;
    }

    /** AuthController 등에 주입하기 위해 AuthenticationManager를 빈으로 노출 */
    @Bean
    public AuthenticationManager authenticationManagerBean(
        AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /* 인증할 때 비밀번호를 해시로 암호화해서 검증하고 진행하기 위함 */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(
        HttpSecurity http,
        CustomAuthenticationProvider customAuthenticationProvider
    ) throws Exception {

        // 1) AuthenticationManager 생성
        AuthenticationManager authManager = http
            .getSharedObject(AuthenticationManagerBuilder.class)
            .authenticationProvider(customAuthenticationProvider)
            .build();


        /*
            SecurityFilterChain 인터페이스를 리턴하는 메소드를 Bean 으로 하나 등록할 때마다 1개의 SecurityFilterChain 을 생성하는것임.
            만약 이런 메소드를 하나도 작성하지 않았다면 DefaultSecurityFilterChain 하나가 등록된다.
        */

        // CORS 설정
        http.cors((cors) -> cors
            .configurationSource(request -> {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                configuration.setMaxAge(3600L);
                configuration.setExposedHeaders(Collections.singletonList("Authorization"));
                return configuration;
            }));

        http.authenticationManager(authManager);

        // csrf, formLogin, httpBasic disable
        http.csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable);

        //세션 설정 : stateless
        http.sessionManagement((session) -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 경로별 인가 작업  = url 이 부분적으로 라도 중복되는 경우, role 검증을 하는 requestMatchers 를 먼저 호출해야한다
        http.authorizeHttpRequests(auth -> auth

                // 로그인·회원가입 API
                .requestMatchers(
                    "/api/auth/me",
                    "/api/auth/login",
                    "/api/auth/signup/**",
                    "/api/auth/logout",
                    "/api/auth/reissue",
                    "/api/auth/validate-token"
                ).permitAll()

                // 장바구니/주문/주소 관련 (로그인 필요)
                .requestMatchers(
                    "/api/carts/**",
                    "/api/orders/**",
                    "/api/addresses/**"
                ).hasRole("USER")

                // 프로필 변경 관련
                .requestMatchers(
                    "/api/user/check",
                    "/api/user/send-code",
                    "/api/user/verify-code",
                    "/api/user/change-password"
                ).permitAll()
                .requestMatchers(
                    "/api/user/me/nickName"
                ).hasRole("USER")

                // 결제 관련 (로그인 필요)
                .requestMatchers(
                    "/api/payment/**"
                ).hasRole("USER")

                // QNA 관련
                .requestMatchers(
                    "/api/qnas/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST, "/api/products"
                ).hasRole("COMPANY")

                // HTML 페이지
                .requestMatchers(
                    "/",
                    "/index.html"
                ).permitAll()

                // JS/CSS/이미지
                .requestMatchers(
                    "/css/**", "/js/**", "/images/**", "/favicon.ico")
                .permitAll()

                // 관리자 화면
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // 그 외
                .anyRequest().authenticated()
            );

        /* JWT → LoginFilter 순서 보장 */
        http.addFilterBefore(
            new JWTFilter(jwtUtil, baseUserRepository)
            , UsernamePasswordAuthenticationFilter.class // JWTFilter 먼저 등록
        );

        /*
            LoginFilter가 아직 체인에 들어가기 전이라면 예상과 다른 위치에 놓일 가능성이 있으니
            그냥 UsernamePasswordAuthenticationFilter.class 사용
        */

        return http.build();
    }
}
