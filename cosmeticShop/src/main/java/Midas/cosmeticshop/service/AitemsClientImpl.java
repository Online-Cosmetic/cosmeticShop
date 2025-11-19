package Midas.cosmeticshop.service;

import Midas.cosmeticshop.config.AitemsConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * Naver Cloud Platform AiTEMS API Client 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AitemsClientImpl implements AitemsClient {

    private final RestTemplate aitemsRestTemplate;
    private final AitemsConfig aitemsConfig;
    private final ObjectMapper objectMapper;

    private static final String API_VERSION = "/v1";
    private static final int MAX_RETRY = 3;

    @Override
    public List<String> getPersonalizedRecommendations(String userId, int count) {
        log.info("개인화 추천 요청 - userId: {}, count: {}", userId, count);
        
        String endpoint = String.format("%s%s/services/%s/recommendations/personalized",
            aitemsConfig.getApiEndpoint(),
            API_VERSION,
            aitemsConfig.getServiceName()
        );
        
        String url = endpoint + "?userId=" + userId + "&count=" + count;
        
        return executeRequest(url, "개인화 추천");
    }

    /**
     * API 요청 실행 (재시도 로직 포함)
     */
    private List<String> executeRequest(String url, String requestType) {
        RestClientException lastException = null;
        
        for (int attempt = 1; attempt <= MAX_RETRY; attempt++) {
            try {
                HttpHeaders headers = createHeaders();
                HttpEntity<String> entity = new HttpEntity<>(headers);
                
                log.debug("{} API 호출 시도 {} - URL: {}", requestType, attempt, url);
                
                ResponseEntity<String> response = aitemsRestTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
                );
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    return parseResponse(response.getBody());
                } else {
                    log.warn("{} API 응답 실패 - Status: {}, Body: {}", 
                        requestType, response.getStatusCode(), response.getBody());
                    throw new RestClientException("API 응답 실패: " + response.getStatusCode());
                }
                
            } catch (RestClientException e) {
                lastException = e;
                log.warn("{} API 호출 실패 (시도 {}/{}): {}", requestType, attempt, MAX_RETRY, e.getMessage());
                
                if (attempt < MAX_RETRY) {
                    try {
                        Thread.sleep(1000 * attempt); // 지수 백오프
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("재시도 중 인터럽트 발생", ie);
                    }
                }
            }
        }
        
        log.error("{} API 호출 최종 실패 ({}회 시도)", requestType, MAX_RETRY);
        throw new RuntimeException(
            String.format("%s API 호출 실패: %s", requestType, lastException != null ? lastException.getMessage() : "알 수 없는 오류"),
            lastException
        );
    }

    /**
     * HTTP 헤더 생성 (NCP API Gateway 인증)
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        
        // NCP API Gateway 인증 헤더
        // 실제 인증 방식은 NCP 문서에 따라 조정 필요
        if (aitemsConfig.getAccessKey() != null && !aitemsConfig.getAccessKey().isEmpty()) {
            headers.set("X-NCP-APIGW-API-KEY", aitemsConfig.getAccessKey());
        }
        
        // IAM 인증이 필요한 경우 추가
        // headers.set("X-NCP-IAM-ACCESS-KEY", aitemsConfig.getAccessKey());
        // headers.set("X-NCP-IAM-SECRET-KEY", aitemsConfig.getSecretKey());
        
        return headers;
    }

    /**
     * API 응답 파싱 (JSON에서 itemId 리스트 추출)
     */
    private List<String> parseResponse(String responseBody) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            List<String> itemIds = new ArrayList<>();
            
            // 응답 형식에 따라 조정 필요
            // 일반적인 형식: {"items": ["item1", "item2", ...]} 또는 ["item1", "item2", ...]
            if (rootNode.has("items") && rootNode.get("items").isArray()) {
                for (JsonNode itemNode : rootNode.get("items")) {
                    if (itemNode.isTextual()) {
                        itemIds.add(itemNode.asText());
                    } else if (itemNode.has("itemId")) {
                        itemIds.add(itemNode.get("itemId").asText());
                    }
                }
            } else if (rootNode.isArray()) {
                for (JsonNode itemNode : rootNode) {
                    if (itemNode.isTextual()) {
                        itemIds.add(itemNode.asText());
                    } else if (itemNode.has("itemId")) {
                        itemIds.add(itemNode.get("itemId").asText());
                    }
                }
            } else if (rootNode.has("itemId")) {
                itemIds.add(rootNode.get("itemId").asText());
            }
            
            log.debug("파싱된 추천 상품 ID 수: {}", itemIds.size());
            return itemIds;
            
        } catch (Exception e) {
            log.error("API 응답 파싱 실패 - Response: {}", responseBody, e);
            throw new RuntimeException("API 응답 파싱 실패: " + e.getMessage(), e);
        }
    }
}

