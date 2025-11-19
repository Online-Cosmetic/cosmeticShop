package Midas.cosmeticshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/* 컨트롤러 단에 들어오는 데이터는 CorsMvcConfig 에서 처리해줘야함 */
@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry.addMapping("/**")
            .allowedOrigins("http://localhost:5173", "http://43.202.44.185")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Authorization", "Content-Type", "Accept")
            .exposedHeaders("Authorization")
            .allowCredentials(true);
    }

    // 이미지 리소스 핸들러는 제거
    // 이미지 서빙은 storage mode에 따라 security의 각 config가 처리
    // - WebConfig: app.storage=local 일 때
    // - ImageProxyController: app.storage=supabase 일 때
    // - S3ImageProxyController: app.storage=s3 일 때
}
