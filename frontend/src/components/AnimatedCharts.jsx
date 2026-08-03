import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

const YEARS = ['2021', '2022', '2023', '2024', '2025'];

// ── Animated counting number ──────────────────────────────────────────────────
const AnimatedNumber = ({ value, decimals = 1 }) => {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = display;
    const to = parseFloat(value);
    if (isNaN(to) || from === to) return;
    const duration = 600;
    const start = performance.now();
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * ease;
      setDisplay(parseFloat(current.toFixed(decimals)));
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{display}</>;
};

// ── Build SVG path from data points ─────────────────────────────────────────
function buildPath(points, w, h, padX = 28, padY = 16) {
  const xs = points.map((_, i) => padX + (i / (points.length - 1)) * (w - padX * 2));
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const ys = points.map(v => padY + (1 - (v - min) / range) * (h - padY * 2));

  // Catmull-Rom to cubic bezier for smooth curve
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const x0 = xs[i - 1] ?? xs[i];
    const y0 = ys[i - 1] ?? ys[i];
    const x1 = xs[i], y1 = ys[i];
    const x2 = xs[i + 1], y2 = ys[i + 1];
    const x3 = xs[i + 2] ?? xs[i + 1];
    const y3 = ys[i + 2] ?? ys[i + 1];
    const cp1x = x1 + (x2 - x0) / 6;
    const cp1y = y1 + (y2 - y0) / 6;
    const cp2x = x2 - (x3 - x1) / 6;
    const cp2y = y2 - (y3 - y1) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }
  return { d, xs, ys };
}

