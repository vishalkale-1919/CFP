USE carbon_db;

-- 1. Seeding Base Global Users (Password is BCrypt hashes for 'password123')
INSERT INTO users (id, username, email, password, total_points) VALUES
(1, 'green_warrior', 'warrior@sustainability.org', '$2a$10$X5v66fXl/V5X7vD.mEaUOuL9bVv5qSOn9yVlGz36O8fF.N2V1gR1i', 350),
(2, 'eco_traveler', 'traveler@planet.com', '$2a$10$X5v66fXl/V5X7vD.mEaUOuL9bVv5qSOn9yVlGz36O8fF.N2V1gR1i', 120),
(3, 'climate_hero', 'hero@earth.net', '$2a$10$X5v66fXl/V5X7vD.mEaUOuL9bVv5qSOn9yVlGz36O8fF.N2V1gR1i', 0);

-- 2. Seeding Global Challenge Content Base
INSERT INTO challenges (id, title, description, points_reward, category) VALUES
(1, 'Pedal Power Day', 'Commute to school or work entirely using a bicycle or walking.', 50, 'TRANSPORT'),
(2, 'Vampire Power Hunt', 'Unplug all unused chargers and electronics overnight to save standby energy.', 30, 'ELECTRICITY'),
(3, 'Plant-Powered Feast', 'Eat purely plant-based/vegetarian food meals throughout the entire day.', 40, 'FOOD'),
(4, 'Thrift & Conscious Shop', 'Commit to spending 0 on fast fashion and new consumer plastics today.', 40, 'SHOPPING'),
(5, 'Mass Transit Champion', 'Ditch personal cars and use public buses or light trains for all tracking trips today.', 60, 'TRANSPORT');

-- 3. Seeding User Active Challenges Tracking Meta
INSERT INTO challenge_progress (user_id, challenge_id, status) VALUES
(1, 1, 'COMPLETED'),
(1, 3, 'COMPLETED'),
(1, 2, 'IN_PROGRESS'),
(2, 1, 'COMPLETED'),
(2, 5, 'IN_PROGRESS'),
(3, 4, 'IN_PROGRESS');

-- 4. Seeding Global Rewards Catalog
INSERT INTO rewards (id, title, description, points_required) VALUES
(1, 'Eco-Friendly E-Badge', 'Display your climate awareness badge explicitly on your social profile link.', 50),
(2, 'Tree Planting Initiative', 'We will fund planting one tree on your behalf via our partner foundations.', 200),
(3, 'Local Transit Voucher', 'Get a discount voucher code for standard city public transport lines.', 500);

-- 5. Seeding Past Historical Carbon Emission Log Track Records (For UI Charts Analytics)
-- Data for user 1 (green_warrior) - Demonstrating improvement trends
INSERT INTO carbon_records (user_id, record_date, transport_emission, electricity_emission, food_emission, shopping_emission, total_emission) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 12.5, 8.2, 5.0, 15.0, 40.7),
(1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 8.4,  8.2, 3.0, 5.0,  24.6),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 2.1,  6.1, 1.5, 5.0,  14.7),
(1, CURDATE(),                           0.0,  4.1, 1.5, 0.0,  5.6);

-- Data for user 2 (eco_traveler)
INSERT INTO carbon_records (user_id, record_date, transport_emission, electricity_emission, food_emission, shopping_emission, total_emission) VALUES
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 21.0, 12.3, 5.0, 30.0, 68.3),
(2, CURDATE(),                           10.5, 10.2, 3.0, 15.0, 38.7);