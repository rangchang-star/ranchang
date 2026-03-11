# 燃场 App - 代码规范文档

**版本**: 1.0.0
**最后更新**: 2026-03-11
**适用项目**: 燃场 App (Next.js 16 + React 18 + TypeScript)

---

## 📋 目录

1. [命名规范](#命名规范)
2. [文件组织规范](#文件组织规范)
3. [组件开发规范](#组件开发规范)
4. [TypeScript 规范](#typescript-规范)
5. [React 规范](#react-规范)
6. [API 开发规范](#api-开发规范)
7. [Git 提交规范](#git-提交规范)
8. [代码审查规范](#代码审查规范)

---

## 命名规范

### 1.1 文件命名

#### 组件文件

- **规则**: 使用 PascalCase
- **示例**:

  ```
  ✅ UserProfile.tsx
  ✅ ButtonGroup.tsx
  ✅ AuthGuard.tsx

  ❌ userProfile.tsx
  ❌ button-group.tsx
  ```

#### 页面文件

- **规则**: 使用 kebab-case（小写 + 连字符）
- **示例**:

  ```
  ✅ user-profile/page.tsx
  ✅ activity-details/page.tsx
  ✅ settings-page/page.tsx

  ❌ userProfile/page.tsx
  ❌ activityDetails/page.tsx
  ```

#### 工具/服务文件

- **规则**: 使用 kebab-case
- **示例**:

  ```
  ✅ auth-code-utils.ts
  ✅ user.service.ts
  ✅ api-helper.ts

  ❌ authCodeUtils.ts
  ❌ userService.ts
  ```

#### 测试文件

- **规则**: 与源文件同名 + `.test.ts` 或 `.spec.ts`
- **示例**:

  ```
  ✅ user.service.test.ts
  ✅ Button.test.tsx
  ✅ auth.test.ts

  ❌ user-service-tests.ts
  ❌ ButtonSpec.tsx
  ```

### 1.2 变量命名

#### 常量

- **规则**: UPPER_SNAKE_CASE
- **示例**:

  ```typescript
  ✅ const MAX_RETRY_COUNT = 3;
  ✅ const API_BASE_URL = 'https://api.example.com';
  ✅ const DEFAULT_PAGE_SIZE = 10;

  ❌ const maxRetryCount = 3;
  ❌ const apiBaseUrl = 'https://api.example.com';
  ```

#### 普通变量

- **规则**: camelCase
- **示例**:

  ```typescript
  ✅ let userName = '张伟';
  ✅ const isActive = true;
  ✅ let userProfileData: UserProfile;

  ❌ let user_name = '张伟';
  ❌ const is_active = true;
  ❌ let userProfile_data: UserProfile;
  ```

#### 布尔变量

- **规则**: 使用 is/has/can/should 前缀
- **示例**:

  ```typescript
  ✅ const isLoggedIn = true;
  ✅ const hasPermission = false;
  ✅ const canEdit = true;
  ✅ const isLoading = false;

  ❌ const logged = true;
  ❌ const permission = false;
  ❌ const editable = true;
  ```

#### 函数命名

- **规则**: camelCase，动词开头
- **示例**:

  ```typescript
  ✅ function getUserById(id: string) { }
  ✅ function fetchUserData() { }
  ✅ function validateEmail(email: string) { }
  ✅ function handleFormSubmit() { }

  ❌ function getUser(id: string) { }
  ❌ function dataFetch() { }
  ❌ function emailValidate(email: string) { }
  ```

#### 事件处理函数

- **规则**: handle + 事件名
- **示例**:

  ```typescript
  ✅ const handleClick = () => { };
  ✅ const handleSubmit = (e: FormEvent) => { };
  ✅ const handleInputChange = (e: ChangeEvent) => { };
  ✅ const handleUserLogin = async () => { };

  ❌ const click = () => { };
  ❌ const submit = (e: FormEvent) => { };
  ❌ const onInputChange = (e: ChangeEvent) => { };
  ```

### 1.3 类和接口命名

#### 类（Class）

- **规则**: PascalCase
- **示例**:

  ```typescript
  ✅ class UserService { }
  ✅ class ValidationError extends Error { }
  ✅ class AuthProvider { }

  ❌ class userService { }
  ❌ class validation_error extends Error { }
  ```

#### 接口（Interface）

- **规则**: PascalCase，无前缀（或使用 I 前缀，团队统一）
- **示例**:

  ```typescript
  // 推荐方式（无前缀）
  ✅ interface User { }
  ✅ interface ApiResponse<T> { }
  ✅ interface LoginFormValues { }

  // 或使用 I 前缀（团队统一）
  ✅ interface IUser { }
  ✅ interface IApiResponse<T> { }

  ❌ interface user { }
  ❌ interface api_response<T> { }
  ```

#### 类型别名（Type）

- **规则**: PascalCase
- **示例**:

  ```typescript
  ✅ type UserId = string;
  ✅ type UserRole = 'admin' | 'user' | 'guest';
  ✅ type FetchResult<T> = { data: T | null; error: string | null };

  ❌ type userId = string;
  ❌ type userRole = 'admin' | 'user' | 'guest';
  ```

### 1.4 数据库命名

#### 表名

- **规则**: snake_case（数据库层）
- **示例**:

  ```sql
  ✅ CREATE TABLE app_users ( ... );
  ✅ CREATE TABLE activity_registrations ( ... );
  ✅ CREATE TABLE daily_declarations ( ... );

  ❌ CREATE TABLE AppUsers ( ... );
  ❌ CREATE TABLE activityRegistrations ( ... );
  ```

#### 字段名

- **规则**: snake_case（数据库层）
- **示例**:

  ```sql
  ✅ user_id VARCHAR(36),
  ✅ created_at TIMESTAMP,
  ✅ is_featured BOOLEAN,
  ✅ first_name VARCHAR(50),

  ❌ userId VARCHAR(36),
  ❌ createdAt TIMESTAMP,
  ❌ isFeatured BOOLEAN,
  ```

#### 映射到代码

- **规则**: 数据库用 snake_case，代码用 camelCase
- **示例**:

  ```typescript
  // 数据库字段
  ✅ user_id, created_at, is_featured

  // TypeScript 类型
  ✅ userId, createdAt, isFeatured

  // 映射示例
  const user = {
    userId: row.user_id,
    createdAt: new Date(row.created_at),
    isFeatured: row.is_featured,
  };
  ```

---

## 文件组织规范

### 2.1 目录结构

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证相关页面组
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # 仪表盘页面组
│   │   ├── discover/
│   │   ├── ignite/
│   │   └── profile/
│   ├── api/                 # API 路由
│   │   ├── auth/
│   │   ├── activities/
│   │   └── users/
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
├── components/              # 可复用组件
│   ├── ui/                  # shadcn/ui 组件
│   ├── auth-guard.tsx       # 认证守卫
│   └── admin-layout.tsx     # 管理后台布局
├── contexts/                # React Context
│   ├── auth-context.tsx
│   └── login-modal-context.tsx
├── hooks/                   # 自定义 Hooks
│   ├── use-mobile.ts
│   └── use-auth.ts
├── lib/                     # 工具库
│   ├── services/            # 服务层
│   │   ├── user.service.ts
│   │   ├── activity.service.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── utils.ts             # 通用工具函数
│   └── auth-code-utils.ts   # 认证相关工具
├── storage/                 # 存储配置
│   └── database/
│       └── supabase/
│           ├── connection.ts
│           └── schema.ts
└── types/                   # 全局类型定义（可选）
    └── index.ts
```

### 2.2 文件导入顺序

```typescript
// 1. React 相关
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. 第三方库
import { clsx } from 'clsx';
import { z } from 'zod';

// 3. 组件
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

// 4. Context 和 Hooks
import { useAuth } from '@/contexts/auth-context';
import { useMobile } from '@/hooks/use-mobile';

// 5. 服务层和工具
import { UserService } from '@/lib/services';
import { formatDate } from '@/lib/utils';

// 6. 类型定义
import type { User, Activity } from '@/lib/services/types';

// 7. 样式（如果有）
import './styles.css';

// 8. 相对路径导入（同级组件）
import { ChildComponent } from './ChildComponent';
```

### 2.3 组件文件结构

````typescript
/**
 * 组件说明
 *
 * @description 组件功能描述
 * @example
 * ```tsx
 * <UserProfile user={userData} />
 * ```
 */

// 1. 导入
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. 类型定义
interface UserProfileProps {
  user: User;
  onEdit?: () => void;
}

// 3. 组件定义
export function UserProfile({ user, onEdit }: UserProfileProps) {
  // 4. Hooks
  const [isEditing, setIsEditing] = useState(false);

  // 5. 事件处理函数
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };

  // 6. 辅助函数
  const formatUserAge = (age: number | null) => {
    return age ? `${age}岁` : '年龄未知';
  };

  // 7. 渲染
  return (
    <div className="user-profile">
      {/* JSX 内容 */}
    </div>
  );
}

// 8. 子组件（如果有）
function UserAvatar({ user }: { user: User }) {
  return <div>{user.avatar}</div>;
}

// 9. 默认导出（如果需要）
export default UserProfile;
````

---

## 组件开发规范

### 3.1 组件定义

#### 函数组件

- **规则**: 使用函数组件，避免类组件
- **示例**:

  ```typescript
  ✅ export function UserProfile({ user }: { user: User }) {
    return <div>{user.name}</div>;
  }

  ❌ export class UserProfile extends Component {
    render() { return <div>{this.props.user.name}</div>; }
  }
  ```

#### 组件导出

- **规则**: 优先使用命名导出，便于代码分割
- **示例**:

  ```typescript
  ✅ export function UserProfile() { }
  ✅ export default UserProfile;

  ❌ export default function UserProfile() { }
  ```

### 3.2 Props 定义

#### 使用 TypeScript 接口

- **规则**: 明确定义 Props 类型
- **示例**:

  ```typescript
  // ✅ 正确
  interface UserProfileProps {
    user: User;
    onEdit?: () => void;
    size?: 'sm' | 'md' | 'lg';
  }

  export function UserProfile({ user, onEdit, size = 'md' }: UserProfileProps) {
    return <div>{user.name}</div>;
  }

  // ❌ 错误
  export function UserProfile(props: any) {
    return <div>{props.user.name}</div>;
  }
  ```

#### 可选 Props

- **规则**: 使用 `?` 标记可选 Props
- **示例**:

  ```typescript
  ✅ interface Props {
    user: User;
    onEdit?: () => void;      // 可选
    theme?: 'light' | 'dark';  // 可选
  }

  ❌ interface Props {
    user: User;
    onEdit: () => void | null;  // 不推荐
    theme?: 'light' | 'dark' | undefined;  // 不推荐
  }
  ```

### 3.3 State 管理

#### 使用 useState

- **规则**: 明确定义 State 类型
- **示例**:

  ```typescript
  ✅ const [isLoading, setIsLoading] = useState<boolean>(false);
  ✅ const [userData, setUserData] = useState<User | null>(null);
  ✅ const [items, setItems] = useState<string[]>([]);

  ❌ const [isLoading, setIsLoading] = useState(false);  // 类型推断可能不准确
  ```

#### State 命名

- **规则**: 使用 [value, setValue] 模式
- **示例**:

  ```typescript
  ✅ const [userName, setUserName] = useState('');
  ✅ const [isActive, setIsActive] = useState(false);
  ✅ const [userList, setUserList] = useState<User[]>([]);

  ❌ const [userName, changeUserName] = useState('');
  ❌ const [isActive, toggleActive] = useState(false);
  ```

### 3.4 事件处理

#### 事件命名

- **规则**: 使用 handle 前缀
- **示例**:

  ```typescript
  ✅ const handleClick = () => { };
  ✅ const handleSubmit = (e: FormEvent) => { };
  ✅ const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { };

  ❌ const onClick = () => { };
  ❌ const onSubmit = (e: FormEvent) => { };
  ```

#### 事件参数

- **规则**: 明确事件类型
- **示例**:

  ```typescript
  ✅ const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // ...
  };

  ❌ const handleClick = (e: any) => {
    e.preventDefault();
    // ...
  };
  ```

### 3.5 组件拆分

#### 单一职责

- **规则**: 组件只做一件事
- **示例**:

  ```typescript
  // ✅ 正确 - 拆分为多个小组件
  export function UserProfile({ user }: { user: User }) {
    return (
      <div>
        <UserAvatar user={user} />
        <UserInfo user={user} />
        <UserActions user={user} />
      </div>
    );
  }

  // ❌ 错误 - 一个组件做太多事
  export function UserProfile({ user }: { user: User }) {
    return (
      <div>
        <Avatar src={user.avatar} />
        <div>{user.name}</div>
        <div>{user.email}</div>
        <div>{user.phone}</div>
        <Button onClick={() => editUser(user)}>编辑</Button>
        <Button onClick={() => deleteUser(user.id)}>删除</Button>
        {/* 100+ 行 JSX */}
      </div>
    );
  }
  ```

---

## TypeScript 规范

### 4.1 类型定义

#### 优先使用 interface

- **规则**: 定义对象类型使用 interface
- **示例**:

  ```typescript
  ✅ interface User {
    id: string;
    name: string;
  }

  ❌ type User = {
    id: string;
    name: string;
  };
  ```

#### 使用 type 定义联合类型

- **规则**: 联合类型、元组使用 type
- **示例**:

  ```typescript
  ✅ type UserRole = 'admin' | 'user' | 'guest';
  ✅ type Coordinates = [number, number];
  ✅ type FetchResult<T> = { data: T | null; error: string | null };

  ❌ interface UserRole {
    type: 'admin' | 'user' | 'guest';
  }
  ```

### 4.2 类型注解

#### 函数参数

- **规则**: 明确标注参数和返回值类型
- **示例**:

  ```typescript
  ✅ function getUserById(id: string): Promise<User> {
    return UserService.getById(id);
  }

  ❌ function getUserById(id) {
    return UserService.getById(id);
  }
  ```

#### 回调函数

- **规则**: 明确回调参数类型
- **示例**:

  ```typescript
  ✅ interface Props {
    onSuccess: (user: User) => void;
    onError: (error: Error) => void;
  }

  ❌ interface Props {
    onSuccess: (user: any) => void;
    onError: (error: any) => void;
  }
  ```

### 4.3 泛型

#### 泛型命名

- **规则**: 使用大写字母 T, U, V
- **示例**:

  ```typescript
  ✅ function fetchData<T>(url: string): Promise<T> { }
  ✅ function map<T, U>(array: T[], fn: (item: T) => U): U[] { }

  ❌ function fetchData<Data>(url: string): Promise<Data> { }
  ❌ function map<ItemType, ResultType>(array: ItemType[], fn: (item: ItemType) => ResultType): ResultType[] { }
  ```

### 4.4 类型断言

#### 避免使用 any

- **规则**: 优先使用 unknown 或具体类型
- **示例**:

  ```typescript
  // ✅ 推荐 - 使用 unknown + 类型守卫
  const data: unknown = JSON.parse(jsonString);
  if (typeof data === 'object' && data !== null) {
    const user = data as User;
  }

  // ⚠️ 允许 - 在明确知道类型时使用 as
  const user = response.data as User;

  // ❌ 避免 - 滥用 any
  const user: any = response.data;
  ```

---

## React 规范

### 5.1 Hooks 使用

#### Hooks 命名

- **规则**: 以 use 开头
- **示例**:

  ```typescript
  ✅ function useAuth() { }
  ✅ function useUserProfile(userId: string) { }
  ✅ function useLocalStorage<T>(key: string, defaultValue: T) { }

  ❌ function getAuth() { }
  ❌ function fetchUserProfile(userId: string) { }
  ```

#### 自定义 Hooks

- **规则**: 封装可复用逻辑
- **示例**:

  ```typescript
  // ✅ 正确 - 封装可复用逻辑
  export function useUserProfile(userId: string) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchUser(userId)
        .then(setUser)
        .finally(() => setLoading(false));
    }, [userId]);

    return { user, loading };
  }

  // ❌ 错误 - 逻辑混乱
  export function useUserProfile(userId: string) {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    // 混合了多个不相关的逻辑
    useEffect(() => {
      /* ... */
    }, []);
  }
  ```

### 5.2 useEffect

#### 依赖数组

- **规则**: 明确列出所有依赖
- **示例**:

  ```typescript
  // ✅ 正确 - 明确依赖
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // ❌ 错误 - 缺少依赖
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // ESLint 会报错

  // ❌ 错误 - 使用 eslint-disable
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  ```

### 5.3 条件渲染

#### 使用三元运算符

- **规则**: 简单条件使用三元运算符
- **示例**:

  ```typescript
  // ✅ 简单条件
  {isLoading ? <Spinner /> : <Content />}

  // ✅ 有默认值
  {user?.name || '未知用户'}

  // ❌ 复杂逻辑使用 && 可能有问题
  {user && user.name && user.avatar && <UserProfile user={user} />}
  ```

#### 使用 && 运算符

- **规则**: 可选渲染使用 &&
- **示例**:

  ```typescript
  // ✅ 正确
  {isLoading && <Spinner />}

  // ❌ 错误 - 0 会被渲染
  {count && <Badge>{count}</Badge>}

  // ✅ 正确 - 使用布尔转换
  {!!count && <Badge>{count}</Badge>}
  ```

---

## API 开发规范

### 6.1 API 路由结构

#### RESTful 风格

- **规则**: 使用 RESTful 风格
- **示例**:

  ```
  ✅ GET    /api/users          - 获取用户列表
  ✅ GET    /api/users/:id      - 获取单个用户
  ✅ POST   /api/users          - 创建用户
  ✅ PUT    /api/users/:id      - 更新用户（全量）
  ✅ PATCH  /api/users/:id      - 更新用户（部分）
  ✅ DELETE /api/users/:id      - 删除用户

  ❌ GET    /api/getUsers
  ❌ POST   /api/createUser
  ❌ POST   /api/users/:id/update
  ```

### 6.2 响应格式

#### 统一响应格式

- **规则**: 使用统一的响应格式
- **示例**:

  ```typescript
  // ✅ 成功响应
  {
    "success": true,
    "data": { /* 业务数据 */ },
    "message": "操作成功"
  }

  // ✅ 失败响应
  {
    "success": false,
    "error": "错误信息",
    "code": "ERROR_CODE"
  }

  // ❌ 不统一的响应
  { "result": true, "payload": { } }
  { "status": "error", "msg": "..." }
  ```

### 6.3 错误处理

#### 统一错误处理

- **规则**: 统一错误码和错误信息
- **示例**:

  ```typescript
  // ✅ 正确 - 统一错误格式
  return NextResponse.json(
    {
      success: false,
      error: '用户不存在',
      code: 'USER_NOT_FOUND',
    },
    { status: 404 }
  );

  // ❌ 错误 - 不统一的错误
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
  ```

---

## Git 提交规范

### 7.1 提交信息格式

#### Conventional Commits

- **规则**: 使用 Conventional Commits 规范
- **格式**: `<type>(<scope>): <subject>`

#### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关
- `ci`: CI/CD 相关

#### 示例

```bash
# ✅ 正确
feat(auth): 添加用户登录功能
fix(api): 修复用户列表分页错误
docs(readme): 更新安装说明
refactor(user): 重构用户服务层

# ❌ 错误
添加登录功能
修复bug
update
```

### 7.2 提交信息格式

#### 完整格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 示例

```bash
feat(auth): 添加用户登录功能

- 实现手机号验证码登录
- 实现密码登录
- 添加登录状态管理

Closes #123
```

### 7.3 分支命名

#### 功能分支

- **规则**: `feature/<feature-name>`
- **示例**:

  ```bash
  ✅ feature/user-authentication
  ✅ feature/activity-registration
  ✅ feature/admin-dashboard

  ❌ user-auth
  ❌ new-feature
  ```

#### 修复分支

- **规则**: `fix/<bug-description>`
- **示例**:

  ```bash
  ✅ fix/login-validation-error
  ✅ fix/api-timeout-issue

  ❌ bug-fix
  ❌ hotfix-123
  ```

---

## 代码审查规范

### 8.1 审查清单

#### 功能性

- [ ] 功能是否正确实现
- [ ] 边界情况是否处理
- [ ] 错误处理是否完善

#### 代码质量

- [ ] 代码是否符合规范
- [ ] 是否有重复代码
- [ ] 命名是否清晰
- [ ] 注释是否必要且准确

#### 性能

- [ ] 是否有不必要的重渲染
- [ ] 是否有内存泄漏
- [ ] 是否有性能瓶颈

#### 安全

- [ ] 是否有 XSS 风险
- [ ] 是否有 SQL 注入风险
- [ ] 敏感信息是否泄露

### 8.2 审查流程

1. **自我审查**
   - 运行 `pnpm tsc --noEmit` 检查类型
   - 运行 `pnpm lint` 检查代码风格
   - 运行 `pnpm test` 运行测试

2. **提交 PR**
   - 提供清晰的描述
   - 关联相关的 Issue
   - 添加截图（如果涉及 UI 变更）

3. **同行审查**
   - 至少 1 人审查
   - 审查者需确认代码质量
   - 提出改进建议

4. **合并**
   - 确认 CI 通过
   - 确认无冲突
   - 删除 feature 分支

---

## 工具配置

### ESLint 规则

项目已配置 ESLint，自动检查：

- TypeScript 类型错误
- React 最佳实践
- 代码风格一致性

### Prettier 规则

项目已配置 Prettier，自动格式化：

- 缩进：2 空格
- 引号：单引号
- 分号：分号
- 尾随逗号：ES5

### Git Hooks

项目已配置 Husky 和 lint-staged：

- 提交前自动运行 lint
- 提交前自动格式化代码

---

## 附录

### A. 快速参考

#### 常用命令

```bash
# 类型检查
pnpm tsc --noEmit

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行测试
pnpm test

# 构建项目
pnpm build
```

### B. 相关文档

- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [React 文档](https://react.dev/)
- [Next.js 文档](https://nextjs.org/docs)
- [ESLint 规则](https://eslint.org/docs/rules/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**文档维护者**: 开发团队
**最后更新**: 2026-03-11
**版本**: 1.0.0