// ── Professional Animated Line Chart ─────────────────────────────────────────
export const AnimatedLineChart = ({ data, color, label, unit, selectedYear, gradientId }) => {
  const W = 420, H = 130, padX = 28, padY = 16;
  const yearIdx = YEARS.indexOf(String(selectedYear));
  const { d, xs, ys } = buildPath(data, W, H, padX, padY);
  const min = Math.min(...data), max = Math.max(...data);

  // Fill path (area under curve)
  const fillD = d + ` L ${xs[xs.length - 1]} ${H - padY} L ${xs[0]} ${H - padY} Z`;

  const selectedX = xs[yearIdx] ?? xs[xs.length - 1];
  const selectedY = ys[yearIdx] ?? ys[ys.length - 1];
  const selectedVal = data[yearIdx] ?? data[data.length - 1];

  // Tooltip position
  const tooltipX = selectedX > W * 0.7 ? selectedX - 80 : selectedX + 12;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
          {/* Glow filter for selected point */}
          <filter id={`glow-${gradientId}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Year grid lines */}
        {xs.map((x, i) => (
          <motion.line key={i}
            x1={x} y1={padY} x2={x} y2={H - padY}
            stroke={parseInt(YEARS[i]) === parseInt(selectedYear)
              ? `${color}40` : 'rgba(255,255,255,0.04)'}
            strokeWidth={parseInt(YEARS[i]) === parseInt(selectedYear) ? 1.5 : 0.5}
            strokeDasharray={parseInt(YEARS[i]) === parseInt(selectedYear) ? '4,3' : '0'}
            animate={{ opacity: 1 }}
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={fillD}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Line — drawn with stroke-dashoffset animation */}
        <motion.path
          key={`line-${data.join('-')}`}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Inactive dots */}
        {xs.map((x, i) => {
          const isSelected = parseInt(YEARS[i]) === parseInt(selectedYear);
          if (isSelected) return null;
          return (
            <motion.circle key={i} cx={x} cy={ys[i]} r="3"
              fill={color} opacity="0.5"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }} />
          );
        })}

        {/* Vertical drop line for selected */}
        <motion.line
          key={`vline-${selectedYear}`}
          x1={selectedX} y1={selectedY}
          x2={selectedX} y2={H - padY}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3,3"
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />

        {/* Selected point — GLOWING ring animation */}
        <motion.circle
          key={`outer-${selectedYear}`}
          cx={selectedX} cy={selectedY} r="12"
          fill={color} opacity="0"
          animate={{ r: [10, 18, 10], opacity: [0.25, 0, 0.25] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        <motion.circle
          key={`mid-${selectedYear}`}
          cx={selectedX} cy={selectedY} r="7"
          fill={color} opacity="0.25"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        />
        <motion.circle
          key={`inner-${selectedYear}`}
          cx={selectedX} cy={selectedY} r="5"
          fill={color}
          filter={`url(#glow-${gradientId})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.05 }}
        />
        <motion.circle
          key={`core-${selectedYear}`}
          cx={selectedX} cy={selectedY} r="2.5"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 10, delay: 0.1 }}
        />

        {/* Tooltip bubble */}
        <motion.g
          key={`tip-${selectedYear}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <rect x={tooltipX} y={selectedY - 34} width="74" height="26"
            rx="7" fill={color} opacity="0.92" />
          <text x={tooltipX + 37} y={selectedY - 18}
            textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
            {selectedVal?.toFixed ? selectedVal.toFixed(1) : selectedVal} {unit}
          </text>
          <text x={tooltipX + 37} y={selectedY - 8}
            textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)">
            {YEARS[yearIdx]}
          </text>
        </motion.g>

        {/* Year labels */}
        {xs.map((x, i) => (
          <text key={i} x={x} y={H - 2}
            textAnchor="middle" fontSize="9"
            fill={parseInt(YEARS[i]) === parseInt(selectedYear) ? color : 'rgba(148,163,184,0.6)'}
            fontWeight={parseInt(YEARS[i]) === parseInt(selectedYear) ? '700' : '400'}>
            {YEARS[i]}
          </text>
        ))}
      </svg>
    </div>
  );
};

// ── Professional Animated Bar Chart (div-based — avoids SVG y+height conflict) ──
export const AnimatedBarChart = ({ data, color, label, unit, selectedYear }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  // Scale so the smallest bar is still ~20% tall, largest is 100%
  const minBaseline = min * 0.85;
  const range = max - minBaseline || 1;
  const pct = (v) => ((v - minBaseline) / range) * 100;

  return (
    <div style={{ width: '100%' }}>
      {label && <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>}

      {/* Chart area */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90, padding: '0 2px', position: 'relative' }}>
        {data.map((v, i) => {
          const isSelected = parseInt(YEARS[i]) === parseInt(selectedYear);
          const heightPct = pct(v);

          return (
            <div key={`${i}-${selectedYear}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
              {/* Tooltip above selected bar */}
              {isSelected && (
                <motion.div
                  key={`tip-${i}-${selectedYear}`}
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.25, type: 'spring', stiffness: 300 }}
                  style={{
                    position: 'absolute', top: 0,
                    background: color, borderRadius: 6, padding: '3px 7px',
                    fontSize: 10, fontWeight: 700, color: 'white',
                    whiteSpace: 'nowrap', boxShadow: `0 2px 10px ${color}60`,
                    zIndex: 10,
                  }}>
                  {v?.toFixed ? v.toFixed(1) : v} {unit}
                </motion.div>
              )}

              {/* Bar */}
              <motion.div
                key={`bar-${i}-${selectedYear}`}
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.34, 1.3, 0.64, 1] }}
                style={{
                  width: '100%',
                  borderRadius: '5px 5px 3px 3px',
                  background: isSelected
                    ? `linear-gradient(to bottom, ${color}, ${color}70)`
                    : `linear-gradient(to bottom, ${color}50, ${color}15)`,
                  boxShadow: isSelected ? `0 0 12px ${color}50, 0 -2px 8px ${color}40` : 'none',
                  border: isSelected ? `1px solid ${color}80` : '1px solid transparent',
                  position: 'relative', overflow: 'hidden',
                }}>
                {/* Shimmer on selected bar */}
                {isSelected && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear', repeatDelay: 1 }}
                    style={{
                      position: 'absolute', inset: 0, width: '40%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                      pointerEvents: 'none',
                    }} />
                )}
              </motion.div>

              {/* Year label */}
              <div style={{
                fontSize: 9, marginTop: 4,
                color: isSelected ? color : 'rgba(148,163,184,0.5)',
                fontWeight: isSelected ? 700 : 400,
              }}>{YEARS[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedLineChart;


