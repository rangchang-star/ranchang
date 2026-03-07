# 燃场App业务流程说明报告

## 1. 项目概览

### 1.1 项目背景
**项目名称**：燃场App  
**目标用户**：35+人群  
**核心理念**：能力连接与困境解决平台，帮助中年人群发现能力光亮、点亮事业

### 1.2 核心功能模块
1. **发现光亮**
   - 能力连接
   - 活动推荐
   - 高燃宣告

2. **点亮事业**
   - 探访点亮
   - AI加油圈

3. **个人中心**
   - 个人信息管理
   - 硬核标签管理
   - 资源标签管理

4. **后台管理**
   - 会员管理
   - 活动管理
   - 资料管理
   - 访谈管理
   - 消息管理
   - 系统设置

### 1.3 技术栈
- **前端框架**：Next.js 16 (App Router)
- **UI框架**：React 18
- **开发语言**：TypeScript 5
- **样式方案**：Tailwind CSS 4
- **UI组件库**：shadcn/ui
- **数据库**：Supabase (PostgreSQL)
- **ORM**：Drizzle ORM
- **数据库驱动**：postgres
- **加密方案**：bcrypt
- **字体方案**：Google Fonts (Noto Sans SC + Inter)

---

## 2. 网站结构

### 2.1 页面导航结构

```
燃场App
├── 首页 (/)
│   ├── 高燃宣告（轮播图）
│   ├── 能力连接（用户列表）
│   └── 活动推荐
│
├── 发现 (/discover)
│   ├── 活动列表
│   ├── 活动详情
│   └── 活动报名
│
├── 点亮事业 (/ignite)
│   ├── 访谈列表
│   ├── 访谈详情
│   └── AI加油圈
│
├── 个人中心 (/profile)
│   ├── 个人信息展示
│   └── 编辑资料 (/profile/edit)
│
└── 后台管理 (/admin)
    ├── 会员管理 (/admin/members)
    │   ├── 会员列表
    │   ├── 会员详情 (/admin/members/[id])
    │   └── 编辑会员 (/admin/members/[id]/edit)
    │
    ├── 活动管理 (/admin/activities)
    │   ├── 活动列表
    │   ├── 创建活动 (/admin/activities/create)
    │   ├── 活动详情 (/admin/activities/[id])
    │   ├── 编辑活动 (/admin/activities/[id]/edit)
    │   └── 报名管理 (/admin/activities/[id]/registrations)
    │
    ├── 资料管理 (/admin/materials)
    │   ├── 资料列表
    │   ├── 每日加油 (/admin/materials/daily)
    │   │   ├── 创建 (/admin/materials/daily/create)
    │   │   └── 编辑 (/admin/materials/daily/[id]/edit)
    │   └── 行业文档 (/admin/materials/document)
    │       ├── 创建 (/admin/materials/document/create)
    │       └── 编辑 (/admin/materials/document/[id]/edit)
    │
    ├── 访谈管理 (/admin/visits)
    │   ├── 访谈列表
    │   ├── 创建访谈 (/admin/visits/create)
    │   └── 编辑访谈 (/admin/visits/[id]/edit)
    │
    ├── 咨询管理 (/admin/consultations)
    │   └── 咨询列表
    │
    ├── 消息管理 (/admin/messages)
    │   └── 消息列表
    │
    └── 系统设置 (/admin/settings)
        └── 基本设置
```

### 2.2 API路由结构

```
/src/app/api
├── auth
│   ├── login/route.ts        # 登录接口
│   └── logout/route.ts       # 登出接口
│
├── profile
│   ├── route.ts              # 获取/更新个人信息
│   └── hardcore-tags/route.ts # 管理硬核标签
│
└── admin
    ├── api
    │   ├── members/route.ts          # 会员列表
    │   ├── activities/route.ts       # 活动列表
    │   ├── materials/route.ts        # 资料列表
    │   ├── visits/route.ts           # 访谈列表
    │   ├── consultations/route.ts    # 咨询列表
    │   └── messages/route.ts         # 消息列表
    │
    └── members
        └── [id]
            └── route.ts              # 会员详情API
```

---

## 3. 业务逻辑

### 3.1 用户系统

#### 3.1.1 用户注册/登录流程
```
用户输入手机号和密码
    ↓
前端验证手机号格式和密码长度
    ↓
发送POST请求到 /api/auth/login
    ↓
后端验证手机号和密码
    ├─ 成功 → 返回用户信息和token
    │          → 前端存储用户信息到localStorage
    │          → 更新全局登录状态(AuthProvider)
    │          → 跳转到个人中心
    │
    └─ 失败 → 返回错误信息
              → 前端显示错误提示
```

