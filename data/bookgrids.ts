/**
 * 16 种书格完整数据
 * 严格对应 docs/03（书格列表 / 命名类型 / 核心特征组合）与 docs/08（书格列表）。
 *
 * prototypeVector 下标严格遵循 AXIS_ORDER：
 *   [0]drive 探索(0)→情感(100)   [1]thinking 逻辑(0)→感性(100)
 *   [2]depth 精读(0)→涉猎(100)   [3]purpose 现实(0)→逃逸(100)
 *   [4]time 现代(0)→历史(100)    [5]culture 东方(0)→西方(100)
 *   [6]tone 严肃(0)→轻盈(100)    [7]worldview 批判(0)→建构(100)
 *   [8]pace 规律(0)→随性(100)    [9]social 独享(0)→分享(100)
 * 各向量依据该书格的「核心特征组合」推导，决定性维度取极端值，辅助维度居中。
 */
import type { BookGrid } from "@/types";

export const BOOKGRIDS: BookGrid[] = [
  {
    id: 1,
    slug: "mai-shu-ru-shan-dao",
    name: "买书如山倒型",
    namingType: "behavior",
    shortDesc: "购书车永远比书架满",
    description: [
      "你和书的关系，是「拥有」而非「读完」。",
      "下单的瞬间，你已经体验了一遍阅读的快乐——剩下的，可以慢慢来。",
      "书架是你的愿望清单，也是你对未来那个更博学的自己的预付款。",
    ],
    traits: [
      "购物车里永远躺着十几本「迟早要读」的书",
      "看到打折和绝版预警就失去理智",
      "拆封的快乐，约等于读完的成就感",
    ],
    prototypeVector: [55, 55, 82, 75, 45, 50, 75, 60, 68, 55],
    shareTagline: "书架永远比时间多，但我心甘情愿",
  },
  {
    id: 2,
    slug: "shunzhe-shu-zhao-shu",
    name: "顺着书找书型",
    namingType: "behavior",
    shortDesc: "一本书的参考文献是下一本的书单",
    description: [
      "你不只是在读书，你在挖一条地道。",
      "一本书的参考文献，是你下一本书的书单；下下本的书单的来源。",
      "你的豆瓣想读列表，是一棵树，不是一个队列。",
    ],
    traits: [
      "买书不看书名，看参考文献",
      "能接受读了 100 页才进入状态的书",
      "豆瓣「想读」列表是你最私密的东西",
    ],
    prototypeVector: [20, 35, 18, 35, 85, 55, 30, 42, 40, 28],
    shareTagline: "一本书的尽头，是另一本书的开头",
  },
  {
    id: 3,
    slug: "cesuo-zhexuejia",
    name: "厕所哲学家型",
    namingType: "identity",
    shortDesc: "任何地方都能读，灵感比逻辑先到",
    description: [
      "你不挑场合，也不挑顺序——灵感来了，厕所也是书房。",
      "你读书靠的不是计划，是缘分：翻到哪页，哪页就是今天的启示。",
      "别人嫌你东一榔头西一棒子，但你脑子里那些奇怪的连接，往往最值钱。",
    ],
    traits: [
      "随手翻到哪读到哪，从不按顺序",
      "金句和灵感比逻辑链来得更快",
      "厕所、地铁、排队——处处是阅读现场",
    ],
    prototypeVector: [55, 72, 72, 60, 45, 45, 60, 50, 82, 48],
    shareTagline: "灵感不分场合，思考无需正襟危坐",
  },
  {
    id: 4,
    slug: "ba-xuyan-dang-zhengwen",
    name: "把序言当正文型",
    namingType: "behavior",
    shortDesc: "连致谢页都不放过",
    description: [
      "对你来说，一本书是从版权页开始的。",
      "序言、译后记、致谢、注释——别人跳过的地方，是你的主场。",
      "你享受的不是故事，是把一本书彻底「吃透」的那种掌控感。",
    ],
    traits: [
      "序言比正文读得还认真",
      "脚注和参考书目从不跳过",
      "一本书要从第一页系统读到最后一页才安心",
    ],
    prototypeVector: [35, 25, 15, 35, 78, 52, 25, 40, 30, 35],
    shareTagline: "一本书的每个角落，都值得被认真对待",
  },
  {
    id: 5,
    slug: "jueban-lieren",
    name: "绝版猎人型",
    namingType: "identity",
    shortDesc: "专门找绝版书、孤本和冷门小众",
    description: [
      "你读的书，别人大多没听过——这正是你想要的。",
      "孔夫子旧书网是你的猎场，绝版、初版、签名本，是你的战利品。",
      "你对书的热爱里，藏着一点考据癖和一点收藏家的执拗。",
    ],
    traits: [
      "热衷淘绝版、孤本和冷门旧书",
      "对版本、印次、装帧如数家珍",
      "越是没人读过的，越想据为己有",
    ],
    prototypeVector: [35, 30, 30, 40, 85, 20, 35, 45, 45, 28],
    shareTagline: "我读的书，搜索引擎都未必认识",
  },
  {
    id: 6,
    slug: "huaxian-bi-zhengwen-duo",
    name: "划线比正文多型",
    namingType: "behavior",
    shortDesc: "书快被划烂了，但每一条都很认真",
    description: [
      "你的书，翻开几乎页页是荧光笔的战场。",
      "你读书是为了用——每一条划线，都是准备拿去改变生活的弹药。",
      "笔记本上的摘抄，比原书还厚，但你确实把它们活成了习惯。",
    ],
    traits: [
      "荧光笔和便签是读书标配",
      "读完必做笔记，还要复盘应用",
      "看重「读了能用上什么」",
    ],
    prototypeVector: [45, 40, 28, 28, 50, 50, 45, 72, 35, 45],
    shareTagline: "读过的每一句，都想认真用进生活里",
  },
  {
    id: 7,
    slug: "yiben-shu-du-banian",
    name: "一本书读八年型",
    namingType: "behavior",
    shortDesc: "《存在与时间》第一章读了十遍",
    description: [
      "你和某些书的关系，是一场漫长的拉锯。",
      "《存在与时间》还没读完，但第一章你已经读了十遍，每遍都有新疑问。",
      "你不追求读完，你享受的是被一本难书反复折磨又反复着迷的过程。",
    ],
    traits: [
      "手头总有一本「读了很多年还没读完」的硬书",
      "宁愿反复啃第一章，也不囫囵吞枣读完",
      "对深刻和晦涩有近乎自虐的偏爱",
    ],
    prototypeVector: [35, 35, 12, 38, 65, 55, 22, 28, 48, 25],
    shareTagline: "有些书，值得用很多年去读不完",
  },
  {
    id: 8,
    slug: "zhe-shu-gaibian-le-wo",
    name: "「这书改变了我」型",
    namingType: "behavior",
    shortDesc: "每读一本都觉得人生被重塑",
    description: [
      "对你来说，每一本好书都是一次重生。",
      "读完这本，你觉得自己脱胎换骨；读完下一本，你又脱胎换骨了一次。",
      "你的真诚毫不掺假，只是你的「人生顿悟」，库存有点充足。",
    ],
    traits: [
      "经常宣布「这本书彻底改变了我」",
      "对成长和顿悟有强烈渴望",
      "读完会迫不及待想分享感受",
    ],
    prototypeVector: [30, 70, 50, 55, 45, 50, 55, 82, 55, 62],
    shareTagline: "每一本好书，都让我重新活了一次",
  },
  {
    id: 9,
    slug: "zhi-kan-nuojiang-dezhu",
    name: "只看诺奖得主型",
    namingType: "behavior",
    shortDesc: "用权威背书选书，书单即身份",
    description: [
      "你的书架，是一份精心策展的履历。",
      "诺奖、布克奖、龚古尔——奖项是你的过滤器，也是你的品味声明。",
      "你不是势利，你只是相信：被时间和权威筛过的，值得托付。",
    ],
    traits: [
      "选书优先看获奖和权威推荐",
      "书单本身就是一种身份表达",
      "偏爱经过时间检验的西方经典",
    ],
    prototypeVector: [35, 40, 40, 40, 60, 82, 25, 45, 45, 60],
    shareTagline: "我的书单，是一份策展过的品味",
  },
  {
    id: 10,
    slug: "tui-shu-ziji-mei-du",
    name: "给别人推书但自己没读型",
    namingType: "behavior",
    shortDesc: "书单达人，推荐欲远大于阅读欲",
    description: [
      "你是朋友圈里公认的「读书人」，尽管……你也心知肚明。",
      "你能精准地把一本书推荐给最适合的人，前提是这本书你刚好没读。",
      "比起读完，你更享受「为别人匹配一本好书」的那种成就感。",
    ],
    traits: [
      "随口就能甩出一长串书单",
      "推荐欲远远大于阅读欲",
      "紧跟新书热点，话题从不落伍",
    ],
    prototypeVector: [55, 55, 80, 50, 35, 55, 65, 58, 60, 88],
    shareTagline: "推书一时爽，一直推书一直爽",
  },
  {
    id: 11,
    slug: "wo-zaojiu-zhidao",
    name: "「我早就知道」型",
    namingType: "behavior",
    shortDesc: "读什么都觉得作者想浅了",
    description: [
      "你读书时，常常在和作者较劲。",
      "「这个观点我早就想到了」「他这里其实没说透」——你的批注比正文还犀利。",
      "你的挑剔不是傲慢，是一种长期独立思考养出来的、停不下来的本能。",
    ],
    traits: [
      "读书自带「我早就知道」滤镜",
      "习惯挑作者论证里的漏洞",
      "系统思维强，不轻易被说服",
    ],
    prototypeVector: [35, 20, 38, 40, 78, 58, 35, 20, 45, 50],
    shareTagline: "作者写到第三章，我已经想到第五章",
  },
  {
    id: 12,
    slug: "shuiqian-wuye-cuimian",
    name: "睡前五页催眠型",
    namingType: "behavior",
    shortDesc: "每次读几页就睡着，但非常享受",
    description: [
      "对你来说，读书是一种温柔的仪式，而非任务。",
      "床头那本书，你每晚读五页就安然睡去，三个月还停在第三章。",
      "你不在乎进度，你享受的是文字陪你入睡的那份安稳。",
    ],
    traits: [
      "睡前读书是雷打不动的仪式",
      "常常读不到几页就被催眠",
      "在乎阅读带来的情绪安抚多过内容",
    ],
    prototypeVector: [78, 62, 55, 78, 45, 48, 80, 62, 55, 35],
    shareTagline: "读不读得完不重要，舒服最重要",
  },
  {
    id: 13,
    slug: "shuji-shoucangjia",
    name: "书脊收藏家型",
    namingType: "identity",
    shortDesc: "买书是为了摆着好看，但品味是真的好",
    description: [
      "对你来说，一本书首先是一件物品，其次才是内容。",
      "装帧、纸感、书脊在书架上的颜色排列——这些你比内容更在意。",
      "但别误会，你的品味是真的好：摆出来的每一本，都经得起翻。",
    ],
    traits: [
      "极度看重装帧、设计和书架美感",
      "买书常常为了「摆着好看」",
      "审美在线，挑的书都不会差",
    ],
    prototypeVector: [50, 65, 70, 55, 65, 50, 55, 55, 50, 60],
    shareTagline: "好看的书，本身就是一种阅读",
  },
  {
    id: 14,
    slug: "ditie-wuzhan-duwan",
    name: "地铁五站读完型",
    namingType: "behavior",
    shortDesc: "碎片时间利用大师，通勤即读书",
    description: [
      "你把读书拆成了无数个五分钟，散落在一天的缝隙里。",
      "地铁五站、排队三分钟、电梯里二十秒——都是你的阅读黄金时段。",
      "你证明了：读书从来不需要「整块时间」这个借口。",
    ],
    traits: [
      "通勤、排队、碎片时间全用来读书",
      "偏爱节奏快、易切入的内容",
      "一年读完的书，多到自己都吃惊",
    ],
    prototypeVector: [55, 55, 82, 58, 28, 50, 80, 58, 65, 50],
    shareTagline: "时间是挤出来的，书是站着读完的",
  },
  {
    id: 15,
    slug: "duwan-buzhi-jiang-sha",
    name: "读完不知道讲啥型",
    namingType: "behavior",
    shortDesc: "享受阅读的感觉多于内容本身",
    description: [
      "你读书，读的是氛围和感觉，不是知识点。",
      "合上书你常常说不清它到底讲了什么，但那份沉浸过的余韵，真实存在。",
      "你不需要向谁汇报读后感——阅读本身，就是目的。",
    ],
    traits: [
      "读完常常复述不出情节",
      "更在意阅读时的情绪和氛围",
      "凭感觉读书，从不强求理解",
    ],
    prototypeVector: [65, 80, 60, 78, 45, 48, 75, 55, 55, 38],
    shareTagline: "讲不出讲了啥，但我确实读爽了",
  },
  {
    id: 16,
    slug: "doufunao-jiaojuzhe",
    name: "豆腐脑搅局者型",
    namingType: "identity",
    shortDesc: "什么书都能读出批判视角",
    description: [
      "你是那种朋友圈里最爱说「但是」的人。",
      "再主流的观点，你都能拆出三层预设、两个盲区；再权威的作者，你也敢顶。",
      "你享受的不是抬杠，是把一切既定结论重新搅一搅的那种快感。",
    ],
    traits: [
      "读任何书都自带批判和解构视角",
      "热衷挑战主流和权威结论",
      "系统思维强，偏爱西方批判理论",
    ],
    prototypeVector: [38, 20, 40, 40, 58, 82, 35, 15, 50, 62],
    shareTagline: "任何结论，我都想再搅一搅",
  },
];

/** slug → BookGrid 快查 */
export const BOOKGRID_BY_SLUG: Record<string, BookGrid> = BOOKGRIDS.reduce(
  (acc, g) => {
    acc[g.slug] = g;
    return acc;
  },
  {} as Record<string, BookGrid>
);
