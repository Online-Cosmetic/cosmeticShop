package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
}
