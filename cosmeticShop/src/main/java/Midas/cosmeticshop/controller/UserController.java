package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.UserInfo.NicknameChangeDTO;
import Midas.cosmeticshop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1. 아이디+이메일로 회원 존재 여부 확인
    @PostMapping("/check")
    public ResponseEntity<?> checkUser(@RequestBody Map<String, String> req) {
        String userId = req.get("userId");
        String email = req.get("email");
        boolean exists = userService.existsByUserIdAndEmail(userId, email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // 2. 인증번호 이메일 발송
    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> req) {
        String userId = req.get("userId");
        String email = req.get("email");
        userService.sendVerificationCode(userId, email);
        return ResponseEntity.ok().build();
    }

    // 3. 인증번호 검증
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> req) {
        String userId = req.get("userId");
        String code = req.get("code");
        boolean verified = userService.verifyCode(userId, code);
        return ResponseEntity.ok(Map.of("verified", verified));
    }

    // 4. 비밀번호 변경
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> req) {
        String userId = req.get("userId");
        String newPassword = req.get("newPassword");
        userService.changePassword(userId, newPassword);
        return ResponseEntity.ok().build();
    }


    // 닉네임 변경
    @PatchMapping("/me/nickName")
    public ResponseEntity<Void> changeNickName(@AuthenticationPrincipal BaseUserDetails principal,
                                               @Valid @RequestBody NicknameChangeDTO nicknameChangeDTO) {
        return userService.changeNickName(principal, nicknameChangeDTO);
    }
}