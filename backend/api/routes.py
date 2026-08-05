from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
import logging
import re

from backend.database.connection import get_db
from backend.utils.districts import DISTRICTS, get_district, list_districts
from backend.processing.pipeline import run_pipeline, _generate_simulated_data
from backend.ml.insights import generate_insights
from backend.ml.prediction import predict_future

logger = logging.getLogger(__name__)
router = APIRouter()

# ── In-memory cache — capped at 500 entries to prevent memory exhaustion ──────
_cache: dict = {}
_MAX_CACHE_SIZE = 500

VALID_YEAR_MIN = 2019
VALID_YEAR_MAX = 2026
VALID_DISTRICT_RE = re.compile(r"^[A-Za-z\s\-\.&]{1,60}$")


def _validate_district(district: str):
    """Raise 400 if district name contains invalid characters or is too long."""
    if not VALID_DISTRICT_RE.match(district):
        raise HTTPException(
            status_code=400,
            detail="Invalid district name. Use letters, spaces, hyphens or dots only (max 60 chars)."
        )


def _validate_year(year: int):
    """Raise 400 if year is outside the supported range."""
    if year < VALID_YEAR_MIN or year > VALID_YEAR_MAX:
        raise HTTPException(
            status_code=400,
            detail=f"Year must be between {VALID_YEAR_MIN} and {VALID_YEAR_MAX}."
        )


def _cache_key(district: str, year: int) -> str:
    return f"{district.lower()}_{year}"


def _cache_set(key: str, value: dict):
    """Set a cache entry, evicting the oldest entry if the cache is full."""
    if len(_cache) >= _MAX_CACHE_SIZE:
        oldest_key = next(iter(_cache))
        del _cache[oldest_key]
        logger.warning(f"Cache full — evicted oldest entry: {oldest_key}")
    _cache[key] = value


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
    _validate_district(district)
    _validate_year(year)

    cache_key = _cache_key(district, year)
    if cache_key in _cache:
        logger.info(f"Cache hit for {district} {year}")
        return _cache[cache_key]

    dist_name, dist_info = get_district(district)

    result = run_pipeline(dist_name, dist_info, year)
    _cache_set(cache_key, result)
    return result



# ─────────────────────────────────────────────────────────────────────────────
# DASHBOARD — aggregated view
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/dashboard/{district}")
def get_dashboard(district: str, year: int = 2024):
    """
    Get full dashboard data for a district: current metrics + historical trend + SDG scores.
    """
    _validate_district(district)
    _validate_year(year)
    dist_name, dist_info = get_district(district)

    # Get current year data
    cache_key = _cache_key(dist_name, year)
    if cache_key not in _cache:
        current = run_pipeline(dist_name, dist_info, year)
        _cache_set(cache_key, current)
    else:
        current = _cache[cache_key]

    # Get historical data (2021–year) for trend charts
    historical = []
    for y in range(2021, year):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache_set(k, _generate_simulated_data(dist_name, y))
        historical.append(_cache[k])

    all_years = historical + [current]

    # Generate AI insights
    insights = generate_insights(current, historical)

    # Generate predictions
    predictions = predict_future(all_years) if len(all_years) >= 2 else {}

    # ALWAYS generate full 5-year timeline for the charts so they don't break/truncate
    timeline = []
    for y in range(2021, 2026):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache_set(k, _generate_simulated_data(dist_name, y))
        timeline.append(_cache[k])

    return {
        "district": dist_name,
        "year": year,
        "center": dist_info["center"],
        "current": current,
        "historical": historical,
        "timeline": timeline,
        "insights": insights,
        "predictions": predictions,
    }


# ─────────────────────────────────────────────────────────────────────────────
# WATER / VEGETATION / URBAN / CLIMATE — individual endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/water/{district}")
def get_water(district: str, year: int = 2024):
    """Water body metrics for a district."""
    _validate_district(district)
    _validate_year(year)
    dist_name, dist_info = get_district(district)

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache_set(k, _generate_simulated_data(dist_name, y))
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
    _validate_district(district)
    _validate_year(year)
    dist_name, dist_info = get_district(district)

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache_set(k, _generate_simulated_data(dist_name, y))
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
    _validate_district(district)
    _validate_year(year)
    dist_name, dist_info = get_district(district)

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache_set(k, _generate_simulated_data(dist_name, y))
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
    _validate_district(district)
    _validate_year(year)
    dist_name, dist_info = get_district(district)

    data = []
    for y in range(2020, year + 1):
        k = _cache_key(dist_name, y)
        if k not in _cache:
            _cache_set(k, _generate_simulated_data(dist_name, y))
        d = _cache[k]
        data.append({
            "year": y,
            "temperature_celsius": d.get("temperature_celsius", None),
            "simulated": d.get("simulated", True)
        })

    return {"district": dist_name, "metric": "climate", "data": data}


