# 燃场 App - 部署说明

## 当前状态

### ✅ 已完成

1. **前端页面开发**
   - 发现页（能力连接、活动推荐、高燃宣告）
   - 连接详情页
   - 活动详情页
   - 个人中心
   - 底部导航组件

2. **后端 API 开发**
   - 用户列表 API (`/api/users`)
   - 用户详情 API (`/api/users/[id]`)
   - 活动列表 API (`/api/activities`)
   - 活动详情 API (`/api/activities/[id]`)

3. **数据库 Schema 定义**
   - 用户表（users）
   - 活动表（activities）
   - 活动报名表（activity_enrollments）
   - 用户关注表（user_follows）
   - 活动点赞表（activity_likes）

### ⚠️ 当前限制

**沙箱环境网络限制**：当前开发环境的 DNS 无法解析 Supabase 域名，导致无法连接到真实的 Supabase 数据库。

**临时解决方案**：所有 API 已配置为在数据库连接失败时自动切换到模拟数据，确保页面可以正常显示和交互。

## 部署到生产环境

### 1. 环境变量配置

在生产环境中，需要配置以下环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 数据库连接
DATABASE_URL=postgresql://postgres:password@your-project.pooler.supabase.com:5432/postgres
```

### 2. 数据库初始化

#### 方式一：使用 Supabase Dashboard

1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 执行以下 SQL 脚本（位于 `scripts/init-schema.sql`）

```sql
-- 创建用户表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  name VARCHAR(50),
  avatar TEXT,
  age INTEGER,
  company VARCHAR(100),
  position VARCHAR(50),
  industry VARCHAR(50),
  bio TEXT,
  need TEXT,
  tag_stamp VARCHAR(50) DEFAULT 'pureExchange',
  tags TEXT[],
  hardcore_tags TEXT[],
  resource_tags TEXT[],
  is_trusted BOOLEAN DEFAULT false,
  role VARCHAR(20) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建活动表
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image TEXT,
  capacity INTEGER,
  tea_fee DECIMAL(10, 2) DEFAULT 0,
  address TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_category ON activities(category);
```

#### 方式二：使用 Drizzle Kit 迁移

```bash
# 生成迁移文件
pnpm drizzle-kit generate

# 执行迁移
pnpm drizzle-kit push
```

### 3. 数据导入（可选）

如果需要导入初始数据，可以：

1. 使用 Supabase Dashboard 的 Table Editor 手动添加
2. 或创建导入脚本：

```bash
# 运行导入脚本
node scripts/import-mock-data.js
```

### 4. 验证部署

```bash
# 测试用户 API
curl https://your-domain.com/api/users

# 测试活动 API
curl https://your-domain.com/api/activities

# 测试用户详情 API
curl https://your-domain.com/api/users/1

# 测试活动详情 API
curl https://your-domain.com/api/activities/1
```

## API 接口文档

### 用户相关

#### 获取用户列表
```
GET /api/users

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张明",
      "age": 38,
      "avatar": "https://...",
      "industry": "互联网",
      "tags": ["技术", "管理"],
      "need": "寻找AI项目合作伙伴",
      ...
    }
  ]
}
```

#### 获取用户详情
```
GET /api/users/[id]

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "张明",
    "abilityTags": ["技术架构", "团队管理"],
    "resourceTags": ["资金", "人脉"],
    ...
  }
}
```

### 活动相关

#### 获取活动列表
```
GET /api/activities

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "AI在传统行业的应用实践",
      "category": "AI技术",
      "startDate": "2024-03-20 14:00:00",
      ...
    }
  ]
}
```

#### 获取活动详情
```
GET /api/activities/[id]

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "AI在传统行业的应用实践",
    "description": "...",
    "capacity": 30,
    "teaFee": 50,
    ...
  }
}
```

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 组件**: shadcn/ui
- **样式方案**: Tailwind CSS 4
- **数据库**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **语言**: TypeScript 5

## 开发指南

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问应用
http://localhost:5000
```

### 数据库操作

```bash
# 生成迁移
pnpm drizzle-kit generate

# 推送数据库变更
pnpm drizzle-kit push

# 查看数据库状态
pnpm drizzle-kit studio
```

## 常见问题

### Q: 为什么本地环境显示模拟数据？
A: 沙箱环境的网络限制无法访问 Supabase 数据库。在生产环境配置正确的 DATABASE_URL 后，会自动切换到真实数据。

### Q: 如何切换到真实数据库？
A: 在 `.env.local` 文件中配置正确的 `DATABASE_URL`，API 会自动检测并使用数据库连接。

### Q: 如何添加新的 API 接口？
A: 在 `src/app/api` 目录下创建新的路由文件，参考现有的 `/api/users` 和 `/api/activities` 实现。

## 联系支持

如有问题，请联系开发团队或提交 Issue。
