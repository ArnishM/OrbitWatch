import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { FiDroplet, FiTrendingDown, FiTrendingUp, FiRefreshCw, FiWifi, FiWifiOff, FiDownload } from 'react-icons/fi';
import { TbTree, TbBuildingSkyscraper } from 'react-icons/tb';
import { MdOutlineThermostat } from 'react-icons/md';
import OrbitMap from '../maps/OrbitMap';
import { useTheme } from '../context/ThemeContext';
import { useDashboard, useProcess, useAlerts } from '../hooks/useDashboard';
import { AnimatedLineChart, AnimatedBarChart } from '../components/AnimatedCharts';
import { exportReport } from '../components/ReportExporter';

ChartJS.register(ArcElement, Tooltip);


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

const getChartOpts = (isDark) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#0A2540' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: isDark ? '#94a3b8' : '#475569', bodyColor: isDark ? '#FFFFFF' : '#0F172A' } },
  scales: {
    x: { grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: isDark ? '#94a3b8' : '#475569', font: { size: 11 } } },
    y: { grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: isDark ? '#94a3b8' : '#475569', font: { size: 11 } } }
  }
});

const StatusBadge = ({ status }) => {
  const c = { Critical: { bg: 'rgba(229,57,53,0.15)', text: '#E53935' }, Moderate: { bg: 'rgba(251,140,0,0.15)', text: '#FB8C00' }, Good: { bg: 'rgba(67,160,71,0.15)', text: '#43A047' } }[status];
  return <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>{status}</span>;
};

