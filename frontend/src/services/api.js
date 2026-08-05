import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 60000, // 60s — satellite processing can take time
});

// Global error interceptor — gives friendly messages instead of silent crashes.
// Important: Render's free tier sleeps after 15min inactivity; first request may
// time out while the server is waking up (takes ~30–60 seconds).
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new Error('The server is waking up — this can take up to 60 seconds on first load. Please try again shortly.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Cannot reach the server. Please check your connection.'));
    }
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    if (status === 400) return Promise.reject(new Error(detail || 'Invalid request.'));
    if (status === 404) return Promise.reject(new Error(detail || 'Data not found for this district.'));
    if (status === 422) return Promise.reject(new Error('Invalid input — please check the district or year.'));
    if (status >= 500) return Promise.reject(new Error('Server error. Please try again in a moment.'));
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get all districts
  getDistricts: () => API.get('/districts').then(r => r.data),

  // Get full dashboard data for a district + year
  getDashboard: (district, year) =>
    API.get(`/dashboard/${encodeURIComponent(district)}`, { params: { year } }).then(r => r.data),

  // Trigger real Sentinel-2 processing pipeline
  processDistrict: (district, year) =>
    API.get(`/process/${encodeURIComponent(district)}/${year}`).then(r => r.data),

  // Individual metric endpoints
  getWater: (district, year) =>
    API.get(`/water/${encodeURIComponent(district)}`, { params: { year } }).then(r => r.data),

  getVegetation: (district, year) =>
    API.get(`/vegetation/${encodeURIComponent(district)}`, { params: { year } }).then(r => r.data),

  getUrban: (district, year) =>
    API.get(`/urban/${encodeURIComponent(district)}`, { params: { year } }).then(r => r.data),

  getClimate: (district, year) =>
    API.get(`/climate/${encodeURIComponent(district)}`, { params: { year } }).then(r => r.data),

  // Health check
  healthCheck: () => API.get('/health').then(r => r.data),

  // Real threshold-based alerts from satellite data
  getAlerts: (district, year) =>
    API.get(`/alerts/${encodeURIComponent(district)}`, { params: { year } }).then(r => r.data),
};

export default apiService;
