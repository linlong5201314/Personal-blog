# Design Document

## Overview

本设计文档描述了个人网页的技术架构和实现方案。该网页是一个单页应用（SPA），使用现代前端技术栈构建，展示用户的兴趣爱好、个人特质和交友期望。网页采用响应式设计，确保在各种设备上都能提供良好的用户体验。

## Architecture

### 技术选型

- **框架**: 纯 HTML5 + CSS3 + JavaScript（轻量级，无需复杂框架）
- **样式**: CSS3 with Flexbox/Grid 布局，CSS 变量实现主题配色
- **图标**: 使用 Font Awesome 或 SVG 图标
- **动画**: CSS 过渡和动画效果
- **响应式**: Media Queries 实现多端适配

### 页面结构

```
┌─────────────────────────────────────┐
│           Navigation Bar            │
├─────────────────────────────────────┤
│         Introduction Section        │
│         (Hero + Self-intro)         │
├─────────────────────────────────────┤
│          Hobby Section              │
│    ┌─────────┬─────────┬─────────┐  │
│    │ Sports  │ Leisure │  Tech   │  │
│    └─────────┴─────────┴─────────┘  │
├─────────────────────────────────────┤
│          Trait Section              │
│    ┌─────────┬─────────┬─────────┐  │
│    │Friendly │ Patient │ Caring  │  │
│    └─────────┴─────────┴─────────┘  │
├─────────────────────────────────────┤
│        Friendship Section           │
│         + Contact CTA               │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

## Components and Interfaces

### 1. Navigation Component

```
NavigationBar
├── Logo/Name
├── NavLinks[]
│   ├── 关于我 (#introduction)
│   ├── 兴趣爱好 (#hobbies)
│   ├── 个人特质 (#traits)
│   └── 交友期望 (#friendship)
└── MobileMenuToggle (hamburger icon for mobile)
```

**行为**:
- 固定在页面顶部
- 点击链接平滑滚动到对应区域
- 移动端显示汉堡菜单

### 2. Introduction Section Component

```
IntroductionSection
├── Greeting ("嗨～欢迎来到我的小天地！")
├── Avatar/Illustration (可选)
├── IntroText (自我介绍文案)
└── HighlightTags[] (关键词标签)
```

### 3. Hobby Section Component

```
HobbySection
├── SectionTitle ("兴趣爱好")
├── HobbyCategory[]
│   ├── CategoryIcon
│   ├── CategoryTitle
│   └── HobbyItem[]
│       ├── Icon
│       ├── Name
│       └── Description
```

**分类数据**:
- 运动类: 羽毛球、跑步
- 休闲类: 刷抖音、追剧、王者荣耀
- 技术类: AI小玩意

### 4. Trait Section Component

```
TraitSection
├── SectionTitle ("个人特质")
└── TraitCard[]
    ├── Icon
    ├── TraitName
    └── TraitDescription
```

**特质数据**:
- 待人友好
- 有耐心
- 重视羁绊

### 5. Friendship Section Component

```
FriendshipSection
├── SectionTitle ("交友期望")
├── FriendTypeCard[]
│   ├── Icon
│   ├── TypeName
│   └── Description
├── CriteriaList (真诚、共同话题)
└── CallToAction ("欢迎来找我唠嗑")
```

### 6. Footer Component

```
Footer
├── ContactLinks[]
│   └── SocialLink (icon + url)
└── Copyright
```

## Data Models

### Content Data Structure

```typescript
interface PersonalWebsiteData {
  introduction: Introduction;
  hobbies: HobbyCategory[];
  traits: Trait[];
  friendship: FriendshipExpectation;
  contact: ContactInfo;
}

interface Introduction {
  greeting: string;
  fullText: string;
  highlightKeywords: string[];
}

interface HobbyCategory {
  id: string;
  name: string;           // "运动类" | "休闲类" | "技术类"
  icon: string;
  items: HobbyItem[];
}

interface HobbyItem {
  name: string;
  description: string;
  icon: string;
}

interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface FriendshipExpectation {
  desiredFriendTypes: FriendType[];
  criteria: string[];
  callToAction: string;
}

interface FriendType {
  name: string;
  description: string;
  icon: string;
}

interface ContactInfo {
  socialLinks: SocialLink[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the acceptance criteria analysis, the following properties can be verified through testing:

### Property 1: Responsive Layout Consistency

*For any* viewport width between 320px and 1920px, the Personal_Website layout SHALL adapt without horizontal overflow and all content SHALL remain accessible and readable.

**Validates: Requirements 1.3**

### Property 2: Interactive Element Accessibility

*For any* clickable or interactive element on the Personal_Website, that element SHALL have defined hover and focus states that provide visual feedback to users.

**Validates: Requirements 6.3**

### Property 3: Keyboard Navigation Completeness

*For any* interactive element on the Personal_Website, that element SHALL be reachable via keyboard tab navigation and SHALL be focusable.

**Validates: Requirements 6.4**

### Property 4: Section Order Invariant

*For any* rendering of the Personal_Website, the sections SHALL appear in the DOM in the following order: Introduction, Hobbies, Traits, Friendship.

**Validates: Requirements 1.2**

### Property 5: Navigation Link Completeness

*For any* section on the Personal_Website, there SHALL exist a corresponding navigation link that scrolls to that section.

**Validates: Requirements 1.1**

## Error Handling

### 页面加载错误

- 如果图标字体加载失败，使用 CSS 备用方案或 Unicode 符号
- 如果图片加载失败，显示占位符或备用背景色

### 浏览器兼容性

- 使用 CSS 前缀确保跨浏览器兼容
- 为不支持 CSS Grid 的浏览器提供 Flexbox 降级方案

### 响应式断点处理

```css
/* 移动端优先 */
/* 默认样式适用于 < 768px */

/* 平板 */
@media (min-width: 768px) { }

/* 桌面 */
@media (min-width: 1024px) { }

/* 大屏 */
@media (min-width: 1440px) { }
```

## Testing Strategy

### 单元测试

由于这是一个静态网页项目，传统单元测试的适用性有限。主要测试点包括：

1. **内容完整性测试**: 验证所有必需的内容元素存在
2. **链接有效性测试**: 验证导航链接和联系方式链接正确
3. **DOM 结构测试**: 验证页面结构符合设计规范

### 属性测试 (Property-Based Testing)

使用 **Playwright** 进行端到端属性测试，验证以下属性：

1. **响应式布局属性**: 在不同视口宽度下测试布局适应性
2. **可访问性属性**: 测试键盘导航和焦点状态
3. **交互反馈属性**: 测试悬停和点击状态

### 测试框架选择

- **E2E 测试**: Playwright（支持多浏览器、响应式测试）
- **可访问性测试**: axe-core（集成到 Playwright）

### 测试标注格式

每个属性测试必须使用以下格式标注：
```javascript
// **Feature: personal-website, Property {number}: {property_text}**
```

## Visual Design Specifications

### 配色方案

```css
:root {
  /* 主色调 - 温暖友好 */
  --color-primary: #FF6B6B;      /* 珊瑚红 */
  --color-secondary: #4ECDC4;    /* 青绿色 */
  --color-accent: #FFE66D;       /* 暖黄色 */
  
  /* 中性色 */
  --color-text: #2C3E50;         /* 深灰文字 */
  --color-text-light: #7F8C8D;   /* 浅灰文字 */
  --color-background: #FAFAFA;   /* 背景色 */
  --color-card: #FFFFFF;         /* 卡片背景 */
  
  /* 阴影 */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
}
```

### 字体规范

```css
:root {
  --font-primary: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --line-height: 1.6;
}
```

### 间距系统

```css
:root {
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
}
```

## File Structure

```
personal-website/
├── index.html              # 主页面
├── css/
│   ├── styles.css          # 主样式文件
│   └── responsive.css      # 响应式样式
├── js/
│   └── main.js             # 交互脚本（导航、平滑滚动）
├── assets/
│   └── icons/              # SVG 图标
└── tests/
    └── e2e/
        └── website.spec.js # Playwright 测试
```
