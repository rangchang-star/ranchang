# 燃场网站 - 后台与前端字段映射文档

## 📋 概述

本文档详细说明后台数据库Schema、后台API接口与前端页面之间的字段映射关系。

## ⚠️ 重要提示

**当前状态：**
- ✅ 数据库Schema已更新完整
- ✅ 所有前台页面已恢复
- ✅ 后台管理页面已恢复
- ❌ **数据库连接未配置**（需要设置 `DATABASE_URL` 环境变量）

**测试前提：**
1. 配置数据库连接环境变量
2. 执行 `migrations/001_init_schema.sql` 初始化数据库
3. 在后台创建测试数据
4. 在前端验证数据显示

---

## 1️⃣ 用户表（app_users）

### 数据库Schema
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 主键 |
| phone | VARCHAR(20) | 手机号（唯一） |
| nickname | VARCHAR(50) | 昵称 |
| name | VARCHAR(50) | 姓名 |
| avatar | TEXT | 头像URL |
| bio | TEXT | 简介 |
| age | INTEGER | 年龄 |
| gender | VARCHAR(10) | 性别 |
| industry | VARCHAR(50) | 行业 |
| company | VARCHAR(100) | 公司 |
| position | VARCHAR(50) | 职位 |
| city | VARCHAR(50) | 城市 |
| level | INTEGER | 用户等级（默认1） |
| achievement | TEXT | 成就 |
| hardcore_tags | JSONB | 硬核技能标签 |
| tags | JSONB | 普通标签 |
| tag_stamp | VARCHAR(50) | 标签类型 |
| need | TEXT | 用户需求 |
| is_trusted | BOOLEAN | 是否信任（默认false） |
| is_featured | BOOLEAN | 是否精选（默认false） |
| status | user_status | 状态：active/inactive/suspended |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 后台API接口
**接口：** `POST /admin/api/members`  
**请求体：**
```json
{
  "phone": "13800138000",
  "nickname": "张三",
  "name": "张三",
  "avatar": "/avatar-default.jpg",
  "bio": "创业者简介",
  "industry": "互联网",
  "company": "某科技公司",
  "position": "CEO",
  "level": 1,
  "status": "active",
  "age": 30,
  "hardcoreTags": ["AI技术", "产品管理"],
  "need": "寻找技术合伙人",
  "isTrusted": false,
  "isFeatured": true
}
```

### 前端discovery页面
**映射关系：**
```typescript
{
  id: user.id,
  name: user.name || user.nickname,
  age: user.age || 0,
  avatar: user.avatar || "/avatar-default.jpg",
  tags: user.hardcoreTags || user.tags || [],
  industry: user.industry || "",
  tagStamp: user.tagStamp || "pureExchange",
  need: user.need || "",
  isTrusted: user.isTrusted || false,
  isFeatured: user.isFeatured || false,
  position: user.position || "",
  company: user.company || ""
}
```

---

## 2️⃣ 活动表（activities）

### 数据库Schema
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 主键 |
| title | VARCHAR(200) | 标题 |
| subtitle | VARCHAR(200) | 副标题 |
| description | TEXT | 描述 |
| category | VARCHAR(50) | 分类 |
| date | TIMESTAMP | 活动日期 |
| start_date | TIMESTAMP | 开始时间 |
| end_date | TIMESTAMP | 结束时间 |
| start_time | VARCHAR(20) | 开始时刻（14:00） |
| end_time | VARCHAR(20) | 结束时刻（17:00） |
| location | VARCHAR(200) | 地点 |
| address | VARCHAR(200) | 地址 |
| capacity | INTEGER | 容量（人数） |
| tea_fee | INTEGER | 茶水费（元） |
| type | VARCHAR(50) | 类型：salon/workshop/meetup |
| cover_image | TEXT | 封面图片URL |
| cover_image_key | TEXT | 封面图片fileKey |
| status | activity_status | 状态：draft/published/cancelled/ended |
| registered_count | INTEGER | 已报名人数 |
| created_by | VARCHAR(36) | 创建人ID |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 后台API接口
**接口：** `POST /admin/api/activities`  
**请求体：**
```json
{
  "title": "AI技术沙龙",
  "subtitle": "探索人工智能前沿",
  "description": "本次活动将讨论AI技术在创业中的应用",
  "category": "技术沙龙",
  "startDate": "2026-03-20T14:00:00Z",
  "endDate": "2026-03-20T17:00:00Z",
  "startTime": "14:00",
  "endTime": "17:00",
  "location": "北京市朝阳区",
  "address": "朝阳区某某大厦",
  "capacity": 20,
  "teaFee": 100,
  "type": "salon",
  "status": "published",
  "coverImage": "/activity-cover.jpg"
}
```

