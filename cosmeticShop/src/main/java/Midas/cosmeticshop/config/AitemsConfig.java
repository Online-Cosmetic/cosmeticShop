package Midas.cosmeticshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Naver Cloud Platform AiTEMS API 설정
 */
@Configuration
public class AitemsConfig {

    @Value("${aitems.api.endpoint}")
    private String apiEndpointBase;

    @Value("${aitems.api.access-key}")
    private String accessKey;

    @Value("${aitems.api.secret-key}")
    private String secretKey;

    @Value("${aitems.api.service-name}")
    private String serviceName;

    @Value("${aitems.api.timeout:30000}")
    private int timeout;

    @Bean
    public RestTemplate aitemsRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(clientHttpRequestFactory());
        return restTemplate;
    }

    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeout);
        factory.setReadTimeout(timeout);
        return factory;
    }

    // Getter methods for accessing configuration values
    /**
     * API 엔드포인트 반환 (base URL만, host)
     * 예: https://aitems.apigw.ntruss.com
     * 
     * 참고: /api/v1은 pathWithQuery에 포함되어 있음
     */
    public String getEndpoint() {
        return apiEndpointBase;
    }
    
    /**
     * 서비스 ID 반환 (서비스 이름이 아닌 ID)
     */
    public String getServiceId() {
        return serviceName;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public String getServiceName() {
        return serviceName;
    }

    public int getTimeout() {
        return timeout;
    }
}

