package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findById(Long id);
    Optional<Product> findByProductName(String productName);
    Optional<Product> findByProductNameAndCategoryId(String productName, Long categoryId);

    List<Product> findAllByCategoryId(int categoryId);
    List<Product> findAllByOrderByLikedDesc();
    List<Product> findAllByOrderByIdDesc();

    List<Product> findByCompanyId(Long companyId);
    // 무한 스크롤을 위한 페이징 메소드 추가
    Page<Product> findByCompanyId(Long companyId, Pageable pageable);
}
