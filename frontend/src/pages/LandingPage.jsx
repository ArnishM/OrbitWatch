import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { MdOutlineSatelliteAlt } from 'react-icons/md';

const stats = [
  { value: '500+', label: 'Districts Analyzed' },
  { value: '4TB+', label: 'Satellite Data Processed' },
  { value: '12', label: 'SDG Indicators Tracked' },
  { value: '99.2%', label: 'Data Accuracy' },
];

const features = [
  { icon: '🌊', title: 'Water Body Analysis', desc: 'Track water surface changes using NDWI from Sentinel-2 imagery' },
  { icon: '🌿', title: 'Vegetation Monitoring', desc: 'Monitor forest cover and crop health with NDVI time series' },
  { icon: '🏙️', title: 'Urban Growth Detection', desc: 'Identify built-up area expansion using NDBI indices' },
  { icon: '🌡️', title: 'Heat Island Mapping', desc: 'Land Surface Temperature analysis to detect climate stress zones' },
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Automated risk scoring and 5-year predictive modeling' },
  { icon: '📄', title: 'Policy-Ready Reports', desc: 'Export PDF/CSV/GeoJSON reports for district governance' },
];

const LandingPage = ({ onEnter }) => {
  return (
    <div className="h-screen overflow-y-auto" style={{ background: 'var(--color-navy-950)' }}>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(33, 150, 243, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(33, 150, 243, 0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(67,160,71,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', background: 'rgba(3,13,26,0.7)' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2196F3, #43A047)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdOutlineSatelliteAlt size={20} />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px' }}>OrbitWatch</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 13, color: '#64B5F6', padding: '4px 12px', border: '1px solid rgba(33,150,243,0.3)', borderRadius: 20 }}>
            🛰 Live Sentinel-2
          </span>
          <button
            onClick={onEnter}
            style={{ background: '#2196F3', color: 'white', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.25)', borderRadius: 20, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: '#64B5F6' }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2196F3', display: 'inline-block' }} />
            Real-Time Satellite Intelligence Platform
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(40px, 7vw, 84px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px' }}
        >
          Turning Satellite Data<br />
          <span style={{ background: 'linear-gradient(135deg, #2196F3, #00BCD4, #43A047)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            into SDG Action
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ maxWidth: 600, color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 48 }}
        >
          OrbitWatch converts open satellite imagery from ISRO Bhuvan and Sentinel-2 into district-level environmental intelligence for governments, NGOs, and citizens.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-4"
        >
          <button
            id="explore-dashboard-btn"
            onClick={onEnter}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #2196F3, #1565C0)',
              color: 'white', padding: '14px 32px', borderRadius: 12,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(33,150,243,0.35)',
              transition: 'all 0.2s'
            }}
          >
            Explore Dashboard <FiArrowRight size={18} />
          </button>
          <a href="#features" style={{ color: '#64B5F6', fontSize: 15, fontWeight: 500 }}>See Features ↓</a>
        </motion.div>

        {/* Satellite preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            marginTop: 80, width: '100%', maxWidth: 900,
            background: 'rgba(10, 37, 64, 0.6)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20,
            padding: '24px', position: 'relative',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(33,150,243,0.08)'
          }}
        >
          {/* Fake browser bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E53935' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FB8C00' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#43A047' }} />
            <div style={{ flex: 1, marginLeft: 12, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: 12, color: '#64748b' }}>
              orbitwatch.gov.in/dashboard
            </div>
          </div>

          {/* Mini dashboard preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, height: 320 }}>
            <div style={{ background: 'rgba(7,26,46,0.7)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Dashboard', 'Water', 'Vegetation', 'Urban Growth', 'Climate'].map((item, i) => (
                <div key={item} style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, background: i === 0 ? 'rgba(33,150,243,0.2)' : 'transparent', color: i === 0 ? '#2196F3' : '#64748b' }}>{item}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { label: 'Water Bodies', val: '24.5 km²', color: '#2196F3', change: '-14%' },
                  { label: 'Vegetation', val: '142 km²', color: '#43A047', change: '-10%' },
                  { label: 'Built-up Area', val: '89.4 km²', color: '#FB8C00', change: '+22%' },
                  { label: 'Temperature', val: '34.2°C', color: '#E53935', change: '+2.1°C' },
                ].map(c => (
                  <div key={c.label} style={{ background: 'rgba(10,37,64,0.7)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.val}</div>
                    <div style={{ fontSize: 10, color: c.change.startsWith('+') ? '#E53935' : '#43A047' }}>{c.change}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(7,26,46,0.7)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 13 }}>
                🗺️ Interactive GIS Map
              </div>
              <div style={{ background: 'rgba(7,26,46,0.7)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 6, padding: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>✨ AI Insights</div>
                {['⚠ Water declining', '🌳 Forest stabilized', '🏙 Urban expanding'].map(t => (
                  <div key={t} style={{ fontSize: 10, color: '#94a3b8' }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '80px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 40, fontWeight: 800, background: 'linear-gradient(135deg, #2196F3, #43A047)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Everything you need to<br />monitor environmental SDGs</h2>
          <p style={{ color: '#64748b', fontSize: 16 }}>From raw pixels to policy-ready insights — automatically.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 40px', textAlign: 'center' }}>
        <div className="gradient-border" style={{ display: 'inline-block', padding: 40, maxWidth: 600 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Ready to explore your district?</h2>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: 16 }}>Start with Nagpur, Pune, Wardha, or any district in India.</p>
          <button onClick={onEnter} style={{ background: 'linear-gradient(135deg, #2196F3, #1565C0)', color: 'white', padding: '14px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(33,150,243,0.3)' }}>
            Launch OrbitWatch →
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
