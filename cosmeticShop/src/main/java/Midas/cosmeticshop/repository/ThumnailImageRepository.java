package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.ThumbnailImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThumnailImageRepository extends JpaRepository<ThumbnailImage, Long> {
    ThumbnailImage findByProductId(Long productId);
}
