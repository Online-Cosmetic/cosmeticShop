package Midas.cosmeticShop.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation = Paths.get(
        "C:\\Users\\yongsuchoi\\ideaProjects\\cosMall\\cosmeticShop\\src\\main\\resources\\static\\images")
        .toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("업로드 디렉토리 생성 실패", e);
        }
    }

    public String storeFile(MultipartFile file) {
        // 원본 파일명과 UUID를 조합해서 파일명 충돌 방지
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + originalFileName;

        try {
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            // 만약 외부에서 파일을 접근할 수 있도록 /images/ 경로에 매핑하였다면, 그 URL을 반환
            return "/images/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장에 실패했습니다. 파일명 " + fileName, e);
        }
    }

    public void deleteFile(String imageUrl) {

        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }

        try {
            // 저장할 때 /images/ 경로를 붙여서 URL을 반환했으므로 해당 접두어를 제거합니다.
            String fileName = imageUrl.startsWith("/images/") ? imageUrl.substring("/images/".length()) : imageUrl;
            Path targetLocation = fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(targetLocation);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제에 실패했습니다. 파일명 " + imageUrl, e);
        }
    }
}
