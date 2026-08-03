-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Districts table
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    geometry GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices data table
CREATE TABLE district_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER,
    ndwi FLOAT, -- Water index
    ndvi FLOAT, -- Vegetation index
    ndbi FLOAT, -- Urban index
    water_area_sqkm FLOAT,
    vegetation_area_sqkm FLOAT,
    urban_area_sqkm FLOAT,
    temperature_celsius FLOAT,
    sdg_score FLOAT,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(district_id, year, month)
);

-- Create spatial index
CREATE INDEX idx_districts_geom ON districts USING GIST (geometry);
CREATE INDEX idx_metrics_district_year ON district_metrics (district_id, year);