#### 3.1.2 用户数据模型
```typescript
interface User {
  id: number;
  phone: string;
  password: string;          // bcrypt加密
  nickname: string;
  name: string;
  avatar: string;
  age: number;
  company: string;
  position: string;
  industry: string;
  bio: string;
  need: string;
  tagStamp: string;          // 标记类型：personLookingForJob/jobLookingForPerson
  tags: string[];            // 基础标签
  hardcoreTags: string[];    // 硬核标签（核心能力标签）
  resourceTags: string[];    // 资源标签
  isTrusted: boolean;        // 是否可信用户
  isFeatured: boolean;       // 是否首页推荐
  role: string;              // 角色：user/admin
  status: string;            // 状态：active/inactive
  connectionCount: number;   // 连接数量
  activityCount: number;     // 活动数量
  createdAt: string;
  updatedAt: string;
}
```

### 3.2 发现光亮模块

#### 3.2.1 能力连接
- **功能描述**：展示平台上的用户信息，帮助用户发现有能力连接价值的人
- **展示内容**：
  - 用户头像、姓名、年龄
  - 公司、职位、行业
  - 个人简介和需求描述
  - 硬核标签（核心能力标签）
  - 资源标签
  - 连接数量、活动数量
- **筛选功能**：
  - 按标签筛选
  - 按行业筛选
  - 搜索姓名
- **排序规则**：
  - 首页推荐用户优先（isFeatured = true）
  - 连接数量降序
  - 活动数量降序

#### 3.2.2 活动推荐
- **功能描述**：推荐适合用户参加的活动
- **活动类型**：
  - 线下聚会
  - 线上分享
  - 沙龙活动
- **报名流程**：
  ```
  用户点击活动详情
      ↓
  查看活动信息（时间、地点、主题）
      ↓
  点击"立即报名"
      ↓
  填写报名表单
      ↓
  提交报名信息
      ↓
  后台审核报名
  ```
- **活动数据模型**：
  ```typescript
  interface Activity {
    id: string;
    title: string;
    description: string;
    type: string;          // 活动类型
    date: string;
    location: string;
    organizer: string;     // 主办方
    capacity: number;      // 容量
    registered: number;    // 已报名人数
    status: string;        // 状态
    image: string;
  }
  ```

#### 3.2.3 高燃宣告
- **功能描述**：展示平台上的高燃宣言或用户故事
- **展示形式**：轮播图或卡片列表
- **内容来源**：
  - 平台精选的用户故事
  - 高燃语录
  - 成功案例

### 3.3 点亮事业模块

#### 3.3.1 访谈列表
- **功能描述**：展示行业大佬的访谈记录，为用户提供学习参考
- **访谈内容**：
  - 访谈对象姓名、职位
  - 访谈主题
  - 访谈时间
  - 访谈摘要
  - 访谈链接/视频
- **数据模型**：
  ```typescript
  interface Visit {
    id: string;
    title: string;
    guestName: string;
    guestPosition: string;
    guestCompany: string;
    date: string;
    summary: string;
    videoUrl: string;
    status: string;
  }
  ```

#### 3.3.2 AI加油圈
- **功能描述**：基于AI的智能问答和建议系统
- **核心能力**：
  - 智能问答
  - 行业建议
  - 能力提升建议
  - 职业规划建议
- **交互流程**：
  ```
  用户输入问题
      ↓
  AI分析问题
      ↓
  返回个性化建议
      ↓
  用户可收藏或分享
  ```

### 3.4 个人中心模块

#### 3.4.1 个人信息展示
- **展示内容**：
  - 用户头像、姓名、年龄
  - 公司、职位、行业
  - 个人简介
  - 当前需求
  - 硬核标签（蓝色背景）
  - 资源标签（灰色背景）
  - 连接数量、活动数量
- **操作按钮**：
  - 编辑资料
  - 完善信息引导（首次登录）

#### 3.4.2 编辑资料
- **编辑内容**：
  - 基本信息：姓名、年龄、头像
  - 职业信息：公司、职位、行业
  - 个人信息：简介、需求
  - 标签信息：硬核标签、资源标签
- **标签选择**：
  - 硬核标签：从预设标签中选择3个（AI技术、定方向、带兵打仗、搞定人等）
  - 资源标签：从预设标签中选择（资金、技术资源、客户资源等）
