/**
 * 20 题问卷（6 维重构版）
 *
 * 6 维 delta（相对中性 50 的增量，正负对应轴方向）：
 *   drive   消遣愉悦(−) → 求知成长(+)
 *   mind    沉浸感受(−) → 抽离分析(+)
 *   horizon 现实当下(−) → 远方·历史·超验(+)
 *   texture 轻盈清澈(−) → 厚重幽深(+)
 *   tempo   疾读如流(−) → 慢嚼如品(+)
 *   stance  独处私语(−) → 分享共鸣(+)
 *
 * 题型分布（D 风：各类混合，深入阅读本身）：
 *   taste  文本品味题 ×8  —— 呈现两段不同文风的文字，选更被吸引的一段
 *                           公版原文直接引用；在世/近代作者用文风仿写（不引原文）
 *   choice 情景二选一 ×4
 *   fun    有梗单选   ×4
 *   slider 滑块量表   ×2
 *   books  最近读过的三本书（开放题，参与计算）×1
 *   choice 价值取向收尾 ×1
 *
 * 版权说明：taste 题中标注「原文」者均为作者逝世逾 70 年的公有领域作品原文；
 * 标注「仿写」者为模仿某种文风而原创的句子，不引用在世/近代作者的实际文本。
 */
import type { Question } from "@/types";

