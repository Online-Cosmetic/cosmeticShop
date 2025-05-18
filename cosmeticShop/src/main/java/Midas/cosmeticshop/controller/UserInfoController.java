package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.UserInfo.NicknameChangeDTO;
import Midas.cosmeticshop.service.UserInfoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserInfoService userInfoService;

    /* 닉네임 변경 */
    @PatchMapping("/nickName")
    public ResponseEntity<Void> changeNickName(@AuthenticationPrincipal BaseUserDetails principal,
                                         @Valid @RequestBody NicknameChangeDTO nicknameChangeDTO) {
        return userInfoService.changeNickName(principal, nicknameChangeDTO);
    }

    /* 비밀번호 변경*/

}
