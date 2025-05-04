package Midas.cosmeticShop.entity;

import Midas.cosmeticShop.entity.Users.Company;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* 상품이 소속된 회사와의 연관관계 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    /* 상품 카테고리 -> 아래의 ProductType 을 어떻게 활용할지 생각해야할듯 */
    @Column(name = "category_id", nullable = false)
    private int categoryId;

    /* SKIN, HAIR ... */
//    @Enumerated(EnumType.STRING)
//    private ProductType productType;


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

    /* 2차 수정 : Product_Image 테이블로 분리 -> 이미지 List 로 보관 */
//    @Column(name = "image_url", nullable = false)
//    private String imageUrl;

    /* 여러개의 상품 이미지를 보유 */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> productImages;

    /* 동일 제품의 여러 사이즈, 색상 등을 위함 */
    @OneToMany(mappedBy = "product")
    private List<ProductOption> productOptions;
}