package com.carbon.platform.service;

import com.carbon.platform.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class AIService {

    @Value("${ai.service.url}")
    private String aiUrl;

    public Map<String, Object> fetchRecommendationEngineData(User user) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            // Forward context to Python Engine Module
            return restTemplate.getForObject(aiUrl + "?userId=" + user.getId(), Map.class);
        } catch (Exception e) {
            return Map.of("advice", "AI suggestions momentarily unavailable. Try cutting back on private vehicle usage today!");
        }
    }
}