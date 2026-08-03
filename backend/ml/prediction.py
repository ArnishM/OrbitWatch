"""
Simple regression-based prediction model for 5-year environmental forecasting.
Uses scikit-learn LinearRegression trained on historical district data.
"""
import numpy as np
from typing import List, Dict


def predict_future(historical: List[Dict], predict_years: int = 5) -> Dict:
    """
    Train a simple linear regression model on historical data
    and predict future values for each indicator.
    
    Args:
        historical: List of year-indexed metric dicts
        predict_years: How many years into the future to predict
    
    Returns:
        Dict with predictions for each indicator
    """
    if not historical or len(historical) < 2:
        return {"error": "Need at least 2 years of data to predict"}

    try:
        from sklearn.linear_model import LinearRegression

        historical_sorted = sorted(historical, key=lambda x: x.get("year", 0))
        years = np.array([h["year"] for h in historical_sorted]).reshape(-1, 1)

        last_year = int(years[-1][0])
        future_years = list(range(last_year + 1, last_year + predict_years + 1))
        future_years_arr = np.array(future_years).reshape(-1, 1)

        predictions = {"years": future_years, "indicators": {}}

        indicators = {
            "water_area_sqkm": "Water Area (km²)",
            "vegetation_area_sqkm": "Vegetation Area (km²)",
            "urban_area_sqkm": "Urban Area (km²)",
        }

        for key, label in indicators.items():
            values = np.array([h.get(key, 0) for h in historical_sorted])
            if np.all(values == 0):
                continue

            model = LinearRegression()
            model.fit(years, values)

            future_values = model.predict(future_years_arr)
            # Clamp values to reasonable range (never negative)
            future_values = np.maximum(future_values, 0)

            current_val = float(values[-1])
            predicted_final = float(future_values[-1])
            change_pct = ((predicted_final - current_val) / max(current_val, 1)) * 100

            predictions["indicators"][key] = {
                "label": label,
                "current": round(current_val, 1),
                "values": [round(v, 1) for v in future_values],
                "final_prediction": round(predicted_final, 1),
                "change_pct": round(change_pct, 1),
                "trend": "increasing" if change_pct > 0 else "decreasing"
            }

        return predictions

    except Exception as e:
        return {"error": str(e)}
