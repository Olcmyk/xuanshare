import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { SectorsPage } from './pages/SectorsPage';
import { StockPage } from './pages/StockPage';
import { PersonalPage } from './pages/PersonalPage';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C]">
      {!isLanding && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/sectors" element={<SectorsPage />} />
        <Route path="/stocks" element={<StockPage />} />
        <Route path="/personal" element={<PersonalPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
