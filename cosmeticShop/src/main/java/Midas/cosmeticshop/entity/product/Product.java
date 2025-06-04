package Midas.cosmeticshop.entity.product;

import Midas.cosmeticshop.dto.product.ProductDTO;
import Midas.cosmeticshop.dto.product.ProductUpdateDTO;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.user.Company;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Product {

    /* 상품 이미지는 따로 구현 */
    public static Product from(ProductDTO dto, Company company) {
        return Product.builder()
            .id(dto.getProductId())
            .company(company)
            .categoryId(dto.getCategoryId())
            .productName(dto.getProductName())
            .description(dto.getDescription())
            .price(dto.getPrice())
            .stock(dto.getStock())
            .liked(0)                       // 처음은 좋아요 0
            .discountRate(0)          // 처음은 할인율 0
            .createdAt(LocalDateTime.now())
            .thumbnailImage(null)
            .productImages( new ArrayList<>())             // 리스트 초기화 안하면 NullPointerException 발생
            .reviews( new ArrayList<>())                         // 리스트 초기화 안하면 NullPointerException 발생
            .build();
    }

    public void modifyFields(ProductUpdateDTO dto) {
        this.categoryId = dto.getCategoryId();
        this.productName = dto.getProductName();
        this.description = dto.getDescription();
        this.discountRate = dto.getDiscountRate();
        this.price = dto.getPrice();
        this.stock = dto.getStock();
    }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* 상품이 소속된 회사와의 연관관계 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    /* 상품 카테고리 : SKIN, HAIR ... */
    @Column(name = "category_id", nullable = false)
    private int categoryId;

    @Column(name = "name", nullable = false)
    private String productName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int stock;

    /* 이 상품을 찜한 사람 수 */
    @Column(nullable = false, columnDefinition = "int default 0")
    private int liked;

    @Column(name = "discount", columnDefinition = "int default 0")
    private int discountRate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private ThumbnailImage thumbnailImage;

    /* 여러개의 상품 이미지를 보유 */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> productImages;

    /* 해당 상품에 등록된 리뷰들 */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
}