# Supabase 数据库初始化指南

## 🔧 手动创建数据库表

由于当前环境无法直接连接到Supabase，请按照以下步骤手动创建数据库表：

### 步骤1：登录Supabase Dashboard
打开浏览器，访问：https://supabase.com/dashboard/project/yqttwnpuhkfytrnslqml/sql/new

### 步骤2：执行以下SQL

```sql
-- ========================================
-- 创建枚举类型
-- ========================================
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('user', 'admin');
CREATE TYPE IF NOT EXISTS user_status AS ENUM ('active', 'inactive');
CREATE TYPE IF NOT EXISTS activity_category AS ENUM ('private', 'salon', 'ai');
CREATE TYPE IF NOT EXISTS activity_status AS ENUM ('draft', 'active', 'ended', 'cancelled');
CREATE TYPE IF NOT EXISTS visit_status AS ENUM ('draft', 'active', 'ended', 'cancelled');
CREATE TYPE IF NOT EXISTS registration_status AS ENUM ('registered', 'cancelled');
CREATE TYPE IF NOT EXISTS payment_status AS ENUM ('paid', 'unpaid', 'offline');

-- ========================================
-- 创建用户表（会员表）
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  name VARCHAR(50),
  avatar TEXT,
  company VARCHAR(100),
  position VARCHAR(50),
  bio TEXT,
  role user_role DEFAULT 'user',
  status user_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ========================================
-- 创建活动表
-- ========================================
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(200),
  category activity_category DEFAULT 'private',
  description TEXT NOT NULL,
  image TEXT,
  address VARCHAR(200),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  capacity INTEGER DEFAULT 0,
  tea_fee INTEGER DEFAULT 0,
  status activity_status DEFAULT 'draft',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ========================================
-- 创建探访表
-- ========================================
CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  location VARCHAR(200),
  date TIMESTAMP,
  capacity INTEGER DEFAULT 0,
  tea_fee INTEGER DEFAULT 0,
  status visit_status DEFAULT 'draft',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ========================================
-- 创建报名记录表
-- ========================================
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity_id INTEGER REFERENCES activities(id),
  visit_id INTEGER REFERENCES visits(id),
  status registration_status DEFAULT 'registered',
  payment_status payment_status DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 步骤3：验证表创建成功

执行以下SQL查看创建的表：

```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

应该看到以下4个表：
- activities
- registrations
- users
- visits

## 📋 数据库表结构说明

### 1. users（用户/会员表）
- **id**: 主键
- **phone**: 手机号（唯一，用于登录）
- **password**: 密码（加密存储）
- **nickname**: 昵称
- **name**: 姓名/花名
- **avatar**: 头像URL
- **company**: 公司
- **position**: 职位
- **bio**: 简介
- **role**: 角色（user/admin）
- **status**: 状态（active/inactive）
- **created_at**: 创建时间
- **updated_at**: 更新时间

### 2. activities（活动表）
- **id**: 主键
- **title**: 活动标题
- **subtitle**: 副标题
- **category**: 活动类型（private/salon/ai）
- **description**: 活动描述
- **image**: 封面图片URL
- **address**: 地址
- **start_date**: 开始时间
- **end_date**: 结束时间
- **capacity**: 最大人数
- **tea_fee**: 茶水费
- **status**: 状态（draft/active/ended/cancelled）
- **created_by**: 创建者ID
- **created_at**: 创建时间
- **updated_at**: 更新时间

### 3. visits（探访表）
- **id**: 主键
- **title**: 探访标题
- **description**: 探访描述
- **image**: 封面图片URL
- **location**: 探访地点
- **date**: 探访日期
- **capacity**: 最大人数
- **tea_fee**: 茶水费
- **status**: 状态（draft/active/ended/cancelled）
- **created_by**: 创建者ID
- **created_at**: 创建时间
- **updated_at**: 更新时间

### 4. registrations（报名记录表）
- **id**: 主键
- **user_id**: 用户ID（外键）
- **activity_id**: 活动ID（外键，可为空）
- **visit_id**: 探访ID（外键，可为空）
- **status**: 状态（registered/cancelled）
- **payment_status**: 支付状态（paid/unpaid/offline）
- **created_at**: 报名时间

## ✅ 完成后

执行完上述SQL后，数据库表就创建完成了。接下来我会继续完成：
1. 数据迁移脚本（导入硬编码数据）
2. 前端页面修改（从数据库读取数据）
3. 用户注册和登录功能
4. 活动报名功能
5. 后台管理功能

所有代码都已经准备好，等你确认数据库表创建完成后，系统就能正常运行了！
