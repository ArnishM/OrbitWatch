import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

const urbanData = {
  labels: YEARS,
  datasets: [{
    label: 'Built-up Area (sq km)',
    data: [73, 77, 81, 85, 89.4, 93],
    borderColor: '#FB8C00', backgroundColor: 'rgba(251,140,0,0.1)',
    fill: true, tension: 0.4, pointBackgroundColor: '#FB8C00', pointRadius: 5,
  }]
};

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0A2540', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } }
  }
};

const metrics = [
  { label: 'Built-up Area', value: '89.4 km²', delta: '+22%', color: '#FB8C00' },
  { label: 'NDBI Mean', value: '0.31', delta: '+40%', color: '#FB8C00' },
  { label: 'Annual Growth Rate', value: '4.0 km²/yr', delta: 'Accelerating', color: '#E53935' },
  { label: 'Projected 2030', value: '~118 km²', delta: '+32% from today', color: '#E53935' },
];

const UrbanPage = ({ district = 'Nagpur' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700 }}>🏙 Urban Growth Detection — {district}</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>NDBI-based built-up area expansion tracking from Sentinel-2</p>
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
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Built-up Area Expansion (2020–2025)</div>
      <div style={{ height: 280 }}><Line data={urbanData} options={chartOpts} /></div>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>🤖 AI Analysis</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { type: 'danger', text: '🏗 Urban area grew 22% in 5 years — equivalent to 16.4 km² of natural land converted. Eastern and southern corridors show highest expansion rates.' },
          { type: 'warning', text: '⚠ At current growth rate, the district will exceed its master plan\'s 2030 urban boundary by 2026.' },
          { type: 'info', text: '💡 Recommend: Enforce urban growth boundaries, promote vertical development, and mandate environmental impact assessments for all new layouts above 5 acres.' },
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

export default UrbanPage;
