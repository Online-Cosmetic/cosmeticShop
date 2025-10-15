package Midas.cosmeticshop.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;  // ← 추가

@Configuration
@ConditionalOnProperty(name = "app.storage", havingValue = "local")
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        // app.upload-dir → file:///... 형태 URI로 변환 (+ 끝에 / 보장)
        String location = Path.of(uploadDir).toAbsolutePath().toUri().toString();
        if (!location.endsWith("/")) location += "/";

        registry.addResourceHandler("/images/**")
                .addResourceLocations(location);
    }
}
