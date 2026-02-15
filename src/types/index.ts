// 玄学与股市映射类型定义

export type WuXing = 'metal' | 'wood' | 'water' | 'fire' | 'earth';

export interface WuXingInfo {
  name: string;
  chinese: string;
  color: string;
  direction: string;
  sectors: string[];
  description: string;
}

export interface JianChuInfo {
  name: string;
  chinese: string;
  stockAdvice: string;
  suitable: string[];
  avoid: string[];
  description: string;
}

export interface XingXiuInfo {
  name: string;
  chinese: string;
  animal: string;
  wuxing: WuXing;
  fortune: 'auspicious' | 'neutral' | 'inauspicious';
  stockHint: string;
}

export interface ShenShaInfo {
  name: string;
  chinese: string;
  type: 'auspicious' | 'inauspicious';
  stockImpact: string;
}

export interface DailyFortune {
  date: Date;
  lunar: {
    year: string;
    month: string;
    day: string;
    yearGanZhi: string;
    monthGanZhi: string;
    dayGanZhi: string;
  };
  jianChu: JianChuInfo;
  xingXiu: XingXiuInfo;
  jiuGong: number;
  shenSha: {
    auspicious: ShenShaInfo[];
    inauspicious: ShenShaInfo[];
  };
  marketForecast: {
    overall: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    summary: string;
    suitable: string[];
    avoid: string[];
  };
  sectorFortune: Record<WuXing, SectorFortune>;
}

export interface SectorFortune {
  wuxing: WuXing;
  trend: 'up' | 'down' | 'stable';
  strength: number; // 1-5
  advice: string;
  hotSectors: string[];
}
