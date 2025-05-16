package Midas.cosmeticshop.entity.user;

import Midas.cosmeticshop.dto.signup.CompanySignUpDTO;
import Midas.cosmeticshop.entity.product.Product;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@SuperBuilder
@Entity
@Table(name = "companies")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company extends BaseUser {

    public static Company create(CompanySignUpDTO dto, BCryptPasswordEncoder enc) {
        return Company.builder()
            .userId(dto.getUserId())
            .password(enc.encode(dto.getPassword()))
            .companyName(dto.getCompanyName())
            .emailAddress(dto.getEmail())
            .phoneNumber(dto.getPhoneNumber())
            .approved(false)
            .role(UserRole.COMPANY)
            .createdAt(LocalDateTime.now())
            .build();
    }

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "phone")
    private String phoneNumber;

    @Column(name = "email", unique = true, nullable = false)
    private String emailAddress;

    @Column
    private boolean approved;


    /* orphanRemoval 옵션도 고려 */
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Product> products;

}
