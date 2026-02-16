// A股数据入口 - 支持按需加载
// 数据按批次分片存储，减少首屏加载时间

export interface StockData {
  code: string;
  name: string;
  listDate: string;
  sector: string;
  wuxing: 'metal' | 'wood' | 'water' | 'fire' | 'earth';
}

export type WuXingType = 'metal' | 'wood' | 'water' | 'fire' | 'earth';

export const WUXING_CHINESE: Record<string, string> = {
  metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
};

// 总股票数（固定值，用于UI显示）
export const TOTAL_STOCK_COUNT = 5190;

// 批次数量
const BATCH_COUNT = 6;

// 缓存已加载的批次
const batchCache: StockData[][] = [];
let loadedBatchCount = 0;

// 加载指定批次
export async function loadBatch(batchIndex: number): Promise<StockData[]> {
  if (batchIndex >= BATCH_COUNT) return [];
  if (batchCache[batchIndex]) return batchCache[batchIndex];

  const module = await import(`./stocks_batch${batchIndex}.ts`);
  batchCache[batchIndex] = module[`BATCH_${batchIndex}`];
  return batchCache[batchIndex];
}

// 加载前N个批次
export async function loadBatches(count: number): Promise<StockData[]> {
  const toLoad = Math.min(count, BATCH_COUNT);
  const promises: Promise<StockData[]>[] = [];

  for (let i = loadedBatchCount; i < toLoad; i++) {
    promises.push(loadBatch(i));
  }

  if (promises.length > 0) {
    await Promise.all(promises);
    loadedBatchCount = toLoad;
  }

  // 返回所有已加载的数据
  return batchCache.slice(0, toLoad).flat();
}

// 加载所有股票
export async function loadAllStocks(): Promise<StockData[]> {
  return loadBatches(BATCH_COUNT);
}

// 获取当前已加载的股票
export function getLoadedStocks(): StockData[] {
  return batchCache.flat();
}

// 获取已加载批次数
export function getLoadedBatchCount(): number {
  return loadedBatchCount;
}

// 搜索股票
export function searchStocks(stocks: StockData[], query: string): StockData[] {
  const q = query.toLowerCase().trim();
  if (!q) return stocks;
  return stocks.filter(s =>
    s.code.includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q)
  );
}

// 为了兼容性保留 ALL_STOCKS
export const ALL_STOCKS: StockData[] = [];
