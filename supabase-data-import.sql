-- ==========================================
-- 导入用户数据
-- ==========================================

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (1, '13023699913', '818989', '张明', '张明', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face', 38, '智联科技有限公司', '技术总监', '互联网', '15年互联网行业经验，擅长AI技术应用，曾主导多个千万级项目', '寻找AI项目合作伙伴，共同开发行业解决方案', 'personLookingForJob'::tag_stamp, '["技术","管理","AI"]'::jsonb, '["AI技术","带兵打仗","看懂账本"]'::jsonb, '["技术资源","项目经验"]'::jsonb, true, 'admin'::user_role, 'active'::user_status, '2024-01-15T00:00:00Z', '2024-02-20T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (2, '139****0002', '123456', '李华', '李华', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 42, '华夏企业管理咨询有限公司', '合伙人', '咨询', '20年企业管理咨询经验，服务过50+传统企业数字化转型项目', '寻找传统企业转型项目，提供全方位咨询服务', 'jobLookingForPerson'::tag_stamp, '["咨询","管理","转型"]'::jsonb, '["定方向","搞定人","稳军心"]'::jsonb, '["客户资源","行业经验"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-01T00:00:00Z', '2024-03-01T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (3, '137****0003', '123456', '王芳', '王芳', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', 35, '创新教育科技有限公司', '创始人', '教育', '教育行业连续创业者，专注在线教育和职业教育领域8年', '寻找投资人和运营人才，共同打造教育科技平台', 'personLookingForJob'::tag_stamp, '["创业","教育","运营"]'::jsonb, '["从0到1","搞定人","看懂账本"]'::jsonb, '["产品","团队","教育资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-03-01T00:00:00Z', '2024-03-10T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (4, '136****0004', '123456', '刘伟', '刘伟', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', 45, '天风投资管理有限公司', '投资经理', '投资', '专注于早期科技项目投资，管理资金规模超5亿元', '寻找优质科技创业项目，投资A轮及之前阶段', 'jobLookingForPerson'::tag_stamp, '["投资","科技","创业"]'::jsonb, '["会说人话","看懂账本","找人识人"]'::jsonb, '["资金","行业资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-03-05T00:00:00Z', '2024-03-12T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (5, '135****0005', '123456', '陈静', '陈静', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face', 39, '创意视觉设计工作室', '设计总监', '设计', '15年品牌设计经验，服务过100+知名品牌', '寻找品牌设计项目合作，提供全案设计服务', 'personLookingForJob'::tag_stamp, '["设计","品牌","创意"]'::jsonb, '["从0到1","稳军心","搞定自己"]'::jsonb, '["设计资源","创意团队"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-03-08T00:00:00Z', '2024-03-15T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (6, '138****0006', '123456', '赵强', '赵强', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=face', 48, '智能制造解决方案有限公司', 'CEO', '制造业', '20年制造业经验，专注智能制造和工业4.0转型', '寻找制造业数字化项目，推广智能工厂解决方案', 'jobLookingForPerson'::tag_stamp, '["制造","智能制造","数字化"]'::jsonb, '["带兵打仗","摆平烂摊","稳军心"]'::jsonb, '["技术资源","客户资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-10T00:00:00Z', '2024-03-20T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (7, '158****0007', '123456', '孙丽', '孙丽', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face', 37, '营销策划有限公司', '营销总监', '营销', '12年营销策划经验，擅长品牌营销和数字营销', '寻找品牌营销合作项目，提供全案营销服务', 'personLookingForJob'::tag_stamp, '["营销","品牌","数字营销"]'::jsonb, '["卖出去","搞定人","会说人话"]'::jsonb, '["营销资源","媒体资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-15T00:00:00Z', '2024-03-08T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (8, '159****0008', '123456', '周涛', '周涛', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face', 41, '供应链管理有限公司', '供应链总监', '物流', '18年供应链管理经验，服务过500强企业', '寻找供应链优化项目，提供专业咨询服务', 'jobLookingForPerson'::tag_stamp, '["供应链","物流","管理"]'::jsonb, '["摆平烂摊","看懂账本","搞定自己"]'::jsonb, '["供应商资源","物流资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-20T00:00:00Z', '2024-03-05T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (9, '186****0009', '123456', '吴敏', '吴敏', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', 36, '人力资源服务有限公司', 'HRD', '人力资源', '10年人力资源管理经验，擅长人才梯队建设', '寻找企业人才项目，提供人力资源解决方案', 'personLookingForJob'::tag_stamp, '["HR","人才","管理"]'::jsonb, '["搞定人","找人识人","看懂账本"]'::jsonb, '["人才资源","培训资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-10T00:00:00Z', '2024-03-12T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (10, '188****0010', '123456', '郑勇', '郑勇', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', 44, '法律事务所', '合伙人', '法律', '20年法律实务经验，专注企业法律服务', '寻找企业法律咨询项目，提供专业法律服务', 'jobLookingForPerson'::tag_stamp, '["法律","企业服务","合规"]'::jsonb, '["搞定人","会说人话","搞定自己"]'::jsonb, '["法律资源","司法资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-05T00:00:00Z', '2024-03-18T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (11, '189****0011', '123456', '冯燕', '冯燕', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', 33, '新媒体运营有限公司', '运营总监', '新媒体', '8年新媒体运营经验，运营过多个百万粉丝账号', '寻找新媒体运营项目，提供内容创作和运营服务', 'personLookingForJob'::tag_stamp, '["新媒体","运营","内容"]'::jsonb, '["从0到1","找人识人","带兵打仗"]'::jsonb, '["媒体资源","创作团队"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-20T00:00:00Z', '2024-03-10T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (12, '177****0012', '123456', '陈明', '陈明', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 40, '金融科技有限公司', '产品总监', '金融', '15年金融科技产品经验，曾任职于多家大型金融机构', '寻找金融科技项目合作伙伴，共同开发产品', 'personLookingForJob'::tag_stamp, '["金融","科技","产品"]'::jsonb, '["AI技术","看懂账本","定方向"]'::jsonb, '["技术资源","金融资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-25T00:00:00Z', '2024-03-14T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (13, '176****0013', '123456', '杨琳', '杨琳', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', 38, '电子商务有限公司', '运营总监', '电商', '12年电商运营经验，操盘过多个千万级GMV项目', '寻找电商运营项目，提供专业运营服务', 'jobLookingForPerson'::tag_stamp, '["电商","运营","GMV"]'::jsonb, '["卖出去","看懂账本","攒局组队"]'::jsonb, '["渠道资源","供应商资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-05T00:00:00Z', '2024-03-16T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (14, '175****0014', '123456', '黄磊', '黄磊', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', 46, '房地产开发有限公司', '项目总监', '房地产', '20年房地产项目管理经验，管理过多个大型商业项目', '寻找房地产项目合作，提供专业管理服务', 'jobLookingForPerson'::tag_stamp, '["房地产","项目管理","商业"]'::jsonb, '["带兵打仗","攒局组队","定方向"]'::jsonb, '["土地资源","商户资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-15T00:00:00Z', '2024-03-22T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (15, '174****0015', '123456', '朱丹', '朱丹', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', 34, '医疗科技有限公司', '研发总监', '医疗', '10年医疗器械研发经验，拥有多项专利', '寻找医疗器械研发项目合作伙伴', 'personLookingForJob'::tag_stamp, '["医疗","研发","专利"]'::jsonb, '["AI技术","搞定自己","带兵打仗"]'::jsonb, '["技术资源","医疗资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-03-01T00:00:00Z', '2024-03-17T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (16, '173****0016', '123456', '林峰', '林峰', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face', 42, '能源科技有限公司', '技术总监', '新能源', '18年新能源技术经验，专注储能技术', '寻找新能源项目合作伙伴，推广储能解决方案', 'personLookingForJob'::tag_stamp, '["新能源","储能","技术"]'::jsonb, '["AI技术","定方向","稳军心"]'::jsonb, '["技术资源","产业链资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-20T00:00:00Z', '2024-03-19T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (17, '172****0017', '123456', '马丽', '马丽', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', 37, '文化旅游发展有限公司', '运营总监', '文旅', '12年文旅行业经验，运营过多个知名景区项目', '寻找文旅项目合作，提供策划和运营服务', 'personLookingForJob'::tag_stamp, '["文旅","运营","策划"]'::jsonb, '["从0到1","攒局组队","摆平烂摊"]'::jsonb, '["景区资源","媒体资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-10T00:00:00Z', '2024-03-11T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (18, '171****0018', '123456', '高远', '高远', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', 43, '农业科技发展有限公司', 'CEO', '农业', '20年农业科技经验，专注智慧农业和农产品电商', '寻找农业项目合作伙伴，推广智慧农业解决方案', 'jobLookingForPerson'::tag_stamp, '["农业","智慧农业","电商"]'::jsonb, '["定方向","攒局组队","搞定人"]'::jsonb, '["农业资源","渠道资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-18T00:00:00Z', '2024-03-21T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (19, '170****0019', '123456', '宋佳', '宋佳', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face', 35, '影视文化传媒有限公司', '内容总监', '影视', '10年影视内容创作经验，制作过多部爆款短视频', '寻找影视内容合作项目，提供内容创作服务', 'personLookingForJob'::tag_stamp, '["影视","内容","短视频"]'::jsonb, '["从0到1","会说人话","卖出去"]'::jsonb, '["创作团队","媒体资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-25T00:00:00Z', '2024-03-13T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (20, '169****0020', '123456', '郭涛', '郭涛', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 47, '汽车服务有限公司', '技术总监', '汽车', '25年汽车行业经验，专注新能源汽车和智能驾驶', '寻找汽车科技项目合作伙伴，推广智能驾驶技术', 'personLookingForJob'::tag_stamp, '["汽车","新能源","智能驾驶"]'::jsonb, '["AI技术","卖出去","搞定自己"]'::jsonb, '["技术资源","产业链资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-12T00:00:00Z', '2024-03-24T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (21, '168****0021', '123456', '韩雪', '韩雪', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face', 32, '化妆品科技有限公司', '产品总监', '美妆', '8年美妆产品研发经验，开发过多个爆款产品', '寻找美妆产品合作项目，提供产品研发服务', 'personLookingForJob'::tag_stamp, '["美妆","研发","产品"]'::jsonb, '["搞定自己","卖出去","稳军心"]'::jsonb, '["技术资源","渠道资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-03-05T00:00:00Z', '2024-03-18T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (22, '167****0022', '123456', '唐伟', '唐伟', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=face', 45, '建筑集团有限公司', '项目总监', '建筑', '20年建筑工程管理经验，管理过多个大型基建项目', '寻找建筑工程项目合作，提供专业管理服务', 'jobLookingForPerson'::tag_stamp, '["建筑","工程","管理"]'::jsonb, '["带兵打仗","搞定人","摆平烂摊"]'::jsonb, '["施工资源","供应商资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-22T00:00:00Z', '2024-03-20T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (23, '166****0023', '123456', '姜敏', '姜敏', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', 36, '环保科技有限公司', '技术总监', '环保', '12年环保技术经验，专注废水和废气处理技术', '寻找环保项目合作伙伴，推广环保技术解决方案', 'personLookingForJob'::tag_stamp, '["环保","技术","工程"]'::jsonb, '["摆平烂摊","AI技术","搞定人"]'::jsonb, '["技术资源","工程资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-18T00:00:00Z', '2024-03-15T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (24, '165****0024', '123456', '潘峰', '潘峰', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face', 41, '矿业投资有限公司', '投资总监', '矿业', '18年矿业投资经验，专注矿产资源开发', '寻找矿业项目投资机会', 'jobLookingForPerson'::tag_stamp, '["矿业","投资","开发"]'::jsonb, '["定方向","看懂账本","搞定自己"]'::jsonb, '["资金","矿产资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-28T00:00:00Z', '2024-03-23T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (25, '164****0025', '123456', '范丽', '范丽', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', 34, '酒店管理有限公司', '运营总监', '酒店', '10年酒店运营管理经验，运营过多家五星级酒店', '寻找酒店运营项目，提供专业管理服务', 'personLookingForJob'::tag_stamp, '["酒店","运营","管理"]'::jsonb, '["稳军心","搞定人","攒局组队"]'::jsonb, '["酒店资源","客户资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-12T00:00:00Z', '2024-03-14T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (26, '163****0026', '123456', '方强', '方强', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 49, '电力工程有限公司', '技术总监', '电力', '25年电力工程经验，参与过多个国家级电力项目', '寻找电力工程项目合作，提供专业技术服务', 'jobLookingForPerson'::tag_stamp, '["电力","工程","技术"]'::jsonb, '["定方向","带兵打仗","搞定人"]'::jsonb, '["技术资源","工程资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-08T00:00:00Z', '2024-03-25T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (27, '162****0027', '123456', '袁琳', '袁琳', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 38, '食品科技有限公司', '研发总监', '食品', '15年食品研发经验，开发过多个爆款食品产品', '寻找食品研发项目合作伙伴', 'personLookingForJob'::tag_stamp, '["食品","研发","产品"]'::jsonb, '["从0到1","看懂账本","卖出去"]'::jsonb, '["技术资源","供应链资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-08T00:00:00Z', '2024-03-16T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (28, '161****0028', '123456', '彭浩', '彭浩', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', 44, '航空航天科技有限公司', '技术总监', '航空航天', '22年航空航天技术经验，专注航空发动机技术', '寻找航空航天项目合作伙伴', 'personLookingForJob'::tag_stamp, '["航空航天","技术","研发"]'::jsonb, '["AI技术","摆平烂摊","卖出去"]'::jsonb, '["技术资源","产业链资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-16T00:00:00Z', '2024-03-26T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (29, '160****0029', '123456', '卢燕', '卢燕', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', 37, '物流科技有限公司', '运营总监', '物流', '12年物流运营经验，运营过多个大型物流园区', '寻找物流项目合作，提供运营管理服务', 'personLookingForJob'::tag_stamp, '["物流","运营","园区"]'::jsonb, '["摆平烂摊","搞定人","会说人话"]'::jsonb, '["物流资源","园区资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-02-14T00:00:00Z', '2024-03-17T00:00:00Z');

INSERT INTO users (id, phone, password, nickname, name, avatar, age, company, position, industry, bio, need, tag_stamp, tags, hardcore_tags, resource_tags, is_trusted, role, status, created_at, updated_at)
VALUES (30, '159****0030', '123456', '戴明', '戴明', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face', 46, '化工科技有限公司', '技术总监', '化工', '23年化工技术经验，专注新材料研发', '寻找化工项目合作伙伴，推广新材料技术', 'personLookingForJob'::tag_stamp, '["化工","新材料","研发"]'::jsonb, '["AI技术","从0到1","攒局组队"]'::jsonb, '["技术资源","产业链资源"]'::jsonb, true, 'user'::user_role, 'active'::user_status, '2024-01-14T00:00:00Z', '2024-03-27T00:00:00Z');

-- ==========================================
-- 导入活动数据
-- ==========================================

INSERT INTO activities (id, title, subtitle, category, description, image, address, start_date, end_date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (1, 'CEO转型期私董会 - 第一期', '深度探讨35+职场人的转型路径', '私董会'::activity_category, '针对35+职场转型人群，通过私董会形式深度探讨职业转型路径。围绕"如何利用过往经验"、"如何降低试错成本"、"如何构建第二职业曲线"等话题展开讨论。本次活动邀请了多位成功转型的企业家和职业导师，为参与者提供实战经验分享。', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop', '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅', '2026-04-02T14:00:00Z', '2026-04-02T17:00:00Z', 12, 0, 'active'::activity_status, 6, '2024-02-01T00:00:00Z', '2024-02-15T18:00:00Z');

INSERT INTO activities (id, title, subtitle, category, description, image, address, start_date, end_date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (2, '创业者私董会 - 第二期', '创业者资源对接与经验交流', '私董会'::activity_category, '为创业者提供一个私密、专业的交流平台。通过私董会形式，创业者可以分享创业过程中的困惑和挑战，获得同行的建议和支持。本次活动重点讨论"如何获得第一笔投资"、"如何组建核心团队"、"如何快速验证商业模式"等核心议题。', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop', '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅', '2026-04-09T14:00:00Z', '2026-04-09T17:00:00Z', 15, 0, 'active'::activity_status, 3, '2024-02-10T00:00:00Z', '2024-02-28T18:00:00Z');

INSERT INTO activities (id, title, subtitle, category, description, image, address, start_date, end_date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (3, '企业家私董会 - 第三期', '企业转型与数字化升级', '私董会'::activity_category, '针对传统企业家的转型需求，通过私董会形式探讨数字化转型的路径和方法。邀请数字化转型成功的企业家分享实战经验，包括"如何制定数字化战略"、"如何组织变革"、"如何培养数字化人才"等关键议题。', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop', '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅', '2026-04-16T14:00:00Z', '2026-04-16T17:00:00Z', 15, 0, 'active'::activity_status, 2, '2024-03-01T00:00:00Z', '2024-03-10T00:00:00Z');

INSERT INTO activities (id, title, subtitle, category, description, image, address, start_date, end_date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (4, 'AI实战应用沙龙 2026期', '从理论到实践，全面掌握AI工具', '沙龙'::activity_category, '邀请AI领域的实战专家，分享AI工具在各行业的应用案例。涵盖ChatGPT、Midjourney、Stable Diffusion等主流AI工具的使用技巧。通过实际操作演示，帮助参与者快速掌握AI工具的应用方法，提升工作效率和创新能力。', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop', '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅', '2026-04-15T14:00:00Z', '2026-04-15T17:00:00Z', 30, 0, 'active'::activity_status, 1, '2024-03-05T00:00:00Z', '2024-03-15T00:00:00Z');

INSERT INTO activities (id, title, subtitle, category, description, image, address, start_date, end_date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (5, 'OpenClaw 低代码开发培训', '零基础快速开发企业级应用', '培训'::activity_category, '针对非技术人员设计，通过OpenClaw低代码平台，让零基础用户也能快速开发企业级应用。课程内容包括：平台基础操作、数据建模、业务逻辑设计、UI设计、API集成等。通过实战项目演练，学员将完成一个完整的企业应用开发。', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop', '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅', '2026-04-20T09:00:00Z', '2026-04-21T17:00:00Z', 20, 0, 'active'::activity_status, 5, '2024-03-08T00:00:00Z', '2024-03-18T00:00:00Z');

-- ==========================================
-- 导入探访数据
-- ==========================================

INSERT INTO visits (id, title, description, image, location, date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (1, 'AI技术在传统企业的应用实践', '', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop', '北京市朝阳区望京科技园', '2024年3月15日', 0, 0, 'active'::visit_status, 1, 'NOW()', 'NOW()');

INSERT INTO visits (id, title, description, image, location, date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (2, '传统企业数字化转型的成功实践', '', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop', '上海市浦东新区陆家嘴', '2024年3月10日', 0, 0, 'active'::visit_status, 1, 'NOW()', 'NOW()');

INSERT INTO visits (id, title, description, image, location, date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (3, '教育科技企业的创新实践', '', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop', '深圳市南山区科技园', '2024年3月5日', 0, 0, 'active'::visit_status, 1, 'NOW()', 'NOW()');

INSERT INTO visits (id, title, description, image, location, date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (4, '早期科技项目的投资策略', '', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop', '杭州市西湖区', '2024年2月28日', 0, 0, 'active'::visit_status, 1, 'NOW()', 'NOW()');

INSERT INTO visits (id, title, description, image, location, date, capacity, tea_fee, status, created_by, created_at, updated_at)
VALUES (5, '品牌设计的创新思维', '', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop', '广州市天河区', '2024年2月20日', 0, 0, 'active'::visit_status, 1, 'NOW()', 'NOW()');

-- ==========================================
-- 导入文档数据（需要创建 documents 表）
-- ==========================================

-- 文档: 私董会参与指南
-- 说明: 私董会的流程、规则和注意事项
-- 类型: , 大小: 
-- URL: 

-- 文档: AI技术应用白皮书
-- 说明: 2025年AI技术在各行业的应用趋势分析
-- 类型: , 大小: 
-- URL: 

-- 文档: 企业数字化转型案例集
-- 说明: 10个成功的企业数字化转型案例分析
-- 类型: , 大小: 
-- URL: 

-- 文档: 探访项目申请表
-- 说明: 申请成为探访项目的标准表格
-- 类型: , 大小: 
-- URL: 

