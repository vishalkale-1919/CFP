package com.carbon.platform.controller;

import com.carbon.platform.dto.ApiResponse;
import com.carbon.platform.dto.DashboardDto;
import com.carbon.platform.model.CarbonRecord;
import com.carbon.platform.model.User;
import com.carbon.platform.repository.CarbonRecordRepository;
import com.carbon.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/carbon/metrics") // 🌟 FIXED: Changed from /dashboard to match your React App.jsx Axios endpoint call
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired private CarbonRecordRepository carbonRecordRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping // 🌟 Mapping remains a standard clean GET request
    public ResponseEntity<ApiResponse<DashboardDto>> getDashboardMetrics() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        List<CarbonRecord> records = carbonRecordRepository
                .findByUserAndRecordDateBetweenOrderByRecordDateAsc(user, LocalDate.now().minusDays(7), LocalDate.now());

        Double currentScore = records.stream()
                .filter(r -> r.getRecordDate().equals(LocalDate.now()))
                .map(CarbonRecord::getTotalEmission).findFirst().orElse(0.0);

        Double avgScore = records.stream().mapToDouble(CarbonRecord::getTotalEmission).average().orElse(0.0);

        DashboardDto data = DashboardDto.builder()
                .currentDayScore(currentScore)
                .weeklyAverage(avgScore)
                .emissionBreakdown(Map.of("Transport", 40.0, "Electricity", 35.0, "Food", 15.0, "Shopping", 10.0))
                .build();

        return ResponseEntity.ok(ApiResponse.success("Dashboard data aggregated", data));
    }
}