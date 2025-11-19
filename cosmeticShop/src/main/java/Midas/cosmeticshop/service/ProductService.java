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
import Midas.cosmeticshop.repository.specification.ProductSpecifications;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.stream.Collectors;


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

    public Map<String, Object> registerProductsBatch(BaseUserDetails userDetails, MultipartFile zipFile) {
        String userId = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        int successCount = 0;
        int failureCount = 0;

        if (!"ROLE_COMPANY".equals(role)) {
            throw new IllegalArgumentException("권한이 없습니다. 기업 회원만 상품 등록이 가능합니다.");
        }

        try (ZipInputStream zis = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry entry;
            //1. zip 파일 내의 CSV 파일과 이미지 파일들을 분리 저장
            Map<String, byte[]> imageMap = new HashMap<>();
            String csvContent = null;
            while ((entry = zis.getNextEntry()) != null) {
                if(entry.isDirectory()) continue;
                String entryName = entry.getName();
                
                // Mac 숨김 파일 / 메타데이터는 무시
                if (entryName.startsWith("__MACOSX/") || entryName.contains("/._")) {
                    continue;
                }
                
                if (entryName.endsWith(".csv")) {
                    csvContent = new String(zis.readAllBytes(), StandardCharsets.UTF_8);
                    // 첫 번째 유효 CSV만 쓰고 바로 탈출해도 됨 (선택사항)
                    // break;
                } else{
                    byte[] bytes = zis.readAllBytes();
                    String fileName = entryName.substring(entryName.lastIndexOf('/') + 1);
                    imageMap.put(fileName, bytes);
                }
            }
            if (csvContent == null) {
                throw new IllegalArgumentException("CSV 파일이 포함되어 있지 않습니다.");
            }
            //2. CSV 파싱 및 상품 등록
            try(BufferedReader reader = new BufferedReader(new StringReader(csvContent))) {
                String header = reader.readLine();
                String line;
                while ((line = reader.readLine()) != null) {
                    try{
                        String[] cols = line.split(",");

                        int categoryId = Integer.parseInt(cols[0].trim());
                        String name = cols[1].trim();
                        String description = cols[2].trim();
                        int price = Integer.parseInt(cols[3].trim());
                        int stock = Integer.parseInt(cols[4].trim());
                        String mainImageName = cols[5].trim();
                        String additionalImageNames = cols.length > 6 ? cols[6].trim() : "";

                        byte[] mainImageBytes = imageMap.get(mainImageName);
                        if(mainImageBytes == null) {
                            throw new IllegalArgumentException("메인 이미지 파일을 찾을 수 없습니다: " + mainImageName);
                        }

                        List<MultipartFile> additionalImagesList = new ArrayList<>();

                        if (!additionalImageNames.isBlank()) {
                            for (String imgName : additionalImageNames.split("\\|")) {
                                imgName = imgName.trim();
                                byte[] bytes = imageMap.get(imgName);
                                if (bytes != null) {
                                    // imgName(실제 파일 이름)을 그대로 사용해서 MockMultipartFile 생성
                                    String mainContentType = detectContentType(imgName);

                                    MultipartFile additionalImage = new MockMultipartFile(
                                            imgName,       // form field name
                                            imgName,       // original filename
                                            mainContentType,   // ✅ 실제 확장자에 맞는 content-type
                                            bytes
                                    );
                                    additionalImagesList.add(additionalImage);
                                }
                            }
                        }

                        ProductDTO dto = new ProductDTO();
                        dto.setCategoryId(categoryId);
                        dto.setProductName(name);
                        dto.setDescription(description);
                        dto.setPrice(price);
                        dto.setStock(stock);
                        String additionalContentType = detectContentType(mainImageName);
                        MultipartFile mainImage = new MockMultipartFile(mainImageName, mainImageName, additionalContentType, mainImageBytes);
                        MultipartFile[] additionalImages = additionalImagesList.toArray(new MultipartFile[0]);
                        registerProduct(userDetails, dto, mainImage, additionalImages);
                        successCount++;

                    } catch(Exception e) {
                        failureCount++;
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("배치 상품 등록 중 오류가 발생했습니다.", e);
        }
        return Map.of(
            "successfulRegistrations", successCount,
            "failedRegistrations", failureCount
        );
    }

    //이미지 확장자 구분
    private String detectContentType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif"))  return "image/gif";
        return "application/octet-stream"; // 모르는 건 기본 바이너리
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

        // 4. 이미지 처리는 별도의 updateProductImages API에서 처리하므로 여기서는 건드리지 않음
        // (newImage 파라미터는 레거시 지원용으로 유지하지만, 실제로는 사용되지 않음)
        // 이미지 수정이 필요한 경우 /api/products/{productId}/images 엔드포인트를 사용해야 함

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
    public Page<ProductListDTO> getCompanyProducts(Long companyId, int page, int size, String keyword, String sortOption) {
        Sort sort = resolveSortForManagement(sortOption);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Specification<Product> specification = Specification.where(ProductSpecifications.isActive())
            .and(ProductSpecifications.belongsToCompany(companyId));
        
        Specification<Product> keywordSpec = ProductSpecifications.containsKeyword(keyword);
        if (keywordSpec != null) {
            specification = specification.and(keywordSpec);
        }
        
        Page<Product> products = productRepository.findAll(specification, pageable);
        return products.map(ProductListDTO::from);
    }
    
    /* 상품 관리 페이지용 정렬 옵션 해석 */
    private Sort resolveSortForManagement(String sortOption) {
        if (sortOption == null || sortOption.isEmpty()) {
            return Sort.by(Sort.Order.desc("id")); // 기본값: 최신순 (ID 내림차순)
        }
        
        return switch (sortOption) {
            case "latest" -> Sort.by(Sort.Order.desc("id")); // 등록시간순 (최신순)
            case "priceAsc" -> Sort.by(Sort.Order.asc("price")); // 가격 낮은순
            case "priceDesc" -> Sort.by(Sort.Order.desc("price")); // 가격 높은순
            default -> Sort.by(Sort.Order.desc("id")); // 기본값: 최신순
        };
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
                                    boolean deleteMainImage, boolean deleteAdditionalImages,
                                    List<String> remainingAdditionalImageUrls) {

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
        if (mainImage != null && !mainImage.isEmpty()) {
            // 새 메인 이미지가 업로드된 경우: 기존 이미지 삭제 후 새 이미지 저장
            // 기존 메인 이미지가 있으면 연관관계 제거 후 삭제
            if (product.getThumbnailImage() != null) {
                ThumbnailImage oldImage = product.getThumbnailImage();
                product.setThumbnailImage(null);
                thumnailImageRepository.delete(oldImage);
                // DELETE가 DB에 즉시 반영되도록 flush() 호출 (고유 제약 조건 위반 방지)
                thumnailImageRepository.flush();

                // 파일 시스템에서 실제 파일 삭제
                try {
                    fileStorageService.deleteFile(oldImage.getImageUrl());
                } catch (Exception e) {
                    // 파일 삭제 실패 로그만 남기고 계속 진행
                    System.err.println("파일 삭제 중 오류 발생: " + e.getMessage());
                }
            }

            // 새 메인 이미지 업로드 및 저장 (ProductRegister와 동일한 패턴)
            System.out.println("메인 이미지 저장 시작 - Product ID: " + productId);
            String mainImageUrl = fileStorageService.storeFile(mainImage);
            System.out.println("FileStorageService.storeFile 완료 - Image URL: " + mainImageUrl);
            
            ThumbnailImage thumbnailImage = ThumbnailImage.create(
                new ProductImageItemDTO(product.getId(), mainImageUrl));
            // ThumbnailImage.create()가 새 Product 객체를 생성하므로, 실제 product로 교체
            thumbnailImage.setProduct(product);
            product.setThumbnailImage(thumbnailImage);
            
            // ProductRegister와 동일하게 repository에서 명시적으로 저장
            ThumbnailImage savedImage = thumnailImageRepository.saveAndFlush(thumbnailImage);
            System.out.println("ThumbnailImage 저장 완료 - Image ID: " + savedImage.getId() + ", URL: " + savedImage.getImageUrl());
        } else if (deleteMainImage) {
            // deleteMainImage가 true이고 새 이미지가 없는 경우: 기존 이미지만 삭제
            if (product.getThumbnailImage() != null) {
                ThumbnailImage oldImage = product.getThumbnailImage();
                product.setThumbnailImage(null);
                thumnailImageRepository.delete(oldImage);
                // DELETE가 DB에 즉시 반영되도록 flush() 호출
                thumnailImageRepository.flush();

                // 파일 시스템에서 실제 파일 삭제
                try {
                    fileStorageService.deleteFile(oldImage.getImageUrl());
                } catch (Exception e) {
                    // 파일 삭제 실패 로그만 남기고 계속 진행
                    System.err.println("파일 삭제 중 오류 발생: " + e.getMessage());
                }
            }
        }
        // mainImage가 null이고 deleteMainImage가 false이면 기존 이미지 유지 (아무것도 하지 않음)

        // ---------- 추가 이미지 처리 (기존 유지 + 부분 삭제 + 새 이미지 추가) ----------
        System.out.println("추가 이미지 처리 시작 - deleteAdditionalImages: " + deleteAdditionalImages +
                          ", additionalImages: " + (additionalImages != null ? additionalImages.length : 0));
        System.out.println("remainingAdditionalImageUrls 파라미터: " + 
                          (remainingAdditionalImageUrls != null ? remainingAdditionalImageUrls.toString() : "null"));

        // 1) 기존 추가 이미지 조회 (lazy loading 이슈 방지)
        List<ProductImage> existingImages = productImageRepository.findAllByProduct_IdOrderByIdDesc(productId);
        System.out.println("기존 추가 이미지 개수 (DB 조회): " + existingImages.size());
        for (ProductImage img : existingImages) {
            System.out.println("  - 기존 이미지 URL: " + img.getImageUrl());
        }

        // 2) 프론트에서 전달된 '유지할 기존 추가 이미지 URL 목록'을 Set으로 변환
        Set<String> remainingImageUrlSet = null;
        if (remainingAdditionalImageUrls != null && !remainingAdditionalImageUrls.isEmpty()) {
            remainingImageUrlSet = new HashSet<>(remainingAdditionalImageUrls);
            System.out.println("유지 요청된 기존 추가 이미지 URL 개수: " + remainingImageUrlSet.size());
        } else if (!deleteAdditionalImages) {
            // remainingAdditionalImageUrls가 없고 deleteAdditionalImages가 false이면
            // 기존 이미지를 모두 유지 (새 이미지만 추가하는 경우)
            remainingImageUrlSet = new HashSet<>();
            for (ProductImage img : existingImages) {
                remainingImageUrlSet.add(img.getImageUrl());
            }
            System.out.println("remainingAdditionalImageUrls가 없음 → 기존 이미지 모두 유지 (개수: " + remainingImageUrlSet.size() + ")");
        }

        // 3) 삭제 대상 이미지 결정
        List<ProductImage> imagesToDelete = new ArrayList<>();

        if (deleteAdditionalImages) {
            // 전체 삭제 플래그가 true인 경우: 기존 추가 이미지를 모두 삭제
            System.out.println("deleteAdditionalImages=true → 기존 추가 이미지 전체 삭제");
            imagesToDelete.addAll(existingImages);
        } else if (remainingImageUrlSet != null && !remainingImageUrlSet.isEmpty()) {
            // 부분 삭제: remainingAdditionalImageUrls에 포함되지 않은 기존 이미지만 삭제
            System.out.println("부분 삭제 모드 → remainingAdditionalImageUrls에 없는 기존 이미지만 삭제");
            for (ProductImage img : existingImages) {
                if (!remainingImageUrlSet.contains(img.getImageUrl())) {
                    imagesToDelete.add(img);
                }
            }
        }

        // 4) 삭제 대상 이미지 실제 삭제 (DB + 파일 시스템 + 연관관계)
        if (!imagesToDelete.isEmpty()) {
            System.out.println("삭제 대상 추가 이미지 개수: " + imagesToDelete.size());

            // 연관관계에서 제거
            product.getProductImages().removeAll(imagesToDelete);

            // DB 삭제
            productImageRepository.deleteAll(imagesToDelete);
            productImageRepository.flush();

            // 파일 시스템에서 삭제
            for (ProductImage image : imagesToDelete) {
                try {
                    fileStorageService.deleteFile(image.getImageUrl());
                } catch (Exception e) {
                    System.err.println("파일 삭제 중 오류 발생: " + e.getMessage());
                }
            }
        } else {
            System.out.println("삭제할 추가 이미지가 없습니다.");
        }

        // 5) 새 추가 이미지 업로드 및 저장 (기존 이미지는 유지된 상태에서 추가)
        if (additionalImages != null && additionalImages.length > 0) {
            System.out.println("새 추가 이미지 업로드 시작 - 개수: " + additionalImages.length);
            for (MultipartFile image : additionalImages) {
                if (!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    ProductImage productImage = new ProductImage();
                    productImage.setProduct(product);
                    productImage.setImageUrl(imageUrl);

                    product.getProductImages().add(productImage);
                    productImageRepository.saveAndFlush(productImage);

                    System.out.println("새 추가 이미지 저장 완료: " + imageUrl);
                }
            }
        } else {
            System.out.println("새로 업로드된 추가 이미지가 없습니다.");
        }

        // 6) Product 저장 (연관관계 변경 반영)
        productRepository.saveAndFlush(product);

        // 7) 최종 확인 로그
        List<ProductImage> finalImages = productImageRepository.findAllByProduct_IdOrderByIdDesc(productId);
        System.out.println("최종 추가 이미지 개수 (DB 조회): " + finalImages.size());
        for (ProductImage img : finalImages) {
            System.out.println("  - 최종 이미지 ID: " + img.getId() + ", URL: " + img.getImageUrl());
        }
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
    public ProductBatchPreviewResponse getCategorizedProductsPreview(int categoryId, String sortOption, String keyword, int page, int size) {
        return getFilteredProducts(categoryId, null, sortOption, keyword, page, size);
    }

    /* 정렬 옵션 적용된 회사별 상품 조회 */
    public ProductBatchPreviewResponse getCompanyProductsPreview(Long companyId, String sortOption, String keyword, int page, int size) {
        return getFilteredProducts(null, companyId, sortOption, keyword, page, size);
    }

    /* 정렬 옵션 적용된 카테고리 및 회사별 상품 조회 */
    public ProductBatchPreviewResponse getCategoryAndCompanyProductsPreview(int categoryId, Long companyId, String sortOption, String keyword, int page, int size) {
        return getFilteredProducts(categoryId, companyId, sortOption, keyword, page, size);
    }

    private ProductBatchPreviewResponse getFilteredProducts(Integer categoryId, Long companyId, String sortOption, String keyword, int page, int size) {
        Sort sort = resolveSort(sortOption);
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 9 : size;
        Pageable pageable = PageRequest.of(safePage, safeSize, sort);

        Specification<Product> specification = Specification.where(ProductSpecifications.isActive());
        if (categoryId != null && categoryId > 0) {
            specification = specification.and(ProductSpecifications.hasCategory(categoryId));
        }
        if (companyId != null) {
            specification = specification.and(ProductSpecifications.belongsToCompany(companyId));
        }

        Specification<Product> keywordSpec = ProductSpecifications.containsKeyword(keyword);
        if (keywordSpec != null) {
            specification = specification.and(keywordSpec);
        }

        Page<Product> productPage = productRepository.findAll(specification, pageable);

        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();
        response.setBatchesPreviews(productPage.getContent().stream()
            .map(ProductPreviewDTO::from)
            .collect(Collectors.toList()));
        response.setHasNext(productPage.hasNext());
        response.setTotalElements(productPage.getTotalElements());
        response.setPage(productPage.getNumber());
        response.setPageSize(productPage.getSize());
        return response;
    }

    private Sort resolveSort(String sortOption) {
        return switch (sortOption) {
            case "popular" -> Sort.by(Sort.Order.desc("liked"));
            case "priceAsc" -> Sort.by(Sort.Order.asc("price"));
            case "priceDesc" -> Sort.by(Sort.Order.desc("price"));
            default -> Sort.by(Sort.Order.desc("id"));
        };
    }

    /* 사용자 ID로 기업 ID 조회 */
    public Long getCompanyIdByUserId(String userId) {
        return companyRepository.findByUserId(userId).getId();
    }

    /* 메인페이지용 베스트셀러 (liked 기준 인기순 상위 10개 상품) */
    public ProductBatchPreviewResponse getBestsellers() {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findTop10ByActiveTrueOrderByLikedDesc();
//        List<Product> productList = productRepository.findAllByOrderByLikedDesc();

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 메인페이지용 추천상품 (최신순 상위 5개 품목) */
    public ProductBatchPreviewResponse getRecommendedProducts() {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findTop5ByActiveTrueOrderByIdDesc();
//        List<Product> productList = productRepository.findAllByOrderByIdDesc();

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 상품 상세페이지 관련상품 (동일 카테고리 최신순 상위 8개 품목) */
    public ProductBatchPreviewResponse getRelatedProducts(int categoryId, String sortOption, Long excludeProductId) {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();
        response.setBatchesPreviews(new ArrayList<>());

        List<Product> productList;

        // 특정 카테고리 상품 조회 (현재 상품을 제외하기 위해 9개를 가져온 후 필터링)
        switch (sortOption) {
            case "popular":
                productList = excludeProductId != null 
                    ? productRepository.findTop9ByCategoryIdAndActiveTrueOrderByLikedDesc(categoryId)
                    : productRepository.findTop8ByCategoryIdAndActiveTrueOrderByLikedDesc(categoryId);
                break;
            case "priceAsc":
                productList = excludeProductId != null 
                    ? productRepository.findTop9ByCategoryIdAndActiveTrueOrderByPriceAsc(categoryId)
                    : productRepository.findTop8ByCategoryIdAndActiveTrueOrderByPriceAsc(categoryId);
                break;
            case "priceDesc":
                productList = excludeProductId != null 
                    ? productRepository.findTop9ByCategoryIdAndActiveTrueOrderByPriceDesc(categoryId)
                    : productRepository.findTop8ByCategoryIdAndActiveTrueOrderByPriceDesc(categoryId);
                break;
            case "latest":
            default:
                productList = excludeProductId != null 
                    ? productRepository.findTop9ByCategoryIdAndActiveTrueOrderByIdDesc(categoryId)
                    : productRepository.findTop8ByCategoryIdAndActiveTrueOrderByIdDesc(categoryId);
                break;
        }

        // 현재 상품 제외 필터링
        if (excludeProductId != null) {
            productList = productList.stream()
                    .filter(product -> !product.getId().equals(excludeProductId))
                    .collect(java.util.stream.Collectors.toList());
        }

        // 최대 8개로 제한
        if (productList.size() > 8) {
            productList = productList.subList(0, 8);
        }

        for (Product product : productList) {
            ProductPreviewDTO dto = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }
}
