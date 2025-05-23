package Midas.cosmeticshop.entity;

import Midas.cosmeticshop.entity.user.User;
import jakarta.persistence.*;
import lombok.*;


@Builder
@Entity
@Table(name = "addresses")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Address { // 한명이 여러개의 주소를 가질 수 있다면 테이블 분리가 합리적인듯

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String detail;

    public void updateAddress(String city, String street, String detail) {
        this.city = city;
        this.street = street;
        this.detail = detail;
    }

}