-- ============================================
-- HalalMap Georgia - Database Schema
-- PostgreSQL with PostGIS for geospatial queries
-- ============================================

-- Enable PostGIS extension for geographic calculations
-- This allows us to perform efficient distance-based queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- PLACES TABLE
-- Stores halal restaurants and mosques in Georgia
-- ============================================
CREATE TABLE places (
    -- Primary key: Auto-incrementing unique identifier
    id SERIAL PRIMARY KEY,
    
    -- Place name (e.g., "Shawarma King", "Tbilisi Central Mosque")
    name VARCHAR(255) NOT NULL,
    
    -- Type: 'restaurant' or 'mosque'
    -- Used for filtering in the frontend
    type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'mosque')),
    
    -- Geographic coordinates
    -- lat: Latitude (-90 to 90)
    -- lng: Longitude (-180 to 180)
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- PostGIS geography point for efficient spatial queries
    -- Automatically calculated from lat/lng using a trigger
    location GEOGRAPHY(POINT, 4326),
    
    -- City name (e.g., "Tbilisi", "Batumi")
    city VARCHAR(100),
    
    -- Full address for display
    address TEXT,
    
    -- Description or additional information
    description TEXT,
    
    -- Contact information
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Verification status (admin-controlled)
    -- True means the place has been verified as halal
    verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps for tracking changes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Spatial index on location for fast geographic queries
-- This dramatically speeds up "nearby places" queries
CREATE INDEX idx_places_location ON places USING GIST(location);

-- Index on type for filtering (restaurant vs mosque)
CREATE INDEX idx_places_type ON places(type);

-- Index on verified status for admin queries
CREATE INDEX idx_places_verified ON places(verified);

-- Composite index for common query patterns
CREATE INDEX idx_places_type_verified ON places(type, verified);

-- ============================================
-- TRIGGER TO AUTO-UPDATE LOCATION GEOGRAPHY
-- This keeps the PostGIS location field in sync with lat/lng
-- ============================================
CREATE OR REPLACE FUNCTION update_location_geography()
RETURNS TRIGGER AS $$
BEGIN
    -- Convert latitude and longitude to PostGIS geography point
    -- SRID 4326 is the standard WGS84 coordinate system (GPS)
    NEW.location := ST_SetSRID(
        ST_MakePoint(NEW.longitude, NEW.latitude),
        4326
    )::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger fires before INSERT or UPDATE
CREATE TRIGGER set_location_geography
    BEFORE INSERT OR UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION update_location_geography();

-- ============================================
-- TRIGGER TO AUTO-UPDATE updated_at TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_places_updated_at
    BEFORE UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ADMIN USERS TABLE
-- Stores admin credentials for the admin panel
-- ============================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    
    -- Username for login
    username VARCHAR(100) UNIQUE NOT NULL,
    
    -- Hashed password (NEVER store plain text passwords)
    -- Use bcrypt or similar hashing algorithm
    password_hash VARCHAR(255) NOT NULL,
    
    -- Email for notifications
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Account status
    active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- ============================================
-- FUNCTION: GET NEARBY PLACES
-- Efficient function to find places within a radius
-- ============================================
CREATE OR REPLACE FUNCTION get_nearby_places(
    user_lat DECIMAL,
    user_lng DECIMAL,
    radius_meters INTEGER DEFAULT 5000,
    place_type VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR,
    type VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    city VARCHAR,
    address TEXT,
    description TEXT,
    phone VARCHAR,
    website VARCHAR,
    verified BOOLEAN,
    distance_meters DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.type,
        p.latitude,
        p.longitude,
        p.city,
        p.address,
        p.description,
        p.phone,
        p.website,
        p.verified,
        -- Calculate distance in meters using PostGIS
        ST_Distance(
            p.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) as distance_meters
    FROM 
        places p
    WHERE 
        -- Filter by distance (within radius)
        ST_DWithin(
            p.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
            radius_meters
        )
        -- Optional type filter (restaurant or mosque)
        AND (place_type IS NULL OR p.type = place_type)
    ORDER BY 
        distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE places IS 'Stores halal restaurants and mosques in Georgia';
COMMENT ON COLUMN places.location IS 'PostGIS geography point for spatial queries';
COMMENT ON COLUMN places.verified IS 'Admin-verified halal certification';
COMMENT ON FUNCTION get_nearby_places IS 'Returns places within radius sorted by distance';
