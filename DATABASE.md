# 燃场 App 数据库配置文档

## 📊 已创建的数据表

### 1. 用户表 (users)
存储用户基本信息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 用户ID（主键） |
| name | varchar(128) | 用户姓名 |
| age | integer | 年龄 |
| avatar | text | 头像URL |
| phone | varchar(20) | 手机号 |
| email | varchar(255) | 邮箱 |
| connection_type | varchar(50) | 连接类型：人找事/事找人/纯交流 |
| industry | varchar(100) | 行业标签 |
| need | text | 一句话需求 |
| hardcore_tags | jsonb | 硬核标签（JSON数组） |
| resource_tags | jsonb | 资源标签（JSON数组） |
| level | varchar(50) | 会员等级 |
| company | varchar(255) | 公司名称 |
| position | varchar(255) | 职位 |
| status | varchar(20) | 状态：active/inactive |
| is_featured | boolean | 是否推荐 |
| join_date | timestamp | 加入时间 |
| last_login | timestamp | 最后登录时间 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

**索引**：
- `users_phone_idx` - 手机号索引
- `users_email_idx` - 邮箱索引
- `users_connection_type_idx` - 连接类型索引
- `users_industry_idx` - 行业索引

---

### 2. 活动表 (activities)
存储活动信息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 活动ID（主键） |
| title | varchar(255) | 活动标题 |
| description | text | 活动描述 |
| date | timestamp | 活动日期 |
| start_time | varchar(10) | 开始时间（格式：09:00） |
| end_time | varchar(10) | 结束时间（格式：17:00） |
| location | varchar(255) | 活动地点 |
| capacity | integer | 容量限制 |
| registered_count | integer | 已报名人数 |
| type | varchar(50) | 活动类型 |
| cover_image | text | 封面图URL |
| status | varchar(20) | 状态：draft/published/cancelled |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

**索引**：
- `activities_date_idx` - 日期索引
- `activities_status_idx` - 状态索引
- `activities_type_idx` - 类型索引

---

### 3. 探访表 (visits)
存储企业探访信息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 探访ID（主键） |
| company_id | varchar(36) | 公司ID |
| company_name | varchar(255) | 公司名称 |
| industry | varchar(100) | 所属行业 |
| location | varchar(255) | 地点 |
| description | text | 描述 |
| date | timestamp | 探访日期 |
| capacity | integer | 容量限制 |
| registered_count | integer | 已报名人数 |
| cover_image | text | 封面图URL |
| status | varchar(20) | 状态：draft/published |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

---

### 4. 量表评估表 (assessments)
存储用户的量表评估结果

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 评估ID（主键） |
| user_id | varchar(36) | 用户ID |
| name | varchar(128) | 评估名称：创业心理评估、商业认知评估等 |
| score | integer | 总分 |
| level | varchar(20) | 等级：优秀/良好/中等/需提升 |
| summary | text | 一句话总结 |
| dimensions | jsonb | 维度得分（JSON数组） |
| test_date | timestamp | 测试日期 |
| created_at | timestamp | 创建时间 |

**dimensions 字段结构**：
```json
[
  {
    "name": "抗压韧性",
    "score": 90,
    "description": "面对挫折和压力时的恢复能力"
  }
]
```

---

### 5. 高燃宣告表 (declarations)
存储用户的高燃宣告

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 宣告ID（主键） |
| user_id | varchar(36) | 用户ID |
| direction | varchar(50) | 方向：信心/使命/自我/对手/环境 |
| text | text | 宣告内容 |
| summary | text | 宣告总结 |
| audio_url | text | 音频URL |
| views | integer | 查看次数 |
| date | timestamp | 宣告日期 |
| is_featured | boolean | 是否推荐 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

---

### 6. 咨询表 (consultations)
存储咨询记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 咨询ID（主键） |
| user_id | varchar(36) | 用户ID |
| topic_id | varchar(50) | 话题ID：ai-frontier, entrepreneur-psychology等 |
| topic_name | varchar(100) | 话题名称 |
| question | text | 用户问题 |
| answer | text | 咨询师回答 |
| status | varchar(20) | 状态：pending/completed |
| consultant_name | varchar(128) | 咨询师名称 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

---

### 7. 数字资产表 (digital_assets)
存储用户产出的数字资产

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 资产ID（主键） |
| user_id | varchar(36) | 用户ID |
| title | varchar(255) | 标题 |
| description | text | 描述 |
| type | varchar(50) | 类型：文档/表格/视频/音频等 |
| file_type | varchar(50) | 文件类型：pdf/xlsx/mp4等 |
| file_size | varchar(50) | 文件大小（格式：3.8MB） |
| file_url | text | 文件URL |
| cover_image | text | 封面图URL |
| likes | integer | 点赞数 |
| downloads | integer | 下载次数 |
| status | varchar(20) | 状态：draft/published |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

