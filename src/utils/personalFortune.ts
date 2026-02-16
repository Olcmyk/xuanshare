// 个人八字与命理投资分析
// @ts-expect-error lunar-javascript 没有类型定义
import { Solar } from 'lunar-javascript';
import type { PersonalBaZi, PersonalFortune, WuXing } from '../types';
import { TIANGAN_WUXING, DIZHI_WUXING, WUXING_RELATIONS, WUXING_SECTORS } from './mappings';

// 天干阴阳
const TIANGAN_YINYANG: Record<string, '阳' | '阴'> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

// 十二时辰对应小时
export const SHICHEN_HOURS: { label: string; value: number; range: string }[] = [
  { label: '子时', value: 23, range: '23:00-01:00' },
  { label: '丑时', value: 1, range: '01:00-03:00' },
  { label: '寅时', value: 3, range: '03:00-05:00' },
  { label: '卯时', value: 5, range: '05:00-07:00' },
  { label: '辰时', value: 7, range: '07:00-09:00' },
  { label: '巳时', value: 9, range: '09:00-11:00' },
  { label: '午时', value: 11, range: '11:00-13:00' },
  { label: '未时', value: 13, range: '13:00-15:00' },
  { label: '申时', value: 15, range: '15:00-17:00' },
  { label: '酉时', value: 17, range: '17:00-19:00' },
  { label: '戌时', value: 19, range: '19:00-21:00' },
  { label: '亥时', value: 21, range: '21:00-23:00' },
];

const WUXING_CHINESE: Record<WuXing, string> = {
  metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
};

const WUXING_COLORS: Record<WuXing, string> = {
  metal: '白色', wood: '绿色', water: '黑色/蓝色', fire: '红色', earth: '黄色'
};

const WUXING_DIRECTIONS: Record<WuXing, string> = {
  metal: '西方', wood: '东方', water: '北方', fire: '南方', earth: '中央'
};

// 十神含义（金融视角）
const SHISHEN_MEANINGS: Record<string, string> = {
  '比肩': '同行竞争，适合跟随大盘',
  '劫财': '竞争激烈，注意资金被分散',
  '食神': '稳定收益，适合长线投资',
  '伤官': '创新求变，适合新兴板块',
  '偏财': '意外之财，短线投机机会',
  '正财': '稳定财源，适合价值投资',
  '七杀': '压力与机遇并存，高风险高回报',
  '正官': '规范运作，关注政策导向',
  '偏印': '另辟蹊径，关注小众板块',
  '正印': '贵人相助，关注机构动向',
  '日主': '',
};

