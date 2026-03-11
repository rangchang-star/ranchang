-- ============================================================
-- 清除所有旧数据并重新生成测试数据
-- ============================================================

-- 第一步：清除所有数据
TRUNCATE TABLE activity_registrations CASCADE;
TRUNCATE TABLE visit_records CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE declarations CASCADE;
TRUNCATE TABLE activities CASCADE;
TRUNCATE TABLE visits CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE settings CASCADE;

-- 第二步：插入 Settings 配置
INSERT INTO settings (key, value, updated_at) VALUES
('discovery_nav_icon', '{"icon": "💡", "label": "发现光亮"}', NOW()),
('ignition_nav_icon', '{"icon": "🔥", "label": "点亮事业"}', NOW()),
('profile_nav_icon', '{"icon": "👤", "label": "个人中心"}', NOW()),
('discovery_title', '发现光亮', NOW()),
('activities_title', '活动', NOW()),
('visit_title', '探访', NOW()),
('assets_title', '资产', NOW()),
('declarations_title', '高燃宣告', NOW()),
('connection_title', '连接', NOW()),
('consultation_title', '咨询', NOW()),
('discovery_slogan', '能力连接 · 困境解决', NOW()),
('discovery_logo', '/logo.png', NOW()),
('discovery_music', '/bg-music.mp3', NOW()),
('discovery_bg_image', '/bg-image.jpg', NOW());

