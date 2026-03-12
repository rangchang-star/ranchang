# 管理后台迁移指南 - 新文件存储架构

本指南指导管理后台开发者如何适配新的文件存储架构。

## 迁移步骤

### 步骤1：导入新组件

在需要上传图片的页面中导入新组件：

```typescript
import { AvatarUpload } from '@/components/avatar-upload';
import { ImageUpload } from '@/components/image-upload';
```

### 步骤2：修改状态管理

**旧方式**（存储URL）：
```typescript
const [avatarUrl, setAvatarUrl] = useState('');
const [coverImageUrl, setCoverImageUrl] = useState('');
```

**新方式**（存储fileKey）：
```typescript
const [avatarKey, setAvatarKey] = useState<string | null>(null);
const [coverImageKey, setCoverImageKey] = useState<string | null>(null);
```

### 步骤3：修改上传处理

**旧方式**：
```typescript
const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // 创建本地预览URL
    const url = URL.createObjectURL(file);
    setAvatarUrl(url); // ❌ 这只是本地URL，无法持久化
  }
};
```

**新方式**（使用新组件）：
```typescript
const handleAvatarUploadSuccess = (fileKey: string) => {
  setAvatarKey(fileKey); // ✅ 保存fileKey，永久有效
};

// 在JSX中使用
<AvatarUpload
  currentAvatarKey={avatarKey}
  userId={memberId}
  name={name}
  onUploadSuccess={handleAvatarUploadSuccess}
  size="xl"
/>
```

### 步骤4：修改保存逻辑

**旧方式**：
```typescript
const handleSave = async () => {
  const response = await fetch(`/admin/api/members/${memberId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      avatar: avatarUrl, // ❌ 保存临时URL
      // ...
    }),
  });
};
```

**新方式**：
```typescript
const handleSave = async () => {
  const response = await fetch(`/admin/api/members/${memberId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      avatarKey, // ✅ 保存fileKey
      // ...
    }),
  });
};
```

### 步骤5：修改数据加载

**旧方式**：
```typescript
const loadData = async () => {
  const data = await fetch(`/api/members/${id}`).then(r => r.json());
  setAvatarUrl(data.data.avatar || ''); // 使用URL
};
```

**新方式**：
```typescript
const loadData = async () => {
  const data = await fetch(`/api/members/${id}`).then(r => r.json());
  // 优先使用fileKey，降级使用URL（向后兼容）
  setAvatarKey(data.data.avatarKey || null);
};
```

## 完整示例

### 示例1：用户编辑页面

```typescript
'use client';

import { useState, useEffect } from 'react';
import { AvatarUpload } from '@/components/avatar-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, ArrowLeft } from 'lucide-react';

export default function MemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [memberId, setMemberId] = useState('');
  const [name, setName] = useState('');
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 加载数据
  useEffect(() => {
    params.then(p => {
      setMemberId(p.id);
      loadMemberData(p.id);
    });
  }, [params]);

  const loadMemberData = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/admin/api/members/${id}`);
      const data = await response.json();

      if (data.success) {
        const member = data.data;
        setName(member.name || '');
        // 优先使用fileKey，降级使用URL
        setAvatarKey(member.avatarKey || null);
        setPhone(member.phone || '');
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUploadSuccess = (fileKey: string) => {
    setAvatarKey(fileKey);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/admin/api/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatarKey, // ✅ 保存fileKey
          phone,
        }),
      });

      if (response.ok) {
        alert('保存成功');
      }
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">编辑用户</h1>

      {/* 头像上传 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">头像</label>
        <AvatarUpload
          currentAvatarKey={avatarKey}
          userId={memberId}
          name={name}
          onUploadSuccess={handleAvatarUploadSuccess}
          size="xl"
        />
      </div>

      {/* 姓名 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">姓名</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入姓名"
        />
      </div>

      {/* 电话 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">电话</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="请输入电话"
        />
      </div>

      {/* 保存按钮 */}
      <Button onClick={handleSave}>
        <Save className="w-4 h-4 mr-2" />
        保存
      </Button>
    </div>
  );
}
```

### 示例2：活动创建页面

```typescript
'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

