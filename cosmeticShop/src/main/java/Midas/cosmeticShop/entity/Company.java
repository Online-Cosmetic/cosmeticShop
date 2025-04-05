package Midas.cosmeticShop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.security.Timestamp;
import java.util.List;

@Entity
@Table(name = "companies")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id @GeneratedValue
    private Long id;

    /* 기업 로그인을 위한 아이디 */
    @Column(name = "company_id", unique = true, nullable = false)
    String companyId;

    @Column(nullable = false)
    String password;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "phone")
    private String phoneNumber;

    @Column(name = "email", unique = true, nullable = false)
    private String emailAddress;

    @Column
    private boolean approved;

    @Column(name = "created_at", nullable = false)
//    @CreationTimestamp
    private Timestamp createdAt;

    /* orphanRemoval 옵션도 고려 */
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Product> products;
}
