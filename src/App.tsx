import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { SectorsPage } from './pages/SectorsPage';
import { PersonalPage } from './pages/PersonalPage';

// 个股页面懒加载（包含大量股票数据）
const StockPage = lazy(() => import('./pages/StockPage').then(m => ({ default: m.StockPage })));

// 加载中占位
function PageLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-2 border-[#C9A962]/30 border-t-[#C9A962] rounded-full animate-spin mb-4" />
      <p className="text-[#F5E6D3]/60 text-sm">正在加载...</p>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C]">
      {!isLanding && <Navigation />}
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/stocks" element={<StockPage />} />
          <Route path="/personal" element={<PersonalPage />} />
        </Routes>
      </Suspense>
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
