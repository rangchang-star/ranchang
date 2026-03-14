/**
 * 通知辅助函数
 * 用于向用户发送各类通知
 */

import { db, notifications } from '@/lib/db';

export async function sendNotification({
  userId,
  type,
  title,
  content,
  relatedId, // 保留参数但不使用，因为 shared schema 中没有 relatedId 字段
}: {
  userId: string;
  type: 'system' | 'activity' | 'registration' | 'visit' | 'approval';
  title: string;
  content: string;
  relatedId?: string;
}) {
  try {
    await db.insert(notifications).values({
      userId,
      type,
      title,
      content: content, // 数据库字段是 content
      isRead: false,
      // 不设置 createdAt，使用数据库的 defaultNow()
      // 不设置 id，使用数据库的 gen_random_uuid()
      // 不设置 relatedId，因为 shared schema 中没有这个字段
    });
    
    return { success: true };
  } catch (error) {
    console.error('发送通知失败:', error);
    return { success: false, error: '发送通知失败' };
  }
}

export async function sendNotificationToUsers({
  userIds,
  type,
  title,
  content,
  relatedId, // 保留参数但不使用，因为 shared schema 中没有 relatedId 字段
}: {
  userIds: string[];
  type: 'system' | 'activity' | 'registration' | 'visit' | 'approval';
  title: string;
  content: string;
  relatedId?: string;
}) {
  try {
    const notificationRecords = userIds.map((userId) => ({
      userId,
      type,
      title,
      content: content, // 数据库字段是 content
      isRead: false,
      // 不设置 createdAt，使用数据库的 defaultNow()
      // 不设置 id，使用数据库的 gen_random_uuid()
      // 不设置 relatedId，因为 shared schema 中没有这个字段
    }));

    await db.insert(notifications).values(notificationRecords);
    
    return { success: true, count: userIds.length };
  } catch (error) {
    console.error('批量发送通知失败:', error);
    return { success: false, error: '批量发送通知失败' };
  }
}
