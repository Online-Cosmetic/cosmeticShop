package Midas.cosmeticShop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_options")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "option_name", nullable = false)
    private String optionName;

    @Column(name = "option_value", nullable = false)
    private String optionValue;

    @Column(name = "price", columnDefinition = "int default 0")
    private int price;

}
