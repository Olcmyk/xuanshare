// 个股八字分析 - 将上市日期视为股票的"生辰"
// @ts-expect-error lunar-javascript 没有类型定义
import { Solar } from 'lunar-javascript';
import type { StockBaZi, WuXing } from '../types';
import type { StockData } from '../data/stocks';
import { TIANGAN_WUXING, DIZHI_WUXING, WUXING_RELATIONS, WUXING_SECTORS } from './mappings';
import { getLunarInfo } from './xuanxue';

// 天干阴阳
const TIANGAN_YINYANG: Record<string, '阳' | '阴'> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

// 天干中文名称
const TIANGAN_NAMES: Record<string, string> = {
  '甲': '甲木', '乙': '乙木', '丙': '丙火', '丁': '丁火', '戊': '戊土',
  '己': '己土', '庚': '庚金', '辛': '辛金', '壬': '壬水', '癸': '癸水'
};

// 计算五行克我者为官星（正官/偏官），我克者为财星（正财/偏财），生我者为印星
function getRelativeStars(dayMasterWuxing: WuXing) {
  const relations = WUXING_RELATIONS;
  // 我克者为财 - day master overcomes this
  const caiXing = relations.overcomes[dayMasterWuxing];
  // 克我者为官 - this overcomes day master
  const guanXing = Object.entries(relations.overcomes).find(
    ([, v]) => v === dayMasterWuxing
  )?.[0] as WuXing;
  // 生我者为印 - this generates day master
  const yinXing = Object.entries(relations.generates).find(
    ([, v]) => v === dayMasterWuxing
  )?.[0] as WuXing;

  return { caiXing, guanXing, yinXing };
}

// 计算八字中的五行强度
function calcBaZiWuxingStrength(
  yearGan: string, yearZhi: string,
  monthGan: string, monthZhi: string,
  dayGan: string, dayZhi: string,
  hourGan: string, hourZhi: string
): Record<WuXing, number> {
  const strength: Record<WuXing, number> = {
    metal: 0, wood: 0, water: 0, fire: 0, earth: 0
  };

  // 各柱天干
  const gans = [yearGan, monthGan, dayGan, hourGan];
  const zhis = [yearZhi, monthZhi, dayZhi, hourZhi];
  const ganWeights = [1, 1.5, 2, 1]; // 日干权重最高
  const zhiWeights = [1, 2, 1.5, 1]; // 月支（月令）权重最高

  gans.forEach((g, i) => {
    if (TIANGAN_WUXING[g]) strength[TIANGAN_WUXING[g]] += ganWeights[i];
  });

  zhis.forEach((z, i) => {
    if (DIZHI_WUXING[z]) strength[DIZHI_WUXING[z]] += zhiWeights[i];
  });

  return strength;
}

// 生成命格描述
function generateMingGe(
  dayMaster: string,
  dayMasterWuxing: WuXing,
  wuxingStrength: Record<WuXing, number>,
  naYin: string
): string {
  const wuxingChinese: Record<WuXing, string> = {
    metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
  };

  const selfStrength = wuxingStrength[dayMasterWuxing];
  const totalStrength = Object.values(wuxingStrength).reduce((a, b) => a + b, 0);
  const ratio = selfStrength / totalStrength;

  const dayMasterName = TIANGAN_NAMES[dayMaster] || dayMaster;
  let desc = `此股以${dayMasterName}为命主，纳音「${naYin}」。`;

  if (ratio > 0.3) {
    desc += `日主${wuxingChinese[dayMasterWuxing]}气旺盛，根基扎实，有独立运行之势。`;
  } else if (ratio > 0.2) {
    desc += `日主${wuxingChinese[dayMasterWuxing]}气中和，运行平稳，随大势而动。`;
  } else {
    desc += `日主${wuxingChinese[dayMasterWuxing]}气偏弱，易受外力影响，波动较大。`;
  }

  return desc;
}

