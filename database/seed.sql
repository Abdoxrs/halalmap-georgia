-- ============================================
-- HalalMap Georgia - Sample Seed Data
-- Populate database with initial halal places
-- ============================================

-- ============================================
-- CREATE DEFAULT ADMIN USER
-- Username: admin
-- Password: Admin@123 (CHANGE THIS IN PRODUCTION!)
-- Password hash generated with bcrypt rounds=10
-- ============================================
INSERT INTO admin_users (username, password_hash, email) VALUES
    -- Use bcrypt to hash: Admin@123
    -- In production, run: bcrypt.hash('Admin@123', 10)
    ('admin', '$2b$10$rq5vN5YZwKu5uV0qH8qfLOxKQ6tX0h4B7w3jZ8qX9yF5Q3H7W9jZe', 'admin@halalmap.ge');

-- ============================================
-- SAMPLE HALAL RESTAURANTS IN TBILISI
-- ============================================
INSERT INTO places (name, type, latitude, longitude, city, address, description, phone, website, verified) VALUES
    -- Restaurant 1: Shawarma King
    (
        'Shawarma King',
        'restaurant',
        41.7151,  -- Tbilisi city center
        44.8271,
        'Tbilisi',
        'Rustaveli Avenue 12, Tbilisi',
        'Authentic Middle Eastern shawarma and falafel. Halal certified. Popular spot for quick bites.',
        '+995 555 123 456',
        'https://shawarmaking.ge',
        TRUE  -- Verified
    ),
    
    -- Restaurant 2: Istanbul Kebab House
    (
        'Istanbul Kebab House',
        'restaurant',
        41.7089,
        44.8015,
        'Tbilisi',
        'Chavchavadze Avenue 45, Tbilisi',
        'Turkish cuisine with authentic Adana and Urfa kebabs. Family-friendly atmosphere.',
        '+995 555 234 567',
        'https://istanbulkebab.ge',
        TRUE
    ),
    
    -- Restaurant 3: Medina Grill
    (
        'Medina Grill',
        'restaurant',
        41.7256,
        44.7907,
        'Tbilisi',
        'Agmashenebeli Avenue 78, Tbilisi',
        'Mediterranean and Middle Eastern grill. Fresh ingredients daily.',
        '+995 555 345 678',
        NULL,
        TRUE
    ),
    
    -- Restaurant 4: Al-Madina Restaurant
    (
        'Al-Madina Restaurant',
        'restaurant',
        41.6938,
        44.8341,
        'Tbilisi',
        'Vazha-Pshavela Avenue 23, Tbilisi',
        'Yemeni and Arabic cuisine. Known for mandi and kabsa rice dishes.',
        '+995 555 456 789',
        'https://almadina.ge',
        FALSE  -- Not yet verified
    ),
    
    -- Restaurant 5: Anatolian Taste
    (
        'Anatolian Taste',
        'restaurant',
        41.7195,
        44.7634,
        'Tbilisi',
        'Pekini Avenue 5, Tbilisi',
        'Turkish breakfast and traditional pide. All meat is halal certified.',
        '+995 555 567 890',
        NULL,
        TRUE
    );

-- ============================================
-- SAMPLE HALAL RESTAURANTS IN BATUMI
-- ============================================
INSERT INTO places (name, type, latitude, longitude, city, address, description, phone, website, verified) VALUES
    -- Restaurant 6: Batumi Shawarma
    (
        'Batumi Shawarma',
        'restaurant',
        41.6417,
        41.6333,
        'Batumi',
        'Gogebashvili Street 12, Batumi',
        'Popular shawarma spot near the beach. Quick service.',
        '+995 555 678 901',
        NULL,
        TRUE
    ),
    
    -- Restaurant 7: Seaside Halal Grill
    (
        'Seaside Halal Grill',
        'restaurant',
        41.6483,
        41.6406,
        'Batumi',
        'Baratashvili Street 89, Batumi',
        'Seafood and grilled meats. Beautiful sea view.',
        '+995 555 789 012',
        'https://seasidehalal.ge',
        FALSE
    );

-- ============================================
-- MOSQUES IN TBILISI
-- ============================================
INSERT INTO places (name, type, latitude, longitude, city, address, description, phone, website, verified) VALUES
    -- Mosque 1: Tbilisi Central Mosque (Juma Mosque)
    (
        'Tbilisi Central Mosque (Juma Mosque)',
        'mosque',
        41.6894,
        44.8089,
        'Tbilisi',
        'Botanikuri Street 32, Tbilisi',
        'Main mosque in Tbilisi. Built in the 19th century. Features both Sunni and Shia prayer halls.',
        '+995 322 987 654',
        NULL,
        TRUE
    ),
    
    -- Mosque 2: Abu Bakr Mosque
    (
        'Abu Bakr Mosque',
        'mosque',
        41.7234,
        44.7698,
        'Tbilisi',
        'Mosashvili Street 15, Tbilisi',
        'Modern mosque with separate prayer areas for men and women. Islamic library available.',
        '+995 322 876 543',
        NULL,
        TRUE
    ),
    
    -- Mosque 3: Lilo Mosque
    (
        'Lilo Mosque',
        'mosque',
        41.7656,
        44.8589,
        'Tbilisi',
        'Lilo District, Tbilisi',
        'Community mosque serving the Lilo neighborhood.',
        '+995 555 765 432',
        NULL,
        TRUE
    );

-- ============================================
-- MOSQUES IN OTHER CITIES
-- ============================================
INSERT INTO places (name, type, latitude, longitude, city, address, description, phone, website, verified) VALUES
    -- Mosque 4: Batumi Mosque (Orta Jame)
    (
        'Batumi Mosque (Orta Jame)',
        'mosque',
        41.6440,
        41.6339,
        'Batumi',
        'Kutaisi Street 23, Batumi',
        'Historic mosque built in 1866. Central location in Batumi.',
        '+995 422 654 321',
        NULL,
        TRUE
    ),
    
    -- Mosque 5: Rustavi Mosque
    (
        'Rustavi Mosque',
        'mosque',
        41.5495,
        45.0064,
        'Rustavi',
        'Merab Kostava Street 45, Rustavi',
        'Mosque serving the Muslim community in Rustavi.',
        '+995 555 543 210',
        NULL,
        FALSE
    );

-- ============================================
-- ADDITIONAL UNVERIFIED PLACES
-- These are pending verification by admins
-- ============================================
INSERT INTO places (name, type, latitude, longitude, city, address, description, phone, verified) VALUES
    (
        'Halal Corner',
        'restaurant',
        41.7123,
        44.8456,
        'Tbilisi',
        'Aghmashenebeli Avenue 156, Tbilisi',
        'New halal fast food restaurant. Pending verification.',
        '+995 555 111 222',
        FALSE
    ),
    (
        'Marneuli Mosque',
        'mosque',
        41.4758,
        44.8083,
        'Marneuli',
        'Marneuli Center',
        'Main mosque in Marneuli district.',
        NULL,
        FALSE
    );

-- ============================================
-- VERIFICATION NOTES
-- ============================================
-- After running this seed file:
-- 1. Change the admin password immediately
-- 2. Verify unverified places through the admin panel
-- 3. Add more places as needed
-- 4. Update contact information regularly
-- ============================================

-- Query to check seeded data:
-- SELECT name, type, city, verified FROM places ORDER BY city, type;
-- SELECT COUNT(*) as total_places, type FROM places GROUP BY type;
