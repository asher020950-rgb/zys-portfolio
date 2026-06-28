# 个人作品集网站设计

## 概述

基于参考网站 [maxveilleux.com](https://maxveilleux.com/) 的设计风格，打造一个以三个字母 "ZYS" 为骨架的单页滚动作品集网站。采用手写 HTML/CSS/JS + Vite 开发环境，最终输出纯静态文件部署到 GitHub Pages。

## 技术栈

- **开发**: HTML5 + CSS3 + Vanilla JS
- **开发工具**: Vite（热更新、构建优化）
- **部署**: GitHub Pages（静态文件）
- **动画**: Intersection Observer API + CSS Transitions（零外部依赖起步，后期可按需引入 GSAP/Three.js）

## 页面结构

### 导航栏（固定顶部）

```
┌──────────────────────────────────────────────┐
│  Z     Y     S          🌙/☀️          Menu  │
└──────────────────────────────────────────────┘
```

- 三个字母"Z""Y""S"为导航链接，点击滚动到对应 section
- 右上角主题切换（深色/浅色）
- 滚动时高亮当前 section 对应的字母
- 背景随滚动渐变（透明 → 半透明）

### Hero 区（页面顶部）

```
┌──────────────────┬───────────────┐
│                  │               │
│ Z  Y  S  (大号)  │  个人简介文字   │ ← ZYS 字母可鼠标倾斜交互
│  装饰性并排展示   │  头像多层动效   │
│                  │               │
└──────────────────┴───────────────┘
```

Hero 区展示完整的 ZYS 三个字母 + 个人简介和头像。

### Section Z —— 个人介绍（Bio + 技能 + 奖项）

```
┌──────────────────┬────────────────────────────────┐
│                  │  头像区：多层堆叠/视差动效        │
│  侧边大号 "Z"    │  简介文字：姓名、标签、自我介绍   │
│  (鼠标倾斜交互)   │  技能栈：图标网格 / 标签云        │
│                  │  奖项/荣誉：时间线样式按年份排列   │
└──────────────────┴────────────────────────────────┘
```

进入 Z 区时，Y 和 S 已滑出，Z 以**侧边大号装饰元素**形式停留（参考网站 MAX 的布局方式）。

### Section Y —— 项目展示

```
┌──────────────────┬──────────────────────────────────┐
│                  │  项目卡片列表（垂直排列）            │
│  侧边大号 "Y"    │  ┌──────┐  ┌──────┐  桌面多列    │
│  (鼠标倾斜交互)   │  │ Card │  │ Card │              │
│                  │  └──────┘  └──────┘              │
│                  │  ┌──────┐                         │
│                  │  │ Card │             手机单列    │
│                  │  └──────┘                         │
└──────────────────┴──────────────────────────────────┘
```

每张卡片包含：项目截图、名称 + 简述、技术标签（Badge）、外链按钮（Demo/GitHub）

### Section S —— 联系方式

```
┌──────────────────┬──────────────────────────────────┐
│                  │  头像缩小版 / 装饰元素              │
│  侧边大号 "S"    │  Email（点击复制 + 提示 toast）    │
│  (鼠标倾斜交互)   │  GitHub / 社交链接图标             │
│                  │  简历下载按钮（PDF）               │
└──────────────────┴──────────────────────────────────┘
```

### Footer

版权信息 © 2026

## 视觉设计

### 配色方案（深色/浅色双主题）

采用 CSS Custom Properties 实现主题切换：

```css
:root {
  /* 浅色主题 */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent: #3b82f6;
  --border: #e5e5e5;
}

[data-theme="dark"] {
  /* 深色主题 */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --text-primary: #f5f5f5;
  --text-secondary: #999999;
  --accent: #60a5fa;
  --border: #2a2a2a;
}
```

### 排版

- 字体：系统字体栈 / Google Fonts（等确定后引入）
- 层级清晰的大标题、中标题、正文、小标签

### 动画系统

| 元素 | 动画方式 | 技术 |
|---|---|---|
| ZYS 字母（Hero） | 鼠标 hover 倾斜 | JS mousemove + CSS perspective |
| ZYS 字母（Section顶） | 鼠标 hover 倾斜 | 同上 |
| 头像 | 多层视差/堆叠 | Intersection Observer + transform |
| Section 内容 | 滚动渐入 | Intersection Observer + CSS transitions |
| 导航栏 | 滚动高亮 + 背景渐变 | JS scroll event |
| 主题切换 | 全局过渡 | CSS transition on body |

## 目录结构

```
d:\Portfolio\
├── index.html              # 主页面
├── style.css               # 全局样式
├── main.js                 # 交互逻辑
├── assets/
│   ├── images/
│   │   ├── avatar.webp     # 头像
│   │   ├── projects/       # 项目截图
│   └── resume.pdf          # 简历（可选）
├── vite.config.js          # Vite 配置
├── package.json
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-06-28-portfolio-design.md
└── README.md
```

## 部署方案

1. `vite build` 输出到 `dist/` 文件夹
2. GitHub 仓库启用 GitHub Pages，Source 指向 `dist/` 或使用 GitHub Actions 自动部署
3. 绑定自定义域名（可选）

## 不做的范围

- 不包含博客功能
- 不包含后台 CMS
- 不包含表单后端处理（Email 仅复制地址）
- 不包含多语言切换
- 不包含 PWA / Service Worker
- 不包含分析统计
