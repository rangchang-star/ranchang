# 燃场项目部署指南

## ✅ 已完成的工作

### 1. 数据库设计
- ✅ 设计了5个表：users（用户）、activities（活动）、visits（探访）、registrations（报名记录）
- ✅ 使用Drizzle ORM定义了Schema
- ✅ 配置了Supabase数据库连接

### 2. 数据迁移脚本
- ✅ 创建了表结构SQL文件（`src/storage/database/supabase/migrations/0000_uneven_wildside.sql`）
- ✅ 创建了数据导入脚本（`scripts/seed-data.ts`）
- ✅ 包含管理员账号和所有硬编码数据

### 3. API接口
- ✅ `/api/activities` - 活动的增删改查
- ✅ `/api/activities/[id]` - 单个活动的增删改查
- ✅ `/api/users` - 用户的创建和列表
- ✅ `/api/users/[id]` - 单个用户的查询和更新
- ✅ `/api/auth/login` - 用户登录
- ✅ `/api/registrations` - 报名记录的创建和查询

### 4. 配置文件
- ✅ `.env.local` - Supabase配置
- ✅ `drizzle.config.ts` - Drizzle配置
- ✅ `src/storage/database/supabase/schema.ts` - 数据库Schema
- ✅ `src/storage/database/supabase/connection.ts` - 数据库连接

---

## 🔧 手动操作步骤（由于网络限制）

由于当前环境无法直接连接Supabase，需要你在自己的环境中执行以下步骤：

### 步骤1：创建数据库表

1. 打开浏览器，访问：https://supabase.com/dashboard/project/yqttwnpuhkfytrnslqml/sql/new
2. 复制 `src/storage/database/supabase/migrations/0000_uneven_wildside.sql` 文件中的SQL
3. 粘贴到SQL Editor中
4. 点击 "Run" 执行
5. 确认看到以下4个表：activities, registrations, users, visits

### 步骤2：导入初始数据

在你的服务器环境中执行：

```bash
cd /path/to/your/project
pnpm install
npx tsx scripts/seed-data.ts
```

或者，你也可以在Supabase SQL Editor中手动执行 `docs/SUPABASE_SETUP_GUIDE.md` 中的数据插入SQL。

### 步骤3：验证数据

在Supabase SQL Editor中执行：

```sql
SELECT COUNT(*) FROM users;  -- 应该返回 6（1个管理员+5个会员）
SELECT COUNT(*) FROM activities;  -- 应该返回 4
SELECT COUNT(*) FROM visits;  -- 应该返回 2
```

---

## 📝 剩余工作

由于时间和网络限制，以下工作需要你确认数据库创建完成后，我可以继续完成：

1. **修改前端页面**
   - 发现页：从硬编码改为从API读取
   - 活动详情页：从硬编码改为从API读取
   - 连接详情页：从硬编码改为从API读取

2. **实现用户功能**
   - 用户注册页面
   - 用户登录页面
   - 用户个人中心（编辑资料）

3. **实现报名功能**
   - 前台点击"立即报名"
   - 后台查看报名列表
   - 报名状态管理

4. **完善后台管理**
   - 连接数据库
   - 实现活动的增删改查
   - 实现会员的增删改查
   - 实现探访的增删改查

---

## 🚀 下一步操作

**请你确认以下几点：**

1. ✅ 你是否已经在Supabase SQL Editor中创建了数据库表？
2. ✅ 你是否已经导入了初始数据（管理员账号+会员+活动）？
3. ✅ 你是否已经验证了数据导入成功？

**如果以上都已完成，请告诉我，我会继续：**
- 修改前端页面，从数据库读取数据
- 实现完整的用户注册和登录功能
- 实现活动报名功能
- 完善后台管理系统

**如果有任何问题，请随时告诉我！**

---

## 📞 测试账号

数据库创建后，你可以使用以下账号登录：

**管理员账号：**
- 手机号：13800138888
- 密码：zy818989
- 角色：admin

**测试会员账号：**
- 手机号：13800138001
- 密码：password123
- 角色：user

---

## 📊 数据库表结构

### users（用户/会员表）
```
id: 主键
phone: 手机号（唯一，用于登录）
password: 密码（加密）
nickname: 昵称
name: 姓名/花名
avatar: 头像URL
company: 公司
position: 职位
bio: 简介
role: 角色（user/admin）
status: 状态（active/inactive）
```

### activities（活动表）
```
id: 主键
title: 活动标题
subtitle: 副标题
category: 活动类型（private/salon/ai）
description: 活动描述
image: 封面图片
address: 地址
start_date: 开始时间
end_date: 结束时间
capacity: 最大人数
tea_fee: 茶水费
status: 状态（draft/active/ended/cancelled）
created_by: 创建者ID
```

### visits（探访表）
```
id: 主键
title: 探访标题
description: 探访描述
image: 封面图片
location: 探访地点
date: 探访日期
capacity: 最大人数
tea_fee: 茶水费
status: 状态（draft/active/ended/cancelled）
created_by: 创建者ID
```

### registrations（报名记录表）
```
id: 主键
user_id: 用户ID
activity_id: 活动ID（可为空）
visit_id: 探访ID（可为空）
status: 状态（registered/cancelled）
payment_status: 支付状态（paid/unpaid/offline）
created_at: 报名时间
```

---

## 🎯 关键API接口

### 活动相关
- `GET /api/activities` - 获取活动列表
- `GET /api/activities/:id` - 获取活动详情
- `POST /api/activities` - 创建活动
- `PUT /api/activities/:id` - 更新活动
- `DELETE /api/activities/:id` - 删除活动

### 用户相关
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users` - 创建用户（注册）
- `PUT /api/users/:id` - 更新用户信息

### 认证相关
- `POST /api/auth/login` - 用户登录

### 报名相关
- `GET /api/registrations` - 获取报名列表
- `POST /api/registrations` - 创建报名记录