const Dashboard = ({ district = 'Nagpur', year = '2024', onDistrictChange }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartOpts = getChartOpts(isDark);
  
  const [activeLayer, setActiveLayer] = useState('ndwi');
  const [exporting, setExporting] = useState(false);
  const { data: apiData, loading, backendOnline } = useDashboard(district, parseInt(year));
  const { trigger: triggerProcess, loading: processing } = useProcess();
  const { alerts: liveAlerts } = useAlerts(district, parseInt(year));

  // Resolve data: prefer real API, fall back to demo
  const current = apiData?.current;
  const stats = current ? [
    { ...DEMO_STATS[0], value: String(current.water_area_sqkm ?? DEMO_STATS[0].value), data: (apiData.timeline || []).map(t => t.water_area_sqkm) },
    { ...DEMO_STATS[1], value: String(current.vegetation_area_sqkm ?? DEMO_STATS[1].value), data: (apiData.timeline || []).map(t => t.vegetation_area_sqkm) },
    { ...DEMO_STATS[2], value: String(current.urban_area_sqkm ?? DEMO_STATS[2].value), data: (apiData.timeline || []).map(t => t.urban_area_sqkm) },
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

  const riskColor = RISK_SCORE > 70 ? '#E53935' : RISK_SCORE > 40 ? '#FB8C00' : '#43A047';

  // ── Export PDF handler ─────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      const predList = apiData?.predictions?.indicators
        ? Object.entries(apiData.predictions.indicators).map(([, v]) => ({
            label: v.label,
            val: `${v.final_prediction} km²`,
            delta: `${v.change_pct > 0 ? '+' : ''}${v.change_pct}%`,
            conf: v.confidence_pct || 85,
          }))
        : null;
      await exportReport({
        district,
        year,
        stats: {
          water: stats[0].value, veg: stats[1].value,
          urban: stats[2].value, temp: stats[3].value,
          waterChange: stats[0].change, vegChange: stats[1].change,
          urbanChange: stats[2].change, tempChange: stats[3].change,
        },
        sdgScores: SDG_SCORES,
        insights: aiInsights,
        alerts: liveAlerts,
        predictions: predList,
        backendOnline,
      });
    } finally {
      setExporting(false);
    }
  };

  // SDG Donut config
  const sdgDonutOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#0A2540' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderWidth: 1 } }, cutout: '72%' };
  const sdgChartData = { labels: Object.keys(SDG_SCORES), datasets: [{ data: Object.values(SDG_SCORES), backgroundColor: ['rgba(0,188,212,0.8)', 'rgba(67,160,71,0.8)', 'rgba(251,140,0,0.8)', 'rgba(229,57,53,0.8)'], borderWidth: 0, hoverOffset: 6 }] };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minHeight: '100%' }}>
      <style>{`
        .dash-stats   { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; margin-bottom: 10px; }
        .dash-row2    { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 10px; }
        .dash-row3    { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .dash-header  { flex-direction: column; gap: 8px; align-items: flex-start; }
        .dash-header-right { flex-wrap: wrap; gap: 6px; }
        .dash-map-height { min-height: 260px; }
        @media (min-width: 640px) {
          .dash-stats  { grid-template-columns: repeat(4,1fr); }
          .dash-row2   { grid-template-columns: 1fr 340px; }
          .dash-row3   { grid-template-columns: 1fr 1fr 1fr; }
          .dash-header { flex-direction: row; align-items: flex-start; }
          .dash-map-height { min-height: 340px; }
        }
      `}</style>
      {/* ── Header ── */}
      <div className="dash-header" style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'IBM Plex Serif, serif', fontSize: 22, fontWeight: 700, marginBottom: 2, color: 'var(--text-primary)' }}>
            {district} District <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 16 }}>· {year}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>Environmental SDG indicators from Sentinel-2 satellite imagery</p>
        </div>
        <div className="dash-header-right" style={{ display: 'flex', alignItems: 'center' }}>
          {backendOnline
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#43A047', background: 'rgba(67,160,71,0.1)', border: '1px solid rgba(67,160,71,0.2)', padding: '4px 10px', borderRadius: 20 }}><FiWifi size={11} /> API Online</span>
            : <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#FB8C00', background: 'rgba(251,140,0,0.1)', border: '1px solid rgba(251,140,0,0.2)', padding: '4px 10px', borderRadius: 20 }}><FiWifiOff size={11} /> Demo Mode</span>
          }
          <button onClick={() => triggerProcess(district, parseInt(year))} disabled={processing}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--blue)', background: 'rgba(33,150,243,0.08)', border: '1px solid rgba(33,150,243,0.2)', padding: '4px 12px', borderRadius: 20, cursor: 'pointer' }}>
            <FiRefreshCw size={11} />
            {processing ? 'Processing…' : 'Run Pipeline'}
          </button>
          <button
            id="export-report-btn"
            onClick={handleExport}
            disabled={exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 600,
              color: '#ffffff',
              background: exporting
                ? 'rgba(33,150,243,0.25)'
                : 'linear-gradient(135deg, #2196F3, #1565C0)',
              border: '1px solid rgba(33,150,243,0.4)',
              padding: '5px 14px', borderRadius: 20,
              cursor: exporting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: exporting ? 'none' : '0 2px 12px rgba(33,150,243,0.25)',
              opacity: exporting ? 0.7 : 1,
            }}
          >
            <FiDownload size={12} />
            {exporting ? 'Generating…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <div className="dash-stats">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass-card" style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}><Icon size={15} /></div>
                <StatusBadge status={s.status} />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.title}</div>
              <motion.div key={`${year}-${s.value}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.15, color: 'var(--text-primary)' }}>
                {s.value}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 3 }}>{s.unit}</span>
              </motion.div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, marginTop: 4, color: s.trend === 'down' ? 'var(--red)' : 'var(--green)' }}>
                {s.trend === 'down' ? <FiTrendingDown size={11} /> : <FiTrendingUp size={11} />}
                <span>{s.change} vs 2021</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Row 2: Map LEFT + Charts+SDG RIGHT ── */}
      <div className="dash-row2">

        {/* MAP */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>🗺 Change Hotspot Map — click any district</div>
            <div style={{ display: 'flex', gap: 5 }}>
              {[['ndwi', 'Water', '#00BCD4'], ['ndvi', 'Vegetation', '#43A047'], ['ndbi', 'Urban', '#FB8C00']].map(([key, label, color]) => (
                <button key={key} onClick={() => setActiveLayer(key)}
                  style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', background: activeLayer === key ? color + '25' : 'rgba(128,128,128,0.08)', color: activeLayer === key ? color : 'var(--text-secondary)', border: `1px solid ${activeLayer === key ? color + '50' : 'rgba(128,128,128,0.1)'}` }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="dash-map-height" style={{ flex: 1 }}>
            <OrbitMap district={district} activeLayer={activeLayer} onDistrictClick={onDistrictChange} />
          </div>
        </motion.div>

        {/* RIGHT COLUMN: 3 charts + SDG ring */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* 3 animated charts stacked */}
          {[
            { title: '💧 Water', data: stats[0].data?.length === 5 ? stats[0].data : [32.1,30.5,28.4,26.1,24.5], color: '#00BCD4', type: 'line', gid: 'gw' },
            { title: '🌿 Vegetation', data: stats[1].data?.length === 5 ? stats[1].data : [158,154,149,145,142], color: '#43A047', type: 'bar', gid: 'gv' },
            { title: '🏙 Urban', data: stats[2].data?.length === 5 ? stats[2].data : [73,77,81,85,89.4], color: '#FB8C00', type: 'line', gid: 'gu' },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className="glass-card" style={{ padding: '10px 12px', flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{c.title}</div>
              {c.type === 'line'
                ? <AnimatedLineChart key={`${c.gid}-${district}-${year}`} data={c.data} color={c.color} label="" unit="km²" selectedYear={year} gradientId={c.gid} />
                : <AnimatedBarChart  key={`${c.gid}-${district}-${year}`} data={c.data} color={c.color} label="" unit="km²" selectedYear={year} />
              }
            </motion.div>
          ))}

          {/* SDG Ring */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} className="glass-card" style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 8, color: 'var(--text-primary)' }}>🎯 SDG Score</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <Doughnut data={sdgChartData} options={sdgDonutOpts} />
                <motion.div key={`${year}-${overallSDG}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{overallSDG}</span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>/100</span>
                </motion.div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                {Object.entries(SDG_SCORES).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2, color: 'var(--text-secondary)' }}><span>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
                    <div style={{ height: 3, borderRadius: 3, background: 'rgba(128,128,128,0.15)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ height: '100%', borderRadius: 3, background: k === 'Water' ? '#00BCD4' : k === 'Vegetation' ? '#43A047' : k === 'Urban' ? '#FB8C00' : '#E53935' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Row 3: AI Insights + Predictions + Alerts ── */}
      <div className="dash-row3">

        {/* AI Insights */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>AI Insights</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, color: '#43A047', background: 'rgba(67,160,71,0.1)', padding: '1px 6px', borderRadius: 8 }}>{backendOnline ? 'Live' : 'Demo'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {aiInsights.slice(0, 3).map((ins, i) => {
              const cfg = { danger: ['rgba(229,57,53,0.07)','rgba(229,57,53,0.2)','#E53935'], warning: ['rgba(251,140,0,0.07)','rgba(251,140,0,0.2)','#FB8C00'], success: ['rgba(67,160,71,0.07)','rgba(67,160,71,0.2)','#43A047'], info: ['rgba(33,150,243,0.07)','rgba(33,150,243,0.2)','#2196F3'] };
              const [bg, border, accent] = cfg[ins.type] || cfg.info;
              return <div key={i} style={{ padding: '7px 10px', background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${accent}`, borderRadius: 8, fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ins.text}</div>;
            })}
          </div>
        </motion.div>

        {/* 5-Year Prediction + Risk */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>🔮 Predictions 2030</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', background: 'rgba(128,128,128,0.08)', padding: '1px 6px', borderRadius: 8 }}>Scikit-Learn</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(apiData?.predictions?.indicators ? Object.entries(apiData.predictions.indicators).map(([, v]) => ({
              label: v.label, val: `${v.final_prediction} km²`, delta: `${v.change_pct > 0 ? '+' : ''}${v.change_pct}%`, color: v.trend === 'increasing' ? '#FB8C00' : '#43A047', conf: v.confidence_pct || 85
            })) : [
              { label: 'Water Bodies', val: '18.2 km²', delta: '-26%', color: '#00BCD4', conf: 92 },
              { label: 'Vegetation',   val: '128 km²',  delta: '-19%', color: '#43A047', conf: 88 },
              { label: 'Urban Area',   val: '118 km²',  delta: '+32%', color: '#FB8C00', conf: 94 },
              { label: 'Avg Temp',     val: '36.4°C',   delta: '+4.4°C', color: '#E53935', conf: 76 },
            ]).map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: 'rgba(128,128,128,0.04)', borderRadius: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.val}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 5 }}>{p.delta}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Mini risk gauge */}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg viewBox="0 0 80 40" style={{ width: 80, height: 40, flexShrink: 0 }}>
              <path d="M 6 38 A 32 32 0 0 1 74 38" fill="none" stroke="rgba(128,128,128,0.12)" strokeWidth="7" strokeLinecap="round" />
              <path d="M 6 38 A 32 32 0 0 1 28 10" fill="none" stroke="#43A047" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
              <path d="M 28 10 A 32 32 0 0 1 52 10" fill="none" stroke="#FB8C00" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
              <path d="M 52 10 A 32 32 0 0 1 74 38" fill="none" stroke="#E53935" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
              <motion.line key={`risk-${year}`} x1="40" y1="38" x2="40" y2="10" stroke={riskColor} strokeWidth="2.5" strokeLinecap="round"
                initial={{ rotate: -90 }} animate={{ rotate: (RISK_SCORE / 100) * 180 - 90 }}
                style={{ transformOrigin: '40px 38px' }} transition={{ duration: 1, type: 'spring', bounce: 0.25 }} />
              <circle cx="40" cy="38" r="3" fill={riskColor} />
            </svg>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: riskColor, lineHeight: 1 }}>{RISK_SCORE}<span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>/100</span></div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>⚡ Moderate Risk</div>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>🔔 Alerts</span>
            <span style={{ fontSize: 9, color: liveAlerts ? '#43A047' : 'var(--text-muted)', background: liveAlerts ? 'rgba(67,160,71,0.1)' : 'rgba(128,128,128,0.08)', padding: '1px 6px', borderRadius: 8 }}>{liveAlerts ? 'Live' : 'Demo'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {(liveAlerts || [
              { icon: '⚠', text: 'Water level decreasing in Zone B', time: '2h ago', color: '#FB8C00' },
              { icon: '🌳', text: 'Tree cover improving in North Reserve', time: '5h ago', color: '#43A047' },
              { icon: '🏙', text: 'Urban expansion +4% in Q2 2024', time: '1d ago', color: '#FB8C00' },
              { icon: '🔥', text: 'Heat island detected — East Sector', time: '2d ago', color: '#E53935' },
              { icon: '💧', text: 'NDWI threshold breached — Lake 3', time: '3d ago', color: '#00BCD4' },
            ]).map((a, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{a.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{a.time}</div>
                </div>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


