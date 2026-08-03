import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

const waterData = {
  labels: YEARS,
  datasets: [
    {
      label: 'Water Surface Area (sq km)',
      data: [35.2, 33.8, 30.5, 28.4, 26.1, 24.5],
      borderColor: '#00BCD4', backgroundColor: 'rgba(0,188,212,0.1)',
      fill: true, tension: 0.4, pointBackgroundColor: '#00BCD4', pointRadius: 5,
    },
    {
      label: 'NDWI Index',
      data: [0.42, 0.39, 0.35, 0.31, 0.27, 0.23],
      borderColor: '#2196F3', backgroundColor: 'rgba(33,150,243,0.05)',
      fill: true, tension: 0.4, pointBackgroundColor: '#2196F3', pointRadius: 5,
    }
  ]
};

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } }, tooltip: { backgroundColor: '#0A2540', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } }
  }
};

const metrics = [
  { label: 'Total Water Area', value: '24.5 km²', delta: '-14%', status: 'Critical', color: '#E53935' },
  { label: 'NDWI Mean', value: '0.23', delta: '-45%', status: 'Critical', color: '#E53935' },
  { label: 'Water Loss (2020–2025)', value: '10.7 km²', delta: '–', status: 'Critical', color: '#E53935' },
  { label: 'Wetland Coverage', value: '8.2 km²', delta: '-18%', status: 'Moderate', color: '#FB8C00' },
];

const WaterPage = ({ district = 'Nagpur', year = '2024' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700 }}>💧 Water Body Analysis — {district}</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>NDWI-based water surface tracking from Sentinel-2 imagery</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {metrics.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card">
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{m.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#00BCD4' }}>{m.value}</div>
          <div style={{ fontSize: 12, color: m.color, marginTop: 4 }}>{m.delta} since 2020</div>
          <div style={{ marginTop: 8, fontSize: 11, padding: '2px 8px', borderRadius: 10, display: 'inline-block', background: `${m.color}18`, color: m.color }}>{m.status}</div>
        </motion.div>
      ))}
    </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Water Surface Area & NDWI Trend (2020–2025)</div>
      <div style={{ height: 280 }}><Line data={waterData} options={chartOpts} /></div>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>🤖 AI Analysis</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { type: 'danger', text: '🚨 Water bodies have declined by 30.4% over 5 years. At current rate, the district will lose another 8 km² by 2030.' },
          { type: 'warning', text: '⚠ The eastern floodplain shows the fastest water loss — primarily converted to residential zones.' },
          { type: 'info', text: '💡 Recommend immediate enforcement of wetland conservation zones and rainwater harvesting mandates in new construction.' },
        ].map((ins, i) => {
          const bg = ins.type === 'danger' ? 'rgba(229,57,53,0.08)' : ins.type === 'warning' ? 'rgba(251,140,0,0.08)' : 'rgba(33,150,243,0.08)';
          const border = ins.type === 'danger' ? 'rgba(229,57,53,0.25)' : ins.type === 'warning' ? 'rgba(251,140,0,0.25)' : 'rgba(33,150,243,0.25)';
          const accent = ins.type === 'danger' ? '#E53935' : ins.type === 'warning' ? '#FB8C00' : '#2196F3';
          return <div key={i} style={{ padding: '10px 14px', background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${accent}`, borderRadius: 10, fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6 }}>{ins.text}</div>;
        })}
      </div>
    </motion.div>
  </div>
);

export default WaterPage;
