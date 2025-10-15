package Midas.cosmeticshop.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@RestController
@ConditionalOnProperty(name = "app.storage", havingValue = "supabase")
public class ImageProxyController {

    @Value("${supabase.url}")         private String supabaseUrl;
    @Value("${supabase.service-key}") private String serviceKey;
    @Value("${supabase.bucket}")      private String bucket;

    private static final HttpClient http = HttpClient.newHttpClient();

    /** 프론트: <img src="/images/xxx.jpg"> → 여기로 들어옴 → Supabase에서 읽어 스트리밍 */
    @GetMapping("/images/**")
    public ResponseEntity<byte[]> serve(HttpServletRequest request) {
        try {
            String fileName = request.getRequestURI().replaceFirst("^/images/?", ""); // "xxx.jpg" or "dir/xxx.jpg"
            String key = "images/" + fileName;

            HttpRequest req = HttpRequest.newBuilder(
                            URI.create(supabaseUrl + "/storage/v1/object/" + bucket + "/" + key))
                    .header("Authorization", "Bearer " + serviceKey)
                    .GET()
                    .build();

            HttpResponse<byte[]> res = http.send(req, HttpResponse.BodyHandlers.ofByteArray());
            if (res.statusCode() == 200) {
                HttpHeaders headers = new HttpHeaders();
                res.headers().firstValue("content-type")
                        .ifPresent(ct -> headers.setContentType(MediaType.parseMediaType(ct)));
                headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());
                return new ResponseEntity<>(res.body(), headers, HttpStatus.OK);
            }
            return ResponseEntity.status(res.statusCode()).build();

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}