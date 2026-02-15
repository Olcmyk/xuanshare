import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '今日大势', icon: '☯' },
    { path: '/sectors', label: '板块轮动', icon: '☰' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-sm border-b border-[#C9A962]/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">☯</span>
            <span className="text-xl font-bold text-gold-gradient">玄股</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2"
                >
                  <span className={`
                    flex items-center gap-2 text-sm
                    ${isActive ? 'text-[#C9A962]' : 'text-[#F5E6D3]/70 hover:text-[#F5E6D3]'}
                    transition-colors
                  `}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C9A962]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 日期显示 */}
          <div className="text-sm text-[#F5E6D3]/50">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
