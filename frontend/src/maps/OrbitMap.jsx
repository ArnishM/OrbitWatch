import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LAYER_COLORS = {
  ndwi: { color: '#00BCD4', label: 'Water Index (NDWI)' },
  ndvi: { color: '#43A047', label: 'Vegetation Index (NDVI)' },
  ndbi: { color: '#FB8C00', label: 'Urban Index (NDBI)' },
};

// Simulated index values per district (seed-based for consistency)
function getIndexValue(districtName, layer) {
  const seed = districtName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = ((seed * 9301 + 49297) % 233280) / 233280;
  if (layer === 'ndwi') return (base * 0.5 - 0.1).toFixed(3);
  if (layer === 'ndvi') return (base * 0.6 + 0.15).toFixed(3);
  return (base * 0.4 - 0.1).toFixed(3);
}

function getLayerIntensity(districtName, layer) {
  const v = parseFloat(getIndexValue(districtName, layer));
  if (layer === 'ndwi') return Math.max(0, Math.min(1, (v + 0.2) * 3));
  if (layer === 'ndvi') return Math.max(0, Math.min(1, v * 1.5));
  return Math.max(0, Math.min(1, (v + 0.15) * 3));
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const OrbitMap = ({ district, activeLayer, onDistrictClick }) => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const geojsonLayer = useRef(null);
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [geoData, setGeoData] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  // Initialize map once
  useEffect(() => {
    if (leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current, {
      center: [22.5, 82.0],  // Center on India
      zoom: 4,
      zoomControl: true,
      attributionControl: true,
    });

    // Dark basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(leafletMap.current);

    // Force correct size after render
    setTimeout(() => leafletMap.current?.invalidateSize(), 150);

    // Watch for container resize (important for mobile layout shifts)
    if (mapRef.current) {
      const observer = new ResizeObserver(() => {
        leafletMap.current?.invalidateSize();
      });
      observer.observe(mapRef.current);
    }

    // Load India district GeoJSON
    fetch('https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson')
      .then(r => r.json())
      .then(data => {
        setGeoData(data);
        setLoadingGeo(false);
      })
      .catch(() => {
        setLoadingGeo(false);
      });
  }, []);

  // Rerender GeoJSON layer when layer type or district changes
  useEffect(() => {
    if (!leafletMap.current || !geoData) return;
    if (geojsonLayer.current) {
      geojsonLayer.current.remove();
    }

    const color = LAYER_COLORS[activeLayer].color;

    geojsonLayer.current = L.geoJSON(geoData, {
      style: (feature) => {
        const name = feature.properties?.NAME_2 || feature.properties?.district || feature.properties?.DISTRICT || '';
        const intensity = getLayerIntensity(name, activeLayer);
        const isSelected = name.toLowerCase() === district.toLowerCase();
        return {
          fillColor: color,
          fillOpacity: isSelected ? 0.7 : 0.12 + intensity * 0.35,
          color: isSelected ? color : 'rgba(255,255,255,0.08)',
          weight: isSelected ? 2 : 0.4,
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties?.NAME_2 || feature.properties?.district || feature.properties?.DISTRICT || 'Unknown';
        const indexVal = getIndexValue(name, activeLayer);

        layer.bindTooltip(
          `<div style="background:#0A2540;border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:8px 12px;font-family:Inter,sans-serif;min-width:140px">
            <div style="font-weight:700;font-size:13px;color:white;margin-bottom:4px">${name}</div>
            <div style="font-size:11px;color:#94a3b8">${LAYER_COLORS[activeLayer].label}</div>
            <div style="font-size:16px;font-weight:800;color:${color};margin-top:2px">${indexVal}</div>
            <div style="font-size:10px;color:#475569;margin-top:4px">Click to explore district</div>
          </div>`,
          { sticky: true, opacity: 1, className: 'orbit-tooltip' }
        );

        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ fillOpacity: 0.6, weight: 1.5, color });
            setHoveredDistrict(name);
          },
          mouseout: (e) => {
            geojsonLayer.current?.resetStyle(e.target);
            setHoveredDistrict(null);
          },
          click: () => {
            if (onDistrictClick && name !== 'Unknown') {
              onDistrictClick(name);
            }
            // Fly to clicked district
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
              leafletMap.current.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 });
            }
          },
        });
      },
    }).addTo(leafletMap.current);

  }, [geoData, activeLayer, district, onDistrictClick]);

  // Fly to selected district
  useEffect(() => {
    if (!leafletMap.current || !geojsonLayer.current) return;
    geojsonLayer.current.eachLayer((layer) => {
      const name = layer.feature?.properties?.NAME_2 || layer.feature?.properties?.district || '';
      if (name.toLowerCase() === district.toLowerCase()) {
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          leafletMap.current.flyToBounds(bounds, { padding: [60, 60], duration: 1.0 });
        }
      }
    });
  }, [district]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 'inherit', display: 'flex', flexDirection: 'column' }}>
      <div ref={mapRef} style={{ flex: 1, width: '100%', height: '100%' }} />

      {/* Loading overlay */}
      {loadingGeo && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,13,26,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, borderRadius: 12 }}>
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🛰</div>
            <div style={{ fontSize: 13 }}>Loading India district boundaries…</div>
          </div>
        </div>
      )}

      {/* Hovered district */}
      {hoveredDistrict && (
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'rgba(7,26,46,0.9)', backdropFilter: 'blur(10px)', border: `1px solid ${LAYER_COLORS[activeLayer].color}40`, borderRadius: 10, padding: '6px 12px', fontSize: 12, color: 'white', fontWeight: 600 }}>
          📍 {hoveredDistrict}
        </div>
      )}

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1000, background: 'rgba(7,26,46,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: 'white' }}>{LAYER_COLORS[activeLayer].label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Low</span>
          <div style={{ width: 60, height: 5, borderRadius: 3, background: `linear-gradient(to right, rgba(3,13,26,0.8), ${LAYER_COLORS[activeLayer].color})` }} />
          <span>High</span>
        </div>
        <div style={{ marginTop: 4, color: 'var(--text-muted)' }}>Click district to explore · Hover for index value</div>
      </div>

      {/* Selected district badge */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, background: 'rgba(7,26,46,0.9)', backdropFilter: 'blur(10px)', border: `1px solid ${LAYER_COLORS[activeLayer].color}40`, borderRadius: 10, padding: '6px 12px', fontSize: 12, color: LAYER_COLORS[activeLayer].color, fontWeight: 600 }}>
        Selected: {district}
      </div>
    </div>
  );
};

export default OrbitMap;
