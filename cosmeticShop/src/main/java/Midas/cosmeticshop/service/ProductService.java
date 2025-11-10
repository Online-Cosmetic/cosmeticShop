package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.product.*;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.product.ProductImage;
import Midas.cosmeticshop.entity.product.ThumbnailImage;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.repository.ProductImageRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.ThumbnailImageRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ThumbnailImageRepository thumnailImageRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final FileStorageService fileStorageService;
    private final JWTUtil jwtUtil;

    /* 상품 등록 :  상품정보 + 이미지들 */
    public void registerProduct(
        BaseUserDetails userDetails,
        ProductDTO dto,
        MultipartFile mainImage,
        MultipartFile[] additionalImages) {

        // 토큰에서 사용자 아이디와 Role 을 추출
        String userId = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        if (!"ROLE_COMPANY".equals(role)) {
            throw new IllegalArgumentException("권한이 없습니다. 기업 회원만 상품 등록이 가능합니다.");
        }

        // dto 기반으로 엔티티 생성
        Product product = Product.from(dto, companyRepository.findByUserId(userId));

        // 상품 저장 (Cascade 옵션을 이용하면 연관 이미지들도 함께 저장)
        productRepository.save(product);

        // 메인 이미지 저장 후 URL 세팅
        ThumbnailImage thumbnailImage;
        if (mainImage != null && !mainImage.isEmpty()) {
            String mainImageUrl = fileStorageService.storeFile(mainImage);
            thumbnailImage = ThumbnailImage.create(new ProductImageItemDTO(product.getId(), mainImageUrl));
            product.setThumbnailImage(thumbnailImage);
            thumnailImageRepository.save(thumbnailImage);
        }

        List<ProductImage> productImages = new ArrayList<>();
        if (additionalImages != null) {
            for (MultipartFile image : additionalImages) {
                if (!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    ProductImage productImage = new ProductImage();
                    productImage.setProduct(product);
                    productImage.setImageUrl(imageUrl);
                    productImages.add(productImage);
                }
            }
        }
        product.getProductImages().addAll(productImages);
        productImageRepository.saveAll(Objects.requireNonNull(product.getProductImages()));
    }

    /* 상품 정보 조회 */
    @Transactional(readOnly = true)
    public ProductDTO getProductInfo(Long productId) {
//        Product product = productRepository.findById(productId)
        Product product = productRepository.findByIdAndActiveTrue(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));
        return ProductDTO.from(product);
    }

    /* 이미지 URL DTO 반환 */
    public ProductImageDTO getProductImages(Long productId) {
        Product product = productRepository.findByIdAndActiveTrue(productId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));

        List<ProductImage> orderedImages = productImageRepository.findAllByProduct_IdOrderByIdDesc(productId);

        List<ProductImageItemDTO> imageItems = new ArrayList<>();
        for (ProductImage productImage : orderedImages) {
            String imageUrl = productImage.getImageUrl();

            // 🔧 S3 퍼블릭 URL로 변환
            if (imageUrl.startsWith("/images/")) {
                imageUrl = "https://cosmall-image-bucket.s3.ap-northeast-2.amazonaws.com" + imageUrl;
            }

            imageItems.add(new ProductImageItemDTO(productId, imageUrl));
        }
        return new ProductImageDTO(imageItems);
    }

    /* 상품 정보 수정 */
    @Transactional // dirty checking
    public void replaceProduct(BaseUserDetails userDetails, Long productId,
                               ProductUpdateDTO dto, MultipartFile newImage) {
        // 1. 권한 검증 (COMPANY)
        String userRole = userDetails.getAuthorities().iterator().next().getAuthority();
        if(!userRole.equals("ROLE_COMPANY")) throw new IllegalArgumentException("권한이 없습니다.");

        // 2. 엔티티 조회
//        Product product = productRepository.findById(productId)
        Product product = productRepository.findByIdAndActiveTrue(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));

        // 3. 필드 전체 교체
        product.modifyFields(dto);

        // 4. 썸네일 이미지 삭제
        if (product.getThumbnailImage() != null) {
            fileStorageService.deleteFile(product.getThumbnailImage().getImageUrl());
            product.setThumbnailImage(null);
        }

        // 나머지 이미지 삭제
