# 书格测评 · BookGrid Quiz

一个 MBTI 风格的图书推荐网站。用户回答 20 道题 → 映射为 10 维阅读人格向量 → 匹配 16 种「书格」之一 → 获得 3–5 本个性化书单(2–3 本精准命中 + 1–2 本意外惊喜)。

视觉风格参考 The Pudding 的深色长卷叙事(暗背景、衬线标题、暖金强调色)。

## 技术栈

- **Next.js 14**(App Router)+ **TypeScript**(strict)
- **Tailwind CSS** + 原生 CSS 变量主题
- 数据层抽象(`lib/data-source.ts`),MVP 阶段使用内置结构化数据,后续可平滑切换至 Supabase / pgvector
- **纯静态导出**(`output: 'export'`),算法在浏览器端运行,无服务端依赖
- 部署目标:**GitHub Pages**(亦兼容 Vercel)

## 核心机制

| 环节 | 实现 | 文件 |
| --- | --- | --- |
| 答案 → 向量 | 中性基线 50,逐题叠加 option delta / 滑块线性插值,clamp 0–100 | `lib/quiz-scorer.ts` |
| 向量 → 书格 | 加权欧氏距离,16 个原型最近邻 | `lib/bookgrid-matcher.ts` |
| 书格 → 书单 | 余弦相似度 Top-20 → 置信度过滤 → 品类去重选精准;模糊轴扰动选惊喜 | `lib/recommend.ts` |

### 10 个测评维度

固定顺序(`AXIS_ORDER`):驱动 / 思维 / 深度 / 取向 / 时空 / 文化 / 口味 / 世界观 / 节奏 / 社交。各维度带权重做加权欧氏距离匹配。

### 数据规模

- **82** 本种子书目(覆盖 12 个品类,豆瓣评分 ≥ 7.5)
- **16** 种书格人格
- **20** 道题(8 二选一 / 8 有梗单选 / 3 滑块 / 1 封面直觉)

## 项目结构

```
app/
  page.tsx                 # 首页(服务端组件,装配数据)
  layout.tsx
  globals.css              # 全站主题与组件样式
  api/recommend/route.ts   # POST 推荐接口
  result/[slug]/page.tsx   # 16 种书格的可分享静态结果页(SSG)
components/
  QuizApp.tsx              # 单页编排:landing → 引子 → 问卷 → 结果
  quiz/QuestionView.tsx    # 4 种题型渲染
  result/RadarChart.tsx    # 纯 SVG 雷达图
  result/ResultView.tsx    # 结果展示
  result/ResultStandalone.tsx
lib/                       # 算法与数据访问层
data/                      # axes / bookgrids / questions / books
types/index.ts             # 核心类型定义
docs/                      # 设计文档(00–08)与 demo.html
```

## 本地开发

```bash
npm install
npm run dev        # 本地开发服务器 http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # 生产构建
```

> 编译器使用 Next.js 内置 SWC(无需 Babel 配置)。

## 部署到 GitHub Pages(纯静态)

本项目已改造为**纯前端静态站点**:测评算法(答案→向量→书格→书单)全部在浏览器端运行,无需任何服务端,因此可直接托管到 GitHub Pages。

1. 在 GitHub 新建一个仓库(任意名,例如 `bookrecommend`)。
2. 把本目录推送上去:
   ```bash
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git branch -M main
   git push -u origin main
   ```
3. 打开仓库 **Settings → Pages**,在 **Build and deployment → Source** 选择 **GitHub Actions**。
4. 推送后,`.github/workflows/deploy.yml` 会自动:`npm ci` → `next build`(静态导出到 `out/`)→ 部署到 Pages。
5. 部署完成后访问 `https://<你的用户名>.github.io/<仓库名>/` 即可游玩。

> **子路径适配**:GitHub Pages 项目站点位于 `/<仓库名>/` 子路径下。工作流通过 `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}` 自动注入正确的 `basePath`/`assetPrefix`,无需手改代码;换仓库名也能直接用。

### 本地预览静态产物

```bash
npm run build        # 产物输出到 out/
npx serve out        # 或任意静态服务器预览(根路径)
```

## (可选)部署到 Vercel

也可一键部署到 Vercel(框架自动识别为 Next.js,见 `vercel.json`)。若仅用 Pages,可忽略 `vercel.json`。

## 文档

完整的方向规划、维度系统、数据集方案、推荐算法、UX 设计与技术架构见 `docs/` 目录。
