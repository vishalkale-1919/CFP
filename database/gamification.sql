USE carbon_db;

-- ==========================================
-- GLOBAL SYSTEM BADGES DEFINITIONS CATALOG
-- ==========================================
CREATE TABLE IF NOT EXISTS badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    icon_slug VARCHAR(50) NOT NULL,
    points_threshold INT NOT NULL
) ENGINE=InnoDB;

-- ==========================================
-- USER ACQUIRED BADGES (JOIN TABLE)
-- ==========================================
CREATE TABLE IF NOT EXISTS user_badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_badge UNIQUE (user_id, badge_id)
) ENGINE=InnoDB;

-- Indexing for leaderboard sorting
CREATE INDEX idx_users_points_leaderboard ON users(total_points DESC);

-- Seed static gamification structures
INSERT IGNORE INTO badges (id, name, description, icon_slug, points_threshold) VALUES
(1, 'Carbon Cadet', 'Earn your first 50 points tracking emissions.', 'cadet-star', 50),
(2, 'Eco Knight', 'Cross 200 platform experience points smoothly.', 'knight-shield', 200),
(3, 'Planet Guardian', 'Achieve elite level with 500 total points.', 'planet-globe', 500);

INSERT IGNORE INTO challenges (id, title, description, points_reward, category) VALUES
(1, 'Walk 5km Daily', 'Ditch personal vehicles completely and walk 5 kilometers today.', 50, 'TRANSPORT'),
(2, 'Vampire Energy Drop', 'Unplug standby electronics and save electricity overnight.', 30, 'ELECTRICITY'),
(3, 'Zero Plastic Purchases', 'Avoid retail products with single-use plastics today.', 40, 'SHOPPING');