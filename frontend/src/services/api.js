import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 60000, // 60s — satellite processing can take time
});

export const apiService = {
  // Get all districts
  getDistricts: () => API.get('/districts').then(r => r.data),

  // Get full dashboard data for a district + year
  getDashboard: (district, year) =>
    API.get(`/dashboard/${district}`, { params: { year } }).then(r => r.data),

  // Trigger real Sentinel-2 processing pipeline
  processDistrict: (district, year) =>
    API.get(`/process/${district}/${year}`).then(r => r.data),

  // Individual metric endpoints
  getWater: (district, year) =>
    API.get(`/water/${district}`, { params: { year } }).then(r => r.data),

  getVegetation: (district, year) =>
    API.get(`/vegetation/${district}`, { params: { year } }).then(r => r.data),

  getUrban: (district, year) =>
    API.get(`/urban/${district}`, { params: { year } }).then(r => r.data),

  getClimate: (district, year) =>
    API.get(`/climate/${district}`, { params: { year } }).then(r => r.data),

  // Health check
  healthCheck: () => API.get('/health').then(r => r.data),

  // Real threshold-based alerts from satellite data
  getAlerts: (district, year) =>
    API.get(`/alerts/${district}`, { params: { year } }).then(r => r.data),
};

export default apiService;
