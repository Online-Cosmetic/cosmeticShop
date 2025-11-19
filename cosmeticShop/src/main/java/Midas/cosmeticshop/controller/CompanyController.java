package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.CompanyInfoDTO;
import Midas.cosmeticshop.dto.CompanyNamesDTO;
import Midas.cosmeticshop.dto.product.ProductListDTO;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import Midas.cosmeticshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final ProductService productService;
    private final CompanyRepository companyRepository;

    /* 로그인한 기업의 상품 목록 조회 */
    @GetMapping("/products")
    public ResponseEntity<Page<ProductListDTO>> getMyProducts(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption
    ) {
        // 현재 로그인한 기업 회원의 ID를 가져옴
        String userId = userDetails.getUsername();
        Long companyId = productService.getCompanyIdByUserId(userId);

        Page<ProductListDTO> products = productService.getCompanyProducts(companyId, page, size, keyword, sortOption);
        return ResponseEntity.ok(products);
    }

    /* 등록된 모든 기업명을 조회 (관리자용) */
    @GetMapping("/names")
    public ResponseEntity<CompanyNamesDTO> getAllCompanies(
        @AuthenticationPrincipal BaseUserDetails userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        if(!role.equals("ROLE_ADMIN")) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(new CompanyNamesDTO(companyRepository.findAllCompanyNames()));
    }

    /* 등록된 모든 기업명을 조회 (공개) */
    @GetMapping("/names/public")
    public ResponseEntity<CompanyNamesDTO> getAllCompaniesPublic() {
        return ResponseEntity.ok(new CompanyNamesDTO(companyRepository.findAllCompanyNames()));
    }

    /* 등록된 모든 기업 정보(이름, ID)를 조회 (공개) */
    @GetMapping("/info/public")
    public ResponseEntity<List<CompanyInfoDTO>> getAllCompaniesInfoPublic() {
        List<Company> companies = companyRepository.findAllCompanies();
        List<CompanyInfoDTO> companyInfoList = companies.stream()
                .map(company -> new CompanyInfoDTO(company.getId(), company.getCompanyName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(companyInfoList);
    }
}