---

### 8. 通知表 (notifications)
存储通知消息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 通知ID（主键） |
| user_id | varchar(36) | 用户ID |
| type | varchar(20) | 类型：info/success/warning/error |
| title | varchar(255) | 标题 |
| message | text | 消息内容 |
| action_url | text | 点击后跳转的URL |
| is_read | boolean | 是否已读 |
| created_at | timestamp | 创建时间 |

---

### 9. 探访记录表 (visit_records)
记录用户参加的探访

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 记录ID（主键） |
| visit_id | varchar(36) | 探访ID |
| user_id | varchar(36) | 用户ID |
| status | varchar(20) | 状态：registered/completed/cancelled |
| registered_at | timestamp | 报名时间 |
| completed_at | timestamp | 完成时间 |

---

### 10. 活动报名表 (activity_registrations)
记录用户参加的活动

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 抰名ID（主键） |
| activity_id | varchar(36) | 活动ID |
| user_id | varchar(36) | 用户ID |
| status | varchar(20) | 状态：pending/approved/rejected/cancelled |
| registered_at | timestamp | 报名时间 |
| reviewed_at | timestamp | 审核时间 |
| note | text | 备注信息 |

---

### 11. 用户关注表 (user_follows)
记录用户关注关系

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) | 记录ID（主键） |
| follower_id | varchar(36) | 关注者ID |
| following_id | varchar(36) | 被关注者ID |
| created_at | timestamp | 创建时间 |

---

## 🚀 快速开始

### 1. 在组件中使用数据库

```typescript
import { getSupabaseClient } from '@/storage/database/supabase-client';

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const client = getSupabaseClient();
      
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('加载用户失败:', error.message);
      } else {
        setUser(data);
      }
    }
    
    loadUser();
  }, [userId]);

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>年龄: {user?.age}岁</p>
      <p>行业: {user?.industry}</p>
    </div>
  );
}
```

### 2. 查看完整示例

```bash
# 查看数据库使用示例
cat src/storage/database/examples.ts
```

### 3. 常用数据库操作

```typescript
const client = getSupabaseClient();

// 查询
const { data } = await client.from('users').select('*');

// 插入
const { data } = await client.from('users').insert({
  name: '张三',
  email: 'zhang@example.com'
}).select();

// 更新
const { data } = await client.from('users')
  .update({ name: '李四' })
  .eq('id', userId)
  .select();

// 删除
const { data } = await client.from('users')
  .delete()
  .eq('id', userId);

// 条件查询
const { data } = await client.from('activities')
  .select('*')
  .eq('status', 'published')
  .order('date', { ascending: false })
  .limit(10);
```

---

## ⚠️ 重要提示

1. **字段命名约定**：
   - TypeScript 代码中使用 camelCase（如 `connectionType`）
   - 数据库查询时使用 snake_case（如 `connection_type`）

2. **JSON 字段**：
   - `hardcore_tags`、`resource_tags`、`dimensions` 等字段存储为 JSON
   - 插入/更新时直接传入 JSON 对象或数组

3. **错误处理**：
   - 始终检查 `error` 对象
   - 示例：
     ```typescript
     const { data, error } = await client.from('users').select('*');
     if (error) {
       console.error('查询失败:', error.message);
       return;
     }
     ```

4. **类型安全**：
   - 使用 TypeScript 类型定义确保类型安全
   - 示例：
     ```typescript
     import type { User } from '@/storage/database/shared/schema';
     
     const user: User = await getUserById(userId);
     ```

---

## 📝 下一步建议

1. **配置环境变量**：在 `.env` 文件中设置 Supabase URL 和密钥
2. **测试连接**：尝试查询数据，确保数据库连接正常
3. **实现业务逻辑**：参考 `examples.ts` 文件，在组件中实现具体功能
4. **创建存储过程**：根据业务需求，在 Supabase 中创建自定义的 RPC 函数

---

## 🆘 常见问题

### Q: 如何查询关联表的数据？
A: 使用多次简单查询而非嵌套查询，更稳定可靠：
```typescript
const { data: users } = await client.from('users').select('*');
const { data: assessments } = await client.from('assessments').select('*');
// 在代码中关联数据
```

### Q: 如何处理分页？
A: 使用 `range` 方法：
```typescript
const { data } = await client.from('users')
  .select('*')
  .range(0, 9); // 前10条
```

### Q: 如何统计数量？
A: 使用 `count` 参数：
```typescript
const { count } = await client.from('users')
  .select('*', { count: 'exact', head: true });
```
