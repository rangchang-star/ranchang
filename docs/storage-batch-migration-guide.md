# 批量处理方案 - 高效适配文件存储架构

## 为什么可以批量处理？

1. ✅ **已有标准流程**：5步适配流程
2. ✅ **已有现成组件**：`AvatarUpload`、`AvatarDisplay`、`ImageUpload`、`ImageDisplay`
3. ✅ **已有Hook**：`useImageUrl`、`useImageUrls`、`useFileUpload`
4. ✅ **已有样板**：用户编辑页、活动创建页
5. ✅ **模式一致**：所有页面都是相同的模式

## 批量处理策略

### 方案1：批量搜索替换（推荐）

**时间预估**：2-3 小时

**核心思路**：
1. 使用 grep 找到所有需要修改的文件
2. 批量替换状态定义（`avatarUrl` → `avatarKey`）
3. 批量替换导入语句
4. 批量替换组件使用
5. 批量替换保存逻辑

**优势**：
- ✅ 快速、高效
- ✅ 统一修改，避免遗漏
- ✅ 可以版本控制，出错可以回滚

### 方案2：脚本自动化（最优）

**时间预估**：1-2 小时

**核心思路**：
编写自动化脚本，批量处理所有文件

**优势**：
- ✅ 最快
- ✅ 可重复
- ✅ 准确性高

## 批量处理步骤

### Step 1: 搜索所有需要修改的文件（5分钟）

```bash
# 搜索所有包含 avatar 字段的文件
grep -r "avatar" src/app --include="*.tsx" -l

# 搜索所有包含 cover_image 字段的文件
grep -r "coverImage\|cover_image" src/app --include="*.tsx" -l

# 搜索所有包含 image 字段的文件
grep -r "imageUrl\|image_url" src/app --include="*.tsx" -l
```

### Step 2: 批量替换状态定义（15分钟）

**模式1：头像相关**
```bash
# 替换状态定义
sed -i 's/const \[avatarUrl, setAvatarUrl\] = useState([^;]*)/const [avatarKey, setAvatarKey] = useState<string | null>(null)/g' src/app/**/*.tsx

# 替换使用
sed -i 's/avatarUrl/avatarKey/g' src/app/**/*.tsx
```

**模式2：封面图片相关**
```bash
# 替换状态定义
sed -i 's/const \[imageUrl, setImageUrl\] = useState([^;]*)/const [coverImageKey, setCoverImageKey] = useState<string | null>(null)/g' src/app/**/*.tsx

# 替换使用
sed -i 's/imageUrl/coverImageKey/g' src/app/**/*.tsx
```

### Step 3: 批量添加导入语句（10分钟）

```bash
# 添加头像相关导入
sed -i '/^import.*from.*React/a import { AvatarUpload, AvatarDisplay } from '"'"'@/components/avatar-upload'"'"';' src/app/**/*.tsx

# 添加图片相关导入
sed -i '/^import.*from.*React/a import { ImageUpload, ImageDisplay } from '"'"'@/components/image-upload'"'"';' src/app/**/*.tsx

# 添加Hook导入
sed -i '/^import.*from.*React/a import { useImageUrl } from '"'"'@/hooks/use-image'"'"';' src/app/**/*.tsx
```

### Step 4: 批量替换组件使用（20分钟）

**替换头像显示**：
```bash
# 替换 <AvatarImage src={xxx}> 为 <AvatarDisplay avatarKey={xxx}>
sed -i 's/<AvatarImage src={\([^}]*\)} alt={\([^}]*\)}/<AvatarDisplay avatarKey={\1} name={\2}/g' src/app/**/*.tsx
```

**替换图片显示**：
```bash
# 替换 <img src={xxx}> 为 <ImageDisplay imageKey={xxx}>
sed -i 's/<img src={\([^}]*\)}/<ImageDisplay imageKey={\1}/g' src/app/**/*.tsx
```

### Step 5: 批量替换保存逻辑（15分钟）

```bash
# 替换保存时的字段名
sed -i 's/avatar: avatarUrl/avatarKey/g' src/app/**/*.tsx
sed -i 's/coverImage: imageUrl/coverImageKey/g' src/app/**/*.tsx
sed -i 's/image: imageUrl/imageKey/g' src/app/**/*.tsx
```

### Step 6: 批量验证（10分钟）

```bash
# 检查TypeScript错误
npx tsc --noEmit

# 检查是否有遗漏
grep -r "avatarUrl\|imageUrl" src/app --include="*.tsx"
```

## 关键修改点总结

### 1. 头像相关

**需要替换的模式**：
```typescript
// 旧 → 新
const [avatarUrl, setAvatarUrl] = useState('') → const [avatarKey, setAvatarKey] = useState<string | null>(null)
setAvatarUrl(member.avatar) → setAvatarKey(member.avatarKey || member.avatar || null)
avatar: avatarUrl → avatarKey: avatarKey
```

### 2. 封面图片相关

**需要替换的模式**：
```typescript
// 旧 → 新
const [imageUrl, setImageUrl] = useState('') → const [coverImageKey, setCoverImageKey] = useState<string | null>(null)
setImageUrl(data.cover_image) → setCoverImageKey(data.cover_image_key || data.cover_image || null)
coverImage: imageUrl → coverImageKey: coverImageKey
```

### 3. 组件替换

**头像显示**：
```tsx
// 旧
<Avatar>
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback>{user.name[0]}</AvatarFallback>
</Avatar>

// 新
<AvatarDisplay avatarKey={user.avatarKey} name={user.name} size="md" />
```

**图片显示**：
```tsx
// 旧
<img src={activity.cover_image} alt={activity.title} />

// 新
<ImageDisplay imageKey={activity.cover_image_key} alt={activity.title} aspectRatio="16:9" />
```

## 时间估算（重新评估）

### 方案1：批量搜索替换（推荐）
- Step 1: 搜索文件 - 5分钟
- Step 2: 批量替换状态 - 15分钟
- Step 3: 批量添加导入 - 10分钟
- Step 4: 批量替换组件 - 20分钟
- Step 5: 批量替换保存逻辑 - 15分钟
- Step 6: 验证 - 10分钟
- **总计：约75分钟（1.25小时）**

### 方案2：脚本自动化（最优）
- 编写脚本 - 30分钟
- 执行脚本 - 10分钟
- 验证 - 10分钟
- **总计：约50分钟（<1小时）**

### 方案3：手动批量处理
- 批量处理20个文件 - 每个5分钟 = 100分钟
- 验证和调整 - 20分钟
- **总计：约120分钟（2小时）**

## 推荐方案

**推荐：方案2（脚本自动化）**

理由：
1. ✅ 最快（<1小时）
2. ✅ 准确性高
3. ✅ 可重复
4. ✅ 易于调试

## 下一步

**立即执行批量处理**，按照上述步骤快速完成所有页面的适配。

---

**修正后的预估时间**：1-2小时（而不是80小时）
