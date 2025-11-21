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

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
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

    private static final int MAX_RETRY = 3;
    private static final String RECOMMENDATION_TYPE = "personalRecommend"; // personalRecommend, relatedItem, pop

    @Override
    public List<String> getPersonalizedRecommendations(String userId, int count) {
        log.info("개인화 추천 요청 - userId: {}, count: {}", userId, count);
        log.info("AiTEMS 설정 - endpoint: {}, serviceId: {}", 
            aitemsConfig.getEndpoint(), aitemsConfig.getServiceId());
        
        // pathWithQuery 생성 (host 제외, /api/v1 포함)
        // 형식: /api/v1/services/{serviceId}/infers/lookup?targetId={userId}&type=personalRecommend
        String pathWithQuery = String.format(
            "/api/v1/services/%s/infers/lookup?targetId=%s&type=%s",
            aitemsConfig.getServiceId(),   // unt2lmrkhvv
            userId,                        // 25 (targetId로 전달)
            RECOMMENDATION_TYPE            // personalRecommend
        );
        
        // 실제 요청 URL (endpoint + pathWithQuery)
        String url = aitemsConfig.getEndpoint() + pathWithQuery;
        log.info("AiTEMS API 호출 URL: {}", url);
        
        return executeRequest(url, pathWithQuery, "개인화 추천");
    }

    /**
     * API 요청 실행 (재시도 로직 포함)
     */
    private List<String> executeRequest(String url, String pathWithQuery, String requestType) {
        RestClientException lastException = null;
        
        for (int attempt = 1; attempt <= MAX_RETRY; attempt++) {
            try {
                HttpHeaders headers = createHeaders(pathWithQuery, HttpMethod.GET);
                HttpEntity<String> entity = new HttpEntity<>(headers);
                
                log.info("{} API 호출 시도 {} - URL: {}", requestType, attempt, url);
                log.info("요청 헤더 - x-ncp-apigw-timestamp: {}, x-ncp-iam-access-key: {}, x-ncp-apigw-signature-v2: {}", 
                    headers.getFirst("x-ncp-apigw-timestamp"),
                    headers.getFirst("x-ncp-iam-access-key"),
                    headers.getFirst("x-ncp-apigw-signature-v2") != null ? "설정됨" : "없음");
                
                ResponseEntity<String> response = aitemsRestTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
                );
                
                log.info("{} API 응답 - Status: {}", requestType, response.getStatusCode());
                log.info("{} API 응답 Body: {}", requestType, response.getBody());
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    try {
                        List<String> result = parseResponse(response.getBody());
                        log.info("{} API 응답 파싱 성공 - 추천 상품 수: {}", requestType, result.size());
                        return result;
                    } catch (Exception e) {
                        log.error("{} API 응답 파싱 실패 - Body: {}", requestType, response.getBody(), e);
                        throw new RuntimeException("응답 파싱 실패: " + e.getMessage(), e);
                    }
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
     * HTTP 헤더 생성 (NCP API Gateway IAM 인증)
     * Ncloud 공통 API 가이드 방식 사용
     * 
     * 시그니처 규칙:
     * 1. HTTP Method 뒤에 공백(space) 필수
     * 2. pathWithQuery는 /api/v1 포함 (host 제외)
     * 3. timestamp는 한 번만 생성하고 서명/헤더에 동일하게 사용
     */
    private HttpHeaders createHeaders(String pathWithQuery, HttpMethod method) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        
        String accessKey = aitemsConfig.getAccessKey();
        String secretKey = aitemsConfig.getSecretKey();
        
        if (accessKey == null || accessKey.isEmpty() || secretKey == null || secretKey.isEmpty()) {
            log.warn("⚠️ AITEMS_ACCESS_KEY 또는 AITEMS_SECRET_KEY가 설정되지 않았습니다. 인증이 실패할 수 있습니다.");
            return headers;
        }
        
        // timestamp는 한 번만 생성하고 서명과 헤더에 동일하게 사용
        long timestamp = System.currentTimeMillis();
        String signature = generateSignature(method, pathWithQuery, timestamp, accessKey, secretKey);
        
        // NCP API Gateway IAM 인증 헤더 (소문자)
        headers.set("x-ncp-apigw-timestamp", String.valueOf(timestamp));
        headers.set("x-ncp-iam-access-key", accessKey);
        headers.set("x-ncp-apigw-signature-v2", signature);
        
        log.debug("NCP IAM 인증 헤더 설정 완료 - Timestamp: {}, AccessKey: {}", timestamp, accessKey);
        
        return headers;
    }
    
    /**
     * NCP API Gateway 서명 생성 (HMAC-SHA256)
     * 
     * 공식 StringToSign 형식:
     * {HTTP_METHOD} + " " + {REQUEST_PATH + QUERYSTRING} + "\n" + {TIMESTAMP} + "\n" + {ACCESS_KEY}
     * 
     * 예시:
     * GET /api/v1/services/unt2lmrkhvv/infers/lookup?targetId=25&type=personalRecommend\n
     * 1763601856814\n
     * ncp_iam_xxx
     */
    private String generateSignature(HttpMethod method, String pathWithQuery, long timestamp, String accessKey, String secretKey) {
        try {
            // StringToSign 생성: Method + " " (공백) + pathWithQuery + "\n" + timestamp + "\n" + accessKey
            String message = method.name() + " " + pathWithQuery + "\n" + timestamp + "\n" + accessKey;
            
            log.debug("서명 생성 - StringToSign: {}", message.replace("\n", "\\n"));
            
            // HMAC-SHA256 서명 생성
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            
            byte[] signatureBytes = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            String signature = Base64.getEncoder().encodeToString(signatureBytes);
            
            log.debug("서명 생성 완료 - Signature: {}", signature);
            
            return signature;
            
        } catch (Exception e) {
            log.error("서명 생성 실패", e);
            throw new RuntimeException("서명 생성 실패: " + e.getMessage(), e);
        }
    }

    /**
     * API 응답 파싱 (JSON에서 itemId 리스트 추출)
     * AiTEMS 응답 형식에 맞춰 파싱
     */
    private List<String> parseResponse(String responseBody) {
        try {
            log.debug("응답 파싱 시작 - Response Body: {}", responseBody);
            JsonNode rootNode = objectMapper.readTree(responseBody);
            List<String> itemIds = new ArrayList<>();
            
            // AiTEMS 응답 형식 확인 및 파싱
            // 가능한 형식:
            // 1. {"field":"ITEM_ID","values":["225","219",...]} (AiTEMS 실제 응답 형식)
            // 2. {"items": ["item1", "item2", ...]}
            // 3. {"data": {"items": ["item1", "item2", ...]}}
            // 4. ["item1", "item2", ...]
            // 5. {"itemIds": ["item1", "item2", ...]}
            
            if (rootNode.has("values") && rootNode.get("values").isArray()) {
                // 형식 1: {"field":"ITEM_ID","values":["225","219",...]} (AiTEMS 실제 응답)
                for (JsonNode itemNode : rootNode.get("values")) {
                    if (itemNode.isTextual()) {
                        itemIds.add(itemNode.asText());
                    } else if (itemNode.isNumber()) {
                        itemIds.add(String.valueOf(itemNode.asLong()));
                    }
                }
            } else if (rootNode.has("items") && rootNode.get("items").isArray()) {
                // 형식 2: {"items": [...]}
                for (JsonNode itemNode : rootNode.get("items")) {
                    if (itemNode.isTextual()) {
                        itemIds.add(itemNode.asText());
                    } else if (itemNode.has("itemId")) {
                        itemIds.add(itemNode.get("itemId").asText());
                    } else if (itemNode.has("id")) {
                        itemIds.add(itemNode.get("id").asText());
                    }
                }
            } else if (rootNode.has("data") && rootNode.get("data").has("items")) {
                // 형식 3: {"data": {"items": [...]}}
                JsonNode itemsNode = rootNode.get("data").get("items");
                if (itemsNode.isArray()) {
                    for (JsonNode itemNode : itemsNode) {
                        if (itemNode.isTextual()) {
                            itemIds.add(itemNode.asText());
                        } else if (itemNode.has("itemId")) {
                            itemIds.add(itemNode.get("itemId").asText());
                        } else if (itemNode.has("id")) {
                            itemIds.add(itemNode.get("id").asText());
                        }
                    }
                }
            } else if (rootNode.has("itemIds") && rootNode.get("itemIds").isArray()) {
                // 형식 5: {"itemIds": [...]}
                for (JsonNode itemNode : rootNode.get("itemIds")) {
                    if (itemNode.isTextual()) {
                        itemIds.add(itemNode.asText());
                    }
                }
            } else if (rootNode.isArray()) {
                // 형식 4: ["item1", "item2", ...]
                for (JsonNode itemNode : rootNode) {
                    if (itemNode.isTextual()) {
                        itemIds.add(itemNode.asText());
                    } else if (itemNode.has("itemId")) {
                        itemIds.add(itemNode.get("itemId").asText());
                    } else if (itemNode.has("id")) {
                        itemIds.add(itemNode.get("id").asText());
                    }
                }
            } else if (rootNode.has("itemId")) {
                itemIds.add(rootNode.get("itemId").asText());
            } else {
                log.warn("알 수 없는 응답 형식 - Response: {}", responseBody);
            }
            
            log.info("파싱된 추천 상품 ID 수: {} - IDs: {}", itemIds.size(), itemIds);
            return itemIds;
            
        } catch (Exception e) {
            log.error("API 응답 파싱 실패 - Response: {}", responseBody, e);
            throw new RuntimeException("API 응답 파싱 실패: " + e.getMessage(), e);
        }
    }
}

