package Midas.cosmeticshop.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
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
//        // 원본 파일명과 UUID를 조합해서 파일명 충돌 방지
//        String originalFileName = file.getOriginalFilename();
//        String fileName = UUID.randomUUID() + "_" + originalFileName;
//
//        try {
//            Path targetLocation = fileStorageLocation.resolve(fileName);
//            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
//            // 만약 외부에서 파일을 접근할 수 있도록 /images/ 경로에 매핑하였다면, 그 URL을 반환
//            return "/images/" + fileName;
//        } catch (IOException e) {
//            throw new RuntimeException("파일 저장에 실패했습니다. 파일명 " + fileName, e);
//        }
        // 원본 파일명 가져오기
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        // 타임스탬프 추가하여 파일명 생성 (캐싱 방지)
        String timestamp = String.valueOf(System.currentTimeMillis());
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String newFileName = timestamp + fileExtension;

        try {
            // 파일명에 부적절한 문자가 있는지 확인
            if(newFileName.contains("..")) {
                throw new IllegalArgumentException("파일명에 부적절한 문자가 포함되어 있습니다: " + newFileName);
            }

            // 파일 저장 경로 생성
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);

            // 파일 복사
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // URL 경로 반환 (상대 경로)
            return "/images/" + newFileName;
        } catch (IOException ex) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다: " + newFileName, ex);
        }
    }

    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        try {
            // imageUrl 예시: "/images/uuid_원본이름.jpg"
            Path filePath = fileStorageLocation.resolve(imageUrl.replace("/images/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + imageUrl, e);
        }
    }
}
