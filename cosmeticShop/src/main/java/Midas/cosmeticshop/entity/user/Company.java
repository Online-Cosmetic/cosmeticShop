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
            .businessRegistrationNumber(dto.getBusinessRegistrationNumber())
            .representativeName(dto.getRepresentativeName())
            .businessType(dto.getBusinessType())
            .businessAddress(dto.getBusinessAddress())
            .contactPersonName(dto.getContactPersonName())
            .contactPhoneNumber(dto.getContactPhoneNumber())
            .businessLicensePath(dto.getBusinessLicensePath())
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

    @Column(name = "business_registration_number", unique = true, nullable = false)
    private String businessRegistrationNumber;  // 사업자등록번호

    @Column(name = "representative_name", nullable = false)
    private String representativeName;          // 대표자명

    @Column(name = "business_type")
    private String businessType;                // 업종/업태

    @Column(name = "business_address")
    private String businessAddress;             // 사업장 주소 (nullable)

    @Column(name = "contact_person_name", nullable = false)
    private String contactPersonName;           // 담당자명

    @Column(name = "contact_phone_number", nullable = false)
    private String contactPhoneNumber;          // 담당자 휴대폰 번호

    @Column(name = "business_license_path")
    private String businessLicensePath;         // 사업자등록증 파일 경로

    @Column
    private boolean approved;


    /* orphanRemoval 옵션도 고려 */
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Product> products;

}
