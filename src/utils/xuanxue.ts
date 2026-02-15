// 玄学计算核心模块
// @ts-expect-error lunar-javascript 没有类型定义
import { Solar } from 'lunar-javascript';
import type { DailyFortune, WuXing, SectorFortune } from '../types';
import {
  JIANCHU_MAPPING,
  XINGXIU_MAPPING,
  SHENSHA_MAPPING,
  JIUGONG_MAPPING,
  WUXING_SECTORS,
  TIANGAN_WUXING,
  DIZHI_WUXING,
  WUXING_RELATIONS
} from './mappings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLunar(date: Date): any {
  return Solar.fromDate(date).getLunar();
}

// 获取当日农历信息
export function getLunarInfo(date: Date = new Date()) {
  const lunar = getLunar(date);
  const nineStar = lunar.getDayNineStar();

  return {
    lunar,
    // 农历日期
    lunarYear: lunar.getYearInChinese() as string,
    lunarMonth: lunar.getMonthInChinese() as string,
    lunarDay: lunar.getDayInChinese() as string,
    // 天干地支
    yearGanZhi: lunar.getYearInGanZhi() as string,
    monthGanZhi: lunar.getMonthInGanZhi() as string,
    dayGanZhi: lunar.getDayInGanZhi() as string,
    hourGanZhi: lunar.getTimeInGanZhi() as string,
    // 建除十二神
    jianChu: lunar.getZhiXing() as string,
    // 二十八星宿
    xingXiu: lunar.getXiu() as string,
    xiuLuck: lunar.getXiuLuck() as string,
    xiuAnimal: lunar.getAnimal() as string,
    xiuGong: lunar.getGong() as string,
    xiuShou: lunar.getShou() as string,
    // 九宫飞星
    dayNineStar: {
      index: nineStar.getIndex() as number,
      number: nineStar.getNumber() as string,
      color: nineStar.getColor() as string,
      wuxing: nineStar.getWuXing() as string,
      name: nineStar.toString() as string,
      position: nineStar.getPositionDesc() as string,
      luckXuanKong: nineStar.getLuckInXuanKong() as string,
    },
    // 天神
    dayTianShen: lunar.getDayTianShen() as string,
    dayTianShenType: lunar.getDayTianShenType() as string,
    dayTianShenLuck: lunar.getDayTianShenLuck() as string,
    // 神煞
    dayJiShen: lunar.getDayJiShen() as string[],
    dayXiongSha: lunar.getDayXiongSha() as string[],
    // 宜忌
    dayYi: lunar.getDayYi() as string[],
    dayJi: lunar.getDayJi() as string[],
    // 节气
    jieQi: lunar.getJieQi() as string,
    // 生肖
    shengXiao: lunar.getYearShengXiao() as string,
    // 纳音
    naYin: lunar.getDayNaYin() as string,
    // 彭祖百忌
    pengZuGan: lunar.getPengZuGan() as string,
    pengZuZhi: lunar.getPengZuZhi() as string,
    // 财位
    caiWei: lunar.getDayPositionCaiDesc() as string,
    xiShen: lunar.getDayPositionXiDesc() as string,
    fuShen: lunar.getDayPositionFuDesc() as string,
    // 冲煞
    chong: lunar.getDayChongDesc() as string,
    sha: lunar.getDaySha() as string,
    // 六曜
    liuYao: lunar.getLiuYao() as string,
    // 月相
    yueXiang: lunar.getYueXiang() as string,
  };
}

// 获取九宫飞星编号 (1-9)
export function calculateJiuGong(date: Date = new Date()): number {
  const lunar = getLunar(date);
  const nineStar = lunar.getDayNineStar();
  return (nineStar.getIndex() as number) + 1;
}

