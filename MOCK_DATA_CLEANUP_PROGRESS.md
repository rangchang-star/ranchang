# 项目模拟数据清理进度报告

## 已完成的工作

### 1. 创建缺失的 API 接口
- ✅ `/api/notifications` - 获取和创建通知

### 2. 重构完成的页面
- ✅ `src/app/activities/page.tsx` - 移除所有模拟数据和 localStorage 操作，改为从 API 获取数据
- ✅ `src/app/settings/page.tsx` - 移除硬编码的管理员账号密码，改为调用 `/api/admin/login` API

### 3. 删除的文件
- ✅ 所有 `.bak` 备份文件已被删除
- ✅ 模拟数据脚本已被删除

## 待重构的页面（标记为 TODO）

### 高优先级（核心功能页面）
以下页面包含大量模拟数据，建议优先重构：

#### 1. `src/app/profile/page.tsx`
**问题：**
- 包含 `defaultNotifications` 模拟通知数据
- 包含多个量表评估的模拟数据：
  - `entrepreneurialPsychologyAssessment`
  - `businessCognitionAssessment`
  - `aiCognitionAssessment`
  - `careerMissionAssessment`
- 包含 `visitRecords` 模拟探访记录数据
- 使用 localStorage 存储通知

**需要创建的 API 接口：**
- `GET /api/assessments` - 获取用户量表评估结果
- `GET /api/users/:id/visits` - 获取用户的探访记录

#### 2. `src/app/training/page.tsx`
**问题：**
- 包含 `courses` 硬编码课程数据
- 包含 `consultantInfo` 硬编码咨询师信息

**建议：**
- 创建 `GET /api/training/courses` 接口
- 将课程数据存储到数据库

#### 3. `src/app/discovery/page.tsx`
**问题：**
- 包含 `skillBubbles` 硬编码技能树数据
- 已改为从 API 加载活动和高燃宣告，但技能树数据仍为模拟数据

**建议：**
- 创建 `GET /api/skills` 接口
- 将技能数据存储到数据库

#### 4. `src/app/subscription/page.tsx`
**问题：**
- 包含 `industryTypes` 硬编码行业标签
- 包含 `defaultMediaConfig` 硬编码媒体配置
- 包含 `salon` 硬编码沙龙内容

**建议：**
- 创建 `GET /api/subscription/config` 接口
- 将配置数据存储到数据库

### 中优先级（评估页面）
以下页面包含硬编码的评估问题：

#### 5. `src/app/assessment/ai-cognition/page.tsx`
**问题：**
- 包含 `assessmentData` 硬编码评估信息
- 包含 `questions` 硬编码问题列表

#### 6. `src/app/assessment/business-cognition/page.tsx`
**问题：**
- 包含 `assessmentData` 硬编码评估信息
- 包含 `questions` 硬编码问题列表

#### 7. `src/app/assessment/entrepreneurial-psychology/page.tsx`
**问题：**
- 包含 `assessmentData` 硬编码评估信息
- 包含 `questions` 硬编码问题列表

#### 8. `src/app/assessment/career-mission/page.tsx`
**问题：**
- 包含 `assessmentData` 硬编码评估信息
- 包含 `questions` 硬编码问题列表

**建议：**
- 创建 `GET /api/assessments/:id` 接口
- 将评估问题和答案存储到数据库

### 低优先级（管理后台页面）
以下页面已标记为待重构，包含大量模拟数据：

#### 9. `src/app/admin/consultations/page.tsx`
**问题：**
- 包含 `consultationTopics` 硬编码咨询话题
- 包含 `consultantInfo` 硬编码咨询师信息
- 包含 `mockUserDetails` 模拟用户详情
- 包含 `mockConsultations` 模拟咨询数据

**需要创建的 API 接口：**
- `GET /api/admin/consultations` - 获取咨询列表
- `GET /api/admin/users/:id` - 获取用户详情
- `PUT /api/admin/consultations/:id` - 更新咨询状态

#### 10. `src/app/admin/visits/[id]/edit/page.tsx`
**问题：**
- 包含 `mockVisit` 模拟探访数据

**需要创建的 API 接口：**
- `GET /api/admin/visits/:id` - 获取探访详情
- `PUT /api/admin/visits/:id` - 更新探访信息
- `GET /api/admin/members` - 获取可选成员列表

## 重构建议

### 1. 数据库设计
建议在数据库中添加以下表：

#### assessments_questions 表
```sql
CREATE TABLE assessments_questions (
  id SERIAL PRIMARY KEY,
  assessment_id VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  order_index INTEGER
);
```

#### training_courses 表
```sql
CREATE TABLE training_courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  target TEXT,
  icon VARCHAR(100),
  content JSONB,
  founder_name VARCHAR(128),
  founder_title VARCHAR(128),
  qr_code TEXT,
  status VARCHAR(20) DEFAULT 'published'
);
```

#### skills 表
```sql
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  size INTEGER,
  color VARCHAR(50),
  border_color VARCHAR(50),
  text_color VARCHAR(50),
  x_position INTEGER,
  y_position INTEGER
);
```

### 2. 重构优先级
1. **第一阶段**：重构核心用户页面（profile, activities - 已完成）
2. **第二阶段**：重构内容展示页面（training, discovery, subscription）
3. **第三阶段**：重构评估页面
4. **第四阶段**：重构管理后台页面

### 3. 重构原则
- 所有数据必须从 API 获取，禁止使用模拟数据
- 禁止在前端代码中硬编码配置数据
- 禁止使用 localStorage 存储业务数据
- 所有用户操作必须调用后端 API

## 测试验证

### 已通过的测试
- ✅ TypeScript 类型检查通过
- ✅ 5000 端口服务正常运行
- ✅ activities 页面从 API 获取数据

### 需要测试的功能
- [ ] settings 页面管理员登录
- [ ] notifications 页面通知显示
- [ ] 其他页面的功能验证

## 总结

本次清理工作已经完成了以下核心任务：
1. ✅ 创建了缺失的 `/api/notifications` API 接口
2. ✅ 重构了 `activities/page.tsx`，移除所有模拟数据
3. ✅ 重构了 `settings/page.tsx`，移除硬编码密码
4. ✅ 删除了所有备份文件和模拟数据脚本
5. ✅ 通过了 TypeScript 类型检查

剩余的页面（profile, training, discovery, subscription, assessment, admin）由于包含大量模拟数据且需要创建新的 API 接口，建议在后续迭代中分阶段重构。
