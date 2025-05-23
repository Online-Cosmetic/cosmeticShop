package Midas.cosmeticshop.entity.product;

import Midas.cosmeticshop.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_like")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Column
    private LocalDateTime createdAt;

}
