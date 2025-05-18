package Midas.cosmeticshop.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/* Order 에 들어갈 불변 값 타입 */
@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderAddress {
    private String city;
    private String street;
    private String detail;
}
