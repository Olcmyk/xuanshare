import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getLunarInfo } from '../utils/xuanxue';

// 生成随机星星
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));
}

const STARS = generateStars(200);
const STARS_DIM = generateStars(100);

// 星座连线（简化的北斗七星）
const BEI_DOU = [
  { x: 35, y: 25 }, { x: 38, y: 22 }, { x: 42, y: 20 },
  { x: 46, y: 22 }, { x: 45, y: 27 }, { x: 42, y: 30 }, { x: 39, y: 28 },
];

// 功能卡片数据
const FEATURES = [
  {
    path: '/dashboard',
    icon: '☯',
    title: '今日大势',
    subtitle: '大盘走势预测',
    desc: '综合建除十二神、二十八星宿、九宫飞星等古法，推演今日大盘走势与板块强弱。',
    color: '#C9A962',
  },
  {
    path: '/sectors',
    icon: '☰',
    title: '板块轮动',
    subtitle: '五行板块分析',
    desc: '以五行生克为脉络，洞察金木水火土五大板块的轮动规律与当日气运。',
    color: '#DC143C',
  },
  {
    path: '/stocks',
    icon: '卦',
    title: '个股解析',
    subtitle: '个股命理推演',
    desc: '以上市日期为生辰，推算个股四柱八字、五行旺衰，判断今日运势吉凶。',
    color: '#4169E1',
  },
  {
    path: '/personal',
    icon: '命',
    title: '命理投资',
    subtitle: '个人运势诊断',
    desc: '输入生辰八字，分析您的财运命格，找到与您命数相合的投资方向与有缘股票。',
    color: '#228B22',
  },
];

