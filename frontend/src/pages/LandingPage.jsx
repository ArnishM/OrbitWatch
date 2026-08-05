import React from 'react';
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

      {/* Mobile-safe inline styles */}
      <style>{`
        .landing-nav { padding: 14px 20px; }
        .landing-hero { padding: 100px 20px 60px; }
        .landing-hero h1 { font-size: clamp(32px, 8vw, 84px); letter-spacing: -1px; }
        .landing-hero p { font-size: 15px; }
        .landing-cta-btns { flex-wrap: wrap; justify-content: center; gap: 12px; }
        .landing-preview { display: none; }
        .landing-stats { grid-template-columns: repeat(2, 1fr); padding: 60px 24px; gap: 28px; }
        .landing-features-grid { grid-template-columns: 1fr; }
        .landing-feature-section { padding: 60px 20px; }
        .landing-cta-section { padding: 60px 20px; }
        .landing-nav-badge { display: none; }

        @media (min-width: 640px) {
          .landing-stats { grid-template-columns: repeat(4, 1fr); }
          .landing-features-grid { grid-template-columns: repeat(2, 1fr); }
          .landing-preview { display: block; }
          .landing-nav-badge { display: inline-flex; }
        }

        @media (min-width: 900px) {
          .landing-nav { padding: 16px 40px; }
          .landing-hero { padding: 140px 40px 80px; }
          .landing-features-grid { grid-template-columns: repeat(3, 1fr); }
          .landing-feature-section { padding: 80px 40px; }
          .landing-cta-section { padding: 100px 40px; }
        }
      `}</style>

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
      <nav className="landing-nav fixed top-0 left-0 right-0 z-50 flex justify-between items-center"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', background: 'rgba(3,13,26,0.7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #2196F3, #43A047)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MdOutlineSatelliteAlt size={18} />
          </div>
          <span style={{ fontFamily: 'IBM Plex Serif, serif', fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>OrbitWatch</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="landing-nav-badge" style={{ alignItems: 'center', gap: 6, fontSize: 12, color: '#64B5F6', padding: '4px 10px', border: '1px solid rgba(33,150,243,0.3)', borderRadius: 20 }}>
            🛰 Live Sentinel-2
          </span>
          <button
            onClick={onEnter}
            style={{ background: '#2196F3', color: 'white', padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.25)', borderRadius: 20, padding: '6px 16px', marginBottom: 28, fontSize: 12, color: '#64B5F6' }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#2196F3', display: 'inline-block' }} />
            Real-Time Satellite Intelligence Platform
          </div>
        </motion.div>

        <motion.h1
          className="landing-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontFamily: 'IBM Plex Serif, serif', fontWeight: 800, lineHeight: 1.05, marginBottom: 20 }}
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
          style={{ maxWidth: 560, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40 }}
        >
          OrbitWatch converts open satellite imagery from ISRO Bhuvan and Sentinel-2 into district-level environmental intelligence for governments, NGOs, and citizens.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="landing-cta-btns"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <button
            id="explore-dashboard-btn"
            onClick={onEnter}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #2196F3, #1565C0)',
              color: 'white', padding: '14px 28px', borderRadius: 12,
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(33,150,243,0.35)',
              transition: 'all 0.2s'
            }}
          >
            Explore Dashboard <FiArrowRight size={18} />
          </button>
          <a href="#features" style={{ color: '#64B5F6', fontSize: 15, fontWeight: 500 }}>See Features ↓</a>
        </motion.div>

        {/* Satellite preview mockup — hidden on small mobile */}
        <motion.div
          className="landing-preview"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            marginTop: 60, width: '100%', maxWidth: 860,
            background: 'rgba(10, 37, 64, 0.6)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20,
            padding: '20px', position: 'relative',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(33,150,243,0.08)'
          }}
        >
          {/* Fake browser bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E53935' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FB8C00' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#43A047' }} />
            <div style={{ flex: 1, marginLeft: 12, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', paddingLeft: 12, fontSize: 12, color: '#64748b' }}>
              orbitwatch.gov.in/dashboard
            </div>
          </div>

          {/* Mini dashboard preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, height: 280 }}>
            <div style={{ background: 'rgba(7,26,46,0.7)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Dashboard', 'Water', 'Vegetation', 'Urban Growth', 'Climate'].map((item, i) => (
                <div key={item} style={{ padding: '7px 10px', borderRadius: 8, fontSize: 12, background: i === 0 ? 'rgba(33,150,243,0.2)' : 'transparent', color: i === 0 ? '#2196F3' : '#64748b' }}>{item}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto 1fr', gap: 10 }}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { label: 'Water Bodies', val: '24.5 km²', color: '#2196F3', change: '-14%' },
                  { label: 'Vegetation', val: '142 km²', color: '#43A047', change: '-10%' },
                  { label: 'Built-up Area', val: '89.4 km²', color: '#FB8C00', change: '+22%' },
                  { label: 'Temperature', val: '34.2°C', color: '#E53935', change: '+2.1°C' },
                ].map(c => (
                  <div key={c.label} style={{ background: 'rgba(10,37,64,0.7)', borderRadius: 10, padding: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 9, color: '#64748b', marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.val}</div>
                    <div style={{ fontSize: 9, color: c.change.startsWith('+') ? '#E53935' : '#43A047' }}>{c.change}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(7,26,46,0.7)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 12 }}>
                🗺️ Interactive GIS Map
              </div>
              <div style={{ background: 'rgba(7,26,46,0.7)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 5, padding: 10 }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>✨ AI Insights</div>
                {['⚠ Water declining', '🌳 Forest stabilized', '🏙 Urban expanding'].map(t => (
                  <div key={t} style={{ fontSize: 9, color: '#94a3b8' }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="landing-stats" style={{ display: 'grid', maxWidth: 900, margin: '0 auto' }}>
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Serif, serif', fontSize: 'clamp(28px,6vw,40px)', fontWeight: 800, background: 'linear-gradient(135deg, #2196F3, #43A047)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Features */}
      <section id="features" className="landing-feature-section" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'IBM Plex Serif, serif', fontSize: 'clamp(24px,5vw,36px)', fontWeight: 700, marginBottom: 12 }}>Everything you need to<br />monitor environmental SDGs</h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>From raw pixels to policy-ready insights — automatically.</p>
        </div>
        <div className="landing-features-grid" style={{ display: 'grid', gap: 16 }}>
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card">
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section" style={{ textAlign: 'center' }}>
        <div className="gradient-border" style={{ display: 'inline-block', padding: 'clamp(24px,5vw,40px)', maxWidth: 560, width: '100%' }}>
          <h2 style={{ fontFamily: 'IBM Plex Serif, serif', fontSize: 'clamp(20px,4vw,32px)', fontWeight: 700, marginBottom: 14 }}>Ready to explore your district?</h2>
          <p style={{ color: '#64748b', marginBottom: 28, fontSize: 15 }}>Start with Nagpur, Pune, Wardha, or any district in India.</p>
          <button onClick={onEnter} style={{ background: 'linear-gradient(135deg, #2196F3, #1565C0)', color: 'white', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(33,150,243,0.3)' }}>
            Launch OrbitWatch →
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