export const QUESTIONS: Question[] = [
  // ---------- Q1 taste：清澈 vs 幽深（口味 + 思辨）----------
  {
    id: "q1",
    orderIndex: 1,
    type: "taste",
    intro: "下面是两段写「夜」的文字，凭直觉，哪一段更让你想读下去？",
    text: "你被哪一段吸引？",
    options: [
      {
        id: "a",
        label: "「庭下如积水空明，水中藻、荇交横，盖竹柏影也。」",
        hint: "清明、留白、一眼见底的澄澈",
        source: "苏轼《记承天寺夜游》·原文",
        delta: { texture: -16, tempo: +10, horizon: +8 },
      },
      {
        id: "b",
        label: "「夜是一座没有出口的图书馆，每一扇窗后都坐着另一个正在读你的人。」",
        hint: "层叠、隐喻、越想越深",
        source: "博尔赫斯式·仿写",
        delta: { texture: +18, mind: +10, horizon: +10 },
      },
    ],
  },
  // ---------- Q2 taste：求知 vs 共情（驱动）----------
  {
    id: "q2",
    orderIndex: 2,
    type: "taste",
    intro: "一本书的第一句话，往往决定你要不要继续。",
    text: "哪一个开头更勾你？",
    options: [
      {
        id: "a",
        label: "「我们先要弄清楚一个问题：人为什么会服从？」",
        hint: "向你抛出一个要被解答的问题",
        source: "社科论著式·仿写",
        delta: { drive: +18, mind: +14, texture: +6 },
      },
      {
        id: "b",
        label: "「那年我十七岁，以为夏天永远不会结束。」",
        hint: "把你直接拽进一段人生",
        source: "成长小说式·仿写",
        delta: { drive: -18, mind: -12, texture: -8 },
      },
    ],
  },
  // ---------- Q3 fun：诚实题（节奏 + 驱动）----------
  {
    id: "q3",
    orderIndex: 3,
    type: "fun",
    text: "诚实回答：你现在同时在「读」几本书？",
    options: [
      { id: "a", label: "1 本，读完一本才碰下一本", delta: { tempo: +16, drive: +4 } },
      { id: "b", label: "2–3 本，看心情切换", delta: { tempo: -4 } },
      { id: "c", label: "4 本以上，哪本顺手读哪本", delta: { tempo: -16, stance: -4 } },
      { id: "d", label: "其实……一本都没在读", delta: { drive: -10, texture: -6 } },
    ],
  },
  // ---------- Q4 taste：现实当下 vs 远方超验（视野）----------
  {
    id: "q4",
    orderIndex: 4,
    type: "taste",
    intro: "同样写「一个人走在路上」。",
    text: "你更愿意跟着哪一句走？",
    options: [
      {
        id: "a",
        label: "「他攥着没发出去的辞职信，挤上了早高峰第三班地铁。」",
        hint: "此时此地，就是我们的生活",
        source: "当代现实题材式·仿写",
        delta: { horizon: -18, texture: -6, drive: -4 },
      },
      {
        id: "b",
        label: "「他沿着一条据说能通向时间尽头的石阶，一直往下走。」",
        hint: "通往远方、历史或不可知之处",
        source: "幻想/超验题材式·仿写",
        delta: { horizon: +18, texture: +6 },
      },
    ],
  },
  // ---------- Q5 taste：古典韵致（口味 + 视野，公版原文）----------
  {
    id: "q5",
    orderIndex: 5,
    type: "taste",
    intro: "两段都是写「愁」，文风很不一样。",
    text: "哪一种更对你的胃口？",
    options: [
      {
        id: "a",
        label: "「问君能有几多愁？恰似一江春水向东流。」",
        hint: "古典、凝练、余味悠长",
        source: "李煜《虞美人》·原文",
        delta: { horizon: +16, texture: +10, tempo: +10 },
      },
      {
        id: "b",
        label: "「他没说话，只是把那条旧围巾又往上拉了拉。」",
        hint: "现代、克制、留给你自己体会",
        source: "现代短篇式·仿写",
        delta: { horizon: -12, texture: -8, mind: -6 },
      },
    ],
  },
  // ---------- Q6 choice：读法（思辨 + 节奏）----------
  {
    id: "q6",
    orderIndex: 6,
    type: "choice",
    text: "读到一段让你心动的文字，你通常会：",
    options: [
      { id: "a", label: "停下来，反复咂摸它好在哪里", hint: "拆开来看", delta: { mind: +16, tempo: +14 } },
      { id: "b", label: "顺着情绪一口气读下去，不舍得停", hint: "沉进去", delta: { mind: -16, tempo: -12 } },
    ],
  },
  // ---------- Q7 taste：思辨抽离 vs 沉浸（思辨）----------
  {
    id: "q7",
    orderIndex: 7,
    type: "taste",
    intro: "两种讲道理的方式。",
    text: "哪一种更让你信服、也更想读？",
    options: [
      {
        id: "a",
        label: "「所谓自由，不过是你尚未察觉的那条绳子的长度。」",
        hint: "冷峻、思辨、像被点醒",
        source: "格言警句式·仿写",
        delta: { mind: +18, texture: +10, drive: +6 },
      },
      {
        id: "b",
        label: "「她终于松开手的那一刻，忽然觉得风是甜的。」",
        hint: "用画面和感受，让你自己懂",
        source: "抒情叙事式·仿写",
        delta: { mind: -18, texture: -8, tempo: -4 },
      },
    ],
  },
  // ---------- Q8 fun：荒岛题（视野 + 口味）----------
  {
    id: "q8",
    orderIndex: 8,
    type: "fun",
    text: "只能带一本书去荒岛，你会带：",
    options: [
      { id: "a", label: "一本能反复读、越读越深的厚书", delta: { texture: +16, tempo: +12 } },
      { id: "b", label: "一本几百年前的经典，越老越耐读", delta: { horizon: +18, texture: +8 } },
      { id: "c", label: "一本轻松好看、能陪我打发时间的", delta: { texture: -16, drive: -8 } },
      { id: "d", label: "一本能教我在荒岛活下去的实用书", delta: { drive: +14, horizon: -10 } },
    ],
  },
  // ---------- Q9 slider：节奏（疾读 ↔ 慢品）----------
  {
    id: "q9",
    orderIndex: 9,
    type: "slider",
    text: "你的阅读速度，更接近哪一端？",
    slider: {
      axis: "tempo",
      leftLabel: "一目十行，读得很快",
      rightLabel: "逐字慢读，舍不得快",
      leftDelta: -20,
      rightDelta: +20,
      defaultValue: 50,
    },
  },
  // ---------- Q10 taste：繁复 vs 简净（口味）----------
  {
    id: "q10",
    orderIndex: 10,
    type: "taste",
    intro: "两段写「雨」的句子，密度完全不同。",
    text: "你更偏爱哪一种质地？",
    options: [
      {
        id: "a",
        label: "「雨脚如麻未断绝，自经丧乱少睡眠，长夜沾湿何由彻！」",
        hint: "层层铺陈，沉郁顿挫",
        source: "杜甫《茅屋为秋风所破歌》·原文",
        delta: { texture: +18, horizon: +10, tempo: +8 },
      },
      {
        id: "b",
        label: "「下雨了。她把书往怀里一抱，跑。」",
        hint: "干净利落，留白呼吸",
        source: "极简叙事式·仿写",
        delta: { texture: -18, tempo: -10 },
      },
    ],
  },
  // ---------- Q11 choice：读完之后（驱动 + 思辨）----------
  {
    id: "q11",
    orderIndex: 11,
    type: "choice",
    text: "一本书读完，你更希望自己：",
    options: [
      { id: "a", label: "看世界的方式被悄悄改写了一点", hint: "长了见识", delta: { drive: +18, mind: +8 } },
      { id: "b", label: "像做了一场舍不得醒的梦", hint: "过足了瘾", delta: { drive: -18, horizon: +6 } },
    ],
  },
  // ---------- Q12 taste：东方意境 vs 西方思辨（视野 + 思辨）----------
  {
    id: "q12",
    orderIndex: 12,
    type: "taste",
    intro: "两段都在谈「时间」。",
    text: "哪一段的味道更吸引你？",
    options: [
      {
        id: "a",
        label: "「逝者如斯夫，不舍昼夜。」",
        hint: "东方的、感喟的、点到为止",
        source: "《论语·子罕》·原文",
        delta: { horizon: +14, texture: +8, mind: -6 },
      },
      {
        id: "b",
        label: "「时间并不流动，是我们在它静止的回廊里来回奔跑。」",
        hint: "思辨的、要拆解定义的",
        source: "西方哲思式·仿写",
        delta: { mind: +16, texture: +10, horizon: +6 },
      },
    ],
  },
  // ---------- Q13 fun：选书方式（驱动 + 姿态）----------
  {
    id: "q13",
    orderIndex: 13,
    type: "fun",
    text: "你上一本读的书，是怎么找到的？",
    options: [
      { id: "a", label: "顺着一个问题/另一本书的注脚摸过去的", delta: { drive: +16, mind: +8 } },
      { id: "b", label: "榜单、评分高，跟着大家读", delta: { stance: +12, horizon: -6 } },
      { id: "c", label: "朋友强烈安利，想读完和他聊", delta: { stance: +18 } },
      { id: "d", label: "书名/某句话一见钟情就读了", delta: { drive: -10, texture: -4 } },
    ],
  },
  // ---------- Q14 taste：明亮 vs 沉郁（口味 + 驱动）----------
  {
    id: "q14",
    orderIndex: 14,
    type: "taste",
    intro: "两段写「告别」。",
    text: "哪一种气息更让你想往下读？",
    options: [
      {
        id: "a",
        label: "「轻轻的我走了，正如我轻轻的来。」",
        hint: "明亮、轻盈、有回甘",
        source: "徐志摩《再别康桥》·原文",
        delta: { texture: -10, drive: -6, tempo: +6 },
      },
      {
        id: "b",
        label: "「我们终其一生，都在练习如何体面地失去。」",
        hint: "沉郁、厚重、带着痛感",
        source: "现代散文式·仿写",
        delta: { texture: +16, mind: +6, drive: +4 },
      },
    ],
  },
  // ---------- Q15 choice：难书态度（口味 + 节奏）----------
  {
    id: "q15",
    orderIndex: 15,
    type: "choice",
    text: "面对一本公认难啃、但很重要的书：",
    options: [
      { id: "a", label: "硬着头皮也想啃，过程本身就有快感", hint: "迎难而上", delta: { texture: +18, tempo: +12, drive: +6 } },
      { id: "b", label: "更想找本好读的替代品，先把意思弄懂", hint: "举重若轻", delta: { texture: -16, drive: -4 } },
    ],
  },
  // ---------- Q16 slider：姿态（独处 ↔ 分享）----------
  {
    id: "q16",
    orderIndex: 16,
    type: "slider",
    text: "读到一本好书，你更想：",
    slider: {
      axis: "stance",
      leftLabel: "悄悄收好，这是我一个人的事",
      rightLabel: "立刻安利，恨不得人人都读",
      leftDelta: -20,
      rightDelta: +20,
      defaultValue: 50,
    },
  },
  // ---------- Q17 taste：写实 vs 魔幻（视野 + 口味）----------
  {
    id: "q17",
    orderIndex: 17,
    type: "taste",
    intro: "两段都在写一个普通的早晨。",
    text: "你更愿意走进哪一个世界？",
    options: [
      {
        id: "a",
        label: "「闹钟第三次响起，她数了数还能赖床的七分钟。」",
        hint: "贴着真实生活的纹理",
        source: "生活流叙事式·仿写",
        delta: { horizon: -16, texture: -6 },
      },
      {
        id: "b",
        label: "「那天早晨，镜子里的自己比她早醒了十分钟，正等着她。」",
        hint: "日常裂开一道缝，透出异样",
        source: "魔幻现实主义式·仿写",
        delta: { horizon: +16, mind: +6, texture: +6 },
      },
    ],
  },
  // ---------- Q18 fun：读后状态（节奏 + 思辨）----------
  {
    id: "q18",
    orderIndex: 18,
    type: "fun",
    text: "合上一本书，让你复述它讲了什么：",
    options: [
      { id: "a", label: "条理清楚，能讲出三点", delta: { mind: +16, tempo: +6 } },
      { id: "b", label: "讲不太出，但那股氛围还在身上", delta: { mind: -16, texture: -4 } },
      { id: "c", label: "记得几句戳心的话，剩下都忘了", delta: { tempo: -10, texture: -4 } },
      { id: "d", label: "还想再读一遍才敢说读懂了", delta: { tempo: +16, texture: +8 } },
    ],
  },
  // ---------- Q19 books：最近读过的三本书（开放题，参与计算）----------
  {
    id: "q19",
    orderIndex: 19,
    type: "books",
    intro: "凭记忆写下你最近读过（或最爱）的三本书，能匹配到的会悄悄调准你的坐标；匹配不到也没关系，它们只是这一刻的氛围。",
    text: "最近读过的三本书",
  },
  // ---------- Q20 choice：阅读之于你（驱动收尾）----------
  {
    id: "q20",
    orderIndex: 20,
    type: "choice",
    text: "最后一题，凭直觉：对你而言，阅读更像——",
    options: [
      { id: "a", label: "一扇窗，让我看见更大的世界", hint: "向外求知", delta: { drive: +16, horizon: +8 } },
      { id: "b", label: "一处洞穴，让我安心地躲一会儿", hint: "向内安顿", delta: { drive: -16, horizon: +4, stance: -6 } },
    ],
  },
];

/** 题目总数（供进度条与校验使用） */
export const TOTAL_QUESTIONS = QUESTIONS.length;
