import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

const tempData = {
  labels: YEARS,
  datasets: [{
    label: 'Land Surface Temperature (°C)',
    data: [31.8, 32.4, 32.9, 33.5, 34.2, 34.8],
    borderColor: '#E53935', backgroundColor: 'rgba(229,57,53,0.1)',
    fill: true, tension: 0.4, pointBackgroundColor: '#E53935', pointRadius: 5,
  }, {
    label: 'Historical Average (°C)',
    data: [31.0, 31.0, 31.0, 31.0, 31.0, 31.0],
    borderColor: 'rgba(255,255,255,0.2)', borderDash: [6, 4],
    fill: false, tension: 0, pointRadius: 0,
  }]
};

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } }, tooltip: { backgroundColor: '#0A2540', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569' }, min: 29, max: 38 }
  }
};

const heatZones = [
  { zone: 'Eastern Industrial Belt', temp: '38.2°C', risk: 'Extreme', color: '#E53935' },
  { zone: 'Central Business District', temp: '36.5°C', risk: 'High', color: '#E53935' },
  { zone: 'Western Residential', temp: '34.1°C', risk: 'Moderate', color: '#FB8C00' },
  { zone: 'Northern Forest Reserve', temp: '30.2°C', risk: 'Low', color: '#43A047' },
];

const ClimatePage = ({ district = 'Nagpur' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700 }}>🌡 Climate & Heat Analysis — {district}</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Land Surface Temperature and Urban Heat Island detection from Sentinel-2</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {[
        { label: 'Avg Land Temp', value: '34.2°C', delta: '+2.4°C above avg', color: '#E53935' },
        { label: 'Max Heat Zone', value: '38.2°C', delta: 'Eastern Industrial', color: '#E53935' },
        { label: 'Heat Island Area', value: '22.4 km²', delta: '+34% since 2020', color: '#FB8C00' },
        { label: 'Cool Green Zones', value: '18.1 km²', delta: '-11% since 2020', color: '#43A047' },
      ].map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card">
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{m.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{m.delta}</div>
        </motion.div>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card">
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Land Surface Temperature Trend</div>
        <div style={{ height: 260 }}><Line data={tempData} options={chartOpts} /></div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="glass-card">
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>🔥 Heat Zones</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {heatZones.map((z, i) => (
            <div key={i} style={{ padding: '10px 12px', background: `${z.color}10`, border: `1px solid ${z.color}30`, borderRadius: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{z.zone}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 12, color: z.color, fontWeight: 700 }}>{z.temp}</span>
                <span style={{ fontSize: 11, color: z.color }}>{z.risk} Risk</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="glass-card">
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>🤖 AI Analysis</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { type: 'danger', text: '🔥 Land surface temperature has risen 3°C above historical average. Urban Heat Island effect now covers 22.4 km² of the district.' },
          { type: 'warning', text: '⚠ The eastern industrial belt consistently records temperatures 6–8°C higher than the district mean, causing heat stress risk for 1.2 lakh residents.' },
          { type: 'info', text: '💡 Recommend: Mandate cool roofing on all new commercial buildings, expand urban tree cover by 15%, and create designated heat shelter zones.' },
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

export default ClimatePage;
