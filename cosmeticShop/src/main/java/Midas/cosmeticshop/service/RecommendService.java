package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.product.ProductPreviewDTO;
import Midas.cosmeticshop.dto.recommend.PersonalizedRecommendationResponse;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.HourlyProductOrderStatsRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import Midas.cosmeticshop.util.AgeGroupConverter;
import Midas.cosmeticshop.util.GenderConverter;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendService {

    private final UserRepository userRepository;
    private final HourlyProductOrderStatsRepository hourlyProductOrderStatsRepository;
    private final AitemsClient aitemsClient;
    private final ProductRepository productRepository;

    public List<ProductPreviewDTO> getRecommendBySales (String userId) {
        if(!userRepository.existsByUserId(userId))
            throw new EntityNotFoundException("사용자가 존재하지 않습니다");
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(7);
        Pageable pageable = PageRequest.of(0, 5);
        List<Product> productList = hourlyProductOrderStatsRepository.findByHourBetweenOrderByQuantityDesc(start, end, pageable);
        List<ProductPreviewDTO> productPreviewDTOList = new ArrayList<>();
        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            productPreviewDTOList.add(dto);
        }
        return productPreviewDTOList;
    }

    public List<ProductPreviewDTO> getRecommendByCompany (String userId, Long companyId) {
        if(!userRepository.existsByUserId(userId))
            throw new EntityNotFoundException("사용자가 존재하지 않습니다");
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(7);
        Pageable pageable = PageRequest.of(0, 5);
        List<Product> productList = hourlyProductOrderStatsRepository.findByCompanyAndHourBetweenOrderByQuantityDesc(companyId, start, end, pageable);
        List<ProductPreviewDTO> productPreviewDTOList = new ArrayList<>();
        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            productPreviewDTOList.add(dto);
        }
        return productPreviewDTOList;
    }

    public List<ProductPreviewDTO> getRecommendByCategory (String userId, Long categoryId) {
        if(!userRepository.existsByUserId(userId))
            throw new EntityNotFoundException("사용자가 존재하지 않습니다");
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(7);
        Pageable pageable = PageRequest.of(0, 5);
        List<Product> productList = hourlyProductOrderStatsRepository.findByCategoryAndHourBetweenOrderByQuantityDesc(categoryId, start, end, pageable);
        List<ProductPreviewDTO> productPreviewDTOList = new ArrayList<>();
        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            productPreviewDTOList.add(dto);
        }
        return productPreviewDTOList;
    }

    /**
     * AiTEMS 개인화 추천 (배치 학습 기반, 로그인 유저 전용)
     * @param userId 사용자 ID (BaseUser.id를 String으로 변환한 값)
     * @return 추천 상품 리스트와 사용자 정보를 포함한 응답 (5개)
     */
    public PersonalizedRecommendationResponse getPersonalizedRecommendations(String userId) {
        log.info("개인화 추천 요청 - userId: {}", userId);
        
        // 사용자 정보 조회 (추천 이유 표시용)
        User user = userRepository.findById(Long.parseLong(userId))
            .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        
        String ageGroup = AgeGroupConverter.toAgeGroup(user.getAge());
        String gender = GenderConverter.toGender(user.getGenderType());
        
        try {
            // AiTEMS에서 추천 받기 (5개)
            List<String> itemIds = aitemsClient.getPersonalizedRecommendations(userId, 5);
            log.info("AiTEMS 개인화 추천 결과: {}개 - IDs: {}", itemIds.size(), itemIds);
            
            // ITEM_ID (String)를 Long productId로 변환하여 상품 조회
            List<Product> products = convertItemIdsToProducts(itemIds);
            log.info("변환된 상품 수: {}개", products.size());
            
            if (products.isEmpty()) {
                log.warn("AiTEMS 추천 상품이 모두 조회되지 않음. Fallback으로 전환");
                throw new RuntimeException("추천 상품 조회 실패");
            }
            
            // 최대 5개만 반환
            List<ProductPreviewDTO> productDTOs = products.stream()
                .limit(5)
                .map(ProductPreviewDTO::from)
                .collect(Collectors.toList());
            
            log.info("최종 반환할 추천 상품 수: {}개 (최대 5개 제한)", productDTOs.size());
            
            return PersonalizedRecommendationResponse.builder()
                .products(productDTOs)
                .ageGroup(ageGroup)
                .gender(gender)
                .build();
                
        } catch (Exception e) {
            log.warn("AiTEMS 개인화 추천 실패, Fallback으로 판매량 기반 추천 사용: {}", e.getMessage());
            // Fallback: 기존 판매량 기반 추천
            // getRecommendBySales는 user_id (문자열)를 받아야 하므로 user.getUserId() 사용
            List<ProductPreviewDTO> fallbackProducts = getRecommendBySales(user.getUserId());
            return PersonalizedRecommendationResponse.builder()
                .products(fallbackProducts)
                .ageGroup(ageGroup)
                .gender(gender)
                .build();
        }
    }

    /**
     * ITEM_ID 리스트를 Product 엔티티 리스트로 변환
     * @param itemIds ITEM_ID 리스트 (String)
     * @return Product 리스트
     */
    private List<Product> convertItemIdsToProducts(List<String> itemIds) {
        List<Product> products = new ArrayList<>();
        List<String> notFoundIds = new ArrayList<>();
        List<String> inactiveIds = new ArrayList<>();
        
        log.info("ITEM_ID를 Product로 변환 시작 - 총 {}개", itemIds.size());
        
        for (String itemId : itemIds) {
            try {
                Long productId = Long.parseLong(itemId);
                Optional<Product> productOpt = productRepository.findByIdAndActiveTrue(productId);
                
                if (productOpt.isPresent()) {
                    products.add(productOpt.get());
                    log.debug("상품 조회 성공 - ID: {}", productId);
                } else {
                    // 상품이 없거나 비활성화된 경우 확인
                    Optional<Product> inactiveProduct = productRepository.findById(productId);
                    if (inactiveProduct.isPresent()) {
                        inactiveIds.add(itemId);
                        log.warn("비활성화된 상품 - ID: {}", productId);
                    } else {
                        notFoundIds.add(itemId);
                        log.warn("존재하지 않는 상품 - ID: {}", productId);
                    }
                }
            } catch (NumberFormatException e) {
                log.warn("유효하지 않은 ITEM_ID: {}", itemId);
            }
        }
        
        log.info("변환된 상품 수: {}/{} (존재하지 않음: {}, 비활성화: {})", 
            products.size(), itemIds.size(), notFoundIds.size(), inactiveIds.size());
        
        if (!notFoundIds.isEmpty()) {
            log.warn("존재하지 않는 상품 ID: {}", notFoundIds);
        }
        if (!inactiveIds.isEmpty()) {
            log.warn("비활성화된 상품 ID: {}", inactiveIds);
        }
        
        return products;
    }
}
