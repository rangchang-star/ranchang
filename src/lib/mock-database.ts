// 统一的模拟数据库
// 前后端共享此数据源，确保数据一致性

// 用户数据
export const mockUsers = [
  {
    id: 1,
    phone: '13023699913',
    password: '',
    nickname: '张明',
    name: '张明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    age: 38,
    company: '科技有限公司',
    position: '技术总监',
    industry: '互联网',
    bio: '15年互联网行业经验，擅长AI技术应用',
    need: '寻找AI项目合作伙伴',
    tagStamp: 'personLookingForJob',
    tags: ['技术', '管理', 'AI'],
    abilityTags: ['技术架构', '团队管理', 'AI应用'],
    resourceTags: ['资金', '人脉', '技术资源'],
    isTrusted: true,
    role: 'user',
    status: 'active',
    connectionCount: 12,
    activityCount: 3,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 2,
    phone: '139****0002',
    password: '$2b$10$def456...',
    nickname: '李华',
    name: '李华',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    age: 42,
    company: '咨询公司',
    position: '合伙人',
    industry: '咨询',
    bio: '20年企业管理咨询经验',
    need: '寻找传统企业转型项目',
    tagStamp: 'jobLookingForPerson',
    tags: ['咨询', '管理', '转型'],
    abilityTags: ['战略规划', '组织变革', '流程优化'],
    resourceTags: ['客户资源', '行业经验'],
    isTrusted: true,
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
    password: '$2b$10$ghi789...',
    nickname: '王芳',
    name: '王芳',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    age: 35,
    company: '创业公司',
    position: '创始人',
    industry: '教育',
    bio: '教育行业连续创业者',
    need: '寻找投资人和运营人才',
    tagStamp: 'personLookingForJob',
    tags: ['创业', '教育', '运营'],
    abilityTags: ['创业实战', '教育产品', '市场运营'],
    resourceTags: ['产品', '团队'],
    isTrusted: true,
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
    password: '$2b$10$jkl012...',
    nickname: '刘伟',
    name: '刘伟',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    age: 45,
    company: '投资公司',
    position: '投资经理',
    industry: '投资',
    bio: '专注于早期科技项目投资',
    need: '寻找优质科技创业项目',
    tagStamp: 'jobLookingForPerson',
    tags: ['投资', '科技', '创业'],
    abilityTags: ['项目评估', '投资分析', '资源对接'],
    resourceTags: ['资金', '行业资源'],
    isTrusted: true,
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
    password: '$2b$10$mno345...',
    nickname: '陈静',
    name: '陈静',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    age: 39,
    company: '设计工作室',
    position: '设计总监',
    industry: '设计',
    bio: '15年品牌设计经验',
    need: '寻找品牌设计项目合作',
    tagStamp: 'personLookingForJob',
    tags: ['设计', '品牌', '创意'],
    abilityTags: ['品牌设计', '视觉设计', '用户体验'],
    resourceTags: ['设计资源', '创意团队'],
    isTrusted: true,
    role: 'user',
    status: 'active',
    connectionCount: 6,
    activityCount: 2,
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

// 活动数据
export const mockActivities = [
  {
    id: 1,
    category: '技术分享',
    title: 'AI技术实践沙龙',
    subtitle: '探索AI在传统行业的应用',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    startTime: '2024-04-15T14:00:00Z',
    endTime: '2024-04-15T17:00:00Z',
    location: '北京市朝阳区',
    maxParticipants: 50,
    currentParticipants: 35,
    status: 'upcoming',
    creatorId: 1, // 张明
    tags: ['AI', '技术', '分享'],
    description: '本次活动将邀请多位AI技术专家，分享他们在传统行业应用AI的实践经验。',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
  },
  {
    id: 2,
    category: '创业交流',
    title: '创业者资源对接会',
    subtitle: '连接资源，共创未来',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    startTime: '2024-04-20T09:30:00Z',
    endTime: '2024-04-20T12:00:00Z',
    location: '上海市浦东新区',
    maxParticipants: 100,
    currentParticipants: 68,
    status: 'upcoming',
    creatorId: 3, // 王芳
    tags: ['创业', '资源', '对接'],
    description: '为创业者提供一个资源对接和经验交流的平台，助力创业成功。',
    createdAt: '2024-03-08T00:00:00Z',
    updatedAt: '2024-03-11T00:00:00Z',
  },
  {
    id: 3,
    category: '行业洞察',
    title: '2024行业趋势研讨会',
    subtitle: '洞察趋势，把握机遇',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    startTime: '2024-04-25T14:00:00Z',
    endTime: '2024-04-25T17:00:00Z',
    location: '深圳市南山区',
    maxParticipants: 80,
    currentParticipants: 45,
    status: 'upcoming',
    creatorId: 2, // 李华
    tags: ['行业', '趋势', '研讨'],
    description: '邀请行业专家分享2024年各行业的发展趋势和机遇。',
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 4,
    category: '设计工作坊',
    title: '品牌设计实战工作坊',
    subtitle: '从0到1打造品牌形象',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=400&fit=crop',
    startTime: '2024-04-18T10:00:00Z',
    endTime: '2024-04-18T16:00:00Z',
    location: '广州市天河区',
    maxParticipants: 30,
    currentParticipants: 28,
    status: 'upcoming',
    creatorId: 5, // 陈静
    tags: ['设计', '品牌', '实战'],
    description: '通过实际案例教学，帮助参与者掌握品牌设计的核心方法。',
    createdAt: '2024-03-07T00:00:00Z',
    updatedAt: '2024-03-13T00:00:00Z',
  },
  {
    id: 5,
    category: '投资路演',
    title: '科技项目路演日',
    subtitle: '优质项目，资本对接',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop',
    startTime: '2024-04-22T13:00:00Z',
    endTime: '2024-04-22T18:00:00Z',
    location: '杭州市西湖区',
    maxParticipants: 150,
    currentParticipants: 89,
    status: 'upcoming',
    creatorId: 4, // 刘伟
    tags: ['投资', '路演', '科技'],
    description: '邀请优质科技项目进行路演，与投资人面对面交流。',
    createdAt: '2024-03-06T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
  },
];

// 用户活动关联数据
export const mockUserActivities = [
  { userId: 1, activityId: 1, joinedAt: '2024-03-10T10:00:00Z' },
  { userId: 1, activityId: 2, joinedAt: '2024-03-11T09:00:00Z' },
  { userId: 2, activityId: 1, joinedAt: '2024-03-10T11:00:00Z' },
  { userId: 2, activityId: 3, joinedAt: '2024-03-12T14:00:00Z' },
  { userId: 3, activityId: 2, joinedAt: '2024-03-08T09:00:00Z' },
  { userId: 3, activityId: 4, joinedAt: '2024-03-13T10:00:00Z' },
  { userId: 3, activityId: 5, joinedAt: '2024-03-14T13:00:00Z' },
  { userId: 4, activityId: 3, joinedAt: '2024-03-12T15:00:00Z' },
  { userId: 4, activityId: 5, joinedAt: '2024-03-13T14:00:00Z' },
  { userId: 5, activityId: 1, joinedAt: '2024-03-10T12:00:00Z' },
  { userId: 5, activityId: 4, joinedAt: '2024-03-07T10:00:00Z' },
];

// 模拟数据库操作类
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
    return mockActivities.filter(activity => activity.creatorId === creatorId);
  }

  // 获取用户参与的活动
  static getActivitiesByParticipant(userId: number) {
    const userActivityIds = mockUserActivities
      .filter(ua => ua.userId === userId)
      .map(ua => ua.activityId);
    return mockActivities.filter(activity =>
      userActivityIds.includes(activity.id)
    );
  }

  // 获取活动的参与者
  static getActivityParticipants(activityId: number) {
    const userIds = mockUserActivities
      .filter(ua => ua.activityId === activityId)
      .map(ua => ua.userId);
    return mockUsers.filter(user => userIds.includes(user.id));
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
    const alreadyJoined = mockUserActivities.some(
      ua => ua.userId === userId && ua.activityId === activityId
    );
    if (alreadyJoined) {
      return { success: false, message: '已加入该活动' };
    }

    mockUserActivities.push({
      userId,
      activityId,
      joinedAt: new Date().toISOString(),
    });

    // 更新活动的参与人数
    const activity = mockActivities.find(a => a.id === activityId);
    if (activity) {
      activity.currentParticipants = (activity.currentParticipants || 0) + 1;
      activity.updatedAt = new Date().toISOString();
    }

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

  // 删除用户
  static deleteUser(id: number) {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return false;
    }
    mockUsers.splice(index, 1);
    // 同时删除关联的活动参与记录
    const activityIndex = mockUserActivities.findIndex(
      ua => ua.userId === id
    );
    if (activityIndex !== -1) {
      mockUserActivities.splice(activityIndex, 1);
    }
    return true;
  }

  // 删除活动
  static deleteActivity(id: number) {
    const index = mockActivities.findIndex(a => a.id === id);
    if (index === -1) {
      return false;
    }
    mockActivities.splice(index, 1);
    // 同时删除关联的活动参与记录
    const activityIndex = mockUserActivities.findIndex(
      ua => ua.activityId === id
    );
    if (activityIndex !== -1) {
      mockUserActivities.splice(activityIndex, 1);
    }
    return true;
  }
}

