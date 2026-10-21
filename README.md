# 🛰️ OrbitWatch — SDG Intelligence Platform

**OrbitWatch** converts open satellite imagery into district-level environmental intelligence, automating UN Sustainable Development Goal (SDG) tracking for governments, NGOs, and citizens.

> 🌐 **Live Demo:** [watchorbit.netlify.app](https://watchorbit.netlify.app)

---

## The Problem

- Environmental monitoring is slow, expensive, and locked behind specialized GIS software.
- Satellite data exists but is inaccessible to local policymakers.
- SDG compliance tracking relies on outdated manual surveys, not real-time data.

## Our Solution

| Feature | Description |
|---------|-------------|
| **Automated Satellite Pipeline** | Fetches and processes Sentinel-2 imagery via Microsoft Planetary Computer |
| **Spectral Index Analysis** | Computes NDWI (water), NDVI (vegetation), NDBI (urban) for any Indian district |
| **SDG Scoring Engine** | Maps environmental metrics to SDG-6, SDG-11, SDG-13, SDG-15 compliance scores |
| **AI-Powered Insights** | Rule-based risk analysis with 5-year predictive modeling (scikit-learn) |
| **Policy-Ready PDF Reports** | One-click export of publication-quality reports with vector graphics |
| **Interactive GIS Map** | Click any district on India's map to explore its environmental data |

---

## Architecture

```
┌─────────────────┐     HTTPS      ┌──────────────────────┐     STAC API     ┌──────────────────┐
│   React SPA     │ ─────────────► │   FastAPI Backend    │ ──────────────►  │ Microsoft        │
│   (Netlify)     │ ◄───────────── │   (Render)           │ ◄──────────────  │ Planetary        │
│                 │    JSON        │                      │   Sentinel-2     │ Computer         │
│  • Leaflet Map  │                │  • Spectral Indices  │   L2A Imagery    └──────────────────┘
│  • Chart.js     │                │  • SDG Scoring       │
│  • jsPDF Export │                │  • ML Predictions    │
└─────────────────┘                └──────────────────────┘
```

---

## Tech Stack

### Frontend
- **React 19** (Vite) — SPA with dark/light theme
- **Leaflet** — Interactive district-level GIS map with GeoJSON boundaries
- **Chart.js** — Animated line/bar charts with gradient fills
- **Framer Motion** — Smooth UI micro-interactions
- **jsPDF** — Client-side vector PDF generation (no screenshots)

### Backend
- **FastAPI** (Python) — Async REST API with input validation
- **Sentinel-2 Pipeline** — STAC API → Rasterio → NumPy spectral index computation
- **scikit-learn** — Linear regression for 5-year environmental trend predictions
- **Security** — Strict CORS, sanitized inputs, in-memory rate-limiting & caching

---

## How Data is Processed

1. **User selects** a district + year on the dashboard
2. **Backend queries** Planetary Computer STAC API for cloud-free Sentinel-2 L2A imagery
3. **Spectral indices** are computed:
   - **NDWI** = (Green − NIR) / (Green + NIR) → water body mapping
   - **NDVI** = (NIR − Red) / (NIR + Red) → vegetation health
   - **NDBI** = (SWIR − NIR) / (SWIR + NIR) → built-up area detection
4. **Pixel data** is converted to km² and compared against baselines
5. **SDG scores** (0–100) are generated for SDG-6, 11, 13, 15
6. **ML predictions** forecast 5-year environmental trends

---

## Project Structure

```
OrbitWatch/
├── backend/
│   ├── main.py                    # FastAPI entry point + CORS config
│   ├── api/routes.py              # REST endpoints with caching & validation
│   ├── processing/
│   │   ├── satellite.py           # Sentinel-2 STAC API data acquisition
│   │   ├── indices.py             # NDWI/NDVI/NDBI spectral computation
│   │   └── pipeline.py            # Orchestrates fetch → process → score
│   ├── ml/
│   │   ├── insights.py            # Rule-based environmental risk analysis
│   │   └── prediction.py          # scikit-learn 5-year trend forecasting
│   └── utils/districts.py         # 150+ Indian districts with bounding boxes
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Hero section + feature highlights
│   │   │   ├── Dashboard.jsx      # Core app — metrics, map, insights
│   │   │   ├── WaterPage.jsx      # Detailed NDWI analysis
│   │   │   ├── VegetationPage.jsx # Detailed NDVI analysis
│   │   │   ├── UrbanPage.jsx      # Detailed NDBI analysis
│   │   │   └── ClimatePage.jsx    # Temperature & climate trends
│   │   ├── maps/OrbitMap.jsx      # Leaflet map with district GeoJSON
│   │   ├── components/
│   │   │   ├── AnimatedCharts.jsx # Reusable Chart.js components
│   │   │   ├── ReportExporter.js  # Custom jsPDF vector PDF engine
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   └── Topbar.jsx         # Search bar + year selector
│   │   ├── hooks/useDashboard.js  # Data fetching hooks
│   │   └── services/api.js        # Axios wrapper with error handling
│   └── index.html
│
└── README.md
```

---

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## Key Highlights

- **100% Mobile Responsive** — Complex GIS layouts collapse into clean vertical stacks
- **Graceful Degradation** — If the backend sleeps, the frontend seamlessly switches to demo mode
- **Zero-Dependency PDF** — Custom vector-drawn reports (no blurry HTML screenshots)
- **Security Hardened** — Strict CORS, input sanitization, memory-bounded caching

---

## Future Scope

- Google Earth Engine integration for historical Landsat data (1984–present)
- High-resolution commercial satellite data (Planet/Maxar)
- Multi-lingual PDF reports for local governance bodies

---

