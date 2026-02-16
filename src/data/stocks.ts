// A股上市公司数据 - 按五行分类
// 上市日期作为股票的"生辰"，用于玄学分析

export interface StockData {
  code: string;       // 股票代码
  name: string;       // 股票名称
  listDate: string;   // 上市日期 YYYY-MM-DD
  sector: string;     // 所属行业
  wuxing: 'metal' | 'wood' | 'water' | 'fire' | 'earth';
}

// 金行 - 银行、保险、证券、金属、军工
const metalStocks: StockData[] = [
  { code: '601398', name: '工商银行', listDate: '2006-10-27', sector: '银行', wuxing: 'metal' },
  { code: '601939', name: '建设银行', listDate: '2007-09-25', sector: '银行', wuxing: 'metal' },
  { code: '601988', name: '中国银行', listDate: '2006-07-05', sector: '银行', wuxing: 'metal' },
  { code: '601288', name: '农业银行', listDate: '2010-07-15', sector: '银行', wuxing: 'metal' },
  { code: '600036', name: '招商银行', listDate: '2002-04-09', sector: '银行', wuxing: 'metal' },
  { code: '601166', name: '兴业银行', listDate: '2007-02-05', sector: '银行', wuxing: 'metal' },
  { code: '601998', name: '中信银行', listDate: '2007-04-27', sector: '银行', wuxing: 'metal' },
  { code: '600016', name: '民生银行', listDate: '2000-12-19', sector: '银行', wuxing: 'metal' },
  { code: '600000', name: '浦发银行', listDate: '1999-11-10', sector: '银行', wuxing: 'metal' },
  { code: '000001', name: '平安银行', listDate: '1991-04-03', sector: '银行', wuxing: 'metal' },
  { code: '601318', name: '中国平安', listDate: '2007-03-01', sector: '保险', wuxing: 'metal' },
  { code: '601628', name: '中国人寿', listDate: '2007-01-09', sector: '保险', wuxing: 'metal' },
  { code: '601601', name: '中国太保', listDate: '2007-12-25', sector: '保险', wuxing: 'metal' },
  { code: '601336', name: '新华保险', listDate: '2011-12-16', sector: '保险', wuxing: 'metal' },
  { code: '600030', name: '中信证券', listDate: '2003-01-06', sector: '证券', wuxing: 'metal' },
  { code: '601211', name: '国泰君安', listDate: '2015-06-26', sector: '证券', wuxing: 'metal' },
  { code: '601688', name: '华泰证券', listDate: '2010-02-26', sector: '证券', wuxing: 'metal' },
  { code: '601899', name: '紫金矿业', listDate: '2008-04-25', sector: '贵金属', wuxing: 'metal' },
  { code: '600547', name: '山东黄金', listDate: '2003-08-28', sector: '贵金属', wuxing: 'metal' },
  { code: '600489', name: '中金黄金', listDate: '2003-08-14', sector: '贵金属', wuxing: 'metal' },
  { code: '600019', name: '宝钢股份', listDate: '2000-12-12', sector: '钢铁', wuxing: 'metal' },
  { code: '000898', name: '鞍钢股份', listDate: '1997-12-25', sector: '钢铁', wuxing: 'metal' },
  { code: '601600', name: '中国铝业', listDate: '2007-04-30', sector: '有色金属', wuxing: 'metal' },
  { code: '600362', name: '江西铜业', listDate: '2002-01-11', sector: '有色金属', wuxing: 'metal' },
  { code: '600760', name: '中航沈飞', listDate: '1997-06-26', sector: '国防军工', wuxing: 'metal' },
  { code: '000768', name: '中航西飞', listDate: '1997-06-26', sector: '国防军工', wuxing: 'metal' },
  { code: '600893', name: '航发动力', listDate: '1996-04-08', sector: '国防军工', wuxing: 'metal' },
  { code: '600111', name: '北方稀土', listDate: '1997-09-24', sector: '有色金属', wuxing: 'metal' },
  { code: '603993', name: '洛阳钼业', listDate: '2012-10-09', sector: '有色金属', wuxing: 'metal' },
  { code: '002142', name: '宁波银行', listDate: '2007-07-19', sector: '银行', wuxing: 'metal' },
];