- **保存流程**：
  ```
  用户修改信息
      ↓
  点击"保存修改"
      ↓
  前端验证必填字段
      ↓
  发送PUT请求到 /api/profile
      ↓
  后端更新数据库
      ↓
  返回成功/失败信息
      ↓
  前端更新显示
  ```

### 3.5 后台管理模块

#### 3.5.1 会员管理
- **功能列表**：
  - 会员列表展示
  - 搜索会员（姓名、等级）
  - 标签筛选
  - 查看会员详情
  - 编辑会员信息
  - 导出会员数据
  - 设置会员状态（启用/禁用）
- **详情页面**：
  - 展示完整会员信息
  - 查看硬核标签和资源标签
  - 查看连接数量和活动数量
  - 管理会员状态
- **编辑页面**：
  - 修改基本信息
  - 修改标签信息
  - 设置首页推荐
  - 设置可信状态

#### 3.5.2 活动管理
- **功能列表**：
  - 活动列表展示
  - 创建新活动
  - 编辑活动信息
  - 查看报名列表
  - 审核报名申请
  - 取消活动
- **报名管理**：
  - 查看所有报名用户
  - 审核通过/拒绝
  - 导出报名名单

#### 3.5.3 资料管理
- **资料类型**：
  - 每日加油（每日激励内容）
  - 行业文档（行业报告、学习资料）
- **功能列表**：
  - 资料列表展示
  - 创建新资料
  - 编辑资料信息
  - 上传资料文件
  - 删除资料

#### 3.5.4 访谈管理
- **功能列表**：
  - 访谈列表展示
  - 创建新访谈
  - 编辑访谈信息
  - 上传访谈视频
  - 管理访谈状态

#### 3.5.5 咨询管理
- **功能列表**：
  - 咨询列表展示
  - 查看咨询详情
  - 回复咨询
  - 标记咨询状态

#### 3.5.6 消息管理
- **功能列表**：
  - 消息列表展示
  - 发送系统消息
  - 查看消息状态
  - 删除消息

#### 3.5.7 系统设置
- **设置内容**：
  - 网站基本信息
  - 管理员账户管理
  - 系统参数配置

---

## 4. 用户逻辑

### 4.1 新用户注册流程
```
新用户访问网站
    ↓
点击"登录/注册"按钮
    ↓
弹出登录模态框
    ↓
输入手机号和密码
    ↓
点击"登录"
    ↓
系统验证登录信息
    ├─ 验证成功
    │   ├─ 首次登录
    │   │   → 跳转到个人中心
    │   │   → 显示"完善信息"引导对话框
    │   │   → 点击"去完善"
    │   │   → 跳转到编辑资料页面
    │   │   → 完善基本信息和标签
    │   │   → 保存并返回首页
    │   │
    │   └─ 非首次登录
    │       → 跳转到首页
    │       → 显示个性化内容
    │
    └─ 验证失败
        → 显示错误提示
        → 重新输入
```

### 4.2 用户浏览流程
```
用户登录
    ↓
浏览首页
    ↓
查看"高燃宣告"内容
    ↓
浏览"能力连接"中的用户列表
    ↓
按标签筛选感兴趣的用户
    ↓
点击用户卡片查看详情
    ↓
查看"活动推荐"
    ↓
点击感兴趣的活动查看详情
    ↓
点击"立即报名"
    ↓
填写报名信息并提交
```

### 4.3 用户编辑资料流程
```
用户进入个人中心
    ↓
查看个人信息
    ↓
点击"编辑资料"按钮
    ↓
进入编辑页面
    ↓
修改基本信息（姓名、年龄、头像等）
    ↓
修改职业信息（公司、职位、行业）
    ↓
修改个人信息（简介、需求）
    ↓
选择硬核标签（最多3个）
    ↓
选择资源标签（无限制）
    ↓
点击"保存修改"
    ↓
系统验证并保存
    ↓
返回个人中心查看更新后的信息
```

### 4.4 管理员操作流程

#### 4.4.1 会员管理流程
```
管理员登录后台
    ↓
进入"会员管理"
    ↓
查看会员列表
    ↓
搜索特定会员（姓名、标签）
    ↓
点击"查看"查看会员详情
    ↓
点击"编辑"修改会员信息
    ↓
设置会员状态（启用/禁用）
    ↓
设置首页推荐
    ↓
导出会员数据
```

#### 4.4.2 活动管理流程
```
管理员登录后台
    ↓
进入"活动管理"
    ↓
点击"创建活动"
    ↓
填写活动信息（标题、描述、时间、地点等）
    ↓
上传活动图片
    ↓
发布活动
    ↓
查看报名列表
    ↓
审核报名申请
    ↓
导出报名名单
```

