# 🛰️ OrbitWatch: Hackathon Documentation

## 1. Elevator Pitch
**OrbitWatch** is a real-time satellite intelligence platform that converts open satellite imagery (Sentinel-2, ISRO Bhuvan) into actionable, district-level environmental insights. It automates the tracking of UN Sustainable Development Goals (SDGs), providing governments, NGOs, and citizens with AI-driven insights, predictive modeling, and policy-ready reports without requiring specialized GIS knowledge.

---

## 2. The Problem & Our Solution
### The Problem
- Environmental monitoring is slow, expensive, and requires specialized GIS software.
- Satellite data exists but is inaccessible to local policymakers.
- SDG compliance tracking relies on outdated manual surveys rather than real-time data.

### The Solution
- **Automated Pipeline:** Directly fetches and processes Sentinel-2 satellite data.
- **Actionable Dashboards:** Converts raw pixels into understandable metrics (Water area, Forest cover, Urban expansion).
- **Automated Reporting:** Generates polished, accessible PDF reports with policy recommendations.

---

## 3. Architecture & Data Flow

OrbitWatch uses a decoupled Client-Server architecture:

1. **Client (React SPA):** Users select a district and a year. The frontend fetches data from the backend.
2. **API (FastAPI):** Receives the request and pulls spatial data from the Microsoft Planetary Computer STAC API (Sentinel-2 L2A).
3. **Processing Engine:** The backend calculates spectral indices (NDWI, NDVI, NDBI), aggregates the data, and runs Scikit-Learn predictive models.
4. **Presentation:** The frontend renders interactive charts (Chart.js), dynamic maps (Leaflet), and generates on-the-fly PDF reports (jsPDF).

---

## 4. How Data is Processed (The Satellite Pipeline)

When a user requests data for a specific district:
1. **Data Acquisition:** The backend queries the Planetary Computer STAC API to find cloud-free Sentinel-2 imagery for the requested time and location.
2. **Spectral Index Calculation:**
   - **NDWI (Normalized Difference Water Index):** Uses Green and NIR bands to map water bodies.
   - **NDVI (Normalized Difference Vegetation Index):** Uses Red and NIR bands to measure vegetation health and forest cover.
   - **NDBI (Normalized Difference Built-up Index):** Uses SWIR and NIR bands to map urban expansion.
3. **Risk & SDG Scoring:** The raw pixel data is converted to square kilometers. The system compares current data against baseline years to calculate SDG scores (out of 100).
4. **AI Insights & Predictions:** The backend uses `scikit-learn` linear regression on historical time-series data to predict 5-year trends (e.g., forecasting urban growth by 2030).

---

## 5. Tech Stack & Libraries

### Frontend (Deployed on Netlify)
- **Framework:** React 19 (via Vite)
- **Routing:** React Router DOM
- **Maps:** Leaflet & React-Leaflet (with GeoJSON for district boundaries)
- **Charts:** Chart.js & React-Chartjs-2
- **Animations:** Framer Motion (for smooth micro-interactions)
- **PDF Generation:** jsPDF (Client-side rendering of crisp, ASCII-safe PDF reports)
- **Styling:** Vanilla CSS & inline styles (Dark-themed glassmorphism UI)

### Backend (Deployed on Render)
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn
- **Data Processing:** Pandas, NumPy, Xarray, Rasterio, Shapely
- **Machine Learning:** Scikit-Learn (LinearRegression)
- **API Client:** Httpx (Async HTTP requests to STAC APIs)
- **Security:** CORS Middleware, Input validation, In-memory rate limiting/caching.

---

## 6. Codebase File Structure (Which file does what)

### Frontend (`/frontend`)
*   **`src/pages/LandingPage.jsx`**: The responsive entry point. Contains the hero section, feature highlights, and the "Launch App" CTA.
*   **`src/pages/Dashboard.jsx`**: The core application logic. Manages state (district, year), handles the API calls via hooks, and stitches together the Map, Charts, and Insights sections.
*   **`src/maps/OrbitMap.jsx`**: Wraps the Leaflet map. Fetches India District GeoJSON boundaries and dynamically colors them based on the selected spectral layer (Water/Vegetation/Urban). Includes a `ResizeObserver` for mobile responsiveness.
*   **`src/components/AnimatedCharts.jsx`**: Reusable Chart.js components (`AnimatedLineChart`, `AnimatedBarChart`) with gradient fills and custom tooltips.
*   **`src/components/ReportExporter.js`**: The custom jsPDF engine. Programmatically draws the 3-page PDF report using shapes and ASCII text (avoiding blurry HTML-to-canvas rendering).
*   **`src/hooks/useDashboard.js`**: Custom React hooks (`useDashboard`, `useProcess`, `useAlerts`) that interface with the `api.js` service to fetch backend data gracefully.
*   **`src/services/api.js`**: The Axios wrapper handling API requests to the Render backend, featuring global error interceptors for graceful degradation (demo mode fallback).

### Backend (`/backend`)
*   **`main.py`**: The FastAPI application entry point. Configures CORS (restricted to the Netlify domain) and mounts the API routers.
*   **`api/routes.py`**: Defines the API endpoints (`/api/dashboard`, `/api/process`, `/api/alerts`). Contains input validation, security sanitization, and the memory-bounded cache.
*   **`services/satellite.py`**: Contains the core logic for communicating with the Planetary Computer STAC API. Computes the NDWI, NDVI, NDBI indices.
*   **`services/analytics.py`**: Contains the Scikit-Learn models. Takes the historical spectral data and generates the 5-year predictions, risk scores, and SDG compliance metrics.

---

## 7. Key Accomplishments for Hackathon
- **100% Mobile Responsive:** Complex GIS layouts perfectly collapse into vertical stacks on mobile devices.
- **Security Audited:** Production-ready backend with strict CORS, sanitized inputs, and memory-capped caching.
- **Graceful Degradation:** If the free-tier backend sleeps or fails, the frontend seamlessly falls back to a realistic "Demo Mode" so the presentation never breaks.
- **Zero-Dependency PDF Engine:** Built a custom PDF exporter from scratch that draws vector shapes rather than taking low-quality screenshots.

## 8. Future Scope
- Integration with Google Earth Engine for historical data dating back to 1984 (Landsat).
- Addition of high-resolution commercial satellite data (Planet/Maxar) for hyper-local analysis.
- Multi-lingual PDF report generation for local Gram Panchayats and municipalities.
