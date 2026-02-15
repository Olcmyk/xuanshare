import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { SectorsPage } from './pages/SectorsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C]">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sectors" element={<SectorsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
