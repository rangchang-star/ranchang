# 服务层使用指南

## 概述

服务层是「燃场」App 的前端数据访问层，基于 Drizzle ORM 构建。它提供了统一的数据访问接口，确保数据格式的一致性和类型安全。

## 核心特性

### 1. 统一的命名规范
- 数据库字段：`snake_case`（如 `user_name`）
- 前端字段：`camelCase`（如 `userName`）
- **服务层自动处理转换，前端无需关心**

### 2. 类型安全
- 完整的 TypeScript 类型定义
- 所有字段都有明确的 null 标记
- IDE 自动提示和类型检查

### 3. 默认值处理
- 所有可能为空的字段都有默认值
- 防止 undefined 错误
- 确保页面不会因为数据缺失而崩溃

### 4. 统一错误处理
- 所有服务方法都有 try-catch
- 失败时返回 null 或空数组
- 不会让页面崩溃

## 使用方法

### 导入服务

```typescript
import {
  getUserById,
  getActivities,
  getDeclarations,
  getSettings,
  type User,
  type Activity,
} from '@/lib/services';
```

### 示例 1: 获取单个用户

```typescript
import { getUserById } from '@/lib/services';

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    return <div>用户不存在</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* user.avatar 保证有值，不会是 undefined */}
      <img src={user.avatar} alt={user.name} />
    </div>
  );
}
```

### 示例 2: 获取活动列表（分页）

```typescript
import { getActivities } from '@/lib/services';

export default async function ActivitiesPage() {
  const { activities, total } = await getActivities({
    page: 1,
    limit: 10,
    category: '社交',
    status: 'active',
  });

  return (
    <div>
      <h1>活动列表</h1>
      <p>共 {total} 个活动</p>
      {activities.map(activity => (
        <div key={activity.id}>
          <h2>{activity.title}</h2>
          <p>{activity.category}</p>
          <img src={activity.image} alt={activity.title} />
        </div>
      ))}
    </div>
  );
}
```

### 示例 3: 获取用户宣告

```typescript
import { getUserDeclarations, getUserById } from '@/lib/services';

export default async function UserDeclarationsPage({ params }: { params: { userId: string } }) {
  const user = await getUserById(params.userId);
  const declarations = await getUserDeclarations(params.userId);

  if (!user) {
    return <div>用户不存在</div>;
  }

  return (
    <div>
      <h1>{user.name} 的宣告</h1>
      {declarations.map(declaration => (
        <div key={declaration.id}>
          <p>{declaration.text}</p>
          <p>浏览次数: {declaration.views}</p>
        </div>
      ))}
    </div>
  );
}
```

### 示例 4: 获取应用设置

```typescript
import { getSettings } from '@/lib/services';

export default async function DiscoveryPage() {
  const settings = await getSettings();

  // settings 保证不为 null，即使数据库没有数据也会返回默认值
  return (
    <div>
      <h1>{settings.pageTitles.discovery}</h1>
      <p>{settings.discovery.slogan}</p>
      <nav>
        <span>{settings.navigation.discovery.icon} {settings.navigation.discovery.label}</span>
        <span>{settings.navigation.ignition.icon} {settings.navigation.ignition.label}</span>
        <span>{settings.navigation.profile.icon} {settings.navigation.profile.label}</span>
      </nav>
    </div>
  );
}
```

## 服务列表

### 用户服务

```typescript
// 获取单个用户
getUserById(id: string): Promise<User | null>

// 获取用户列表（分页）
getUsers(options?: {
  page?: number;
  limit?: number;
  status?: string;
  isFeatured?: boolean;
}): Promise<{ users: User[]; total: number }>

// 根据邮箱获取用户
getUserByEmail(email: string): Promise<User | null>

// 创建用户
createUser(userData: Partial<User>): Promise<User | null>

// 更新用户
updateUser(id: string, userData: Partial<User>): Promise<User | null>

// 删除用户
deleteUser(id: string): Promise<boolean>

// 获取精选用户
getFeaturedUsers(limit?: number): Promise<User[]>
```

### 活动服务

```typescript
// 获取单个活动
getActivityById(id: string): Promise<Activity | null>

// 获取活动列表（分页）
getActivities(options?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
}): Promise<{ activities: Activity[]; total: number }>

// 获取热门活动
getFeaturedActivities(limit?: number): Promise<Activity[]>

// 获取活动分类列表
getActivityCategories(): Promise<string[]>

// 创建活动
createActivity(activityData: Partial<Activity>): Promise<Activity | null>

// 更新活动
updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity | null>

// 删除活动
deleteActivity(id: string): Promise<boolean>

// 获取即将开始的活动
getUpcomingActivities(limit?: number): Promise<Activity[]>
```

### 宣告服务

```typescript
// 获取单个宣告
getDeclarationById(id: string): Promise<Declaration | null>

// 获取宣告列表（分页）
getDeclarations(options?: {
  page?: number;
  limit?: number;
  userId?: string;
  isFeatured?: boolean;
  search?: string;
}): Promise<{ declarations: Declaration[]; total: number }>

// 获取用户的宣告
getUserDeclarations(userId: string, limit?: number): Promise<Declaration[]>

// 获取精选宣告
getFeaturedDeclarations(limit?: number): Promise<Declaration[]>

// 创建宣告
createDeclaration(declarationData: Partial<Declaration>): Promise<Declaration | null>

// 更新宣告
updateDeclaration(id: string, declarationData: Partial<Declaration>): Promise<Declaration | null>

// 删除宣告
deleteDeclaration(id: string): Promise<boolean>

// 增加宣告浏览次数
incrementDeclarationViews(id: string): Promise<Declaration | null>
```

### 设置服务

```typescript
// 获取应用设置
getSettings(): Promise<Settings>
```

