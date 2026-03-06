// 统一的模拟数据库
// 前后端共享此数据源，确保数据一致性

// 用户数据
export const mockUsers = [
  {
    id: 1,
    phone: '138****0001',
    password: '$2b$10$abc123...', // bcrypt 加密的密码
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
