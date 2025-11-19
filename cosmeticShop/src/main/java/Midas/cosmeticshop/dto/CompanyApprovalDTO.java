package Midas.cosmeticshop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyApprovalDTO {
    private Long id;
    private String userId;
    private String companyName;
    private String email;
    private String phoneNumber;
    private String businessRegistrationNumber;
    private String representativeName;
    private String businessType;
    private String businessAddress;
    private String contactPersonName;
    private String contactPhoneNumber;
    private String businessLicensePath;
    private Boolean approved;
    private LocalDateTime createdAt;
}

