/**
 * Supabase 数据库使用示例
 * 
 * 本文件展示如何在项目中使用 Supabase 数据库
 */

import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取数据库客户端
const client = getSupabaseClient();

// ============================================
// 1. 用户表 (users) 操作示例
// ============================================

// 查询所有用户
export async function getAllUsers() {
  const { data, error } = await client
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('查询用户失败:', error.message);
    return [];
  }
  return data;
}

// 根据 ID 查询单个用户
export async function getUserById(userId: string) {
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('查询用户失败:', error.message);
    return null;
  }
  return data;
}

// 创建新用户
export async function createUser(userData: {
  name: string;
  age?: number;
  phone?: string;
  email?: string;
  connection_type?: string;
  industry?: string;
  need?: string;
}) {
  const { data, error } = await client
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) {
    console.error('创建用户失败:', error.message);
    return null;
  }
  return data;
}

// 更新用户信息
export async function updateUser(userId: string, userData: Partial<{
  name: string;
  age: number;
  avatar: string;
  phone: string;
  email: string;
  connection_type: string;
  industry: string;
  need: string;
  ability_tags: string[];
  resource_tags: string[];
}>) {
  const { data, error } = await client
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('更新用户失败:', error.message);
    return null;
  }
  return data;
}

// 搜索用户（模糊匹配）
export async function searchUsers(keyword: string) {
  const { data, error } = await client
    .from('users')
    .select('*')
    .ilike('name', `%${keyword}%`);

  if (error) {
    console.error('搜索用户失败:', error.message);
    return [];
  }
  return data;
}

// ============================================
// 2. 活动表 (activities) 操作示例
// ============================================

// 获取所有活动
export async function getAllActivities() {
  const { data, error } = await client
    .from('activities')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false });

  if (error) {
    console.error('查询活动失败:', error.message);
    return [];
  }
  return data;
}

// 获取活动详情
export async function getActivityById(activityId: string) {
  const { data, error } = await client
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single();

  if (error) {
    console.error('查询活动失败:', error.message);
    return null;
  }
  return data;
}

// 报名参加活动
export async function registerActivity(activityId: string, userId: string) {
  const { data, error } = await client
    .from('activity_registrations')
    .insert({
      activity_id: activityId,
      user_id: userId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('报名失败:', error.message);
    return null;
  }

  // 更新活动报名人数
  await client.rpc('increment_activity_registration', {
    p_activity_id: activityId,
  });

  return data;
}

// ============================================
// 3. 探访表 (visits) 操作示例
// ============================================

// 获取所有探访
export async function getAllVisits() {
  const { data, error } = await client
    .from('visits')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false });

  if (error) {
    console.error('查询探访失败:', error.message);
    return [];
  }
  return data;
}

// 参加探访
export async function registerVisit(visitId: string, userId: string) {
  const { data, error } = await client
    .from('visit_records')
    .insert({
      visit_id: visitId,
      user_id: userId,
      status: 'registered',
    })
    .select()
    .single();

  if (error) {
    console.error('报名探访失败:', error.message);
    return null;
  }

  // 更新探访报名人数
  await client.rpc('increment_visit_registration', {
    p_visit_id: visitId,
  });

  return data;
}

// ============================================
// 4. 量表评估表 (assessments) 操作示例
// ============================================

// 保存量表评估结果
export async function saveAssessment(userId: string, assessmentData: {
  name: string;
  score: number;
  level: string;
  summary: string;
  dimensions: Array<{
    name: string;
    score: number;
    description: string;
  }>;
}) {
  const { data, error } = await client
    .from('assessments')
    .insert({
      user_id: userId,
      ...assessmentData,
    })
    .select()
    .single();

  if (error) {
    console.error('保存评估结果失败:', error.message);
    return null;
  }
  return data;
}

// 获取用户的所有评估结果
export async function getUserAssessments(userId: string) {
  const { data, error } = await client
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('test_date', { ascending: false });

  if (error) {
    console.error('查询评估结果失败:', error.message);
    return [];
  }
  return data;
}

// ============================================
// 5. 高燃宣告表 (declarations) 操作示例
// ============================================

// 创建高燃宣告
export async function createDeclaration(userId: string, declarationData: {
  direction: string;
  text: string;
  summary: string;
  audio_url?: string;
}) {
  const { data, error } = await client
    .from('declarations')
    .insert({
      user_id: userId,
      ...declarationData,
    })
    .select()
    .single();

  if (error) {
    console.error('创建宣告失败:', error.message);
    return null;
  }
  return data;
}

// 获取用户的所有宣告
export async function getUserDeclarations(userId: string) {
  const { data, error } = await client
    .from('declarations')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('查询宣告失败:', error.message);
    return [];
  }
  return data;
}

// 增加宣告查看次数
export async function incrementDeclarationViews(declarationId: string) {
  const { data, error } = await client.rpc('increment_declaration_views', {
    p_declaration_id: declarationId,
  });

  if (error) {
    console.error('增加查看次数失败:', error.message);
  }
  return data;
}

// ============================================
// 6. 通知表 (notifications) 操作示例
// ============================================

// 创建通知
export async function createNotification(userId: string, notificationData: {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action_url?: string;
}) {
  const { data, error } = await client
    .from('notifications')
    .insert({
      user_id: userId,
      ...notificationData,
    })
    .select()
    .single();

  if (error) {
    console.error('创建通知失败:', error.message);
    return null;
  }
  return data;
}

// 获取用户未读通知
export async function getUnreadNotifications(userId: string) {
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('查询通知失败:', error.message);
    return [];
  }
  return data;
}

// 标记通知为已读
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await client
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('标记通知失败:', error.message);
    return false;
  }
  return true;
}

// 标记所有通知为已读
export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await client
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('标记所有通知失败:', error.message);
    return false;
  }
  return true;
}

// ============================================
// 7. 在 React 组件中使用示例
// ============================================

/**
 * 在组件中使用数据库的示例
 */
export function DatabaseUsageExample() {
  // 查询用户信息
  const loadUserInfo = async (userId: string) => {
    const user = await getUserById(userId);
    if (user) {
      console.log('用户信息:', user);
    }
  };

  // 创建新用户
  const handleCreateUser = async () => {
    const newUser = await createUser({
      name: '张三',
      age: 45,
      phone: '13800138000',
      email: 'zhangsan@example.com',
      connection_type: 'personLookingJob',
      industry: '企业服务',
      need: '希望找到传统制造业的数字化转型项目机会',
    });
    if (newUser) {
      console.log('用户创建成功:', newUser);
    }
  };

  // 更新用户信息
  const handleUpdateUser = async (userId: string) => {
    const updatedUser = await updateUser(userId, {
      name: '李四',
      ability_tags: ['技术落地', '业务咨询', '培训授课'],
      resource_tags: ['人才', '技术', '品牌'],
    });
    if (updatedUser) {
      console.log('用户更新成功:', updatedUser);
    }
  };

  return null;
}