export default function ActivityCreatePage() {
  const [title, setTitle] = useState('');
  const [coverImageKey, setCoverImageKey] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const handleCoverImageUploadSuccess = (fileKey: string) => {
    setCoverImageKey(fileKey);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/admin/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          coverImageKey, // ✅ 保存fileKey
          description,
        }),
      });

      if (response.ok) {
        alert('创建成功');
      }
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">创建活动</h1>

      {/* 封面图片上传 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">封面图片</label>
        <ImageUpload
          currentImageKey={coverImageKey}
          userId=""
          onUploadSuccess={handleCoverImageUploadSuccess}
          aspectRatio="16:9"
          className="max-w-2xl"
        />
      </div>

      {/* 标题 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">活动标题</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入活动标题"
        />
      </div>

      {/* 描述 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">活动描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="请输入活动描述"
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      {/* 保存按钮 */}
      <Button onClick={handleSave}>
        <Save className="w-4 h-4 mr-2" />
        创建活动
      </Button>
    </div>
  );
}
```

## API字段映射

### 用户相关

| 前端字段（camelCase） | 数据库字段（snake_case） | 说明 |
|----------------------|------------------------|------|
| `avatar` | `avatar` | 旧字段（URL） |
| `avatarKey` | `avatar_key` | 新字段（fileKey） |

### 活动相关

| 前端字段（camelCase） | 数据库字段（snake_case） | 说明 |
|----------------------|------------------------|------|
| `image` / `imageUrl` | `cover_image` | 旧字段（URL） |
| `coverImageKey` | `cover_image_key` | 新字段（fileKey） |

### 访问相关

| 前端字段（camelCase） | 数据库字段（snake_case） | 说明 |
|----------------------|------------------------|------|
| `image` / `imageUrl` | `cover_image` | 旧字段（URL） |
| `coverImageKey` | `cover_image_key` | 新字段（fileKey） |

## 向后兼容策略

如果数据中同时存在URL和fileKey，优先使用fileKey：

```typescript
const loadData = async () => {
  const data = await fetch(...).then(r => r.json());
  const member = data.data;

  // ✅ 优先使用fileKey
  if (member.avatarKey) {
    setAvatarKey(member.avatarKey);
  }
  // ⚠️ 降级使用URL（临时方案）
  else if (member.avatar) {
    setAvatarKey(member.avatar); // 暂时使用URL
  }
};
```

## 组件API文档

### AvatarUpload

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `currentAvatarKey` | `string \| null` | 是 | 当前头像的fileKey |
| `userId` | `string` | 否 | 用户ID（用于上传） |
| `name` | `string` | 否 | 用户名称（用于显示初始值） |
| `onUploadSuccess` | `(fileKey: string) => void` | 否 | 上传成功回调 |
| `readonly` | `boolean` | 否 | 是否只读（默认false） |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | 否 | 尺寸（默认lg） |

### ImageUpload

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `currentImageKey` | `string \| null` | 是 | 当前图片的fileKey |
| `userId` | `string` | 否 | 用户ID（用于上传） |
| `onUploadSuccess` | `(fileKey: string) => void` | 否 | 上传成功回调 |
| `onRemove` | `() => void` | 否 | 删除回调 |
| `readonly` | `boolean` | 否 | 是否只读（默认false） |
| `aspectRatio` | `'square' \| '16:9' \| '4:3'` | 否 | 宽高比（默认16:9） |
| `maxSize` | `number` | 否 | 最大文件大小（MB，默认5） |

## 测试清单

迁移完成后，请测试以下功能：

- [ ] 上传头像能成功保存
- [ ] 上传的图片能正常显示
- [ ] 编辑页面能正确加载已有图片
- [ ] 图片过期后能自动刷新（等待1小时后测试）
- [ ] 删除图片功能正常
- [ ] 更换图片功能正常
- [ ] 旧数据（只有URL）能正常显示

## 常见问题

### Q1: 上传成功但图片不显示？

A: 检查是否保存了 `avatarKey` 而不是 `avatar`，确保前端使用 `AvatarUpload` 组件。

### Q2: 旧数据无法显示？

A: 实现降级策略，优先使用 `avatarKey`，如果没有则使用 `avatar`（旧URL）。

### Q3: 图片上传后立即消失？

A: 检查保存时是否正确传递了 `avatarKey` 字段，确认API支持该字段。

### Q4: 需要修改后端API吗？

A: 后端API已经更新，支持 `avatarKey` 和 `coverImageKey` 字段。确保使用最新的API代码。

## 迁移完成后的清理

迁移完成并测试通过后，可以考虑：

1. 保留旧字段一段时间（1-2个月）
2. 通知用户重新上传图片
3. 编写脚本将旧URL提取为fileKey（可选）
4. 最终删除旧字段（需要评估风险）

## 参考文档

- [架构重构完整文档](./storage-architecture-refactor.md)
- [前端快速开始指南](./storage-frontend-quickstart.md)
- [组件源码](../components/avatar-upload.tsx)
- [组件源码](../components/image-upload.tsx)