-- 第三步：插入用户数据（10个用户）
INSERT INTO users (id, name, age, avatar, email, company, position, gender, company_scale, connection_type, industry, need, ability_tags, resource_tags, hardcore_tags, level, status, is_featured, join_date, created_at) VALUES
('user-001', '张伟', 42, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei', 'zhangwei@example.com', '阿里云', '技术总监', '男', '1000-5000人', '创业', '互联网', '寻找技术合伙人', '["云计算", "AI", "架构设计"]', '["阿里云资源", "投资人网络"]', '["硬核工程师", "连续创业者"]', 'L5', 'active', true, '2024-01-15', NOW()),

('user-002', '李娜', 38, 'https://api.dicebear.com/7.x/avataaars/svg?seed=lina', 'lina@example.com', '字节跳动', '产品总监', '女', '10000+人', '求职', '互联网', '寻找产品经理岗位', '["产品规划", "用户体验", "数据分析"]', '["大厂内推", "猎头资源"]', '["产品思维", "增长黑客"]', 'L4', 'active', true, '2024-02-01', NOW()),

('user-003', '王强', 45, 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang', 'wangqiang@example.com', '腾讯', '技术专家', '男', '10000+人', '创业', '金融科技', '寻求技术合伙人', '["区块链", "风控系统", "高并发"]', '["银行资源", "金融牌照"]', '["技术极客", "金融专家"]', 'L5', 'active', true, '2024-02-15', NOW()),

('user-004', '陈静', 36, 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjing', 'chenjing@example.com', '美团', '运营总监', '女', '10000+人', '创业', '本地生活', '寻找运营合伙人', '["用户增长", "社群运营", "数据驱动"]', '["商户资源", "渠道合作"]', '["增长黑客", "社群专家"]', 'L4', 'active', false, '2024-03-01', NOW()),

('user-005', '刘洋', 40, 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuyang', 'liuyang@example.com', '创业公司', '创始人', '男', '10-50人', '创业', '智能制造', '寻找投资', '["物联网", "工业4.0", "供应链"]', '["工厂资源", "客户资源"]', '["实业家", "技术控"]', 'L3', 'active', true, '2024-03-15', NOW()),

('user-006', '赵敏', 35, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaomin', 'zhaomin@example.com', '京东', '供应链总监', '女', '10000+人', '职业发展', '电商', '寻求供应链专家', '["供应链优化", "仓储管理", "物流配送"]', '["供应商资源", "物流网络"]', '["供应链专家", "效率提升"]', 'L4', 'active', false, '2024-04-01', NOW()),

('user-007', '孙浩', 39, 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunhao', 'sunhao@example.com', '百度', 'AI研究员', '男', '10000+人', '创业', '人工智能', '寻找AI应用场景', '["深度学习", "NLP", "计算机视觉"]', '["算法资源", "算力资源"]', '["AI专家", "科研达人"]', 'L4', 'active', true, '2024-04-15', NOW()),

('user-008', '周琳', 37, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoulin', 'zhoulin@example.com', '小红书', '市场总监', '女', '1000-5000人', '职业发展', '社交电商', '寻求市场合作', '["品牌营销", "内容运营", "用户洞察"]', '["KOL资源", "MCN合作"]', '["营销专家", "内容高手"]', 'L4', 'active', false, '2024-05-01', NOW()),

('user-009', '吴磊', 33, 'https://api.dicebear.com/7.x/avataaars/svg?seed=wulei', 'wulei@example.com', '自由职业', '独立开发者', '男', '1-10人', '创业', 'SaaS', '寻找产品市场', '["全栈开发", "产品设计", "技术架构"]', '["开源社区", "技术社群"]', '["独立开发者", "技术极客"]', 'L3', 'active', true, '2024-05-15', NOW()),

('user-010', '郑芳', 41, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengfang', 'zhengfang@example.com', '华为', '战略总监', '女', '10000+人', '职业发展', '通信技术', '寻求战略咨询', '["战略规划", "市场分析", "投资并购"]', '["行业资源", "政府关系"]', '["战略专家", "行业领袖"]', 'L5', 'active', true, '2024-06-01', NOW());

-- 第四步：插入活动数据（15个活动）
INSERT INTO activities (id, title, description, date, start_time, end_time, location, capacity, registered_count, type, cover_image, status, created_at) VALUES
('act-001', '35+创业者的第一堂AI课', '学习如何将AI技术应用到创业项目中，提升竞争力', '2024-12-20', '14:00', '17:00', '北京市朝阳区望京SOHO', 50, 35, '技术分享', '/images/activity-ai-class.jpg', 'active', NOW()),

('act-002', '跨境电商实战 workshop', '从0到1搭建跨境电商业务，实战经验分享', '2024-12-22', '10:00', '16:00', '上海市浦东新区陆家嘴', 30, 28, '实战培训', '/images/activity-ecommerce.jpg', 'active', NOW()),

('act-003', '传统企业数字化转型论坛', '探讨传统企业如何利用新技术实现数字化转型', '2024-12-25', '09:00', '18:00', '深圳市南山区科技园', 100, 85, '行业论坛', '/images/activity-digital-transformation.jpg', 'active', NOW()),

('act-004', '创业者投资人对接会', '优质项目路演，投资人现场点评和对接', '2024-12-28', '13:30', '18:00', '北京市海淀区中关村', 80, 72, '投融资', '/images/activity-investment.jpg', 'active', NOW()),

('act-005', '新能源行业趋势研讨会', '深入了解新能源行业发展趋势和投资机会', '2025-01-05', '14:00', '17:00', '上海市杨浦区创智天地', 40, 32, '行业研讨', '/images/activity-new-energy.jpg', 'active', NOW()),

('act-006', '35+职场突破营', '帮助35+职场人突破瓶颈，实现职业进阶', '2025-01-08', '09:00', '17:00', '广州市天河区珠江新城', 60, 55, '培训', '/images/activity-career-breakthrough.jpg', 'active', NOW()),

('act-007', '区块链技术应用沙龙', '探讨区块链在金融、供应链等领域的应用案例', '2025-01-10', '14:30', '17:30', '杭州市西湖区互联网小镇', 50, 40, '技术沙龙', '/images/activity-blockchain.jpg', 'active', NOW()),

('act-008', '智能制造产业交流会', '连接制造业上下游资源，推动产业升级', '2025-01-12', '09:30', '16:30', '苏州市工业园区', 80, 68, '产业交流', '/images/activity-smart-manufacturing.jpg', 'active', NOW()),

('act-009', 'AI在医疗健康领域的应用', '探索AI如何赋能医疗健康行业', '2025-01-15', '14:00', '17:00', '北京市朝阳区望京', 45, 38, '行业研讨', '/images/activity-ai-medical.jpg', 'active', NOW()),

('act-010', '创业失败案例复盘会', '从失败中学习，避免重复踩坑', '2025-01-18', '14:00', '18:00', '上海市徐汇区漕河泾', 60, 52, '经验分享', '/images/activity-failure-review.jpg', 'active', NOW()),

('act-011', '云计算架构设计 workshop', '学习企业级云架构设计最佳实践', '2025-01-20', '09:00', '17:00', '深圳市南山区科兴科学园', 40, 35, '技术培训', '/images/activity-cloud-architecture.jpg', 'active', NOW()),

('act-012', '供应链管理优化培训', '提升供应链管理效率，降低成本', '2025-01-22', '09:30', '16:30', '广州市黄埔区科学城', 50, 42, '专业培训', '/images/activity-supply-chain.jpg', 'active', NOW()),

('act-013', '女性创业者之夜', '女性创业者交流分享，互相赋能', '2025-01-25', '18:30', '21:30', '北京市朝阳区三里屯', 40, 36, '社交', '/images/activity-women-entrepreneurs.jpg', 'active', NOW()),

('act-014', '数字化转型实战案例分享', '真实案例拆解，学习成功经验', '2025-01-28', '14:00', '17:30', '杭州市滨江区网商路', 60, 48, '案例分享', '/images/activity-digital-cases.jpg', 'active', NOW()),

('act-015', 'SaaS产品增长黑客实战', '学习SaaS产品快速增长的策略和方法', '2025-02-01', '10:00', '17:00', '上海市闵行区紫竹高新区', 50, 45, '实战培训', '/images/activity-saas-growth.jpg', 'active', NOW());

-- 第五步：插入宣告数据（20个宣告）
INSERT INTO declarations (id, user_id, direction, text, summary, audio_url, views, date, is_featured, created_at) VALUES
('decl-001', 'user-001', '技术创业', '35岁才开始技术创业会不会太晚？我觉得永远不会太晚！10年大厂经验，现在正全力打造自己的云原生平台。年龄不是问题，热情和决心才是关键！', '35岁创业，云原生平台', NULL, 128, '2024-12-01', true, NOW()),

('decl-002', 'user-002', '职业转型', '从运营到产品，我用了3年时间。35岁转行不容易，但只要方向对了，努力就有回报。现在找到了自己真正热爱的事业！', '运营转产品经理', NULL, 95, '2024-12-02', true, NOW()),

('decl-003', 'user-003', '金融科技', '传统金融 + 区块链 = 无限可能。深耕风控系统15年，现在用技术重新定义金融。年龄让我更有经验，技术让我更有力量！', '金融科技区块链', NULL, 156, '2024-12-03', true, NOW()),

('decl-004', 'user-004', '创业坚持', '连续创业3次，前两次都失败了。但每次失败都是宝贵的财富。第三次，终于找到了正确的方向！35岁，不是终点，是新的起点！', '连续创业，坚持不放弃', NULL, 203, '2024-12-04', true, NOW()),

('decl-005', 'user-005', '实业创业', '做实业虽然辛苦，但很踏实。10年制造业经验，现在用物联网和工业4.0技术升级传统工厂。让中国制造更智能！', '实业家转型智能制造', NULL, 87, '2024-12-05', true, NOW()),

('decl-006', 'user-006', '职业突破', '从供应链专员到总监，我用了8年。35岁，职场黄金期，不要被年龄限制。经验就是资本，时间就是朋友！', '供应链职业发展', NULL, 112, '2024-12-06', false, NOW()),

('decl-007', 'user-007', 'AI创业', 'AI不是噱头，是生产力。从AI研究员到创业者，我用技术解决真实问题。35岁，最好的年龄，有技术，有经验，有视野！', 'AI应用创业', NULL, 178, '2024-12-07', true, NOW()),

('decl-008', 'user-008', '市场思维', '做市场10年，总结出一句：用户永远是对的。35岁才明白，做产品不如做用户。现在专注用户运营，效果翻倍！', '用户运营心得', NULL, 134, '2024-12-08', false, NOW()),

('decl-009', 'user-009', '独立开发', '放弃大厂offer，做独立开发者。虽然辛苦，但自由无价。35岁，终于找到了适合自己的生活方式！', '独立开发者之路', NULL, 245, '2024-12-09', true, NOW()),

('decl-010', 'user-010', '战略思维', '战略不是规划，是选择。35岁才真正理解这句话的重要性。做对了选择，事半功倍。做错了选择，南辕北辙。', '战略规划心得', NULL, 167, '2024-12-10', true, NOW()),

('decl-011', 'user-001', '技术成长', '技术不是年龄的敌人，是朋友。不断学习，保持好奇心，35岁依然是技术新人的心态。学无止境！', '技术学习心得', NULL, 76, '2024-12-11', false, NOW()),

('decl-012', 'user-003', '风险管理', '做金融风控15年，学会了如何控制风险。创业也是如此，风险控制比冒险更重要。35岁，更懂得稳健发展！', '风控思维应用', NULL, 98, '2024-12-12', false, NOW()),

('decl-013', 'user-005', '供应链优化', '制造业的供应链太复杂了。用数字化手段优化后，效率提升了40%。35岁才明白，技术可以改变传统行业！', '供应链数字化转型', NULL, 89, '2024-12-13', false, NOW()),

('decl-014', 'user-007', 'AI落地', 'AI技术很牛，但落地很难。关键是要找到真正的痛点和场景。35岁的经验，帮助我找到了这些场景！', 'AI应用落地', NULL, 145, '2024-12-14', false, NOW()),

('decl-015', 'user-009', '产品思维', '做独立开发最痛苦的不是技术，是产品。35岁才真正理解产品思维。技术只是工具，解决用户问题才是目的！', '产品思维转变', NULL, 187, '2024-12-15', false, NOW()),

('decl-016', 'user-002', '团队管理', '从个人贡献者到管理者，最大的挑战是心态转变。35岁才明白，管理的本质是赋能，不是控制！', '管理心得', NULL, 102, '2024-12-16', false, NOW()),

('decl-017', 'user-004', '运营增长', '用户增长不是靠运气，是靠科学方法。35岁才掌握这些方法，现在用数据驱动一切，效果更好！', '增长黑客实践', NULL, 156, '2024-12-17', false, NOW()),

('decl-018', 'user-006', '资源整合', '供应链的核心是资源整合。35岁积累的人脉和资源，现在都在发挥作用。年龄和经验，是最好的资源！', '资源整合能力', NULL, 93, '2024-12-18', false, NOW()),

('decl-019', 'user-008', '品牌建设', '做品牌不是打广告，是讲故事。35岁才明白，好的品牌有自己的故事和价值观。内容营销才是王道！', '品牌建设心得', NULL, 124, '2024-12-19', false, NOW()),

('decl-020', 'user-010', '战略选择', '35岁做战略选择，比20岁时更理性。不是追热点，而是看长期。长期主义，是我35岁才学到的最重要的一课！', '长期主义', NULL, 198, '2024-12-20', true, NOW());

-- 第六步：插入探访数据（8个探访）
INSERT INTO visits (id, company_id, company_name, industry, location, description, date, capacity, registered_count, cover_image, status, created_at) VALUES
('visit-001', 'user-001', '阿里云创新中心', '云计算', '北京市海淀区上地', '参观阿里云创新中心，了解云原生技术发展和创业孵化模式', '2024-12-15', 30, 28, '/images/visit-aliyun.jpg', 'active', NOW()),

('visit-002', 'user-003', '腾讯金融科技实验室', '金融科技', '深圳市南山区科技园', '深入了解腾讯在区块链、风控系统、AI金融等领域的最新技术和应用', '2024-12-18', 25, 22, '/images/visit-tencent.jpg', 'active', NOW()),

('visit-003', 'user-005', '智能制造示范工厂', '智能制造', '苏州市工业园区', '参观工业4.0示范工厂，学习物联网和数字化转型实践经验', '2024-12-22', 40, 35, '/images/visit-smart-factory.jpg', 'active', NOW()),

('visit-004', 'user-007', '百度AI实验室', '人工智能', '北京市海淀区上地', '参观百度AI实验室，了解大模型、自动驾驶等前沿技术', '2024-12-25', 35, 30, '/images/visit-baidu-ai.jpg', 'active', NOW()),

('visit-005', 'user-008', '小红书总部', '社交电商', '上海市黄浦区', '了解小红书的用户增长策略、内容运营模式和商业化路径', '2025-01-08', 40, 38, '/images/visit-xiaohongshu.jpg', 'active', NOW()),

('visit-006', 'user-010', '华为研发中心', '通信技术', '深圳市龙岗区', '参观华为研发中心，了解5G、云计算等前沿技术研发和产业化', '2025-01-12', 50, 45, '/images/visit-huawei.jpg', 'active', NOW()),

('visit-007', 'user-006', '京东亚洲一号', '电商物流', '上海市嘉定区', '参观京东亚洲一号智能物流园区，学习智慧供应链和仓储管理', '2025-01-18', 60, 52, '/images/visit-jd-logistics.jpg', 'active', NOW()),

('visit-008', 'user-009', 'SaaS创业加速器', 'SaaS', '杭州市西湖区', '参观SaaS创业加速器，了解SaaS产品从0到1的孵化过程', '2025-01-22', 35, 30, '/images/visit-saas-accelerator.jpg', 'active', NOW());

-- 第七步：插入活动报名数据（模拟报名）
INSERT INTO activity_registrations (activity_id, user_id, status, registered_at) VALUES
('act-001', 'user-002', 'registered', NOW()),
('act-001', 'user-004', 'registered', NOW()),
('act-001', 'user-006', 'registered', NOW()),
('act-002', 'user-005', 'registered', NOW()),
('act-002', 'user-009', 'registered', NOW()),
('act-003', 'user-001', 'registered', NOW()),
('act-003', 'user-003', 'registered', NOW()),
('act-003', 'user-007', 'registered', NOW()),
('act-003', 'user-010', 'registered', NOW()),
('act-004', 'user-005', 'registered', NOW()),
('act-004', 'user-009', 'registered', NOW()),
('act-005', 'user-007', 'registered', NOW()),
('act-006', 'user-002', 'registered', NOW()),
('act-006', 'user-008', 'registered', NOW()),
('act-007', 'user-001', 'registered', NOW()),
('act-007', 'user-003', 'registered', NOW()),
('act-008', 'user-005', 'registered', NOW()),
('act-008', 'user-010', 'registered', NOW()),
('act-009', 'user-007', 'registered', NOW()),
('act-010', 'user-004', 'registered', NOW());

-- 完成！
SELECT '数据重置完成！' as status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as activity_count FROM activities;
SELECT COUNT(*) as declaration_count FROM declarations;
SELECT COUNT(*) as visit_count FROM visits;
SELECT COUNT(*) as settings_count FROM settings;
