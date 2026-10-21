# 🛰️ OrbitWatch: Technical Stack Documentation

This document provides a comprehensive overview of the technologies, frameworks, and libraries used to build OrbitWatch. The platform follows a modern, decoupled client-server architecture designed for performance, scalability, and a seamless user experience.

---

## 1. Architecture Overview

OrbitWatch is separated into two distinct layers:
*   **Frontend (Client)**: A React Single Page Application (SPA) that handles the user interface, geospatial data visualization, and user interactions.
*   **Backend (Server)**: A FastAPI-based Python server responsible for communicating with external satellite APIs, processing geospatial data, and running predictive machine learning models.

This separation of concerns allows the frontend to remain lightweight and highly responsive, while the heavy lifting (computations, ML) is offloaded to a specialized Python environment optimized for data science.

---

## 2. Frontend (Client-Side)

The frontend focuses on delivering a responsive, interactive, and visually appealing experience, capable of rendering complex maps and charts efficiently.

### Core Frameworks
*   **React 19**: The core library for building the user interface. We utilize modern React paradigms, including hooks, functional components, and the context API for state management.
*   **Vite**: The build tool and development server. Vite provides near-instant Hot Module Replacement (HMR) and highly optimized production builds, significantly outperforming traditional bundlers.
*   **React Router DOM**: Handles client-side routing, enabling smooth transitions between the landing page and the main dashboard without triggering full page reloads.

### Geospatial & Mapping
*   **Leaflet**: The leading open-source library for interactive maps. It is lightweight, reliable, and mobile-friendly.
*   **React-Leaflet**: Provides React components for Leaflet maps, allowing us to seamlessly integrate map layers, GeoJSON data (for district boundaries), and custom UI overlays into our React component tree.

### Data Visualization & UI
*   **Chart.js & React-Chartjs-2**: Used to render responsive, interactive charts (line and bar charts) for displaying spectral index data and predictive trends. Chart.js was chosen for its reliable performance with large datasets and built-in animation support.
*   **Framer Motion**: A production-ready motion library for React. We use it to create smooth micro-interactions, layout animations, and element reveals, contributing to a premium, polished feel.
*   **Vanilla CSS**: We opted for custom Vanilla CSS for styling to maintain strict control over our design system. This allows us to achieve our specific dark-themed, glassmorphism aesthetic without the bloat of heavy UI component libraries.

### Utilities
*   **jsPDF**: A client-side library for generating PDF documents. We built a custom export engine that programmatically draws vector shapes and text directly into the PDF, ensuring crisp, high-quality policy reports (avoiding the common pitfall of blurry HTML-to-canvas screenshots).

### Hosting
*   **Netlify**: The frontend is deployed via Netlify, utilizing its Edge network for lightning-fast asset delivery globally.

---

## 3. Backend (Server-Side)

The backend is engineered to handle intensive geospatial processing and machine learning tasks on-the-fly.

### Core Frameworks
*   **FastAPI (Python)**: A modern, high-performance web framework for building APIs with Python. It leverages standard Python type hints, enabling automatic data validation, serialization, and automatic interactive API documentation generation (Swagger UI).
*   **Uvicorn**: An ASGI (Asynchronous Server Gateway Interface) web server implementation for Python. It provides the robust async capabilities required by FastAPI to handle concurrent API requests efficiently.
*   **Httpx**: A fully featured HTTP client for Python 3 that provides async capabilities. It is used to make non-blocking requests to external STAC APIs to fetch satellite metadata rapidly.

### Data Processing & Geospatial Libraries
*   **Pandas & NumPy**: The foundational libraries for data manipulation and numerical computations in Python. Used heavily for structuring and aggregating raw pixel data.
*   **Xarray**: A library that introduces labels (dimensions, coordinates, and attributes) on top of raw NumPy-like arrays. It is crucial for handling multi-dimensional satellite data (e.g., latitude, longitude, time, spectral bands).
*   **Rasterio**: Reads and writes geospatial raster data. It is the engine used to process the raw satellite imagery files (.tif) downloaded from the Planetary Computer.
*   **Shapely**: Used for the manipulation and analysis of planar geometric objects. It assists in validating and processing the GeoJSON boundaries of the requested districts.

### Machine Learning
*   **Scikit-Learn**: The premier machine learning library in Python. We utilize its `LinearRegression` models to analyze historical environmental data (such as water loss or urban expansion) and project 5-year predictive trends and Sustainable Development Goal (SDG) compliance scores.

### External APIs
*   **Microsoft Planetary Computer STAC API**: The SpatioTemporal Asset Catalog (STAC) API provided by Microsoft is our primary spatial data source. We query this API to find and retrieve cloud-free, high-resolution **Sentinel-2 L2A** satellite imagery based on the user's selected location and timeframe.

### Security & Reliability
*   **CORS Middleware**: Configured to restrict API access exclusively to our Netlify frontend domain, preventing unauthorized cross-origin use.
*   **In-Memory Caching**: Implements a bounded cache to temporarily store recently processed district metrics. This drastically reduces redundant geospatial computations and repetitive external API calls.
*   **Graceful Degradation (Demo Mode)**: The system is designed with fault tolerance in mind. If the backend service is unavailable, sleeping, or rate-limited by upstream APIs, the frontend automatically intercepts the failure and falls back to a realistic "Demo Mode" using pre-computed synthetic data, ensuring presentations and judging sessions never break.

### Hosting
*   **Render**: The backend is hosted as a web service on Render, providing easy deployment for Python applications and seamless handling of our necessary C-based geospatial dependencies (like GDAL/Rasterio).
