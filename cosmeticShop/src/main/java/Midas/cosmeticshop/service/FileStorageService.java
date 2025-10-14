package Midas.cosmeticshop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.*;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${supabase.url}")         private String supabaseUrl;
    @Value("${supabase.service-key}") private String serviceKey;
    @Value("${supabase.bucket}")      private String bucket;       // 예) product-images

    private static final HttpClient http = HttpClient.newHttpClient();

    /** 업로드: Supabase에 저장하고 프론트 계약 유지 위해 "/images/{파일명}" 반환 */
    public String storeFile(MultipartFile file) {
        String original = StringUtils.cleanPath(Optional.ofNullable(file.getOriginalFilename()).orElse(""));
        if (!original.contains(".")) {
            throw new IllegalArgumentException("확장자가 없는 파일은 업로드할 수 없습니다: " + original);
        }
        String ext = original.substring(original.lastIndexOf('.')).toLowerCase();
        // 캐시 무효화 및 충돌 방지: 타임스탬프 + UUID
        String newFileName = System.currentTimeMillis() + "-" + UUID.randomUUID() + ext;
        String key = "images/" + newFileName; // Supabase object key(버킷 내부 경로)

        try {
            HttpRequest req = HttpRequest.newBuilder(
                            URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + key))
                    .header("Authorization", "Bearer " + serviceKey)
                    .header("Content-Type",
                            Optional.ofNullable(file.getContentType()).orElse("application/octet-stream"))
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 300) {
                throw new RuntimeException("Supabase 업로드 실패: " + res.statusCode() + " " + res.body());
            }
            // 프론트 계약 유지: 상대경로 반환
            return "/images/" + newFileName;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("업로드 인터럽트", e);
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패: " + newFileName, e);
        }
    }

    /** 삭제: "/images/{파일명}" → Supabase object key 로 변환 후 삭제 */
    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;

        String fileName = imageUrl.replaceFirst("^/images/?", ""); // "xxxx-uuid.jpg"
        String key = "images/" + fileName;

        try {
            HttpRequest req = HttpRequest.newBuilder(
                            URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + key))
                    .header("Authorization", "Bearer " + serviceKey)
                    .DELETE()
                    .build();

            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 300) {
                throw new RuntimeException("Supabase 삭제 실패: " + res.statusCode() + " " + res.body());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("삭제 인터럽트", e);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + imageUrl, e);
        }
    }
}
