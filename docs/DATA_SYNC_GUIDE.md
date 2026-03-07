# 前端模拟数据同步到后台数据库指南

本文档说明如何将前端页面的模拟数据（硬编码数据）同步到 Supabase 数据库。

## 📋 概述

前端页面包含以下模拟数据：
- **10个会员数据**（发现页、连接详情页）
- **3个活动数据**（发现页、活动详情页）
- **2个探访数据**（后台预设）

所有数据已从前端页面提取并准备导入到 Supabase 数据库。

## 🗄️ 数据库 Schema 更新

数据库 Schema 已扩展，新增以下字段以支持会员完整信息：

### users 表新增字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `age` | integer | 年龄 |
| `industry` | varchar(50) | 行业 |
| `need` | text | 需求描述 |
| `tag_stamp` | tag_stamp enum | 标签类型（personLookingForJob/jobLookingForPerson/pureExchange） |
| `tags` | jsonb | 能力标签数组 |
| `hardcore_tags` | jsonb | 硬核标签数组（详细） |
| `resource_tags` | jsonb | 资源标签数组 |
| `is_trusted` | boolean | 是否可信 |

## 🚀 部署步骤

### 步骤 1: 在 Supabase SQL Editor 中执行数据库迁移

1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 执行以下迁移脚本：

```bash
# 迁移文件位置
src/storage/database/supabase/migrations/0002_complete_schema.sql
```

**迁移脚本内容：**
- 创建所有枚举类型
- 创建 users、activities、visits、registrations 表（包含扩展字段）
- 创建外键约束
- 创建索引（优化查询性能）
- 创建视图（活动/探访报名统计）
- 创建触发器（自动更新 updated_at）

### 步骤 2: 配置环境变量

确保 `.env.local` 文件包含以下配置：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 步骤 3: 导入初始数据

在服务器环境中运行以下命令导入数据：

```bash
npx tsx scripts/seed-data.ts
```

**导入数据包括：**
- 1个管理员账号（手机号：13800138888，密码：zy818989）
- 10个会员（王建国、李雪梅、张志强、刘美玲、陈永明、赵丽娜、吴建华、周晓红、黄文博、林芳）
- 3个活动（CEO转型期私董会、AI实战赋能营、创业者分享沙龙）
- 2个探访（探访华为深圳总部、探访阿里杭州总部）

### 步骤 4: 验证数据导入

在 Supabase Table Editor 中查看表数据：

```sql
-- 检查用户数据
SELECT id, phone, nickname, name, age, industry, tag_stamp, is_trusted FROM users;

-- 检查活动数据
SELECT id, title, category, status, capacity FROM activities;

-- 检查探访数据
SELECT id, title, status, capacity FROM visits;
```

## 📊 数据对照表

### 会员数据对照

| ID | 姓名 | 年龄 | 行业 | 职位 | 标签类型 | 是否可信 |
|----|------|------|------|------|----------|----------|
| 1 | 王建国 | 45 | 制造业 | 运营总监 | personLookingForJob | ✅ |
| 2 | 李雪梅 | 38 | 教育咨询 | 合伙人 | personLookingForJob | ✅ |
| 3 | 张志强 | 42 | 新能源 | 副总经理 | jobLookingForPerson | ❌ |
| 4 | 刘美玲 | 36 | 医疗健康 | 运营经理 | personLookingForJob | ❌ |
| 5 | 陈永明 | 48 | 金融投资 | 创始人兼CEO | jobLookingForPerson | ✅ |
| 6 | 赵丽娜 | 40 | 品牌营销 | 创意总监 | personLookingForJob | ❌ |
| 7 | 吴建华 | 52 | 建筑工程 | 总工程师 | jobLookingForPerson | ❌ |
| 8 | 周晓红 | 35 | 电子商务 | 运营总监 | personLookingForJob | ❌ |
| 9 | 黄文博 | 44 | 人工智能 | 技术总监 | jobLookingForPerson | ✅ |
| 10 | 林芳 | 39 | 人力资源 | 合伙人 | personLookingForJob | ❌ |

### 活动数据对照

| ID | 标题 | 类别 | 状态 | 容量 | 茶水费 |
|----|------|------|------|------|--------|
| 1 | CEO转型期私董会 | private | active | 12 | 35 |
| 2 | AI实战赋能营 | ai | active | 20 | 50 |
| 3 | 创业者分享沙龙 | salon | active | 15 | 40 |

### 探访数据对照

| ID | 标题 | 状态 | 容量 | 茶水费 |
|----|------|------|------|--------|
| 1 | 探访华为深圳总部 | active | 20 | 100 |
| 2 | 探访阿里杭州总部 | active | 25 | 120 |

## 🔌 API 接口

所有 API 接口已更新，支持完整的会员信息：

### 用户相关 API

- `GET /api/users` - 获取用户列表（含完整信息）
- `GET /api/users/[id]` - 获取单个用户详情
- `POST /api/users` - 创建用户（注册）
- `PUT /api/users/[id]` - 更新用户信息
- `POST /api/auth/login` - 用户登录

### 活动相关 API

- `GET /api/activities` - 获取活动列表
- `GET /api/activities/[id]` - 获取活动详情
- `POST /api/activities` - 创建活动
- `PUT /api/activities/[id]` - 更新活动
- `DELETE /api/activities/[id]` - 删除活动

### 报名相关 API

- `GET /api/registrations` - 获取报名列表
- `POST /api/registrations` - 创建报名
- `PUT /api/registrations/[id]` - 更新报名状态

## ✅ 验证清单

- [ ] 在 Supabase SQL Editor 中执行了迁移脚本
- [ ] 所有表创建成功（users, activities, visits, registrations）
- [ ] 环境变量配置正确
- [ ] 运行 `npx tsx scripts/seed-data.ts` 导入数据
- [ ] 验证数据库中包含 1 个管理员、10 个会员、3 个活动、2 个探访
- [ ] 测试 API 接口返回正确的数据
- [ ] 前端页面可以正常加载数据

## 🔧 故障排查

### 问题 1: 数据库连接失败

**错误信息：** `connection refused` 或 `ENETUNREACH`

**解决方案：**
- 检查 `DATABASE_URL` 是否正确
- 确认 Supabase 项目状态正常
- 检查网络连接

### 问题 2: 迁移脚本执行失败

**错误信息：** `relation "users" already exists`

**解决方案：**
- 删除现有表后重新执行迁移
- 或使用增量迁移（`0001_open_sage.sql`）

### 问题 3: 数据导入失败

**错误信息：** `duplicate key value violates unique constraint`

**解决方案：**
- 清空现有数据：`TRUNCATE TABLE users, activities, visits, registrations CASCADE;`
- 重新运行导入脚本

## 📝 后续步骤

完成数据同步后，可以进行以下操作：

1. **前端页面改造**：将硬编码数据替换为 API 调用
2. **用户注册/登录**：实现真实的用户认证功能
3. **活动报名**：实现活动报名功能
4. **后台管理**：完善后台管理功能

## 📚 相关文档

- [Supabase 设置指南](./SUPABASE_SETUP_GUIDE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [API 接口文档](./API_DOCUMENTATION.md)
