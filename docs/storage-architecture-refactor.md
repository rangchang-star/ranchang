# 文件存储架构重构说明

## 问题背景

### 原架构缺陷

之前的文件上传流程存在严重的架构设计缺陷：

```
上传 → 生成临时签名URL → 存URL到数据库 → 页面显示 → 几小时后URL过期 → 图片消失
```

**核心问题**：
- 临时签名URL被永久存储到数据库
- URL有有效期（即使设置为1年，仍会过期）
- 过期后图片无法访问，数据丢失

### 影响范围

此问题影响所有使用文件上传的功能：
- 用户头像 (`users.avatar`)
- 活动封面 (`activities.cover_image`)
- 访问封面 (`visits.cover_image`)
- 数字资产文件 (`digital_assets.file_url`, `digital_assets.cover_image`)
- 宣告音频 (`declarations.audio_url`)

## 新架构设计

### 核心思想

**数据库存储 fileKey（永久有效），前端动态生成访问URL**

```
上传 → 存到对象存储 → 返回fileKey → 存fileKey到数据库 → 前端显示时动态生成URL
```

### 架构对比

| 层面 | 原架构 | 新架构 |
|------|--------|--------|
| 数据存储 | 临时签名URL（会过期） | fileKey（永久有效） |
| URL生成 | 上传时生成一次 | 前端显示时动态生成 |
| URL有效期 | 固定（如1年） | 灵活（如1小时） |
| 缓存策略 | 无缓存 | 前端缓存+自动刷新 |
| 访问方式 | 直接使用存储的URL | 调用API获取URL |

### 新架构流程

#### 1. 文件上传流程

```
前端 → 选择文件
     → POST /api/upload/avatar (返回 fileKey)
     → 存储fileKey到数据库
     → 完成
```

**上传API返回示例**：
```json
{
  "success": true,
  "data": {
    "fileKey": "avatars/xxx-uuid.jpg",
    "message": "文件上传成功，fileKey已返回，请使用 /api/storage/get-url 获取访问URL"
  }
}
```

#### 2. 图片显示流程

```
前端 → 从数据库获取fileKey
     → 调用 getImageUrl(fileKey) 工具函数
     → 检查缓存（有效且未过期）
     → 如果缓存失效，调用 GET /api/storage/get-url?fileKey=xxx
     → 获取临时签名URL（有效期1小时）
     → 缓存URL
     → 显示图片
```

**URL生成API返回示例**：
```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "expiresAt": "2026-03-12T03:00:00.000Z",
    "fileKey": "avatars/xxx-uuid.jpg"
  }
}
```

### 数据库Schema变更

#### 新增字段

为所有存储文件URL的表添加对应的 `xxxKey` 字段：

| 表名 | 原字段 | 新增字段 | 说明 |
|------|--------|----------|------|
| `users` | `avatar` | `avatar_key` | 用户头像fileKey |
| `activities` | `cover_image` | `cover_image_key` | 活动封面fileKey |
| `visits` | `cover_image` | `cover_image_key` | 访问封面fileKey |
| `digital_assets` | `file_url` | `file_key` | 文件fileKey |
| `digital_assets` | `cover_image` | `cover_image_key` | 封面fileKey |
| `declarations` | `audio_url` | `audio_key` | 音频fileKey |

#### 向后兼容策略

- 保留原有的 `xxx` 字段（如 `avatar`），用于存储URL（向后兼容）
- 新增的 `xxxKey` 字段（如 `avatar_key`）用于存储fileKey（新架构）
- 优先使用 `xxxKey` 字段，如果没有则降级使用 `xxx` 字段

### API变更

#### 1. 上传API变更

**文件**：`src/app/api/upload/avatar/route.ts`

**变更内容**：
- ❌ 移除：生成临时签名URL
- ✅ 新增：只返回fileKey
- ✅ 新增：返回提示信息

**返回值对比**：

**旧版**：
```json
{
  "success": true,
  "data": {
    "fileKey": "avatars/xxx.jpg",
    "url": "https://..." // 临时URL，会过期
  }
}
```

