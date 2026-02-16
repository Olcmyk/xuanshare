import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useLayoutEffect, useEffect } from 'react';

export function Navigation() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isReady, setIsReady] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  // 缓存每个导航项的位置
  const [cachedPositions, setCachedPositions] = useState<{ left: number; width: number }[]>([]);

  const navItems = [
    { path: '/dashboard', label: '今日大势', icon: '☯' },
    { path: '/sectors', label: '板块轮动', icon: '☰' },
    { path: '/stocks', label: '个股解析', icon: '卦' },
    { path: '/personal', label: '命理投资', icon: '命' },
  ];

  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

  // 首次测量所有导航项的位置并缓存
  useLayoutEffect(() => {
    const measureAll = () => {
      if (!navRef.current || hasMeasured) return;

      const navRect = navRef.current.getBoundingClientRect();
      const positions: { left: number; width: number }[] = [];

      linkRefs.current.forEach((link) => {
        if (link) {
          const linkRect = link.getBoundingClientRect();
          positions.push({
            left: linkRect.left - navRect.left,
            width: linkRect.width,
          });
        }
      });

      if (positions.length === navItems.length) {
        setCachedPositions(positions);
        setHasMeasured(true);
      }
    };

    // 使用 requestAnimationFrame 确保 DOM 已渲染
    requestAnimationFrame(measureAll);
  }, [hasMeasured, navItems.length]);

  // 当 activeIndex 变化时，立即使用缓存的位置更新指示器
  useEffect(() => {
    if (activeIndex !== -1 && cachedPositions[activeIndex]) {
      setIndicatorStyle(cachedPositions[activeIndex]);
      if (!isReady) {
        requestAnimationFrame(() => setIsReady(true));
      }
    }
  }, [activeIndex, cachedPositions, isReady]);

  // 窗口大小变化时重新测量
  useEffect(() => {
    const handleResize = () => {
      setHasMeasured(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-sm border-b border-[#C9A962]/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl sm:text-2xl">☯</span>
            <span className="text-lg sm:text-xl font-bold text-gold-gradient">玄股</span>
          </Link>

          {/* Nav Links */}
          <div ref={navRef} className="relative flex items-center gap-3 sm:gap-6 ml-4 sm:ml-8">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  ref={(el) => { linkRefs.current[index] = el; }}
                  className="relative py-2 shrink-0"
                >
                  <span className={`
                    flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm whitespace-nowrap
                    ${isActive ? 'text-[#C9A962]' : 'text-[#F5E6D3]/70 hover:text-[#F5E6D3]'}
                    transition-colors
                  `}>
                    <span className="hidden sm:inline">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}

            {/* 滑动指示器 */}
            {activeIndex !== -1 && (
              <motion.div
                className="absolute bottom-0 h-0.5 bg-[#C9A962]"
                initial={false}
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                transition={isReady ? { type: 'spring', stiffness: 500, damping: 30 } : { duration: 0 }}
              />
            )}
          </div>

          {/* 日期显示 */}
          <div className="text-xs sm:text-sm text-[#F5E6D3]/50 hidden md:block shrink-0 ml-auto">
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
