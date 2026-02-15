import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Luopan } from '../components/Luopan';
import { AncientCard, AncientBadge, TrendIndicator, WuXingIcon } from '../components/ui/AncientUI';
import { getDailyFortune } from '../utils/xuanxue';
import { WUXING_SECTORS, WUXING_RELATIONS } from '../utils/mappings';
import type { WuXing } from '../types';

export function SectorsPage() {
  const fortune = getDailyFortune();
  const [selectedWuxing, setSelectedWuxing] = useState<WuXing | null>(null);

  const selectedSector = selectedWuxing ? fortune.sectorFortune[selectedWuxing] : null;
  const selectedInfo = selectedWuxing ? WUXING_SECTORS[selectedWuxing] : null;

  // 五行相生相克关系
  const getRelations = (wuxing: WuXing) => {
    return {
      generates: WUXING_RELATIONS.generates[wuxing],
      generatedBy: Object.entries(WUXING_RELATIONS.generates).find(([, v]) => v === wuxing)?.[0] as WuXing,
      overcomes: WUXING_RELATIONS.overcomes[wuxing],
      overcomedBy: Object.entries(WUXING_RELATIONS.overcomes).find(([, v]) => v === wuxing)?.[0] as WuXing
    };
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">板块轮动</h1>
          <p className="text-[#F5E6D3]/60">五行流转，板块轮动，顺势而为</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 罗盘 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AncientCard>
              <h2 className="text-lg font-bold text-[#C9A962] mb-4 text-center">五行罗盘</h2>
              <Luopan
                sectorFortune={fortune.sectorFortune}
                onSectorClick={setSelectedWuxing}
                selectedWuxing={selectedWuxing}
              />
              <p className="text-center text-[#F5E6D3]/50 text-sm mt-4">
                点击五行查看详细板块信息
              </p>
            </AncientCard>
          </div>

          {/* 详情面板 */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedWuxing && selectedSector && selectedInfo ? (
                <motion.div
                  key={selectedWuxing}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* 板块概览 */}
                  <AncientCard glowing>
                    <div className="flex items-center gap-4 mb-4">
                      <WuXingIcon wuxing={selectedWuxing} size="lg" />
                      <div>
                        <h2 className="text-2xl font-bold text-[#C9A962]">
                          {selectedInfo.chinese}行板块
                        </h2>
                        <p className="text-[#F5E6D3]/60">{selectedInfo.direction}方 · {selectedInfo.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg">
                      <div>
                        <div className="text-[#F5E6D3]/50 text-sm mb-1">今日走势</div>
                        <TrendIndicator trend={selectedSector.trend} strength={selectedSector.strength} />
                      </div>
                      <div className="text-right">
                        <div className="text-[#F5E6D3]/50 text-sm mb-1">强度评级</div>
                        <div className="text-2xl font-bold text-[#C9A962]">
                          {selectedSector.strength}/5
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-[#F5E6D3]/80">{selectedSector.advice}</p>
                  </AncientCard>

                  {/* 相关板块 */}
                  <AncientCard>
                    <h3 className="text-lg font-bold text-[#C9A962] mb-4">相关A股板块</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInfo.sectors.map((sector, i) => (
                        <AncientBadge key={i} type="neutral" size="md">
                          {sector}
                        </AncientBadge>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#C9A962]/20">
                      <div className="text-[#F5E6D3]/50 text-sm mb-2">今日热门</div>
                      <div className="flex gap-2">
                        {selectedSector.hotSectors.map((sector, i) => (
                          <AncientBadge key={i} type="auspicious" size="sm">
                            {sector}
                          </AncientBadge>
                        ))}
                      </div>
                    </div>
                  </AncientCard>

                  {/* 五行关系 */}
                  <AncientCard>
                    <h3 className="text-lg font-bold text-[#C9A962] mb-4">五行生克关系</h3>
                    {(() => {
                      const relations = getRelations(selectedWuxing);
                      return (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-red-900/10 rounded-lg border border-red-900/30">
                            <div className="text-red-400 text-sm mb-2">相生（利好）</div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <WuXingIcon wuxing={relations.generatedBy} size="sm" />
                                <span className="text-[#F5E6D3]/60">→</span>
                                <WuXingIcon wuxing={selectedWuxing} size="sm" />
                                <span className="text-[#F5E6D3]/50 text-xs">
                                  {WUXING_SECTORS[relations.generatedBy].chinese}生{selectedInfo.chinese}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <WuXingIcon wuxing={selectedWuxing} size="sm" />
                                <span className="text-[#F5E6D3]/60">→</span>
                                <WuXingIcon wuxing={relations.generates} size="sm" />
                                <span className="text-[#F5E6D3]/50 text-xs">
                                  {selectedInfo.chinese}生{WUXING_SECTORS[relations.generates].chinese}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="text-gray-400 text-sm mb-2">相克（利空）</div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <WuXingIcon wuxing={relations.overcomedBy} size="sm" />
                                <span className="text-[#F5E6D3]/60">⊗</span>
                                <WuXingIcon wuxing={selectedWuxing} size="sm" />
                                <span className="text-[#F5E6D3]/50 text-xs">
                                  {WUXING_SECTORS[relations.overcomedBy].chinese}克{selectedInfo.chinese}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <WuXingIcon wuxing={selectedWuxing} size="sm" />
                                <span className="text-[#F5E6D3]/60">⊗</span>
                                <WuXingIcon wuxing={relations.overcomes} size="sm" />
                                <span className="text-[#F5E6D3]/50 text-xs">
                                  {selectedInfo.chinese}克{WUXING_SECTORS[relations.overcomes].chinese}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </AncientCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* 默认显示所有板块概览 */}
                  <AncientCard>
                    <h2 className="text-lg font-bold text-[#C9A962] mb-4">今日五行板块总览</h2>
                    <div className="space-y-4">
                      {(Object.keys(fortune.sectorFortune) as WuXing[]).map(wuxing => {
                        const sector = fortune.sectorFortune[wuxing];
                        const info = WUXING_SECTORS[wuxing];
                        return (
                          <div
                            key={wuxing}
                            className="flex items-center gap-4 p-3 bg-[#1A1A1A] rounded-lg cursor-pointer hover:bg-[#252525] transition-colors"
                            onClick={() => setSelectedWuxing(wuxing)}
                          >
                            <WuXingIcon wuxing={wuxing} size="md" />
                            <div className="flex-1">
                              <div className="font-bold text-[#F5E6D3]">{info.chinese}行</div>
                              <div className="text-sm text-[#F5E6D3]/50">{info.direction}方</div>
                            </div>
                            <TrendIndicator trend={sector.trend} strength={sector.strength} />
                          </div>
                        );
                      })}
                    </div>
                  </AncientCard>

                  {/* 五行相生图 */}
                  <AncientCard>
                    <h3 className="text-lg font-bold text-[#C9A962] mb-4">五行相生相克</h3>
                    <div className="text-center text-[#F5E6D3]/70 space-y-2">
                      <p>相生：木 → 火 → 土 → 金 → 水 → 木</p>
                      <p>相克：木 ⊗ 土 ⊗ 水 ⊗ 火 ⊗ 金 ⊗ 木</p>
                    </div>
                    <div className="mt-4 p-4 bg-[#1A1A1A] rounded-lg">
                      <p className="text-sm text-[#F5E6D3]/60">
                        五行相生：当某一五行旺盛时，其所生之行也会受益。
                        例如木旺则火相，医药板块活跃时，科技板块也可能跟涨。
                      </p>
                      <p className="text-sm text-[#F5E6D3]/60 mt-2">
                        五行相克：当某一五行旺盛时，其所克之行会受压。
                        例如金旺则木衰，金融板块强势时，农业板块可能承压。
                      </p>
                    </div>
                  </AncientCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="text-center text-[#F5E6D3]/30 text-xs mt-12">
          <p>本站内容仅供娱乐参考，不构成任何投资建议</p>
          <p>股市有风险，投资需谨慎</p>
        </div>
      </div>
    </div>
  );
}
