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
  relatedId,
}: {
  userId: string;
  type: 'system' | 'activity' | 'registration' | 'visit' | 'approval';
  title: string;
  content: string;
  relatedId?: string;
}) {
  try {
    await db.insert(notifications).values({
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      content,
      relatedId,
      isRead: false,
      createdAt: new Date(),
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
  relatedId,
}: {
  userIds: string[];
  type: 'system' | 'activity' | 'registration' | 'visit' | 'approval';
  title: string;
  content: string;
  relatedId?: string;
}) {
  try {
    const notificationRecords = userIds.map((userId) => ({
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      content,
      relatedId,
      isRead: false,
      createdAt: new Date(),
    }));

    await db.insert(notifications).values(notificationRecords);
    
    return { success: true, count: userIds.length };
  } catch (error) {
    console.error('批量发送通知失败:', error);
    return { success: false, error: '批量发送通知失败' };
  }
}
