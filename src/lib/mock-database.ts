// 统一的模拟数据库
// 前后端共享此数据源，确保数据一致性

// ==================== 用户数据（30名中国用户）====================
export const mockUsers = [
  {
    id: 1,
    phone: '13023699913',
    password: '818989',
    nickname: '张明',
    name: '张明',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    age: 38,
    company: '智联科技有限公司',
    position: '技术总监',
    industry: '互联网',
    bio: '15年互联网行业经验，擅长AI技术应用，曾主导多个千万级项目',
    need: '寻找AI项目合作伙伴，共同开发行业解决方案',
    tagStamp: 'personLookingForJob',
    tags: ['技术', '管理', 'AI'],
    hardcoreTags: ['AI技术', '带兵打仗', '看懂账本'],
    resourceTags: ['技术资源', '项目经验'],
    isTrusted: true,
    isFeatured: true,
    role: 'admin',
    status: 'active',
    connectionCount: 12,
    activityCount: 3,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 2,
    phone: '139****0002',
    password: '',
    nickname: '李华',
    name: '李华',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    age: 42,
    company: '华夏企业管理咨询有限公司',
    position: '合伙人',
    industry: '咨询',
    bio: '20年企业管理咨询经验，服务过50+传统企业数字化转型项目',
    need: '寻找传统企业转型项目，提供全方位咨询服务',
    tagStamp: 'jobLookingForPerson',
    tags: ['咨询', '管理', '转型'],
    hardcoreTags: ['定方向', '搞定人', '稳军心'],
    resourceTags: ['客户资源', '行业经验'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 8,
    activityCount: 2,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 3,
    phone: '137****0003',
    password: '',
    nickname: '王芳',
    name: '王芳',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    age: 35,
    company: '创新教育科技有限公司',
    position: '创始人',
    industry: '教育',
    bio: '教育行业连续创业者，专注在线教育和职业教育领域8年',
    need: '寻找投资人和运营人才，共同打造教育科技平台',
    tagStamp: 'personLookingForJob',
    tags: ['创业', '教育', '运营'],
    hardcoreTags: ['从0到1', '搞定人', '看懂账本'],
    resourceTags: ['产品', '团队', '教育资源'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 5,
    activityCount: 4,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 4,
    phone: '136****0004',
    password: '',
    nickname: '刘伟',
    name: '刘伟',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    age: 45,
    company: '天风投资管理有限公司',
    position: '投资经理',
    industry: '投资',
    bio: '专注于早期科技项目投资，管理资金规模超5亿元',
    need: '寻找优质科技创业项目，投资A轮及之前阶段',
    tagStamp: 'jobLookingForPerson',
    tags: ['投资', '科技', '创业'],
    hardcoreTags: ['会说人话', '看懂账本', '找人识人'],
    resourceTags: ['资金', '行业资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 15,
    activityCount: 1,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
  },
  {
    id: 5,
    phone: '135****0005',
    password: '',
    nickname: '陈静',
    name: '陈静',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    age: 39,
    company: '创意视觉设计工作室',
    position: '设计总监',
    industry: '设计',
    bio: '15年品牌设计经验，服务过100+知名品牌',
    need: '寻找品牌设计项目合作，提供全案设计服务',
    tagStamp: 'personLookingForJob',
    tags: ['设计', '品牌', '创意'],
    hardcoreTags: ['从0到1', '稳军心', '搞定自己'],
    resourceTags: ['设计资源', '创意团队'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 6,
    activityCount: 2,
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 6,
    phone: '138****0006',
    password: '',
    nickname: '赵强',
    name: '赵强',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=face',
    age: 48,
    company: '智能制造解决方案有限公司',
    position: 'CEO',
    industry: '制造业',
    bio: '20年制造业经验，专注智能制造和工业4.0转型',
    need: '寻找制造业数字化项目，推广智能工厂解决方案',
    tagStamp: 'jobLookingForPerson',
    tags: ['制造', '智能制造', '数字化'],
    hardcoreTags: ['带兵打仗', '摆平烂摊', '稳军心'],
    resourceTags: ['技术资源', '客户资源'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 20,
    activityCount: 5,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 7,
    phone: '158****0007',
    password: '',
    nickname: '孙丽',
    name: '孙丽',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face',
    age: 37,
    company: '营销策划有限公司',
    position: '营销总监',
    industry: '营销',
    bio: '12年营销策划经验，擅长品牌营销和数字营销',
    need: '寻找品牌营销合作项目，提供全案营销服务',
    tagStamp: 'personLookingForJob',
    tags: ['营销', '品牌', '数字营销'],
    hardcoreTags: ['卖出去', '搞定人', '会说人话'],
    resourceTags: ['营销资源', '媒体资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 10,
    activityCount: 3,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-03-08T00:00:00Z',
  },
  {
    id: 8,
    phone: '159****0008',
    password: '',
    nickname: '周涛',
    name: '周涛',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    age: 41,
    company: '供应链管理有限公司',
    position: '供应链总监',
    industry: '物流',
    bio: '18年供应链管理经验，服务过500强企业',
    need: '寻找供应链优化项目，提供专业咨询服务',
    tagStamp: 'jobLookingForPerson',
    tags: ['供应链', '物流', '管理'],
    hardcoreTags: ['摆平烂摊', '看懂账本', '搞定自己'],
    resourceTags: ['供应商资源', '物流资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 9,
    activityCount: 2,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: 9,
    phone: '186****0009',
    password: '',
    nickname: '吴敏',
    name: '吴敏',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    age: 36,
    company: '人力资源服务有限公司',
    position: 'HRD',
    industry: '人力资源',
    bio: '10年人力资源管理经验，擅长人才梯队建设',
    need: '寻找企业人才项目，提供人力资源解决方案',
    tagStamp: 'personLookingForJob',
    tags: ['HR', '人才', '管理'],
    hardcoreTags: ['搞定人', '找人识人', '看懂账本'],
    resourceTags: ['人才资源', '培训资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 7,
    activityCount: 3,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
  },
  {
    id: 10,
    phone: '188****0010',
    password: '',
    nickname: '郑勇',
    name: '郑勇',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    age: 44,
    company: '法律事务所',
    position: '合伙人',
    industry: '法律',
    bio: '20年法律实务经验，专注企业法律服务',
    need: '寻找企业法律咨询项目，提供专业法律服务',
    tagStamp: 'jobLookingForPerson',
    tags: ['法律', '企业服务', '合规'],
    hardcoreTags: ['搞定人', '会说人话', '搞定自己'],
    resourceTags: ['法律资源', '司法资源'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 11,
    activityCount: 1,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-03-18T00:00:00Z',
  },
  {
    id: 11,
    phone: '189****0011',
    password: '',
    nickname: '冯燕',
    name: '冯燕',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
    age: 33,
    company: '新媒体运营有限公司',
    position: '运营总监',
    industry: '新媒体',
    bio: '8年新媒体运营经验，运营过多个百万粉丝账号',
    need: '寻找新媒体运营项目，提供内容创作和运营服务',
    tagStamp: 'personLookingForJob',
    tags: ['新媒体', '运营', '内容'],
    hardcoreTags: ['从0到1', '找人识人', '带兵打仗'],
    resourceTags: ['媒体资源', '创作团队'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 8,
    activityCount: 4,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 12,
    phone: '177****0012',
    password: '',
    nickname: '陈明',
    name: '陈明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    age: 40,
    company: '金融科技有限公司',
    position: '产品总监',
    industry: '金融',
    bio: '15年金融科技产品经验，曾任职于多家大型金融机构',
    need: '寻找金融科技项目合作伙伴，共同开发产品',
    tagStamp: 'personLookingForJob',
    tags: ['金融', '科技', '产品'],
    hardcoreTags: ['AI技术', '看懂账本', '定方向'],
    resourceTags: ['技术资源', '金融资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 6,
    activityCount: 2,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
  },
  {
    id: 13,
    phone: '176****0013',
    password: '',
    nickname: '杨琳',
    name: '杨琳',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    age: 38,
    company: '电子商务有限公司',
    position: '运营总监',
    industry: '电商',
    bio: '12年电商运营经验，操盘过多个千万级GMV项目',
    need: '寻找电商运营项目，提供专业运营服务',
    tagStamp: 'jobLookingForPerson',
    tags: ['电商', '运营', 'GMV'],
    hardcoreTags: ['卖出去', '看懂账本', '攒局组队'],
    resourceTags: ['渠道资源', '供应商资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 9,
    activityCount: 3,
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-03-16T00:00:00Z',
  },
  {
    id: 14,
    phone: '175****0014',
    password: '',
    nickname: '黄磊',
    name: '黄磊',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    age: 46,
    company: '房地产开发有限公司',
    position: '项目总监',
    industry: '房地产',
    bio: '20年房地产项目管理经验，管理过多个大型商业项目',
    need: '寻找房地产项目合作，提供专业管理服务',
    tagStamp: 'jobLookingForPerson',
    tags: ['房地产', '项目管理', '商业'],
    hardcoreTags: ['带兵打仗', '攒局组队', '定方向'],
    resourceTags: ['土地资源', '商户资源'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 12,
    activityCount: 2,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-22T00:00:00Z',
  },
  {
    id: 15,
    phone: '174****0015',
    password: '',
    nickname: '朱丹',
    name: '朱丹',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    age: 34,
    company: '医疗科技有限公司',
    position: '研发总监',
    industry: '医疗',
    bio: '10年医疗器械研发经验，拥有多项专利',
    need: '寻找医疗器械研发项目合作伙伴',
    tagStamp: 'personLookingForJob',
    tags: ['医疗', '研发', '专利'],
    hardcoreTags: ['AI技术', '搞定自己', '带兵打仗'],
    resourceTags: ['技术资源', '医疗资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 5,
    activityCount: 1,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-17T00:00:00Z',
  },
  {
    id: 16,
    phone: '173****0016',
    password: '',
    nickname: '林峰',
    name: '林峰',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    age: 42,
    company: '能源科技有限公司',
    position: '技术总监',
    industry: '新能源',
    bio: '18年新能源技术经验，专注储能技术',
    need: '寻找新能源项目合作伙伴，推广储能解决方案',
    tagStamp: 'personLookingForJob',
    tags: ['新能源', '储能', '技术'],
    hardcoreTags: ['AI技术', '定方向', '稳军心'],
    resourceTags: ['技术资源', '产业链资源'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 8,
    activityCount: 3,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 17,
    phone: '172****0017',
    password: '',
    nickname: '马丽',
    name: '马丽',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    age: 37,
    company: '文化旅游发展有限公司',
    position: '运营总监',
    industry: '文旅',
    bio: '12年文旅行业经验，运营过多个知名景区项目',
    need: '寻找文旅项目合作，提供策划和运营服务',
    tagStamp: 'personLookingForJob',
    tags: ['文旅', '运营', '策划'],
    hardcoreTags: ['从0到1', '攒局组队', '摆平烂摊'],
    resourceTags: ['景区资源', '媒体资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 7,
    activityCount: 2,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-03-11T00:00:00Z',
  },
  {
    id: 18,
    phone: '171****0018',
    password: '',
    nickname: '高远',
    name: '高远',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    age: 43,
    company: '农业科技发展有限公司',
    position: 'CEO',
    industry: '农业',
    bio: '20年农业科技经验，专注智慧农业和农产品电商',
    need: '寻找农业项目合作伙伴，推广智慧农业解决方案',
    tagStamp: 'jobLookingForPerson',
    tags: ['农业', '智慧农业', '电商'],
    hardcoreTags: ['定方向', '攒局组队', '搞定人'],
    resourceTags: ['农业资源', '渠道资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 10,
    activityCount: 1,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-03-21T00:00:00Z',
  },
  {
    id: 19,
    phone: '170****0019',
    password: '',
    nickname: '宋佳',
    name: '宋佳',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face',
    age: 35,
    company: '影视文化传媒有限公司',
    position: '内容总监',
    industry: '影视',
    bio: '10年影视内容创作经验，制作过多部爆款短视频',
    need: '寻找影视内容合作项目，提供内容创作服务',
    tagStamp: 'personLookingForJob',
    tags: ['影视', '内容', '短视频'],
    hardcoreTags: ['从0到1', '会说人话', '卖出去'],
    resourceTags: ['创作团队', '媒体资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 6,
    activityCount: 3,
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-03-13T00:00:00Z',
  },
  {
    id: 20,
    phone: '169****0020',
    password: '',
    nickname: '郭涛',
    name: '郭涛',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    age: 47,
    company: '汽车服务有限公司',
    position: '技术总监',
    industry: '汽车',
    bio: '25年汽车行业经验，专注新能源汽车和智能驾驶',
    need: '寻找汽车科技项目合作伙伴，推广智能驾驶技术',
    tagStamp: 'personLookingForJob',
    tags: ['汽车', '新能源', '智能驾驶'],
    hardcoreTags: ['AI技术', '卖出去', '搞定自己'],
    resourceTags: ['技术资源', '产业链资源'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 14,
    activityCount: 2,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-03-24T00:00:00Z',
  },
  {
    id: 21,
    phone: '168****0021',
    password: '',
    nickname: '韩雪',
    name: '韩雪',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    age: 32,
    company: '化妆品科技有限公司',
    position: '产品总监',
    industry: '美妆',
    bio: '8年美妆产品研发经验，开发过多个爆款产品',
    need: '寻找美妆产品合作项目，提供产品研发服务',
    tagStamp: 'personLookingForJob',
    tags: ['美妆', '研发', '产品'],
    hardcoreTags: ['搞定自己', '卖出去', '稳军心'],
    resourceTags: ['技术资源', '渠道资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 4,
    activityCount: 1,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-18T00:00:00Z',
  },
  {
    id: 22,
    phone: '167****0022',
    password: '',
    nickname: '唐伟',
    name: '唐伟',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=face',
    age: 45,
    company: '建筑集团有限公司',
    position: '项目总监',
    industry: '建筑',
    bio: '20年建筑工程管理经验，管理过多个大型基建项目',
    need: '寻找建筑工程项目合作，提供专业管理服务',
    tagStamp: 'jobLookingForPerson',
    tags: ['建筑', '工程', '管理'],
    hardcoreTags: ['带兵打仗', '搞定人', '摆平烂摊'],
    resourceTags: ['施工资源', '供应商资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 11,
    activityCount: 2,
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 23,
    phone: '166****0023',
    password: '',
    nickname: '姜敏',
    name: '姜敏',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    age: 36,
    company: '环保科技有限公司',
    position: '技术总监',
    industry: '环保',
    bio: '12年环保技术经验，专注废水和废气处理技术',
    need: '寻找环保项目合作伙伴，推广环保技术解决方案',
    tagStamp: 'personLookingForJob',
    tags: ['环保', '技术', '工程'],
    hardcoreTags: ['摆平烂摊', 'AI技术', '搞定人'],
    resourceTags: ['技术资源', '工程资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 5,
    activityCount: 1,
    createdAt: '2024-02-18T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 24,
    phone: '165****0024',
    password: '',
    nickname: '潘峰',
    name: '潘峰',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    age: 41,
    company: '矿业投资有限公司',
    position: '投资总监',
    industry: '矿业',
    bio: '18年矿业投资经验，专注矿产资源开发',
    need: '寻找矿业项目投资机会',
    tagStamp: 'jobLookingForPerson',
    tags: ['矿业', '投资', '开发'],
    hardcoreTags: ['定方向', '看懂账本', '搞定自己'],
    resourceTags: ['资金', '矿产资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 7,
    activityCount: 1,
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-03-23T00:00:00Z',
  },
  {
    id: 25,
    phone: '164****0025',
    password: '',
    nickname: '范丽',
    name: '范丽',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
    age: 34,
    company: '酒店管理有限公司',
    position: '运营总监',
    industry: '酒店',
    bio: '10年酒店运营管理经验，运营过多家五星级酒店',
    need: '寻找酒店运营项目，提供专业管理服务',
    tagStamp: 'personLookingForJob',
    tags: ['酒店', '运营', '管理'],
    hardcoreTags: ['稳军心', '搞定人', '攒局组队'],
    resourceTags: ['酒店资源', '客户资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 6,
    activityCount: 2,
    createdAt: '2024-02-12T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
  },
  {
    id: 26,
    phone: '163****0026',
    password: '',
    nickname: '方强',
    name: '方强',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    age: 49,
    company: '电力工程有限公司',
    position: '技术总监',
    industry: '电力',
    bio: '25年电力工程经验，参与过多个国家级电力项目',
    need: '寻找电力工程项目合作，提供专业技术服务',
    tagStamp: 'jobLookingForPerson',
    tags: ['电力', '工程', '技术'],
    hardcoreTags: ['定方向', '带兵打仗', '搞定人'],
    resourceTags: ['技术资源', '工程资源'],
    isTrusted: true,
    isFeatured: true,
    role: 'user',
    status: 'active',
    connectionCount: 13,
    activityCount: 1,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-03-25T00:00:00Z',
  },
  {
    id: 27,
    phone: '162****0027',
    password: '',
    nickname: '袁琳',
    name: '袁琳',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    age: 38,
    company: '食品科技有限公司',
    position: '研发总监',
    industry: '食品',
    bio: '15年食品研发经验，开发过多个爆款食品产品',
    need: '寻找食品研发项目合作伙伴',
    tagStamp: 'personLookingForJob',
    tags: ['食品', '研发', '产品'],
    hardcoreTags: ['从0到1', '看懂账本', '卖出去'],
    resourceTags: ['技术资源', '供应链资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 5,
    activityCount: 2,
    createdAt: '2024-02-08T00:00:00Z',
    updatedAt: '2024-03-16T00:00:00Z',
  },
  {
    id: 28,
    phone: '161****0028',
    password: '',
    nickname: '彭浩',
    name: '彭浩',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    age: 44,
    company: '航空航天科技有限公司',
    position: '技术总监',
    industry: '航空航天',
    bio: '22年航空航天技术经验，专注航空发动机技术',
    need: '寻找航空航天项目合作伙伴',
    tagStamp: 'personLookingForJob',
    tags: ['航空航天', '技术', '研发'],
    hardcoreTags: ['AI技术', '摆平烂摊', '卖出去'],
    resourceTags: ['技术资源', '产业链资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 6,
    activityCount: 1,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-03-26T00:00:00Z',
  },
  {
    id: 29,
    phone: '160****0029',
    password: '',
    nickname: '卢燕',
    name: '卢燕',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    age: 37,
    company: '物流科技有限公司',
    position: '运营总监',
    industry: '物流',
    bio: '12年物流运营经验，运营过多个大型物流园区',
    need: '寻找物流项目合作，提供运营管理服务',
    tagStamp: 'personLookingForJob',
    tags: ['物流', '运营', '园区'],
    hardcoreTags: ['摆平烂摊', '搞定人', '会说人话'],
    resourceTags: ['物流资源', '园区资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 7,
    activityCount: 2,
    createdAt: '2024-02-14T00:00:00Z',
    updatedAt: '2024-03-17T00:00:00Z',
  },
  {
    id: 30,
    phone: '159****0030',
    password: '',
    nickname: '戴明',
    name: '戴明',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    age: 46,
    company: '化工科技有限公司',
    position: '技术总监',
    industry: '化工',
    bio: '23年化工技术经验，专注新材料研发',
    need: '寻找化工项目合作伙伴，推广新材料技术',
    tagStamp: 'personLookingForJob',
    tags: ['化工', '新材料', '研发'],
    hardcoreTags: ['AI技术', '从0到1', '攒局组队'],
    resourceTags: ['技术资源', '产业链资源'],
    isTrusted: true,
    isFeatured: false,
    role: 'user',
    status: 'active',
    connectionCount: 9,
    activityCount: 1,
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-03-27T00:00:00Z',
  },
];

// ==================== 活动数据 ====================
export const mockActivities = [
  // 私董会活动1（已完成）
  {
    id: 1,
    title: 'CEO转型期私董会 - 第一期',
    subtitle: '深度探讨35+职场人的转型路径',
    category: '私董会',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    description: '针对35+职场转型人群，通过私董会形式深度探讨职业转型路径。围绕"如何利用过往经验"、"如何降低试错成本"、"如何构建第二职业曲线"等话题展开讨论。本次活动邀请了多位成功转型的企业家和职业导师，为参与者提供实战经验分享。',
    address: '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅',
    startDate: '2026-04-02T14:00:00Z',
    endDate: '2026-04-02T17:00:00Z',
    capacity: 12,
    teaFee: 0,
    status: 'active',
    createdBy: 6,
    guests: [17, 22, 29], // 参与嘉宾：马丽、唐伟、卢燕（不与参与人员1,2,6,10,14,20重复）
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T18:00:00Z',
  },
  // 私董会活动2（已完成）
  {
    id: 2,
    title: '创业者私董会 - 第二期',
    subtitle: '创业者资源对接与经验交流',
    category: '私董会',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
    description: '为创业者提供一个私密、专业的交流平台。通过私董会形式，创业者可以分享创业过程中的困惑和挑战，获得同行的建议和支持。本次活动重点讨论"如何获得第一笔投资"、"如何组建核心团队"、"如何快速验证商业模式"等核心议题。',
    address: '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅',
    startDate: '2026-04-09T14:00:00Z',
    endDate: '2026-04-09T17:00:00Z',
    capacity: 15,
    teaFee: 0,
    status: 'active',
    createdBy: 3,
    guests: [18, 25, 30], // 参与嘉宾：高远、范丽、戴明（不与参与人员3,4,7,8,13,16,19重复）
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-28T18:00:00Z',
  },
  // 私董会活动3（报名中）
  {
    id: 3,
    title: '企业家私董会 - 第三期',
    subtitle: '企业转型与数字化升级',
    category: '私董会',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    description: '针对传统企业家的转型需求，通过私董会形式探讨数字化转型的路径和方法。邀请数字化转型成功的企业家分享实战经验，包括"如何制定数字化战略"、"如何组织变革"、"如何培养数字化人才"等关键议题。',
    address: '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅',
    startDate: '2026-04-16T14:00:00Z',
    endDate: '2026-04-16T17:00:00Z',
    capacity: 15,
    teaFee: 0,
    status: 'active',
    createdBy: 2,
    guests: [4, 15, 23], // 参与嘉宾：刘伟、朱丹、姜敏（不与参与人员1,2,9,11,17,22,26,28重复）
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  // AI沙龙（报名中）
  {
    id: 4,
    title: 'AI实战应用沙龙 2026期',
    subtitle: '从理论到实践，全面掌握AI工具',
    category: '沙龙',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    description: '邀请AI领域的实战专家，分享AI工具在各行业的应用案例。涵盖ChatGPT、Midjourney、Stable Diffusion等主流AI工具的使用技巧。通过实际操作演示，帮助参与者快速掌握AI工具的应用方法，提升工作效率和创新能力。',
    address: '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅',
    startDate: '2026-04-15T14:00:00Z',
    endDate: '2026-04-15T17:00:00Z',
    capacity: 30,
    teaFee: 0,
    status: 'active',
    createdBy: 1,
    guests: [4, 7, 13], // 参与嘉宾：刘伟、孙丽、杨琳（不与参与人员1,5,11,12,15,18,21,23,24,27,30重复）
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  // OpenClaw培训（报名中）
  {
    id: 5,
    title: 'OpenClaw 低代码开发培训',
    subtitle: '零基础快速开发企业级应用',
    category: '培训',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    description: '针对非技术人员设计，通过OpenClaw低代码平台，让零基础用户也能快速开发企业级应用。课程内容包括：平台基础操作、数据建模、业务逻辑设计、UI设计、API集成等。通过实战项目演练，学员将完成一个完整的企业应用开发。',
    address: '杭州市西湖区碾米厂文化街区高燃茶楼二楼牡丹厅',
    startDate: '2026-04-20T09:00:00Z',
    endDate: '2026-04-21T17:00:00Z',
    capacity: 20,
    teaFee: 0,
    status: 'active',
    createdBy: 5,
    guests: [8, 14, 18], // 参与嘉宾：周涛、黄磊、高远（不与参与人员5,7,9,12,16,20,25,26,29重复）
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-03-18T00:00:00Z',
  },
];

// ==================== 用户活动关联数据 ====================
export const mockActivityRegistrations = [
  // 活动1（已完成）的参与人员
  { activityId: '1', userId: '1', status: 'completed', registeredAt: '2024-02-10T10:00:00Z' },
  { activityId: '1', userId: '2', status: 'completed', registeredAt: '2024-02-11T09:00:00Z' },
  { activityId: '1', userId: '6', status: 'completed', registeredAt: '2024-02-12T14:00:00Z' },
  { activityId: '1', userId: '10', status: 'completed', registeredAt: '2024-02-13T11:00:00Z' },
  { activityId: '1', userId: '14', status: 'completed', registeredAt: '2024-02-14T15:00:00Z' },
  { activityId: '1', userId: '20', status: 'completed', registeredAt: '2024-02-14T16:00:00Z' },
  
  // 活动2（已完成）的参与人员
  { activityId: '2', userId: '3', status: 'completed', registeredAt: '2024-02-15T10:00:00Z' },
  { activityId: '2', userId: '4', status: 'completed', registeredAt: '2024-02-16T09:00:00Z' },
  { activityId: '2', userId: '7', status: 'completed', registeredAt: '2024-02-20T14:00:00Z' },
  { activityId: '2', userId: '8', status: 'completed', registeredAt: '2024-02-21T10:00:00Z' },
  { activityId: '2', userId: '13', status: 'completed', registeredAt: '2024-02-22T11:00:00Z' },
  { activityId: '2', userId: '16', status: 'completed', registeredAt: '2024-02-23T15:00:00Z' },
  { activityId: '2', userId: '19', status: 'completed', registeredAt: '2024-02-24T14:00:00Z' },
  
  // 活动3（报名中）的参与人员
  { activityId: '3', userId: '1', status: 'approved', registeredAt: '2024-03-05T10:00:00Z' },
  { activityId: '3', userId: '2', status: 'approved', registeredAt: '2024-03-06T09:00:00Z' },
  { activityId: '3', userId: '9', status: 'approved', registeredAt: '2024-03-08T14:00:00Z' },
  { activityId: '3', userId: '11', status: 'approved', registeredAt: '2024-03-09T11:00:00Z' },
  { activityId: '3', userId: '17', status: 'approved', registeredAt: '2024-03-10T15:00:00Z' },
  { activityId: '3', userId: '22', status: 'approved', registeredAt: '2024-03-12T14:00:00Z' },
  { activityId: '3', userId: '26', status: 'approved', registeredAt: '2024-03-14T10:00:00Z' },
  { activityId: '3', userId: '28', status: 'approved', registeredAt: '2024-03-15T16:00:00Z' },
  
  // 活动4（AI沙龙）的参与人员
  { activityId: '4', userId: '1', status: 'approved', registeredAt: '2024-03-10T10:00:00Z' },
  { activityId: '4', userId: '5', status: 'approved', registeredAt: '2024-03-11T09:00:00Z' },
  { activityId: '4', userId: '11', status: 'approved', registeredAt: '2024-03-12T14:00:00Z' },
  { activityId: '4', userId: '12', status: 'approved', registeredAt: '2024-03-13T10:00:00Z' },
  { activityId: '4', userId: '15', status: 'approved', registeredAt: '2024-03-14T11:00:00Z' },
  { activityId: '4', userId: '18', status: 'approved', registeredAt: '2024-03-15T14:00:00Z' },
  { activityId: '4', userId: '21', status: 'approved', registeredAt: '2024-03-16T15:00:00Z' },
  { activityId: '4', userId: '23', status: 'approved', registeredAt: '2024-03-17T10:00:00Z' },
  { activityId: '4', userId: '24', status: 'approved', registeredAt: '2024-03-18T14:00:00Z' },
  { activityId: '4', userId: '27', status: 'approved', registeredAt: '2024-03-19T11:00:00Z' },
  { activityId: '4', userId: '30', status: 'approved', registeredAt: '2024-03-20T16:00:00Z' },
  
  // 活动5（OpenClaw培训）的参与人员
  { activityId: '5', userId: '5', status: 'approved', registeredAt: '2024-03-12T10:00:00Z' },
  { activityId: '5', userId: '7', status: 'approved', registeredAt: '2024-03-13T09:00:00Z' },
  { activityId: '5', userId: '9', status: 'approved', registeredAt: '2024-03-14T14:00:00Z' },
  { activityId: '5', userId: '12', status: 'approved', registeredAt: '2024-03-15T10:00:00Z' },
  { activityId: '5', userId: '16', status: 'approved', registeredAt: '2024-03-16T11:00:00Z' },
  { activityId: '5', userId: '20', status: 'approved', registeredAt: '2024-03-17T14:00:00Z' },
  { activityId: '5', userId: '25', status: 'approved', registeredAt: '2024-03-18T15:00:00Z' },
  { activityId: '5', userId: '26', status: 'approved', registeredAt: '2024-03-19T10:00:00Z' },
  { activityId: '5', userId: '29', status: 'approved', registeredAt: '2024-03-20T14:00:00Z' },
];

// ==================== 活动报名申请数据 ====================
export const mockActivityApplications = [
  // 待审核的报名申请
  {
    id: 'app-1',
    activityId: '1',
    userId: '21',
    reason: '希望学习AI技术在传统企业中的应用经验',
    status: 'pending',
    applyTime: '2024-04-10T10:00:00Z',
  },
  {
    id: 'app-2',
    activityId: '3',
    userId: '24',
    reason: '对企业数字化转型很感兴趣，想交流经验',
    status: 'pending',
    applyTime: '2024-04-10T14:30:00Z',
  },
  {
    id: 'app-3',
    activityId: '4',
    userId: '28',
    reason: '想学习AI实战应用技巧',
    status: 'pending',
    applyTime: '2024-04-11T09:15:00Z',
  },
];

// ==================== 探访项目数据 ====================
export const mockVisits = [
  {
    id: '1',
    companyId: '1',
    companyName: '智联科技有限公司',
    industry: '人工智能',
    title: 'AI技术在传统企业的应用实践',
    theme: 'AI技术在传统企业的应用实践',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    mainImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    duration: '4小时',
    date: '2024年3月15日',
    location: '北京市朝阳区望京科技园',
    visitors: [
      { id: '1', name: '赵强', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop', skill: '智能制造' },
      { id: '2', name: '李华', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', skill: '战略规划' },
      { id: '6', name: '张明', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop', skill: 'AI技术' },
    ],
    target: {
      name: '张明',
      title: '技术总监',
      company: '智联科技有限公司',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      tags: ['技术架构', 'AI应用', '团队管理'],
    },
    record: '本次探访深入了解智联科技如何将AI技术应用到传统制造业，包括智能制造、预测性维护、质量控制等场景。通过实地考察，学习AI技术落地的关键成功因素。',
    outcome: '获得3个合作意向，签订1个战略合作协议',
    keyPoints: [
      'AI技术需与业务场景深度结合',
      '数据质量是AI成功的关键',
      '人才团队建设至关重要',
      '小步快跑，快速迭代验证',
    ],
    nextSteps: [
      '对接客户资源，推动合作落地',
      '联合举办技术分享会',
      '建立长期技术交流机制',
    ],
    notes: '企业在AI应用方面有丰富经验，值得学习借鉴',
    rating: 5,
    status: ['已审核', '已发布'],
    tags: ['人工智能', 'AI技术落地', '数据质量', '人才培养'],
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audioDuration: '15:23',
    projectTags: ['AI技术落地', '数据质量', '人才培养', '快速迭代'],
  },
  {
    id: '2',
    companyId: '2',
    companyName: '华夏企业管理咨询有限公司',
    industry: '企业管理',
    title: '传统企业数字化转型的成功实践',
    theme: '传统企业数字化转型的成功实践',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    mainImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    duration: '3.5小时',
    date: '2024年3月10日',
    location: '上海市浦东新区陆家嘴',
    visitors: [
      { id: '1', name: '刘伟', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', skill: '投资' },
      { id: '2', name: '郑勇', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', skill: '法律' },
    ],
    target: {
      name: '李华',
      title: '合伙人',
      company: '华夏企业管理咨询有限公司',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      tags: ['战略规划', '组织变革', '流程优化'],
    },
    record: '深入了解华夏咨询如何帮助传统企业实现数字化转型，包括战略规划、组织架构调整、业务流程优化等方面的实践经验。',
    outcome: '获得2个合作意向，签订1个服务合同',
    keyPoints: [
      '数字化转型是一场组织变革',
      '领导层的决心至关重要',
      '文化转型比技术转型更难',
      '需要建立数字化人才体系',
    ],
    nextSteps: [
      '对接潜在客户资源',
      '联合举办企业培训',
      '建立咨询服务合作机制',
    ],
    notes: '数字化转型需要系统思维，不能急于求成',
    rating: 4,
    status: ['已审核', '已发布'],
    tags: ['企业管理', '数字化转型', '战略规划'],
    images: [
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    audioDuration: '12:45',
    projectTags: ['组织变革', '领导决心', '文化转型', '人才体系'],
  },
  {
    id: '3',
    companyId: '3',
    companyName: '创新教育科技有限公司',
    industry: '在线教育',
    title: '教育科技企业的创新实践',
    theme: '教育科技企业的创新实践',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop',
    mainImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop',
    duration: '3小时',
    date: '2024年3月5日',
    location: '深圳市南山区科技园',
    visitors: [
      { id: '1', name: '王芳', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop', skill: '教育' },
      { id: '2', name: '吴敏', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', skill: '人力资源' },
    ],
    target: {
      name: '王芳',
      title: '创始人',
      company: '创新教育科技有限公司',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
      tags: ['创业实战', '教育产品', '市场运营'],
    },
    record: '深入了解创新教育科技如何利用AI和大数据技术提升教育质量，包括个性化学习、智能测评、学习效果追踪等方面的创新实践。',
    outcome: '获得4个合作意向，签订2个合作协议',
    keyPoints: [
      'AI技术可以大幅提升教育效果',
      '个性化学习是未来趋势',
      '数据驱动决策很重要',
      '用户体验是核心竞争力',
    ],
    nextSteps: [
      '对接学校资源',
      '联合开发教育产品',
      '建立长期合作机制',
    ],
    notes: '教育科技行业发展迅速，创新是关键',
    rating: 5,
    status: ['已审核', '已发布'],
    tags: ['在线教育', 'AI技术', '个性化学习'],
    images: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    audioDuration: '11:30',
    projectTags: ['AI个性化', '数据驱动', '用户体验', '创新教育'],
  },
  {
    id: '4',
    companyId: '4',
    companyName: '天风投资管理有限公司',
    industry: '投资',
    title: '早期科技项目的投资策略',
    theme: '早期科技项目的投资策略',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    duration: '4.5小时',
    date: '2024年2月28日',
    location: '杭州市西湖区',
    visitors: [
      { id: '1', name: '陈明', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', skill: '金融科技' },
      { id: '2', name: '杨琳', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', skill: '电商' },
    ],
    target: {
      name: '刘伟',
      title: '投资经理',
      company: '天风投资管理有限公司',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      tags: ['项目评估', '投资分析', '资源对接'],
    },
    record: '深入了解天风投资如何筛选和评估早期科技项目，包括投资标准、尽职调查、投后管理等方面的实践经验。',
    outcome: '获得3个项目推荐，签订1个投资意向书',
    keyPoints: [
      '团队比项目更重要',
      '市场前景是核心评估指标',
      '风险控制贯穿投资全过程',
      '投后管理决定投资成败',
    ],
    nextSteps: [
      '推荐优质项目',
      '联合举办项目路演',
      '建立投资项目合作机制',
    ],
    notes: '早期投资风险高，但回报潜力也大',
    rating: 4,
    status: ['已审核', '已发布'],
    tags: ['投资', '项目评估', '风险管理'],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    audioDuration: '16:20',
    projectTags: ['团队评估', '市场前景', '风险控制', '投后管理'],
  },
  {
    id: '5',
    companyId: '5',
    companyName: '创意视觉设计工作室',
    industry: '设计',
    title: '品牌设计的创新思维',
    theme: '品牌设计的创新思维',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
    mainImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
    duration: '3小时',
    date: '2024年2月20日',
    location: '广州市天河区',
    visitors: [
      { id: '1', name: '陈静', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop', skill: '设计' },
      { id: '2', name: '孙丽', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop', skill: '营销' },
    ],
    target: {
      name: '陈静',
      title: '设计总监',
      company: '创意视觉设计工作室',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
      tags: ['品牌设计', '视觉设计', '用户体验'],
    },
    record: '深入了解创意视觉如何通过创新思维打造品牌形象，包括品牌定位、视觉设计、用户体验等方面的实践经验。',
    outcome: '获得5个合作意向，签订2个设计合同',
    keyPoints: [
      '品牌定位是设计的基础',
      '用户体验决定品牌成败',
      '创新思维需要不断学习',
      '设计要有商业价值',
    ],
    nextSteps: [
      '对接客户资源',
      '联合举办设计工作坊',
      '建立设计服务合作机制',
    ],
    notes: '设计不仅是艺术，更是商业',
    rating: 5,
    status: ['已审核', '已发布'],
    tags: ['设计', '品牌设计', '创新思维'],
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    audioDuration: '13:15',
    projectTags: ['品牌定位', '用户体验', '创新思维', '商业价值'],
  },
];

// ==================== 高燃宣告数据（20条）====================
export const mockDeclarations = [
  {
    id: '1',
    userId: '1',
    direction: 'confidence',
    text: '15年技术积淀，我用AI重塑传统制造业，让老工厂焕发新生机！',
    summary: '用AI技术助力制造业转型升级',
    iconType: '信心',
    rank: 1,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
    profile: '技术总监',
    duration: '5:23',
    views: 1256,
    isFeatured: true,
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    date: '2024-03-01',
    title: '15年技术积淀，我用AI重塑传统制造业',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    id: '2',
    userId: '2',
    direction: 'mission',
    text: '20年咨询生涯，我的使命是帮助1000家企业成功转型，让传统企业在数字时代绽放光彩！',
    summary: '助力企业数字化转型',
    iconType: '使命',
    rank: 2,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop',
    profile: '咨询合伙人',
    duration: '8:15',
    views: 1089,
    isFeatured: true,
    isActive: true,
    createdAt: '2024-03-02T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    date: '2024-03-02',
    title: '帮助1000家企业成功转型',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
  {
    id: '3',
    userId: '3',
    direction: 'self',
    text: '从HR到创始人，我用8年时间证明：年龄不是障碍，初心才是力量！',
    summary: '教育行业创业者的心声',
    iconType: '自我',
    rank: 3,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop',
    profile: '创始人',
    duration: '6:42',
    views: 967,
    isFeatured: false,
    isActive: false,
    createdAt: '2024-03-03T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    date: '2024-03-03',
    title: '从HR到创始人，年龄不是障碍',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: '4',
    userId: '4',
    direction: 'opponent',
    text: '最大的对手不是别人，而是固化的思维！我打破20年投资传统，用新模式赋能科技创业！',
    summary: '投资模式的创新者',
    iconType: '对手',
    rank: 4,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
    profile: '投资经理',
    duration: '7:30',
    views: 845,
    isFeatured: false,
    isActive: false,
    createdAt: '2024-03-04T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    date: '2024-03-04',
    title: '打破20年投资传统，用新模式赋能科技创业',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  },
  {
    id: '5',
    userId: '5',
    direction: 'environment',
    text: '在AI时代，设计不再是画图，而是用科技思维创造价值！我的设计工作室正在重塑行业规则！',
    summary: '设计科技化转型',
    iconType: '环境',
    rank: 5,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop',
    profile: '设计总监',
    duration: '5:45',
    views: 756,
    isFeatured: false,
    isActive: false,
    createdAt: '2024-03-05T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    date: '2024-03-05',
    title: '用科技思维创造价值，重塑行业规则',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  },
  {
    id: '6',
    userId: '6',
    direction: 'confidence',
    text: '25年制造业经验，我有信心让每一家工厂都成为智能工厂！这不是梦想，是我的使命！',
    summary: '智能制造践行者',
    iconType: '信心',
    rank: 6,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=400&fit=crop',
    profile: 'CEO',
    duration: '6:15',
    views: 689,
    isFeatured: true,
    isActive: true,
    createdAt: '2024-03-06T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    date: '2024-03-06',
    title: '让每一家工厂都成为智能工厂',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  },
  {
    id: '7',
    userId: '7',
    direction: 'mission',
    text: '我的使命是用数字营销帮助1000个品牌实现从0到1的突破，让中国品牌走向世界！',
    summary: '品牌营销专家',
    iconType: '使命',
    rank: 7,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=400&fit=crop',
    profile: '营销总监',
    duration: '5:30',
    views: 634,
    isFeatured: false,
    createdAt: '2024-03-07T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  },
  {
    id: '8',
    userId: '8',
    direction: 'self',
    text: '从基层到供应链总监，我用了18年，现在我要用技术帮助更多企业优化供应链！',
    summary: '供应链管理专家',
    iconType: '自我',
    rank: 8,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
    profile: '供应链总监',
    duration: '7:20',
    views: 567,
    isFeatured: false,
    createdAt: '2024-03-08T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  },
  {
    id: '9',
    userId: '9',
    direction: 'opponent',
    text: '最大的挑战是传统的HR思维！我要打破常规，用数据驱动人才管理，让每个人都能发挥最大价值！',
    summary: '人才管理创新者',
    iconType: '对手',
    rank: 9,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=400&fit=crop',
    profile: 'HRD',
    duration: '6:50',
    views: 498,
    isFeatured: false,
    createdAt: '2024-03-09T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  },
  {
    id: '10',
    userId: '10',
    direction: 'environment',
    text: '在商业环境中，法律不仅是保护，更是战略！我要用专业法律服务帮助企业规避风险，实现合规发展！',
    summary: '企业法律顾问',
    iconType: '环境',
    rank: 10,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    profile: '合伙人',
    duration: '5:40',
    views: 445,
    isFeatured: true,
    createdAt: '2024-03-10T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  },
  {
    id: '11',
    userId: '11',
    direction: 'confidence',
    text: '8年新媒体运营，我有信心把每一个账号打造成百万粉丝大号！内容为王，渠道制胜！',
    summary: '新媒体运营专家',
    iconType: '信心',
    rank: 11,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
    profile: '运营总监',
    duration: '5:15',
    views: 398,
    isFeatured: false,
    createdAt: '2024-03-11T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  },
  {
    id: '12',
    userId: '12',
    direction: 'mission',
    text: '我的使命是用金融科技让每一个人都能享受便捷的金融服务，让金融变得简单、透明、普惠！',
    summary: '金融科技践行者',
    iconType: '使命',
    rank: 12,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=400&fit=crop',
    profile: '产品总监',
    duration: '7:10',
    views: 367,
    isFeatured: false,
    createdAt: '2024-03-12T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
  },
  {
    id: '13',
    userId: '13',
    direction: 'self',
    text: '从0到千万级GMV，我用数据说话！电商运营不是玄学，而是科学和艺术的结合！',
    summary: '电商运营专家',
    iconType: '自我',
    rank: 13,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    profile: '运营总监',
    duration: '6:25',
    views: 334,
    isFeatured: false,
    createdAt: '2024-03-13T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3',
  },
  {
    id: '14',
    userId: '14',
    direction: 'opponent',
    text: '最大的对手是市场的变化！我要用20年经验，让房地产项目在新时代焕发新的生机！',
    summary: '房地产项目专家',
    iconType: '对手',
    rank: 14,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=400&fit=crop',
    profile: '项目总监',
    duration: '5:55',
    views: 312,
    isFeatured: false,
    createdAt: '2024-03-14T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3',
  },
  {
    id: '15',
    userId: '15',
    direction: 'environment',
    text: '在医疗健康领域，科技不仅是工具，更是希望！我要用我的专利技术，让更多患者受益！',
    summary: '医疗器械研发专家',
    iconType: '环境',
    rank: 15,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    profile: '研发总监',
    duration: '7:05',
    views: 289,
    isFeatured: false,
    createdAt: '2024-03-15T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3',
  },
  {
    id: '16',
    userId: '16',
    direction: 'confidence',
    text: '18年新能源技术积累，我有信心让储能技术成为未来能源的核心！绿色能源，从我做起！',
    summary: '新能源技术专家',
    iconType: '信心',
    rank: 16,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop',
    profile: '技术总监',
    duration: '6:40',
    views: 276,
    isFeatured: true,
    createdAt: '2024-03-16T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3',
  },
  {
    id: '17',
    userId: '17',
    direction: 'mission',
    text: '我的使命是让每一个景区都成为网红打卡地！用文旅创新，让传统文化焕发新活力！',
    summary: '文旅运营专家',
    iconType: '使命',
    rank: 17,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    profile: '运营总监',
    duration: '5:20',
    views: 258,
    isFeatured: false,
    createdAt: '2024-03-17T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3',
  },
  {
    id: '18',
    userId: '18',
    direction: 'self',
    text: '从田间到餐桌，我用科技让农业焕发新生！智慧农业不是概念，而是未来的方向！',
    summary: '智慧农业践行者',
    iconType: '自我',
    rank: 18,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    profile: 'CEO',
    duration: '6:30',
    views: 245,
    isFeatured: false,
    createdAt: '2024-03-18T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3',
  },
  {
    id: '19',
    userId: '19',
    direction: 'opponent',
    text: '最大的对手是传统思维的束缚！我要用短视频和直播，让每一个普通人都能成为创作者！',
    summary: '内容创作专家',
    iconType: '对手',
    rank: 19,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    profile: '内容总监',
    duration: '5:50',
    views: 234,
    isFeatured: false,
    createdAt: '2024-03-19T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3',
  },
  {
    id: '20',
    userId: '20',
    direction: 'environment',
    text: '在智能驾驶时代，传统汽车制造业面临巨大挑战！我要用25年经验，让中国汽车技术弯道超车！',
    summary: '汽车科技专家',
    iconType: '环境',
    rank: 20,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    profile: '技术总监',
    duration: '7:15',
    views: 223,
    isFeatured: false,
    createdAt: '2024-03-20T00:00:00Z',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3',
  },
];

// ==================== 文档数据 ====================
export const mockDocuments = [
  {
    id: '1',
    title: '私董会参与指南',
    description: '私董会的流程、规则和注意事项',
    fileUrl: '/documents/private-board-meeting-guide.pdf',
    fileType: 'pdf',
    fileSize: 2048576, // 2MB
    category: '活动指南',
    createdBy: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    downloadCount: 156,
  },
  {
    id: '2',
    title: 'AI技术应用白皮书',
    description: '2025年AI技术在各行业的应用趋势分析',
    fileUrl: '/documents/ai-application-whitepaper.pdf',
    fileType: 'pdf',
    fileSize: 5242880, // 5MB
    category: '行业报告',
    createdBy: 1,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    downloadCount: 89,
  },
  {
    id: '3',
    title: '企业数字化转型案例集',
    description: '10个成功的企业数字化转型案例分析',
    fileUrl: '/documents/digital-transformation-cases.pdf',
    fileType: 'pdf',
    fileSize: 8388608, // 8MB
    category: '行业报告',
    createdBy: 2,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    downloadCount: 67,
  },
  {
    id: '4',
    title: '探访项目申请表',
    description: '申请成为探访项目的标准表格',
    fileUrl: '/documents/visit-application-form.docx',
    fileType: 'docx',
    fileSize: 1048576, // 1MB
    category: '表格模板',
    createdBy: 3,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    downloadCount: 34,
  },
];

// ==================== 模拟数据库操作类 ====================
export class MockDatabase {
  // 获取所有用户
  static getUsers() {
    return mockUsers;
  }

  // 根据 ID 获取用户
  static getUserById(id: number) {
    return mockUsers.find(user => user.id === id);
  }

  // 根据手机号获取用户
  static getUserByPhone(phone: string) {
    return mockUsers.find(user => user.phone === phone);
  }

  // 获取所有活动
  static getActivities() {
    return mockActivities;
  }

  // 根据 ID 获取活动
  static getActivityById(id: number) {
    return mockActivities.find(activity => activity.id === id);
  }

  // 获取用户创建的活动
  static getActivitiesByCreator(creatorId: number) {
    return mockActivities.filter(activity => activity.createdBy === creatorId);
  }

  // 获取用户参与的活动
  static getActivitiesByParticipant(userId: number) {
    const userActivityIds = mockActivityRegistrations
      .filter(ua => ua.userId === userId.toString())
      .map(ua => ua.activityId);
    return mockActivities.filter(activity =>
      userActivityIds.includes(activity.id.toString())
    );
  }

  // 获取活动的参与者
  static getActivityParticipants(activityId: number) {
    const userIds = mockActivityRegistrations
      .filter(ua => ua.activityId === activityId.toString())
      .map(ua => ua.userId);
    return mockUsers.filter(user => userIds.includes(user.id.toString()));
  }

  // 获取活动的嘉宾
  static getActivityGuests(activityId: number) {
    const activity = mockActivities.find(a => a.id === activityId);
    if (!activity || !activity.guests) {
      return [];
    }
    const guestIds = activity.guests;
    return mockUsers.filter(user => guestIds.includes(user.id));
  }

  // 获取所有探访
  static getVisits() {
    return mockVisits;
  }

  // 根据 ID 获取探访
  static getVisitById(id: string) {
    return mockVisits.find(visit => visit.id === id);
  }

  // 获取所有高燃宣告
  static getDeclarations() {
    return mockDeclarations;
  }

  // 根据 ID 获取高燃宣告
  static getDeclarationById(id: string) {
    return mockDeclarations.find(declaration => declaration.id === id);
  }

  // 根据用户ID获取高燃宣告
  static getDeclarationsByUserId(userId: string) {
    return mockDeclarations.filter(declaration => declaration.userId === userId);
  }

  // 创建用户
  static createUser(userData: any) {
    const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
    const newUser = {
      id: newId,
      ...userData,
      connectionCount: 0,
      activityCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  // 创建活动
  static createActivity(activityData: any) {
    const newId = Math.max(...mockActivities.map(a => a.id)) + 1;
    const newActivity = {
      id: newId,
      ...activityData,
      currentParticipants: 0,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockActivities.push(newActivity);
    return newActivity;
  }

  // 用户加入活动
  static joinActivity(userId: number, activityId: number) {
    const alreadyJoined = mockActivityRegistrations.some(
      ua => ua.userId === userId.toString() && ua.activityId === activityId.toString()
    );
    if (alreadyJoined) {
      return { success: false, message: '已加入该活动' };
    }

    mockActivityRegistrations.push({
      userId: userId.toString(),
      activityId: activityId.toString(),
      status: 'approved',
      registeredAt: new Date().toISOString(),
    });

    return { success: true };
  }

  // 更新用户信息
  static updateUser(id: number, updates: any) {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return null;
    }
    mockUsers[index] = {
      ...mockUsers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockUsers[index];
  }

  // 更新活动信息
  static updateActivity(id: number, updates: any) {
    const index = mockActivities.findIndex(a => a.id === id);
    if (index === -1) {
      return null;
    }
    mockActivities[index] = {
      ...mockActivities[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockActivities[index];
  }

  // 更新探访信息
  static updateVisit(id: string, updates: any) {
    const index = mockVisits.findIndex(v => v.id === id);
    if (index === -1) {
      return null;
    }
    mockVisits[index] = {
      ...mockVisits[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockVisits[index];
  }

  // 删除用户
  static deleteUser(id: number) {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return false;
    }
    mockUsers.splice(index, 1);
    return true;
  }

  // 删除活动
  static deleteActivity(id: number) {
    const index = mockActivities.findIndex(a => a.id === id);
    if (index === -1) {
      return false;
    }
    mockActivities.splice(index, 1);
    return true;
  }

  // 创建高燃宣告
  static createDeclaration(declarationData: any) {
    const newId = (mockDeclarations.length + 1).toString();
    const newDeclaration = {
      id: newId,
      ...declarationData,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDeclarations.push(newDeclaration);
    return newDeclaration;
  }

  // 更新高燃宣告
  static updateDeclaration(id: string, updates: any) {
    const index = mockDeclarations.findIndex(d => d.id === id);
    if (index === -1) {
      return null;
    }
    mockDeclarations[index] = {
      ...mockDeclarations[index],
      ...updates,
    };
    return mockDeclarations[index];
  }

  // 增加高燃宣告浏览量
  static incrementDeclarationViews(id: string) {
    const declaration = mockDeclarations.find(d => d.id === id);
    if (declaration) {
      declaration.views = (declaration.views || 0) + 1;
    }
    return declaration;
  }

  // 获取所有文档
  static getDocuments() {
    return mockDocuments;
  }

  // 根据 ID 获取文档
  static getDocumentById(id: string) {
    return mockDocuments.find(doc => doc.id === id);
  }

  // 创建文档
  static createDocument(documentData: any) {
    const newId = (mockDocuments.length + 1).toString();
    const newDocument = {
      id: newId,
      ...documentData,
      views: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDocuments.push(newDocument);
    return newDocument;
  }

  // 更新文档
  static updateDocument(id: string, updates: any) {
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index === -1) {
      return null;
    }
    mockDocuments[index] = {
      ...mockDocuments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockDocuments[index];
  }

  // 删除文档
  static deleteDocument(id: string) {
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index === -1) {
      return false;
    }
    mockDocuments.splice(index, 1);
    return true;
  }

  // 增加文档下载次数
  static incrementDocumentDownloadCount(id: string) {
    const document = mockDocuments.find(doc => doc.id === id);
    if (document) {
      document.downloadCount = (document.downloadCount || 0) + 1;
    }
    return document;
  }

  // ==================== 每日宣告相关方法 ====================

  // 获取所有每日宣告
  static getDailyDeclarations() {
    return mockDeclarations;
  }

  // 根据 ID 获取每日宣告
  static getDailyDeclarationById(id: string) {
    return mockDeclarations.find(decl => decl.id === id);
  }

  // 创建每日宣告
  static createDailyDeclaration(declarationData: any) {
    const newId = (mockDeclarations.length + 1).toString();
    const newDeclaration = {
      id: newId,
      ...declarationData,
      isActive: declarationData.isActive ?? true,
      createdAt: new Date().toISOString(),
    };
    mockDeclarations.push(newDeclaration);
    return newDeclaration;
  }

  // 更新每日宣告
  static updateDailyDeclaration(id: string, updates: any) {
    const index = mockDeclarations.findIndex(decl => decl.id === id);
    if (index === -1) {
      return null;
    }
    mockDeclarations[index] = {
      ...mockDeclarations[index],
      ...updates,
    };
    return mockDeclarations[index];
  }

  // 删除每日宣告
  static deleteDailyDeclaration(id: string) {
    const index = mockDeclarations.findIndex(decl => decl.id === id);
    if (index === -1) {
      return false;
    }
    mockDeclarations.splice(index, 1);
    return true;
  }

  // ==================== 活动相关方法 ====================
  static getActivityRegistrations() {
    return mockActivityRegistrations;
  }

  // 获取某个活动的参与记录
  static getActivityRegistrationsByActivityId(activityId: string) {
    return mockActivityRegistrations.filter(r => r.activityId === activityId);
  }

  // 获取用户对某个活动的报名状态
  static getUserActivityRegistrationStatus(userId: string, activityId: string) {
    const registration = mockActivityRegistrations.find(
      r => r.userId === userId && r.activityId === activityId
    );
    return registration ? registration.status : null;
  }

  // 创建活动报名申请
  static createActivityApplication(applicationData: {
    activityId: string;
    userId: string;
    reason: string;
  }) {
    const newApplication = {
      id: `app-${Date.now()}`,
      ...applicationData,
      status: 'pending',
      applyTime: new Date().toISOString(),
    };
    mockActivityApplications.push(newApplication);
    return newApplication;
  }

  // 获取所有活动报名申请
  static getActivityApplications() {
    return mockActivityApplications;
  }

  // 获取某个活动的报名申请
  static getActivityApplicationsByActivityId(activityId: string) {
    return mockActivityApplications.filter(app => app.activityId === activityId);
  }

  // 获取某个用户的报名申请
  static getActivityApplicationsByUserId(userId: string) {
    return mockActivityApplications.filter(app => app.userId === userId);
  }

  // 审核报名申请
  static reviewActivityApplication(
    applicationId: string,
    status: 'approved' | 'rejected',
    adminId?: string
  ) {
    // 更新申请状态
    const application = mockActivityApplications.find(app => app.id === applicationId);
    if (!application) {
      return null;
    }
    application.status = status;

    // 如果通过审核，创建参与记录
    if (status === 'approved') {
      const existingRegistration = mockActivityRegistrations.find(
        r => r.userId === application.userId && r.activityId === application.activityId
      );
      if (!existingRegistration) {
        mockActivityRegistrations.push({
          activityId: application.activityId,
          userId: application.userId,
          status: 'approved',
          registeredAt: new Date().toISOString(),
        });
      } else {
        existingRegistration.status = 'approved';
      }
    }

    return application;
  }

  // 获取待审核的活动申请
  static getPendingActivityApplications() {
    return mockActivityApplications.filter(app => app.status === 'pending');
  }

  // ==================== 管理员管理相关方法 ====================

  // 获取所有管理员
  static getAdmins() {
    return mockUsers.filter(user => user.role === 'admin');
  }

  // 创建管理员
  static createAdmin(adminData: { phone: string; password: string; nickname: string; name: string }) {
    // 检查手机号是否已存在
    const existingUser = mockUsers.find(user => user.phone === adminData.phone);
    if (existingUser) {
      throw new Error('该手机号已被注册');
    }

    const newAdmin = {
      id: mockUsers.length + 1,
      phone: adminData.phone,
      password: adminData.password,
      nickname: adminData.nickname,
      name: adminData.name,
      avatar: `https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face`,
      age: 30,
      company: '燃场',
      position: '管理员',
      industry: '管理',
      bio: '燃场管理员',
      need: '',
      tagStamp: 'pureExchange',
      tags: [],
      hardcoreTags: [],
      resourceTags: [],
      isTrusted: true,
      isFeatured: false,
      role: 'admin' as const,
      status: 'active',
      connectionCount: 0,
      activityCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newAdmin);
    return newAdmin;
  }

  // 修改管理员密码
  static updateAdminPassword(userId: number, newPassword: string) {
    const admin = mockUsers.find(user => user.id === userId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('管理员不存在');
    }

    admin.password = newPassword;
    admin.updatedAt = new Date().toISOString();
    return admin;
  }

  // 删除管理员（降级为普通用户）
  static deleteAdmin(userId: number) {
    const admin = mockUsers.find(user => user.id === userId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('管理员不存在');
    }

    // 不允许删除最后一个管理员
    const adminCount = mockUsers.filter(user => user.role === 'admin').length;
    if (adminCount <= 1) {
      throw new Error('不能删除最后一个管理员');
    }

    admin.role = 'user' as const;
    admin.updatedAt = new Date().toISOString();
    return admin;
  }
}
