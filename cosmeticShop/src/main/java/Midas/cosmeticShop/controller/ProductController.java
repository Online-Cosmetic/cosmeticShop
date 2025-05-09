package Midas.cosmeticShop.controller;

import Midas.cosmeticShop.dto.Product.ProductDTO;
import Midas.cosmeticShop.dto.Product.ProductDetailResponseDTO;
import Midas.cosmeticShop.dto.Product.ProductImageDTO;
import Midas.cosmeticShop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
        @CookieValue(value = "access", required = false) String accessToken,
        @ModelAttribute ProductDTO productDTO,
        @RequestParam("mainImage") MultipartFile mainImage,
        @RequestParam(value = "additionalImages", required=false) MultipartFile[] additionalImages
    ) {
        productService.registerProduct(accessToken, productDTO, mainImage, additionalImages);
        return ResponseEntity.ok().build();
    }


    /* 상품 상세 조회 (수정 폼용 데이터 반환) : 권한 검증필요 X */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailResponseDTO> getProductDetail(@PathVariable Long productId) {

        ProductDTO dto = productService.getProductInfo(productId);
        ProductImageDTO imageDTO = productService.getProductImages(productId);

        ProductDetailResponseDTO responseDTO = new ProductDetailResponseDTO(dto, imageDTO);
        return ResponseEntity.ok(responseDTO);
    }


    /* 상품 정보 수정 : 작업중 */
    @PutMapping("/{productId}")
    public String replaceProduct(@PathVariable Long productId) {
        // 정보 수정 + 사진 수정
        return "";
    }

    /* 상품 삭제 : 작업중 */
    @DeleteMapping("/{productId}")
    public String deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return "";
    }
}