**新版**：
```json
{
  "success": true,
  "data": {
    "fileKey": "avatars/xxx.jpg",
    "message": "文件上传成功，fileKey已返回，请使用 /api/storage/get-url 获取访问URL"
  }
}
```

#### 2. 新增URL生成API

**端点**：`GET /api/storage/get-url?fileKey=xxx`

**功能**：根据fileKey生成临时签名URL

**参数**：
- `fileKey`（必填）：文件在存储中的key

**返回**：
```json
{
  "success": true,
  "data": {
    "url": "https://...", // 临时签名URL，有效期1小时
    "expiresAt": "2026-03-12T03:00:00.000Z",
    "fileKey": "avatars/xxx.jpg"
  }
}
```

#### 3. 管理后台API变更

**文件**：`src/app/admin/api/members/route.ts`

**变更内容**：
- ✅ 新增：支持 `avatarKey` 字段映射

**文件**：`src/app/admin/api/activities/route.ts`

**变更内容**：
- ✅ 新增：支持 `coverImageKey` 字段映射

### 前端工具函数

#### 核心函数

**文件**：`src/lib/utils/storage-url.ts`

**主要函数**：

```typescript
// 根据fileKey获取图片URL（带缓存）
getImageUrl(fileKey: string, forceRefresh?: boolean): Promise<string | null>

// 预加载图片URL
preloadImageUrls(fileKeys: string[]): Promise<void>

// 清除URL缓存
clearUrlCache(fileKey?: string): void

// 检查URL是否即将过期
isUrlExpiringSoon(fileKey: string): boolean
```

#### 使用示例

```typescript
import { getImageUrl } from '@/lib/utils/storage-url';

// 在React组件中使用
function Avatar({ user }: { user: User }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user.avatarKey) {
      getImageUrl(user.avatarKey).then(setAvatarUrl);
    }
  }, [user.avatarKey]);

  return avatarUrl ? <img src={avatarUrl} alt={user.name} /> : null;
}
```

### 缓存策略

#### 缓存机制

1. **内存缓存**：使用Map存储fileKey到URL的映射
2. **缓存时间**：与签名URL有效期一致（默认1小时）
3. **自动刷新**：
   - 检查URL是否即将过期（5分钟内）
   - 如果即将过期，自动获取新的URL
   - 用户无感知

#### 缓存示例

```typescript
// 第一次请求
const url1 = await getImageUrl('avatars/abc.jpg'); // 调用API

// 1小时内再次请求（使用缓存）
const url2 = await getImageUrl('avatars/abc.jpg'); // 直接返回缓存

// 1小时后再次请求（自动刷新）
const url3 = await getImageUrl('avatars/abc.jpg'); // 调用API获取新URL
```

### 数据迁移策略

#### 现有数据处理

对于已存储URL的现有数据：

1. **保留URL字段**：向后兼容
2. **优先使用fileKey**：如果有fileKey，使用新架构
3. **降级策略**：如果没有fileKey，降级使用URL字段

#### 迁移建议

**推荐方案**：用户重新上传

```sql
-- 查找需要迁移的数据
SELECT id, name, avatar, avatar_key FROM users
WHERE avatar IS NOT NULL AND avatar_key IS NULL;
```

**手动迁移**（可选）：

```typescript
// 从URL提取fileKey的示例
function extractFileKeyFromUrl(url: string): string | null {
  // 根据URL格式提取fileKey
  // 这取决于您的S3存储配置
  const parts = url.split('/');
  return parts[parts.length - 1] || null;
}
```

## 部署步骤

### 1. 执行数据库迁移

```bash
# 迁移SQL文件
src/storage/database/migrations/add_file_keys.sql
```

### 2. 更新代码

- ✅ 数据库Schema已更新（`src/storage/database/shared/schema.ts`）
- ✅ 上传API已修改（`src/app/api/upload/avatar/route.ts`）
- ✅ URL生成API已创建（`src/app/api/storage/get-url/route.ts`）
- ✅ 管理后台API已修改（`src/app/admin/api/members/route.ts`等）
- ✅ 前端工具函数已创建（`src/lib/utils/storage-url.ts`）

