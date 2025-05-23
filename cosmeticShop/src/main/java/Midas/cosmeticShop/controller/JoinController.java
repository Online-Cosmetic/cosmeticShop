package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.signup.CompanySignUpDTO;
import Midas.cosmeticshop.dto.signup.UserSignUpDTO;
import Midas.cosmeticshop.service.JoinService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class JoinController {

    private final JoinService joinService;

    public JoinController(JoinService joinService) {
        this.joinService = joinService;
    }

    @PostMapping("/signup/user")
    public ResponseEntity<String> signupUser(@RequestBody @Valid UserSignUpDTO dto) {
        joinService.joinUser(dto);
        return ResponseEntity.ok("USER 가입 성공");
    }

    @PostMapping("/signup/company")
    public ResponseEntity<String> signupCompany(@RequestBody @Valid CompanySignUpDTO dto) {
        joinService.joinCompany(dto);
        return ResponseEntity.ok("COMPANY 가입 성공");
    }

}
