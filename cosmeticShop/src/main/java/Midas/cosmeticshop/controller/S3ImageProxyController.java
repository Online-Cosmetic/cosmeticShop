package Midas.cosmeticshop.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.S3Exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;

@RestController
@ConditionalOnProperty(name = "app.storage", havingValue = "s3")
@RequiredArgsConstructor
public class S3ImageProxyController {

    @Value("${aws.s3.bucket}") private String bucket;
    @Value("${aws.s3.region:ap-northeast-2}") private String region;

    private volatile S3Client s3;

    @GetMapping("/images/**")
    public ResponseEntity<InputStreamResource> serve(HttpServletRequest request) {
        try {
            // "/images/foo/bar.jpg" -> "images/foo/bar.jpg"
            String fileName = request.getRequestURI().replaceFirst("^/images/?", "");
            if (fileName.isBlank() || fileName.contains("..")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            String key = "images/" + fileName;

            GetObjectRequest get = GetObjectRequest.builder()
                    .bucket(bucket).key(key).build();

            ResponseInputStream<GetObjectResponse> body = s3().getObject(get);
            GetObjectResponse meta = body.response();

            HttpHeaders headers = new HttpHeaders();
            String ct = meta.contentType() != null ? meta.contentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
            headers.setContentType(MediaType.parseMediaType(ct));
            if (meta.contentLength() != null) headers.setContentLength(meta.contentLength());
            headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());

            return new ResponseEntity<>(new InputStreamResource(body), headers, HttpStatus.OK);

        } catch (NoSuchKeyException e) {
            return ResponseEntity.notFound().build();
        } catch (S3Exception e) {
            return ResponseEntity.status(e.statusCode()).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private S3Client s3() {
        if (s3 == null) {
            synchronized (this) {
                if (s3 == null) {
                    s3 = S3Client.builder()
                            .region(Region.of(region))
                            // EC2 IAM Role 사용(DefaultCredentialsProvider)
                            .build();
                }
            }
        }
        return s3;
    }
}
