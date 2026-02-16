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

// 个股八字分析
export interface StockBaZi {
  code: string;
  name: string;
  listDate: string;
  // 四柱
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  // 日主
  dayMaster: string;
  dayMasterWuxing: WuXing;
  dayMasterYinYang: '阳' | '阴';
  // 纳音
  yearNaYin: string;
  monthNaYin: string;
  dayNaYin: string;
  hourNaYin: string;
  // 五行强弱
  wuxingStrength: Record<WuXing, number>;
  // 今日分析
  todayCompatibility: number; // 0-100
  todayAdvice: string;
  todayTrend: 'up' | 'down' | 'stable';
  // 详细信息
  mingGe: string; // 命格描述
  caiXing: WuXing; // 财星五行
  guanXing: WuXing; // 官星五行
  yinXing: WuXing; // 印星五行
}

// 个人八字信息
export interface PersonalBaZi {
  // 四柱
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  // 日主
  dayMaster: string;
  dayMasterWuxing: WuXing;
  dayMasterYinYang: '阳' | '阴';
  // 纳音
  yearNaYin: string;
  monthNaYin: string;
  dayNaYin: string;
  hourNaYin: string;
  // 十神
  shiShen: {
    yearGan: string;
    monthGan: string;
    timeGan: string;
  };
  // 五行强弱
  wuxingStrength: Record<WuXing, number>;
  // 用神
  yongShen: WuXing;
  // 财星
  caiXing: WuXing;
}

// 个人运势分析结果
export interface PersonalFortune {
  bazi: PersonalBaZi;
  // 运势分析
  overallLuck: 'great' | 'good' | 'neutral' | 'caution' | 'bad';
  overallScore: number; // 0-100
  // 财运
  wealthLuck: string;
  wealthScore: number;
  // 事业运
  careerLuck: string;
  careerScore: number;
  // 投资建议
  investAdvice: string;
  // 有缘板块
  luckyWuxing: WuXing;
  luckySectors: string[];
  // 有缘股票
  luckyStocks: { code: string; name: string; compatibility: number; reason: string }[];
  // 近期宜忌
  suitable: string[];
  avoid: string[];
  // 财神方位
  wealthDirection: string;
  // 幸运信息
  luckyNumber: number;
  luckyColor: string;
  luckyDay: string;
  // 大运信息
  currentDaYun: string;
  currentDaYunWuxing: WuXing;
  // 流年信息
  currentLiuNian: string;
  currentLiuNianWuxing: WuXing;
}
