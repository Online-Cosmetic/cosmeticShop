package Midas.cosmeticshop.config.security;

import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.jwt.JWTFilter;
//import Midas.cosmeticshop.oauth2.CustomSuccessHandler;
import Midas.cosmeticshop.repository.user.BaseUserRepository;
//import Midas.cosmeticshop.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
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
@EnableWebSecurity // 개발환경에서만 true 옵션을 주자
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTUtil jwtUtil;
    private final BaseUserRepository baseUserRepository;
//    private final CustomOAuth2UserService customOAuth2UserService;
    //private final CustomSuccessHandler customSuccessHandler;


    /**
     * AuthController 등에 주입하기 위해 AuthenticationManager를 빈으로 노출
     */
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
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers(
                "/images/**",
                "/css/**",
                "/js/**",
                "/favicon.ico",
                "/webjars/**",
                "/static/**"
        );
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

//        // 소셜로그인 기능 관련 (람다 기반 최신 방식)
//        http
//            .oauth2Login((oauth2) -> oauth2
//                .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
//                    .userService(customOAuth2UserService))
//                        .successHandler(customSuccessHandler)
//            );


        // CORS 설정
        http.cors((cors) -> cors
            .configurationSource(request -> {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOriginPatterns(List.of(
                        "https://*.vercel.app",
                        "https://your-frontend.com",
                        "http://localhost:5173",
                        "http://localhost:3000",
                        "http://43.202.44.185"
                ));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
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
            // 정적 리소스에 대한 접근 허용 (순서 중요 - 가장 먼저 배치)
            .requestMatchers(
                "/css/**", "/js/**", "/images/**", "/favicon.ico", "/images/**")
            .permitAll()
	    
	     // ✅ presign 허용 (POST + OPTIONS 프리플라이트)
    	    .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/uploads/presign").permitAll()
    	    .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/api/uploads/presign").permitAll()

            .requestMatchers("/error", "/error/**").permitAll() //에러 표시용

            // 로그인·회원가입 API
            .requestMatchers(
                "/api/auth/**",
                "/login/oauth2/code/**" // 소셜로그인 URI
            ).permitAll()

            // 회사 정보 공개 API (비로그인 사용자도 접근 가능)
            .requestMatchers(
                "/api/company/info/public",
                "/api/company/names/public"
            ).permitAll()

            // 관리자 페이지 접근 경로 허용
            .requestMatchers(
                "/admin/login",
                "/admin/login/**"
            ).permitAll()

            // 장바구니/주소 관련 (로그인 필요)
            .requestMatchers(
                "/api/carts/**",
                "/api/addresses/**",
                "/api/reviews/**"
            ).hasRole("USER")

            // 주문 관련
            .requestMatchers(
                "/api/orders/**"
            ).hasAnyRole("USER", "COMPANY")

            // 프로필 변경 관련
            .requestMatchers(
                "/api/user/profile",
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
                "/api/payments/**"
            ).hasAnyRole("USER", "COMPANY")

            // QNA 관련
            .requestMatchers(
                "/api/qnas/all",
                "/api/qnas/detail/**",
                "/api/qnas/search/**",
                "/api/qnas/findIdByNicknameAndTitle"
            ).permitAll()

            // QNA 관련 (로그인 필요)
            .requestMatchers(
                "/api/qnas",
                "/api/qnas/me/**"
            ).hasAnyRole("USER", "ADMIN")

            // QNA 관련 (관리자 전용)
            .requestMatchers(
                "/api/qnas/admin/**",
                "/api/qnas/answered/**",
                "/api/qnas/unanswered/**",
                "/api/qnas/{qnaId}/answers"
            ).hasRole("ADMIN")

            // 상품 관련 - POST/PUT/DELETE/PATCH는 인증 필요
            .requestMatchers(
                HttpMethod.POST, "/api/products"
            ).hasAnyRole("COMPANY", "ADMIN")
            .requestMatchers(
                HttpMethod.PUT, "/api/products/**"
            ).hasAnyRole("COMPANY", "ADMIN")
            .requestMatchers(
                HttpMethod.DELETE, "/api/products/**"
            ).hasAnyRole("COMPANY", "ADMIN")
            .requestMatchers(
                HttpMethod.PATCH, "/api/products/**"
            ).hasAnyRole("COMPANY", "ADMIN")

            // 상품 조회는 공개 (GET만)
            .requestMatchers(
                HttpMethod.GET, "/api/products/**"
            ).permitAll()

            // 회사 관련 API
            .requestMatchers(
                "/api/company/**"
            ).hasAnyRole("COMPANY", "ADMIN")

            // 쿠폰 관련
            .requestMatchers(
                "/api/coupons/**"
            ).hasAnyRole("ADMIN", "USER", "COMPANY")

            // HTML 페이지
            .requestMatchers(
                "/",
                "/index.html"
            ).permitAll()

            // 관리자 API 전용 경로
            .requestMatchers(
                "/api/admin/**",
                "/api/qnas/admin/**",
                "/api/qnas/answered/**",
                "/api/qnas/unanswered/**"
            ).hasRole("ADMIN")

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
