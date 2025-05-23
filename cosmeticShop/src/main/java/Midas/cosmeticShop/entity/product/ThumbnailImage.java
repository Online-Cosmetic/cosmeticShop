package Midas.cosmeticshop.entity.product;

import Midas.cosmeticshop.dto.product.ProductImageItemDTO;
import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Table(name = "thumbnail_images")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThumbnailImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    public static ThumbnailImage create(ProductImageItemDTO dto) {
        Product product = new Product();
        product.setId(dto.getProductId());

        return ThumbnailImage.builder()
            .product(product)
            .imageUrl(dto.getImageUrl())
            .build();
    }
}