// 计算当日五行强弱
export function calculateWuXingStrength(date: Date = new Date()): Record<WuXing, number> {
  const info = getLunarInfo(date);
  const strength: Record<WuXing, number> = {
    metal: 0, wood: 0, water: 0, fire: 0, earth: 0
  };

  const dayGan = info.dayGanZhi[0];
  const dayZhi = info.dayGanZhi[1];
  const monthGan = info.monthGanZhi[0];
  const monthZhi = info.monthGanZhi[1];

  // 日干五行 +3
  if (TIANGAN_WUXING[dayGan]) strength[TIANGAN_WUXING[dayGan]] += 3;
  // 日支五行 +2
  if (DIZHI_WUXING[dayZhi]) strength[DIZHI_WUXING[dayZhi]] += 2;
  // 月干五行 +2
  if (TIANGAN_WUXING[monthGan]) strength[TIANGAN_WUXING[monthGan]] += 2;
  // 月支五行 +3（月令最重要）
  if (DIZHI_WUXING[monthZhi]) strength[DIZHI_WUXING[monthZhi]] += 3;

  // 星宿五行调整
  const xingXiu = XINGXIU_MAPPING[info.xingXiu];
  if (xingXiu) strength[xingXiu.wuxing] += 2;

  // 九宫飞星五行调整
  const natureMap: Record<string, WuXing> = {
    '金': 'metal', '木': 'wood', '水': 'water', '火': 'fire', '土': 'earth'
  };
  if (natureMap[info.dayNineStar.wuxing]) {
    strength[natureMap[info.dayNineStar.wuxing]] += 1;
  }

  // 归一化到1-5
  const maxS = Math.max(...Object.values(strength));
  const minS = Math.min(...Object.values(strength));
  const range = maxS - minS || 1;
  for (const key of Object.keys(strength) as WuXing[]) {
    strength[key] = Math.round(((strength[key] - minS) / range) * 4) + 1;
  }

  return strength;
}

// 计算板块运势
export function calculateSectorFortune(date: Date = new Date()): Record<WuXing, SectorFortune> {
  const wuxingStrength = calculateWuXingStrength(date);
  const info = getLunarInfo(date);
  const dayGan = info.dayGanZhi[0];
  const dayWuxing = TIANGAN_WUXING[dayGan];

  const result = {} as Record<WuXing, SectorFortune>;

  for (const wuxing of Object.keys(WUXING_SECTORS) as WuXing[]) {
    const sectorInfo = WUXING_SECTORS[wuxing];
    const s = wuxingStrength[wuxing];

    let trend: 'up' | 'down' | 'stable' = 'stable';
    let advice = '';

    if (dayWuxing && WUXING_RELATIONS.generates[dayWuxing] === wuxing) {
      trend = 'up';
      advice = `受日主生助，${sectorInfo.chinese}行板块有上涨动能`;
    } else if (dayWuxing && WUXING_RELATIONS.overcomes[dayWuxing] === wuxing) {
      trend = 'up';
      advice = `为日主财星，${sectorInfo.chinese}行板块有财运`;
    } else if (dayWuxing && WUXING_RELATIONS.overcomes[wuxing] === dayWuxing) {
      trend = 'down';
      advice = `受日主克制，${sectorInfo.chinese}行板块承压`;
    } else {
      trend = s >= 4 ? 'up' : s <= 2 ? 'down' : 'stable';
      advice = s >= 4
        ? `${sectorInfo.chinese}行当令，板块活跃`
        : s <= 2
          ? `${sectorInfo.chinese}行休囚，板块低迷`
          : `${sectorInfo.chinese}行平稳，板块震荡`;
    }

    result[wuxing] = {
      wuxing, trend, strength: s, advice,
      hotSectors: sectorInfo.sectors.slice(0, 3)
    };
  }

  return result;
}

