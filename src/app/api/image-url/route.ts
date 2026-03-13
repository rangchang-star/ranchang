import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';

// 初始化存储客户端
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: '',
  secretKey: '',
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

// GET - 生成签名URL
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: '缺少文件key' },
        { status: 400 }
      );
    }

    // 生成签名URL
    const signedUrl = await storage.generatePresignedUrl({
      key: key,
      expireTime: 86400, // 1天有效期
    });

    return NextResponse.json({
      success: true,
      url: signedUrl,
    });
  } catch (error) {
    console.error('生成签名URL失败:', error);
    return NextResponse.json(
      { success: false, error: '生成签名URL失败' },
      { status: 500 }
    );
  }
}
