-- 添加文件Key字段，用于永久存储文件标识
-- 这些字段将存储S3的fileKey，而不是临时URL
-- 这样可以避免URL过期后图片无法访问的问题

-- users表：添加头像fileKey
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_key TEXT;

-- activities表：添加封面图fileKey
ALTER TABLE activities ADD COLUMN IF NOT EXISTS cover_image_key TEXT;

-- visits表：添加封面图fileKey
ALTER TABLE visits ADD COLUMN IF NOT EXISTS cover_image_key TEXT;

-- digital_assets表：添加文件fileKey和封面fileKey
ALTER TABLE digital_assets ADD COLUMN IF NOT EXISTS file_key TEXT;
ALTER TABLE digital_assets ADD COLUMN IF NOT EXISTS cover_image_key TEXT;

-- declarations表：添加音频fileKey
ALTER TABLE declarations ADD COLUMN IF NOT EXISTS audio_key TEXT;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS users_avatar_key_idx ON users(avatar_key);
CREATE INDEX IF NOT EXISTS activities_cover_image_key_idx ON activities(cover_image_key);
CREATE INDEX IF NOT EXISTS visits_cover_image_key_idx ON visits(cover_image_key);
CREATE INDEX IF NOT EXISTS digital_assets_file_key_idx ON digital_assets(file_key);
CREATE INDEX IF NOT EXISTS digital_assets_cover_image_key_idx ON digital_assets(cover_image_key);
CREATE INDEX IF NOT EXISTS declarations_audio_key_idx ON declarations(audio_key);