//        for (ProductImage img : new ArrayList<>(product.getProductImages())) {
//            fileStorageService.deleteFile(img.getImageUrl());
//            product.getProductImages().remove(img);
//        }

        // 5. 새 썸네일 이미지 저장 & 연관 설정
        if (newImage != null) {
            // 메인 이미지 저장 후 URL 세팅
            String mainImage = fileStorageService.storeFile(newImage);
            ThumbnailImage thumbnailImage = ThumbnailImage.create(new ProductImageItemDTO(productId, mainImage));
            product.setThumbnailImage(thumbnailImage);
        }

        // 나머지 이미지들 저장
//        if (Objects.requireNonNull(newImages).length > 1) {
//            for (int i = 1; i < newImages.length; i++) {
//                MultipartFile file = newImages[i];
//                if (!file.isEmpty()) {
//                    String url = fileStorageService.storeFile(file);
//                    ProductImage img = new ProductImage();
//                    img.setProduct(product);
//                    img.setImageUrl(url);
//                    product.getProductImages().add(img);
//                }
//            }
//        }
        // 6. 자동으로 변경 내용이 Flush
    }


    /* 상품 삭제 */
    public void deleteProduct(String accessToken, Long productId) {

        System.out.println("accessToken = " + accessToken);
        System.out.println("productId = " + productId);

        // 0. 권한 검증 (COMPANY)
        String role = jwtUtil.getRole(accessToken);
        System.out.println("role = " + role);
        if (!"ROLE_COMPANY".equals(role)) throw new IllegalArgumentException("권한이 없습니다.");

        // 1) DB에서 불러오기
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));

        // 2) 상품 상태를 비활성으로 변경 (soft delete)
        product.setActive(false);
        productRepository.save(product);

