-- Create database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS carbon_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE carbon_db;

-- Drop tables if they exist to allow clean development runs
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS challenge_progress;
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS carbon_records;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    total_points INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB;

-- Indexing for authentication and user search profiles
CREATE INDEX idx_users_username ON users(username);

-- ==========================================
-- 2. CARBON RECORDS TABLE
-- ==========================================
CREATE TABLE carbon_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    record_date DATE NOT NULL,
    transport_emission DOUBLE PRECISION NOT NULL,
    electricity_emission DOUBLE PRECISION NOT NULL,
    food_emission DOUBLE PRECISION NOT NULL,
    shopping_emission DOUBLE PRECISION NOT NULL,
    total_emission DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_carbon_records_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_record_date UNIQUE (user_id, record_date)
) ENGINE=InnoDB;

-- Optimized indexes for Dashboard Date range operations
CREATE INDEX idx_carbon_records_date ON carbon_records(record_date);
CREATE INDEX idx_user_date_range ON carbon_records(user_id, record_date);

-- ==========================================
-- 3. CHALLENGES TABLE
-- ==========================================
CREATE TABLE challenges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    points_reward INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    CONSTRAINT chk_points_reward CHECK (points_reward >= 0)
) ENGINE=InnoDB;

-- ==========================================
-- 4. CHALLENGE PROGRESS TABLE
-- ==========================================
CREATE TABLE challenge_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    challenge_id BIGINT NOT NULL,
    status VARCHAR(30) DEFAULT 'IN_PROGRESS' NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_challenge FOREIGN KEY (challenge_id) 
        REFERENCES challenges(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_challenge UNIQUE (user_id, challenge_id),
    CONSTRAINT chk_progress_status CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED'))
) ENGINE=InnoDB;

-- Indexing for gamification engine lookups
CREATE INDEX idx_challenge_progress_user ON challenge_progress(user_id, status);

-- ==========================================
-- 5. REWARDS TABLE
-- ==========================================
CREATE TABLE rewards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    points_required INT NOT NULL,
    CONSTRAINT chk_points_required CHECK (points_required > 0)
) ENGINE=InnoDB;