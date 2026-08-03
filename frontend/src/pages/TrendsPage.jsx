import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } }, tooltip: { backgroundColor: '#0A2540', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } } }
  }
};

const allData = {
  labels: YEARS,
  datasets: [
    { label: 'Water (km²)', data: [38, 35.2, 33.8, 30.5, 28.4, 26.1, 24.5], borderColor: '#00BCD4', backgroundColor: 'rgba(0,188,212,0.05)', fill: true, tension: 0.4, pointRadius: 4 },
    { label: 'Vegetation (km²)', data: [170, 165, 160, 155, 149, 145, 142], borderColor: '#43A047', backgroundColor: 'rgba(67,160,71,0.05)', fill: true, tension: 0.4, pointRadius: 4 },
    { label: 'Urban (km²)', data: [68, 73, 77, 81, 85, 89.4, 93], borderColor: '#FB8C00', backgroundColor: 'rgba(251,140,0,0.05)', fill: true, tension: 0.4, pointRadius: 4 },
  ]
};

const TrendsPage = ({ district = 'Nagpur' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700 }}>📈 Historical Trends — {district}</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Multi-year SDG indicator trends (2019–2025) derived from Sentinel-2</p>
    </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>All Indicators Over Time (2019–2025)</div>
      <div style={{ height: 320 }}><Line data={allData} options={chartOpts} /></div>
    </motion.div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {[
        { title: 'Biggest Loser', label: 'Water Bodies', val: '-35.5%', sub: '38 → 24.5 km² over 6 years', color: '#00BCD4', icon: '💧' },
        { title: 'Fastest Grower', label: 'Urban Area', val: '+36.8%', sub: '68 → 93 km² over 6 years', color: '#FB8C00', icon: '🏙' },
        { title: 'Stable Zone', label: 'Northern Reserves', val: 'NDVI > 0.6', sub: 'Protected areas holding steady', color: '#43A047', icon: '🌿' },
      ].map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{s.title}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Space Grotesk', color: s.color, margin: '6px 0' }}>{s.val}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{s.sub}</div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default TrendsPage;
