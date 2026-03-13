import { NextRequest, NextResponse } from 'next/server';
import { db, activities } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { S3Storage } from 'coze-coding-dev-sdk';

// 初始化存储客户端
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: '',
  secretKey: '',
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

// 获取活动封面图片
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.error('=== 图片 API 开始 ===');
    const { id } = await params;
    console.error('活动 ID:', id);

    // 从数据库获取活动信息
    const activityList = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1);

    if (!activityList || activityList.length === 0) {
      console.error('活动不存在');
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    const activity = activityList[0];
    console.error('活动存在，coverImageKey:', activity.coverImageKey);

    // 检查是否有封面图 key
    if (!activity.coverImageKey) {
      console.error('活动没有封面图');
      return NextResponse.json(
        { success: false, error: '活动没有封面图' },
        { status: 404 }
      );
    }

    console.error('准备获取图片签名 URL，coverImageKey:', activity.coverImageKey);

    // 生成签名 URL
    const signedUrl = await storage.generatePresignedUrl({
      key: activity.coverImageKey,
      expireTime: 86400, // 1天有效期
    });

    console.error('签名 URL:', signedUrl);

    // 直接重定向到签名 URL
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('获取活动封面图失败:', error);
    console.error('错误堆栈:', (error as any).stack);
    return NextResponse.json(
      { success: false, error: '获取封面图失败' },
      { status: 500 }
    );
  }
}
