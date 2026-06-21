package com.carbon.platform.service;

import com.carbon.platform.dto.GamificationDto;
import com.carbon.platform.model.User;
import com.carbon.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class ChallengeService {

    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private UserRepository userRepository;

    public GamificationDto getGamificationContext(User user) {
        // 1. Map challenge progress joined with global description strings
        List<GamificationDto.ChallengeProgressResponse> active = jdbcTemplate.query(
            "SELECT c.id, c.title, c.description, c.points_reward, c.category, COALESCE(cp.status, 'AVAILABLE') as status " +
            "FROM challenges c LEFT JOIN challenge_progress cp ON c.id = cp.challenge_id AND cp.user_id = ?",
            (rs, rowNum) -> GamificationDto.ChallengeProgressResponse.builder()
                .challengeId(rs.getLong("id"))
                .title(rs.getString("title"))
                .description(rs.getString("description"))
                .pointsReward(rs.getInt("points_reward"))
                .category(rs.getString("category"))
                .status(rs.getString("status"))
                .build(), user.getId());

        // 2. Query Leaderboard positions
        List<Map<String, Object>> leaderboard = jdbcTemplate.queryForList(
            "SELECT username, total_points FROM users ORDER BY total_points DESC LIMIT 5");

        // 3. Collect badges
        List<String> badges = jdbcTemplate.query(
            "SELECT b.name FROM badges b JOIN user_badges ub ON b.id = ub.badge_id WHERE ub.user_id = ?",
            (rs, rowNum) -> rs.getString("name"), user.getId());

        return GamificationDto.builder()
                .activeChallenges(active)
                .leaderboard(leaderboard)
                .unlockedBadges(badges)
                .currentPoints(user.getTotalPoints())
                .build();
    }

    @Transactional
    public String completeChallenge(Long challengeId, User user) {
        // Enforce state transition bounds
        List<Map<String, Object>> existing = jdbcTemplate.queryForList(
            "SELECT status FROM challenge_progress WHERE user_id = ? AND challenge_id = ?", user.getId(), challengeId);

        if (!existing.isEmpty() && "COMPLETED".equals(existing.get(0).get("status"))) {
            return "Challenge already completed.";
        }

        // Fetch target reward parameters
        Map<String, Object> challenge = jdbcTemplate.queryForMap(
            "SELECT points_reward FROM challenges WHERE id = ?", challengeId);
        int reward = (int) challenge.get("points_reward");

        // Upsert state tracking parameter values
        jdbcTemplate.update(
            "INSERT INTO challenge_progress (user_id, challenge_id, status) VALUES (?, ?, 'COMPLETED') " +
            "ON DUPLICATE KEY UPDATE status = 'COMPLETED'", user.getId(), challengeId);

        // Disburse points
        user.setTotalPoints(user.getTotalPoints() + reward);
        userRepository.save(user);

        // Check for and trigger automated achievement badges updates
        jdbcTemplate.update(
            "INSERT IGNORE INTO user_badges (user_id, badge_id) " +
            "SELECT ?, id FROM badges WHERE ? >= points_threshold", user.getId(), user.getTotalPoints());

        return "Success! Reward points dispersed.";
    }
}