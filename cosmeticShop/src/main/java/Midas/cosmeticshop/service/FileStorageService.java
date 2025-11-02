package Midas.cosmeticshop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

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

    @Value("${app.storage:supabase}") private String storageMode; // local, supabase, s3
    @Value("${app.upload-dir:}")   private String uploadDir;   // local 전용

    @Value("${supabase.url:}")         private String supabaseUrl;
    @Value("${supabase.service-key:}") private String serviceKey;
    @Value("${supabase.bucket:}")      private String bucket;

    @Value("${aws.s3.bucket:}")        private String s3Bucket;
    @Value("${aws.s3.region:ap-northeast-2}") private String s3Region;
    @Value("${aws.s3.access-key:}")    private String s3AccessKey;
    @Value("${aws.s3.secret-key:}")    private String s3SecretKey;

    private static final HttpClient http = HttpClient.newHttpClient();
    
    private S3Client s3Client;
    
    private S3Client getS3Client() {
        if (s3Client == null) {
            // Access Key가 있으면 명시적 credential 사용, 없으면 기본 자격 증명 체인 (EC2 Role 등)
            if (s3AccessKey != null && !s3AccessKey.isBlank() && s3SecretKey != null && !s3SecretKey.isBlank()) {
                AwsBasicCredentials awsCreds = AwsBasicCredentials.create(s3AccessKey, s3SecretKey);
                s3Client = S3Client.builder()
                        .region(Region.of(s3Region))
                        .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                        .build();
            } else {
                // EC2 IAM Role 사용
                s3Client = S3Client.builder()
                        .region(Region.of(s3Region))
                        .build();
            }
        }
        return s3Client;
    }

    public String storeFile(MultipartFile file) {
        String original = StringUtils.cleanPath(Optional.ofNullable(file.getOriginalFilename()).orElse(""));
        if (!original.contains(".")) {
            throw new IllegalArgumentException("확장자가 없는 파일은 업로드할 수 없습니다: " + original);
        }
        String ext = original.substring(original.lastIndexOf('.')).toLowerCase();
        String newFileName = System.currentTimeMillis() + "-" + UUID.randomUUID() + ext;

        if ("local".equalsIgnoreCase(storageMode)) {
            return saveLocal(file, newFileName);
        } else if ("s3".equalsIgnoreCase(storageMode)) {
            return uploadS3(file, newFileName);
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
        } else if ("s3".equalsIgnoreCase(storageMode)) {
            deleteS3(fileName);
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

    /* ====== S3 업로드/삭제 ====== */
    private String uploadS3(MultipartFile file, String newFileName) {
        String key = "images/" + newFileName;
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(key)
                    .contentType(Optional.ofNullable(file.getContentType()).orElse("application/octet-stream"))
                    .build();

            getS3Client().putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            
            // S3 URL 반환: https://bucket-name.s3.region.amazonaws.com/images/filename
            return "https://" + s3Bucket + ".s3." + s3Region + ".amazonaws.com/" + key;
        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패: " + newFileName, e);
        }
    }

    private void deleteS3(String fileName) {
        String key = "images/" + fileName;
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(key)
                    .build();

            getS3Client().deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            throw new RuntimeException("S3 삭제 실패: " + fileName, e);
        }
    }
}
