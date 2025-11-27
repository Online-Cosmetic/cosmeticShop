package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.product.ProductPreviewDTO;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.repository.HourlyProductOrderStatsRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendService {

    private final UserRepository userRepository;
    private final HourlyProductOrderStatsRepository hourlyProductOrderStatsRepository;

    public RecommendService(UserRepository userRepository, HourlyProductOrderStatsRepository hourlyProductOrderStatsRepository) {
        this.userRepository = userRepository;
        this.hourlyProductOrderStatsRepository = hourlyProductOrderStatsRepository;
    }

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
}
