import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AncientCard, AncientBadge, WuXingIcon } from '../components/ui/AncientUI';
import { analyzePersonalFortune, SHICHEN_HOURS, getWuxingChinese } from '../utils/personalFortune';
import { WUXING_SECTORS, WUXING_RELATIONS } from '../utils/mappings';
import type { PersonalFortune, WuXing } from '../types';

const WUXING_COLOR_MAP: Record<WuXing, string> = {
  metal: '#C0C0C0', wood: '#228B22', water: '#4169E1', fire: '#DC143C', earth: '#DAA520'
};

const LUCK_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  great: { label: '大吉', color: 'text-red-400', emoji: '&#9734;' },
  good: { label: '小吉', color: 'text-orange-400', emoji: '&#9733;' },
  neutral: { label: '平', color: 'text-yellow-400', emoji: '&#9674;' },
  caution: { label: '小凶', color: 'text-blue-400', emoji: '&#9670;' },
  bad: { label: '凶', color: 'text-gray-400', emoji: '&#9679;' },
};

export function PersonalPage() {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('9'); // 默认巳时
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<PersonalFortune | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAnalyze = () => {
    const y = parseInt(birthYear);
    const m = parseInt(birthMonth);
    const d = parseInt(birthDay);
    const h = parseInt(birthHour);

    if (!y || !m || !d || y < 1900 || y > 2030 || m < 1 || m > 12 || d < 1 || d > 31) {
      return;
    }

    setIsCalculating(true);
    // 模拟计算延迟以显示动画
    setTimeout(() => {
      const fortune = analyzePersonalFortune(y, m, d, h, gender);
      setResult(fortune);
      setIsCalculating(false);
    }, 800);
  };

  const canSubmit = birthYear && birthMonth && birthDay &&
    parseInt(birthYear) >= 1900 && parseInt(birthYear) <= 2030;

  return (
    <div className="min-h-screen pt-18 sm:pt-20 pb-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">命理投资</h1>
          <p className="text-sm sm:text-base text-[#F5E6D3]/60">
            以生辰八字推演财运，寻找与您命格相合的投资方向
          </p>
        </motion.div>

        {/* 输入表单 */}
        <AncientCard className="mb-6">
          <h2 className="text-lg font-bold text-[#C9A962] mb-4 text-center">请输入您的生辰信息</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {/* 年 */}
            <div>
              <label className="block text-xs text-[#F5E6D3]/50 mb-1">出生年份</label>
              <input
                type="number"
                placeholder="如 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                min={1900}
                max={2030}
                className="w-full bg-[#1A1A1A] border border-[#C9A962]/30 rounded-lg px-3 py-2 text-[#F5E6D3] placeholder-[#F5E6D3]/30 focus:outline-none focus:border-[#C9A962]/60 text-sm"
              />
            </div>
            {/* 月 */}
            <div>
              <label className="block text-xs text-[#F5E6D3]/50 mb-1">出生月份</label>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#C9A962]/30 rounded-lg px-3 py-2 text-[#F5E6D3] focus:outline-none focus:border-[#C9A962]/60 text-sm"
              >
                <option value="">请选择</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}月</option>
                ))}
              </select>
            </div>
            {/* 日 */}
            <div>
              <label className="block text-xs text-[#F5E6D3]/50 mb-1">出生日期</label>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#C9A962]/30 rounded-lg px-3 py-2 text-[#F5E6D3] focus:outline-none focus:border-[#C9A962]/60 text-sm"
              >
                <option value="">请选择</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}日</option>
                ))}
              </select>
            </div>
            {/* 时辰 */}
            <div>
              <label className="block text-xs text-[#F5E6D3]/50 mb-1">出生时辰</label>
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#C9A962]/30 rounded-lg px-3 py-2 text-[#F5E6D3] focus:outline-none focus:border-[#C9A962]/60 text-sm"
              >
                {SHICHEN_HOURS.map(sh => (
                  <option key={sh.value} value={sh.value}>
                    {sh.label}（{sh.range}）
                  </option>
                ))}
              </select>
            </div>
            {/* 性别 */}
            <div>
              <label className="block text-xs text-[#F5E6D3]/50 mb-1">性别</label>
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                    gender === 'male'
                      ? 'bg-[#C9A962]/20 border-[#C9A962] text-[#C9A962]'
                      : 'border-[#C9A962]/20 text-[#F5E6D3]/50'
                  }`}
                >
                  乾（男）
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                    gender === 'female'
                      ? 'bg-[#C9A962]/20 border-[#C9A962] text-[#C9A962]'
                      : 'border-[#C9A962]/20 text-[#F5E6D3]/50'
                  }`}
                >
                  坤（女）
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#F5E6D3]/30 mb-4 text-center">
            时辰影响时柱的推算，直接关系到命局中的偏财与投机运。不知时辰可选「巳时」作为默认。
          </p>

          <button
            onClick={handleAnalyze}
            disabled={!canSubmit || isCalculating}
            className={`w-full py-3 rounded-lg text-base font-bold transition-all ${
              canSubmit && !isCalculating
                ? 'bg-gradient-to-r from-[#C9A962] to-[#FFD700] text-[#1A1A1A] hover:shadow-[0_0_20px_rgba(201,169,98,0.5)]'
                : 'bg-[#333] text-[#F5E6D3]/30 cursor-not-allowed'
            }`}
          >
            {isCalculating ? '卜算中...' : '开始推演'}
          </button>
        </AncientCard>

        {/* 计算动画 */}
        <AnimatePresence>
          {isCalculating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <motion.div
                className="text-6xl text-[#C9A962] mb-4 inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                &#9776;
              </motion.div>
              <p className="text-[#C9A962] text-sm">天机推演中，请稍候...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 分析结果 */}
        <AnimatePresence mode="wait">
          {result && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* 总览卡片 */}
              <AncientCard glowing>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#C9A962]">命理总览</h2>
                    <p className="text-xs text-[#F5E6D3]/50 mt-1">
                      {birthYear}年{birthMonth}月{birthDay}日 {SHICHEN_HOURS.find(s => s.value === parseInt(birthHour))?.label}
                      · {gender === 'male' ? '乾造' : '坤造'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${LUCK_CONFIG[result.overallLuck].color}`}
                      dangerouslySetInnerHTML={{ __html: LUCK_CONFIG[result.overallLuck].emoji }}
                    />
                    <div className={`text-sm font-bold ${LUCK_CONFIG[result.overallLuck].color}`}>
                      {LUCK_CONFIG[result.overallLuck].label}
                    </div>
                    <div className="text-xs text-[#F5E6D3]/40 mt-0.5">
                      近期运势 {result.overallScore}分
                    </div>
                  </div>
                </div>

                {/* 运势条 */}
                <div className="space-y-3">
                  {[
                    { label: '综合运势', score: result.overallScore, color: '#C9A962' },
                    { label: '财运', score: result.wealthScore, color: '#DC143C' },
                    { label: '事业运', score: result.careerScore, color: '#4169E1' },
                  ].map(({ label, score, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-[#F5E6D3]/50 w-16 shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs text-[#F5E6D3]/50 w-8 text-right">{score}</span>
                    </div>
                  ))}
                </div>
              </AncientCard>

              {/* 四柱八字 */}
              <AncientCard>
                <h3 className="text-base font-bold text-[#C9A962] mb-4">四柱八字</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: '年柱', pillar: result.bazi.yearPillar, nayin: result.bazi.yearNaYin },
                    { label: '月柱', pillar: result.bazi.monthPillar, nayin: result.bazi.monthNaYin },
                    { label: '日柱', pillar: result.bazi.dayPillar, nayin: result.bazi.dayNaYin },
                    { label: '时柱', pillar: result.bazi.hourPillar, nayin: result.bazi.hourNaYin },
                  ].map(({ label, pillar, nayin }) => {
                    const gan = pillar[0];
                    const zhi = pillar[1];
                    const ganWx = ({'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'} as Record<string, WuXing>)[gan] || 'earth';
                    const zhiWx = ({'寅':'wood','卯':'wood','巳':'fire','午':'fire','辰':'earth','戌':'earth','丑':'earth','未':'earth','申':'metal','酉':'metal','亥':'water','子':'water'} as Record<string, WuXing>)[zhi] || 'earth';
                    return (
                      <div key={label} className="text-center p-3 bg-[#1A1A1A] rounded-lg">
                        <div className="text-xs text-[#F5E6D3]/50 mb-2">{label}</div>
                        <div className="space-y-1">
                          <div className="text-xl font-bold" style={{ color: WUXING_COLOR_MAP[ganWx] }}>
                            {gan}
                          </div>
                          <div className="text-xl font-bold" style={{ color: WUXING_COLOR_MAP[zhiWx] }}>
                            {zhi}
                          </div>
                        </div>
                        <div className="text-xs text-[#F5E6D3]/40 mt-2">{nayin}</div>
                      </div>
                    );
                  })}
                </div>

                {/* 十神 */}
                <div className="mt-4 pt-4 border-t border-[#C9A962]/20">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-xs text-[#F5E6D3]/40 mb-1">年柱十神</div>
                      <div className="text-sm text-[#C9A962]">
                        {result.bazi.shiShen.yearGan || '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#F5E6D3]/40 mb-1">月柱十神</div>
                      <div className="text-sm text-[#C9A962]">
                        {result.bazi.shiShen.monthGan || '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#F5E6D3]/40 mb-1">日柱</div>
                      <div className="text-sm text-[#C9A962]">日主</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#F5E6D3]/40 mb-1">时柱十神</div>
                      <div className="text-sm text-[#C9A962]">
                        {result.bazi.shiShen.timeGan || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </AncientCard>

              {/* 日主与用神分析 */}
              <AncientCard>
                <h3 className="text-base font-bold text-[#C9A962] mb-4">日主与用神</h3>
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-[#1A1A1A] rounded-lg text-center">
                    <div className="text-xs text-[#F5E6D3]/50 mb-2">日主</div>
                    <div className="text-3xl font-bold mb-1" style={{
                      color: WUXING_COLOR_MAP[result.bazi.dayMasterWuxing]
                    }}>
                      {result.bazi.dayMaster}
                    </div>
                    <div className="text-xs text-[#F5E6D3]/60">
                      {result.bazi.dayMasterYinYang}{getWuxingChinese(result.bazi.dayMasterWuxing)}命
                    </div>
                  </div>
                  <div className="p-4 bg-[#1A1A1A] rounded-lg text-center">
                    <div className="text-xs text-[#F5E6D3]/50 mb-2">用神</div>
                    <WuXingIcon wuxing={result.bazi.yongShen} size="lg" />
                    <div className="text-xs text-[#F5E6D3]/60 mt-1">
                      {getWuxingChinese(result.bazi.yongShen)}行
                    </div>
                  </div>
                  <div className="p-4 bg-[#1A1A1A] rounded-lg text-center">
                    <div className="text-xs text-[#F5E6D3]/50 mb-2">财星</div>
                    <WuXingIcon wuxing={result.bazi.caiXing} size="lg" />
                    <div className="text-xs text-[#F5E6D3]/60 mt-1">
                      {getWuxingChinese(result.bazi.caiXing)}行
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#F5E6D3]/70 leading-relaxed">
                  日主{result.bazi.dayMasterYinYang}{getWuxingChinese(result.bazi.dayMasterWuxing)}，
                  用神为{getWuxingChinese(result.bazi.yongShen)}行。
                  {result.bazi.yongShen === result.bazi.caiXing
                    ? '用神即财星，天生有偏财运，适合投资理财。'
                    : `财星属${getWuxingChinese(result.bazi.caiXing)}，需${getWuxingChinese(result.bazi.yongShen)}行辅助方可聚财。`
                  }
                </p>
              </AncientCard>

              {/* 五行力量 */}
              <AncientCard>
                <h3 className="text-base font-bold text-[#C9A962] mb-4">五行力量分布</h3>
                <div className="space-y-3">
                  {(Object.entries(result.bazi.wuxingStrength) as [WuXing, number][]).map(([wx, val]) => {
                    const maxVal = Math.max(...Object.values(result.bazi.wuxingStrength));
                    return (
                      <div key={wx} className="flex items-center gap-3">
                        <WuXingIcon wuxing={wx} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs" style={{ color: WUXING_COLOR_MAP[wx] }}>
                              {getWuxingChinese(wx)}行
                              {wx === result.bazi.dayMasterWuxing && <span className="text-[#C9A962] ml-1">(日主)</span>}
                              {wx === result.bazi.yongShen && <span className="text-red-400 ml-1">(用神)</span>}
                              {wx === result.bazi.caiXing && <span className="text-yellow-400 ml-1">(财星)</span>}
                            </span>
                            <span className="text-xs text-[#F5E6D3]/50">{val.toFixed(1)}</span>
                          </div>
                          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(val / maxVal) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: WUXING_COLOR_MAP[wx] }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AncientCard>

              {/* 财运与事业运 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <AncientCard>
                  <h3 className="text-base font-bold text-red-400 mb-3">财运分析</h3>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#F5E6D3]/50">财运指数</span>
                      <span className="text-sm text-red-400 font-bold">{result.wealthScore}/100</span>
                    </div>
                    <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.wealthScore}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#DC143C] to-[#FF6347]"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-[#F5E6D3]/70">{result.wealthLuck}</p>
                </AncientCard>

                <AncientCard>
                  <h3 className="text-base font-bold text-blue-400 mb-3">事业运分析</h3>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#F5E6D3]/50">事业指数</span>
                      <span className="text-sm text-blue-400 font-bold">{result.careerScore}/100</span>
                    </div>
                    <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.careerScore}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#4169E1] to-[#6495ED]"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-[#F5E6D3]/70">{result.careerLuck}</p>
                </AncientCard>
              </div>

              {/* 投资建议 */}
              <AncientCard>
                <h3 className="text-base font-bold text-[#C9A962] mb-3">投资方向建议</h3>
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed mb-4">
                  {result.investAdvice}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#1A1A1A] rounded-lg">
                    <div className="text-xs text-[#F5E6D3]/50 mb-2">有缘板块（{getWuxingChinese(result.luckyWuxing)}行）</div>
                    <div className="flex flex-wrap gap-2">
                      {result.luckySectors.map((s, i) => (
                        <AncientBadge key={i} type="auspicious" size="sm">{s}</AncientBadge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-[#1A1A1A] rounded-lg">
                    <div className="text-xs text-[#F5E6D3]/50 mb-2">规避板块（{getWuxingChinese(
                      WUXING_RELATIONS.overcomes[
                        Object.entries(WUXING_RELATIONS.overcomes).find(
                          ([, v]) => v === result.bazi.yongShen
                        )?.[0] as WuXing || 'earth'
                      ]
                    )}行）</div>
                    <div className="flex flex-wrap gap-2">
                      {WUXING_SECTORS[
                        WUXING_RELATIONS.overcomes[
                          Object.entries(WUXING_RELATIONS.overcomes).find(
                            ([, v]) => v === result.bazi.yongShen
                          )?.[0] as WuXing || 'earth'
                        ]
                      ].sectors.slice(0, 5).map((s, i) => (
                        <AncientBadge key={i} type="inauspicious" size="sm">{s}</AncientBadge>
                      ))}
                    </div>
                  </div>
                </div>
              </AncientCard>

              {/* 有缘股票 */}
              <AncientCard>
                <h3 className="text-base font-bold text-[#C9A962] mb-4">与您有缘的股票</h3>
                <div className="space-y-2">
                  {result.luckyStocks.map((stock, i) => (
                    <div key={stock.code} className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg">
                      <span className="text-[#C9A962] text-sm w-5 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#F5E6D3]">{stock.name}</div>
                        <div className="text-xs text-[#F5E6D3]/40">{stock.code} · {stock.reason}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        stock.compatibility >= 80 ? 'bg-red-900/20 text-red-400' :
                        stock.compatibility >= 60 ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-[#C9A962]/10 text-[#C9A962]'
                      }`}>
                        缘分 {stock.compatibility}%
                      </div>
                    </div>
                  ))}
                </div>
              </AncientCard>

              {/* 宜忌与幸运信息 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <AncientCard>
                  <h3 className="text-base font-bold text-red-400 mb-3">近期宜</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.suitable.map((s, i) => (
                      <AncientBadge key={i} type="auspicious" size="sm">{s}</AncientBadge>
                    ))}
                  </div>
                </AncientCard>
                <AncientCard>
                  <h3 className="text-base font-bold text-gray-400 mb-3">近期忌</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.avoid.map((s, i) => (
                      <AncientBadge key={i} type="inauspicious" size="sm">{s}</AncientBadge>
                    ))}
                  </div>
                </AncientCard>
              </div>

              {/* 幸运信息 */}
              <AncientCard>
                <h3 className="text-base font-bold text-[#C9A962] mb-4">幸运指引</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                    <div className="text-xs text-[#F5E6D3]/50 mb-1">财神方位</div>
                    <div className="text-lg text-[#C9A962] font-bold">{result.wealthDirection}</div>
                  </div>
                  <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                    <div className="text-xs text-[#F5E6D3]/50 mb-1">幸运数字</div>
                    <div className="text-lg text-[#C9A962] font-bold">{result.luckyNumber}</div>
                  </div>
                  <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                    <div className="text-xs text-[#F5E6D3]/50 mb-1">幸运颜色</div>
                    <div className="text-lg text-[#C9A962] font-bold">{result.luckyColor}</div>
                  </div>
                  <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                    <div className="text-xs text-[#F5E6D3]/50 mb-1">宜操盘日</div>
                    <div className="text-lg text-[#C9A962] font-bold">{result.luckyDay}</div>
                  </div>
                </div>
              </AncientCard>

              {/* 流年流月 */}
              <AncientCard>
                <h3 className="text-base font-bold text-[#C9A962] mb-4">当前气运</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1A1A1A] rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <WuXingIcon wuxing={result.currentDaYunWuxing} size="sm" />
                      <div>
                        <div className="text-xs text-[#F5E6D3]/50">流年干支</div>
                        <div className="text-lg text-[#C9A962] font-bold">{result.currentDaYun}</div>
                      </div>
                    </div>
                    <p className="text-xs text-[#F5E6D3]/60">
                      今年流年{getWuxingChinese(result.currentDaYunWuxing)}行当令，
                      {result.currentDaYunWuxing === result.bazi.yongShen
                        ? '与用神相合，运势向好。'
                        : result.currentDaYunWuxing === result.bazi.caiXing
                        ? '财星临位，利于求财。'
                        : `宜${getWuxingChinese(result.bazi.yongShen)}行化解。`
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-[#1A1A1A] rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <WuXingIcon wuxing={result.currentLiuNianWuxing} size="sm" />
                      <div>
                        <div className="text-xs text-[#F5E6D3]/50">流月干支</div>
                        <div className="text-lg text-[#C9A962] font-bold">{result.currentLiuNian}</div>
                      </div>
                    </div>
                    <p className="text-xs text-[#F5E6D3]/60">
                      本月{getWuxingChinese(result.currentLiuNianWuxing)}行主事，
                      {result.currentLiuNianWuxing === result.bazi.yongShen
                        ? '月令助用，把握机会。'
                        : `关注${getWuxingChinese(result.bazi.yongShen)}行板块的变化。`
                      }
                    </p>
                  </div>
                </div>
              </AncientCard>

              {/* 免责声明 */}
              <div className="text-center text-[#F5E6D3]/30 text-xs space-y-1 pb-2">
                <p>本站内容仅供娱乐参考，不构成任何投资建议</p>
                <p>股市有风险，投资需谨慎</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
