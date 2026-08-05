import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAlerts } from '../hooks/useDashboard';

const DISTRICTS = [
  'Nagpur','Pune','Wardha','Mumbai','Nashik','Aurangabad','Kolhapur','Solapur','Amravati','Latur',
  'Lucknow','Agra','Varanasi','Kanpur','Meerut','Gorakhpur','Jaipur','Jodhpur','Udaipur','Kota',
  'Ahmedabad','Surat','Vadodara','Rajkot','Bengaluru','Mysuru','Hubli','Mangaluru','Chennai',
  'Coimbatore','Madurai','Salem','Hyderabad','Warangal','Nizamabad','Thiruvananthapuram','Kochi',
  'Kolkata','Bhubaneswar','Patna','Ranchi','Bhopal','Indore','Gwalior','Jabalpur','Raipur',
  'Guwahati','Ludhiana','Amritsar','Gurugram','Faridabad','Dehradun','Shimla','Panaji','New Delhi',
  'Visakhapatnam','Vijayawada','Guntur','Tirupati','Kurnool','Chandigarh','Puducherry','Kozhikode',
  'Jammu','Srinagar','Leh','Agartala','Shillong','Imphal','Kohima','Aizawl','Itanagar','Dhanbad'
];

const YEARS = ['2021','2022','2023','2024','2025'];

const Topbar = ({ district, setDistrict, year, setYear }) => {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState(district || 'Nagpur');
  const [suggestions, setSuggestions] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // Fetch real alerts for the selected district + year
  const { alerts: liveAlerts } = useAlerts(district, parseInt(year));

  useEffect(() => { setSearch(district); }, [district]);

  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    setSuggestions(val.length > 0
      ? DISTRICTS.filter(d => d.toLowerCase().includes(val.toLowerCase())).slice(0, 6)
      : []);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      selectDistrict(search.trim());
    }
  };

  const selectDistrict = (d) => {
    setSearch(d);
    setSuggestions([]);
    if (setDistrict) setDistrict(d);
  };

  // Use real satellite alerts if available, otherwise a minimal fallback
  const notifications = liveAlerts && liveAlerts.length > 0
    ? liveAlerts.map((a, i) => ({ id: i, icon: a.icon, text: a.text, time: a.time, color: a.color }))
    : [
        { id: 1, icon: '⚠',  text: `Monitoring ${district} — connect backend for live alerts`, time: 'Demo', color: '#FB8C00' },
        { id: 2, icon: '🛰', text: 'Sentinel-2 pipeline ready', time: 'Demo', color: '#2196F3' },
      ];

  return (
    <header className="app-topbar" style={{
      height: 60,
      background: 'var(--topbar-bg)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 10,
      transition: 'background 0.3s ease',
    }}>

      {/* ── Left: Search + Year tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Search */}
        <div className="app-topbar-search" style={{ position: 'relative' }}>
          <FiSearch
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
            size={14}
          />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search district…"
            style={{
              background: 'rgba(128,128,128,0.08)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 28px 6px 32px',
              fontSize: 13,
              color: 'var(--text-primary)',
              outline: 'none',
              width: 200,
              fontFamily: 'IBM Plex Sans, sans-serif',
            }}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setSuggestions([]); }}
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <FiX size={12} />
            </button>
          )}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', top: '108%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: 'var(--shadow)' }}>
                {suggestions.map(d => (
                  <div key={d} onClick={() => selectDistrict(d)}
                    style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(33,150,243,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {d}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Year tabs */}
        <div className="app-topbar-years" style={{ display: 'flex', gap: 3, background: 'rgba(128,128,128,0.08)', border: '1px solid var(--border)', borderRadius: 8, padding: 3 }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setYear && setYear(y)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12.5, fontWeight: 500,
                fontFamily: 'IBM Plex Sans', cursor: 'pointer',
                background: year === y ? 'var(--blue)' : 'transparent',
                color: year === y ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.18s',
              }}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Live indicator + Theme toggle + Bell ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

        {/* Live indicator */}
        <div className="app-topbar-live" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#43A047' }}>
          <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#43A047', display: 'inline-block' }} />
          Live · Sentinel-2
        </div>

        {/* Dark / Light toggle */}
        <button id="theme-toggle" onClick={toggleTheme}
          style={{
            width: 68, height: 32, borderRadius: 16, padding: '3px 4px',
            cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease',
            background: theme === 'dark' ? 'rgba(33,150,243,0.15)' : 'rgba(251,191,36,0.15)',
            border: `1px solid ${theme === 'dark' ? 'rgba(33,150,243,0.3)' : 'rgba(251,191,36,0.4)'}`,
            display: 'flex', alignItems: 'center',
          }}>
          <div style={{ position: 'absolute', inset: 3, borderRadius: 14, background: theme === 'dark' ? 'rgba(33,150,243,0.1)' : 'rgba(251,191,36,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 6px', position: 'relative', zIndex: 1 }}>
            <FiSun size={12} style={{ color: theme === 'light' ? '#F59E0B' : 'var(--text-muted)', transition: 'color 0.2s' }} />
            <FiMoon size={12} style={{ color: theme === 'dark' ? '#2196F3' : 'var(--text-muted)', transition: 'color 0.2s' }} />
          </div>
          <motion.div
            animate={{ x: theme === 'dark' ? 36 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ position: 'absolute', left: 4, width: 24, height: 24, borderRadius: '50%', background: theme === 'dark' ? '#2196F3' : '#F59E0B', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>
            {theme === 'dark'
              ? <FiMoon size={11} style={{ color: 'white', position: 'absolute', inset: 0, margin: 'auto', display: 'block' }} />
              : <FiSun  size={11} style={{ color: 'white', position: 'absolute', inset: 0, margin: 'auto', display: 'block' }} />}
          </motion.div>
        </button>

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button id="notifications-btn" onClick={() => setShowNotif(!showNotif)}
            style={{
              position: 'relative', background: 'rgba(128,128,128,0.08)',
              border: '1px solid var(--border)', borderRadius: 8,
              width: 34, height: 34, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
            }}>
            <FiBell size={16} />
            {notifications.length > 0 && (
              <span style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', background: '#FB8C00' }} />
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'absolute', top: '115%', right: 0, width: 320,
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 12, zIndex: 200, overflow: 'hidden', boxShadow: 'var(--shadow)',
                }}>
                {/* Header */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, fontFamily: 'IBM Plex Serif, serif', color: 'var(--text-primary)' }}>
                    🔔 Alerts — {district}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: liveAlerts ? '#43A047' : 'var(--text-muted)',
                    background: liveAlerts ? 'rgba(67,160,71,0.1)' : 'rgba(128,128,128,0.08)',
                    padding: '2px 7px', borderRadius: 8,
                  }}>
                    {liveAlerts ? 'Live' : 'Demo'}
                  </span>
                </div>

                {/* Alert rows */}
                {notifications.map((n, idx) => (
                  <div key={n.id} style={{
                    padding: '10px 14px',
                    borderBottom: idx < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                    </div>
                    {n.color && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, marginTop: 5, flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
