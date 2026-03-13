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
    const { id } = await params;

    // 从数据库获取活动信息
    const activityList = await db
      .select()
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1);

    if (!activityList || activityList.length === 0) {
      return NextResponse.json(
        { success: false, error: '活动不存在' },
        { status: 404 }
      );
    }

    const activity = activityList[0];

    // 检查是否有封面图 key
    if (!activity.coverImageKey) {
      return NextResponse.json(
        { success: false, error: '活动没有封面图' },
        { status: 404 }
      );
    }

    // 生成签名 URL
    const signedUrl = await storage.generatePresignedUrl({
      key: activity.coverImageKey,
      expireTime: 86400, // 1天有效期
    });

    // 直接重定向到签名 URL
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('获取活动封面图失败:', error);
    return NextResponse.json(
      { success: false, error: '获取封面图失败' },
      { status: 500 }
    );
  }
}
