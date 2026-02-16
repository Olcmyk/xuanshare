import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AncientCard, AncientBadge, TrendIndicator, WuXingIcon } from '../components/ui/AncientUI';
import { WUXING_SECTORS, WUXING_RELATIONS, TIANGAN_WUXING, DIZHI_WUXING } from '../utils/mappings';
import { loadBatch, loadAllStocks, searchStocks, TOTAL_STOCK_COUNT, type StockData } from '../data/stocks';
import type { StockBaZi, WuXing } from '../types';

const WUXING_COLOR_MAP: Record<WuXing, string> = {
  metal: '#C0C0C0', wood: '#228B22', water: '#4169E1', fire: '#DC143C', earth: '#DAA520'
};

const WUXING_CHINESE: Record<string, string> = {
  metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
};

export function StockPage() {
  const [query, setQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [analysis, setAnalysis] = useState<StockBaZi | null>(null);
  const [filterWuxing, setFilterWuxing] = useState<WuXing | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(50);
  const listRef = useRef<HTMLDivElement>(null);

  // 分批加载的数据
  const [loadedStocks, setLoadedStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analyzeFunc, setAnalyzeFunc] = useState<((s: StockData) => StockBaZi) | null>(null);
  const [topStocks, setTopStocks] = useState<any[]>([]);

  // 初始加载：只加载第一批（1000只，按代码排序）
  useEffect(() => {
    let mounted = true;

    async function init() {
      const [fortuneModule, firstBatch] = await Promise.all([
        import('../utils/stockFortune'),
        loadBatch(0)
      ]);

      if (!mounted) return;
      setAnalyzeFunc(() => fortuneModule.analyzeStockFortune);
      setLoadedStocks(firstBatch);
      setIsLoading(false);

      // 计算今日旺股（用第一批数据）
      const tops = fortuneModule.getTodayTopStocks(firstBatch, new Date(), 5);
      setTopStocks(tops);

      // 后台继续加载剩余批次
      for (let i = 1; i <= 5; i++) {
        const batch = await loadBatch(i);
        if (!mounted) return;
        setLoadedStocks(prev => [...prev, ...batch]);
      }
    }

    init();
    return () => { mounted = false; };
  }, []);

  // 搜索时确保加载全部数据
  useEffect(() => {
    if (query && loadedStocks.length < TOTAL_STOCK_COUNT) {
      loadAllStocks().then(setLoadedStocks);
    }
  }, [query, loadedStocks.length]);

  // 搜索结果
  const filteredStocks = useMemo(() => {
    let stocks = query ? searchStocks(loadedStocks, query) : loadedStocks;
    if (filterWuxing !== 'all') {
      stocks = stocks.filter(s => s.wuxing === filterWuxing);
    }
    return stocks;
  }, [query, filterWuxing, loadedStocks]);

  // 当筛选条件变化时重置显示数量
  useEffect(() => {
    setVisibleCount(50);
  }, [query, filterWuxing]);

  // 滚动加载更多显示
  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setVisibleCount(prev => Math.min(prev + 50, filteredStocks.length));
    }
  }, [filteredStocks.length]);

  const handleSelectStock = (stock: StockData) => {
    if (!analyzeFunc) return;
    setSelectedStock(stock);
    const result = analyzeFunc(stock);
    setAnalysis(result);
  };

  const maxStrength = analysis
    ? Math.max(...Object.values(analysis.wuxingStrength))
    : 1;

  return (
    <div className="min-h-screen pt-18 sm:pt-20 pb-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 - 不使用动画，避免加载时跳动 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2">个股解析</h1>
          <p className="text-sm sm:text-base text-[#F5E6D3]/60">
            以上市日期为生辰，推演个股命理
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* 左侧 - 股票列表 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 搜索栏 */}
            <AncientCard className="!p-4">
              <input
                type="text"
                placeholder="搜索股票代码、名称或行业..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#C9A962]/30 rounded-lg px-4 py-2.5 text-[#F5E6D3] placeholder-[#F5E6D3]/30 focus:outline-none focus:border-[#C9A962]/60 text-sm"
                disabled={isLoading}
              />
              {/* 五行筛选 */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => setFilterWuxing('all')}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded text-xs border transition-colors ${
                    filterWuxing === 'all'
                      ? 'bg-[#C9A962]/20 border-[#C9A962] text-[#C9A962]'
                      : 'border-[#C9A962]/20 text-[#F5E6D3]/50 hover:text-[#F5E6D3]'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  全部
                </button>
                {(['metal', 'wood', 'water', 'fire', 'earth'] as WuXing[]).map(wx => (
                  <button
                    key={wx}
                    onClick={() => setFilterWuxing(wx)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded text-xs border transition-colors ${
                      filterWuxing === wx
                        ? 'border-current'
                        : 'border-[#C9A962]/20 hover:border-current'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ color: WUXING_COLOR_MAP[wx] }}
                  >
                    {WUXING_CHINESE[wx]}行
                  </button>
                ))}
              </div>
            </AncientCard>

            {/* 加载状态 */}
            {isLoading ? (
              <AncientCard className="!p-4">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-2 border-[#C9A962]/30 border-t-[#C9A962] rounded-full animate-spin mb-3" />
                  <p className="text-[#F5E6D3]/60 text-sm">正在加载股票数据...</p>
                </div>
              </AncientCard>
            ) : (
            <>
            {/* 今日旺股 */}
            {!query && filterWuxing === 'all' && topStocks.length > 0 && (
              <AncientCard className="!p-4">
                <h3 className="text-sm font-bold text-[#C9A962] mb-3 flex items-center gap-2">
                  <span className="text-red-400">&#9733;</span>
                  今日旺股
                </h3>
                <div className="space-y-2">
                  {topStocks.map((s, i) => (
                    <div
                      key={s.code}
                      className="flex items-center gap-3 p-2 rounded-lg bg-[#1A1A1A] cursor-pointer hover:bg-[#252525] transition-colors"
                      onClick={() => {
                        const stock = loadedStocks.find((st: StockData) => st.code === s.code);
                        if (stock) handleSelectStock(stock);
                      }}
                    >
                      <span className="text-[#C9A962] text-sm w-5">{i + 1}</span>
                      <span className="text-[#F5E6D3] text-sm flex-1">{s.name}</span>
                      <span className="text-[#F5E6D3]/50 text-xs">{s.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        s.todayCompatibility >= 60 ? 'bg-red-900/20 text-red-400' :
                        s.todayCompatibility >= 40 ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-green-900/20 text-green-400'
                      }`}>
                        {s.todayCompatibility}分
                      </span>
                    </div>
                  ))}
                </div>
              </AncientCard>
            )}

            {/* 股票列表 */}
            <AncientCard className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#C9A962]">
                  A股列表 ({TOTAL_STOCK_COUNT})
                </h3>
              </div>
              <div
                ref={listRef}
                onScroll={handleScroll}
                className="space-y-1 max-h-[300px] sm:max-h-[500px] overflow-y-auto pr-1"
              >
                {filteredStocks.slice(0, visibleCount).map(stock => (
                  <div
                    key={stock.code}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      selectedStock?.code === stock.code
                        ? 'bg-[#C9A962]/10 border border-[#C9A962]/30'
                        : 'hover:bg-[#1A1A1A]'
                    }`}
                    onClick={() => handleSelectStock(stock)}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: `${WUXING_COLOR_MAP[stock.wuxing]}20`,
                        color: WUXING_COLOR_MAP[stock.wuxing],
                      }}
                    >
                      {WUXING_CHINESE[stock.wuxing]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#F5E6D3] truncate">{stock.name}</div>
                      <div className="text-xs text-[#F5E6D3]/40">{stock.code} · {stock.sector}</div>
                    </div>
                    <div className="text-xs text-[#F5E6D3]/30 shrink-0">{stock.listDate}</div>
                  </div>
                ))}
              </div>
            </AncientCard>
            </>
            )}
          </div>

          {/* 右侧 - 分析详情 */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              {analysis && selectedStock ? (
                <motion.div
                  key={analysis.code}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* 股票命盘 */}
                  <AncientCard glowing>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#C9A962]">
                          {analysis.name}
                        </h2>
                        <p className="text-sm text-[#F5E6D3]/50 mt-1">
                          {analysis.code} · 上市日期：{analysis.listDate}
                        </p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-center ${
                        analysis.todayTrend === 'up' ? 'bg-red-900/20' :
                        analysis.todayTrend === 'down' ? 'bg-green-900/20' :
                        'bg-yellow-900/20'
                      }`}>
                        <div className="text-2xl font-bold" style={{
                          color: analysis.todayTrend === 'up' ? '#DC143C' :
                                 analysis.todayTrend === 'down' ? '#228B22' : '#DAA520'
                        }}>
                          {analysis.todayCompatibility}
                        </div>
                        <div className="text-xs text-[#F5E6D3]/50">今日运势</div>
                      </div>
                    </div>

                    <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                      {analysis.mingGe}
                    </p>
                  </AncientCard>

                  {/* 四柱八字 */}
                  <AncientCard>
                    <h3 className="text-base font-bold text-[#C9A962] mb-4">四柱八字</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: '年柱', pillar: analysis.yearPillar, nayin: analysis.yearNaYin },
                        { label: '月柱', pillar: analysis.monthPillar, nayin: analysis.monthNaYin },
                        { label: '日柱', pillar: analysis.dayPillar, nayin: analysis.dayNaYin },
                        { label: '时柱', pillar: analysis.hourPillar, nayin: analysis.hourNaYin },
                      ].map(({ label, pillar, nayin }) => (
                        <div key={label} className="text-center p-3 bg-[#1A1A1A] rounded-lg">
                          <div className="text-xs text-[#F5E6D3]/50 mb-2">{label}</div>
                          <div className="space-y-1">
                            <div
                              className="text-lg font-bold"
                              style={{ color: WUXING_COLOR_MAP[TIANGAN_WUXING[pillar[0]] || 'earth'] }}
                            >
                              {pillar[0]}
                            </div>
                            <div
                              className="text-lg font-bold"
                              style={{ color: WUXING_COLOR_MAP[DIZHI_WUXING[pillar[1]] || 'earth'] }}
                            >
                              {pillar[1]}
                            </div>
                          </div>
                          <div className="text-xs text-[#F5E6D3]/40 mt-2">{nayin}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-center text-xs text-[#F5E6D3]/40">
                      上市时辰按开盘时间（巳时 9:30）计算
                    </div>
                  </AncientCard>

                  {/* 日主与星神 */}
                  <AncientCard>
                    <h3 className="text-base font-bold text-[#C9A962] mb-4">命主解析</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                        <div className="text-xs text-[#F5E6D3]/50 mb-1">日主</div>
                        <div className="text-xl font-bold" style={{
                          color: WUXING_COLOR_MAP[analysis.dayMasterWuxing]
                        }}>
                          {analysis.dayMaster}
                        </div>
                        <div className="text-xs text-[#F5E6D3]/40 mt-1">
                          {analysis.dayMasterYinYang}{WUXING_CHINESE[analysis.dayMasterWuxing]}
                        </div>
                      </div>
                      <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                        <div className="text-xs text-[#F5E6D3]/50 mb-1">财星</div>
                        <div className="text-xl font-bold" style={{
                          color: WUXING_COLOR_MAP[analysis.caiXing]
                        }}>
                          {WUXING_CHINESE[analysis.caiXing]}
                        </div>
                        <div className="text-xs text-[#F5E6D3]/40 mt-1">我克者为财</div>
                      </div>
                      <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                        <div className="text-xs text-[#F5E6D3]/50 mb-1">官星</div>
                        <div className="text-xl font-bold" style={{
                          color: WUXING_COLOR_MAP[analysis.guanXing]
                        }}>
                          {WUXING_CHINESE[analysis.guanXing]}
                        </div>
                        <div className="text-xs text-[#F5E6D3]/40 mt-1">克我者为官</div>
                      </div>
                      <div className="p-3 bg-[#1A1A1A] rounded-lg text-center">
                        <div className="text-xs text-[#F5E6D3]/50 mb-1">印星</div>
                        <div className="text-xl font-bold" style={{
                          color: WUXING_COLOR_MAP[analysis.yinXing]
                        }}>
                          {WUXING_CHINESE[analysis.yinXing]}
                        </div>
                        <div className="text-xs text-[#F5E6D3]/40 mt-1">生我者为印</div>
                      </div>
                    </div>
                  </AncientCard>

                  {/* 五行强弱 */}
                  <AncientCard>
                    <h3 className="text-base font-bold text-[#C9A962] mb-4">五行力量分布</h3>
                    <div className="space-y-3">
                      {(Object.entries(analysis.wuxingStrength) as [WuXing, number][]).map(([wx, val]) => (
                        <div key={wx} className="flex items-center gap-3">
                          <WuXingIcon wuxing={wx} size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs" style={{ color: WUXING_COLOR_MAP[wx] }}>
                                {WUXING_CHINESE[wx]}行
                              </span>
                              <span className="text-xs text-[#F5E6D3]/50">
                                {val.toFixed(1)}
                              </span>
                            </div>
                            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(val / maxStrength) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: WUXING_COLOR_MAP[wx] }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AncientCard>

                  {/* 今日运势详解 */}
                  <AncientCard>
                    <h3 className="text-base font-bold text-[#C9A962] mb-4">今日运势详解</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <TrendIndicator trend={analysis.todayTrend} strength={
                        analysis.todayCompatibility >= 70 ? 5 :
                        analysis.todayCompatibility >= 60 ? 4 :
                        analysis.todayCompatibility >= 50 ? 3 :
                        analysis.todayCompatibility >= 40 ? 2 : 1
                      } />
                      <div className="flex-1">
                        <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.todayCompatibility}%` }}
                            transition={{ duration: 1 }}
                            className="h-full rounded-full"
                            style={{
                              background: analysis.todayCompatibility >= 60
                                ? 'linear-gradient(90deg, #DC143C, #FF6347)'
                                : analysis.todayCompatibility >= 40
                                ? 'linear-gradient(90deg, #DAA520, #FFD700)'
                                : 'linear-gradient(90deg, #228B22, #32CD32)'
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-[#F5E6D3]/50">{analysis.todayCompatibility}/100</span>
                    </div>
                    <p className="text-sm text-[#F5E6D3]/80 leading-relaxed">
                      {analysis.todayAdvice}
                    </p>
                  </AncientCard>

                  {/* 五行生克关系 */}
                  <AncientCard>
                    <h3 className="text-base font-bold text-[#C9A962] mb-4">五行生克</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-red-900/10 rounded-lg border border-red-900/30">
                        <div className="text-red-400 text-xs mb-2">相生（利好）</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-[#F5E6D3]/60">
                            <WuXingIcon wuxing={analysis.yinXing} size="sm" />
                            <span>→</span>
                            <WuXingIcon wuxing={analysis.dayMasterWuxing} size="sm" />
                            <span>{WUXING_CHINESE[analysis.yinXing]}生{WUXING_CHINESE[analysis.dayMasterWuxing]}（印星生身）</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#F5E6D3]/60">
                            <WuXingIcon wuxing={analysis.dayMasterWuxing} size="sm" />
                            <span>→</span>
                            <WuXingIcon wuxing={WUXING_RELATIONS.generates[analysis.dayMasterWuxing]} size="sm" />
                            <span>{WUXING_CHINESE[analysis.dayMasterWuxing]}生{WUXING_CHINESE[WUXING_RELATIONS.generates[analysis.dayMasterWuxing]]}（食伤泄秀）</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="text-gray-400 text-xs mb-2">相克（压力）</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-[#F5E6D3]/60">
                            <WuXingIcon wuxing={analysis.guanXing} size="sm" />
                            <span>&#8856;</span>
                            <WuXingIcon wuxing={analysis.dayMasterWuxing} size="sm" />
                            <span>{WUXING_CHINESE[analysis.guanXing]}克{WUXING_CHINESE[analysis.dayMasterWuxing]}（官星克身）</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#F5E6D3]/60">
                            <WuXingIcon wuxing={analysis.dayMasterWuxing} size="sm" />
                            <span>&#8856;</span>
                            <WuXingIcon wuxing={analysis.caiXing} size="sm" />
                            <span>{WUXING_CHINESE[analysis.dayMasterWuxing]}克{WUXING_CHINESE[analysis.caiXing]}（求财耗身）</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AncientCard>

                  {/* 所属板块 */}
                  <AncientCard>
                    <h3 className="text-base font-bold text-[#C9A962] mb-3">所属板块</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <WuXingIcon wuxing={selectedStock.wuxing} size="md" />
                      <div>
                        <div className="text-sm text-[#F5E6D3] font-bold">
                          {WUXING_SECTORS[selectedStock.wuxing].chinese}行 · {selectedStock.sector}
                        </div>
                        <div className="text-xs text-[#F5E6D3]/50">
                          {WUXING_SECTORS[selectedStock.wuxing].description}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {WUXING_SECTORS[selectedStock.wuxing].sectors.map((s, i) => (
                        <AncientBadge key={i} type={s === selectedStock.sector ? 'auspicious' : 'neutral'} size="sm">
                          {s}
                        </AncientBadge>
                      ))}
                    </div>
                  </AncientCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="text-6xl mb-4 opacity-30">&#9776;</div>
                  <h3 className="text-lg text-[#C9A962] mb-2">选择一支股票</h3>
                  <p className="text-sm text-[#F5E6D3]/50 max-w-sm">
                    从左侧列表中选择一支A股，即可查看其命理分析。
                    每支股票以上市日期为生辰，推演四柱八字、五行旺衰。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="text-center text-[#F5E6D3]/30 text-xs mt-8 sm:mt-12 space-y-1 pb-2">
          <p>本站内容仅供娱乐参考，不构成任何投资建议</p>
          <p>股市有风险，投资需谨慎</p>
          <p>
            <a
              href="https://github.com/Olcmyk/xuanshare"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#C9A962] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
