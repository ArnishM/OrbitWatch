import React from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiDatabase, FiCpu, FiShield } from 'react-icons/fi';

const SettingsPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700 }}>⚙️ Settings</h1>
      <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Configure data sources, pipeline settings and display preferences</p>
    </div>

    {[
      {
        icon: FiGlobe, title: 'Data Sources', color: '#2196F3',
        items: [
          { label: 'Planetary Computer (Sentinel-2)', status: 'Connected', ok: true },
          { label: 'ISRO Bhuvan WMS', status: 'Active Overlay', ok: true },
          { label: 'Google Earth Engine', status: 'Not Configured', ok: false },
        ]
      },
      {
        icon: FiDatabase, title: 'Database (Supabase)', color: '#43A047',
        items: [
          { label: 'PostgreSQL + PostGIS', status: 'Connected', ok: true },
          { label: 'Auto-sync on query', status: 'Enabled', ok: true },
        ]
      },
      {
        icon: FiCpu, title: 'Processing Pipeline', color: '#FB8C00',
        items: [
          { label: 'Cloud Masking (SCL band)', status: 'Enabled', ok: true },
          { label: 'Radiometric Correction', status: 'Enabled', ok: true },
          { label: 'Max Cloud Cover Threshold', status: '10%', ok: true },
        ]
      },
      {
        icon: FiShield, title: 'API Keys', color: '#9C27B0',
        items: [
          { label: 'Planetary Computer Token', status: 'Auto-signed (Free)', ok: true },
          { label: 'Supabase Service Key', status: '••••••••••••', ok: true },
        ]
      },
    ].map((section, i) => {
      const Icon = section.icon;
      return (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${section.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: section.color }}>
              <Icon size={18} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{section.title}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {section.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: item.ok ? '#43A047' : '#E53935', background: item.ok ? 'rgba(67,160,71,0.1)' : 'rgba(229,57,53,0.1)', padding: '2px 10px', borderRadius: 20 }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default SettingsPage;