---

## 5. 数据流转

### 5.1 用户数据流
```
用户提交登录信息
    ↓
/api/auth/login (POST)
    ↓
验证用户信息
    ↓
返回用户数据 (User对象)
    ↓
前端存储到localStorage
    ↓
更新AuthProvider状态
    ↓
全局共享用户信息
    ↓
所有页面获取用户信息
    ↓
根据用户信息展示个性化内容
```

### 5.2 硬核标签数据流
```
用户在编辑页面选择标签
    ↓
前端验证标签数量（最多3个）
    ↓
发送PUT请求到 /api/profile/hardcore-tags
    ↓
后端更新数据库中的hardcoreTags字段
    ↓
返回更新后的用户数据
    ↓
前端更新个人中心显示
    ↓
后台管理同步更新
    ↓
能力连接页面同步更新
```

### 5.3 会员管理数据流
```
管理员进入会员管理
    ↓
前端加载会员列表
    ↓
调用GET /admin/api/members
    ↓
后端从数据库获取所有会员
    ↓
返回会员数据数组
    ↓
前端渲染会员列表
    ↓
管理员点击"查看"或"编辑"
    ↓
跳转到对应页面
    ↓
加载单个会员详情
    ↓
调用GET /admin/api/members/[id]
    ↓
返回单个会员数据
    ↓
前端渲染详情页面
```

---

## 6. 核心技术实现

### 6.1 数据库设计

#### 6.1.1 用户表（users）
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  name VARCHAR(50),
  avatar TEXT,
  age INTEGER,
  company VARCHAR(100),
  position VARCHAR(50),
  industry VARCHAR(50),
  bio TEXT,
  need TEXT,
  tagStamp VARCHAR(50),
  tags TEXT[],
  hardcoreTags TEXT[],
  resourceTags TEXT[],
  isTrusted BOOLEAN DEFAULT FALSE,
  isFeatured BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  connectionCount INTEGER DEFAULT 0,
  activityCount INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.1.2 活动表（activities）
