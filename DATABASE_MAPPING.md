# 燃场 App - 数据库映射关系文档

> **创建时间**: 2026-03-11
> **版本**: v1.1
> **维护者**: 开发团队

---

## 📋 目录

1. [概述](#概述)
2. [API 资源映射](#api-资源映射)
3. [字段映射规则](#字段映射规则)
4. [详细表结构](#详细表结构)
5. [已知问题](#已知问题)
6. [故障排查流程](#故障排查流程)
7. [修改指南](#修改指南)

---

## 概述

本文档记录了前端 API 资源与数据库表之间的映射关系，包括：
- 前端资源名 ↔ 后端表名
- 前端字段名 ↔ 数据库字段名（camelCase ↔ snake_case）
- Schema 说明和数据类型

**核心原则**：
- 所有数据库操作通过统一 API 路由处理：`/api/[resource]` 和 `/api/[resource]/[id]`
- 字段名自动转换：前端使用 camelCase，数据库使用 snake_case
- 通过 `RESOURCE_NAME_MAPPING` 实现资源名称映射

---

## API 资源映射

### 映射配置位置
- 文件：`src/app/api/[resource]/[id]/route.ts`
- 文件：`src/app/api/[resource]/route.ts`

### 当前映射表

| 前端资源名 | 后端表名 | Schema | 状态 |
|----------|---------|--------|------|
| `users` | `app_users` | `public` | ✅ 正常 |
| `activities` | `activities` | `public` | ✅ 正常 |
| `visits` | `visits` | `public` | ✅ 正常 |
| `declarations` | `declarations` | `public` | ✅ 正常 |
| `daily_declarations` | `daily_declarations` | `public` | ✅ 正常 |
| `notifications` | `notifications` | `public` | ✅ 正常 |
| `activity_registrations` | `activity_registrations` | `public` | ✅ 正常 |
| `documents` | `documents` | `public` | ✅ 正常 |
| `settings` | `settings` | `public` | ✅ 正常 |

---

## 字段映射规则

### 自动转换规则
API 路由会自动处理字段名转换：

#### camelCase → snakeCase（前端 → 数据库）
```typescript
// 前端发送
{
  "userName": "John",
  "companyScale": "100-500人",
  "createdAt": "2026-03-11"
}

// 自动转换为
{
  "user_name": "John",
  "company_scale": "100-500人",
  "created_at": "2026-03-11"
}
```

#### snake_case → camelCase（数据库 → 前端）
```typescript
// 数据库返回
{
  "user_name": "John",
  "company_scale": "100-500人",
  "created_at": "2026-03-11"
}

// 自动转换为
{
  "userName": "John",
  "companyScale": "100-500人",
  "createdAt": "2026-03-11"
}
```

### 特殊字段映射

| 前端字段名 | 数据库字段名 | 说明 |
|-----------|-------------|------|
| `nickName` | `name` | 用户昵称 |
| `occupation` | `company` | 职业/公司 |
| `location` | `company_scale` | 公司规模 |

**映射位置**：`src/app/api/[resource]/[id]/route.ts` 中的 `FIELD_MAPPINGS`

---

## 详细表结构

### 1. app_users（用户表）

**API 资源名**: `users`
**数据库表名**: `app_users`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | varchar(36) | YES | - | id | 用户ID |
| name | varchar(128) | YES | - | name | 用户姓名 |
| age | integer | YES | - | age | 年龄 |
| avatar | text | YES | - | avatar | 头像URL |
| phone | varchar(20) | YES | - | phone | 手机号 |
| email | varchar(255) | YES | - | email | 邮箱 |
| connection_type | varchar(50) | YES | - | connectionType | 连接类型 |
| industry | varchar(100) | YES | - | industry | 行业 |
| need | text | YES | - | need | 需求 |
| ability_tags | jsonb | YES | - | abilityTags | 能力标签 |
| resource_tags | jsonb | YES | - | resourceTags | 资源标签 |
| level | varchar(50) | YES | - | level | 等级 |
| company | varchar(255) | YES | - | company | 公司 |
| position | varchar(255) | YES | - | position | 职位 |
| status | varchar(20) | YES | - | status | 状态 |
| is_featured | boolean | YES | - | isFeatured | 是否精选 |
| join_date | timestamp with time zone | YES | - | joinDate | 加入日期 |
| last_login | timestamp with time zone | YES | - | lastLogin | 最后登录时间 |
| created_at | timestamp with time zone | YES | - | createdAt | 创建时间 |
| updated_at | timestamp with time zone | YES | - | updatedAt | 更新时间 |
| tag_stamp | varchar(50) | YES | - | tagStamp | 标签时间戳 |
| hardcore_tags | jsonb | YES | - | hardcoreTags | 核心标签 |
| gender | varchar(10) | YES | - | gender | 性别 |
| company_scale | varchar(50) | YES | - | companyScale | 公司规模 |

---

### 2. activities（活动表）

**API 资源名**: `activities`
**数据库表名**: `activities`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | varchar(36) | NO | gen_random_uuid() | id | 活动ID |
| title | varchar(255) | NO | - | title | 活动标题 |
| description | text | YES | - | description | 活动描述 |
| date | timestamp with time zone | NO | - | date | 活动日期 |
| start_time | varchar(10) | YES | - | startTime | 开始时间 |
| end_time | varchar(10) | YES | - | endTime | 结束时间 |
| location | varchar(255) | YES | - | location | 活动地点 |
| capacity | integer | YES | - | capacity | 容量 |
| registered_count | integer | YES | 0 | registeredCount | 已报名人数 |
| type | varchar(50) | YES | - | type | 活动类型 |
| cover_image | text | YES | - | coverImage | 封面图片 |
| status | varchar(20) | YES | 'draft' | status | 状态 |
| created_at | timestamp with time zone | NO | now() | createdAt | 创建时间 |
| updated_at | timestamp with time zone | YES | - | updatedAt | 更新时间 |

---

### 3. visits（探访表）

**API 资源名**: `visits`
**数据库表名**: `visits`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | varchar(36) | NO | gen_random_uuid() | id | 探访ID |
| company_id | varchar(36) | NO | - | companyId | 公司ID |
| company_name | varchar(255) | NO | - | companyName | 公司名称 |
| industry | varchar(100) | YES | - | industry | 行业 |
| location | varchar(255) | YES | - | location | 地点 |
| description | text | YES | - | description | 描述 |
| date | timestamp with time zone | NO | - | date | 探访日期 |
| capacity | integer | YES | - | capacity | 容量 |
| registered_count | integer | YES | 0 | registeredCount | 已报名人数 |
| cover_image | text | YES | - | coverImage | 封面图片 |
| status | varchar(20) | YES | 'draft' | status | 状态 |
| created_at | timestamp with time zone | NO | now() | createdAt | 创建时间 |
| updated_at | timestamp with time zone | YES | - | updatedAt | 更新时间 |

---

### 4. declarations（高燃宣告表）

**API 资源名**: `declarations`
**数据库表名**: `declarations`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | varchar(255) | NO | - | id | 宣告ID |
| user_id | varchar(255) | NO | - | userId | 用户ID |
| direction | varchar(100) | YES | - | direction | 方向 |
| text | text | NO | - | text | 宣告内容 |
| summary | text | YES | - | summary | 摘要 |
| audio_url | varchar(500) | YES | - | audioUrl | 音频URL |
| views | integer | YES | 0 | views | 浏览量 |
| date | date | NO | - | date | 日期 |
| is_featured | boolean | YES | false | isFeatured | 是否精选 |
| created_at | timestamp with time zone | YES | CURRENT_TIMESTAMP | createdAt | 创建时间 |
| updated_at | timestamp with time zone | YES | CURRENT_TIMESTAMP | updatedAt | 更新时间 |

---

### 5. daily_declarations（每日宣告表）

**API 资源名**: `daily_declarations`
**数据库表名**: `daily_declarations`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | integer | NO | nextval() | id | ID |
| title | varchar(200) | NO | - | title | 标题 |
| date | timestamp without time zone | NO | - | date | 日期 |
| image | text | YES | - | image | 图片URL |
| audio | text | YES | - | audio | 音频URL |
| summary | text | YES | - | summary | 摘要 |
| text | text | YES | - | text | 内容 |
| icon_type | varchar(50) | YES | - | iconType | 图标类型 |
| rank | integer | YES | - | rank | 排序 |
| profile | text | YES | - | profile | 简介 |
| duration | varchar(50) | YES | - | duration | 时长 |
| views | integer | YES | 0 | views | 浏览量 |
| is_featured | boolean | YES | false | isFeatured | 是否精选 |
| created_at | timestamp without time zone | NO | now() | createdAt | 创建时间 |
| updated_at | timestamp without time zone | NO | now() | updatedAt | 更新时间 |

---

### 6. notifications（通知表）

**API 资源名**: `notifications`
**数据库表名**: `notifications`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | varchar(36) | NO | gen_random_uuid() | id | 通知ID |
| user_id | varchar(36) | NO | - | userId | 用户ID |
| type | varchar(20) | NO | - | type | 通知类型 |
| title | varchar(255) | NO | - | title | 标题 |
| message | text | NO | - | message | 消息内容 |
| action_url | text | YES | - | actionUrl | 操作URL |
| is_read | boolean | YES | false | isRead | 是否已读 |
| created_at | timestamp with time zone | NO | now() | createdAt | 创建时间 |

---

### 7. activity_registrations（活动报名表）

**API 资源名**: `activity_registrations`
**数据库表名**: `activity_registrations`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | integer | NO | nextval() | id | 报名ID |
| activity_id | text | NO | - | activityId | 活动ID |
| user_id | text | NO | - | userId | 用户ID |
| status | varchar(50) | YES | 'registered' | status | 状态 |
| registered_at | timestamp without time zone | YES | CURRENT_TIMESTAMP | registeredAt | 报名时间 |
| reviewed_at | timestamp without time zone | YES | - | reviewedAt | 审核时间 |
| note | text | YES | - | note | 备注 |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP | createdAt | 创建时间 |
| updated_at | timestamp without time zone | YES | CURRENT_TIMESTAMP | updatedAt | 更新时间 |

---

### 8. documents（文档表）

**API 资源名**: `documents`
**数据库表名**: `documents`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | integer | NO | nextval() | id | 文档ID |
| title | varchar | NO | - | title | 文档标题 |
| description | text | YES | - | description | 文档描述 |
| file_url | text | NO | - | url | 文件URL |
| file_type | varchar | NO | - | fileType | 文件类型 |
| file_size | integer | YES | 0 | fileSize | 文件大小 |
| category | varchar | YES | '其他' | category | 分类 |
| created_by | integer | NO | - | createdBy | 创建者ID |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP | createdAt | 创建时间 |
| updated_at | timestamp without time zone | YES | CURRENT_TIMESTAMP | updatedAt | 更新时间 |
| download_count | integer | YES | 0 | downloadCount | 下载次数 |
| cover | text | YES | - | cover | 封面图片 |

---

### 9. settings（系统设置表）

**API 资源名**: `settings`
**数据库表名**: `settings`
**Schema**: `public`

| 数据库字段名 | 数据类型 | 可空 | 默认值 | 前端字段名 | 说明 |
|------------|---------|------|--------|-----------|------|
| id | integer | NO | - | id | 设置ID（固定为1） |
| settings | jsonb | NO | '{}' | settings | 系统设置JSON |
| updated_at | timestamp without time zone | YES | now() | updatedAt | 更新时间 |

**settings 字段结构**：

```json
{
  "navigation": {
    "discovery": {"label": "发现光亮", "icon": "flame"},
    "ignition": {"label": "点亮事业", "icon": "trending-up"},
    "profile": {"label": "个人中心", "icon": "user"}
  },
  "pageTitles": {
    "discovery": "发现光亮",
    "activities": "活动列表",
    ...
  },
  "discovery": {
    "slogan": "发现光亮，点亮事业",
    "logo": "/logo-ranchang.png",
    "music": "https://...",
    "backgroundImage": "/discovery-bg.jpg"
  },
  "ignition": {
    "visitSlogan": "...",
    "visitMedia": {"type": null, "url": ""},
    "aiCircleSlogan": "...",
    "aiCircleMedia": {"type": null, "url": ""}
  },
  "profile": {
    "businessCognition": {"displayStyle": "radar"},
    "aiCognition": {"displayStyle": "radar"},
    "careerMission": {"displayStyle": "cards"},
    "entrepreneurialPsychology": {"displayStyle": "progress"}
  },
  "contactInfo": {
    "message": "...",
    "contact": "v:13023699913"
  }
}
```

---

## 已知问题

### 问题1：认证系统表名冲突
- **描述**：数据库中存在 `auth.users` 表（Supabase 认证系统）与 `public.users` 视图
- **影响**：可能导致表名引用错误
- **解决方案**：使用 `app_users` 表名，通过 API 资源映射实现前端透明访问
- **状态**：✅ 已解决

### 问题2：settings 表不存在
- **描述**：`settings` 表不存在于数据库中
- **影响**：API 调用 `/api/settings` 会报错
- **解决方案**：✅ 已创建 settings 表，使用 JSONB 字段存储系统设置
- **状态**：✅ 已解决

### 问题3：documents 和 visit_records 表未实现
- **描述**：`documents` 表存在于数据库，`visit_records` 表存在于数据库，但 API 功能需验证
- **影响**：`documents` API 已可用，`visit_records` 已从白名单移除（前端未使用）
- **解决方案**：
  - documents: ✅ 表已存在，字段已补全（添加 download_count, cover）
  - visit_records: ✅ 从 VALID_RESOURCES 移除（前端未引用）
- **状态**：✅ 已解决

---

## 故障排查流程

### 场景1：API 调用报错 "relation xxx does not exist"

**排查步骤**：

1. **检查资源名称映射**
   ```bash
   # 查看 API 路由文件中的 RESOURCE_NAME_MAPPING
   cat src/app/api/[resource]/[id]/route.ts | grep RESOURCE_NAME_MAPPING
   ```

2. **检查表是否存在**
   ```sql
   SELECT table_schema, table_name
   FROM information_schema.tables
   WHERE table_name = '表名';
   ```

3. **解决方案**
   - 如果表不存在：创建表
   - 如果表存在但名称不同：添加到 `RESOURCE_NAME_MAPPING`

### 场景2：字段保存报错 "column xxx does not exist"

**排查步骤**：

1. **检查字段名转换**
   - 前端使用 camelCase
   - 数据库使用 snake_case
   - API 会自动转换，检查转换是否正确

2. **检查字段映射**
   ```bash
   # 查看特殊字段映射
   cat src/app/api/[resource]/[id]/route.ts | grep FIELD_MAPPINGS
   ```

3. **检查实际表结构**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = '表名'
   ORDER BY ordinal_position;
   ```

4. **解决方案**
   - 如果字段不存在：添加字段或修改代码
   - 如果字段映射错误：更新 `FIELD_MAPPINGS`

### 场景3：认证相关操作失败

**排查步骤**：

1. **检查是否尝试访问 auth.users 表**
   - 查看错误信息中的表名

2. **解决方案**
   - 使用视图隔离认证表
   - 或确保代码通过 API 映射访问 `app_users`

---

## 修改指南

### 如何添加新的 API 资源

1. **创建数据库表**
   ```sql
   CREATE TABLE public.表名 (
     id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
     -- 其他字段...
     created_at timestamp with time zone NOT NULL DEFAULT now(),
     updated_at timestamp with time zone
   );
   ```

2. **添加资源名称映射**
   ```typescript
   // src/app/api/[resource]/[id]/route.ts
   const RESOURCE_NAME_MAPPING: Record<string, string> = {
     'users': 'app_users',
     '新资源名': '新表名',  // 添加这一行
   };
   ```

3. **添加到白名单**
   ```typescript
   const VALID_RESOURCES = [
     'users', 'activities', 'visits',
     '新资源名',  // 添加这一行
   ];
   ```

4. **（可选）添加字段映射**
   ```typescript
   const FIELD_MAPPINGS: Record<string, Record<string, string>> = {
     '新表名': {
       '前端字段名': '数据库字段名',
     },
   };
   ```

5. **测试**
   ```bash
   # 创建
   curl -X POST http://localhost:5000/api/新资源名 \
     -H 'Content-Type: application/json' \
     -d '{"字段": "值"}'

   # 读取
   curl http://localhost:5000/api/新资源名
   ```

### 如何修改表结构

1. **修改数据库表**
   ```sql
   ALTER TABLE public.表名 ADD COLUMN 新字段名 数据类型;
   ```

2. **更新本文档**
   - 在对应的表结构部分添加新字段

3. **更新 Drizzle Schema**
   ```typescript
   // src/storage/database/supabase/schema.ts
   export const 表名 = pgTable('public.表名', {
     // ...现有字段
     新字段名: 数据类型('新字段名'),
   });
   ```

4. **测试**
   ```bash
   # 插入包含新字段的数据
   curl -X POST http://localhost:5000/api/资源名 \
     -H 'Content-Type: application/json' \
     -d '{"新字段": "值"}'
   ```

---

## 附录

### A. 数据库表清单

| 表名 | Schema | API 资源名 | 状态 |
|-----|--------|-----------|------|
| app_users | public | users | ✅ 已实现 |
| activities | public | activities | ✅ 已实现 |
| visits | public | visits | ✅ 已实现 |
| declarations | public | declarations | ✅ 已实现 |
| daily_declarations | public | daily_declarations | ✅ 已实现 |
| notifications | public | notifications | ✅ 已实现 |
| activity_registrations | public | activity_registrations | ✅ 已实现 |
| documents | public | documents | ⚠️ 未实现 |
| visit_records | public | visit_records | ⚠️ 未实现 |
| admin_users | public | - | 未使用 |
| assessments | public | - | 未使用 |
| consultations | public | - | 未使用 |
| digital_assets | public | - | 未使用 |
| health_check | public | - | 未使用 |
| user_follows | public | - | 未使用 |
| users_backup | public | - | 备份表 |

### B. 常用 SQL 查询

```sql
-- 查看所有表
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 查看表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = '表名' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 查看表的外键
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
```

### C. API 端点清单

| 方法 | 端点 | 说明 |
|-----|------|------|
| GET | `/api/users` | 获取用户列表 |
| GET | `/api/users/:id` | 获取单个用户 |
| POST | `/api/users` | 创建用户 |
| PUT | `/api/users/:id` | 更新用户 |
| DELETE | `/api/users/:id` | 删除用户 |
| GET | `/api/activities` | 获取活动列表 |
| GET | `/api/activities/:id` | 获取单个活动 |
| POST | `/api/activities` | 创建活动 |
| PUT | `/api/activities/:id` | 更新活动 |
| DELETE | `/api/activities/:id` | 删除活动 |
| GET | `/api/visits` | 获取探访列表 |
| GET | `/api/visits/:id` | 获取单个探访 |
| POST | `/api/visits` | 创建探访 |
| PUT | `/api/visits/:id` | 更新探访 |
| DELETE | `/api/visits/:id` | 删除探访 |
| GET | `/api/declarations` | 获取宣告列表 |
| GET | `/api/declarations/:id` | 获取单个宣告 |
| POST | `/api/declarations` | 创建宣告 |
| PUT | `/api/declarations/:id` | 更新宣告 |
| DELETE | `/api/declarations/:id` | 删除宣告 |
| GET | `/api/daily_declarations` | 获取每日宣告列表 |
| GET | `/api/notifications` | 获取通知列表 |
| POST | `/api/notifications` | 创建通知 |
| PUT | `/api/notifications/:id` | 更新通知 |
| DELETE | `/api/notifications/:id` | 删除通知 |
| GET | `/api/activity_registrations` | 获取活动报名列表 |

---

## 更新日志

| 日期 | 版本 | 更新内容 | 作者 |
|-----|------|---------|------|
| 2026-03-11 | v1.0 | 初始版本，完成所有已实现资源的映射 | 开发团队 |
| 2026-03-11 | v1.1 | 解决已知问题：创建 settings 表，完善 documents 表字段，移除 visit_records | 开发团队 |

---

## 联系方式

如有疑问或需要更新此文档，请联系开发团队。