### 3. 更新前端代码

**需要修改的页面**：
- 管理后台用户编辑页面
- 管理后台活动创建/编辑页面
- 前台用户资料页面
- 前台活动详情页面

**修改要点**：
1. 上传时保存 `fileKey` 到 `xxxKey` 字段
2. 显示时使用 `getImageUrl()` 工具函数获取URL
3. 移除直接使用URL的代码

### 4. 验证功能

```bash
# 1. 上传头像
curl -X POST http://localhost:5000/api/upload/avatar \
  -F "file=@avatar.jpg" \
  -F "userId=xxx"

# 2. 获取URL
curl "http://localhost:5000/api/storage/get-url?fileKey=avatars/xxx.jpg"

# 3. 验证图片能正常显示
```

## 优势总结

### 相比原架构的优势

1. **永久存储**：fileKey永久有效，不会过期
2. **灵活控制**：URL有效期可根据需要调整
3. **自动刷新**：前端自动处理URL过期，用户无感知
4. **性能优化**：缓存机制减少API请求次数
5. **向后兼容**：保留旧字段，平滑过渡
6. **安全性**：临时URL降低安全风险

### 性能对比

| 场景 | 原架构 | 新架构 |
|------|--------|--------|
| 首次显示图片 | 1次API请求 | 1次API请求 |
| 1小时内再次显示 | 0次API请求（直接使用存储的URL） | 0次API请求（使用缓存） |
| 1小时后再次显示 | 图片无法显示 | 1次API请求（自动刷新） |
| 100次显示同一图片 | 0次API请求 | 1次API请求（其余使用缓存） |

## 注意事项

### 1. 环境变量

确保 `.env.local` 中配置了对象存储信息：

```env
COZE_BUCKET_ENDPOINT_URL=your_endpoint_url
COZE_BUCKET_NAME=your_bucket_name
```

### 2. URL有效期

当前设置为1小时，可根据需求调整：

```typescript
// src/app/api/storage/get-url/route.ts
expireTime: 3600 // 1小时，可改为 86400（1天）或其他值
```

### 3. 缓存清理

如果需要清理缓存，调用：

```typescript
import { clearUrlCache } from '@/lib/utils/storage-url';

// 清除所有缓存
clearUrlCache();

// 清除指定缓存
clearUrlCache('avatars/xxx.jpg');
```

### 4. 错误处理

工具函数已内置错误处理，返回 `null` 表示失败：

```typescript
const url = await getImageUrl(fileKey);
if (!url) {
  // 处理失败情况
  console.error('无法获取图片URL');
}
```

## 常见问题

### Q1: 为什么不直接存储公共URL？

A: 公共URL需要Bucket配置为公共读，存在安全风险。使用临时签名URL更安全。

### Q2: 如果fileKey丢失怎么办？

A: fileKey是唯一标识，丢失后无法恢复文件。建议数据库中同时存储fileKey和URL（向后兼容）。

### Q3: 缓存会占用太多内存吗？

A: 不会。缓存只存储URL字符串和过期时间，占用空间很小。单个URL约100字节，1000个URL约100KB。

### Q4: 如何查看当前缓存状态？

A: 可以在控制台打印：

```typescript
console.log(urlCache);
```

### Q5: 旧数据怎么办？

A:
1. 保留旧URL字段，继续使用（临时方案）
2. 要求用户重新上传（推荐）
3. 编写脚本从URL提取fileKey（可选）

## 总结

新的文件存储架构彻底解决了URL过期导致图片消失的问题：

✅ **永久存储**：fileKey不会过期
✅ **自动刷新**：URL过期自动重新生成
✅ **性能优化**：智能缓存减少请求
✅ **向后兼容**：平滑过渡，不影响现有数据
✅ **易于维护**：清晰的架构，便于扩展

这是一个长期、稳定、可扩展的解决方案。