```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  date TIMESTAMP,
  location VARCHAR(200),
  organizer VARCHAR(100),
  capacity INTEGER,
  registered INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming',
  image TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.1.3 访谈表（visits）
```sql
CREATE TABLE visits (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  guestName VARCHAR(50),
  guestPosition VARCHAR(50),
  guestCompany VARCHAR(100),
  date TIMESTAMP,
  summary TEXT,
  videoUrl TEXT,
  status VARCHAR(20) DEFAULT 'published',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.1.4 资料表（materials）
```sql
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'daily' 或 'document'
  content TEXT,
  fileUrl TEXT,
  author VARCHAR(50),
  status VARCHAR(20) DEFAULT 'published',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 API接口设计

#### 6.2.1 用户认证接口
**POST /api/auth/login**
- 请求参数：
  ```json
  {
    "phone": "13023699913",
    "password": "password123"
  }
  ```
- 响应数据：
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "phone": "13023699913",
        "nickname": "张明",
        ...
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### 6.2.2 个人信息接口
**GET /api/profile**
- 响应数据：
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "张明",
      "hardcoreTags": ["AI技术", "带兵打仗", "看懂账本"],
      "resourceTags": ["技术资源", "项目经验"],
      ...
    }
  }
  ```

**PUT /api/profile**
- 请求参数：
  ```json
  {
    "name": "张明",
    "age": 38,
    "company": "智联科技有限公司",
    "position": "技术总监",
    "industry": "互联网",
    "bio": "15年互联网行业经验...",
    "need": "寻找AI项目合作伙伴...",
    "hardcoreTags": ["AI技术", "带兵打仗", "看懂账本"],
    "resourceTags": ["技术资源", "项目经验"]
  }
  ```

#### 6.2.3 会员管理接口
**GET /admin/api/members**
- 响应数据：
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "张明",
        "age": 38,
        "hardcoreTags": ["AI技术", "带兵打仗", "看懂账本"],
        "resourceTags": ["技术资源", "项目经验"],
        "connectionCount": 12,
        "activityCount": 3,
        "isFeatured": true,
        ...
      }
    ]
  }
  ```

### 6.3 状态管理

#### 6.3.1 全局登录状态（AuthProvider）
```typescript
interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
```

#### 6.3.2 登录模态框状态（LoginModalProvider）
```typescript
interface LoginModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
```

### 6.4 数据降级策略

为了确保开发环境的可用性，系统实现了数据降级策略：

```typescript
// 数据库连接失败时，自动切换到模拟数据
try {
  // 尝试连接真实数据库
  const data = await database.query('SELECT * FROM users');
  return data;
} catch (error) {
  console.warn('数据库连接失败，使用模拟数据');
  // 返回模拟数据
  return mockUsers;
}
```

**模拟数据位置**：`src/lib/mock-database.ts`

---

## 7. 关键业务规则

### 7.1 用户认证规则
- 登录方式：手机号 + 密码
- 密码加密：使用bcrypt加密存储
- 会话管理：使用localStorage存储用户信息
- 登录验证：每次请求时验证用户token

### 7.2 标签规则
- **硬核标签**：
  - 每个用户最多选择3个
  - 预设标签包括：AI技术、定方向、带兵打仗、搞定人、稳军心、看懂账本、卖出去、会说人话、从0到1、找人识人、摆平烂摊、搞定自己
  - 背景色：蓝色（bg-blue-100）
  - 文字色：黑色（text-black）

- **资源标签**：
  - 无数量限制
  - 预设标签包括：资金、技术资源、客户资源、产品、团队、教育资源、营销资源、媒体资源、行业经验、项目经验、设计资源、创意团队
  - 背景色：灰色（bg-gray-100）
  - 文字色：灰色（text-gray-600）

### 7.3 用户展示规则
- **首页推荐**：
  - isFeatured = true的用户优先展示
  - 在首页"能力连接"模块置顶

- **用户排序**：
  - 首页推荐用户优先
  - 按连接数量降序
  - 按活动数量降序

### 7.4 活动报名规则
- 活动有容量限制（capacity）
- 已报名人数（registered）不能超过容量
- 报名需要填写基本信息
- 报名需要后台审核

### 7.5 权限规则
- **普通用户（user）**：
  - 查看个人信息
  - 编辑个人资料
  - 浏览活动和访谈
  - 报名活动

- **管理员（admin）**：
  - 拥有所有普通用户权限
  - 管理会员信息
  - 管理活动、资料、访谈
  - 查看咨询和消息
  - 系统设置

---

## 8. 系统特性

### 8.1 响应式设计
- 支持PC端和移动端访问
- 使用Tailwind CSS实现自适应布局
- 移动端优化触摸交互

### 8.2 数据同步
- 前端、个人中心、后台管理使用同一数据源
- 硬核标签数据统一通过用户ID关联
- 实时同步更新

### 8.3 错误处理
- 数据库连接失败时自动降级到模拟数据
- API请求失败时显示友好错误提示
- 表单验证时提供实时反馈

### 8.4 性能优化
- 使用Next.js 16的App Router优化页面加载
- 图片使用Next.js的Image组件优化
- 使用模拟数据提升开发环境性能

---

## 9. 部署方案

### 9.1 服务器环境
- 操作系统：Rocky Linux 9.4
- 云服务商：阿里云
- Node.js版本：18+
- 数据库：Supabase (PostgreSQL)

### 9.2 部署流程
```bash
# 1. 安装依赖
pnpm install

# 2. 构建项目
pnpm build

# 3. 启动服务
pnpm start
```

### 9.3 环境变量
```env
# Supabase配置
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 数据库配置
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## 10. 后续开发建议

### 10.1 短期优化
1. 完善错误处理和用户反馈
2. 优化移动端体验
3. 添加更多单元测试
4. 完善API文档

### 10.2 中期功能
1. 实现实时聊天功能
2. 添加消息通知系统
3. 实现用户关注功能
4. 添加评价和评分系统

### 10.3 长期规划
1. 实现AI智能匹配算法
2. 开发移动端App
3. 集成第三方登录
4. 实现数据分析看板

---

## 11. 总结

燃场App是一个面向35+人群的能力连接与困境解决平台，通过"发现光亮"和"点亮事业"两大核心功能模块，帮助用户发现能力连接价值、解决职业困境。

系统采用现代化的技术栈（Next.js 16 + React 18 + TypeScript 5 + Supabase），实现了完整的用户系统、活动管理、访谈管理、资料管理等功能模块。前后端分离架构确保了系统的可扩展性和维护性，数据降级策略确保了开发环境的稳定性。

通过清晰的业务流程设计和完善的数据流转机制，系统能够为用户提供流畅的使用体验，为管理员提供高效的管理工具。后续可根据实际使用情况进行功能迭代和性能优化。

---

**报告生成时间**：2025年1月
**版本**：v1.0
**维护者**：开发团队
