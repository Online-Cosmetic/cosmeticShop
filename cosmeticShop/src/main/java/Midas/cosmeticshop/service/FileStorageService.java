package Midas.cosmeticshop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageService {

    // ===== Mode =====
    @Value("${app.storage:s3}") private String storageMode; // local, supabase, s3
    @Value("${app.upload-dir:}") private String uploadDir; // local 전용

    // ===== Supabase (유지만, 현재 미사용) =====
    @Value("${supabase.url:}")         private String supabaseUrl;
    @Value("${supabase.service-key:}") private String serviceKey;
    @Value("${supabase.bucket:}")      private String bucket;

    // ===== S3 =====
    @Value("${aws.s3.bucket:}")                  private String s3Bucket;
    @Value("${aws.s3.region:ap-northeast-2}")    private String s3Region;
    @Value("${aws.s3.access-key:}")              private String s3AccessKey;  // 로컬 개발 시에만 사용 권장
    @Value("${aws.s3.secret-key:}")              private String s3SecretKey;
    @Value("${app.presign-expire-seconds:600}")  private long presignExpireSeconds; // 10분 기본

    private static final HttpClient http = HttpClient.newHttpClient();

    // S3Client / Presigner는 스레드 세이프
    private volatile S3Client s3Client;
    private volatile S3Presigner s3Presigner;

    /* ===============================
       Public APIs
       =============================== */

    /** 공통 업로드 진입점.
     *  - local/supabase: "/images/파일명" 반환
     *  - s3: "images/파일명" (S3 key) 반환
     */
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
            return uploadS3(file, newFileName); // key 반환
        } else {
            return uploadSupabase(file, newFileName);
        }
    }

    /** 프론트에서 즉시 표시할 URL도 함께 필요할 때 사용.
     *  - S3: { key, url(presigned GET) } 반환
     *  - local/supabase: { keyOrPath, url }처럼 동일 경로를 둘 다 담아 반환
     */
    public Map<String, String> uploadAndLink(MultipartFile file) {
        if ("s3".equalsIgnoreCase(storageMode)) {
            String key = storeFile(file); // "images/..."
            String url = createPresignedGetUrl(key);
            return Map.of("key", key, "url", url);
        } else {
            String path = storeFile(file); // "/images/..."
            return Map.of("key", path, "url", path);
        }
    }

    /** 파일 삭제 (local/supabase/s3 공통) */
    public void deleteFile(String imageUrlOrKey) {
        if (imageUrlOrKey == null || imageUrlOrKey.isBlank()) return;

        if ("local".equalsIgnoreCase(storageMode)) {
            String fileName = imageUrlOrKey.replaceFirst("^/images/?", "");
            try {
                Path dir = Path.of(uploadDir);
                Files.deleteIfExists(dir.resolve(fileName));
            } catch (IOException e) {
                throw new RuntimeException("파일 삭제 실패: " + fileName, e);
            }
        } else if ("s3".equalsIgnoreCase(storageMode)) {
            deleteS3(toS3Key(imageUrlOrKey));
        } else {
            deleteSupabase(imageUrlOrKey.replaceFirst("^/images/?", ""));
        }
    }

    /** (S3 전용) 프라이빗 버킷에서 읽기 위한 사전서명 GET URL */
    public String createPresignedGetUrl(String key) {
        if (key == null || key.isBlank()) throw new IllegalArgumentException("key 가 비어있습니다.");
        GetObjectRequest get = GetObjectRequest.builder()
                .bucket(s3Bucket).key(key).build();

        PresignedGetObjectRequest presigned = getS3Presigner().presignGetObject(b -> b
                .signatureDuration(Duration.ofSeconds(presignExpireSeconds))
                .getObjectRequest(get));
        return presigned.url().toString();
    }

    /** (선택) 버킷이 퍼블릭일 때 정적 URL 생성 */
    public String createPublicUrl(String key) {
        return "https://" + s3Bucket + ".s3." + s3Region + ".amazonaws.com/" + key;
    }

    /* ===============================
       Local
       =============================== */

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

    /* ===============================
       Supabase (유지)
       =============================== */

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

    /* ===============================
       S3
       =============================== */

    /** S3 업로드: EC2 IAM Role 또는 정적 키 자동 탐지. 반환값은 S3 key("images/..."). */
    private String uploadS3(MultipartFile file, String newFileName) {
        String key = "images/" + newFileName;
        try {
            PutObjectRequest put = PutObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(key)
                    .contentType(Optional.ofNullable(file.getContentType()).orElse("application/octet-stream"))
                    .build();

            // 대용량 대응: InputStream 사용 권장
            try (InputStream in = file.getInputStream()) {
                if (file.getSize() >= 0) {
                    getS3Client().putObject(put, RequestBody.fromInputStream(in, file.getSize()));
                } else {
                    // 드물게 size를 모를 경우 fallback
                    byte[] bytes = file.getBytes();
                    getS3Client().putObject(put, RequestBody.fromBytes(bytes));
                }
            }
            // ✅ 절대 URL 반환
            return createPublicUrl(key);
        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패: " + newFileName, e);
        }
    }

    private void deleteS3(String key) {
        try {
            if (key == null || key.isBlank()) return;
            DeleteObjectRequest del = DeleteObjectRequest.builder()
                    .bucket(s3Bucket)
                    .key(key)
                    .build();
            getS3Client().deleteObject(del);
        } catch (Exception e) {
            throw new RuntimeException("S3 삭제 실패: " + key, e);
        }
    }

    /* ===============================
       Common Utils
       =============================== */

    private S3Client getS3Client() {
        if (s3Client == null) {
            synchronized (this) {
                if (s3Client == null) {
                    S3ClientBuilder builder = S3Client.builder().region(Region.of(s3Region));
                    if (hasStaticKeys()) {
                        var creds = AwsBasicCredentials.create(s3AccessKey, s3SecretKey);
                        builder.credentialsProvider(StaticCredentialsProvider.create(creds));
                    } else {
                        builder.credentialsProvider(DefaultCredentialsProvider.create()); // EC2 IAM Role
                    }
                    s3Client = builder.build();
                }
            }
        }
        return s3Client;
    }

    private S3Presigner getS3Presigner() {
        if (s3Presigner == null) {
            synchronized (this) {
                if (s3Presigner == null) {
                    S3Presigner.Builder builder = S3Presigner.builder().region(Region.of(s3Region));
                    if (hasStaticKeys()) {
                        var creds = AwsBasicCredentials.create(s3AccessKey, s3SecretKey);
                        builder.credentialsProvider(StaticCredentialsProvider.create(creds));
                    } else {
                        builder.credentialsProvider(DefaultCredentialsProvider.create()); // EC2 IAM Role
                    }
                    s3Presigner = builder.build();
                }
            }
        }
        return s3Presigner;
    }

    private boolean hasStaticKeys() {
        return s3AccessKey != null && !s3AccessKey.isBlank()
                && s3SecretKey != null && !s3SecretKey.isBlank();
    }

    /** URL이든 파일명/키든 들어오면 S3 key("images/...")로 정규화 */
    private String toS3Key(String input) {
        if (input == null || input.isBlank()) return "";
        try {
            String path = URI.create(input).getPath(); // e.g. /images/xxx.png
            if (path.startsWith("/")) path = path.substring(1);
            if (path.isEmpty()) return "";
            return path.startsWith("images/") ? path : ("images/" + path);
        } catch (Exception e) {
            String s = input.replaceFirst("^/+", "");
            return s.startsWith("images/") ? s : ("images/" + s);
        }
    }
}