// 木行 - 农林牧渔、医药生物、文化传媒、教育、家居
const woodStocks: StockData[] = [
  { code: '002714', name: '牧原股份', listDate: '2014-01-28', sector: '农林牧渔', wuxing: 'wood' },
  { code: '300498', name: '温氏股份', listDate: '2015-11-02', sector: '农林牧渔', wuxing: 'wood' },
  { code: '002311', name: '海大集团', listDate: '2009-11-27', sector: '农林牧渔', wuxing: 'wood' },
  { code: '000876', name: '新希望', listDate: '1998-03-11', sector: '农林牧渔', wuxing: 'wood' },
  { code: '600276', name: '恒瑞医药', listDate: '2000-10-18', sector: '医药生物', wuxing: 'wood' },
  { code: '603259', name: '药明康德', listDate: '2018-05-08', sector: '医药生物', wuxing: 'wood' },
  { code: '600436', name: '片仔癀', listDate: '2003-06-16', sector: '医药生物', wuxing: 'wood' },
  { code: '000538', name: '云南白药', listDate: '1993-12-15', sector: '医药生物', wuxing: 'wood' },
  { code: '000423', name: '东阿阿胶', listDate: '1996-07-29', sector: '医药生物', wuxing: 'wood' },
  { code: '600085', name: '同仁堂', listDate: '1997-06-25', sector: '医药生物', wuxing: 'wood' },
  { code: '300760', name: '迈瑞医疗', listDate: '2018-10-16', sector: '医药生物', wuxing: 'wood' },
  { code: '300015', name: '爱尔眼科', listDate: '2009-10-30', sector: '医药生物', wuxing: 'wood' },
  { code: '300347', name: '泰格医药', listDate: '2012-08-17', sector: '医药生物', wuxing: 'wood' },
  { code: '000999', name: '华润三九', listDate: '1999-03-09', sector: '医药生物', wuxing: 'wood' },
  { code: '000661', name: '长春高新', listDate: '1996-12-18', sector: '医药生物', wuxing: 'wood' },
  { code: '300122', name: '智飞生物', listDate: '2010-09-28', sector: '医药生物', wuxing: 'wood' },
  { code: '300251', name: '光线传媒', listDate: '2011-08-03', sector: '文化传媒', wuxing: 'wood' },
  { code: '300413', name: '芒果超媒', listDate: '2014-05-19', sector: '文化传媒', wuxing: 'wood' },
  { code: '002555', name: '三七互娱', listDate: '2011-05-13', sector: '文化传媒', wuxing: 'wood' },
  { code: '603833', name: '欧派家居', listDate: '2017-03-28', sector: '家具', wuxing: 'wood' },
  { code: '603816', name: '顾家家居', listDate: '2016-10-14', sector: '家具', wuxing: 'wood' },
  { code: '002572', name: '索菲亚', listDate: '2011-12-12', sector: '家具', wuxing: 'wood' },
  { code: '603899', name: '晨光股份', listDate: '2015-01-27', sector: '文教用品', wuxing: 'wood' },
  { code: '002422', name: '科伦药业', listDate: '2010-06-03', sector: '医药生物', wuxing: 'wood' },
  { code: '600332', name: '白云山', listDate: '2001-02-28', sector: '医药生物', wuxing: 'wood' },
  { code: '300595', name: '欧普康视', listDate: '2017-01-17', sector: '医药生物', wuxing: 'wood' },
  { code: '600763', name: '通策医疗', listDate: '1996-10-30', sector: '医药生物', wuxing: 'wood' },
  { code: '002007', name: '华兰生物', listDate: '2004-06-25', sector: '医药生物', wuxing: 'wood' },
  { code: '600196', name: '复星医药', listDate: '1998-08-07', sector: '医药生物', wuxing: 'wood' },
  { code: '002624', name: '完美世界', listDate: '2011-12-28', sector: '文化传媒', wuxing: 'wood' },
];

