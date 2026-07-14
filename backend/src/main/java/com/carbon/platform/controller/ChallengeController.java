package com.carbon.platform.controller;

import com.carbon.platform.dto.ApiResponse;
import com.carbon.platform.dto.GamificationDto;
import com.carbon.platform.model.User;
import com.carbon.platform.repository.UserRepository;
import com.carbon.platform.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gamification")
@CrossOrigin(origins = "http://localhost:5173")
public class ChallengeController {

    @Autowired private ChallengeService challengeService;
    @Autowired private UserRepository userRepository;

    @GetMapping({"", "/hub"}) // 🌟 ADJUSTED: Named explicitly so you can reference it clearly from frontend
    public ResponseEntity<ApiResponse<GamificationDto>> getGamificationHub() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(name).orElseThrow(() -> new RuntimeException("Missing context"));
        return ResponseEntity.ok(ApiResponse.success("Gamification data sync'd", challengeService.getGamificationContext(user)));
    }

    @PostMapping({"/challenges/complete/{id}", "/challenges/{id}/complete"}) // 🌟 FIXED: Map to both path layouts to support both frontends
    public ResponseEntity<ApiResponse<String>> processCompletion(@PathVariable Long id) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(name).orElseThrow(() -> new RuntimeException("Missing context"));
        String msg = challengeService.completeChallenge(id, user);
        return ResponseEntity.ok(ApiResponse.success(msg, msg));
    }
}