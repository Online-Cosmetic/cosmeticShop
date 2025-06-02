package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public Optional<Product> findById(Long id);
    public Optional<Product> findByProductName(String productName);
    public Optional<Product> findByProductNameAndCategoryId(String productName, Long categoryId);

    List<Product> findAllByCategoryId(int categoryId);
    List<Product> findAllByOrderByLikedDesc();
    List<Product> findAllByOrderByIdDesc();
}
