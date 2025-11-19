package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("SELECT c FROM Company c")
    List<Company> findAllCompanies();

    boolean existsByUserId(String companyId);

    // 승인 대기 중인 기업 회원 조회
    @Query("SELECT c FROM Company c WHERE c.approved = false")
    List<Company> findPendingApprovalCompanies();

    // 승인된 기업 회원 조회
    @Query("SELECT c FROM Company c WHERE c.approved = true")
    List<Company> findApprovedCompanies();

    // 관리자용: 기업 회원 목록 조회 (검색, 페이징, 승인 상태 필터)
    @Query(value = "SELECT c FROM Company c WHERE " +
            "(:approved IS NULL OR c.approved = :approved) AND " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.representativeName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.businessRegistrationNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY c.createdAt DESC")
    Page<Company> findAllWithSearch(
            @Param("approved") Boolean approved,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
