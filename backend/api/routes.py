from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
import logging

from backend.database.connection import get_db
from backend.utils.districts import DISTRICTS, get_district, list_districts
from backend.processing.pipeline import run_pipeline, _generate_simulated_data
from backend.ml.insights import generate_insights
from backend.ml.prediction import predict_future

logger = logging.getLogger(__name__)
router = APIRouter()

# ── In-memory cache to avoid reprocessing same district+year ──────────────
_cache: dict = {}


def _cache_key(district: str, year: int) -> str:
    return f"{district.lower()}_{year}"


# ─────────────────────────────────────────────────────────────────────────────
# DISTRICTS
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/districts")
def get_districts():
    """Return list of all supported districts with metadata."""
    return [
        {"name": name, "state": info["state"], "center": info["center"]}
        for name, info in DISTRICTS.items()
    ]


# ─────────────────────────────────────────────────────────────────────────────
# PROCESS — triggers satellite pipeline
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/process/{district}/{year}")
def process_district(district: str, year: int):
    """
    Trigger the Sentinel-2 processing pipeline for a district and year.
    Returns computed NDWI, NDVI, NDBI, area stats, and SDG scores.
    Results are cached in memory per district+year.
    """
    cache_key = _cache_key(district, year)
    if cache_key in _cache:
        logger.info(f"Cache hit for {district} {year}")
        return _cache[cache_key]

    dist_name, dist_info = get_district(district)
    if not dist_info:
        raise HTTPException(status_code=404, detail=f"District '{district}' not supported. Use /api/districts.")

    if year < 2019 or year > 2025:
        raise HTTPException(status_code=400, detail="Year must be between 2019 and 2025.")

    result = run_pipeline(dist_name, dist_info, year)
    _cache[cache_key] = result
    return result


# ─────────────────────────────────────────────────────────────────────────────
# DASHBOARD — aggregated view
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/dashboard/{district}")
def get_dashboard(district: str, year: int = 2024):
    """
    Get full dashboard data for a district: current metrics + historical trend + SDG scores.
    """
    dist_name, dist_info = get_district(district)
    if not dist_info:
        raise HTTPException(status_code=404, detail=f"District '{district}' not found.")

    # Get current year data
    cache_key = _cache_key(dist_name, year)
    if cache_key not in _cache:
        current = run_pipeline(dist_name, dist_info, year)
        _cache[cache_key] = current
    else:
        current = _cache[cache_key]

    # Get historical data (2021–year) for trend charts
    historical = []
    for y in range(2021, year):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache[k] = _generate_simulated_data(dist_name, y)
        historical.append(_cache[k])

    all_years = historical + [current]

    # Generate AI insights
    insights = generate_insights(current, historical)

    # Generate predictions
    predictions = predict_future(all_years) if len(all_years) >= 2 else {}

    return {
        "district": dist_name,
        "year": year,
        "center": dist_info["center"],
        "current": current,
        "historical": historical,
        "insights": insights,
        "predictions": predictions,
    }


# ─────────────────────────────────────────────────────────────────────────────
# WATER / VEGETATION / URBAN / CLIMATE — individual endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/water/{district}")
def get_water(district: str, year: int = 2024):
    """Water body metrics for a district."""
    dist_name, dist_info = get_district(district)
    if not dist_info:
        raise HTTPException(status_code=404, detail="District not found.")

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache[k] = _generate_simulated_data(dist_name, y)
        d = _cache[k]
        data.append({
            "year": y,
            "ndwi_mean": d["ndwi"]["mean"],
            "water_area_sqkm": d["water_area_sqkm"],
            "simulated": d.get("simulated", True)
        })

    return {"district": dist_name, "metric": "water", "data": data}


@router.get("/vegetation/{district}")
def get_vegetation(district: str, year: int = 2024):
    """Vegetation metrics for a district."""
    dist_name, dist_info = get_district(district)
    if not dist_info:
        raise HTTPException(status_code=404, detail="District not found.")

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache[k] = _generate_simulated_data(dist_name, y)
        d = _cache[k]
        data.append({
            "year": y,
            "ndvi_mean": d["ndvi"]["mean"],
            "vegetation_area_sqkm": d["vegetation_area_sqkm"],
            "simulated": d.get("simulated", True)
        })

    return {"district": dist_name, "metric": "vegetation", "data": data}


@router.get("/urban/{district}")
def get_urban(district: str, year: int = 2024):
    """Urban growth metrics for a district."""
    dist_name, dist_info = get_district(district)
    if not dist_info:
        raise HTTPException(status_code=404, detail="District not found.")

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache[k] = _generate_simulated_data(dist_name, y)
        d = _cache[k]
        data.append({
            "year": y,
            "ndbi_mean": d["ndbi"]["mean"],
            "urban_area_sqkm": d["urban_area_sqkm"],
            "simulated": d.get("simulated", True)
        })

    return {"district": dist_name, "metric": "urban", "data": data}


@router.get("/climate/{district}")
def get_climate(district: str, year: int = 2024):
    """Climate/temperature metrics for a district."""
    dist_name, dist_info = get_district(district)
    if not dist_info:
        raise HTTPException(status_code=404, detail="District not found.")

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache[k] = _generate_simulated_data(dist_name, y)
        d = _cache[k]
        data.append({
            "year": y,
            "temperature_celsius": d.get("temperature_celsius", None),
            "simulated": d.get("simulated", True)
        })

    return {"district": dist_name, "metric": "climate", "data": data}


# ─────────────────────────────────────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "OrbitWatch API", "version": "1.0.0"}
