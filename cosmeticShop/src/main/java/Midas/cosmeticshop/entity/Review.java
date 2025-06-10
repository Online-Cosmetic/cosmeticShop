package Midas.cosmeticshop.entity;

import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reviews")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /* columDefinition 옵션 공부 필요 */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int rating;

    /* 좋아요 수 */
    @Column(columnDefinition = "int default 0")
    private int liked;

    /* 싫어요 수 */
    /*
    @Column(columnDefinition = "int default 0")
    private int disliked;
    */

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "revised_at")
    private LocalDateTime revisedAt;

    /* 리뷰이미지와 양방향 연관관계 */
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewImage> reviewImages = new ArrayList<>();
}
