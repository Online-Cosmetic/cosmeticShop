package Midas.cosmeticshop.entity.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "hourly_product_order_stats")
@Getter
@Setter
public class HourlyProductOrderStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "hour", nullable = false)
    private String hour;

    @Column(name = "quantity", nullable = false)
    private Long quantity;
}
