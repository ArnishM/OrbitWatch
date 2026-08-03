import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiDroplet, FiActivity, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { TbTree, TbBuildingSkyscraper } from 'react-icons/tb';
import { MdOutlineThermostat, MdOutlineSatelliteAlt } from 'react-icons/md';

const navItems = [
  { name: 'Dashboard',        icon: FiGrid,               path: '/',           color: '#2196F3' },
  { name: 'Water',            icon: FiDroplet,            path: '/water',      color: '#00BCD4' },
  { name: 'Vegetation',       icon: TbTree,               path: '/vegetation', color: '#43A047' },
  { name: 'Urban Growth',     icon: TbBuildingSkyscraper, path: '/urban',      color: '#FB8C00' },
  { name: 'Climate',          icon: MdOutlineThermostat,  path: '/climate',    color: '#E53935' },
  { name: 'Historical Trends',icon: FiActivity,           path: '/trends',     color: '#9C27B0' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 230 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
      style={{
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0, position: 'relative', zIndex: 20,
        height: '100vh', overflow: 'visible',
        transition: 'background 0.3s ease'
      }}
    >
      {/* Inner clip container so content doesn't overflow but button can */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRight: 'none' }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? '18px 14px' : '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', minHeight: 64 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #2196F3, #43A047)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MdOutlineSatelliteAlt size={19} color="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{ fontFamily: 'IBM Plex Serif, serif', fontWeight: 700, fontSize: 16, lineHeight: 1.2, color: 'var(--text-primary)' }}>OrbitWatch</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1, fontWeight: 400 }}>SDG Intelligence Platform</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? '12px 10px' : '12px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.name} to={item.path} title={collapsed ? item.name : ''}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px' : '9px 12px',
                  borderRadius: 9, textDecoration: 'none',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? `${item.color}18` : 'transparent',
                  color: isActive ? item.color : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? `${item.color}30` : 'transparent'}`,
                  transition: 'all 0.18s ease',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* Data source badge */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ background: 'rgba(33,150,243,0.07)', border: '1px solid rgba(33,150,243,0.15)', borderRadius: 8, padding: '7px 10px', fontSize: 10.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <div style={{ color: '#2196F3', fontWeight: 600, marginBottom: 1 }}>🛰 Data Sources</div>
                ISRO Bhuvan · Sentinel-2 · Planetary Computer
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle — sits outside inner container so overflow:visible shows it */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute', top: 22, right: -13,
          width: 26, height: 26, borderRadius: '50%',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 40,
        }}>
        {collapsed ? <FiChevronRight size={13} /> : <FiChevronLeft size={13} />}
      </motion.button>
    </motion.div>
  );
};


export default Sidebar;
