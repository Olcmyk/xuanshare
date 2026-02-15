// 玄学与股市的映射关系表
import type { WuXingInfo, JianChuInfo, XingXiuInfo, ShenShaInfo, WuXing } from '../types';

// 五行与A股板块映射
export const WUXING_SECTORS: Record<WuXing, WuXingInfo> = {
  metal: {
    name: 'metal',
    chinese: '金',
    color: '#C0C0C0',
    direction: '西',
    sectors: [
      '有色金属', '贵金属', '钢铁', '银行', '保险',
      '证券', '汽车', '机械设备', '国防军工'
    ],
    description: '金主收敛、坚固，对应金融、金属类行业'
  },
  wood: {
    name: 'wood',
    chinese: '木',
    color: '#228B22',
    direction: '东',
    sectors: [
      '农林牧渔', '家具', '造纸', '纺织服装', '医药生物',
      '教育', '传媒', '文化', '出版'
    ],
    description: '木主生发、成长，对应农业、医药、文化类行业'
  },
  water: {
    name: 'water',
    chinese: '水',
    color: '#4169E1',
    direction: '北',
    sectors: [
      '航运', '港口', '水务', '饮料', '酿酒',
      '旅游', '酒店', '物流', '贸易'
    ],
    description: '水主流动、智慧，对应物流、消费、贸易类行业'
  },
  fire: {
    name: 'fire',
    chinese: '火',
    color: '#DC143C',
    direction: '南',
    sectors: [
      '电力', '光伏', '新能源', '电子', '半导体',
      '通信', '计算机', '互联网', '传媒娱乐'
    ],
    description: '火主光明、科技，对应电力、电子、科技类行业'
  },
  earth: {
    name: 'earth',
    chinese: '土',
    color: '#DAA520',
    direction: '中',
    sectors: [
      '房地产', '建筑', '建材', '水泥', '玻璃',
      '陶瓷', '基建', '工程机械', '环保'
    ],
    description: '土主承载、稳固，对应地产、建筑、基建类行业'
  }
};

// 十二建除与股市操作映射
export const JIANCHU_MAPPING: Record<string, JianChuInfo> = {
  '建': {
    name: 'jian',
    chinese: '建',
    stockAdvice: '建仓良机',
    suitable: ['建仓', '开户', '申购新股', '长线布局'],
    avoid: ['清仓', '止损'],
    description: '建日主创始，宜建立新仓位，开启新投资'
  },
  '除': {
    name: 'chu',
    chinese: '除',
    stockAdvice: '清除杂念',
    suitable: ['清理亏损股', '调整持仓', '止损出局'],
    avoid: ['追高', '加仓'],
    description: '除日主清除，宜清理不良持仓，去除亏损'
  },
  '满': {
    name: 'man',
    chinese: '满',
    stockAdvice: '获利了结',
    suitable: ['获利了结', '分批减仓', '落袋为安'],
    avoid: ['追涨', '满仓操作'],
    description: '满日主圆满，宜适度获利，不宜贪多'
  },
  '平': {
    name: 'ping',
    chinese: '平',
    stockAdvice: '平稳持有',
    suitable: ['持股观望', '平衡配置', '稳健操作'],
    avoid: ['激进操作', '频繁交易'],
    description: '平日主平稳，宜保持现状，稳中求进'
  },
  '定': {
    name: 'ding',
    chinese: '定',
    stockAdvice: '坚定持有',
    suitable: ['坚定持股', '定投加仓', '长期持有'],
    avoid: ['恐慌抛售', '频繁换股'],
    description: '定日主安定，宜坚守阵地，不宜动摇'
  },
  '执': {
    name: 'zhi',
    chinese: '执',
    stockAdvice: '执行计划',
    suitable: ['执行既定策略', '按计划操作', '纪律交易'],
    avoid: ['临时改变策略', '情绪化操作'],
    description: '执日主执行，宜按计划行事，严守纪律'
  },
  '破': {
    name: 'po',
    chinese: '破',
    stockAdvice: '谨慎观望',
    suitable: ['观望', '空仓休息', '研究学习'],
    avoid: ['重仓操作', '追涨杀跌', '借钱炒股'],
    description: '破日主破败，宜休息观望，不宜冒进'
  },
  '危': {
    name: 'wei',
    chinese: '危',
    stockAdvice: '规避风险',
    suitable: ['降低仓位', '设置止损', '防守为主'],
    avoid: ['满仓操作', '追高', '杠杆交易'],
    description: '危日主危险，宜谨慎防守，规避风险'
  },
  '成': {
    name: 'cheng',
    chinese: '成',
    stockAdvice: '成交活跃',
    suitable: ['短线交易', '波段操作', '把握机会'],
    avoid: ['犹豫不决', '错失良机'],
    description: '成日主成就，宜果断出手，把握时机'
  },
  '收': {
    name: 'shou',
    chinese: '收',
    stockAdvice: '收获成果',
    suitable: ['收割利润', '兑现收益', '总结复盘'],
    avoid: ['贪心不足', '恋战不走'],
    description: '收日主收获，宜落袋为安，收获成果'
  },
  '开': {
    name: 'kai',
    chinese: '开',
    stockAdvice: '开拓进取',
    suitable: ['开新仓', '尝试新板块', '扩大投资'],
    avoid: ['保守观望', '错失机会'],
    description: '开日主开放，宜开拓新领域，积极进取'
  },
  '闭': {
    name: 'bi',
    chinese: '闭',
    stockAdvice: '闭门休息',
    suitable: ['空仓休息', '闭关学习', '静待时机'],
    avoid: ['频繁操作', '盲目跟风'],
    description: '闭日主闭藏，宜休养生息，静待时机'
  }
};

