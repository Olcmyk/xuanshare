import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AncientCardProps {
  children: ReactNode;
  className?: string;
  glowing?: boolean;
  onClick?: () => void;
}

export function AncientCard({ children, className = '', glowing = false, onClick }: AncientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`
        relative p-6
        bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C]
        border border-[#C9A962]/30
        rounded-lg
        ${glowing ? 'animate-pulse-glow' : ''}
        ${onClick ? 'cursor-pointer hover:border-[#C9A962]/60 transition-colors' : ''}
        ${className}
      `}
    >
      {/* 角落装饰 */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C9A962]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C9A962]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C9A962]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C9A962]" />

      {children}
    </motion.div>
  );
}

interface AncientBadgeProps {
  children: ReactNode;
  type?: 'auspicious' | 'inauspicious' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export function AncientBadge({ children, type = 'neutral', size = 'md' }: AncientBadgeProps) {
  const colorMap = {
    auspicious: 'bg-red-900/30 text-red-400 border-red-700/50',
    inauspicious: 'bg-gray-800/50 text-gray-400 border-gray-600/50',
    neutral: 'bg-[#C9A962]/10 text-[#C9A962] border-[#C9A962]/30'
  };

  const sizeMap = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`
      inline-block rounded border
      ${colorMap[type]}
      ${sizeMap[size]}
    `}>
      {children}
    </span>
  );
}

interface GlowingTextProps {
  children: ReactNode;
  className?: string;
}

export function GlowingText({ children, className = '' }: GlowingTextProps) {
  return (
    <span className={`
      text-gold-gradient
      drop-shadow-[0_0_10px_rgba(201,169,98,0.5)]
      ${className}
    `}>
      {children}
    </span>
  );
}

interface WuXingIconProps {
  wuxing: 'metal' | 'wood' | 'water' | 'fire' | 'earth';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function WuXingIcon({ wuxing, size = 'md', showLabel = false }: WuXingIconProps) {
  const icons = {
    metal: '金',
    wood: '木',
    water: '水',
    fire: '火',
    earth: '土'
  };

  const colors = {
    metal: 'text-gray-300 bg-gray-700/30',
    wood: 'text-green-400 bg-green-900/30',
    water: 'text-blue-400 bg-blue-900/30',
    fire: 'text-red-400 bg-red-900/30',
    earth: 'text-yellow-500 bg-yellow-900/30'
  };

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`
        ${sizes[size]}
        ${colors[wuxing]}
        rounded-full
        flex items-center justify-center
        border border-current/30
        font-bold
      `}>
        {icons[wuxing]}
      </div>
      {showLabel && (
        <span className={`text-xs ${colors[wuxing].split(' ')[0]}`}>
          {icons[wuxing]}行
        </span>
      )}
    </div>
  );
}

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  strength?: number;
}

const STRENGTH_LABELS: Record<number, string> = {
  1: '极弱',
  2: '偏弱',
  3: '中等',
  4: '偏强',
  5: '极强'
};

export function getStrengthLabel(strength: number): string {
  return STRENGTH_LABELS[Math.max(1, Math.min(5, strength))] || '中等';
}

export function TrendIndicator({ trend, strength = 3 }: TrendIndicatorProps) {
  const trendConfig = {
    up: { icon: '↑', color: 'text-red-500', label: '涨' },
    down: { icon: '↓', color: 'text-green-500', label: '跌' },
    stable: { icon: '→', color: 'text-yellow-500', label: '平' }
  };

  const config = trendConfig[trend];
  const strengthLabel = getStrengthLabel(strength);

  return (
    <div className="flex items-center gap-2">
      <span className={`text-lg sm:text-2xl ${config.color}`}>
        {config.icon}
      </span>
      <span className={`text-xs sm:text-sm ${config.color}`}>
        {strengthLabel}
      </span>
    </div>
  );
}

interface BaguaSymbolProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BaguaSymbol({ symbol, size = 'md' }: BaguaSymbolProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <span className={`
      ${sizes[size]}
      text-[#C9A962]
      font-bold
      drop-shadow-[0_0_5px_rgba(201,169,98,0.5)]
    `}>
      {symbol}
    </span>
  );
}
