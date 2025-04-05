package Midas.cosmeticShop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id @GeneratedValue
    private Long id;

    @Column(name = "user_id", unique = true)
    private String userId;

    @Column(nullable = false)
    private String password;

    /* 사용자 실제 이름 */
    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private int age;

    /* 여기 @Enumerated(EnumType.STRING) 으로 수정할듯 */
    @Column(name = "gender", nullable = false)
    private GenderType genderType;

    /* 테이블에 unique 추가 필요 */
    @Column(name = "nickname", unique = true, nullable = false)
    private String nickName;

    @Column(name = "email", unique = true)
    private String emailAddress;

    @Column(columnDefinition = "int default 1000000")
    private int points;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /* 소셜 로그인 플랫폼 */
    @Column
    private String provider;

    /* 소셜 로그인을 위한 Id */
    @Column
    private String providerId;

    /* address 는 User 엔티티에서 가지고 있는 걸로 변경 ? */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses;

//    @Embedded
//    private List<newAddress> addresses;

    /* 2차 수정 : Cart List 추가 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cart> carts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Qna> questions;

    /* 사용자가 가진 쿠폰 목록을 저장 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CouponMapping> coupons;

}