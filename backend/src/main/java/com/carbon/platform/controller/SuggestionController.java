package com.carbon.platform.controller;

import com.carbon.platform.dto.ApiResponse;
import com.carbon.platform.model.Challenge;
import com.carbon.platform.model.User;
import com.carbon.platform.repository.ChallengeRepository;
import com.carbon.platform.repository.UserRepository;
import com.carbon.platform.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173") // 🌟 FIXED: Changed https to http
public class SuggestionController {

    @Autowired private AIService aiService;
    @Autowired private ChallengeRepository challengeRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiSuggestions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ApiResponse.success("AI Recommendation ready", aiService.fetchRecommendationEngineData(user)));
    }

    @GetMapping("/gamification/challenges") // 🌟 FIXED: Adjusted path context so your React App.jsx Axios calls can find it cleanly!
    public ResponseEntity<ApiResponse<Page<Challenge>>> getPaginatedChallenges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Challenge> executionPage = challengeRepository.findAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Paginated Active Challenges returned", executionPage));
    }
}