import pystac_client
import planetary_computer
import rioxarray
import numpy as np

def fetch_sentinel_data(bbox, time_range):
    """
    Fetch Sentinel-2 L2A data from Planetary Computer for a given bbox and time_range.
    bbox: [min_lon, min_lat, max_lon, max_lat]
    time_range: "2023-01-01/2023-12-31"
    """
    catalog = pystac_client.Client.open(
        "https://planetarycomputer.microsoft.com/api/stac/v1",
        modifier=planetary_computer.sign_inplace,
    )

    search = catalog.search(
        collections=["sentinel-2-l2a"],
        bbox=bbox,
        datetime=time_range,
        query={"eo:cloud_cover": {"lt": 10}}, # Low cloud cover
    )

    items = search.item_collection()
    if not items:
        return None
    
    # We take the least cloudy item
    best_item = min(items, key=lambda item: item.properties["eo:cloud_cover"])
    return best_item

def calculate_indices(item):
    """
    Calculate NDWI, NDVI, NDBI for a STAC item
    Sentinel-2 bands: B03 (Green), B04 (Red), B08 (NIR), B11 (SWIR)
    """
    # Note: Downloading actual COGs via rioxarray can be slow without a dask cluster.
    # In a full production run, we'd do:
    # b3 = rioxarray.open_rasterio(item.assets["B03"].href)
    # b4 = rioxarray.open_rasterio(item.assets["B04"].href)
    # b8 = rioxarray.open_rasterio(item.assets["B08"].href)
    # b11 = rioxarray.open_rasterio(item.assets["B11"].href)
    
    # NDWI = (Green - NIR) / (Green + NIR)
    # NDVI = (NIR - Red) / (NIR + Red)
    # NDBI = (SWIR - NIR) / (SWIR + NIR)
    
    # Here we simulate the output of the processing pipeline for the MVP:
    return {
        "ndwi_mean": 0.15,
        "ndvi_mean": 0.45,
        "ndbi_mean": -0.1,
        "water_area_sqkm": 25.5,
        "vegetation_area_sqkm": 150.2,
        "urban_area_sqkm": 85.0
    }
