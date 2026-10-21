# 🛰️ OrbitWatch: Data Flow Architecture

This document visualizes the complete end-to-end data flow of the OrbitWatch platform, from the user's initial interaction to the fetching and processing of satellite imagery.

## Flowchart

```mermaid
graph TD
    %% Entities
    User((User))
    Frontend[Frontend: React SPA<br/>Netlify]
    Backend[Backend: FastAPI<br/>Render]
    Supabase[(Supabase DB<br/>PostgreSQL + PostGIS)]
    STAC[Microsoft Planetary Computer<br/>STAC API]
    Satellite[Sentinel-2 L2A<br/>Raw Imagery]

    %% Flow
    User -- "1. Selects District & Year" --> Frontend
    Frontend -- "2. Request Data (/api/dashboard)" --> Backend
    
    Backend -- "3. Query for existing metrics" --> Supabase
    Supabase -- "4. Return cached data (if exists)" --> Backend
    
    Backend -- "5. Request Imagery (if not in DB)" --> STAC
    STAC -- "6. Locate Cloud-free Imagery" --> Satellite
    Satellite -- "7. Return raw imagery data" --> STAC
    STAC -- "8. Stream spatial data to Backend" --> Backend
    
    Backend -- "9. Calculate Indices (NDWI/NDVI/NDBI)<br>& Run Scikit-Learn ML Predictions" --> Backend
    Backend -- "10. Store processed metrics" --> Supabase
    
    Backend -- "11. Return JSON Data & ML Predictions" --> Frontend
    
    Frontend -- "12. Render Map (Leaflet) & Charts" --> User
    Frontend -- "13. Generate PDF Report (jsPDF)" --> User

    %% Styling
    classDef frontend fill:#61dafb,stroke:#333,stroke-width:2px,color:#000;
    classDef backend fill:#38b2ac,stroke:#333,stroke-width:2px,color:#fff;
    classDef database fill:#3ecf8e,stroke:#333,stroke-width:2px,color:#fff;
    classDef external fill:#f6e05e,stroke:#333,stroke-width:2px,color:#000;
    
    class Frontend frontend;
    class Backend backend;
    class Supabase database;
    class STAC,Satellite external;
```

## Step-by-Step Breakdown

1.  **User Interaction**: The user selects a specific district and year on the frontend dashboard.
2.  **API Request**: The React application sends an HTTP GET request to the FastAPI backend.
3.  **Database Check**: The backend first queries the **Supabase** database to see if the environmental metrics for that district and year have already been calculated.
4.  **Cache Hit (Fast Path)**: If the data exists in Supabase, it is returned immediately, skipping the expensive satellite download process.
5.  **External Query (Slow Path)**: If the data is missing, the backend makes an async HTTP request to the **Microsoft Planetary Computer STAC API**.
6.  **Data Acquisition**: The STAC API locates the relevant **Sentinel-2** satellite imagery that matches the geographical bounds of the district and is cloud-free.
7.  **Data Processing**: The backend downloads the raw satellite bands and uses Python libraries (Rasterio, Xarray) to calculate spectral indices (NDWI for water, NDVI for vegetation). It then runs historical data through Scikit-Learn to predict future trends.
8.  **Data Storage**: The newly processed metrics are saved into the Supabase database so future requests are instantaneous.
9.  **Response**: The backend sends a structured JSON payload back to the frontend containing all metrics, risk scores, and trend predictions.
10. **Rendering & Export**: The React frontend uses this JSON to dynamically paint the Leaflet maps, animate the Chart.js graphs, and populate the downloadable jsPDF report.