// 判断今日与股票八字的兼容度
function calcTodayCompatibility(
  stockDayMasterWuxing: WuXing,
  stockWuxingStrength: Record<WuXing, number>,
  todayDate: Date = new Date()
): { score: number; trend: 'up' | 'down' | 'stable'; advice: string } {
  const todayInfo = getLunarInfo(todayDate);
  const todayDayGan = todayInfo.dayGanZhi[0];
  const todayDayWuxing = TIANGAN_WUXING[todayDayGan];

  let score = 50; // 基础分
  const adviceParts: string[] = [];

  if (!todayDayWuxing) {
    return { score: 50, trend: 'stable', advice: '今日运势平稳' };
  }

  // 今日天干五行与股票日主的关系
  const relations = WUXING_RELATIONS;

  // 今日生股票 = 利好（印星临）
  if (relations.generates[todayDayWuxing] === stockDayMasterWuxing) {
    score += 20;
    adviceParts.push('今日天干生助命主，如得贵人相助');
  }
  // 股票生今日 = 泄气
  if (relations.generates[stockDayMasterWuxing] === todayDayWuxing) {
    score -= 10;
    adviceParts.push('命主之气外泄，多头动能减弱');
  }
  // 今日克股票 = 官星临，压力
  if (relations.overcomes[todayDayWuxing] === stockDayMasterWuxing) {
    score -= 15;
    adviceParts.push('今日天干克制命主，承受压力');
  }
  // 股票克今日 = 财星动，利好
  if (relations.overcomes[stockDayMasterWuxing] === todayDayWuxing) {
    score += 15;
    adviceParts.push('命主克制今日天干，财星有动');
  }
  // 同五行 = 比肩/劫财
  if (todayDayWuxing === stockDayMasterWuxing) {
    score += 5;
    adviceParts.push('今日与命主同气相求，得比肩之助');
  }

  // 建除影响
  const jianChu = todayInfo.jianChu;
  if (['建', '开', '成'].includes(jianChu)) { score += 10; adviceParts.push(`${jianChu}日利好`); }
  if (['破', '危', '闭'].includes(jianChu)) { score -= 10; adviceParts.push(`${jianChu}日不利`); }

  // 星宿影响
  if (todayInfo.xiuLuck === '吉') { score += 5; }
  if (todayInfo.xiuLuck === '凶') { score -= 5; }

  // 九宫飞星影响
  const nineStar = todayInfo.dayNineStar;
  if ([1, 6, 8].includes(nineStar.index + 1)) { score += 8; }
  if ([2, 5, 7].includes(nineStar.index + 1)) { score -= 8; }

  // 天神吉凶
  if (todayInfo.dayTianShenLuck === '吉') { score += 5; }
  if (todayInfo.dayTianShenLuck === '凶') { score -= 5; }

  // 股票所属五行与今日五行强弱的关系
  const wuxingChinese: Record<WuXing, string> = {
    metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
  };

  // 限制分数范围
  score = Math.max(5, Math.min(95, score));

  const trend: 'up' | 'down' | 'stable' =
    score >= 60 ? 'up' : score <= 40 ? 'down' : 'stable';

  const advice = adviceParts.length > 0
    ? adviceParts.join('；') + '。'
    : `今日${wuxingChinese[stockDayMasterWuxing]}行之股运势平稳。`;

  return { score, trend, advice };
}