### 前端discovery页面
**映射关系：**
```typescript
{
  id: activity.id,
  category: activity.category || "",
  title: activity.title || "",
  subtitle: activity.subtitle || "",
  description: activity.description || "",
  image: activity.coverImage || "",
  enrollments: activity.participants?.map(p => p.id) || [],
  enrolledCount: activity.registeredCount || 0,
  maxEnrollments: activity.capacity || 0,
  address: activity.address || "",
  teaFee: `茶水费${activity.teaFee || 0}元`,
  status: activity.status === "published" ? "ongoing" : "ended",
  endTime: activity.endDate || ""
}
```

---

## 3️⃣ 宣告表（declarations）

### 数据库Schema
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 主键 |
| user_id | VARCHAR(36) | 用户ID（外键） |
| user_name | VARCHAR(50) | 用户姓名 |
| user_avatar | TEXT | 用户头像 |
| user_level | INTEGER | 用户等级 |
| user_position | VARCHAR(100) | 用户职位 |
| direction | VARCHAR(100) | 方向 |
| text | TEXT | 主题 |
| summary | TEXT | 内容 |
| audio_url | VARCHAR(500) | 音频URL |
| audio_key | TEXT | 音频fileKey |
| icon | VARCHAR(100) | 图标URL |
| icon_type | VARCHAR(50) | 图标类型 |
| duration | VARCHAR(20) | 时长（如"3:45"） |
| views | INTEGER | 浏览次数 |
| likes | INTEGER | 点赞次数 |
| rank | INTEGER | 排序 |
| is_featured | BOOLEAN | 是否精选 |
| date | DATE | 日期 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 前端discovery页面
**映射关系：**
```typescript
{
  id: declaration.id,
  rank: declaration.rank || 0,
  icon: declaration.userAvatar || "/avatar-default.jpg",
  iconType: declaration.iconType || "",
  title: declaration.text || declaration.summary?.substring(0, 20) || "",
  profile: declaration.userPosition || "",
  duration: declaration.duration || "0:00",
  userId: declaration.userId,
  userName: declaration.userName || declaration.userNickname || "",
  userAvatar: declaration.userAvatar || "/avatar-default.jpg",
  views: declaration.views || 0,
  isFeatured: declaration.isFeatured || false
}
```

---

## 4️⃣ 每日宣告表（daily_declarations）

### 数据库Schema
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | SERIAL | 主键 |
| title | VARCHAR(200) | 标题 |
| date | DATE | 日期 |
| image | TEXT | 图片URL |
| image_key | TEXT | 图片fileKey |
| audio | TEXT | 音频CDN地址 |
| audio_url | VARCHAR(500) | 音频URL |
| audio_key | TEXT | 音频fileKey |
| summary | TEXT | 摘要 |
| text | TEXT | 内容 |
| icon_type | VARCHAR(50) | 图标类型 |
| rank | INTEGER | 排序 |
| profile | TEXT | 简介 |
| duration | VARCHAR(50) | 时长 |
| views | INTEGER | 浏览次数 |
| is_active | BOOLEAN | 是否激活（默认true） |
| is_featured | BOOLEAN | 是否精选 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 前端discovery页面
**映射关系：**
```typescript
{
  image: latest.image,
  date: latest.date || latest.createdAt?.split('T')[0] || '',
  title: latest.title || latest.summary || '',
  duration: latest.duration || '',
  audio: latest.audio || latest.audioUrl || '',
  id: latest.id
}
```

---

## 5️⃣ 文档表（documents）

### 数据库Schema
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 主键 |
| title | VARCHAR(200) | 标题 |
| type | VARCHAR(50) | 类型 |
| description | TEXT | 描述 |
| category | VARCHAR(50) | 分类 |
| content | TEXT | 内容 |
| file_url | TEXT | 文件URL |
| file_key | TEXT | 文件fileKey |
| cover_image | TEXT | 封面图片URL |
| cover_image_key | TEXT | 封面图片fileKey |
| icon | VARCHAR(100) | 图标 |
| file_size | INTEGER | 文件大小 |
| file_type | VARCHAR(50) | 文件类型 |
| downloads | INTEGER | 下载次数 |
| download_count | INTEGER | 下载次数统计 |
| likes | INTEGER | 点赞次数 |
| author_id | VARCHAR(36) | 作者ID |
| status | VARCHAR(20) | 状态 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 前端discovery页面
**映射关系：**
```typescript
{
  id: doc.id,
  type: doc.type || "document",
  title: doc.title || "",
  icon: doc.icon || iconMap[doc.fileType] || "note",
  description: doc.description || "",
  content: doc.content || "",
  cover: doc.cover || "",
  date: doc.createdAt?.split('T')[0] || "",
  views: doc.downloadCount || 0,
  status: doc.status || "published"
}
```

---

## 6️⃣ 探访表（visits）

