package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.dto.HourlyProductOrderStatsBatchDTO;
import Midas.cosmeticshop.entity.product.Product;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
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

    //베스트셀러용 인기(liked) 상위 10개 상품 조회
    List<Product> findTop10ByActiveTrueOrderByLikedDesc();
    //추천상품용 최신 상위 10개 상품 조회
    List<Product> findTop5ByActiveTrueOrderByIdDesc();
    //관련상품용 동일 카테고리 정렬기준별 상위 8개 상품 조회 (latest로 구현되어있으나 확장성을 위해 다른 정렬기준도 유지)
    List<Product> findTop8ByCategoryIdAndActiveTrueOrderByLikedDesc(int categoryId);
    List<Product> findTop8ByCategoryIdAndActiveTrueOrderByPriceAsc(int categoryId);
    List<Product> findTop8ByCategoryIdAndActiveTrueOrderByPriceDesc(int categoryId);
    List<Product> findTop8ByCategoryIdAndActiveTrueOrderByIdDesc(int categoryId);
    
    //관련상품용 동일 카테고리 정렬기준별 상위 9개 상품 조회 (현재 상품 제외 후 8개를 보장하기 위해)
    List<Product> findTop9ByCategoryIdAndActiveTrueOrderByLikedDesc(int categoryId);
    List<Product> findTop9ByCategoryIdAndActiveTrueOrderByPriceAsc(int categoryId);
    List<Product> findTop9ByCategoryIdAndActiveTrueOrderByPriceDesc(int categoryId);
    List<Product> findTop9ByCategoryIdAndActiveTrueOrderByIdDesc(int categoryId);

    // AiTEMS용: 활성화된 모든 상품 조회
    default List<Product> findAllActiveProductsForAitems() {
        return findAllByActiveTrueOrderByIdDesc();
    }
}
