import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiDroplet, FiTrendingDown, FiTrendingUp, FiRefreshCw, FiWifi, FiWifiOff } from 'react-icons/fi';
import { TbTree, TbBuildingSkyscraper } from 'react-icons/tb';
import { MdOutlineThermostat } from 'react-icons/md';
import OrbitMap from '../maps/OrbitMap';
import { useDashboard, useProcess } from '../hooks/useDashboard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const YEARS_LABELS = ['2021', '2022', '2023', '2024', '2025'];
const RISK_SCORE = 62;

const DEMO_STATS = [
  { id: 'water',      title: 'Water Bodies',    value: '24.5', unit: 'sq km', change: '-14%', trend: 'down', status: 'Critical',  icon: FiDroplet,          color: '#00BCD4', bg: 'rgba(0,188,212,0.1)',   data: [32.1, 30.5, 28.4, 26.1, 24.5] },
  { id: 'vegetation', title: 'Vegetation Cover', value: '142',  unit: 'sq km', change: '-10%', trend: 'down', status: 'Moderate',  icon: TbTree,             color: '#43A047', bg: 'rgba(67,160,71,0.1)',   data: [158, 154, 149, 145, 142] },
  { id: 'urban',      title: 'Built-up Area',   value: '89.4', unit: 'sq km', change: '+22%', trend: 'up',   status: 'Critical',  icon: TbBuildingSkyscraper, color: '#FB8C00', bg: 'rgba(251,140,0,0.1)',   data: [73, 77, 81, 85, 89.4] },
  { id: 'temp',       title: 'Surface Temp',    value: '34.2', unit: '°C',    change: '+2.1°C',trend:'up',   status: 'Moderate',  icon: MdOutlineThermostat, color: '#E53935', bg: 'rgba(229,57,53,0.1)',   data: [32.1, 32.6, 33.2, 33.8, 34.2] },
];

const DEMO_SDG = { Water: 58, Vegetation: 72, Urban: 44, Climate: 66 };
const DEMO_INSIGHTS = [
  { type: 'danger',  text: 'Water bodies reduced by 14%. Rapid urbanization in eastern sector is the primary cause.' },
  { type: 'warning', text: 'Urban area expanded 22% since 2021. Infrastructure stress expected by 2027.' },
  { type: 'success', text: 'Northern forest reserves show stable NDVI — protection policies are working.' },
  { type: 'info',    text: 'Recommend: Prioritize rainwater harvesting in new urban expansion zones.' },
];

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0A2540', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#94a3b8', bodyColor: 'white' } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } } }
  }
};

const StatusBadge = ({ status }) => {
  const c = { Critical: { bg: 'rgba(229,57,53,0.15)', text: '#E53935' }, Moderate: { bg: 'rgba(251,140,0,0.15)', text: '#FB8C00' }, Good: { bg: 'rgba(67,160,71,0.15)', text: '#43A047' } }[status];
  return <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>{status}</span>;
};

