import { motion } from 'framer-motion';
import { AncientCard, AncientBadge, TrendIndicator } from '../components/ui/AncientUI';
import { getDailyFortune, getExtraInfo } from '../utils/xuanxue';
import { JIUGONG_MAPPING } from '../utils/mappings';

export function HomePage() {
  const fortune = getDailyFortune();
  const extra = getExtraInfo();
  const jiuGong = fortune.jiuGong;
  const jiuGongInfo = JIUGONG_MAPPING[jiuGong];

  const overallConfig = {
    bullish: { label: '看涨', color: 'text-red-500', bg: 'bg-red-900/20' },
    bearish: { label: '看跌', color: 'text-green-500', bg: 'bg-green-900/20' },
    neutral: { label: '震荡', color: 'text-yellow-500', bg: 'bg-yellow-900/20' }
  };

  const overall = overallConfig[fortune.marketForecast.overall];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold text-gold-gradient">今日大势</h1>
          <p className="text-[#F5E6D3]/60">以天道观股道，顺势而为</p>
        </motion.div>

        {/* 日期信息卡片 */}
        <AncientCard glowing>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-[#F5E6D3]/50 text-sm mb-1">农历</div>
              <div className="text-xl text-[#C9A962]">
                {fortune.lunar.month}月{fortune.lunar.day}
              </div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-sm mb-1">干支日</div>
              <div className="text-xl text-[#C9A962]">
                {fortune.lunar.dayGanZhi}
              </div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-sm mb-1">建除</div>
              <div className="text-xl text-[#C9A962]">
                {fortune.jianChu.chinese}日
              </div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-sm mb-1">星宿</div>
              <div className="text-xl text-[#C9A962]">
                {fortune.xingXiu.chinese}宿
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#C9A962]/20 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[#F5E6D3]/50 text-xs mb-1">年柱</div>
              <div className="text-[#F5E6D3]">{fortune.lunar.yearGanZhi}</div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-xs mb-1">月柱</div>
              <div className="text-[#F5E6D3]">{fortune.lunar.monthGanZhi}</div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-xs mb-1">日柱</div>
              <div className="text-[#F5E6D3]">{fortune.lunar.dayGanZhi}</div>
            </div>
          </div>

          {/* 额外信息行 */}
          <div className="mt-4 pt-4 border-t border-[#C9A962]/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[#F5E6D3]/50 text-xs mb-1">纳音</div>
              <div className="text-sm text-[#F5E6D3]/80">{extra.naYin}</div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-xs mb-1">财神方位</div>
              <div className="text-sm text-[#C9A962]">{extra.caiWei}</div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-xs mb-1">喜神方位</div>
              <div className="text-sm text-red-400">{extra.xiShen}</div>
            </div>
            <div>
              <div className="text-[#F5E6D3]/50 text-xs mb-1">冲煞</div>
              <div className="text-sm text-[#F5E6D3]/80">冲{extra.chong} 煞{extra.sha}</div>
            </div>
          </div>
        </AncientCard>

        {/* 大盘预测 */}
        <AncientCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#C9A962]">大盘预测</h2>
            <div className={`px-4 py-2 rounded-lg ${overall.bg}`}>
              <span className={`text-2xl font-bold ${overall.color}`}>
                {overall.label}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[#F5E6D3]/80 leading-relaxed">
              {fortune.marketForecast.summary}
            </p>

            {/* 置信度 */}
            <div className="flex items-center gap-3">
              <span className="text-[#F5E6D3]/50 text-sm">置信度</span>
              <div className="flex-1 h-2 bg-[#333] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fortune.marketForecast.confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#C9A962] to-[#FFD700]"
                />
              </div>
              <span className="text-[#C9A962] text-sm">
                {Math.round(fortune.marketForecast.confidence * 100)}%
              </span>
            </div>
          </div>
        </AncientCard>

        {/* 宜忌 */}
        <div className="grid md:grid-cols-2 gap-6">
          <AncientCard>
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>宜</span>
              <span className="text-sm text-[#F5E6D3]/50">适合操作</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {fortune.marketForecast.suitable.map((item, i) => (
                <AncientBadge key={i} type="auspicious">{item}</AncientBadge>
              ))}
            </div>
          </AncientCard>

          <AncientCard>
            <h3 className="text-lg font-bold text-gray-400 mb-4 flex items-center gap-2">
              <span>忌</span>
              <span className="text-sm text-[#F5E6D3]/50">避免操作</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {fortune.marketForecast.avoid.map((item, i) => (
                <AncientBadge key={i} type="inauspicious">{item}</AncientBadge>
              ))}
            </div>
          </AncientCard>
        </div>

        {/* 玄学要素详解 */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 建除 */}
          <AncientCard>
            <div className="text-center">
              <div className="text-4xl text-[#C9A962] mb-2">
                {fortune.jianChu.chinese}
              </div>
              <div className="text-sm text-[#F5E6D3]/50 mb-3">建除十二神</div>
              <p className="text-sm text-[#F5E6D3]/70">
                {fortune.jianChu.description}
              </p>
              <div className="mt-3 pt-3 border-t border-[#C9A962]/20">
                <span className="text-[#C9A962]">{fortune.jianChu.stockAdvice}</span>
              </div>
            </div>
          </AncientCard>

          {/* 星宿 */}
          <AncientCard>
            <div className="text-center">
              <div className="text-4xl text-[#C9A962] mb-2">
                {fortune.xingXiu.chinese}
              </div>
              <div className="text-sm text-[#F5E6D3]/50 mb-3">
                二十八星宿 · {fortune.xingXiu.animal}
              </div>
              <p className="text-sm text-[#F5E6D3]/70">
                {fortune.xingXiu.stockHint}
              </p>
              <div className="mt-3 pt-3 border-t border-[#C9A962]/20">
                <AncientBadge
                  type={fortune.xingXiu.fortune === 'auspicious' ? 'auspicious' :
                        fortune.xingXiu.fortune === 'inauspicious' ? 'inauspicious' : 'neutral'}
                >
                  {fortune.xingXiu.fortune === 'auspicious' ? '吉' :
                   fortune.xingXiu.fortune === 'inauspicious' ? '凶' : '平'}
                </AncientBadge>
              </div>
            </div>
          </AncientCard>

          {/* 九宫飞星 */}
          <AncientCard>
            <div className="text-center">
              <div className="text-4xl text-[#C9A962] mb-2">
                {extra.nineStarName.charAt(0)}
              </div>
              <div className="text-sm text-[#F5E6D3]/50 mb-3">
                九宫飞星 · {extra.nineStarName}
              </div>
              <p className="text-sm text-[#F5E6D3]/70">
                {jiuGongInfo ? jiuGongInfo.stockHint : `玄空${extra.nineStarLuck}`}
              </p>
              <div className="mt-3 pt-3 border-t border-[#C9A962]/20">
                <span className="text-[#F5E6D3]/50 text-xs">
                  玄空 {extra.nineStarLuck}
                </span>
              </div>
            </div>
          </AncientCard>
        </div>

        {/* 天神与方位 */}
        <AncientCard>
          <h3 className="text-lg font-bold text-[#C9A962] mb-4">天神与方位</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <div className="text-[#F5E6D3]/50 text-xs mb-1">值日天神</div>
              <div className="text-lg text-[#C9A962]">{extra.tianShen}</div>
              <div className={`text-xs mt-1 ${extra.tianShenLuck === '吉' ? 'text-red-400' : extra.tianShenLuck === '凶' ? 'text-gray-400' : 'text-yellow-500'}`}>
                {extra.tianShenType} · {extra.tianShenLuck}
              </div>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <div className="text-[#F5E6D3]/50 text-xs mb-1">财神方位</div>
              <div className="text-lg text-[#C9A962]">{extra.caiWei}</div>
              <div className="text-xs mt-1 text-[#F5E6D3]/40">利于投资方向</div>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <div className="text-[#F5E6D3]/50 text-xs mb-1">喜神方位</div>
              <div className="text-lg text-red-400">{extra.xiShen}</div>
              <div className="text-xs mt-1 text-[#F5E6D3]/40">利于开市交易</div>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <div className="text-[#F5E6D3]/50 text-xs mb-1">福神方位</div>
              <div className="text-lg text-green-400">{extra.fuShen}</div>
              <div className="text-xs mt-1 text-[#F5E6D3]/40">利于稳健持仓</div>
            </div>
          </div>
        </AncientCard>

        {/* 神煞 */}
        <AncientCard>
          <h3 className="text-lg font-bold text-[#C9A962] mb-4">今日神煞</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-red-400 mb-3 flex items-center gap-2">
                <span>☆</span>
                <span>吉神方位</span>
              </div>
              {fortune.shenSha.auspicious.length > 0 ? (
                <div className="space-y-2">
                  {fortune.shenSha.auspicious.slice(0, 4).map((shensha, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-red-400 text-sm shrink-0">{shensha.chinese}</span>
                      <span className="text-[#F5E6D3]/60 text-sm">{shensha.stockImpact}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#F5E6D3]/50 text-sm">今日无特殊吉神</p>
              )}
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <span>★</span>
                <span>凶煞警示</span>
              </div>
              {fortune.shenSha.inauspicious.length > 0 ? (
                <div className="space-y-2">
                  {fortune.shenSha.inauspicious.slice(0, 4).map((shensha, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-gray-400 text-sm shrink-0">{shensha.chinese}</span>
                      <span className="text-[#F5E6D3]/60 text-sm">{shensha.stockImpact}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#F5E6D3]/50 text-sm">今日无特殊凶煞</p>
              )}
            </div>
          </div>
        </AncientCard>

        {/* 五行板块速览 */}
        <AncientCard>
          <h3 className="text-lg font-bold text-[#C9A962] mb-4">五行板块速览</h3>
          <div className="grid grid-cols-5 gap-4">
            {(Object.keys(fortune.sectorFortune) as Array<keyof typeof fortune.sectorFortune>).map(wuxing => {
              const sector = fortune.sectorFortune[wuxing];
              const colors: Record<string, string> = {
                metal: '#C0C0C0', wood: '#228B22', water: '#4169E1',
                fire: '#DC143C', earth: '#DAA520'
              };
              const labels: Record<string, string> = {
                metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
              };

              return (
                <div key={wuxing} className="text-center">
                  <div
                    className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-2"
                    style={{
                      backgroundColor: `${colors[wuxing]}20`,
                      color: colors[wuxing],
                      border: `1px solid ${colors[wuxing]}50`
                    }}
                  >
                    {labels[wuxing]}
                  </div>
                  <TrendIndicator trend={sector.trend} strength={sector.strength} />
                </div>
              );
            })}
          </div>
        </AncientCard>

        {/* 免责声明 */}
        <div className="text-center text-[#F5E6D3]/30 text-xs">
          <p>本站内容仅供娱乐参考，不构成任何投资建议</p>
          <p>股市有风险，投资需谨慎</p>
        </div>
      </div>
    </div>
  );
}