// 二十八星宿与股市映射
export const XINGXIU_MAPPING: Record<string, XingXiuInfo> = {
  '角': { name: 'jiao', chinese: '角', animal: '蛟', wuxing: 'wood', fortune: 'auspicious', stockHint: '龙头股活跃，科技板块有机会' },
  '亢': { name: 'kang', chinese: '亢', animal: '龙', wuxing: 'metal', fortune: 'inauspicious', stockHint: '高位股有回调风险，谨慎追高' },
  '氐': { name: 'di', chinese: '氐', animal: '貉', wuxing: 'earth', fortune: 'auspicious', stockHint: '地产基建板块有支撑' },
  '房': { name: 'fang', chinese: '房', animal: '兔', wuxing: 'fire', fortune: 'auspicious', stockHint: '房地产、家居板块活跃' },
  '心': { name: 'xin', chinese: '心', animal: '狐', wuxing: 'fire', fortune: 'inauspicious', stockHint: '市场情绪波动，注意风险' },
  '尾': { name: 'wei', chinese: '尾', animal: '虎', wuxing: 'fire', fortune: 'auspicious', stockHint: '尾盘或有异动，关注收盘走势' },
  '箕': { name: 'ji', chinese: '箕', animal: '豹', wuxing: 'water', fortune: 'auspicious', stockHint: '物流、贸易板块有机会' },
  '斗': { name: 'dou', chinese: '斗', animal: '獬', wuxing: 'wood', fortune: 'auspicious', stockHint: '券商、金融板块活跃' },
  '牛': { name: 'niu', chinese: '牛', animal: '牛', wuxing: 'metal', fortune: 'auspicious', stockHint: '牛市信号，大盘向好' },
  '女': { name: 'nv', chinese: '女', animal: '蝠', wuxing: 'earth', fortune: 'inauspicious', stockHint: '消费、女性相关板块波动' },
  '虚': { name: 'xu', chinese: '虚', animal: '鼠', wuxing: 'fire', fortune: 'inauspicious', stockHint: '虚假繁荣，谨防诱多' },
  '危': { name: 'weixiu', chinese: '危', animal: '燕', wuxing: 'earth', fortune: 'inauspicious', stockHint: '高位危险，注意回调' },
  '室': { name: 'shi', chinese: '室', animal: '猪', wuxing: 'water', fortune: 'auspicious', stockHint: '房地产、家居板块有支撑' },
  '壁': { name: 'bi', chinese: '壁', animal: '貐', wuxing: 'water', fortune: 'auspicious', stockHint: '建材、装修板块活跃' },
  '奎': { name: 'kui', chinese: '奎', animal: '狼', wuxing: 'wood', fortune: 'auspicious', stockHint: '文化传媒板块有机会' },
  '娄': { name: 'lou', chinese: '娄', animal: '狗', wuxing: 'metal', fortune: 'auspicious', stockHint: '农业、畜牧板块活跃' },
  '胃': { name: 'wei2', chinese: '胃', animal: '雉', wuxing: 'earth', fortune: 'auspicious', stockHint: '消费、食品板块有支撑' },
  '昴': { name: 'mao', chinese: '昴', animal: '鸡', wuxing: 'fire', fortune: 'inauspicious', stockHint: '短线波动加剧，谨慎操作' },
  '毕': { name: 'bi2', chinese: '毕', animal: '乌', wuxing: 'water', fortune: 'auspicious', stockHint: '收官行情，适合了结' },
  '觜': { name: 'zi', chinese: '觜', animal: '猴', wuxing: 'fire', fortune: 'inauspicious', stockHint: '市场多空分歧，观望为主' },
  '参': { name: 'shen', chinese: '参', animal: '猿', wuxing: 'water', fortune: 'auspicious', stockHint: '医药、保健板块有机会' },
  '井': { name: 'jing', chinese: '井', animal: '犴', wuxing: 'water', fortune: 'auspicious', stockHint: '能源、水务板块活跃' },
  '鬼': { name: 'gui', chinese: '鬼', animal: '羊', wuxing: 'metal', fortune: 'inauspicious', stockHint: '市场阴晴不定，谨慎为上' },
  '柳': { name: 'liu', chinese: '柳', animal: '獐', wuxing: 'earth', fortune: 'inauspicious', stockHint: '板块轮动快，不宜追涨' },
  '星': { name: 'xing', chinese: '星', animal: '马', wuxing: 'fire', fortune: 'auspicious', stockHint: '明星股活跃，关注热点' },
  '张': { name: 'zhang', chinese: '张', animal: '鹿', wuxing: 'water', fortune: 'auspicious', stockHint: '市场张力十足，可适度进取' },
  '翼': { name: 'yi', chinese: '翼', animal: '蛇', wuxing: 'fire', fortune: 'inauspicious', stockHint: '航空、军工板块波动' },
  '轸': { name: 'zhen', chinese: '轸', animal: '蚓', wuxing: 'water', fortune: 'auspicious', stockHint: '交通运输板块有机会' }
};