// 获取完整的每日运势
export function getDailyFortune(date: Date = new Date()): DailyFortune {
  const info = getLunarInfo(date);
  const jiuGong = calculateJiuGong(date);
  const sectorFortune = calculateSectorFortune(date);

  // 建除信息
  const jianChuInfo = JIANCHU_MAPPING[info.jianChu] || {
    name: 'unknown', chinese: info.jianChu,
    stockAdvice: '平稳操作', suitable: ['观望'], avoid: ['冒进'],
    description: '宜稳健操作'
  };

  // 星宿信息
  const xingXiuInfo = XINGXIU_MAPPING[info.xingXiu] || {
    name: 'unknown', chinese: info.xingXiu,
    animal: info.xiuAnimal || '未知',
    wuxing: 'earth' as WuXing,
    fortune: (info.xiuLuck === '凶' ? 'inauspicious' : info.xiuLuck === '吉' ? 'auspicious' : 'neutral') as 'auspicious' | 'neutral' | 'inauspicious',
    stockHint: '市场平稳'
  };

  // 解析神煞
  const auspiciousShenSha = info.dayJiShen
    .filter((s: string) => SHENSHA_MAPPING[s])
    .map((s: string) => SHENSHA_MAPPING[s]);
  const inauspiciousShenSha = info.dayXiongSha
    .filter((s: string) => SHENSHA_MAPPING[s])
    .map((s: string) => SHENSHA_MAPPING[s]);

  // 计算整体市场预测
  let bullishScore = 0;
  let bearishScore = 0;

  // 建除影响
  if (['建', '开', '成', '满'].includes(info.jianChu)) bullishScore += 2;
  if (['破', '危', '闭'].includes(info.jianChu)) bearishScore += 2;
  if (['平', '定', '执'].includes(info.jianChu)) bullishScore += 0.5;
  if (['除', '收'].includes(info.jianChu)) bearishScore += 0.5;

  // 星宿影响
  if (xingXiuInfo.fortune === 'auspicious') bullishScore += 1;
  if (xingXiuInfo.fortune === 'inauspicious') bearishScore += 1;

  // 九宫飞星影响
  if ([1, 6, 8].includes(jiuGong)) bullishScore += 1;
  if ([2, 5, 7].includes(jiuGong)) bearishScore += 1;

  // 天神吉凶
  if (info.dayTianShenLuck === '吉') bullishScore += 1;
  if (info.dayTianShenLuck === '凶') bearishScore += 1;

  // 神煞影响
  bullishScore += auspiciousShenSha.length * 0.5;
  bearishScore += inauspiciousShenSha.length * 0.5;

  // 特殊神煞加权
  if (auspiciousShenSha.some(s => ['天德', '月德', '天财', '天喜'].includes(s.chinese))) bullishScore += 1;
  if (info.dayJiShen.some((s: string) => ['天德合', '月德合'].includes(s))) bullishScore += 0.5;
  if (inauspiciousShenSha.some(s => ['大耗', '岁破', '月破'].includes(s.chinese))) bearishScore += 1;

  const totalScore = bullishScore - bearishScore;
  const overall = totalScore > 1 ? 'bullish' : totalScore < -1 ? 'bearish' : 'neutral';
  const confidence = Math.min(Math.abs(totalScore) / 5, 1);

  // 生成建议
  const suitable: string[] = [...jianChuInfo.suitable];
  const avoid: string[] = [...jianChuInfo.avoid];

  const wuxingStrength = calculateWuXingStrength(date);
  const strongestWuxing = (Object.entries(wuxingStrength) as [WuXing, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
  const weakestWuxing = (Object.entries(wuxingStrength) as [WuXing, number][])
    .sort((a, b) => a[1] - b[1])[0][0];

  suitable.push(`关注${WUXING_SECTORS[strongestWuxing].chinese}行板块`);
  avoid.push(`回避${WUXING_SECTORS[weakestWuxing].chinese}行板块`);

  // 生成摘要
  const jiuGongInfo = JIUGONG_MAPPING[jiuGong];
  const summaryParts: string[] = [];
  summaryParts.push(`今日${info.jianChu}日，${jianChuInfo.stockAdvice}。`);
  summaryParts.push(`${info.xingXiu}宿值日，${xingXiuInfo.stockHint}。`);
  if (jiuGongInfo) {
    summaryParts.push(`${jiuGongInfo.name}入中宫，${jiuGongInfo.stockHint}。`);
  }
  if (auspiciousShenSha.length > 0) {
    summaryParts.push(`吉神${auspiciousShenSha.slice(0, 2).map(s => s.chinese).join('、')}临，${auspiciousShenSha[0].stockImpact}。`);
  }
  if (inauspiciousShenSha.length > 0) {
    summaryParts.push(`凶煞${inauspiciousShenSha.slice(0, 2).map(s => s.chinese).join('、')}动，${inauspiciousShenSha[0].stockImpact}。`);
  }

  return {
    date,
    lunar: {
      year: info.lunarYear,
      month: info.lunarMonth,
      day: info.lunarDay,
      yearGanZhi: info.yearGanZhi,
      monthGanZhi: info.monthGanZhi,
      dayGanZhi: info.dayGanZhi
    },
    jianChu: jianChuInfo,
    xingXiu: xingXiuInfo,
    jiuGong,
    shenSha: {
      auspicious: auspiciousShenSha,
      inauspicious: inauspiciousShenSha
    },
    marketForecast: {
      overall, confidence,
      summary: summaryParts.join(''),
      suitable, avoid
    },
    sectorFortune
  };
}

// 获取额外的玄学信息（用于 UI 展示）
export function getExtraInfo(date: Date = new Date()) {
  const info = getLunarInfo(date);
  return {
    tianShen: info.dayTianShen,
    tianShenType: info.dayTianShenType,
    tianShenLuck: info.dayTianShenLuck,
    caiWei: info.caiWei,
    xiShen: info.xiShen,
    fuShen: info.fuShen,
    chong: info.chong,
    sha: info.sha,
    liuYao: info.liuYao,
    yueXiang: info.yueXiang,
    naYin: info.naYin,
    shengXiao: info.shengXiao,
    jieQi: info.jieQi,
    nineStarName: info.dayNineStar.name,
    nineStarLuck: info.dayNineStar.luckXuanKong,
  };
}
