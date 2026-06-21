/**
 * 书格测评 — 全局 TypeScript 类型定义
 * 严格对应：
 *   - docs/03 测评维度与人格系统设计（10轴 / 16书格）
 *   - docs/04 图书数据集方案设计（字段）
 *   - docs/05 推荐匹配算法方案（向量 / 推荐结果）
 *   - docs/07 技术架构设计方案（DB Schema 对齐）
 */

// ============================================================
// 一、维度轴 (Axis)
// ============================================================

/** 10 个测评维度轴的稳定 key（顺序固定，对应向量下标 0–9） */
export type AxisKey =
  | "drive" //     轴1 阅读驱动力：探索未知(0) ←→ 情感共鸣(100)
  | "thinking" //  轴2 思维偏好：  系统逻辑(0) ←→ 感性联想(100)
  | "depth" //     轴3 阅读深度：  沉浸精读(0) ←→ 广泛涉猎(100)
  | "purpose" //   轴4 内容取向：  现实指向(0) ←→ 精神逃逸(100)
  | "time" //      轴5 时空偏好：  当下现代(0) ←→ 历史纵深(100)
  | "culture" //   轴6 文化圈层：  本土东方(0) ←→ 西方视野(100)
  | "tone" //      轴7 叙事口味：  严肃深刻(0) ←→ 轻盈有趣(100)
  | "worldview" // 轴8 世界观取向：批判解构(0) ←→ 建构向上(100)
  | "pace" //      轴9 阅读节奏：  规律持续(0) ←→ 随性爆发(100)
  | "social"; //   轴10 社交倾向： 独自消化(0) ←→ 强烈分享欲(100)

/** 固定的轴顺序，决定向量下标 0–9。所有向量运算必须遵循此顺序。 */
export const AXIS_ORDER: readonly AxisKey[] = [
  "drive",
  "thinking",
  "depth",
  "purpose",
  "time",
  "culture",
  "tone",
  "worldview",
  "pace",
  "social",
] as const;

/** 单个轴的元数据定义 */
export interface AxisDef {
  key: AxisKey;
  index: number; // 在向量中的下标 0–9
  name: string; // 维度名，如「阅读驱动力」
  left: string; // 左端(0)语义，如「探索未知」
  right: string; // 右端(100)语义，如「情感共鸣」
  weight: number; // 书格匹配时的加权欧氏距离权重
  /** 雷达图上展示的短标签（来自 demo.html 风格） */
  radarLabel: string;
}

/** 用户 / 书 / 书格 共用的 10 维向量。长度恒为 10，下标遵循 AXIS_ORDER。 */
export type AxisVector = number[];

/** 人类可读的 10 轴分值（与 AxisVector 等价，便于调试与 DB JSONB 存储） */
export type AxisScores = Record<AxisKey, number>;

// ============================================================
// 二、问卷 (Quiz)
// ============================================================

/** 题型：二选一情景 / 滑块量表 / 封面直觉 / 有梗单选 */
export type QuestionType = "choice" | "slider" | "image" | "fun";

/** 某个选项对各轴的分值增量（部分轴，缺省视为 0） */
export type AxisDelta = Partial<Record<AxisKey, number>>;

/** 选项（choice / image / fun 题型使用） */
export interface QuestionOption {
  id: string; // 选项 id，如 "a" / "b"
  label: string; // 选项主文案
  hint?: string; // 选项辅助说明（小字）
  coverUrl?: string; // image 题型：封面图 URL
  /** 选中该选项时，对各轴施加的分值增量 */
  delta: AxisDelta;
}

/**
 * 滑块题配置：滑块从左(0)到右(100)，按比例把 range 内的增量施加到指定轴。
 * 例：axis=depth, leftDelta=-20, rightDelta=+20，滑到最右则 depth +20。
 */
export interface SliderConfig {
  axis: AxisKey;
  leftLabel: string;
  rightLabel: string;
  leftDelta: number; // 滑到最左端时对该轴的增量
  rightDelta: number; // 滑到最右端时对该轴的增量
  defaultValue?: number; // 默认滑块位置 0–100，缺省 50
}

/** 一道问卷题 */
export interface Question {
  id: string;
  orderIndex: number; // 1-based 题号
  type: QuestionType;
  text: string; // 题干（可含 \n 换行）
  options?: QuestionOption[]; // choice / image / fun 题
  slider?: SliderConfig; // slider 题
}

/** 用户对单题的作答 */
export interface QuizAnswer {
  questionId: string;
  optionId?: string; // choice / image / fun：选中的选项 id
  sliderValue?: number; // slider：0–100
}

// ============================================================
// 三、书格 (BookGrid)
// ============================================================

export type NamingType = "behavior" | "identity";

/** 16 种书格之一的完整定义 */
export interface BookGrid {
  id: number; // 1–16
  slug: string; // 路由用，如 "shunzhe-shu-zhao-shu"
  name: string; // 「顺着书找书型」
  namingType: NamingType;
  shortDesc: string; // 一句话描述
  /** 人格描述文案，按段落拆分（结果页逐段展示，有梗扎心） */
  description: string[];
  traits: string[]; // 3 条典型特征
  prototypeVector: AxisVector; // 10 维原型向量（书格匹配用）
  shareTagline: string; // 分享卡片副文案
}

// ============================================================
// 四、图书 (Book) — 对应 docs/04 字段设计
// ============================================================

/** 对外展示的一级品类（12 类，docs/04） */
export type CategoryDisplay =
  | "文学小说"
  | "人文社科"
  | "科普科技"
  | "经管商业"
  | "成长励志"
  | "艺术设计"
  | "生活方式"
  | "传记纪实"
  | "古典经典"
  | "诗歌散文"
  | "儿童青少年"
  | "专业学术";

export interface Book {
  bookId: string;
  title: string;
  author: string;
  translator?: string;
  publisher?: string;
  pubYear?: number;
  isbn?: string;
  pages?: number;
  coverUrl?: string;
  description?: string; // 简介（200 字以内）
  doubanId?: string;
  doubanScore: number; // 豆瓣评分
  doubanRatingCount?: number;

  // 分类
  categoryDisplay: CategoryDisplay;
  categorySub?: string;
  clcCode?: string; // 中图分类号
  tagsDouban?: string[];
  tagsCustom?: string[];

  // AI 标注（核心）：10 维向量 + 置信度
  axisVector: AxisVector; // 长度 10，下标遵循 AXIS_ORDER
  annotationConfidence: number; // 0–1
  annotationSource?: string;
  needsReview?: boolean;
}

// ============================================================
// 五、推荐结果 (Recommendation) — 对应 docs/05
// ============================================================

/** 单条推荐（含是否意外推荐与推荐理由） */
export interface Recommendation {
  book: Book;
  isSurprise: boolean; // 是否为「适度意外」推荐
  reason: string; // 一句话推荐理由（有梗）
  similarity: number; // 与用户向量的余弦相似度（调试用）
}

/** /api/recommend 的完整返回 */
export interface RecommendResult {
  bookgrid: BookGrid;
  userVector: AxisVector;
  recommendations: Recommendation[]; // 3–5 本，精准在前、意外在后
}

// ============================================================
// 六、会话 (QuizSession) — 预留账号体系，对应 docs/07
// ============================================================

export interface QuizSession {
  id?: string;
  sessionToken: string;
  userId?: string; // 预留
  answers: QuizAnswer[];
  userVector: AxisVector;
  bookgridSlug: string;
  recommendedBookIds: string[];
  createdAt?: string;
}
