# 数据服务层使用指南

## 📚 目录

1. [什么是服务层](#什么是服务层)
2. [为什么需要服务层](#为什么需要服务层)
3. [如何使用服务层](#如何使用服务层)
4. [现有服务列表](#现有服务列表)
5. [创建新服务](#创建新服务)
6. [常见问题](#常见问题)

---

## 什么是服务层

服务层是前端代码与 API 之间的中间层，负责：
- 统一的数据格式转换（API → 前端）
- 统一的错误处理
- 统一的默认值处理
- 类型安全的 TypeScript 接口

**架构图**：
```
页面组件 → 数据服务层 → API 客户端 → API 路由 → 数据库
```

---

## 为什么需要服务层

### ❌ 没有服务层的问题

```typescript
// 问题1：每次都要检查 undefined
const userName = user.name || '匿名用户';  // ❌ 每次都要写
const userAvatar = user.avatar || '/default.jpg';  // ❌ 重复代码

// 问题2：数据转换逻辑分散
const formattedUser = users.map(u => ({  // ❌ 每个页面都要写
  id: u.id,
  name: u.name || '匿名',
  avatar: u.avatar || '/default.jpg',
  // ... 还有很多字段
}));

// 问题3：错误处理不统一
try {
  const res = await fetch('/api/users');
  if (res.ok) {
    const data = await res.json();
    if (data.success) {
      // ...
    }
  }
} catch (err) {
  // ❌ 每个页面都要写
}
```

### ✅ 使用服务层

```typescript
// ✅ 数据格式统一，不会 undefined
const user = await UserService.getById('123');
console.log(user.name);  // 一定有值
console.log(user.avatar);  // 一定有值（默认头像）

// ✅ 错误处理统一
const result = await UserService.getList({ limit: 10 });
console.log(result.users);  // 数据格式统一

// ✅ 类型安全
user.age  // TypeScript 知道这是 number | null
user.name  // TypeScript 知道这是 string
```

---

## 如何使用服务层

### 1. 导入服务

```typescript
import { UserService } from '@/lib/services/user.service';
import { ActivityService } from '@/lib/services/activity.service';
import { DeclarationService } from '@/lib/services/declaration.service';
import { SettingsService } from '@/lib/services/settings.service';
```

### 2. 调用服务方法

```typescript
// 获取单个用户
const user = await UserService.getById('123');
if (user) {
  console.log(user.name);  // 一定有值
  console.log(user.avatar);  // 一定有值
}

// 获取用户列表
const result = await UserService.getList({ limit: 10 });
console.log(result.users);  // User[]
console.log(result.total);  // number

// 获取活跃活动
const activities = await ActivityService.getActive(10);

// 获取精选宣告
const declarations = await DeclarationService.getFeatured(5);

// 获取所有设置
const settings = await SettingsService.getAll();  // 一定有默认值
```

### 3. 在 React 组件中使用

```typescript
"use client";

import { useState, useEffect } from "react";
import { UserService } from "@/lib/services/user.service";
import { ActivityService } from "@/lib/services/activity.service";

export default function MyPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        // 并行加载数据
        const [usersResult, activitiesResult] = await Promise.all([
          UserService.getList({ limit: 10 }),
          ActivityService.getActive(10),
        ]);

        setUsers(usersResult.users);  // ✅ 数据格式统一
        setActivities(activitiesResult.activities);

      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) return <div>加载中...</div>;

  return (
    <div>
      {/* ✅ 渲染数据，不需要检查 undefined */}
      {users.map(user => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <img src={user.avatar} alt={user.name} />
        </div>
      ))}
    </div>
  );
}
```

---

## 现有服务列表

### UserService（用户服务）

```typescript
import { UserService } from '@/lib/services/user.service';

// 获取单个用户
const user = await UserService.getById(id: string): Promise<User | null>

// 获取用户列表
const result = await UserService.getList(params?: {
  page?: number;
  limit?: number;
  status?: string;
  isFeatured?: boolean;
}): Promise<{ users: User[]; total: number }>

// 创建用户
const user = await UserService.create(data: Partial<User>): Promise<User | null>

// 更新用户
const user = await UserService.update(id: string, data: Partial<User>): Promise<User | null>

// 删除用户
const success = await UserService.delete(id: string): Promise<boolean>
```

### ActivityService（活动服务）

```typescript
import { ActivityService } from '@/lib/services/activity.service';

// 获取单个活动
const activity = await ActivityService.getById(id: string | number): Promise<Activity | null>

// 获取活动列表
const result = await ActivityService.getList(params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}): Promise<{ activities: Activity[]; total: number }>

// 获取活跃活动
const activities = await ActivityService.getActive(limit: number): Promise<Activity[]>

// 创建活动
const activity = await ActivityService.create(data: Partial<Activity>): Promise<Activity | null>

// 更新活动
const activity = await ActivityService.update(id: string | number, data: Partial<Activity>): Promise<Activity | null>

// 删除活动
const success = await ActivityService.delete(id: string | number): Promise<boolean>
```

### DeclarationService（宣告服务）

```typescript
import { DeclarationService } from '@/lib/services/declaration.service';

// 获取单个宣告
const declaration = await DeclarationService.getById(id: string): Promise<Declaration | null>

// 获取宣告列表
const result = await DeclarationService.getList(params?: {
  page?: number;
  limit?: number;
  userId?: string;
  isFeatured?: boolean;
}): Promise<{ declarations: Declaration[]; total: number }>

// 获取精选宣告
const declarations = await DeclarationService.getFeatured(limit: number): Promise<Declaration[]>

// 创建宣告
const declaration = await DeclarationService.create(data: Partial<Declaration>): Promise<Declaration | null>

// 更新宣告
const declaration = await DeclarationService.update(id: string, data: Partial<Declaration>): Promise<Declaration | null>

// 删除宣告
const success = await DeclarationService.delete(id: string): Promise<boolean>
```

### SettingsService（设置服务）

```typescript
import { SettingsService } from '@/lib/services/settings.service';

// 获取所有设置
const settings = await SettingsService.getAll(): Promise<Settings>

// 获取单个设置项
const value = await SettingsService.getByKey(key: string): Promise<any>

// 更新设置
const success = await SettingsService.update(key: string, value: any): Promise<boolean>

// 批量更新设置
const success = await SettingsService.updateMany(settings: Partial<Settings>): Promise<boolean>
```

---

## 创建新服务

### 步骤1：定义类型（types.ts）

```typescript
// src/lib/services/types.ts

// 原始数据格式（API 返回）
export interface RawYourEntity {
  id: number;
  field_name: string;
  created_at: string;
  [key: string]: any;
}

// 前端数据格式（页面使用）
export interface YourEntity {
  id: string;
  fieldName: string;  // camelCase
  createdAt: Date;    // Date 类型
  // ... 其他字段
}
```

### 步骤2：创建服务（your-entity.service.ts）

```typescript
// src/lib/services/your-entity.service.ts

import { fetchApi, apiClient } from '@/lib/api/client';
import type { YourEntity, RawYourEntity, PaginationParams } from '@/lib/services/types';

// 数据转换函数
function transformYourEntity(raw: RawYourEntity): YourEntity {
  return {
    id: raw.id.toString(),
    fieldName: raw.field_name || '默认值',  // 默认值
    createdAt: new Date(raw.created_at),
    // ... 其他字段转换
  };
}

// 服务类
export class YourEntityService {
  static async getById(id: string | number): Promise<YourEntity | null> {
    try {
      const response = await fetchApi<{ data: RawYourEntity }>(`/your-entity/${id}`);
      if (response.success && response.data) {
        return transformYourEntity(response.data);
      }
      return null;
    } catch (error) {
      console.error(`获取实体 ${id} 失败:`, error);
      return null;
    }
  }

  static async getList(params?: PaginationParams): Promise<{ entities: YourEntity[]; total: number }> {
    try {
      const queryParams = apiClient.buildQueryParams({
        page: params?.page || 1,
        limit: params?.limit || 10,
      });

      const response = await fetchApi<{ data: RawYourEntity[] }>(
        `/your-entity?${queryParams}`
      );

      if (response.success && response.data) {
        const entities = response.data.map(transformYourEntity);
        return {
          entities,
          total: response.pagination?.total || 0,
        };
      }

      return { entities: [], total: 0 };
    } catch (error) {
      console.error('获取实体列表失败:', error);
      return { entities: [], total: 0 };
    }
  }

  // ... 其他方法（create, update, delete）
}
```

### 步骤3：使用服务

```typescript
import { YourEntityService } from '@/lib/services/your-entity.service';

const entities = await YourEntityService.getList({ limit: 10 });
console.log(entities.entities);  // YourEntity[]
```

---

## 常见问题

### Q1: 服务层会影响性能吗？

A: 不会。服务层只是做了数据转换，不会增加额外的网络请求。而且服务层内部做了错误处理，反而能提高稳定性。

### Q2: 如果 API 返回的数据格式变了怎么办？

A: 只需修改服务层的 `transform` 函数，页面代码无需修改。

### Q3: 如果某个字段真的可能为 null 怎么办？

A: 在类型定义中明确标记为 `T | null`，在使用时进行类型检查：

```typescript
if (user.age !== null) {
  console.log(user.age);  // TypeScript 知道这里不是 null
}
```

### Q4: 服务层可以缓存数据吗？

A: 可以。后续可以集成 React Query 或 SWR 来实现数据缓存和自动刷新。

### Q5: 如何调试服务层？

A: 所有服务方法都有 `console.error` 日志，可以在浏览器控制台查看错误信息。

---

## 下一步

1. 查看示例：`src/app/discovery/page-example-service-layer.tsx`
2. 改造现有页面，逐步使用服务层
3. 创建新的服务，覆盖更多数据类型
4. 集成 React Query 实现数据缓存和自动刷新

---

## 参考资料

- TypeScript 类型定义：`src/lib/services/types.ts`
- API 客户端：`src/lib/api/client.ts`
- 示例页面：`src/app/discovery/page-example-service-layer.tsx`