// 神煞与股市映射
export const SHENSHA_MAPPING: Record<string, ShenShaInfo> = {
  // 吉神
  '天德': { name: 'tiande', chinese: '天德', type: 'auspicious', stockImpact: '贵人相助，大盘有支撑' },
  '月德': { name: 'yuede', chinese: '月德', type: 'auspicious', stockImpact: '月线级别支撑，中线看好' },
  '天德合': { name: 'tiandeHe', chinese: '天德合', type: 'auspicious', stockImpact: '利好消息配合，市场向好' },
  '月德合': { name: 'yuedeHe', chinese: '月德合', type: 'auspicious', stockImpact: '资金面宽松，流动性充裕' },
  '天赦': { name: 'tianshe', chinese: '天赦', type: 'auspicious', stockImpact: '利空出尽，否极泰来' },
  '天愿': { name: 'tianyuan', chinese: '天愿', type: 'auspicious', stockImpact: '政策面向好，市场信心足' },
  '月恩': { name: 'yueen', chinese: '月恩', type: 'auspicious', stockImpact: '资金青睐，板块轮动顺畅' },
  '四相': { name: 'sixiang', chinese: '四相', type: 'auspicious', stockImpact: '四方来财，多头格局' },
  '时德': { name: 'shide', chinese: '时德', type: 'auspicious', stockImpact: '短线机会多，把握时机' },
  '民日': { name: 'minri', chinese: '民日', type: 'auspicious', stockImpact: '消费板块活跃，内需向好' },
  '三合': { name: 'sanhe', chinese: '三合', type: 'auspicious', stockImpact: '板块联动，协同上涨' },
  '天喜': { name: 'tianxi', chinese: '天喜', type: 'auspicious', stockImpact: '市场情绪高涨，人气旺盛' },
  '天医': { name: 'tianyi', chinese: '天医', type: 'auspicious', stockImpact: '医药板块有机会' },
  '福德': { name: 'fude', chinese: '福德', type: 'auspicious', stockImpact: '稳健收益，福报临门' },
  '天财': { name: 'tiancai', chinese: '天财', type: 'auspicious', stockImpact: '财运亨通，利于投资' },
  '六合': { name: 'liuhe', chinese: '六合', type: 'auspicious', stockImpact: '多方合力，共同上涨' },
  '五富': { name: 'wufu', chinese: '五富', type: 'auspicious', stockImpact: '五行俱旺，全面开花' },
  '生气': { name: 'shengqi', chinese: '生气', type: 'auspicious', stockImpact: '市场活力充沛，新股活跃' },
  '益后': { name: 'yihou', chinese: '益后', type: 'auspicious', stockImpact: '后市可期，中长线布局' },
  '续世': { name: 'xushi', chinese: '续世', type: 'auspicious', stockImpact: '延续涨势，趋势向好' },
  '驿马': { name: 'yima', chinese: '驿马', type: 'auspicious', stockImpact: '物流交通板块活跃，资金流动快' },

  // 凶神
  '大耗': { name: 'dahao', chinese: '大耗', type: 'inauspicious', stockImpact: '资金外流，大盘承压' },
  '小耗': { name: 'xiaohao', chinese: '小耗', type: 'inauspicious', stockImpact: '小幅震荡，消耗多头动能' },
  '天刑': { name: 'tianxing', chinese: '天刑', type: 'inauspicious', stockImpact: '监管风险，合规板块承压' },
  '天牢': { name: 'tianlao', chinese: '天牢', type: 'inauspicious', stockImpact: '资金被套，流动性收紧' },
  '天火': { name: 'tianhuo', chinese: '天火', type: 'inauspicious', stockImpact: '市场过热，谨防回调' },
  '月破': { name: 'yuepo', chinese: '月破', type: 'inauspicious', stockImpact: '月线破位风险，中线谨慎' },
  '月厌': { name: 'yueyan', chinese: '月厌', type: 'inauspicious', stockImpact: '市场情绪低迷，观望为主' },
  '月煞': { name: 'yuesha', chinese: '月煞', type: 'inauspicious', stockImpact: '月内有风险事件，注意防范' },
  '月虚': { name: 'yuexu', chinese: '月虚', type: 'inauspicious', stockImpact: '虚假突破，谨防诱多' },
  '血支': { name: 'xuezhi', chinese: '血支', type: 'inauspicious', stockImpact: '医药板块波动，注意风险' },
  '五虚': { name: 'wuxu', chinese: '五虚', type: 'inauspicious', stockImpact: '五行皆虚，全面回调' },
  '土符': { name: 'tufu', chinese: '土符', type: 'inauspicious', stockImpact: '地产板块承压' },
  '归忌': { name: 'guiji', chinese: '归忌', type: 'inauspicious', stockImpact: '资金回流，获利了结' },
  '血忌': { name: 'xueji', chinese: '血忌', type: 'inauspicious', stockImpact: '市场见血，恐慌情绪' },
  '往亡': { name: 'wangwang', chinese: '往亡', type: 'inauspicious', stockImpact: '追涨必亡，切勿冒进' },
  '四废': { name: 'sifei', chinese: '四废', type: 'inauspicious', stockImpact: '四面楚歌，空头占优' },
  '四穷': { name: 'siqiong', chinese: '四穷', type: 'inauspicious', stockImpact: '资金匮乏，成交低迷' },
  '四忌': { name: 'siji', chinese: '四忌', type: 'inauspicious', stockImpact: '多重利空，谨慎观望' },
  '死气': { name: 'siqi', chinese: '死气', type: 'inauspicious', stockImpact: '市场死气沉沉，缺乏活力' },
  '劫煞': { name: 'jiesha', chinese: '劫煞', type: 'inauspicious', stockImpact: '突发风险，注意止损' },
  '灾煞': { name: 'zaisha', chinese: '灾煞', type: 'inauspicious', stockImpact: '黑天鹅风险，防范为主' },
  '岁破': { name: 'suipo', chinese: '岁破', type: 'inauspicious', stockImpact: '年线级别风险，长线谨慎' },
  '阴错': { name: 'yincuo', chinese: '阴错', type: 'inauspicious', stockImpact: '判断失误，操作失当' },
  '阳错': { name: 'yangcuo', chinese: '阳错', type: 'inauspicious', stockImpact: '方向错误，及时纠正' },
  '四击': { name: 'siji2', chinese: '四击', type: 'inauspicious', stockImpact: '多空博弈激烈，震荡加剧' },
  '八专': { name: 'bazhuan', chinese: '八专', type: 'inauspicious', stockImpact: '专业机构主导，散户谨慎' },
  '触水龙': { name: 'chushuilong', chinese: '触水龙', type: 'inauspicious', stockImpact: '水务、航运板块波动' },
  '八风': { name: 'bafeng', chinese: '八风', type: 'inauspicious', stockImpact: '市场风向不定，观望为主' }
};

