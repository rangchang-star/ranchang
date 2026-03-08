-- ==========================================
-- 补充缺失的数据库表
-- ==========================================

-- 创建每日宣告表
CREATE TABLE IF NOT EXISTS daily_declarations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  date TIMESTAMP NOT NULL,
  image TEXT,
  audio TEXT,
  summary TEXT,
  text TEXT,
  icon_type VARCHAR(50),
  rank INTEGER,
  profile TEXT,
  duration VARCHAR(50),
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建系统设置表
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_daily_declarations_date ON daily_declarations(date);
CREATE INDEX IF NOT EXISTS idx_daily_declarations_is_featured ON daily_declarations(is_featured);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- 插入默认系统设置
INSERT INTO settings (key, value)
VALUES (
  'default_settings',
  '{
    "navigation": {
      "discovery": {"label": "发现光亮", "icon": "flame"},
      "ignition": {"label": "点亮事业", "icon": "trending-up"},
      "profile": {"label": "个人中心", "icon": "user"}
    },
    "pageTitles": {
      "discovery": "发现光亮",
      "activities": "活动列表",
      "visit": "探访点亮",
      "assets": "能力资产",
      "declarations": "高燃宣告",
      "connection": "能力连接",
      "consultation": "专家咨询",
      "training": "培训赋能",
      "subscription": "AI加油圈",
      "notifications": "消息通知",
      "settings": "系统设置"
    },
    "discovery": {
      "slogan": "发现光亮，点亮事业",
      "logo": "/logo-ranchang.png",
      "music": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "backgroundImage": "/discovery-bg.jpg"
    },
    "ignition": {
      "visitSlogan": "每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....",
      "visitMedia": {"type": null, "url": ""},
      "aiCircleSlogan": "AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产",
      "aiCircleMedia": {"type": null, "url": ""}
    },
    "profile": {
      "businessCognition": {"displayStyle": "radar"},
      "aiCognition": {"displayStyle": "radar"},
      "careerMission": {"displayStyle": "cards"},
      "entrepreneurialPsychology": {"displayStyle": "progress"}
    },
    "contactInfo": {
      "message": "此功能暂时关闭，需要对接人与资源联系"燃场app"工作人员。",
      "contact": "v:13023699913"
    }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
