package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.service.GoogleAnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
public class GoogleAnalyticsController {

    private final GoogleAnalyticsService googleAnalyticsService;

    public GoogleAnalyticsController(GoogleAnalyticsService googleAnalyticsService) {
        this.googleAnalyticsService = googleAnalyticsService;
    }

    /**
     * 일별 방문자 통계 조회
     */
    @GetMapping("/visitors/daily")
    public ResponseEntity<Map<String, Object>> getDailyVisitors(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String start = startDate != null 
                ? startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().minusDays(30).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String end = endDate != null
                ? endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            return ResponseEntity.ok(googleAnalyticsService.getDailyVisitors(start, end));
        } catch (IOException e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Google Analytics 데이터 조회 실패");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * 실시간 방문자 수 조회
     */
    @GetMapping("/visitors/realtime")
    public ResponseEntity<Map<String, Object>> getRealtimeVisitors(Authentication authentication) {
        try {
            return ResponseEntity.ok(googleAnalyticsService.getRealtimeVisitors());
        } catch (IOException e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Google Analytics 실시간 데이터 조회 실패");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * 페이지뷰 통계 조회
     */
    @GetMapping("/pageviews")
    public ResponseEntity<Map<String, Object>> getPageViews(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String start = startDate != null 
                ? startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().minusDays(30).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String end = endDate != null
                ? endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            return ResponseEntity.ok(googleAnalyticsService.getPageViews(start, end));
        } catch (IOException e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Google Analytics 페이지뷰 데이터 조회 실패");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * 인기 페이지 조회
     */
    @GetMapping("/pages/top")
    public ResponseEntity<Map<String, Object>> getTopPages(
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String start = startDate != null 
                ? startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().minusDays(30).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String end = endDate != null
                ? endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            return ResponseEntity.ok(googleAnalyticsService.getTopPages(start, end, limit));
        } catch (IOException e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Google Analytics 인기 페이지 데이터 조회 실패");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * 방문자 통계 요약
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getVisitorSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        try {
            String start = startDate != null 
                ? startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().minusDays(30).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            String end = endDate != null
                ? endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            return ResponseEntity.ok(googleAnalyticsService.getVisitorSummary(start, end));
        } catch (IOException e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Google Analytics 통계 요약 데이터 조회 실패");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}

