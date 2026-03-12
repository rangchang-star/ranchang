import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';

// 初始化对象存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: '',
  secretKey: '',
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

/**
 * 获取文件访问URL
 *
 * 此API根据fileKey生成临时签名URL，用于前端访问存储的文件。
 * URL有效期：1小时（3600秒）
 *
 * 请求参数：
 * - fileKey: 文件在存储中的key（必填）
 *
 * 返回：
 * - success: 是否成功
 * - data.url: 签名URL
 * - data.expiresAt: URL过期时间（ISO时间戳）
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileKey = searchParams.get('fileKey');

    // 验证参数
    if (!fileKey) {
      return NextResponse.json(
        { success: false, error: '缺少 fileKey 参数' },
        { status: 400 }
      );
    }

    // 生成签名URL，有效期1小时
    const signedUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 3600, // 1小时
    });

    // 计算过期时间
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      data: {
        url: signedUrl,
        expiresAt,
        fileKey,
      },
    });
  } catch (error: any) {
    console.error('获取文件URL失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取文件URL失败' },
      { status: 500 }
    );
  }
}