// 九宫飞星与股市映射
export const JIUGONG_MAPPING: Record<number, { name: string; nature: string; stockHint: string }> = {
  1: { name: '一白贪狼', nature: '水', stockHint: '水务、物流板块活跃，利于新开仓位' },
  2: { name: '二黑巨门', nature: '土', stockHint: '地产板块承压，谨慎操作' },
  3: { name: '三碧禄存', nature: '木', stockHint: '是非口舌多，市场分歧大' },
  4: { name: '四绿文曲', nature: '木', stockHint: '文化传媒板块活跃，利于学习研究' },
  5: { name: '五黄廉贞', nature: '土', stockHint: '五黄煞临，大盘承压，谨慎为上' },
  6: { name: '六白武曲', nature: '金', stockHint: '金融、军工板块有机会' },
  7: { name: '七赤破军', nature: '金', stockHint: '破军星动，市场波动加剧' },
  8: { name: '八白左辅', nature: '土', stockHint: '财星高照，利于投资理财' },
  9: { name: '九紫右弼', nature: '火', stockHint: '科技、新能源板块活跃' }
};

// 天干与五行映射
export const TIANGAN_WUXING: Record<string, WuXing> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water'
};

// 地支与五行映射
export const DIZHI_WUXING: Record<string, WuXing> = {
  '寅': 'wood', '卯': 'wood',
  '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '亥': 'water', '子': 'water'
};

// 五行相生相克
export const WUXING_RELATIONS = {
  // 相生：木生火，火生土，土生金，金生水，水生木
  generates: {
    wood: 'fire',
    fire: 'earth',
    earth: 'metal',
    metal: 'water',
    water: 'wood'
  } as Record<WuXing, WuXing>,
  // 相克：木克土，土克水，水克火，火克金，金克木
  overcomes: {
    wood: 'earth',
    earth: 'water',
    water: 'fire',
    fire: 'metal',
    metal: 'wood'
  } as Record<WuXing, WuXing>
};