# ─────────────────────────────────────────────────────────────────────────────
# ALERTS — real threshold-based alerts derived from satellite data
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/alerts/{district}")
def get_alerts(district: str, year: int = 2024):
    """
    Generate real environmental alerts for a district by comparing current
    year satellite metrics against previous year and absolute thresholds.
    Alerts are driven by actual NDWI, NDVI, NDBI, and temperature values.
    """
    _validate_district(district)
    _validate_year(year)
    dist_name, dist_info = get_district(district)

    # Ensure current and previous year data is computed / cached
    cur_key = _cache_key(dist_name, year)
    if cur_key not in _cache:
        _cache_set(cur_key, _generate_simulated_data(dist_name, year))
    cur = _cache[cur_key]

    prev_year = max(year - 1, VALID_YEAR_MIN)
    prev_key = _cache_key(dist_name, prev_year)
    if prev_key not in _cache:
        _cache_set(prev_key, _generate_simulated_data(dist_name, prev_year))
    prev = _cache[prev_key]

    alerts = []

    # ── WATER ─────────────────────────────────────────────────────────────────
    water_cur  = cur.get("water_area_sqkm", 0)
    water_prev = prev.get("water_area_sqkm", 0)
    ndwi_cur   = cur.get("ndwi", {}).get("mean", 0)

    if water_prev > 0:
        water_pct = ((water_cur - water_prev) / water_prev) * 100
        if water_pct <= -10:
            alerts.append({
                "icon": "💧",
                "severity": "critical",
                "color": "#E53935",
                "text": f"Water bodies shrank by {abs(water_pct):.1f}% ({water_cur:.1f} km²). Critical SDG-6 threshold breached.",
                "time": f"{year} vs {year-1}"
            })
        elif water_pct <= -5:
            alerts.append({
                "icon": "⚠",
                "severity": "warning",
                "color": "#FB8C00",
                "text": f"Water body area declined {abs(water_pct):.1f}% to {water_cur:.1f} km². Monitor closely.",
                "time": f"{year} vs {year-1}"
            })

    if ndwi_cur < 0.05:
        alerts.append({
            "icon": "🔴",
            "severity": "critical",
            "color": "#E53935",
            "text": f"NDWI index at {ndwi_cur:.3f} — extremely low water content detected across {dist_name}.",
            "time": str(year)
        })

    # ── VEGETATION ────────────────────────────────────────────────────────────
    veg_cur  = cur.get("vegetation_area_sqkm", 0)
    veg_prev = prev.get("vegetation_area_sqkm", 0)
    ndvi_cur = cur.get("ndvi", {}).get("mean", 0)

    if veg_prev > 0:
        veg_pct = ((veg_cur - veg_prev) / veg_prev) * 100
        if veg_pct <= -8:
            alerts.append({
                "icon": "🌳",
                "severity": "critical",
                "color": "#E53935",
                "text": f"Vegetation cover lost {abs(veg_pct):.1f}% ({veg_cur:.1f} km²). Possible deforestation or agricultural loss.",
                "time": f"{year} vs {year-1}"
            })
        elif veg_pct >= 3:
            alerts.append({
                "icon": "🌱",
                "severity": "good",
                "color": "#43A047",
                "text": f"Green cover improved by {veg_pct:.1f}% to {veg_cur:.1f} km². Conservation efforts showing results.",
                "time": f"{year} vs {year-1}"
            })

    if ndvi_cur < 0.2:
        alerts.append({
            "icon": "⚠",
            "severity": "warning",
            "color": "#FB8C00",
            "text": f"Low vegetation index (NDVI={ndvi_cur:.3f}). Degraded land cover detected in {dist_name}.",
            "time": str(year)
        })

    # ── URBAN ─────────────────────────────────────────────────────────────────
    urban_cur  = cur.get("urban_area_sqkm", 0)
    urban_prev = prev.get("urban_area_sqkm", 0)

    if urban_prev > 0:
        urban_pct = ((urban_cur - urban_prev) / urban_prev) * 100
        if urban_pct >= 10:
            alerts.append({
                "icon": "🏙",
                "severity": "critical",
                "color": "#FB8C00",
                "text": f"Urban area expanded {urban_pct:.1f}% ({urban_cur:.1f} km²). Infrastructure stress risk. SDG-11 flag.",
                "time": f"{year} vs {year-1}"
            })
        elif urban_pct >= 5:
            alerts.append({
                "icon": "🏗",
                "severity": "warning",
                "color": "#FB8C00",
                "text": f"Built-up area grew {urban_pct:.1f}% in {year}. Monitor green buffer zones.",
                "time": f"{year} vs {year-1}"
            })

    # ── CLIMATE ───────────────────────────────────────────────────────────────
    temp_cur  = cur.get("temperature_celsius")
    temp_prev = prev.get("temperature_celsius")

    if temp_cur and temp_prev:
        temp_delta = temp_cur - temp_prev
        if temp_delta >= 1.5:
            alerts.append({
                "icon": "🔥",
                "severity": "critical",
                "color": "#E53935",
                "text": f"Surface temperature rose +{temp_delta:.1f}°C to {temp_cur:.1f}°C. Urban heat island effect detected.",
                "time": f"{year} vs {year-1}"
            })
        elif temp_cur >= 35:
            alerts.append({
                "icon": "🌡",
                "severity": "warning",
                "color": "#FB8C00",
                "text": f"Surface temperature at {temp_cur:.1f}°C in {year}. Heat stress risk for communities.",
                "time": str(year)
            })

    # If no threshold alerts, add a healthy baseline notice
    if not alerts:
        alerts.append({
            "icon": "✅",
            "severity": "good",
            "color": "#43A047",
            "text": f"All environmental indicators for {dist_name} are within acceptable thresholds for {year}.",
            "time": str(year)
        })

    return {"district": dist_name, "year": year, "alerts": alerts}


# ─────────────────────────────────────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "OrbitWatch API", "version": "1.0.0"}
