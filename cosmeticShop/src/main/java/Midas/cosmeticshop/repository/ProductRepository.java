package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.dto.HourlyProductOrderStatsBatchDTO;
import Midas.cosmeticshop.entity.product.Product;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 기존 메서드를 active 필터링으로 수정
    Optional<Product> findByIdAndActiveTrue(Long id);
    Optional<Product> findByProductNameAndActiveTrue(String productName);
    Optional<Product> findByProductNameAndCategoryIdAndActiveTrue(String productName, Long categoryId);

    List<Product> findAllByCategoryIdAndActiveTrue(int categoryId);
    List<Product> findAllByActiveTrueOrderByLikedDesc();
    List<Product> findAllByActiveTrueOrderByIdDesc();

    List<Product> findByCompanyIdAndActiveTrue(Long companyId);
    Page<Product> findByCompanyIdAndActiveTrue(Long companyId, Pageable pageable);

    Optional<Product> findById(Long id);
    Optional<Product> findByProductName(String productName);
    Optional<Product> findByProductNameAndCategoryId(String productName, Long categoryId);

    List<Product> findAllByCategoryId(int categoryId);
    List<Product> findAllByOrderByLikedDesc();
    List<Product> findAllByOrderByIdDesc();

    List<Product> findByCompanyId(Long companyId);
    // 무한 스크롤을 위한 페이징 메소드 추가
    Page<Product> findByCompanyId(Long companyId, Pageable pageable);

    // 가격 정렬 관련 메소드
    List<Product> findAllByActiveTrueOrderByPriceAsc();
    List<Product> findAllByActiveTrueOrderByPriceDesc();

    // 카테고리별 정렬 관련 메소드
    List<Product> findAllByCategoryIdAndActiveTrueOrderByLikedDesc(int categoryId);
    List<Product> findAllByCategoryIdAndActiveTrueOrderByPriceAsc(int categoryId);
    List<Product> findAllByCategoryIdAndActiveTrueOrderByPriceDesc(int categoryId);
    List<Product> findAllByCategoryIdAndActiveTrueOrderByIdDesc(int categoryId);

    // 회사별 정렬 관련 메소드
    List<Product> findByCompanyIdAndActiveTrueOrderByLikedDesc(Long companyId);
    List<Product> findByCompanyIdAndActiveTrueOrderByPriceAsc(Long companyId);
    List<Product> findByCompanyIdAndActiveTrueOrderByPriceDesc(Long companyId);
    List<Product> findByCompanyIdAndActiveTrueOrderByIdDesc(Long companyId);

    // 카테고리 및 회사별 정렬 관련 메소드
    List<Product> findByCategoryIdAndCompanyIdAndActiveTrueOrderByLikedDesc(int categoryId, Long companyId);
    List<Product> findByCategoryIdAndCompanyIdAndActiveTrueOrderByPriceAsc(int categoryId, Long companyId);
    List<Product> findByCategoryIdAndCompanyIdAndActiveTrueOrderByPriceDesc(int categoryId, Long companyId);
    List<Product> findByCategoryIdAndCompanyIdAndActiveTrueOrderByIdDesc(int categoryId, Long companyId);
}
