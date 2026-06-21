package com.carbon.platform.dto;

import com.carbon.platform.model.Challenge;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class GamificationDto {
    private List<ChallengeProgressResponse> activeChallenges;
    private List<Map<String, Object>> leaderboard;
    private List<String> unlockedBadges;
    private Integer currentPoints;

    @Data
    @Builder
    public static class ChallengeProgressResponse {
        private Long challengeId;
        private String title;
        private String description;
        private Integer pointsReward;
        private String category;
        private String status;
    }
}