package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.product.*;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        @RequestParam("mainImage") MultipartFile mainImage,
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

    /* 상품 수정 */
    @PutMapping("/{productId}")
    public ResponseEntity<Void> replaceProduct(
        @RequestHeader(value = "Authorization", required = false) String accessToken,
        @PathVariable Long productId,
        @ModelAttribute ProductUpdateDTO dto,
        @RequestParam(value = "newImages", required = false) MultipartFile[] newImages
    ) {
        productService.replaceProduct(accessToken, productId, dto, newImages);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<ProductBatchPreviewResponse> categorizedProducts(@PathVariable int categoryId) {
        ProductBatchPreviewResponse response = productService.getCategorizedProductsPreview(categoryId);
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
}
