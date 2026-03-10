# 数据库开发流程规范（一劳永逸方案）

## 📌 核心原则

**永远不让代码去猜数据库，而是让数据库告诉代码长什么样。**

---

## 🚀 开发流程（6步）

### 第1步：设计数据库

在SQL工具（如阿里云RDS控制台、pgAdmin）中设计表结构：

```sql
CREATE TABLE public.users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  -- ... 其他字段
);
```

### 第2步：执行建表

在数据库中执行SQL，创建表。

### 第3步：同步到代码

运行命令从数据库生成Schema：

```bash
pnpm db:pull
```

这会更新 `src/storage/database/supabase/migrations/schema.ts` 文件。

### 第4步：检查一致性

在开发或部署前检查数据库和代码是否一致：

```bash
pnpm db:check
```

如果不一致，会报错，强制你同步。

### 第5步：使用通用API

**不需要再手动写API文件！**

通用API会自动处理所有表的CRUD操作：

#### 查询列表
```javascript
const response = await fetch('/api/users?page=1&limit=10&orderBy=createdAt&order=DESC');
const { data, pagination } = await response.json();
```

#### 查询单条
```javascript
const response = await fetch('/api/users/48');
const { data } = await response.json();
```

#### 创建
```javascript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '张三',
    phone: '13800138000',
    age: 35
  })
});
```

#### 更新
```javascript
const response = await fetch('/api/users/48', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '李四'
  })
});
```

#### 删除
```javascript
const response = await fetch('/api/users/48', {
  method: 'DELETE'
});
```

### 第6步：修改数据库后同步

每次修改数据库结构后，立即运行：

```bash
pnpm db:pull
```

---

## ✅ 支持的资源表

通用API自动支持以下表（无需编写任何代码）：

1. `users` - 用户表
2. `activities` - 活动表
3. `visits` - 参访表
4. `declarations` - 高燃宣告表
5. `daily_declarations` - 每日宣告表
6. `activity_registrations` - 活动报名表
7. `notifications` - 通知表
8. `documents` - 文档表
9. `visit_records` - 参访记录表
10. `settings` - 设置表

**如果需要添加新表，只需：**
1. 在数据库中创建表
2. 运行 `pnpm db:pull`
3. 在通用API的白名单中添加表名

---

## 📝 自动化脚本说明

| 命令 | 作用 | 何时使用 |
|------|------|----------|
| `pnpm db:pull` | 从数据库生成Schema | 每次修改数据库结构后 |
| `pnpm db:check` | 检查数据库和代码一致性 | 开发或部署前 |
| `pnpm db:push` | 将Schema推送到数据库 | 开发环境（慎用） |

---

## 🛡️ 安全性

通用API已内置安全措施：

1. **资源名称白名单**：防止SQL注入，只允许预定义的表名
2. **参数化查询**：使用postgres.js的模板字符串，自动转义
3. **错误处理**：统一的错误响应格式

---

## 🎯 字段名转换

通用API自动处理字段名转换：

- **数据库**：`snake_case` (如 `user_name`, `created_at`)
- **前端**：`camelCase` (如 `userName`, `createdAt`)

**无需手动转换！**

---

## ⚠️ 注意事项

1. **不要手动编写API文件**：除了特殊的业务逻辑（如登录、注册），所有CRUD都使用通用API
2. **每次修改数据库必同步**：修改表结构后必须运行 `pnpm db:pull`
3. **提交代码前检查**：`pnpm db:check` 通过才能提交
4. **字段类型严格匹配**：不要试图在代码中修改字段类型，应该在数据库中修改

---

## 🔄 开发流程对比

### 之前（混乱）

```
设计UI → 手写API → 猜数据库结构 → 字段名写错 → 修改 → 再错 → 循环
```

### 现在（规范）

```
设计数据库 → 跑一条命令 → 直接写前端 → 永远不出错
```

---

## 📞 常见问题

### Q: 为什么不能用Drizzle ORM？
A: 通用API使用postgres.js，更简单、更直接、避免ORM的复杂性。

### Q: 如何添加新的资源表？
A: 
1. 在数据库创建表
2. 运行 `pnpm db:pull`
3. 在 `src/app/api/[resource]/route.ts` 的白名单中添加表名

### Q: 如何实现特殊业务逻辑？
A: 对于特殊业务逻辑（如登录、注册），单独编写API文件，不要使用通用API。

### Q: 数据库修改了但前端报错怎么办？
A: 运行 `pnpm db:pull` 同步Schema，检查字段名是否正确。

---

## 🎉 核心优势

✅ **一劳永逸**：以后再也不用手动写API  
✅ **自动同步**：数据库变化，一条命令即可  
✅ **类型安全**：所有字段类型从数据库自动生成  
✅ **统一规范**：所有API格式一致  
✅ **安全可靠**：内置安全机制  

---

## 📌 团队协作规范

多人协作时，请遵守：

1. **修改数据库前先沟通**：确保团队知道结构变化
2. **提交代码前运行 `pnpm db:check`**
3. **README文档同步更新**：如果修改了数据库结构，更新相关文档
4. **使用Git保护分支**：确保 `db:check` 通过后才能合并到主分支

---

## 📚 参考资料

- [Drizzle Kit文档](https://orm.drizzle.team/docs/kit-overview)
- [PostgreSQL文档](https://www.postgresql.org/docs/)
- [postgres.js文档](https://github.com/porsager/postgres)
