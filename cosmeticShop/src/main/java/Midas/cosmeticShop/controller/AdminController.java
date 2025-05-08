package Midas.cosmeticShop.controller;

import Midas.cosmeticShop.entity.BadKeyword;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
public class AdminController {

    @GetMapping("/admin")
    public String adminP() {
        return "Admin Controller";
    }

    @GetMapping("/admin/bad-keywords")
    public ResponseEntity<List<BadKeywordDTO>> getBadKeywords (Authentication authentication) {

    }

    @PostMapping("/admin/bad-keywords")
    public ResponseEntity<Void> postBadKeyword(@RequestBody BadKeywordDTO badKeywordDTO ,Authentication authentication) {

    }

    @DeleteMapping("/admin/bad-keywords/{keywordId}")
    public ResponseEntity<Void> deleteBadKeyword(@PathVariable String badKeyword, Authentication authentication) {

    }
}
