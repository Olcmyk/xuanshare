import { motion } from 'framer-motion';
import type { WuXing } from '../types';
import { WUXING_SECTORS } from '../utils/mappings';

interface LuopanProps {
  sectorFortune: Record<WuXing, {
    wuxing: WuXing;
    trend: 'up' | 'down' | 'stable';
    strength: number;
    advice: string;
    hotSectors: string[];
  }>;
  onSectorClick?: (wuxing: WuXing) => void;
  selectedWuxing?: WuXing | null;
}

export function Luopan({ sectorFortune, onSectorClick, selectedWuxing }: LuopanProps) {
  // 五行方位配置（按照传统罗盘方位）
  const positions: Record<WuXing, { angle: number; label: string }> = {
    fire: { angle: 0, label: '南' },      // 南方 - 火
    wood: { angle: 90, label: '东' },     // 东方 - 木
    water: { angle: 180, label: '北' },   // 北方 - 水
    metal: { angle: 270, label: '西' },   // 西方 - 金
    earth: { angle: 135, label: '中' }    // 中央 - 土（放在东南方向显示）
  };

  const wuxingColors: Record<WuXing, string> = {
    metal: '#C0C0C0',
    wood: '#228B22',
    water: '#4169E1',
    fire: '#DC143C',
    earth: '#DAA520'
  };

  const trendIcons: Record<string, string> = {
    up: '↑',
    down: '↓',
    stable: '→'
  };

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
      {/* 外圈装饰 */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#C9A962]/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        {/* 刻度线 */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 w-px h-4 bg-[#C9A962]/50 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${i * 15}deg)`,
              transformOrigin: '50% 300px'
            }}
          />
        ))}
      </motion.div>

      {/* 中圈 */}
      <div className="absolute inset-[10%] rounded-full border border-[#C9A962]/20 bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C]">
        {/* 八卦符号装饰 */}
        {['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-[#C9A962]/40 text-lg"
            style={{
              top: `${50 - 40 * Math.cos((i * 45 * Math.PI) / 180)}%`,
              left: `${50 + 40 * Math.sin((i * 45 * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* 内圈 - 太极图案 */}
      <div className="absolute inset-[30%] rounded-full border border-[#C9A962]/30 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full bg-[#F5E6D3]/10" />
          <div className="w-1/2 h-full bg-[#1A1A1A]" />
        </div>
        <div className="absolute top-0 left-1/2 w-1/2 h-1/2 -translate-x-1/2 rounded-full bg-[#F5E6D3]/10" />
        <div className="absolute bottom-0 left-1/2 w-1/2 h-1/2 -translate-x-1/2 rounded-full bg-[#1A1A1A]" />
        <div className="absolute top-[25%] left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-[#1A1A1A]" />
        <div className="absolute bottom-[25%] left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-[#F5E6D3]/20" />
      </div>

      {/* 五行板块 */}
      {(Object.keys(positions) as WuXing[]).map((wuxing) => {
        const pos = positions[wuxing];
        const fortune = sectorFortune[wuxing];
        const isSelected = selectedWuxing === wuxing;
        const radius = wuxing === 'earth' ? 0 : 38; // 土在中央

        // 计算位置
        const x = wuxing === 'earth' ? 50 : 50 + radius * Math.sin((pos.angle * Math.PI) / 180);
        const y = wuxing === 'earth' ? 50 : 50 - radius * Math.cos((pos.angle * Math.PI) / 180);

        return (
          <motion.div
            key={wuxing}
            className={`
              absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2
              rounded-full cursor-pointer
              flex flex-col items-center justify-center
              border-2 transition-all duration-300
              ${isSelected ? 'scale-110 z-10' : 'hover:scale-105'}
            `}
            style={{
              top: `${y}%`,
              left: `${x}%`,
              backgroundColor: `${wuxingColors[wuxing]}20`,
              borderColor: isSelected ? wuxingColors[wuxing] : `${wuxingColors[wuxing]}50`,
              boxShadow: isSelected ? `0 0 20px ${wuxingColors[wuxing]}50` : 'none'
            }}
            onClick={() => onSectorClick?.(wuxing)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: wuxingColors[wuxing] }}
            >
              {WUXING_SECTORS[wuxing].chinese}
            </span>
            <span
              className="text-lg"
              style={{
                color: fortune.trend === 'up' ? '#DC143C' :
                       fortune.trend === 'down' ? '#228B22' : '#DAA520'
              }}
            >
              {trendIcons[fortune.trend]}
            </span>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: i <= fortune.strength
                      ? wuxingColors[wuxing]
                      : '#333'
                  }}
                />
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* 方位标签 */}
      {[
        { label: '南', angle: 0 },
        { label: '东', angle: 90 },
        { label: '北', angle: 180 },
        { label: '西', angle: 270 }
      ].map(({ label, angle }) => (
        <div
          key={label}
          className="absolute text-[#C9A962]/60 text-sm font-bold"
          style={{
            top: `${50 - 48 * Math.cos((angle * Math.PI) / 180)}%`,
            left: `${50 + 48 * Math.sin((angle * Math.PI) / 180)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
