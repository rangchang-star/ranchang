# 前端快速开始指南 - 新文件存储架构

本指南帮助前端开发者快速适配新的文件存储架构。

## 核心变化

### 旧方式（已废弃）

```typescript
// ❌ 旧方式：直接使用URL
const response = await uploadFile(file);
const imageUrl = response.data.url; // 这个URL会过期！
await saveToDatabase({ imageUrl }); // 存储会过期的URL - 错误！
```

### 新方式（推荐）

```typescript
// ✅ 新方式：存储fileKey
const response = await uploadFile(file);
const fileKey = response.data.fileKey; // 永久有效
await saveToDatabase({ fileKey }); // 存储fileKey - 正确！

// ✅ 显示时动态生成URL
const imageUrl = await getImageUrl(fileKey); // 自动缓存，自动刷新
```

## 快速集成

### 步骤1：导入工具函数

```typescript
import { getImageUrl } from '@/lib/utils/storage-url';
```

### 步骤2：上传文件

```typescript
async function handleUpload(file: File, userId: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const response = await fetch('/api/upload/avatar', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    const fileKey = result.data.fileKey; // ✅ 保存fileKey
    await updateUser({ avatarKey: fileKey });
  }
}
```

### 步骤3：显示图片

#### 方式1：在React组件中使用（推荐）

```typescript
import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/utils/storage-url';

function UserAvatar({ user }: { user: { avatarKey?: string; name: string } }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user.avatarKey) {
      // 自动获取URL，自动缓存
      getImageUrl(user.avatarKey).then(setAvatarUrl);
    }
  }, [user.avatarKey]);

  if (!avatarUrl) {
    return <div className="avatar-placeholder">{user.name[0]}</div>;
  }

  return <img src={avatarUrl} alt={user.name} className="avatar" />;
}
```

#### 方式2：使用自定义Hook（推荐）

```typescript
import { useImageUrl } from '@/hooks/use-image-url'; // 需要创建

function UserAvatar({ user }: { user: { avatarKey?: string } }) {
  const avatarUrl = useImageUrl(user.avatarKey);

  if (!avatarUrl) return null;

  return <img src={avatarUrl} alt="avatar" />;
}
```

**创建自定义Hook**：

```typescript
// src/hooks/use-image-url.ts
import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/utils/storage-url';

export function useImageUrl(fileKey?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileKey) {
      setUrl(null);
      return;
    }

    setLoading(true);
    getImageUrl(fileKey)
      .then(setUrl)
      .finally(() => setLoading(false));
  }, [fileKey]);

  return { url, loading };
}
```

#### 方式3：预加载列表图片

```typescript
import { preloadImageUrls } from '@/lib/utils/storage-url';

// 在页面加载时预加载所有图片
useEffect(() => {
  const fileKeys = users.map(u => u.avatarKey).filter(Boolean);
  preloadImageUrls(fileKeys); // 并行加载，提升体验
}, [users]);
```

## 常见场景示例

### 场景1：用户资料页

```typescript
function UserProfile({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user.avatarKey) {
      getImageUrl(user.avatarKey).then(setAvatarUrl);
    }
  }, [user.avatarKey]);

  const handleAvatarChange = async (file: File) => {
    // 上传文件
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      // 更新数据库
      await updateUser({ id: user.id, avatarKey: result.data.fileKey });

      // 立即刷新头像
      const newUrl = await getImageUrl(result.data.fileKey);
      setAvatarUrl(newUrl);
    }
  };

  return (
    <div>
      <img src={avatarUrl || '/default-avatar.png'} alt={user.name} />
      <input type="file" onChange={(e) => handleAvatarChange(e.target.files![0])} />
    </div>
  );
}
```

### 场景2：活动列表页

