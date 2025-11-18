package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Company findByUserId(String userId);
    boolean existsByCompanyName(String companyName);
    Boolean existsByEmailAddress(String email);
    Boolean existsByPhoneNumber(String phoneNumber);
    Boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);
    Optional<Company> findByCompanyName (String companyName);

    @Query("SELECT c.companyName FROM Company c")
    List<String> findAllCompanyNames();

    boolean existsByUserId(String companyId);

    // 승인 대기 중인 기업 회원 조회
    @Query("SELECT c FROM Company c WHERE c.approved = false")
    List<Company> findPendingApprovalCompanies();

    // 승인된 기업 회원 조회
    @Query("SELECT c FROM Company c WHERE c.approved = true")
    List<Company> findApprovedCompanies();
}