const Dashboard = ({ district = 'Nagpur', year = '2024', onDistrictChange }) => {
  const [activeLayer, setActiveLayer] = useState('ndwi');
  const { data: apiData, loading, backendOnline } = useDashboard(district, parseInt(year));
  const { trigger: triggerProcess, loading: processing } = useProcess();

  // Resolve data: prefer real API, fall back to demo
  const current = apiData?.current;
  const stats = current ? [
    { ...DEMO_STATS[0], value: String(current.water_area_sqkm ?? DEMO_STATS[0].value), data: (apiData.historical || []).map(h => h.water_area_sqkm).concat([current.water_area_sqkm]) },
    { ...DEMO_STATS[1], value: String(current.vegetation_area_sqkm ?? DEMO_STATS[1].value), data: (apiData.historical || []).map(h => h.vegetation_area_sqkm).concat([current.vegetation_area_sqkm]) },
    { ...DEMO_STATS[2], value: String(current.urban_area_sqkm ?? DEMO_STATS[2].value), data: (apiData.historical || []).map(h => h.urban_area_sqkm).concat([current.urban_area_sqkm]) },
    { ...DEMO_STATS[3], value: String(current.temperature_celsius ?? DEMO_STATS[3].value) },
  ] : DEMO_STATS;

  const sdgRaw = current?.sdg_scores || {};
  const SDG_SCORES = {
    Water:      sdgRaw.water      ?? DEMO_SDG.Water,
    Vegetation: sdgRaw.vegetation ?? DEMO_SDG.Vegetation,
    Urban:      sdgRaw.urban      ?? DEMO_SDG.Urban,
    Climate:    sdgRaw.climate    ?? DEMO_SDG.Climate,
  };
  const overallSDG = sdgRaw.overall ?? Math.round(Object.values(SDG_SCORES).reduce((a, b) => a + b, 0) / 4);
  const aiInsights = apiData?.insights ?? DEMO_INSIGHTS;

  // Charts
  const waterChartData = { labels: YEARS_LABELS, datasets: [{ label: 'Water (km²)', data: stats[0].data, borderColor: '#00BCD4', backgroundColor: 'rgba(0,188,212,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#00BCD4', pointRadius: 4 }] };
  const vegChartData   = { labels: YEARS_LABELS, datasets: [{ label: 'Vegetation (km²)', data: stats[1].data, backgroundColor: YEARS_LABELS.map((_, i) => i === 4 ? '#43A047' : 'rgba(67,160,71,0.4)'), borderRadius: 6, borderSkipped: false }] };
  const urbanChartData = { labels: YEARS_LABELS, datasets: [{ label: 'Urban (km²)', data: stats[2].data, borderColor: '#FB8C00', backgroundColor: 'rgba(251,140,0,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#FB8C00', pointRadius: 4 }] };
  const sdgChartData   = { labels: Object.keys(SDG_SCORES), datasets: [{ data: Object.values(SDG_SCORES), backgroundColor: ['rgba(0,188,212,0.8)', 'rgba(67,160,71,0.8)', 'rgba(251,140,0,0.8)', 'rgba(229,57,53,0.8)'], borderWidth: 0, hoverOffset: 6 }] };
  const sdgDonutOpts   = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0A2540', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } }, cutout: '72%' };

  const riskColor = RISK_SCORE > 70 ? '#E53935' : RISK_SCORE > 40 ? '#FB8C00' : '#43A047';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minHeight: '100%' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'IBM Plex Serif, serif', fontSize: 22, fontWeight: 700, marginBottom: 2, color: 'var(--text-primary)' }}>
            {district} District <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 16 }}>· {year}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>Environmental SDG indicators from Sentinel-2 satellite imagery</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {backendOnline
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#43A047', background: 'rgba(67,160,71,0.1)', border: '1px solid rgba(67,160,71,0.2)', padding: '4px 10px', borderRadius: 20 }}><FiWifi size={11} /> API Online</span>
            : <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#FB8C00', background: 'rgba(251,140,0,0.1)', border: '1px solid rgba(251,140,0,0.2)', padding: '4px 10px', borderRadius: 20 }}><FiWifiOff size={11} /> Demo Mode</span>
          }
          <button onClick={() => triggerProcess(district, parseInt(year))} disabled={processing}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--blue)', background: 'rgba(33,150,243,0.08)', border: '1px solid rgba(33,150,243,0.2)', padding: '4px 12px', borderRadius: 20, cursor: 'pointer' }}>
            <FiRefreshCw size={11} />
            {processing ? 'Processing…' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      {/* ── Row 1: Stat Cards (compact) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          const miniData = { labels: YEARS_LABELS, datasets: [{ data: s.data || [], borderColor: s.color, backgroundColor: 'transparent', borderWidth: 2, tension: 0.4, pointRadius: 0 }] };
          const miniOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } };
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}><Icon size={17} /></div>
                <StatusBadge status={s.status} />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 1 }}>{s.title}</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, color: 'var(--text-primary)' }}>{s.value}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>{s.unit}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, marginTop: 3, color: s.status === 'Critical' ? 'var(--red)' : 'var(--orange)' }}>
                {s.trend === 'down' ? <FiTrendingDown size={12} /> : <FiTrendingUp size={12} />}
                <span>{s.change} vs 2021</span>
              </div>
              <div style={{ height: 34, marginTop: 8 }}>
                {s.data && <Line data={miniData} options={miniOpts} />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Row 2: Map + Right Panel ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12, marginBottom: 12 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: 360 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>🗺 Change Hotspot Map — click any district</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['ndwi', 'Water', '#00BCD4'], ['ndvi', 'Vegetation', '#43A047'], ['ndbi', 'Urban', '#FB8C00']].map(([key, label, color]) => (
                <button key={key} onClick={() => setActiveLayer(key)}
                  style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', background: activeLayer === key ? color + '25' : 'rgba(255,255,255,0.04)', color: activeLayer === key ? color : '#64748b', border: `1px solid ${activeLayer === key ? color + '50' : 'rgba(255,255,255,0.06)'}` }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <OrbitMap district={district} activeLayer={activeLayer} onDistrictClick={onDistrictChange} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* AI Insights */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="glass-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>AI Insights</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: '#43A047', background: 'rgba(67,160,71,0.1)', padding: '2px 7px', borderRadius: 10 }}>
                {backendOnline ? 'Live' : 'Demo'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {aiInsights.map((ins, i) => {
                const cfg = { danger: ['rgba(229,57,53,0.08)', 'rgba(229,57,53,0.2)', '#E53935'], warning: ['rgba(251,140,0,0.08)', 'rgba(251,140,0,0.2)', '#FB8C00'], success: ['rgba(67,160,71,0.08)', 'rgba(67,160,71,0.2)', '#43A047'], info: ['rgba(33,150,243,0.08)', 'rgba(33,150,243,0.2)', '#2196F3'] };
                const [bg, border, accent] = cfg[ins.type] || cfg.info;
                return <div key={i} style={{ padding: '9px 12px', background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${accent}`, borderRadius: 10, fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.55 }}>{ins.text}</div>;
              })}
            </div>
          </motion.div>

          {/* SDG Ring */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} className="glass-card">
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>🎯 SDG Score</div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                <Doughnut data={sdgChartData} options={sdgDonutOpts} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800 }}>{overallSDG}</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>/100</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {Object.entries(SDG_SCORES).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3, color: '#94a3b8' }}><span>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
                    <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ height: '100%', borderRadius: 4, background: k === 'Water' ? '#00BCD4' : k === 'Vegetation' ? '#43A047' : k === 'Urban' ? '#FB8C00' : '#E53935' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Row 3: Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>💧 Water Body Trend</div>
          <div style={{ height: 160 }}><Line data={waterChartData} options={chartOpts} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>🌿 Vegetation Cover</div>
          <div style={{ height: 160 }}><Bar data={vegChartData} options={chartOpts} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>🏙 Urban Expansion</div>
          <div style={{ height: 160 }}><Line data={urbanChartData} options={chartOpts} /></div>
        </motion.div>
      </div>

      {/* ── Row 4: Risk Meter + Prediction + Alerts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {/* Risk Meter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="glass-card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>⚡ Environmental Risk</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 120, height: 60, overflow: 'hidden' }}>
              <svg viewBox="0 0 120 60" style={{ width: '100%', height: '100%' }}>
                <path d="M 10 58 A 50 50 0 0 1 110 58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
                <path d="M 10 58 A 50 50 0 0 1 43 18" fill="none" stroke="#43A047" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
                <path d="M 43 18 A 50 50 0 0 1 77 18" fill="none" stroke="#FB8C00" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
                <path d="M 77 18 A 50 50 0 0 1 110 58" fill="none" stroke="#E53935" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
                <motion.line x1="60" y1="58" x2="60" y2="18" stroke={riskColor} strokeWidth="3" strokeLinecap="round"
                  initial={{ rotate: -90 }} animate={{ rotate: (RISK_SCORE / 100) * 180 - 90 }}
                  style={{ transformOrigin: '60px 58px' }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }} />
                <circle cx="60" cy="58" r="4" fill={riskColor} />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800, color: riskColor }}>{RISK_SCORE}<span style={{ fontSize: 14, color: '#475569' }}>/100</span></div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Moderate Environmental Risk</div>
            </div>
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              {[['Low', '#43A047'], ['Medium', '#FB8C00'], ['High', '#E53935']].map(([l, c]) => (
                <div key={l} style={{ textAlign: 'center', fontSize: 11, padding: '4px 0', borderRadius: 6, background: `${c}15`, color: c }}>{l}</div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 5-Year Prediction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>🔮 5-Year Prediction</div>
            <span style={{ fontSize: 10, color: '#64748b', background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 8 }}>ML Model</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(apiData?.predictions?.indicators ? Object.entries(apiData.predictions.indicators).map(([, v]) => ({
              label: v.label, val: `${v.final_prediction} km²`, delta: `${v.change_pct > 0 ? '+' : ''}${v.change_pct}%`, color: v.trend === 'increasing' ? '#FB8C00' : '#43A047'
            })) : [
              { label: 'Water Bodies 2030', val: '18.2 km²', delta: '-26%', color: '#00BCD4' },
              { label: 'Vegetation 2030',   val: '128 km²',  delta: '-19%', color: '#43A047' },
              { label: 'Urban Area 2030',   val: '118 km²',  delta: '+32%', color: '#FB8C00' },
              { label: 'Avg Temp 2030',     val: '36.4°C',   delta: '+4.4°C', color: '#E53935' },
            ]).map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{p.label}</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: p.color }}>{p.val}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>{p.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>🔔 Alerts</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '⚠', text: 'Water level decreasing in Zone B', time: '2h ago', color: '#FB8C00' },
              { icon: '🌳', text: 'Tree cover improving in North Reserve', time: '5h ago', color: '#43A047' },
              { icon: '🏙', text: 'Urban expansion +4% in Q2 2024', time: '1d ago', color: '#FB8C00' },
              { icon: '🔥', text: 'Heat island detected — East Sector', time: '2d ago', color: '#E53935' },
              { icon: '💧', text: 'NDWI threshold breached — Lake 3', time: '3d ago', color: '#00BCD4' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{a.time}</div>
                </div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, marginTop: 4, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
