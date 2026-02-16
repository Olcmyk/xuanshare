import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LayoutGroup } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { SectorsPage } from './pages/SectorsPage';
import { PersonalPage } from './pages/PersonalPage';

// 个股页面懒加载（包含大量股票数据）
const StockPage = lazy(() => import('./pages/StockPage').then(m => ({ default: m.StockPage })));

// 个股页面加载中占位 - 保持页面结构一致
function StockPageLoading() {
  return (
    <div className="min-h-screen pt-18 sm:pt-20 pb-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">个股解析</h1>
          <p className="text-sm sm:text-base text-[#F5E6D3]/60">
            以上市日期为生辰，推演个股命理
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-2 border-[#C9A962]/30 border-t-[#C9A962] rounded-full animate-spin mb-4" />
          <p className="text-[#F5E6D3]/60 text-sm">正在加载...</p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C]">
        {!isLanding && <Navigation />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/stocks" element={
            <Suspense fallback={<StockPageLoading />}>
              <StockPage />
            </Suspense>
          } />
          <Route path="/personal" element={<PersonalPage />} />
        </Routes>
      </div>
    </LayoutGroup>
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
