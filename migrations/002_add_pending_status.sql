-- 添加 pending 状态到 registration_status 枚举
-- 这个迁移需要手动执行，因为 PostgreSQL 不支持直接修改枚举类型
-- 执行步骤：
-- 1. 创建新的枚举类型
CREATE TYPE registration_status_new AS ENUM ('pending', 'registered', 'approved', 'rejected', 'cancelled');

-- 2. 更新表以使用新的枚举类型
ALTER TABLE activity_registrations ALTER COLUMN status TYPE registration_status_new USING status::text::registration_status_new;

-- 3. 删除旧的枚举类型
DROP TYPE registration_status;

-- 4. 重命名新的枚举类型
ALTER TYPE registration_status_new RENAME TO registration_status;
