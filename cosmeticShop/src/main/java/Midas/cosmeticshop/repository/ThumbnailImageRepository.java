package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.product.ThumbnailImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ThumbnailImageRepository extends JpaRepository<ThumbnailImage, Long> {
    Optional<ThumbnailImage> findByProduct_Id(Long productId);
}
