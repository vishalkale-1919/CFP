package com.carbon.platform.controller;

import com.carbon.platform.dto.ApiResponse;
import com.carbon.platform.dto.CarbonInputDto;
import com.carbon.platform.model.CarbonRecord;
import com.carbon.platform.model.User;
import com.carbon.platform.repository.UserRepository;
import com.carbon.platform.service.CarbonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carbon")
@CrossOrigin(origins = "http://localhost:5173") // 🌟 FIXED: Changed https to http
public class CarbonController {

    @Autowired private CarbonService carbonService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/calculate") // 🌟 FIXED: Added path extension to match React Axios call
    public ResponseEntity<ApiResponse<CarbonRecord>> logCarbon(@Valid @RequestBody CarbonInputDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User context absent"));
        return ResponseEntity.ok(ApiResponse.success("Carbon calculation recorded", carbonService.calculateAndSave(dto, user)));
    }
}