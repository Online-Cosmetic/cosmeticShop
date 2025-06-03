package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.DailyOrderStatsDTO;
import Midas.cosmeticshop.dto.MonthlyOrderStatsDTO;
import Midas.cosmeticshop.dto.YearlyOrderStatsDTO;
import Midas.cosmeticshop.service.OrderStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/order_stats")
public class OrderStatsController {

    private final OrderStatsService orderStatsService;

    public OrderStatsController (OrderStatsService orderStatsService) {
        this.orderStatsService = orderStatsService;
    }

    @GetMapping("/day")
    public ResponseEntity<List<DailyOrderStatsDTO>> getDailyOrderStats (@RequestParam LocalDate startDate,
                                                                        @RequestParam LocalDate endDate,
                                                                        Authentication authentication) {
        return ResponseEntity.ok().body(orderStatsService.getDailyOrderStats(startDate, endDate, authentication.getName()));
    }

    @GetMapping("/month")
    public ResponseEntity<List<MonthlyOrderStatsDTO>> getMonthlyOrderStats (@RequestParam LocalDate startDate,
                                                                            @RequestParam LocalDate endDate,
                                                                            Authentication authentication) {
        return ResponseEntity.ok().body(orderStatsService.getMonthlyOrderStats(startDate, endDate, authentication.getName()));
    }

    @GetMapping("/day")
    public ResponseEntity<List<YearlyOrderStatsDTO>> getYearlyOrderStats (@RequestParam LocalDate startDate,
                                                                          @RequestParam LocalDate endDate,
                                                                          Authentication authentication) {
        return ResponseEntity.ok().body(orderStatsService.getYearlyOrderStats(startDate, endDate, authentication.getName()));
    }


}
