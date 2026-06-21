/**
 * 书格测评 — 全局 TypeScript 类型定义（6 维重构版）
 *
 * 6 维阅读人格坐标系：
 *   0 drive   消遣愉悦(0) ↔ 求知成长(100)
 *   1 mind    沉浸感受(0) ↔ 抽离分析(100)
 *   2 horizon 现实当下(0) ↔ 远方·历史·超验(100)
 *   3 texture 轻盈清澈(0) ↔ 厚重幽深(100)
 *   4 tempo   疾读如流(0) ↔ 慢嚼如品(100)
 *   5 stance  独处私语(0) ↔ 分享共鸣(100)
 */

// ============================================================
// 一、维度轴 (Axis)
// ============================================================

/** 6 个测评维度轴的稳定 key（顺序固定，对应向量下标 0–5） */
export type AxisKey =
  | "drive" //   轴1 阅读驱动：消遣愉悦(0) ←→ 求知成长(100)
  | "mind" //    轴2 思辨姿态：沉浸感受(0) ←→ 抽离分析(100)
  | "horizon" // 轴3 视野所向：现实当下(0) ←→ 远方·历史·超验(100)
  | "texture" // 轴4 文本口味：轻盈清澈(0) ←→ 厚重幽深(100)
  | "tempo" //   轴5 阅读节奏：疾读如流(0) ←→ 慢嚼如品(100)
  | "stance"; // 轴6 阅读姿态：独处私语(0) ←→ 分享共鸣(100)

/** 固定的轴顺序，决定向量下标 0–5。所有向量运算必须遵循此顺序。 */
export const AXIS_ORDER: readonly AxisKey[] = [
  "drive",
  "mind",
  "horizon",
  "texture",
  "tempo",
  "stance",
] as const;

/** 单个轴的元数据定义 */
export interface AxisDef {
  key: AxisKey;
  index: number; // 在向量中的下标 0–5
  name: string; // 维度名，如「阅读驱动」
  left: string; // 左端(0)语义
  right: string; // 右端(100)语义
  weight: number; // 书格匹配时的加权欧氏距离权重
  /** 雷达图（六边形）上展示的短标签 */
  radarLabel: string;
}

/** 用户 / 书 / 书格 共用的 6 维向量。长度恒为 6，下标遵循 AXIS_ORDER。 */
export type AxisVector = number[];

/** 人类可读的 6 轴分值（与 AxisVector 等价） */
export type AxisScores = Record<AxisKey, number>;

// ============================================================
// 二、问卷 (Quiz)
// ============================================================

/**
 * 题型：
 *   choice — 二选一情景题
 *   fun    — 有梗单选题
 *   slider — 滑块量表题
 *   taste  — 文本品味题８呈现两段不同文风的文字，选更被吸引的一段）
 *   books  — 开放题：最近读过的三本书（参与计算）
 */
export type QuestionType = "choice" | "slider" | "fun" | "taste" | "books";

/** 某个选项对各轴的分值增量（部分轴，缺省视为 0） */
export type AxisDelta = Partial<Record<AxisKey, number>>;

/** 选项（choice / fun / taste 题型使用） */
export interface QuestionOption {
  id: string; // 选项 id，如 "a" / "b"
  label: string; // 选项主文案 / 文本片段
  hint?: string; // 选项辅助说明（小字）
  /** taste 题：该片段的出处与文风注解（结果不强调，悬停或选后可见） */
  source?: string;
  /** 选中该选项时，对各轴施加的分值增量 */
  delta: AxisDelta;
}

/**
 * 滑块题配置：滑块从左(0)到右(100)，按比例把 range 内的增量施加到指定轴。
 */
export interface SliderConfig {
  axis: AxisKey;
  leftLabel: string;
  rightLabel: string;
  leftDelta: number;
  rightDelta: number;
  defaultValue?: number;
}

/** 一道问卷题 */
export interface Question {
  id: string;
  orderIndex: number; // 1-based 题号
  type: QuestionType;
  text: string; // 题干（可含 \n 换行）
  intro?: string; // 题型引导语（可选，taste / books 用）
  options?: QuestionOption[]; // choice / fun / taste 题
  slider?: SliderConfig; // slider 题
}

/** 用户对单题的作答 */
export interface QuizAnswer {
  questionId: string;
  optionId?: string; // choice / fun / taste：选中的选项 id
  sliderValue?: number; // slider：0–100
  books?: string[]; // books：最近读过的三本书书名
}

// ============================================================
// 三、书格 (BookGrid)
// ============================================================

export type NamingType = "behavior" | "identity";

/** 16 种书格之一的完整定义 */
export interface BookGrid {
  id: number; // 1–16
  slug: string;
  name: string;
  namingType: NamingType;
  shortDesc: string;
  /** 人格描述文案，按段落拆分；以「最吻合此格的一本书」的口吻写成（一书一格一文风） */
  description: string[];
  /** 这一格的「魂之书」——书格文风所模仿的那本书 */
  soulBook?: string;
  /** 文风注解，如「博尔赫斯式」「红楼梦式」 */
  voice?: string;
  traits: string[]; // 3 条典型特征
  prototypeVector: AxisVector; // 6 维原型向量（仅用于命名/描述匹配）
  shareTagline: string;
}

// ============================================================
// 四、图书 (Book)
// ============================================================

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
  description?: string;
  doubanId?: string;
  doubanScore: number;
  doubanRatingCount?: number;

  categoryDisplay: CategoryDisplay;
  categorySub?: string;
  clcCode?: string;
  tagsDouban?: string[];
  tagsCustom?: string[];

  // AI 标注：6 维向量 + 置信度
  axisVector: AxisVector; // 长度 6，下标遵循 AXIS_ORDER
  annotationConfidence: number; // 0–1
  annotationSource?: string;
  needsReview?: boolean;
}

// ============================================================
// 五、推荐结果 (Recommendation)
// ============================================================

export interface Recommendation {
  book: Book;
  isSurprise: boolean;
  reason: string;
  similarity: number;
}

export interface RecommendResult {
  bookgrid: BookGrid;
  userVector: AxisVector;
  recommendations: Recommendation[];
}

// ============================================================
// 六、会话 (QuizSession)
// ============================================================

export interface QuizSession {
  id?: string;
  sessionToken: string;
  userId?: string;
  answers: QuizAnswer[];
  userVector: AxisVector;
  bookgridSlug: string;
  recommendedBookIds: string[];
  createdAt?: string;
}
