package Midas.cosmeticshop.entity.product;

import Midas.cosmeticshop.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_qna")
//@Table(name = "product_qnas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductQna { /* 특정 상품에 대한 QNA */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(name = "questioned_at", updatable = false)
    private LocalDateTime questionedAt;

    @Column(name = "answered_at", updatable = false)
    private LocalDateTime answeredAt;
}