// 计算个人八字
export function calculatePersonalBaZi(
  year: number,
  month: number,
  day: number,
  hour: number, // 0-23
  gender: 'male' | 'female'
): PersonalBaZi {
  const birthDate = new Date(year, month - 1, day, hour, 30, 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const solar = Solar.fromDate(birthDate);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lunar = solar.getLunar();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eightChar = lunar.getEightChar();

  const yearPillar = eightChar.getYear() as string;
  const monthPillar = eightChar.getMonth() as string;
  const dayPillar = eightChar.getDay() as string;
  const hourPillar = eightChar.getTime() as string;

  const dayMaster = eightChar.getDayGan() as string;
  const dayMasterWuxing = TIANGAN_WUXING[dayMaster] || 'earth';
  const dayMasterYinYang = TIANGAN_YINYANG[dayMaster] || '阳';

  const yearNaYin = eightChar.getYearNaYin() as string;
  const monthNaYin = eightChar.getMonthNaYin() as string;
  const dayNaYin = eightChar.getDayNaYin() as string;
  const hourNaYin = eightChar.getTimeNaYin() as string;

  // 十神
  let yearShiShenGan = '';
  let monthShiShenGan = '';
  let timeShiShenGan = '';
  try {
    yearShiShenGan = eightChar.getYearShiShenGan() as string;
    monthShiShenGan = eightChar.getMonthShiShenGan() as string;
    timeShiShenGan = eightChar.getTimeShiShenGan() as string;
  } catch {
    // 部分版本可能不支持
  }

  // 计算五行强度
  const strength: Record<WuXing, number> = {
    metal: 0, wood: 0, water: 0, fire: 0, earth: 0
  };

  const allGans = [yearPillar[0], monthPillar[0], dayPillar[0], hourPillar[0]];
  const allZhis = [yearPillar[1], monthPillar[1], dayPillar[1], hourPillar[1]];
  const ganWeights = [1, 1.5, 2, 1];
  const zhiWeights = [1, 2, 1.5, 1];

  allGans.forEach((g, i) => {
    if (TIANGAN_WUXING[g]) strength[TIANGAN_WUXING[g]] += ganWeights[i];
  });
  allZhis.forEach((z, i) => {
    if (DIZHI_WUXING[z]) strength[DIZHI_WUXING[z]] += zhiWeights[i];
  });

  // 用神：日主弱则用生扶（印星、比肩），日主强则用克泄（财星、食伤）
  const selfStrength = strength[dayMasterWuxing];
  const totalStrength = Object.values(strength).reduce((a, b) => a + b, 0);
  const ratio = selfStrength / totalStrength;

  let yongShen: WuXing;
  if (ratio > 0.3) {
    // 日主偏强，用财星（我克者）或食伤（我生者）泄之
    yongShen = WUXING_RELATIONS.overcomes[dayMasterWuxing]; // 财星
  } else if (ratio < 0.15) {
    // 日主极弱，用印星（生我者）扶之
    const yinEntry = Object.entries(WUXING_RELATIONS.generates).find(
      ([, v]) => v === dayMasterWuxing
    );
    yongShen = (yinEntry?.[0] as WuXing) || dayMasterWuxing;
  } else {
    // 日主中和，用比肩或印星
    yongShen = dayMasterWuxing;
  }

  const caiXing = WUXING_RELATIONS.overcomes[dayMasterWuxing];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void gender; // gender can be used for DaYun direction in future enhancement

  return {
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
    shiShen: {
      yearGan: yearShiShenGan,
      monthGan: monthShiShenGan,
      timeGan: timeShiShenGan,
    },
    wuxingStrength: strength,
    yongShen,
    caiXing,
  };
}

// 综合个人运势分析
export function analyzePersonalFortune(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female'
): PersonalFortune {
  const bazi = calculatePersonalBaZi(year, month, day, hour, gender);
  const today = new Date();

  // 获取今日农历信息
  const todaySolar = Solar.fromDate(today);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const todayLunar = todaySolar.getLunar();
  const todayGanZhi = todayLunar.getDayInGanZhi() as string;
  const todayDayGan = todayGanZhi[0];
  const todayDayWuxing = TIANGAN_WUXING[todayDayGan];

  // 获取今年干支
  const yearGanZhi = todayLunar.getYearInGanZhi() as string;
  const yearGan = yearGanZhi[0];
  const yearWuxing = TIANGAN_WUXING[yearGan] || 'earth';

  // 获取今月干支
  const monthGanZhi = todayLunar.getMonthInGanZhi() as string;
  const monthGan = monthGanZhi[0];
  const monthWuxing = TIANGAN_WUXING[monthGan] || 'earth';

  // 计算综合运势评分
  let overallScore = 50;
  const suitableActions: string[] = [];
  const avoidActions: string[] = [];

  // 流年对日主的影响
  if (yearWuxing === bazi.yongShen) {
    overallScore += 15;
    suitableActions.push('今年流年五行为用神，整体运势向好');
  }
  if (WUXING_RELATIONS.generates[yearWuxing] === bazi.dayMasterWuxing) {
    overallScore += 10;
    suitableActions.push('流年生助日主，贵人运旺');
  }
  if (WUXING_RELATIONS.overcomes[yearWuxing] === bazi.dayMasterWuxing) {
    overallScore -= 10;
    avoidActions.push('流年克制日主，注意健康与决策');
  }

  // 流月对日主的影响
  if (monthWuxing === bazi.yongShen) {
    overallScore += 8;
    suitableActions.push('本月五行利于用神，把握机会');
  }
  if (WUXING_RELATIONS.overcomes[monthWuxing] === bazi.dayMasterWuxing) {
    overallScore -= 5;
    avoidActions.push('本月气场偏紧，谨慎操作');
  }

  // 今日对日主的影响
  if (todayDayWuxing) {
    if (todayDayWuxing === bazi.caiXing) {
      overallScore += 5;
      suitableActions.push('今日财星当值，利于投资');
    }
    if (WUXING_RELATIONS.overcomes[todayDayWuxing] === bazi.dayMasterWuxing) {
      overallScore -= 3;
      avoidActions.push('今日官星压身，低调为宜');
    }
  }

  // 限制范围
  overallScore = Math.max(10, Math.min(95, overallScore));

  // 确定运势等级
  const overallLuck: PersonalFortune['overallLuck'] =
    overallScore >= 80 ? 'great' :
    overallScore >= 65 ? 'good' :
    overallScore >= 45 ? 'neutral' :
    overallScore >= 30 ? 'caution' : 'bad';

  // 财运分析
  let wealthScore = 50;
  const caiXingStrength = bazi.wuxingStrength[bazi.caiXing];
  const totalStrength = Object.values(bazi.wuxingStrength).reduce((a, b) => a + b, 0);
  const caiRatio = caiXingStrength / totalStrength;

  if (caiRatio > 0.25) {
    wealthScore += 20;
  } else if (caiRatio < 0.1) {
    wealthScore -= 15;
  }

  // 流年财星是否被生助
  if (WUXING_RELATIONS.generates[yearWuxing] === bazi.caiXing) {
    wealthScore += 10;
  }
  if (yearWuxing === bazi.caiXing) {
    wealthScore += 15;
  }
  wealthScore = Math.max(10, Math.min(95, wealthScore));

  const wealthLuck = wealthScore >= 70
    ? `今年财星${WUXING_CHINESE[bazi.caiXing]}行得令，财运亨通，正偏财皆有机会`
    : wealthScore >= 50
    ? `财运平稳，${WUXING_CHINESE[bazi.caiXing]}行之财可期，宜稳健理财`
    : `财运偏弱，${WUXING_CHINESE[bazi.caiXing]}行财星受制，不宜冒险投资`;

  // 事业运分析
  let careerScore = 50;
  const guanXing = Object.entries(WUXING_RELATIONS.overcomes).find(
    ([, v]) => v === bazi.dayMasterWuxing
  )?.[0] as WuXing;

  if (guanXing && yearWuxing === guanXing) {
    careerScore += 10;
  }
  if (WUXING_RELATIONS.generates[yearWuxing] === bazi.dayMasterWuxing) {
    careerScore += 15;
  }
  careerScore = Math.max(10, Math.min(95, careerScore));

  const careerLuck = careerScore >= 70
    ? '事业运旺盛，有贵人相助，适合主动出击'
    : careerScore >= 50
    ? '事业运平稳，按部就班，稳中求进'
    : '事业运偏弱，宜韬光养晦，积蓄力量';

  // 投资建议
  const yongShenSectors = WUXING_SECTORS[bazi.yongShen];
  const caiSectors = WUXING_SECTORS[bazi.caiXing];
  const investAdvice = `命主${bazi.dayMasterYinYang}${WUXING_CHINESE[bazi.dayMasterWuxing]}命，用神为${WUXING_CHINESE[bazi.yongShen]}，` +
    `财星属${WUXING_CHINESE[bazi.caiXing]}。` +
    `宜重点关注${yongShenSectors.chinese}行与${caiSectors.chinese}行相关板块，` +
    `如${[...yongShenSectors.sectors.slice(0, 2), ...caiSectors.sectors.slice(0, 2)].join('、')}等。` +
    `投资方位以${WUXING_DIRECTIONS[bazi.yongShen]}和${WUXING_DIRECTIONS[bazi.caiXing]}为佳。`;

  // 有缘板块
  const luckyWuxing = bazi.yongShen;
  const luckySectors = WUXING_SECTORS[luckyWuxing].sectors.slice(0, 5);

  // 有缘股票 - 先返回空数组，由调用方异步加载
  const luckyStocks: { code: string; name: string; compatibility: number; reason: string }[] = [];

  // 默认宜忌
  if (suitableActions.length === 0) {
    suitableActions.push(`关注${WUXING_CHINESE[bazi.yongShen]}行板块`);
  }
  suitableActions.push(`投资方位宜${WUXING_DIRECTIONS[bazi.yongShen]}`);
  suitableActions.push(`幸运色为${WUXING_COLORS[bazi.yongShen]}`);

  if (avoidActions.length === 0) {
    const avoidWuxing = WUXING_RELATIONS.overcomes[bazi.dayMasterWuxing];
    const avoidByWuxing = Object.entries(WUXING_RELATIONS.overcomes).find(
      ([, v]) => v === bazi.yongShen
    )?.[0] as WuXing | undefined;
    if (avoidByWuxing) {
      avoidActions.push(`回避${WUXING_CHINESE[avoidByWuxing]}行克制`);
    }
    avoidActions.push(`忌追高${WUXING_CHINESE[avoidWuxing]}行板块`);
  }

  // 财神方位
  const wealthDirection = WUXING_DIRECTIONS[bazi.caiXing];

  // 幸运数字（基于日主五行）
  const luckyNumberMap: Record<WuXing, number> = {
    wood: 3, fire: 7, earth: 5, metal: 9, water: 1
  };
  const luckyNumber = luckyNumberMap[bazi.yongShen];

  // 幸运颜色
  const luckyColor = WUXING_COLORS[bazi.yongShen];

  // 幸运日（用神五行当值的日子）
  const luckyDayMap: Record<WuXing, string> = {
    wood: '甲、乙日', fire: '丙、丁日', earth: '戊、己日',
    metal: '庚、辛日', water: '壬、癸日'
  };
  const luckyDay = luckyDayMap[bazi.yongShen];

  // 大运（当前流年干支）
  const currentDaYun = yearGanZhi;
  const currentDaYunWuxing = yearWuxing;

  // 流年（当前月干支）
  const currentLiuNian = monthGanZhi;
  const currentLiuNianWuxing = monthWuxing;

  return {
    bazi,
    overallLuck,
    overallScore,
    wealthLuck,
    wealthScore,
    careerLuck,
    careerScore,
    investAdvice,
    luckyWuxing,
    luckySectors,
    luckyStocks,
    suitable: suitableActions,
    avoid: avoidActions,
    wealthDirection,
    luckyNumber,
    luckyColor,
    luckyDay,
    currentDaYun,
    currentDaYunWuxing,
    currentLiuNian,
    currentLiuNianWuxing,
  };
}

// 获取十神含义
export function getShiShenMeaning(shiShen: string): string {
  return SHISHEN_MEANINGS[shiShen] || '';
}

// 获取五行中文名
export function getWuxingChinese(wuxing: WuXing): string {
  return WUXING_CHINESE[wuxing];
}

// 异步获取有缘股票（动态加载股票数据）
export async function getLuckyStocks(
  bazi: PersonalBaZi,
  today: Date = new Date()
): Promise<{ code: string; name: string; compatibility: number; reason: string }[]> {
  const [{ loadAllStocks }, { analyzeStockFortune }] = await Promise.all([
    import('../data/stocks'),
    import('./stockFortune')
  ]);

  const allStocks = await loadAllStocks();
  const luckyStockCandidates = allStocks.filter(
    s => s.wuxing === bazi.yongShen || s.wuxing === bazi.caiXing
  );

  const analyzedStocks = luckyStockCandidates.map(s => {
    const stockBazi = analyzeStockFortune(s, today);
    let compatibility = 50;
    if (stockBazi.dayMasterWuxing === bazi.yongShen) compatibility += 25;
    if (stockBazi.dayMasterWuxing === bazi.caiXing) compatibility += 20;
    if (WUXING_RELATIONS.generates[stockBazi.dayMasterWuxing] === bazi.dayMasterWuxing) compatibility += 15;
    if (stockBazi.todayCompatibility > 60) compatibility += 10;
    compatibility = Math.min(99, compatibility);

    let reason = '';
    if (stockBazi.dayMasterWuxing === bazi.yongShen) {
      reason = `命主${WUXING_CHINESE[stockBazi.dayMasterWuxing]}与您用神相合`;
    } else if (stockBazi.dayMasterWuxing === bazi.caiXing) {
      reason = `命主${WUXING_CHINESE[stockBazi.dayMasterWuxing]}为您的财星`;
    } else {
      reason = `${WUXING_CHINESE[s.wuxing]}行板块与您命格相宜`;
    }

    return { code: s.code, name: s.name, compatibility, reason };
  });

  analyzedStocks.sort((a, b) => b.compatibility - a.compatibility);
  return analyzedStocks.slice(0, 8);
}