//        // 2) 이미지 전체 삭제
//        if (product.getThumbnailImage() != null) {
//            fileStorageService.deleteFile(product.getThumbnailImage().getImageUrl());
//        }
//        for (ProductImage img : product.getProductImages()) {
//            fileStorageService.deleteFile(img.getImageUrl());
//        }
//        // 3) 레코드 삭제
//        productRepository.delete(product);
    }

    /* 카테고리에 속하는 상품 조회 */
    public ProductBatchPreviewResponse getCategorizedProductsPreview(int categoryId) {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findAllByCategoryIdAndActiveTrue(categoryId);
//        List<Product> productList = productRepository.findAllByCategoryId(categoryId);

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 찜하기 수 많은 상품 조회 */
    public ProductBatchPreviewResponse getPopularProductsPreview() {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findAllByActiveTrueOrderByLikedDesc();
//        List<Product> productList = productRepository.findAllByOrderByLikedDesc();

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 최신순 상품 조회 */
    public ProductBatchPreviewResponse getLatestProductsPreview() {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findAllByActiveTrueOrderByIdDesc();
//        List<Product> productList = productRepository.findAllByOrderByIdDesc();

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 기업 회원의 상품 목록 조회 */
    @Transactional(readOnly = true)
    public Page<ProductListDTO> getCompanyProducts(Long companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByCompanyIdAndActiveTrue(companyId, pageable);
//        Page<Product> products = productRepository.findByCompanyId(companyId, pageable);
        return products.map(ProductListDTO::from);
    }

    /* 상품 설명만 업데이트 */
    public void updateProductDescription(BaseUserDetails userDetails, Long productId, String description) {
        String userId = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        if (!"ROLE_COMPANY".equals(role)) {
            throw new IllegalArgumentException("권한이 없습니다. 기업 회원만 상품 수정이 가능합니다.");
        }

//        Product product = productRepository.findById(productId)
        Product product = productRepository.findByIdAndActiveTrue(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));

        // 해당 상품이 현재 기업의 것인지 확인
        if (!product.getCompany().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 상품의 수정 권한이 없습니다.");
        }

        // 설명만 업데이트
        product.setDescription(description);
        productRepository.save(product);
    }

    /* 상품 이미지 업데이트 - 개선된 버전 */
    public void updateProductImages(BaseUserDetails userDetails, Long productId,
                                    MultipartFile mainImage, MultipartFile[] additionalImages,
                                    boolean deleteMainImage, boolean deleteAdditionalImages) {

        String userId = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        if (!"ROLE_COMPANY".equals(role)) {
            throw new IllegalArgumentException("권한이 없습니다. 기업 회원만 상품 수정이 가능합니다.");
        }

        Product product = productRepository.findByIdAndActiveTrue(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));

        // 해당 상품이 현재 기업의 것인지 확인
        if (!product.getCompany().getUserId().equals(userId)) {
            throw new IllegalArgumentException("해당 상품의 수정 권한이 없습니다.");
        }

        // 메인 이미지 처리
        if (deleteMainImage || (mainImage != null && !mainImage.isEmpty())) {
            // 기존 메인 이미지가 있으면 연관관계 제거 후 삭제
            if (product.getThumbnailImage() != null) {
                ThumbnailImage oldImage = product.getThumbnailImage();
                product.setThumbnailImage(null);
                thumnailImageRepository.delete(oldImage);

                // 파일 시스템에서 실제 파일 삭제
                try {
                    fileStorageService.deleteFile(oldImage.getImageUrl());
                } catch (Exception e) {
                    // 파일 삭제 실패 로그만 남기고 계속 진행
                    System.err.println("파일 삭제 중 오류 발생: " + e.getMessage());
                }
            }

            // 새 메인 이미지 업로드 (deleteMainImage가 true이면서 새 이미지가 없으면 썸네일은 null로 유지)
            if (mainImage != null && !mainImage.isEmpty()) {
                String mainImageUrl = fileStorageService.storeFile(mainImage);
                ThumbnailImage thumbnailImage = ThumbnailImage.create(
                    new ProductImageItemDTO(product.getId(), mainImageUrl));
                thumbnailImage.setProduct(product);  // 양방향 관계 설정
                product.setThumbnailImage(thumbnailImage);
                thumnailImageRepository.save(thumbnailImage);
            }
        }

        // 추가 이미지 처리
        if (deleteAdditionalImages) {
            // 기존 이미지 연관관계 제거 후 삭제
            List<ProductImage> oldImages = new ArrayList<>(product.getProductImages());
            product.getProductImages().clear();

            // DB에서 삭제
            productImageRepository.deleteAll(oldImages);

            // 파일 시스템에서 실제 파일 삭제
            for (ProductImage image : oldImages) {
                try {
                    fileStorageService.deleteFile(image.getImageUrl());
                } catch (Exception e) {
                    // 파일 삭제 실패 로그만 남기고 계속 진행
                    System.err.println("파일 삭제 중 오류 발생: " + e.getMessage());
                }
            }
        }

        // 새 추가 이미지 업로드
        if (additionalImages != null && additionalImages.length > 0) {
            for (MultipartFile image : additionalImages) {
                if (!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    ProductImage productImage = new ProductImage();
                    productImage.setProduct(product);
                    productImage.setImageUrl(imageUrl);
                    product.getProductImages().add(productImage);
                }
            }
        }

        // 변경사항 저장 및 flush
        productRepository.saveAndFlush(product);

        // 캐시 무효화를 위해 강제로 엔티티 매니저 refresh (옵션)
        // entityManager.refresh(product);
    }

    /* 가격순 정렬 상품 조회 */
    public ProductBatchPreviewResponse getPriceOrderedProductsPreview(String order) {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();
        response.setBatchesPreviews(new ArrayList<>());

        List<Product> productList;
        if ("desc".equalsIgnoreCase(order)) {
            // 가격 높은순 정렬
            productList = productRepository.findAllByActiveTrueOrderByPriceDesc();
        } else {
            // 가격 낮은순 정렬 (기본값)
            productList = productRepository.findAllByActiveTrueOrderByPriceAsc();
        }

        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 정렬 옵션 적용된 카테고리별 상품 조회 */
    public ProductBatchPreviewResponse getCategorizedProductsPreview(int categoryId, String sortOption) {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();
        response.setBatchesPreviews(new ArrayList<>());

        List<Product> productList;

        // 카테고리 ID가 0인 경우 전체 상품 조회
        if (categoryId == 0) {
            switch (sortOption) {
                case "popular":
                    productList = productRepository.findAllByActiveTrueOrderByLikedDesc();
                    break;
                case "priceAsc":
                    productList = productRepository.findAllByActiveTrueOrderByPriceAsc();
                    break;
                case "priceDesc":
                    productList = productRepository.findAllByActiveTrueOrderByPriceDesc();
                    break;
                case "latest":
                default:
                    productList = productRepository.findAllByActiveTrueOrderByIdDesc();
                    break;
            }
        } else {
            // 특정 카테고리 상품 조회
            switch (sortOption) {
                case "popular":
                    productList = productRepository.findAllByCategoryIdAndActiveTrueOrderByLikedDesc(categoryId);
                    break;
                case "priceAsc":
                    productList = productRepository.findAllByCategoryIdAndActiveTrueOrderByPriceAsc(categoryId);
                    break;
                case "priceDesc":
                    productList = productRepository.findAllByCategoryIdAndActiveTrueOrderByPriceDesc(categoryId);
                    break;
                case "latest":
                default:
                    productList = productRepository.findAllByCategoryIdAndActiveTrueOrderByIdDesc(categoryId);
                    break;
            }
        }

        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 정렬 옵션 적용된 회사별 상품 조회 */
    public ProductBatchPreviewResponse getCompanyProductsPreview(Long companyId, String sortOption) {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();
        response.setBatchesPreviews(new ArrayList<>());

        List<Product> productList;

        // 회사별 상품 조회
        switch (sortOption) {
            case "popular":
                productList = productRepository.findByCompanyIdAndActiveTrueOrderByLikedDesc(companyId);
                break;
            case "priceAsc":
                productList = productRepository.findByCompanyIdAndActiveTrueOrderByPriceAsc(companyId);
                break;
            case "priceDesc":
                productList = productRepository.findByCompanyIdAndActiveTrueOrderByPriceDesc(companyId);
                break;
            case "latest":
            default:
                productList = productRepository.findByCompanyIdAndActiveTrueOrderByIdDesc(companyId);
                break;
        }

        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 정렬 옵션 적용된 카테고리 및 회사별 상품 조회 */
    public ProductBatchPreviewResponse getCategoryAndCompanyProductsPreview(int categoryId, Long companyId, String sortOption) {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();
        response.setBatchesPreviews(new ArrayList<>());

        List<Product> productList;

        // 카테고리 ID가 0인 경우 회사별 전체 상품 조회
        if (categoryId == 0) {
            return getCompanyProductsPreview(companyId, sortOption);
        } else {
            // 특정 카테고리 및 회사 상품 조회
            switch (sortOption) {
                case "popular":
                    productList = productRepository.findByCategoryIdAndCompanyIdAndActiveTrueOrderByLikedDesc(categoryId, companyId);
                    break;
                case "priceAsc":
                    productList = productRepository.findByCategoryIdAndCompanyIdAndActiveTrueOrderByPriceAsc(categoryId, companyId);
                    break;
                case "priceDesc":
                    productList = productRepository.findByCategoryIdAndCompanyIdAndActiveTrueOrderByPriceDesc(categoryId, companyId);
                    break;
                case "latest":
                default:
                    productList = productRepository.findByCategoryIdAndCompanyIdAndActiveTrueOrderByIdDesc(categoryId, companyId);
                    break;
            }
        }

        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 사용자 ID로 기업 ID 조회 */
    public Long getCompanyIdByUserId(String userId) {
        return companyRepository.findByUserId(userId).getId();
    }
}
