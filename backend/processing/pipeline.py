"""
Sentinel-2 data fetching and processing pipeline using Microsoft Planetary Computer.
Downloads real satellite imagery, masks clouds, clips to district, computes indices.
"""
import numpy as np
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


def fetch_sentinel_item(bbox: list, year: int):
    """
    Fetch the least-cloudy Sentinel-2 L2A item from Planetary Computer
    for a given bounding box and year.
    """
    try:
        import pystac_client
        import planetary_computer

        catalog = pystac_client.Client.open(
            "https://planetarycomputer.microsoft.com/api/stac/v1",
            modifier=planetary_computer.sign_inplace,
        )

        # Search for imagery in the dry season (Oct-March) for cleaner images in India
        time_range = f"{year}-10-01/{year + 1}-03-31"

        search = catalog.search(
            collections=["sentinel-2-l2a"],
            bbox=bbox,
            datetime=time_range,
            query={"eo:cloud_cover": {"lt": 15}},
        )

        items = list(search.item_collection())
        if not items:
            # Broaden search if no results
            time_range = f"{year}-01-01/{year}-12-31"
            search = catalog.search(
                collections=["sentinel-2-l2a"],
                bbox=bbox,
                datetime=time_range,
                query={"eo:cloud_cover": {"lt": 30}},
            )
            items = list(search.item_collection())

        if not items:
            logger.warning(f"No Sentinel-2 items found for bbox={bbox}, year={year}")
            return None

        best_item = min(items, key=lambda item: item.properties.get("eo:cloud_cover", 100))
        logger.info(f"Selected item: {best_item.id} | Cloud cover: {best_item.properties.get('eo:cloud_cover', 'N/A')}%")
        return best_item

    except Exception as e:
        logger.error(f"Error fetching Sentinel-2 item: {e}")
        return None


def read_band(item, band_name: str, bbox: list):
    """
    Read a specific band from a Sentinel-2 STAC item using rioxarray.
    Uses windowed reading for performance - only downloads the bbox area.
    """
    try:
        import rioxarray
        import rasterio
        from rasterio.crs import CRS

        href = item.assets[band_name].href
        da = rioxarray.open_rasterio(href, overview_level=2)  # overview_level=2 for faster read

        # Reproject and clip to bbox
        da = da.rio.write_crs("EPSG:4326")
        da = da.rio.clip_box(minx=bbox[0], miny=bbox[1], maxx=bbox[2], maxy=bbox[3], crs="EPSG:4326")

        return da.values[0].astype(float)

    except Exception as e:
        logger.error(f"Error reading band {band_name}: {e}")
        return None


