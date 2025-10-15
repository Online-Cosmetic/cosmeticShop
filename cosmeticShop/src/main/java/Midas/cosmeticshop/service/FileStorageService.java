package Midas.cosmeticshop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.storage:supabase}") private String storageMode; // local or supabase
    @Value("${app.upload-dir:}")   private String uploadDir;   // local 전용

    @Value("${supabase.url:}")         private String supabaseUrl;
    @Value("${supabase.service-key:}") private String serviceKey;
    @Value("${supabase.bucket:}")      private String bucket;

    private static final HttpClient http = HttpClient.newHttpClient();

    public String storeFile(MultipartFile file) {
        String original = StringUtils.cleanPath(Optional.ofNullable(file.getOriginalFilename()).orElse(""));
        if (!original.contains(".")) {
            throw new IllegalArgumentException("확장자가 없는 파일은 업로드할 수 없습니다: " + original);
        }
        String ext = original.substring(original.lastIndexOf('.')).toLowerCase();
        String newFileName = System.currentTimeMillis() + "-" + UUID.randomUUID() + ext;

        if ("local".equalsIgnoreCase(storageMode)) {
            return saveLocal(file, newFileName);
        } else {
            return uploadSupabase(file, newFileName);
        }
    }

    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        String fileName = imageUrl.replaceFirst("^/images/?", "");

        if ("local".equalsIgnoreCase(storageMode)) {
            try {
                Path dir = Path.of(uploadDir);
                Files.deleteIfExists(dir.resolve(fileName));
            } catch (IOException e) {
                throw new RuntimeException("파일 삭제 실패: " + fileName, e);
            }
        } else {
            deleteSupabase(fileName);
        }
    }

    /* ====== 로컬 저장 ====== */
    private String saveLocal(MultipartFile file, String newFileName) {
        try {
            Path dir = Path.of(uploadDir);
            Files.createDirectories(dir);
            Path target = dir.resolve(newFileName);
            file.transferTo(target.toFile());
            return "/images/" + newFileName;
        } catch (IOException e) {
            throw new RuntimeException("로컬 저장 실패: " + newFileName, e);
        }
    }

    /* ====== Supabase 업로드/삭제 ====== */
    private String uploadSupabase(MultipartFile file, String newFileName) {
        String key = "images/" + newFileName;
        try {
            HttpRequest req = HttpRequest.newBuilder(
                            URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + key))
                    .header("Authorization", "Bearer " + serviceKey)
                    .header("Content-Type", Optional.ofNullable(file.getContentType())
                            .orElse("application/octet-stream"))
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();

            HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() >= 300) {
                throw new RuntimeException("Supabase 업로드 실패: " + res.statusCode() + " " + res.body());
            }
            return "/images/" + newFileName;
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("업로드 인터럽트", ie);
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패: " + newFileName, e);
        }
    }

    private void deleteSupabase(String fileName) {
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
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("삭제 인터럽트", ie);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + fileName, e);
        }
    }
}