## 数据类型

### User（用户）

```typescript
interface User {
  id: string;
  name: string;              // 必有值
  email: string;             // 必有值
  avatar: string;            // 必有值（默认头像）
  age: number | null;        // 可为空
  company: string | null;    // 可为空
  position: string | null;   // 可为空
  phone: string | null;      // 可为空
  gender: string | null;     // 可为空
  companyScale: string | null; // 可为空
  tags: string[];            // 必有值（默认空数组）
  hardcoreTags: string[];    // 必有值（默认空数组）
  abilityTags: string[];     // 必有值（默认空数组）
  resourceTags: string[];    // 必有值（默认空数组）
  status: string;            // 必有值
  isFeatured: boolean;       // 必有值
  joinDate: Date;            // 必有值
  lastLogin: Date | null;    // 可为空
  createdAt: Date;           // 必有值
  updatedAt: Date | null;    // 可为空
}
```

### Activity（活动）

```typescript
interface Activity {
  id: string;
  title: string;
  subtitle: string;          // 必有值（默认空字符串）
  category: string;          // 必有值（默认"其他"）
  description: string;       // 必有值（默认空字符串）
  image: string;             // 必有值（默认图片）
  address: string;           // 必有值（默认空字符串）
  startDate: Date;           // 必有值
  endDate: Date;             // 必有值
  capacity: number;          // 必有值（默认0）
  teaFee: number;            // 必有值（默认0）
  status: string;            // 必有值
  createdBy: string;         // 必有值
  createdAt: Date;           // 必有值
  updatedAt: Date;           // 必有值
}
```

### Declaration（宣告）

```typescript
interface Declaration {
  id: string;
  userId: string;            // 必有值
  direction: string | null;  // 可为空
  text: string;              // 必有值
  summary: string | null;    // 可为空
  audioUrl: string | null;   // 可为空
  views: number;             // 必有值（默认0）
  date: Date;                // 必有值
  isFeatured: boolean;       // 必有值
  createdAt: Date;           // 必有值
  updatedAt: Date;           // 必有值
}
```

### Settings（设置）

```typescript
interface Settings {
  navigation: {
    discovery: { icon: string; label: string };
    ignition: { icon: string; label: string };
    profile: { icon: string; label: string };
  };
  pageTitles: {
    discovery: string;
    activities: string;
    visit: string;
    assets: string;
    declarations: string;
    connection: string;
    consultation: string;
  };
  discovery: {
    slogan: string;
    logo: string;
    music: string;
    bgImage: string;
  };
}
```

## 最佳实践

### 1. 始终检查 null

```typescript
// ✅ 好的做法
const user = await getUserById(id);
if (!user) {
  return <div>用户不存在</div>;
}

// ❌ 坏的做法
const user = await getUserById(id);
return <div>{user.name}</div>; // 可能为 null
```

### 2. 使用解构赋值

```typescript
// ✅ 好的做法
const { activities, total } = await getActivities({ page: 1, limit: 10 });

// ❌ 坏的做法
const result = await getActivities({ page: 1, limit: 10 });
const activities = result.activities;
const total = result.total;
```

### 3. 使用类型提示

```typescript
import { type User } from '@/lib/services';

const user: User | null = await getUserById(id);
```

### 4. 错误处理由服务层处理

```typescript
// ✅ 好的做法（服务层已处理错误）
const user = await getUserById(id);

// ❌ 坏的做法（重复处理）
try {
  const user = await getUserById(id);
} catch (error) {
  // 不需要，服务层已经处理了
}
```

## 迁移指南

如果你之前使用的是 API 客户端，迁移到服务层非常简单：

### 旧代码（API 客户端）

```typescript
import { getUser } from '@/lib/api/client';

const user = await getUser(params.id);
```

### 新代码（服务层）

```typescript
import { getUserById } from '@/lib/services';

const user = await getUserById(params.id);
```

**数据格式完全一致，无需修改 UI 代码！**

## 常见问题

### Q1: 为什么服务层返回的是 User | null？

A: 因为用户可能不存在，需要前端处理这种情况。所有服务层方法都遵循这个原则。

### Q2: 为什么所有字段都有默认值？

A: 为了防止页面因为数据缺失而崩溃。数据库可能没有某条记录，或者某条记录的某些字段为空。

### Q3: 服务层会抛出异常吗？

A: 不会。所有服务层方法都有 try-catch，失败时返回 null 或空数组。

### Q4: 我需要手动处理 snake_case 和 camelCase 转换吗？

A: 不需要。服务层已经自动处理了转换，前端直接使用 camelCase 即可。

### Q5: 可以在客户端组件中使用服务层吗？

A: 不可以。服务层只能在 Server Component 中使用（因为它直接访问数据库）。客户端组件应该通过 props 接收数据。

```typescript
// ✅ Server Component
import { getActivities } from '@/lib/services';

export default async function ActivitiesPage() {
  const { activities } = await getActivities();
  return <ActivityList activities={activities} />;
}

// ✅ Client Component
'use client';

export default function ActivityList({ activities }: { activities: Activity[] }) {
  // 可以在这里使用数据
  return <div>{/* 渲染活动列表 */}</div>;
}

// ❌ 错误：在客户端组件中直接使用服务层
'use client';

import { getActivities } from '@/lib/services';

export default function ActivitiesPage() {
  const { activities } = await getActivities(); // ❌ 错误！
  return <div>{/* ... */}</div>;
}
```

## 总结

服务层提供了：
- ✅ 统一的数据访问接口
- ✅ 完整的类型安全
- ✅ 自动处理字段转换
- ✅ 统一的错误处理
- ✅ 默认值保护

使用服务层，你可以专注于业务逻辑，而不用担心数据格式和错误处理！
