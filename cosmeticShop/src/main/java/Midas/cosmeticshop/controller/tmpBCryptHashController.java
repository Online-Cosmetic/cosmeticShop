package Midas.cosmeticshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class tmpBCryptHashController {
    
    private final BCryptPasswordEncoder passwordEncoder;
    
    public tmpBCryptHashController() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    
    @GetMapping("/generate-password-hash")
    public ResponseEntity<String> generatePasswordHash(@RequestParam(required = false, defaultValue = "qwer1234!") String password) {
        String hash = passwordEncoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("Hash: " + hash);
        return ResponseEntity.ok(hash);
    }
}