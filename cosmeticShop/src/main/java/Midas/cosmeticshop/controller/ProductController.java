package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.product.*;
import Midas.cosmeticshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
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

    /* 상품 일괄 등록 */
    @PostMapping(value = "/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerProductsBatch(
            @AuthenticationPrincipal BaseUserDetails userDetails,
            @RequestParam("file") MultipartFile zipFile //csv+images zip 파일
    ) {
        var result = productService.registerProductsBatch(userDetails, zipFile);
        return ResponseEntity.ok(result);
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
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption,
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "9") int size) {
        ProductBatchPreviewResponse response = productService.getCategorizedProductsPreview(categoryId, sortOption, keyword, page, size);
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
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption,
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "9") int size) {
        ProductBatchPreviewResponse response = productService.getCompanyProductsPreview(companyId, sortOption, keyword, page, size);
        return ResponseEntity.ok(response);
    }

    /* 카테고리 및 회사별 상품 조회 */
    @GetMapping("/batch/{categoryId}/company/{companyId}")
    public ResponseEntity<ProductBatchPreviewResponse> categoryAndCompanyProducts(
        @PathVariable int categoryId,
        @PathVariable Long companyId,
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption,
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "9") int size) {
        ProductBatchPreviewResponse response = productService.getCategoryAndCompanyProductsPreview(categoryId, companyId, sortOption, keyword, page, size);
        return ResponseEntity.ok(response);
    }

    /* 기업 회원의 상품 목록 조회 */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<Page<ProductListDTO>> getCompanyProducts(
        @PathVariable Long companyId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "sort", defaultValue = "latest") String sortOption
    ) {
        Page<ProductListDTO> products = productService.getCompanyProducts(companyId, page, size, keyword, sortOption);
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
        @RequestParam(value = "deleteAdditionalImages", defaultValue = "false") boolean deleteAdditionalImages,
        @RequestParam(value = "remainingAdditionalImageUrls", required = false) java.util.List<String> remainingAdditionalImageUrls
    ) {
        productService.updateProductImages(
            userDetails,
            productId,
            mainImage,
            additionalImages,
            deleteMainImage,
            deleteAdditionalImages,
            remainingAdditionalImageUrls
        );

        ProductDTO dto = productService.getProductInfo(productId);
        ProductImageDTO imageDTO = productService.getProductImages(productId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("product", dto);
        response.put("images", imageDTO);

        return ResponseEntity.ok(response);
    }

    /* 메인페이지용 베스트셀러 (liked 기준 인기순 상위 10개 상품) */
    @GetMapping("/batch/bestsellers")
    public ResponseEntity<ProductBatchPreviewResponse> getBestsellers() {
        ProductBatchPreviewResponse response = productService.getBestsellers();
        return ResponseEntity.ok(response);
    }

    /* 메인페이지용 추천상품 (최신순 상위 5개 품목) */
    @GetMapping("/batch/recommended")
    public ResponseEntity<ProductBatchPreviewResponse> getRecommendedProducts() {
        ProductBatchPreviewResponse response = productService.getRecommendedProducts();
        return ResponseEntity.ok(response);
    }

    /* 상품 상세페이지 관련상품 (동일 카테고리 최신순 상위 8개 품목) */
    @GetMapping("/batch/related/{categoryId}")
    public ResponseEntity<ProductBatchPreviewResponse> getRelatedProducts(
            @PathVariable int categoryId,
            @RequestParam(value = "sort", defaultValue = "latest") String sortOption,
            @RequestParam(value = "excludeProductId", required = false) Long excludeProductId) {
        ProductBatchPreviewResponse response = productService.getRelatedProducts(categoryId, sortOption, excludeProductId);
        return ResponseEntity.ok(response);
    }
}
