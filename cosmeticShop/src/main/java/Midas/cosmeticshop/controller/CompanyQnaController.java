package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.CompanyQnaDetailDTO;
import Midas.cosmeticshop.dto.CompanyQnaListDTO;
import Midas.cosmeticshop.dto.CompanyQnaPostDTO;
import Midas.cosmeticshop.service.CompanyQnaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company/qnas")
public class CompanyQnaController {

    private final CompanyQnaService companyQnaService;

    public CompanyQnaController(CompanyQnaService companyQnaService) {
        this.companyQnaService = companyQnaService;
    }

    // 내 QnA 목록 조회
    @GetMapping
    public ResponseEntity<List<CompanyQnaListDTO>> getMyCompanyQnas(Authentication authentication) {
        return ResponseEntity.ok().body(companyQnaService.getMyCompanyQnas(authentication.getName()));
    }

    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<CompanyQnaDetailDTO> getCompanyQnaDetail(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok().body(companyQnaService.getCompanyQnaDetail(id, authentication.getName()));
    }

    // 작성
    @PostMapping
    public ResponseEntity<Void> postCompanyQna(@RequestBody CompanyQnaPostDTO companyQnaPostDTO, Authentication authentication) {
        companyQnaService.postCompanyQna(companyQnaPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> putCompanyQna(@PathVariable Long id, 
                                               @RequestBody CompanyQnaPostDTO companyQnaPostDTO, 
                                               Authentication authentication) {
        companyQnaService.putCompanyQna(id, companyQnaPostDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompanyQna(@PathVariable Long id, Authentication authentication) {
        companyQnaService.deleteCompanyQna(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    // 제목 검색
    @GetMapping("/search")
    public ResponseEntity<List<CompanyQnaListDTO>> searchMyCompanyQnasByTitle(@RequestParam("title") String title, 
                                                                               Authentication authentication) {
        return ResponseEntity.ok().body(companyQnaService.searchMyCompanyQnasByTitle(title, authentication.getName()));
    }
}

