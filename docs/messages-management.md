# 消息管理功能说明

## 功能概述

后台消息管理系统提供以下三个核心功能：

### 1. 2026AI圈审核
- 审核用户加入2026AI圈的申请
- 审核通过后自动发送通知消息给用户
- 支持查看申请详情和申请理由

### 2. 申请探访审核
- 审核用户报名探访活动的申请
- 审核通过后自动发送通知消息给用户
- 支持查看探访信息和用户联系方式

### 3. 平台消息发送
- 选择一个或多个用户发送平台消息
- 支持按姓名、昵称、邮箱、手机号搜索用户
- 消息长度限制为500字

## 数据库配置

消息管理功能需要以下数据库表：

### 必需的表
1. **approvals** - 审批表
2. **visit_registrations** - 探访报名表
3. **notifications** - 通知表（已存在）

### 执行数据库迁移

在数据库中执行以下SQL脚本：

```bash
psql -U your_username -d your_database -f database-migrations/messages-management.sql
```

或直接在数据库管理工具中执行 `database-migrations/messages-management.sql` 文件的内容。

## API接口

### 审批相关
- `GET /admin/api/approvals?status=pending&type=ai-circle` - 获取待审核的2026AI圈申请
- `PATCH /admin/api/approvals/:id` - 审核申请（approve/reject）

### 探访报名相关
- `GET /admin/api/visit-registrations?status=registered` - 获取待审核的探访报名
- `PATCH /admin/api/visit-registrations/:id` - 审核报名（approve/reject）

### 平台消息相关
- `GET /admin/api/members/selectable` - 获取可选择用户列表
- `POST /admin/api/messages/send` - 发送平台消息

## 消息类型说明

用户会收到以下5类消息：

1. **活动报名审核通过** - 用户报名活动审核通过
2. **2026AI圈审核通过** - 用户加入2026AI圈申请通过
3. **活动即将开始** - 用户报名的活动开始前20小时通知
4. **平台消息** - 管理员通过后台发送的文本消息
5. **咨询管理反馈** - 管理员对用户咨询的反馈回复

## 使用说明

1. 访问 `/admin/messages` 进入消息管理页面
2. 通过Tab切换不同的功能模块
3. 在审核模块中查看待审核列表，点击"通过"或"拒绝"
4. 在平台消息模块中搜索用户，勾选后发送消息

## 注意事项

- 审核通过后会自动向用户发送通知消息
- 消息发送后会记录在notifications表中
- 用户可以在个人中心查看所有消息
- 平台消息会实时推送，用户无需刷新页面

## 故障排查

### 如果审核列表显示"暂无待审核的申请"
- 检查数据库中approvals表是否存在
- 确认表中是否有status='pending'的记录

### 如果发送消息失败
- 检查数据库中notifications表是否存在
- 确认已选择至少一个用户
- 确认消息内容不为空且不超过500字

### 如果API返回错误
- 检查数据库表是否已正确创建
- 查看日志文件：`/app/work/logs/bypass/app.log`
