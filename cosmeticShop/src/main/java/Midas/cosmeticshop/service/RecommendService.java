package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.product.ProductPreviewDTO;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.repository.HourlyProductOrderStatsRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
     * @return 추천 상품 리스트 (10개)
     */
    public List<ProductPreviewDTO> getPersonalizedRecommendations(String userId) {
        log.info("개인화 추천 요청 - userId: {}", userId);
        
        try {
            // AiTEMS에서 추천 받기 (10개)
            List<String> itemIds = aitemsClient.getPersonalizedRecommendations(userId, 10);
            log.info("AiTEMS 개인화 추천 결과: {}개", itemIds.size());
            
            // ITEM_ID (String)를 Long productId로 변환하여 상품 조회
            List<Product> products = convertItemIdsToProducts(itemIds);
            
            return products.stream()
                .map(ProductPreviewDTO::from)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.warn("AiTEMS 개인화 추천 실패, Fallback으로 판매량 기반 추천 사용: {}", e.getMessage());
            // Fallback: 기존 판매량 기반 추천
            return getRecommendBySales(userId);
        }
    }

    /**
     * ITEM_ID 리스트를 Product 엔티티 리스트로 변환
     * @param itemIds ITEM_ID 리스트 (String)
     * @return Product 리스트
     */
    private List<Product> convertItemIdsToProducts(List<String> itemIds) {
        List<Product> products = new ArrayList<>();
        
        for (String itemId : itemIds) {
            try {
                Long productId = Long.parseLong(itemId);
                productRepository.findByIdAndActiveTrue(productId)
                    .ifPresent(products::add);
            } catch (NumberFormatException e) {
                log.warn("유효하지 않은 ITEM_ID: {}", itemId);
            }
        }
        
        log.debug("변환된 상품 수: {}/{}", products.size(), itemIds.size());
        return products;
    }
}