### 数据库Schema
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 主键 |
| company_id | VARCHAR(36) | 公司ID（外键） |
| company_name | VARCHAR(255) | 公司名称 |
| industry | VARCHAR(100) | 行业 |
| location | VARCHAR(255) | 地点 |
| description | TEXT | 描述 |
| date | TIMESTAMP | 日期 |
| capacity | INTEGER | 容量 |
| registered_count | INTEGER | 已报名人数 |
| cover_image | TEXT | 封面图片URL |
| cover_image_key | TEXT | 封面图片fileKey |
| status | visit_status | 状态：draft/upcoming/completed/cancelled |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 前端discovery页面
**映射关系：**
```typescript
{
  id: visit.id,
  companyId: visit.companyId,
  companyName: visit.companyName,
  industry: visit.industry,
  location: visit.location,
  description: visit.description,
  date: visit.date,
  capacity: visit.capacity,
  registeredCount: visit.registeredCount,
  coverImage: visit.coverImage,
  status: visit.status
}
```

---

## 🧪 测试步骤

### 1. 配置数据库连接
```bash
# 设置环境变量
export DATABASE_URL="postgresql://user:password@host:port/database"
```

### 2. 初始化数据库
```bash
# 执行初始化脚本
psql -h host -U user -d database -f migrations/001_init_schema.sql
```

### 3. 测试后台创建功能

#### 创建用户
```bash
curl -X POST http://localhost:5000/admin/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "nickname": "张三",
    "name": "张三",
    "avatar": "/avatar-default.jpg",
    "bio": "创业者",
    "industry": "互联网",
    "company": "某科技公司",
    "position": "CEO",
    "level": 1,
    "status": "active",
    "hardcoreTags": ["AI技术", "产品管理"],
    "need": "寻找技术合伙人",
    "isFeatured": true
  }'
```

#### 创建活动
```bash
curl -X POST http://localhost:5000/admin/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI技术沙龙",
    "subtitle": "探索人工智能前沿",
    "description": "本次活动将讨论AI技术在创业中的应用",
    "category": "技术沙龙",
    "startDate": "2026-03-20T14:00:00Z",
    "endDate": "2026-03-20T17:00:00Z",
    "startTime": "14:00",
    "endTime": "17:00",
    "location": "北京市朝阳区",
    "address": "朝阳区某某大厦",
    "capacity": 20,
    "teaFee": 100,
    "type": "salon",
    "status": "published",
    "coverImage": "/activity-cover.jpg"
  }'
```

#### 创建探访
```bash
curl -X POST http://localhost:5000/admin/api/visits \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "某某科技公司",
    "industry": "互联网",
    "location": "北京市海淀区",
    "description": "探访AI创业公司",
    "date": "2026-03-25T14:00:00Z",
    "capacity": 10,
    "status": "upcoming",
    "coverImage": "/visit-cover.jpg"
  }'
```

#### 修改页面设置
```bash
curl -X POST http://localhost:5000/admin/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "discovery",
    "value": "{\"slogan\":\"发现光亮，点亮事业\",\"logo\":\"/logo-ranchang.png\",\"music\":\"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3\",\"backgroundImage\":\"/discovery-bg.jpg\"}"
  }'
```

### 4. 验证前端数据展示

访问以下页面验证数据是否正确显示：
- 发现页（`/discovery`）- 检查用户、活动、宣告是否显示
- 活动页（`/activities`）- 检查活动列表
- 宣告页（`/declarations`）- 检查宣告列表

---

## 🔍 字段映射总结

### 关键映射规则

1. **snake_case ↔ camelCase**
   - 数据库：`snake_case`（如 `hardcore_tags`）
   - API：自动转换
   - 前端：`camelCase`（如 `hardcoreTags`）

2. **默认值处理**
   - 前端代码中大量使用 `||` 运算符提供默认值
   - 示例：`user.avatar || "/avatar-default.jpg"`

3. **状态映射**
   - 活动：`published` → `ongoing`
   - 访问：`upcoming` → 进行中
   - 用户：`active` → 正常

4. **数组字段**
   - `hardcoreTags`：`JSONB` 类型，存储字符串数组
   - `tags`：`JSONB` 类型，存储字符串数组

---

## ✅ 检查清单

- [ ] 数据库连接已配置
- [ ] 数据库表已创建（执行初始化脚本）
- [ ] 后台API接口正常（返回200）
- [ ] 后台管理页面正常加载
- [ ] 后台可以创建用户
- [ ] 后台可以创建活动
- [ ] 后台可以创建探访
- [ ] 后台可以修改页面设置
- [ ] 前端发现页数据显示正常
- [ ] 前端活动页数据显示正常
- [ ] 前端宣告页数据显示正常
- [ ] 图片上传功能正常

---

## 📝 备注

1. **默认管理员账号**
   - 用户名：`admin`
   - 密码：`admin123`（实际部署时需要修改）

2. **图片上传**
   - 当前使用模拟CDN地址
   - 实际部署时需要配置对象存储服务

3. **时间格式**
   - 数据库：`TIMESTAMP WITH TIME ZONE`
   - API：ISO 8601格式
   - 前端：根据需要格式化

4. **分页**
   - 当前API接口未实现分页
   - 如需分页，请添加 `page` 和 `pageSize` 参数

---

**最后更新：** 2026-03-12
**版本：** v1.0