const ADVANTAGES = [
  { icon: '天', title: '天人合一', desc: '将千年玄学智慧与现代金融分析融会贯通' },
  { icon: '数', title: '象数理占', desc: '运用八字、星宿、九宫、建除等多维度推演' },
  { icon: '时', title: '因时制宜', desc: '每日实时推演，顺应天时地利的变化节奏' },
  { icon: '缘', title: '人股有缘', desc: '以命理匹配法，寻找与您八字相合的股票' },
];

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const [lunarDate, setLunarDate] = useState('');

  useEffect(() => {
    try {
      const info = getLunarInfo();
      setLunarDate(`${info.lunarMonth}月${info.lunarDay} ${info.yearGanZhi}年`);
    } catch {
      // 静默处理
    }
  }, []);

  // 流星
  const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);

  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      setShootingStars(prev => [
        ...prev.slice(-3),
        {
          id: counter,
          x: Math.random() * 60 + 20,
          y: Math.random() * 30 + 5,
          angle: Math.random() * 30 + 15,
        }
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* === HERO 全屏星空 === */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* 星空背景 */}
        <div className="absolute inset-0 bg-[#0a0a14]">
          {/* 星云效果 */}
          <div className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(ellipse at 20% 50%, rgba(100, 50, 150, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 30%, rgba(50, 80, 150, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 80%, rgba(150, 100, 50, 0.08) 0%, transparent 50%)
              `
            }}
          />

          {/* 远景星星（慢） */}
          {STARS_DIM.map(star => (
            <div
              key={`dim-${star.id}`}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * 0.6}px`,
                height: `${star.size * 0.6}px`,
                backgroundColor: '#fff',
                opacity: star.opacity * 0.3,
                animation: `twinkle ${star.duration + 3}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}

          {/* 近景星星（亮） */}
          {STARS.map(star => (
            <div
              key={`star-${star.id}`}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.size > 2 ? '#FFE4B5' : '#fff',
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                boxShadow: star.size > 2 ? `0 0 ${star.size * 2}px rgba(255, 228, 181, 0.3)` : 'none',
              }}
            />
          ))}

          {/* 北斗七星连线 */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={BEI_DOU.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#C9A962"
              strokeWidth="0.1"
              strokeDasharray="0.5 0.3"
            />
            {BEI_DOU.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="0.3" fill="#C9A962" opacity="0.6" />
            ))}
          </svg>

          {/* 流星 */}
          {shootingStars.map(star => (
            <motion.div
              key={star.id}
              className="absolute w-px h-px"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, x: 200, y: 200 * Math.tan(star.angle * Math.PI / 180) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div
                className="h-px origin-left"
                style={{
                  width: '80px',
                  background: 'linear-gradient(90deg, rgba(201,169,98,0.8), transparent)',
                  transform: `rotate(${star.angle}deg)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* 中央内容 */}
        <div className="relative z-10 text-center px-4">
          {/* 装饰性八卦环 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full border border-[#C9A962]/10 flex items-center justify-center">
              {['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'].map((sym, i) => (
                <span
                  key={i}
                  className="absolute text-[#C9A962]/15 text-2xl"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-200px) rotate(-${i * 45}deg)`,
                  }}
                >
                  {sym}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <h1 className="text-6xl sm:text-8xl font-bold text-gold-gradient text-ancient mb-4 tracking-wider">
              玄股
            </h1>
            <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-[#C9A962] to-transparent mb-4" />
            <p className="text-lg sm:text-xl text-[#F5E6D3]/60 mb-2">
              以天道观股道
            </p>
            <p className="text-sm text-[#F5E6D3]/30">
              {lunarDate && `农历${lunarDate}`}
            </p>
          </motion.div>

          {/* 进入按钮 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 rounded-full border border-[#C9A962]/50 text-[#C9A962] text-sm hover:bg-[#C9A962]/10 hover:border-[#C9A962] transition-all hover:shadow-[0_0_30px_rgba(201,169,98,0.3)]"
            >
              观天机
            </Link>
          </motion.div>
        </div>

        {/* 底部滚动提示 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-[#C9A962]/40 text-xs mb-2">向下探索</div>
          <div className="w-5 h-8 rounded-full border border-[#C9A962]/30 mx-auto flex justify-center">
            <motion.div
              className="w-1 h-2 bg-[#C9A962]/50 rounded-full mt-1.5"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* === 优势展示 === */}
      <section className="relative py-20 sm:py-28 px-4 bg-gradient-to-b from-[#0a0a14] via-[#1A1A1A] to-[#1A1A1A]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">古法今用</h2>
            <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-[#C9A962] to-transparent mb-4" />
            <p className="text-sm text-[#F5E6D3]/50 max-w-lg mx-auto">
              融合易经八卦、四柱八字、紫微斗数、奇门遁甲等千年智慧，
              以独特视角解读A股市场的天时地利
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {ADVANTAGES.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full border border-[#C9A962]/30 flex items-center justify-center mb-3 group-hover:border-[#C9A962]/60 group-hover:shadow-[0_0_20px_rgba(201,169,98,0.2)] transition-all">
                  <span className="text-2xl sm:text-3xl text-[#C9A962] text-ancient">{adv.icon}</span>
                </div>
                <h3 className="text-sm sm:text-base text-[#C9A962] font-bold mb-1">{adv.title}</h3>
                <p className="text-xs text-[#F5E6D3]/40 leading-relaxed">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 功能介绍 === */}
      <section className="relative py-20 sm:py-28 px-4 bg-[#1A1A1A]">
        {/* 装饰性背景图案 */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23C9A962' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3">四大法门</h2>
            <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-[#C9A962] to-transparent mb-4" />
            <p className="text-sm text-[#F5E6D3]/50">多维度解读市场，助您洞察先机</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={feat.path} className="block group">
                  <div className="relative p-6 bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C] border border-[#C9A962]/20 rounded-lg overflow-hidden hover:border-[#C9A962]/50 transition-all hover:shadow-[0_0_30px_rgba(201,169,98,0.15)]">
                    {/* 角落装饰 */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: feat.color }} />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: feat.color }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: feat.color }} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: feat.color }} />

                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 border"
                        style={{
                          borderColor: `${feat.color}50`,
                          backgroundColor: `${feat.color}15`,
                          color: feat.color,
                        }}
                      >
                        {feat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold" style={{ color: feat.color }}>
                            {feat.title}
                          </h3>
                          <span className="text-xs text-[#F5E6D3]/30">{feat.subtitle}</span>
                        </div>
                        <p className="text-sm text-[#F5E6D3]/60 leading-relaxed">{feat.desc}</p>
                        <div className="mt-3 text-xs text-[#C9A962]/60 group-hover:text-[#C9A962] transition-colors flex items-center gap-1">
                          <span>进入探索</span>
                          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 底部 === */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#1A1A1A] to-[#0a0a14]">
        <div className="max-w-4xl mx-auto text-center">
          {/* 太极图 */}
          <motion.div
            className="w-16 h-16 mx-auto mb-6 opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#C9A962" strokeWidth="1" />
              <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 0 50 50 A24 24 0 0 1 50 2" fill="#C9A962" opacity="0.3" />
              <circle cx="50" cy="26" r="6" fill="#0a0a14" />
              <circle cx="50" cy="74" r="6" fill="#C9A962" opacity="0.3" />
            </svg>
          </motion.div>

          <p className="text-sm text-[#F5E6D3]/30 mb-2">
            天行有常，顺势而为
          </p>
          <p className="text-xs text-[#F5E6D3]/20 mb-6">
            本站内容仅供娱乐参考，不构成任何投资建议 · 股市有风险，投资需谨慎
          </p>
          <p>
            <a
              href="https://github.com/Olcmyk/xuanshare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#F5E6D3]/20 hover:text-[#C9A962] transition-colors text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
