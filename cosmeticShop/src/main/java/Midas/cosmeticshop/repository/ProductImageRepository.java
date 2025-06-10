package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findAllByProduct_Id(Long productId);
    List<ProductImage> findAllByProduct_IdOrderByIdDesc(Long productId);
}
