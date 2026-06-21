/**
 * 20 题问卷
 * 严格对应 docs/05（题目→轴分值映射示例）与 docs/06（4 种题型设计）。
 *
 * 题型：
 *   choice — 二选一情景题
 *   fun    — 有梗单选题（3–4 选项）
 *   slider — 滑块量表题（0–100）
 *   image  — 封面直觉题（4 选项，coverUrl 暂以占位色块表示）
 *
 * delta 是相对「中性 50」的分值增量，正负对应轴方向：
 *   drive 探索(−)→情感(+) | thinking 逻辑(−)→感性(+) | depth 精读(−)→涉猎(+)
 *   purpose 现实(−)→逃逸(+) | time 现代(−)→历史(+) | culture 东方(−)→西方(+)
 *   tone 严肃(−)→轻盈(+) | worldview 批判(−)→建构(+) | pace 规律(−)→随性(+)
 *   social 独享(−)→分享(+)
 * 全部题目累加后由 quiz-scorer 归一化到 0–100。
 */
import type { Question } from "@/types";

export const QUESTIONS: Question[] = [
  // ---------- Q1 choice：阅读驱动力 + 内容取向 ----------
  {
    id: "q1",
    orderIndex: 1,
    type: "choice",
    text: "周末，你拿起一本书。\n你更可能在想：",
    options: [
      { id: "a", label: "「这本书能让我学到什么？」", hint: "学点有用的", delta: { drive: -18, purpose: -12 } },
      { id: "b", label: "「我只是想消失一下。」", hint: "逃进另一个世界", delta: { drive: +18, purpose: +15 } },
    ],
  },
  // ---------- Q2 choice：思维偏好 ----------
  {
    id: "q2",
    orderIndex: 2,
    type: "choice",
    text: "看到一本新书，你先关注：",
    options: [
      { id: "a", label: "它的论证结构和逻辑是否严密", hint: "讲不讲得通", delta: { thinking: -16, worldview: -8 } },
      { id: "b", label: "它的文字和氛围有没有打动我", hint: "美不美", delta: { thinking: +16, tone: +6 } },
    ],
  },
  // ---------- Q3 fun：阅读深度（同时在读几本） ----------
  {
    id: "q3",
    orderIndex: 3,
    type: "fun",
    text: "诚实回答：你现在同时在「读」几本书？",
    options: [
      { id: "a", label: "1 本（我是正常人）", delta: { depth: -20, pace: -10 } },
      { id: "b", label: "2–3 本（还好还好）", delta: { depth: -5 } },
      { id: "c", label: "4–6 本（有点失控了）", delta: { depth: +15, pace: +12 } },
      { id: "d", label: "7 本以上（书架是我的精神支柱）", delta: { depth: +25, pace: +18 } },
    ],
  },
  // ---------- Q4 choice：阅读深度（精读 vs 涉猎） ----------
  {
    id: "q4",
    orderIndex: 4,
    type: "choice",
    text: "一本 600 页的硬书，你会：",
    options: [
      { id: "a", label: "慢慢啃，宁可一年也要逐字读完", hint: "沉浸精读", delta: { depth: -22, tone: -10 } },
      { id: "b", label: "挑重点跳读，先把框架抓住再说", hint: "广泛涉猎", delta: { depth: +20, pace: +8 } },
    ],
  },
  // ---------- Q5 slider：阅读深度（上一本读完没） ----------
  {
    id: "q5",
    orderIndex: 5,
    type: "slider",
    text: "你上一本买的书，进度如何？",
    slider: {
      axis: "depth",
      leftLabel: "还没开始读",
      rightLabel: "读了很多遍",
      leftDelta: +18, // 没读 → 偏涉猎/囤书
      rightDelta: -18, // 读很多遍 → 偏精读
      defaultValue: 50,
    },
  },
  // ---------- Q6 fun：时空偏好 ----------
  {
    id: "q6",
    orderIndex: 6,
    type: "fun",
    text: "如果只能选一类书带去荒岛：",
    options: [
      { id: "a", label: "最新出的话题之作，紧跟当下", delta: { time: -20 } },
      { id: "b", label: "几百年前的经典，越老越香", delta: { time: +22, tone: -6 } },
      { id: "c", label: "无所谓新旧，好看就行", delta: { tone: +10 } },
    ],
  },
  // ---------- Q7 choice：文化圈层 ----------
  {
    id: "q7",
    orderIndex: 7,
    type: "choice",
    text: "书架上更多的是：",
    options: [
      { id: "a", label: "中国作者、东方语境的书", hint: "本土东方", delta: { culture: -20 } },
      { id: "b", label: "翻译引进、西方视野的书", hint: "西方视野", delta: { culture: +20 } },
    ],
  },
  // ---------- Q8 choice：叙事口味 ----------
  {
    id: "q8",
    orderIndex: 8,
    type: "choice",
    text: "你更愿意读哪一种？",
    options: [
      { id: "a", label: "严肃深刻、需要动脑的书", hint: "费脑但值得", delta: { tone: -20, depth: -8 } },
      { id: "b", label: "轻盈有趣、读着不累的书", hint: "图个开心", delta: { tone: +20, pace: +6 } },
    ],
  },
  // ---------- Q9 fun：世界观取向 ----------
  {
    id: "q9",
    orderIndex: 9,
    type: "fun",
    text: "读完一本观点鲜明的书，你通常：",
    options: [
      { id: "a", label: "先找它的漏洞和没说透的地方", delta: { worldview: -22, thinking: -8 } },
      { id: "b", label: "被启发，想照着改变点什么", delta: { worldview: +22, drive: +6 } },
      { id: "c", label: "看个热闹，不太较真", delta: { tone: +10, depth: +6 } },
    ],
  },
  // ---------- Q10 slider：阅读节奏 ----------
  {
    id: "q10",
    orderIndex: 10,
    type: "slider",
    text: "你的阅读节奏更像：",
    slider: {
      axis: "pace",
      leftLabel: "每天固定读",
      rightLabel: "攒着一口气读",
      leftDelta: -20,
      rightDelta: +20,
      defaultValue: 50,
    },
  },
  // ---------- Q11 fun：社交倾向 ----------
  {
    id: "q11",
    orderIndex: 11,
    type: "fun",
    text: "读到一本好书，你的第一反应：",
    options: [
      { id: "a", label: "默默收藏，这是我一个人的宝藏", delta: { social: -20 } },
      { id: "b", label: "立刻发朋友圈/安利给朋友", delta: { social: +22 } },
      { id: "c", label: "写进豆瓣标记，仅自己可见", delta: { social: -8 } },
    ],
  },
  // ---------- Q12 image：封面直觉（叙事口味 + 文化） ----------
  {
    id: "q12",
    orderIndex: 12,
    type: "image",
    text: "直觉反应：哪种封面最吸引你？",
    options: [
      { id: "a", label: "极简留白 · 衬线大字", hint: "严肃克制", coverUrl: "", delta: { tone: -16, culture: +6 } },
      { id: "b", label: "明快插画 · 高饱和配色", hint: "轻松有趣", coverUrl: "", delta: { tone: +18 } },
      { id: "c", label: "水墨意境 · 古典装帧", hint: "东方古典", coverUrl: "", delta: { culture: -16, time: +12 } },
      { id: "d", label: "摄影封面 · 都市冷感", hint: "西方现代", coverUrl: "", delta: { culture: +14, time: -12 } },
    ],
  },
  // ---------- Q13 choice：阅读驱动力（再测一次，加权） ----------
  {
    id: "q13",
    orderIndex: 13,
    type: "choice",
    text: "你更认同哪句话？",
    options: [
      { id: "a", label: "「读书是为了理解世界如何运转。」", hint: "求知", delta: { drive: -18, purpose: -10 } },
      { id: "b", label: "「读书是为了体验另一种人生。」", hint: "共情", delta: { drive: +18, purpose: +10 } },
    ],
  },
  // ---------- Q14 fun：买书 vs 读书（深度 + 节奏） ----------
  {
    id: "q14",
    orderIndex: 14,
    type: "fun",
    text: "你家里「买了还没读」的书大概有：",
    options: [
      { id: "a", label: "几乎没有，买了就会读", delta: { depth: -16, pace: -10 } },
      { id: "b", label: "十几本，慢慢消化", delta: { depth: +6 } },
      { id: "c", label: "数不清，囤书使我快乐", delta: { depth: +20, purpose: +10 } },
    ],
  },
  // ---------- Q15 choice：内容取向（实用 vs 逃逸） ----------
  {
    id: "q15",
    orderIndex: 15,
    type: "choice",
    text: "理想的一本书，读完后你希望：",
    options: [
      { id: "a", label: "能立刻用在工作或生活里", hint: "现实指向", delta: { purpose: -20, worldview: +8 } },
      { id: "b", label: "让我久久沉浸、舍不得出来", hint: "精神逃逸", delta: { purpose: +20, drive: +6 } },
    ],
  },
  // ---------- Q16 fun：思维偏好 + 选书方式 ----------
  {
    id: "q16",
    orderIndex: 16,
    type: "fun",
    text: "你上一本读完的书，是怎么选的？",
    options: [
      { id: "a", label: "研究某个问题时顺藤摸瓜找到的", delta: { drive: -16, thinking: -12 } },
      { id: "b", label: "豆瓣/榜单评分高，跟着选", delta: { social: +10, time: -8 } },
      { id: "c", label: "朋友强烈安利，想和他聊", delta: { social: +18 } },
      { id: "d", label: "封面/书名一见钟情就买了", delta: { thinking: +16, tone: +6 } },
    ],
  },
  // ---------- Q17 slider：文化圈层（再测，加权） ----------
  {
    id: "q17",
    orderIndex: 17,
    type: "slider",
    text: "你的阅读版图，更偏向：",
    slider: {
      axis: "culture",
      leftLabel: "深耕本土东方",
      rightLabel: "放眼西方世界",
      leftDelta: -16,
      rightDelta: +16,
      defaultValue: 50,
    },
  },
  // ---------- Q18 choice：时空 + 世界观（经典 vs 当下） ----------
  {
    id: "q18",
    orderIndex: 18,
    type: "choice",
    text: "面对一个社会议题，你更想读：",
    options: [
      { id: "a", label: "历史上的人怎么看，回到源头", hint: "历史纵深", delta: { time: +18, worldview: -8 } },
      { id: "b", label: "当下最新的分析和数据", hint: "当下现代", delta: { time: -18, purpose: -8 } },
    ],
  },
  // ---------- Q19 fun：叙事口味 + 阅读深度（读完讲得出吗） ----------
  {
    id: "q19",
    orderIndex: 19,
    type: "fun",
    text: "合上一本书，让你复述它讲了什么：",
    options: [
      { id: "a", label: "条理清晰，能讲出三点", delta: { thinking: -14, depth: -10 } },
      { id: "b", label: "讲不太出来，但读着很享受", delta: { thinking: +16, tone: +10 } },
      { id: "c", label: "记得几句金句，剩下忘了", delta: { pace: +12, depth: +8 } },
    ],
  },
  // ---------- Q20 fun：社交 + 驱动（结尾梗题） ----------
  {
    id: "q20",
    orderIndex: 20,
    type: "fun",
    text: "最后一题，凭直觉：你心里的「读书人」是？",
    options: [
      { id: "a", label: "独坐窗前，与世隔绝的隐者", delta: { social: -16, drive: -6 } },
      { id: "b", label: "金句频出、人见人爱的话题王", delta: { social: +18, tone: +8 } },
      { id: "c", label: "永远在追问「为什么」的思考者", delta: { worldview: -14, drive: -8 } },
      { id: "d", label: "沉浸在故事里、容易落泪的人", delta: { drive: +16, purpose: +10 } },
    ],
  },
];

/** 题目总数（供进度条与校验使用） */
export const TOTAL_QUESTIONS = QUESTIONS.length;
