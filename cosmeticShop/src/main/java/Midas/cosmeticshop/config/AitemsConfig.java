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
    private String apiEndpoint;

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
    public String getApiEndpoint() {
        return apiEndpoint;
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

