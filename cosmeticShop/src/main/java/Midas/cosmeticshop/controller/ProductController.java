package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.product.*;
import Midas.cosmeticshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /* 상품 등록 */
    @PostMapping("")
    public ResponseEntity<?> registerProduct(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @ModelAttribute ProductDTO productDTO,
        @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
        @RequestParam(value = "additionalImages", required=false) MultipartFile[] additionalImages
    ) {
        productService.registerProduct(userDetails, productDTO, mainImage, additionalImages);
        return ResponseEntity.ok().build();
    }

    /* 상품 상세 조회  */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailResponseDTO> getProductDetail(@PathVariable Long productId) {
        ProductDTO dto = productService.getProductInfo(productId);
        ProductImageDTO imageDTO = productService.getProductImages(productId);
        ProductDetailResponseDTO responseDTO = new ProductDetailResponseDTO(dto, imageDTO);
        return ResponseEntity.ok(responseDTO);
    }


    /* 상품 삭제 */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
        @RequestHeader(value = "Authorization", required = false) String accessToken,
        @PathVariable Long productId) {
        productService.deleteProduct(accessToken, productId);
        return ResponseEntity.noContent().build();
    }

    /* 카테고리별 상품 조회 */
    @GetMapping("/batch/{categoryId}")
    public ResponseEntity<ProductBatchPreviewResponse> categorizedProducts(
        @PathVariable int categoryId,
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption) {
        ProductBatchPreviewResponse response = productService.getCategorizedProductsPreview(categoryId, sortOption);
        return ResponseEntity.ok(response);
    }

    /* 카테고리 무관 인기순 조회 : liked */
    @GetMapping("/batch/popular")
    public ResponseEntity<ProductBatchPreviewResponse> popularProducts() {
        ProductBatchPreviewResponse response = productService.getPopularProductsPreview();
        return ResponseEntity.ok(response);
    }

    /* 카테고리 무관 최신순 조회 */
    @GetMapping("/batch/latest")
    public ResponseEntity<ProductBatchPreviewResponse> latestProducts() {
        ProductBatchPreviewResponse response = productService.getLatestProductsPreview();
        return ResponseEntity.ok(response);
    }

    /* 카테고리 무관 가격순 조회 */
    @GetMapping("/batch/price")
    public ResponseEntity<ProductBatchPreviewResponse> priceProducts(
        @RequestParam(value = "order", defaultValue = "asc") String order) {
        ProductBatchPreviewResponse response = productService.getPriceOrderedProductsPreview(order);
        return ResponseEntity.ok(response);
    }

    /* 회사별 상품 조회 */
    @GetMapping("/batch/company/{companyId}")
    public ResponseEntity<ProductBatchPreviewResponse> companyProducts(
        @PathVariable Long companyId,
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption) {
        ProductBatchPreviewResponse response = productService.getCompanyProductsPreview(companyId, sortOption);
        return ResponseEntity.ok(response);
    }

    /* 카테고리 및 회사별 상품 조회 */
    @GetMapping("/batch/{categoryId}/company/{companyId}")
    public ResponseEntity<ProductBatchPreviewResponse> categoryAndCompanyProducts(
        @PathVariable int categoryId,
        @PathVariable Long companyId,
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption) {
        ProductBatchPreviewResponse response = productService.getCategoryAndCompanyProductsPreview(categoryId, companyId, sortOption);
        return ResponseEntity.ok(response);
    }

    /* 기업 회원의 상품 목록 조회 */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<Page<ProductListDTO>> getCompanyProducts(
        @PathVariable Long companyId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProductListDTO> products = productService.getCompanyProducts(companyId, page, size);
        return ResponseEntity.ok(products);
    }

    /* 상품 수정 */
    @PutMapping("/{productId}")
    public ResponseEntity<Void> replaceProduct(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @PathVariable Long productId,
        @RequestBody ProductUpdateDTO dto
    ) {
        productService.replaceProduct(userDetails, productId, dto, null);
        return ResponseEntity.noContent().build();
    }

    /* 상품 설명만 수정 */
    @PatchMapping("/{productId}/description")
    public ResponseEntity<Void> updateProductDescription(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @PathVariable Long productId,
        @RequestBody ProductDescriptionDTO dto
    ) {
        productService.updateProductDescription(userDetails, productId, dto.getDescription());
        return ResponseEntity.noContent().build();
    }

    /* 상품 이미지 교체 - 개선된 버전 */
    @PutMapping("/{productId}/images")
    public ResponseEntity<?> updateProductImages(
        @AuthenticationPrincipal BaseUserDetails userDetails,
        @PathVariable Long productId,
        @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
        @RequestParam(value = "additionalImages", required = false) MultipartFile[] additionalImages,
        @RequestParam(value = "deleteMainImage", defaultValue = "false") boolean deleteMainImage,
        @RequestParam(value = "deleteAdditionalImages", defaultValue = "false") boolean deleteAdditionalImages
    ) {
        productService.updateProductImages(userDetails, productId, mainImage, additionalImages,
            deleteMainImage, deleteAdditionalImages);

        ProductDTO dto = productService.getProductInfo(productId);
        ProductImageDTO imageDTO = productService.getProductImages(productId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("product", dto);
        response.put("images", imageDTO);

        return ResponseEntity.ok(response);
    }
}
