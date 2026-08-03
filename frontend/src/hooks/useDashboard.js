import { useState, useEffect } from 'react';
import apiService from '../services/api';

/**
 * Hook to fetch dashboard data from the FastAPI backend.
 * Falls back gracefully if backend is unavailable.
 */
export const useDashboard = (district, year) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    if (!district || !year) return;
    setLoading(true);
    setError(null);

    apiService.getDashboard(district, year)
      .then(result => {
        setData(result);
        setBackendOnline(true);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend unavailable, using UI mock data:', err.message);
        setBackendOnline(false);
        setError('Backend offline — displaying demo data');
        setLoading(false);
      });
  }, [district, year]);

  return { data, loading, error, backendOnline };
};

/**
 * Hook to trigger Sentinel-2 satellite processing for a district + year.
 */
export const useProcess = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trigger = async (district, year) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.processDistrict(district, year);
      setResult(res);
      return res;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { trigger, result, loading, error };
};
