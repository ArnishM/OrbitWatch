import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WaterPage from './pages/WaterPage';
import VegetationPage from './pages/VegetationPage';
import UrbanPage from './pages/UrbanPage';
import ClimatePage from './pages/ClimatePage';
import TrendsPage from './pages/TrendsPage';
import SettingsPage from './pages/SettingsPage';

function AppInner() {
  const [showLanding, setShowLanding] = useState(true);
  const [district, setDistrict] = useState('Nagpur');
  const [year, setYear] = useState('2024');

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="app-layout"
      >
        <Sidebar />
        <div className="app-main">
          <Topbar district={district} setDistrict={setDistrict} year={year} setYear={setYear} />
          <main className="app-content">
            <Routes>
              <Route path="/"           element={<Dashboard    district={district} year={year} onDistrictChange={setDistrict} />} />
              <Route path="/water"      element={<WaterPage    district={district} year={year} />} />
              <Route path="/vegetation" element={<VegetationPage district={district} year={year} />} />
              <Route path="/urban"      element={<UrbanPage    district={district} year={year} />} />
              <Route path="/climate"    element={<ClimatePage  district={district} year={year} />} />
              <Route path="/trends"     element={<TrendsPage   district={district} year={year} />} />
              <Route path="/settings"   element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </motion.div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