// 水行 - 物流、饮料、酿酒、旅游、酒店、贸易
const waterStocks: StockData[] = [
  { code: '600519', name: '贵州茅台', listDate: '2001-08-27', sector: '酿酒', wuxing: 'water' },
  { code: '000858', name: '五粮液', listDate: '1998-04-27', sector: '酿酒', wuxing: 'water' },
  { code: '000568', name: '泸州老窖', listDate: '1994-05-09', sector: '酿酒', wuxing: 'water' },
  { code: '002304', name: '洋河股份', listDate: '2009-11-06', sector: '酿酒', wuxing: 'water' },
  { code: '600809', name: '山西汾酒', listDate: '1994-01-06', sector: '酿酒', wuxing: 'water' },
  { code: '600600', name: '青岛啤酒', listDate: '1993-08-27', sector: '酿酒', wuxing: 'water' },
  { code: '600887', name: '伊利股份', listDate: '1996-03-12', sector: '饮料', wuxing: 'water' },
  { code: '600597', name: '光明乳业', listDate: '2002-08-28', sector: '饮料', wuxing: 'water' },
  { code: '603288', name: '海天味业', listDate: '2014-02-11', sector: '食品', wuxing: 'water' },
  { code: '601888', name: '中国中免', listDate: '2009-10-15', sector: '旅游', wuxing: 'water' },
  { code: '601919', name: '中远海控', listDate: '2007-06-26', sector: '航运', wuxing: 'water' },
  { code: '600026', name: '中远海能', listDate: '2002-05-23', sector: '航运', wuxing: 'water' },
  { code: '002352', name: '顺丰控股', listDate: '2017-02-24', sector: '物流', wuxing: 'water' },
  { code: '600009', name: '上海机场', listDate: '1998-02-18', sector: '航空', wuxing: 'water' },
  { code: '600004', name: '白云机场', listDate: '2003-04-28', sector: '航空', wuxing: 'water' },
  { code: '600258', name: '首旅酒店', listDate: '2000-12-18', sector: '酒店', wuxing: 'water' },
  { code: '600754', name: '锦江酒店', listDate: '1996-09-11', sector: '酒店', wuxing: 'water' },
  { code: '600138', name: '中青旅', listDate: '1997-11-27', sector: '旅游', wuxing: 'water' },
  { code: '300144', name: '宋城演艺', listDate: '2010-12-09', sector: '旅游', wuxing: 'water' },
  { code: '601933', name: '永辉超市', listDate: '2010-12-15', sector: '零售', wuxing: 'water' },
  { code: '600018', name: '上港集团', listDate: '2000-07-19', sector: '港口', wuxing: 'water' },
  { code: '601018', name: '宁波港', listDate: '2010-09-28', sector: '港口', wuxing: 'water' },
  { code: '002507', name: '涪陵榨菜', listDate: '2010-11-23', sector: '食品', wuxing: 'water' },
  { code: '603517', name: '绝味食品', listDate: '2017-03-17', sector: '食品', wuxing: 'water' },
  { code: '603866', name: '桃李面包', listDate: '2015-12-22', sector: '食品', wuxing: 'water' },
  { code: '600690', name: '海尔智家', listDate: '1993-11-19', sector: '家电', wuxing: 'water' },
  { code: '000651', name: '格力电器', listDate: '1996-11-18', sector: '家电', wuxing: 'water' },
  { code: '000333', name: '美的集团', listDate: '2013-09-18', sector: '家电', wuxing: 'water' },
  { code: '603886', name: '元祖股份', listDate: '2016-12-29', sector: '食品', wuxing: 'water' },
  { code: '002120', name: '韵达股份', listDate: '2016-12-13', sector: '物流', wuxing: 'water' },
];

