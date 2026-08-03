"""
SDG Index calculations from Sentinel-2 band arrays.
All formulas operate on numpy arrays of float reflectance values (0–1 scale).
"""
import numpy as np


def calculate_ndwi(green: np.ndarray, nir: np.ndarray) -> np.ndarray:
    """
    Normalized Difference Water Index (McFeeters 1996)
    NDWI = (Green - NIR) / (Green + NIR)
    Positive values (> 0) indicate water bodies.
    Sentinel-2 bands: B03 (Green), B08 (NIR)
    """
    denominator = green.astype(float) + nir.astype(float)
    denominator = np.where(denominator == 0, np.nan, denominator)
    return (green.astype(float) - nir.astype(float)) / denominator


def calculate_ndvi(nir: np.ndarray, red: np.ndarray) -> np.ndarray:
    """
    Normalized Difference Vegetation Index
    NDVI = (NIR - Red) / (NIR + Red)
    Values > 0.3 indicate healthy vegetation.
    Sentinel-2 bands: B08 (NIR), B04 (Red)
    """
    denominator = nir.astype(float) + red.astype(float)
    denominator = np.where(denominator == 0, np.nan, denominator)
    return (nir.astype(float) - red.astype(float)) / denominator


def calculate_ndbi(swir: np.ndarray, nir: np.ndarray) -> np.ndarray:
    """
    Normalized Difference Built-Up Index (Zha et al. 2003)
    NDBI = (SWIR - NIR) / (SWIR + NIR)
    Positive values indicate built-up / urban areas.
    Sentinel-2 bands: B11 (SWIR), B08 (NIR)
    """
    denominator = swir.astype(float) + nir.astype(float)
    denominator = np.where(denominator == 0, np.nan, denominator)
    return (swir.astype(float) - nir.astype(float)) / denominator


def compute_area_sqkm(index_array: np.ndarray, threshold: float, pixel_size_m: float = 10.0) -> float:
    """
    Calculate area in sq km where index exceeds threshold.
    Args:
        index_array: 2D numpy array of index values
        threshold: pixels above this value are counted
        pixel_size_m: spatial resolution in meters (10m for Sentinel-2)
    """
    valid = np.sum(index_array > threshold)
    pixel_area_m2 = pixel_size_m * pixel_size_m
    area_sqkm = (valid * pixel_area_m2) / 1_000_000
    return round(float(area_sqkm), 2)


def compute_stats(index_array: np.ndarray) -> dict:
    """Compute basic statistics for an index array."""
    valid = index_array[~np.isnan(index_array)]
    if len(valid) == 0:
        return {"mean": 0.0, "min": 0.0, "max": 0.0, "std": 0.0}
    return {
        "mean": round(float(np.nanmean(valid)), 4),
        "min": round(float(np.nanmin(valid)), 4),
        "max": round(float(np.nanmax(valid)), 4),
        "std": round(float(np.nanstd(valid)), 4),
    }


def calculate_sdg_score(ndwi_mean: float, ndvi_mean: float, ndbi_mean: float, temp_c: float = None) -> dict:
    """
    Calculate SDG sub-scores (0-100) from index values.
    Higher water and vegetation = better. Higher urban/temp = worse.
    """
    # Water score: NDWI typically -1 to +1, clamp to 0-100
    water_score = int(max(0, min(100, (ndwi_mean + 0.5) * 100)))

    # Vegetation score: NDVI typically 0 to 0.8 for dense veg
    veg_score = int(max(0, min(100, ndvi_mean * 130)))

    # Urban score (inverse): lower NDBI = better
    urban_score = int(max(0, min(100, 100 - (ndbi_mean + 0.5) * 80)))

    # Climate score (if temp available)
    if temp_c:
        climate_score = int(max(0, min(100, 100 - max(0, temp_c - 25) * 3)))
    else:
        climate_score = 70  # default neutral

    overall = round((water_score + veg_score + urban_score + climate_score) / 4)

    return {
        "water": water_score,
        "vegetation": veg_score,
        "urban": urban_score,
        "climate": climate_score,
        "overall": overall
    }