```typescript
function ActivityList({ activities }: { activities: Activity[] }) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    // 预加载所有封面图
    const fileKeys = activities.map(a => a.coverImageKey).filter(Boolean);
    preloadImageUrls(fileKeys).then(() => {
      // 获取所有URL
      const urls: Record<string, string> = {};
      activities.forEach(activity => {
        if (activity.coverImageKey) {
          getImageUrl(activity.coverImageKey).then(url => {
            urls[activity.id] = url || '';
            setImageUrls(prev => ({ ...prev, ...urls }));
          });
        }
      });
    });
  }, [activities]);

  return (
    <div>
      {activities.map(activity => (
        <div key={activity.id}>
          <img
            src={imageUrls[activity.id] || '/default-image.png'}
            alt={activity.title}
          />
          <h3>{activity.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

### 场景3：活动创建页

```typescript
function CreateActivity() {
  const [coverImageKey, setCoverImageKey] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      const fileKey = result.data.fileKey;
      setCoverImageKey(fileKey);

      // 立即显示预览
      const url = await getImageUrl(fileKey);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    // 提交时使用fileKey
    await createActivity({
      title: '新活动',
      coverImageKey, // ✅ 使用fileKey
    });
  };

  return (
    <form>
      <input
        type="file"
        onChange={(e) => handleImageUpload(e.target.files![0])}
      />
      {previewUrl && (
        <img src={previewUrl} alt="预览" />
      )}
      <button type="button" onClick={handleSubmit}>创建活动</button>
    </form>
  );
}
```

## 向后兼容处理

如果同时有URL和fileKey，优先使用fileKey：

```typescript
function getImageUrlSafe(item: { avatar?: string; avatarKey?: string }) {
  if (item.avatarKey) {
    // 新架构：使用fileKey
    return getImageUrl(item.avatarKey);
  } else if (item.avatar) {
    // 旧数据：降级使用URL
    return Promise.resolve(item.avatar);
  } else {
    return Promise.resolve(null);
  }
}
```

## 错误处理

```typescript
const imageUrl = await getImageUrl(fileKey);

if (!imageUrl) {
  // 处理错误
  console.error('无法获取图片URL');
  return <img src="/fallback.png" alt="fallback" />;
}
```

## 性能优化建议

### 1. 预加载

```typescript
// 在页面加载时预加载所有图片
useEffect(() => {
  const fileKeys = items.map(i => i.imageKey).filter(Boolean);
  preloadImageUrls(fileKeys);
}, [items]);
```

### 2. 防抖

```typescript
import { debounce } from 'lodash';

const debouncedLoad = debounce(async (fileKey: string) => {
  const url = await getImageUrl(fileKey);
  setImageUrl(url);
}, 300);

debouncedLoad(fileKey);
```

### 3. 懒加载

```typescript
import { lazy } from 'react';

const LazyImage = lazy(() => import('./LazyImage'));

<LazyImage fileKey={item.imageKey} />
```

## 测试

### 单元测试

```typescript
import { getImageUrl, clearUrlCache } from '@/lib/utils/storage-url';

describe('getImageUrl', () => {
  beforeEach(() => {
    clearUrlCache(); // 清除缓存
  });

  it('should return URL for valid fileKey', async () => {
    const url = await getImageUrl('avatars/test.jpg');
    expect(url).not.toBeNull();
  });

  it('should use cached URL', async () => {
    const url1 = await getImageUrl('avatars/test.jpg');
    const url2 = await getImageUrl('avatars/test.jpg');
    expect(url1).toBe(url2); // 应该是同一个URL（来自缓存）
  });
});
```

### 手动测试

```typescript
// 在控制台测试
import { getImageUrl, preloadImageUrls, clearUrlCache } from '@/lib/utils/storage-url';

// 测试1：获取单个URL
const url = await getImageUrl('avatars/test.jpg');
console.log('URL:', url);

// 测试2：预加载
await preloadImageUrls(['avatars/1.jpg', 'avatars/2.jpg']);

// 测试3：清除缓存
clearUrlCache('avatars/test.jpg');
```

## 迁移检查清单

- [ ] 上传功能：保存 `fileKey` 而不是 `url`
- [ ] 显示功能：使用 `getImageUrl()` 而不是直接使用URL
- [ ] 错误处理：处理 `getImageUrl()` 返回 `null` 的情况
- [ ] 缓存优化：预加载列表图片
- [ ] 向后兼容：处理旧数据（只有URL没有fileKey的情况）
- [ ] 测试：验证图片能正常显示

## 常见问题

### Q: 为什么要用 `getImageUrl()` 而不是直接用URL？

A: 临时签名URL会过期，使用 `getImageUrl()` 可以自动处理URL过期，确保图片永远能显示。

### Q: 会影响性能吗？

A: 不会。工具函数内置了缓存机制，首次请求后会缓存URL，后续直接使用缓存，不会重复请求。

### Q: 如何强制刷新URL？

A: 使用 `forceRefresh` 参数：

```typescript
const url = await getImageUrl(fileKey, true); // 强制刷新
```

### Q: 旧数据怎么办？

A: 使用降级策略：

```typescript
const imageUrl = item.avatarKey
  ? await getImageUrl(item.avatarKey)
  : item.avatar; // 降级使用旧URL
```

## 参考文档

- [架构重构完整文档](./storage-architecture-refactor.md)
- [对象存储集成文档](../object-storage-setup.md)

## 获取帮助

如有问题，请查看：
1. [架构重构完整文档](./storage-architecture-refactor.md)
2. 控制台错误日志
3. Network面板查看API请求

---

**提示**：新架构虽然需要调整代码，但能彻底解决URL过期问题，值得投入！