// 火行 - 电力、光伏、新能源、电子、半导体、通信、计算机
const fireStocks: StockData[] = [
  { code: '002594', name: '比亚迪', listDate: '2011-06-30', sector: '新能源', wuxing: 'fire' },
  { code: '300750', name: '宁德时代', listDate: '2018-06-11', sector: '新能源', wuxing: 'fire' },
  { code: '601012', name: '隆基绿能', listDate: '2012-04-11', sector: '光伏', wuxing: 'fire' },
  { code: '300274', name: '阳光电源', listDate: '2011-11-02', sector: '光伏', wuxing: 'fire' },
  { code: '600438', name: '通威股份', listDate: '2004-03-08', sector: '光伏', wuxing: 'fire' },
  { code: '000063', name: '中兴通讯', listDate: '1997-11-18', sector: '通信', wuxing: 'fire' },
  { code: '002415', name: '海康威视', listDate: '2010-05-28', sector: '电子', wuxing: 'fire' },
  { code: '002475', name: '立讯精密', listDate: '2010-09-15', sector: '电子', wuxing: 'fire' },
  { code: '000725', name: '京东方A', listDate: '1997-06-10', sector: '电子', wuxing: 'fire' },
  { code: '000100', name: 'TCL科技', listDate: '2004-01-30', sector: '电子', wuxing: 'fire' },
  { code: '603501', name: '韦尔股份', listDate: '2017-05-04', sector: '半导体', wuxing: 'fire' },
  { code: '603986', name: '兆易创新', listDate: '2016-08-18', sector: '半导体', wuxing: 'fire' },
  { code: '002371', name: '北方华创', listDate: '2010-03-19', sector: '半导体', wuxing: 'fire' },
  { code: '688012', name: '中微公司', listDate: '2019-07-22', sector: '半导体', wuxing: 'fire' },
  { code: '600584', name: '长电科技', listDate: '2003-06-16', sector: '半导体', wuxing: 'fire' },
  { code: '002049', name: '紫光国微', listDate: '2006-03-17', sector: '半导体', wuxing: 'fire' },
  { code: '688981', name: '中芯国际', listDate: '2020-07-16', sector: '半导体', wuxing: 'fire' },
  { code: '688256', name: '寒武纪', listDate: '2020-07-20', sector: '半导体', wuxing: 'fire' },
  { code: '002230', name: '科大讯飞', listDate: '2008-05-12', sector: '计算机', wuxing: 'fire' },
  { code: '600588', name: '用友网络', listDate: '2001-05-18', sector: '计算机', wuxing: 'fire' },
  { code: '688111', name: '金山办公', listDate: '2019-11-18', sector: '计算机', wuxing: 'fire' },
  { code: '601633', name: '长城汽车', listDate: '2011-09-28', sector: '汽车', wuxing: 'fire' },
  { code: '600089', name: '特变电工', listDate: '1997-06-18', sector: '电力', wuxing: 'fire' },
  { code: '600406', name: '国电南瑞', listDate: '2003-10-16', sector: '电力', wuxing: 'fire' },
  { code: '300059', name: '东方财富', listDate: '2010-03-19', sector: '互联网', wuxing: 'fire' },
  { code: '603160', name: '汇顶科技', listDate: '2016-10-17', sector: '半导体', wuxing: 'fire' },
  { code: '601728', name: '中国电信', listDate: '2021-08-20', sector: '通信', wuxing: 'fire' },
  { code: '600941', name: '中国移动', listDate: '2022-01-05', sector: '通信', wuxing: 'fire' },
  { code: '688036', name: '传音控股', listDate: '2019-09-30', sector: '电子', wuxing: 'fire' },
  { code: '300433', name: '蓝思科技', listDate: '2015-03-18', sector: '电子', wuxing: 'fire' },
];

