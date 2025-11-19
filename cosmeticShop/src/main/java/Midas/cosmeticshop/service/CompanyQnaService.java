package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.CompanyQnaDetailDTO;
import Midas.cosmeticshop.dto.CompanyQnaListDTO;
import Midas.cosmeticshop.dto.CompanyQnaPostDTO;
import Midas.cosmeticshop.entity.CompanyQna;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.repository.CompanyQnaRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CompanyQnaService {

    private final CompanyQnaRepository companyQnaRepository;
    private final CompanyRepository companyRepository;

    public CompanyQnaService(CompanyQnaRepository companyQnaRepository, CompanyRepository companyRepository) {
        this.companyQnaRepository = companyQnaRepository;
        this.companyRepository = companyRepository;
    }

    // 내 QnA 목록 조회
    public List<CompanyQnaListDTO> getMyCompanyQnas(String userId) {
        Company company = companyRepository.findByUserId(userId);
        if (company == null) {
            throw new EntityNotFoundException("기업이 존재하지 않습니다.");
        }
        List<CompanyQna> companyQnaList = companyQnaRepository.findByCompanyUserId(userId);
        List<CompanyQnaListDTO> companyQnaListDTOList = new ArrayList<>();
        for (CompanyQna companyQna : companyQnaList) {
            companyQnaListDTOList.add(new CompanyQnaListDTO(companyQna));
        }
        return companyQnaListDTOList;
    }

    // 상세 조회 (본인 것만)
    public CompanyQnaDetailDTO getCompanyQnaDetail(Long id, String userId) {
        CompanyQna companyQna = companyQnaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        
        // 본인 것인지 확인
        if (!companyQna.getCompany().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인의 QnA만 조회할 수 있습니다.");
        }
        
        return new CompanyQnaDetailDTO(companyQna);
    }

    // 작성
    public void postCompanyQna(CompanyQnaPostDTO companyQnaPostDTO, String userId) {
        Company company = companyRepository.findByUserId(userId);
        if (company == null) {
            throw new EntityNotFoundException("기업이 존재하지 않습니다.");
        }
        
        CompanyQna companyQna = new CompanyQna();
        companyQna.setCompany(company);
        companyQna.setQuestionTitle(companyQnaPostDTO.getQuestionTitle());
        companyQna.setContent(companyQnaPostDTO.getContent());
        companyQna.setQuestionedAt(LocalDateTime.now());
        
        companyQnaRepository.save(companyQna);
    }

    // 수정 (본인 것만)
    public void putCompanyQna(Long id, CompanyQnaPostDTO companyQnaPostDTO, String userId) {
        CompanyQna companyQna = companyQnaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        
        // 본인 것인지 확인
        if (!companyQna.getCompany().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인의 QnA만 수정할 수 있습니다.");
        }
        
        companyQna.setQuestionTitle(companyQnaPostDTO.getQuestionTitle());
        companyQna.setContent(companyQnaPostDTO.getContent());
        
        companyQnaRepository.save(companyQna);
    }

    // 삭제 (본인 것만)
    public void deleteCompanyQna(Long id, String userId) {
        CompanyQna companyQna = companyQnaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("QnA가 존재하지 않습니다."));
        
        // 본인 것인지 확인
        if (!companyQna.getCompany().getUserId().equals(userId)) {
            throw new AccessDeniedException("본인의 QnA만 삭제할 수 있습니다.");
        }
        
        companyQnaRepository.delete(companyQna);
    }

    // 제목 검색
    public List<CompanyQnaListDTO> searchMyCompanyQnasByTitle(String title, String userId) {
        List<CompanyQna> companyQnaList = companyQnaRepository.findByQuestionTitleContainingAndCompany_UserId(title, userId);
        List<CompanyQnaListDTO> companyQnaListDTOList = new ArrayList<>();
        for (CompanyQna companyQna : companyQnaList) {
            companyQnaListDTOList.add(new CompanyQnaListDTO(companyQna));
        }
        return companyQnaListDTOList;
    }
}

