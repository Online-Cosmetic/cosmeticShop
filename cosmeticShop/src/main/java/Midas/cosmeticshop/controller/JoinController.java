package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.signup.CompanySignUpDTO;
import Midas.cosmeticshop.dto.signup.UserSignUpDTO;
import Midas.cosmeticshop.service.JoinService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class JoinController {

    private final JoinService joinService;

    public JoinController(JoinService joinService) {
        this.joinService = joinService;
    }

    @PostMapping("/signup/user")
    public ResponseEntity<String> signupUser(@RequestBody @Valid UserSignUpDTO dto) {
        try {
            joinService.joinUser(dto);
            return ResponseEntity.ok("USER 가입 성공");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/signup/company", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> signupCompany(
            @ModelAttribute @Valid CompanySignUpDTO dto,
            @RequestParam("businessLicense") MultipartFile businessLicense) {
        try {
            joinService.joinCompany(dto, businessLicense);
            return ResponseEntity.ok("COMPANY 가입 성공");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