// 土行 - 房地产、建筑、建材、基建、环保、化工
const earthStocks: StockData[] = [
  { code: '000002', name: '万科A', listDate: '1991-01-29', sector: '房地产', wuxing: 'earth' },
  { code: '600048', name: '保利发展', listDate: '2006-07-31', sector: '房地产', wuxing: 'earth' },
  { code: '001979', name: '招商蛇口', listDate: '2015-12-30', sector: '房地产', wuxing: 'earth' },
  { code: '601155', name: '新城控股', listDate: '2015-12-23', sector: '房地产', wuxing: 'earth' },
  { code: '601668', name: '中国建筑', listDate: '2009-07-29', sector: '建筑', wuxing: 'earth' },
  { code: '601186', name: '中国铁建', listDate: '2008-03-10', sector: '建筑', wuxing: 'earth' },
  { code: '601390', name: '中国中铁', listDate: '2007-12-03', sector: '建筑', wuxing: 'earth' },
  { code: '601800', name: '中国交建', listDate: '2012-03-09', sector: '建筑', wuxing: 'earth' },
  { code: '601669', name: '中国电建', listDate: '2011-10-18', sector: '建筑', wuxing: 'earth' },
  { code: '600585', name: '海螺水泥', listDate: '2002-02-07', sector: '建材', wuxing: 'earth' },
  { code: '002271', name: '东方雨虹', listDate: '2008-09-10', sector: '建材', wuxing: 'earth' },
  { code: '000786', name: '北新建材', listDate: '1997-06-06', sector: '建材', wuxing: 'earth' },
  { code: '600801', name: '华新水泥', listDate: '1994-01-03', sector: '建材', wuxing: 'earth' },
  { code: '002372', name: '伟星新材', listDate: '2010-03-18', sector: '建材', wuxing: 'earth' },
  { code: '600031', name: '三一重工', listDate: '2003-07-03', sector: '工程机械', wuxing: 'earth' },
  { code: '000157', name: '中联重科', listDate: '2000-10-12', sector: '工程机械', wuxing: 'earth' },
  { code: '000425', name: '徐工机械', listDate: '1996-08-28', sector: '工程机械', wuxing: 'earth' },
  { code: '000338', name: '潍柴动力', listDate: '2007-04-30', sector: '机械设备', wuxing: 'earth' },
  { code: '600309', name: '万华化学', listDate: '2001-01-05', sector: '化工', wuxing: 'earth' },
  { code: '002493', name: '荣盛石化', listDate: '2010-11-02', sector: '化工', wuxing: 'earth' },
  { code: '601992', name: '金隅集团', listDate: '2011-03-29', sector: '建材', wuxing: 'earth' },
  { code: '600170', name: '上海建工', listDate: '1998-06-23', sector: '建筑', wuxing: 'earth' },
  { code: '600383', name: '金地集团', listDate: '2001-04-12', sector: '房地产', wuxing: 'earth' },
  { code: '601636', name: '旗滨集团', listDate: '2011-08-18', sector: '建材', wuxing: 'earth' },
  { code: '600660', name: '福耀玻璃', listDate: '1993-06-10', sector: '建材', wuxing: 'earth' },
  { code: '000877', name: '天山股份', listDate: '1999-06-24', sector: '建材', wuxing: 'earth' },
  { code: '000401', name: '冀东水泥', listDate: '1996-06-25', sector: '建材', wuxing: 'earth' },
  { code: '600346', name: '恒力石化', listDate: '2016-04-01', sector: '化工', wuxing: 'earth' },
  { code: '600176', name: '中国巨石', listDate: '1999-04-28', sector: '建材', wuxing: 'earth' },
  { code: '002051', name: '中工国际', listDate: '2006-07-24', sector: '建筑', wuxing: 'earth' },
];

// 合并所有股票
export const ALL_STOCKS: StockData[] = [
  ...metalStocks,
  ...woodStocks,
  ...waterStocks,
  ...fireStocks,
  ...earthStocks,
];

// 按五行分组
export const STOCKS_BY_WUXING: Record<string, StockData[]> = {
  metal: metalStocks,
  wood: woodStocks,
  water: waterStocks,
  fire: fireStocks,
  earth: earthStocks,
};

// 五行中文名
export const WUXING_CHINESE: Record<string, string> = {
  metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
};

// 搜索股票
export function searchStocks(query: string): StockData[] {
  if (!query.trim()) return ALL_STOCKS;
  const q = query.trim().toLowerCase();
  return ALL_STOCKS.filter(s =>
    s.code.includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.sector.toLowerCase().includes(q)
  );
}