// 探访数据
export const mockVisits = [
  {
    id: '1',
    title: '上海某制造业企业数字化转型探访',
    industry: '企业转型',
    duration: '4小时',
    date: '2024年3月15日',
    time: '14:00 - 18:00',
    location: '上海市松江区工业园区',
    participants: 5,
    visitors: [
      { name: '陈永明', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_af5cc0fe-324f-427e-bdeb-546e898b62f6.jpeg?sign=1804211031-65708fd535-0-d43856138aca15c5c8ba06d6a515fa5a2366705a4df51fb95b9a66e244ec31e5', skill: '战略', tags: ['战略规划', '数字化转型'] },
      { name: '李雪梅', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_e261d034-5d7d-4119-9d0c-fdfa90bcdbcc.jpeg?sign=1804211032-29d4f52530-0-fc22688ea885c9e0d9b1a3dc21456c2e957369397efa73e953abad7a18f37c1a', skill: '营销', tags: ['营销策略', '品牌管理'] },
      { name: '张志强', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_c5921701-ca08-48f7-9889-af89c3b63a24.jpeg?sign=1804211031-6d2ec28685-0-a2001ce035b1e234214d716bfe2fbba38984784350dfbbbc7986a4bed3f8a6e2', skill: '产品', tags: ['产品设计', '产品管理'] },
    ],
    record: '企业面临数字化转型的关键阶段，传统生产模式效率低下，需要从设备智能化、流程数字化、管理信息化三个维度进行全面改造。本次走访重点了解企业当前痛点，制定分阶段转型方案。',
    status: ['组织优化', '战略规划', '产品创新'],
    audioDuration: '5:23',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    target: {
      name: '王建国',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      title: '总经理',
      company: '上海智造科技有限公司',
      tags: ['智能制造', '数字化转型'],
    },
    outcome: '与企业达成初步合作意向，约定下周继续深入对接具体方案。企业对数字化转型表现出强烈意愿，愿意投入资源和时间。',
    keyPoints: [
      '企业目前生产效率提升空间约30%',
      '已完成设备升级，但流程和管理体系尚未跟上',
      '员工对新设备的接受度需要培训提升',
      '供应链数字化是下一步重点',
    ],
    nextSteps: [
      '下周一安排技术团队对接',
      '两周内完成数字化转型方案初稿',
      '月底前组织高层战略研讨会',
    ],
    notes: '建议关注企业员工培训体系，数字化转型不仅是技术问题，更是人的问题。',
    rating: 4,
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop',
    ],
    views: 1523,
    likes: 89,
    createdAt: '2024-03-15T16:30:00Z',
  },
  {
    id: '2',
    title: '杭州科技创业公司战略规划探访',
    industry: '战略规划',
    duration: '3.5小时',
    date: '2024年3月12日',
    time: '10:00 - 13:30',
    location: '杭州市滨江区创业大厦',
    participants: 3,
    visitors: [
      { name: '赵丽娜', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_47e0f5ad-6b79-478b-af48-3c8629aadf23.jpeg?sign=1804211046-b450875ec6-0-721112335d177e7449e7a28fcfc4287f5245a2eac8324a03caa77bbeddc08fd9', skill: '运营', tags: ['运营管理', '用户增长'] },
      { name: '陈永明', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_af5cc0fe-324f-427e-bdeb-546e898b62f6.jpeg?sign=1804211031-65708fd535-0-d43856138aca15c5c8ba06d6a515fa5a2366705a4df51fb95b9a66e244ec31e5', skill: '战略', tags: ['战略规划', '商业模式'] },
    ],
    record: '创业公司快速发展期面临战略选择，需要在A轮融资、市场扩张、产品迭代之间找到平衡点。通过深度访谈，明确未来6个月的优先级，建立关键指标体系。',
    status: ['市场拓展', '资本运作'],
    audioDuration: '4:15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=400&fit=crop',
    target: {
      name: '刘晓婷',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      title: 'CEO',
      company: '杭州智联科技有限公司',
      tags: ['创业', 'AI'],
    },
    outcome: '帮助企业理清了战略优先级，明确了A轮融资的核心要点。创始人对战略方向有了更清晰的认识。',
    keyPoints: [
      '产品稳定度是融资基础',
      '市场数据要真实可信',
      '团队扩张要谨慎有序',
      '现金流管理是生存关键',
    ],
    nextSteps: [
      '下周完成商业计划书修订',
      '两周内对接3家投资机构',
      '月度进行战略复盘会议',
    ],
    notes: '创始人对市场过于乐观，需要帮助建立更现实的目标设定机制。',
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    ],
    views: 2341,
    likes: 124,
    createdAt: '2024-03-12T16:00:00Z',
  },
  {
    id: '3',
    title: '广州连锁企业组织优化探访',
    industry: '组织优化',
    duration: '5小时',
    date: '2024年3月10日',
    time: '09:00 - 14:00',
    location: '广州市天河区体育西路',
    participants: 6,
    visitors: [
      { name: '张志强', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_c5921701-ca08-48f7-9889-af89c3b63a24.jpeg?sign=1804211031-6d2ec28685-0-a2001ce035b1e234214d716bfe2fbba38984784350dfbbbc7986a4bed3f8a6e2', skill: '管理', tags: ['组织管理', '人才培养'] },
      { name: '李雪梅', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_e261d034-5d7d-4119-9d0c-fdfa90bcdbcc.jpeg?sign=1804211032-29d4f52530-0-fc22688ea885c9e0d9b1a3dc21456c2e957369397efa73e953abad7a18f37c1a', skill: '渠道', tags: ['渠道管理', '门店运营'] },
      { name: '陈永明', avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_af5cc0fe-324f-427e-bdeb-546e898b62f6.jpeg?sign=1804211031-65708fd535-0-d43856138aca15c5c8ba06d6a515fa5a2366705a4df51fb95b9a66e244ec31e5', skill: '战略', tags: ['战略规划', '组织设计'] },
    ],
    record: '连锁门店快速扩张后，组织架构和管理体系跟不上发展节奏，跨区域协同困难。重点考察门店运营流程，设计标准化管理体系和人才培训机制。',
    status: ['组织优化', '市场拓展', '产品创新'],
    audioDuration: '6:30',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    target: {
      name: '黄志强',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      title: '董事长',
      company: '广州连锁餐饮集团',
      tags: ['连锁经营', '组织管理'],
    },
    outcome: '识别出组织架构存在的3个核心问题，制定了标准化管理体系框架。预计可在3个月内完成组织优化。',
    keyPoints: [
      '总部与门店权责不清',
      '标准化程度不足，复制困难',
      '人才梯队建设滞后',
      '激励机制需要优化',
    ],
    nextSteps: [
      '下月启动标准化流程项目',
      '两个月内完成人才梯队设计',
      '季度进行组织架构调整',
    ],
    notes: '企业文化比较强势，推动变革需要更多沟通和耐心。',
    rating: 4,
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
    ],
    views: 1876,
    likes: 98,
    createdAt: '2024-03-10T17:00:00Z',
  },
];

// 高燃宣告数据
export const mockDeclarations = [
  {
    id: '1',
    rank: 1,
    icon: '/icon-confidence.jpg',
    iconType: '信心',
    title: '用AI重塑传统制造业',
    profile: '制造专家',
    duration: '5:23',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    content: '我是一名制造业的供应链专家，从事这个行业已经15年了。最近我开始思考，传统制造业如何能够拥抱AI时代的变革。通过深入学习和实践，我发现AI不仅仅是一个工具，更是一种思维方式。我的目标是用AI技术重塑传统制造业的生产流程和管理模式，让每一家制造企业都能在数字化转型的浪潮中找到自己的位置。',
    creator: {
      name: '王姐',
      avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_af5cc0fe-324f-427e-bdeb-546e898b62f6.jpeg?sign=1804211031-65708fd535-0-d43856138aca15c5c8ba06d6a515fa5a2366705a4df51fb95b9a66e244ec31e5',
      industry: '制造业',
      tags: ['供应链专家', '数字化转型'],
    },
    publishDate: '2024年3月1日',
    views: 2847,
    likes: 156,
    shares: 89,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '2',
    rank: 2,
    icon: '/icon-mission.jpg',
    iconType: '使命',
    title: '35+创业者的破局之路',
    profile: '连续创业者',
    duration: '8:15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    content: '35岁创业，很多人说我疯了。但我知道，这是我的使命。这三年，我经历了从失败到重生的全过程。今天我想分享的是，如何在35岁之后找到创业的第二曲线，如何用更成熟的心态去面对市场的变化，如何把人生的经验转化为创业的优势。',
    creator: {
      name: '李强',
      avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_47e0f5ad-6b79-478b-af48-3c8629aadf23.jpeg?sign=1804211046-b450875ec6-0-721112335d177e7449e7a28fcfc4287f5245a2eac8324a03caa77bbeddc08fd9',
      industry: '互联网',
      tags: ['连续创业者', '战略咨询'],
    },
    publishDate: '2024年3月2日',
    views: 3521,
    likes: 234,
    shares: 112,
    createdAt: '2024-03-02T00:00:00Z',
  },
  {
    id: '3',
    rank: 3,
    icon: '/icon-self.jpg',
    iconType: '自我',
    title: '从HR到企业合伙人',
    profile: '战略顾问',
    duration: '6:42',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    content: '我曾经是一名HR，每天处理招聘、培训、绩效这些事务性工作。但在40岁那年，我决定改变。我开始学习财务、市场、战略，把自己从HR转型为企业合伙人。这是一个痛苦但值得的过程，今天我想分享这段经历，希望能给同样想要转型的你一些启发。',
    creator: {
      name: '张敏',
      avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_e261d034-5d7d-4119-9d0c-fdfa90bcdbcc.jpeg?sign=1804211032-29d4f52530-0-fc22688ea885c9e0d9b1a3dc21456c2e957369397efa73e953abad7a18f37c1a',
      industry: '人力资源',
      tags: ['HR转型', '合伙人'],
    },
    publishDate: '2024年3月3日',
    views: 2189,
    likes: 178,
    shares: 76,
    createdAt: '2024-03-03T00:00:00Z',
  },
  {
    id: '4',
    rank: 4,
    icon: '/icon-opponent.jpg',
    iconType: '对手',
    title: 'AI时代的产品思维',
    profile: '产品总监',
    duration: '7:30',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    content: 'AI时代的到来，彻底改变了产品思维。传统的产品经理关注功能、体验、用户需求。但AI时代的产品经理，需要关注数据、算法、智能。我是一名产品总监，在过去两年里，我带领团队完成了多个AI产品的开发。今天我想分享的是，AI时代的产品思维应该如何转变。',
    creator: {
      name: '陈伟',
      avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_c5921701-ca08-48f7-9889-af89c3b63a24.jpeg?sign=1804211031-6d2ec28685-0-a2001ce035b1e234214d716bfe2fbba38984784350dfbbbc7986a4bed3f8a6e2',
      industry: '互联网',
      tags: ['产品总监', 'AI产品'],
    },
    publishDate: '2024年3月4日',
    views: 4156,
    likes: 298,
    shares: 143,
    createdAt: '2024-03-04T00:00:00Z',
  },
];