def run_pipeline(district_name: str, district_info: dict, year: int) -> dict:
    """
    Main pipeline: fetch Sentinel-2 data for a district + year,
    compute NDWI, NDVI, NDBI indices, and return processed metrics.
    
    Returns a dict of results or fallback mock data if satellite fetch fails.
    """
    from backend.processing.indices import (
        calculate_ndwi, calculate_ndvi, calculate_ndbi,
        compute_area_sqkm, compute_stats, calculate_sdg_score
    )

    bbox = district_info["bbox"]
    logger.info(f"Starting pipeline for {district_name} ({year})...")

    item = fetch_sentinel_item(bbox, year)

    if item is None:
        logger.warning(f"Falling back to simulated data for {district_name} {year}")
        return _generate_simulated_data(district_name, year)

    try:
        logger.info("Reading Sentinel-2 bands...")
        # Read required bands
        green = read_band(item, "B03", bbox)  # Green - for NDWI
        red = read_band(item, "B04", bbox)    # Red - for NDVI
        nir = read_band(item, "B08", bbox)    # NIR - for NDWI + NDVI + NDBI
        swir = read_band(item, "B11", bbox)   # SWIR - for NDBI

        if any(b is None for b in [green, red, nir, swir]):
            logger.warning("One or more bands failed to load, using simulated data")
            return _generate_simulated_data(district_name, year)

        # Scale reflectance values (Sentinel-2 L2A stores as integers, divide by 10000)
        green = green / 10000.0
        red   = red   / 10000.0
        nir   = nir   / 10000.0
        swir  = swir  / 10000.0

        # Calculate indices
        ndwi_arr = calculate_ndwi(green, nir)
        ndvi_arr = calculate_ndvi(nir, red)
        ndbi_arr = calculate_ndbi(swir, nir)

        # Aggregate statistics
        ndwi_stats = compute_stats(ndwi_arr)
        ndvi_stats = compute_stats(ndvi_arr)
        ndbi_stats = compute_stats(ndbi_arr)

        # Calculate areas
        water_area = compute_area_sqkm(ndwi_arr, threshold=0.0)
        veg_area   = compute_area_sqkm(ndvi_arr, threshold=0.2)
        urban_area = compute_area_sqkm(ndbi_arr, threshold=0.0)

        # SDG scores
        sdg = calculate_sdg_score(ndwi_stats["mean"], ndvi_stats["mean"], ndbi_stats["mean"])

        result = {
            "district": district_name,
            "year": year,
            "source": "sentinel-2-l2a",
            "scene_id": item.id,
            "cloud_cover": item.properties.get("eo:cloud_cover", 0),
            "acquisition_date": item.properties.get("datetime", ""),

            "ndwi": ndwi_stats,
            "ndvi": ndvi_stats,
            "ndbi": ndbi_stats,

            "water_area_sqkm": water_area,
            "vegetation_area_sqkm": veg_area,
            "urban_area_sqkm": urban_area,

            "sdg_scores": sdg,
            "simulated": False
        }
        logger.info(f"Pipeline complete for {district_name} {year}: water={water_area} km², veg={veg_area} km², urban={urban_area} km²")
        return result

    except Exception as e:
        logger.error(f"Pipeline error for {district_name} {year}: {e}")
        return _generate_simulated_data(district_name, year)


def _generate_simulated_data(district_name: str, year: int) -> dict:
    """
    Generate realistic simulated satellite metrics when real data is unavailable.
    Values are seeded by district name for consistency across requests.
    Trends reflect real-world environmental patterns (water loss, urban growth).
    """
    from backend.processing.indices import calculate_sdg_score

    # Seed random with district name for consistent values
    seed = sum(ord(c) for c in district_name) + year
    rng = np.random.default_rng(seed)

    # Base values with year-based trends
    base_year = 2020
    years_elapsed = year - base_year

    # Water: declining trend
    ndwi_mean = round(rng.uniform(0.1, 0.3) - years_elapsed * 0.02, 3)
    water_area = round(rng.uniform(20, 45) - years_elapsed * 2.0, 1)

    # Vegetation: declining trend
    ndvi_mean = round(rng.uniform(0.35, 0.60) - years_elapsed * 0.02, 3)
    veg_area = round(rng.uniform(120, 200) - years_elapsed * 4.0, 1)

    # Urban: growing trend
    ndbi_mean = round(rng.uniform(-0.15, 0.1) + years_elapsed * 0.02, 3)
    urban_area = round(rng.uniform(60, 100) + years_elapsed * 4.0, 1)

    # Temperature
    temp_c = round(rng.uniform(30, 35) + years_elapsed * 0.4, 1)

    sdg = calculate_sdg_score(ndwi_mean, ndvi_mean, ndbi_mean, temp_c)

    return {
        "district": district_name,
        "year": year,
        "source": "simulated",
        "scene_id": f"SIM_{district_name}_{year}",
        "cloud_cover": 0,
        "acquisition_date": f"{year}-11-15T00:00:00Z",

        "ndwi": {"mean": ndwi_mean, "min": ndwi_mean - 0.3, "max": ndwi_mean + 0.3, "std": 0.15},
        "ndvi": {"mean": ndvi_mean, "min": ndvi_mean - 0.2, "max": ndvi_mean + 0.2, "std": 0.12},
        "ndbi": {"mean": ndbi_mean, "min": ndbi_mean - 0.2, "max": ndbi_mean + 0.2, "std": 0.1},

        "water_area_sqkm": max(1, water_area),
        "vegetation_area_sqkm": max(10, veg_area),
        "urban_area_sqkm": max(5, urban_area),
        "temperature_celsius": temp_c,

        "sdg_scores": sdg,
        "simulated": True
    }
