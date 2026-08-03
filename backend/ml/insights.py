"""
AI Insight generation using processed satellite metrics.
Compares current values against baselines to produce human-readable insights.
"""

THRESHOLDS = {
    "water_loss_pct": {"moderate": -10, "critical": -20},
    "veg_loss_pct": {"moderate": -8, "critical": -15},
    "urban_growth_pct": {"moderate": 10, "critical": 20},
    "temp_above_avg": {"moderate": 2, "critical": 4},
}


def generate_insights(current: dict, historical: list) -> list:
    """
    Generate AI text insights by comparing current metrics to historical baselines.
    Returns a list of insight dicts with type and text.
    """
    insights = []

    if not historical:
        return _default_insights(current)

    # Sort historical by year
    historical_sorted = sorted(historical, key=lambda x: x.get("year", 0))
    baseline = historical_sorted[0]  # Oldest available data point

    district = current.get("district", "This district")

    # Water analysis
    if baseline.get("water_area_sqkm") and current.get("water_area_sqkm"):
        water_base = baseline["water_area_sqkm"]
        water_curr = current["water_area_sqkm"]
        water_pct = ((water_curr - water_base) / water_base) * 100 if water_base else 0
        water_loss = water_base - water_curr

        if water_pct < THRESHOLDS["water_loss_pct"]["critical"]:
            insights.append({"type": "danger", "category": "water", "text": f"🚨 Critical: Water bodies in {district} have declined by {abs(water_pct):.1f}% (lost {water_loss:.1f} km²) since {baseline['year']}. Immediate conservation action required."})
        elif water_pct < THRESHOLDS["water_loss_pct"]["moderate"]:
            insights.append({"type": "warning", "category": "water", "text": f"⚠ Water surface area has decreased by {abs(water_pct):.1f}% in {district}. Seasonal variation or encroachment may be the cause."})
        else:
            insights.append({"type": "success", "category": "water", "text": f"✅ Water bodies in {district} remain stable at {water_curr:.1f} km²."})

    # Vegetation analysis
    if baseline.get("vegetation_area_sqkm") and current.get("vegetation_area_sqkm"):
        veg_base = baseline["vegetation_area_sqkm"]
        veg_curr = current["vegetation_area_sqkm"]
        veg_pct = ((veg_curr - veg_base) / veg_base) * 100 if veg_base else 0

        if veg_pct < THRESHOLDS["veg_loss_pct"]["critical"]:
            insights.append({"type": "danger", "category": "vegetation", "text": f"🌱 Vegetation has declined by {abs(veg_pct):.1f}% in {district}. NDVI analysis indicates significant deforestation or agricultural land loss."})
        elif veg_pct < THRESHOLDS["veg_loss_pct"]["moderate"]:
            insights.append({"type": "warning", "category": "vegetation", "text": f"🌿 Moderate vegetation decline of {abs(veg_pct):.1f}% detected. Monitor seasonal patterns and illegal encroachments."})
        else:
            insights.append({"type": "success", "category": "vegetation", "text": f"✅ Green cover is stable or improving in {district} at {veg_curr:.1f} km²."})

    # Urban growth analysis
    if baseline.get("urban_area_sqkm") and current.get("urban_area_sqkm"):
        urban_base = baseline["urban_area_sqkm"]
        urban_curr = current["urban_area_sqkm"]
        urban_pct = ((urban_curr - urban_base) / urban_base) * 100 if urban_base else 0

        if urban_pct > THRESHOLDS["urban_growth_pct"]["critical"]:
            insights.append({"type": "danger", "category": "urban", "text": f"🏙 Urban area expanded {urban_pct:.1f}% (+{urban_curr - urban_base:.1f} km²) in {district}. This rate of growth risks breaching master plan boundaries by 2027."})
        elif urban_pct > THRESHOLDS["urban_growth_pct"]["moderate"]:
            insights.append({"type": "warning", "category": "urban", "text": f"⚠ Significant urban expansion of {urban_pct:.1f}% detected. Environmental impact assessments recommended for growth corridors."})

    # Recommendation
    water_pct_val = ((current.get("water_area_sqkm", 0) - baseline.get("water_area_sqkm", 1)) / max(baseline.get("water_area_sqkm", 1), 1)) * 100
    if water_pct_val < -10:
        insights.append({"type": "info", "category": "recommendation", "text": f"💡 Recommendation: {district} should prioritize rainwater harvesting in new urban layouts, enforce wetland protection orders, and commission detailed NDWI monitoring every 6 months."})
    else:
        insights.append({"type": "info", "category": "recommendation", "text": f"💡 Recommendation: Maintain current conservation programs and expand tree planting in rapidly urbanizing zones of {district}."})

    return insights if insights else _default_insights(current)


def _default_insights(current: dict) -> list:
    district = current.get("district", "This district")
    return [
        {"type": "info", "category": "general", "text": f"📡 Satellite data processed for {district}. Historical baseline data not yet available — more years needed for trend analysis."},
        {"type": "info", "category": "recommendation", "text": "💡 Run the pipeline for multiple years (2021–2024) to enable comparative analysis and trend detection."},
    ]
