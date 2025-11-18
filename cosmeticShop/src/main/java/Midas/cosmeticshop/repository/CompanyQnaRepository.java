package Midas.cosmeticshop.repository;

import Midas.cosmeticshop.entity.CompanyQna;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyQnaRepository extends JpaRepository<CompanyQna, Long> {
    // 기업별 QnA 조회
    List<CompanyQna> findByCompanyUserId(String userId);
    
    // QnA 상세 조회
    Optional<CompanyQna> findById(Long id);
    
    // 답변 완료 QnA
    List<CompanyQna> findByAnswerIsNotNull();
    
    // 답변 대기 QnA
    List<CompanyQna> findByAnswerIsNull();
    
    // 제목 검색
    List<CompanyQna> findByQuestionTitleContaining(String title);
    
    // 기업별 제목 검색
    List<CompanyQna> findByQuestionTitleContainingAndCompany_UserId(String title, String userId);
    
    // 답변완료 + 제목 검색
    List<CompanyQna> findByAnswerIsNotNullAndQuestionTitleContaining(String questionTitle);
    
    // 답변대기 + 제목 검색
    List<CompanyQna> findByAnswerIsNullAndQuestionTitleContaining(String questionTitle);
}