// 主函数：分析个股八字
export function analyzeStockFortune(stock: StockData, todayDate: Date = new Date()): StockBaZi {
  // 解析上市日期（使用9:30 AM 巳时作为股票的"出生时辰"）
  const [year, month, day] = stock.listDate.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day, 9, 30, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const solar = Solar.fromDate(birthDate);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lunar = solar.getLunar();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eightChar = lunar.getEightChar();

  // 获取四柱
  const yearPillar = eightChar.getYear() as string;
  const monthPillar = eightChar.getMonth() as string;
  const dayPillar = eightChar.getDay() as string;
  const hourPillar = eightChar.getTime() as string;

  // 获取日主
  const dayMaster = eightChar.getDayGan() as string;
  const dayMasterWuxing = TIANGAN_WUXING[dayMaster] || 'earth';
  const dayMasterYinYang = TIANGAN_YINYANG[dayMaster] || '阳';

  // 获取纳音
  const yearNaYin = eightChar.getYearNaYin() as string;
  const monthNaYin = eightChar.getMonthNaYin() as string;
  const dayNaYin = eightChar.getDayNaYin() as string;
  const hourNaYin = eightChar.getTimeNaYin() as string;

  // 解析天干地支
  const yearGan = yearPillar[0];
  const yearZhi = yearPillar[1];
  const monthGan = monthPillar[0];
  const monthZhi = monthPillar[1];
  const dayGan = dayPillar[0];
  const dayZhi = dayPillar[1];
  const hourGan = hourPillar[0];
  const hourZhi = hourPillar[1];

  // 计算五行强度
  const wuxingStrength = calcBaZiWuxingStrength(
    yearGan, yearZhi, monthGan, monthZhi,
    dayGan, dayZhi, hourGan, hourZhi
  );

  // 获取相关星
  const { caiXing, guanXing, yinXing } = getRelativeStars(dayMasterWuxing);

  // 生成命格描述
  const mingGe = generateMingGe(dayMaster, dayMasterWuxing, wuxingStrength, dayNaYin);

  // 计算今日兼容度
  const today = calcTodayCompatibility(dayMasterWuxing, wuxingStrength, todayDate);

  return {
    code: stock.code,
    name: stock.name,
    listDate: stock.listDate,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    dayMasterWuxing,
    dayMasterYinYang,
    yearNaYin,
    monthNaYin,
    dayNaYin,
    hourNaYin,
    wuxingStrength,
    todayCompatibility: today.score,
    todayAdvice: today.advice,
    todayTrend: today.trend,
    mingGe,
    caiXing,
    guanXing,
    yinXing,
  };
}

// 获取今日最旺股票排行
export function getTodayTopStocks(
  stocks: StockData[],
  todayDate: Date = new Date(),
  limit = 10
): StockBaZi[] {
  const analyzed = stocks.map(s => analyzeStockFortune(s, todayDate));
  analyzed.sort((a, b) => b.todayCompatibility - a.todayCompatibility);
  return analyzed.slice(0, limit);
}

// 获取股票的详细今日运势解读
export function getStockDailyReading(stock: StockData, todayDate: Date = new Date()): string {
  const bazi = analyzeStockFortune(stock, todayDate);
  const todayInfo = getLunarInfo(todayDate);
  const wuxingChinese: Record<WuXing, string> = {
    metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
  };

  const parts: string[] = [];

  parts.push(`【${stock.name}（${stock.code}）今日运势】`);
  parts.push(`此股诞于${stock.listDate}，命主${TIANGAN_NAMES[bazi.dayMaster] || bazi.dayMaster}，${bazi.dayMasterYinYang}${wuxingChinese[bazi.dayMasterWuxing]}命。`);
  parts.push(`日柱纳音「${bazi.dayNaYin}」。`);
  parts.push(`财星属${wuxingChinese[bazi.caiXing]}，官星属${wuxingChinese[bazi.guanXing]}。`);
  parts.push('');
  parts.push(`今日${todayInfo.dayGanZhi}日，${todayInfo.jianChu}日值班。`);
  parts.push(bazi.todayAdvice);
  parts.push('');

  if (bazi.todayCompatibility >= 70) {
    parts.push('综合判断：今日此股气运亨通，宜积极关注。');
  } else if (bazi.todayCompatibility >= 50) {
    parts.push('综合判断：今日此股运势平稳，可伺机而动。');
  } else {
    parts.push('综合判断：今日此股气运低迷，宜观望等待。');
  }

  // 关联板块分析
  const sectorWuxing = stock.wuxing;
  const sectorInfo = WUXING_SECTORS[sectorWuxing];
  parts.push('');
  parts.push(`所属${sectorInfo.chinese}行板块：${sectorInfo.description}`);

  return parts.join('\n');
}
