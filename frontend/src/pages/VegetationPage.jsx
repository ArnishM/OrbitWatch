import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

const vegData = {
  labels: YEARS,
  datasets: [
    {
      label: 'Vegetation Cover (sq km)',
      data: [165, 160, 155, 149, 145, 142],
      backgroundColor: YEARS.map((_, i) => i === 5 ? '#43A047' : 'rgba(67,160,71,0.45)'),
      borderRadius: 8, borderSkipped: false,
    },
    {
      label: 'Forest Density (NDVI)',
      data: [0.62, 0.59, 0.55, 0.51, 0.48, 0.45],
      backgroundColor: YEARS.map((_, i) => i === 5 ? '#81C784' : 'rgba(129,199,132,0.3)'),
      borderRadius: 8, borderSkipped: false,
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
  { label: 'Green Cover', value: '142 km²', delta: '-14%', color: '#43A047' },
  { label: 'NDVI Mean', value: '0.45', delta: '-27%', color: '#43A047' },
  { label: 'Forest Density', value: 'Moderate', delta: '↓ Declining', color: '#FB8C00' },
  { label: 'Bare Land Increase', value: '+23 km²', delta: 'since 2020', color: '#E53935' },
];

const VegetationPage = ({ district = 'Nagpur' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700 }}>🌿 Vegetation Monitoring — {district}</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>NDVI-based vegetation and forest cover analysis from Sentinel-2</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {metrics.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card">
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{m.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{m.delta}</div>
        </motion.div>
      ))}
    </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Vegetation Cover & NDVI by Year</div>
      <div style={{ height: 280 }}><Bar data={vegData} options={chartOpts} /></div>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>🤖 AI Analysis</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { type: 'danger', text: '🌱 Vegetation has declined 14% since 2020. NDVI drop of 0.17 points indicates significant deforestation in south and east sectors.' },
          { type: 'success', text: '✅ Northern reserve forests remain stable with NDVI > 0.6. Afforestation programs showing early results.' },
          { type: 'info', text: '💡 Recommend: Mandate green buffer zones in new township planning. Target 20% canopy cover in all new residential layouts.' },
        ].map((ins, i) => {
          const bg = ins.type === 'danger' ? 'rgba(229,57,53,0.08)' : ins.type === 'success' ? 'rgba(67,160,71,0.08)' : 'rgba(33,150,243,0.08)';
          const border = ins.type === 'danger' ? 'rgba(229,57,53,0.25)' : ins.type === 'success' ? 'rgba(67,160,71,0.25)' : 'rgba(33,150,243,0.25)';
          const accent = ins.type === 'danger' ? '#E53935' : ins.type === 'success' ? '#43A047' : '#2196F3';
          return <div key={i} style={{ padding: '10px 14px', background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${accent}`, borderRadius: 10, fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6 }}>{ins.text}</div>;
        })}
      </div>
    </motion.div>
  </div>
);

export default VegetationPage;
