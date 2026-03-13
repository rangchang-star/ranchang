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

// 获取文件签名URL（通过查询参数）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Missing key parameter' },
        { status: 400 }
      );
    }

    console.log('=== File API called (query param) ===');
    console.log('Raw key:', key);

    // 解码 URL 编码的 key
    const decodedKey = decodeURIComponent(key);
    console.log('Decoded key:', decodedKey);

    // 生成签名URL
    const signedUrl = await storage.generatePresignedUrl({
      key: decodedKey,
      expireTime: 86400, // 1天有效期
    });

    console.log('Generated signed URL length:', signedUrl.length);

    // 重定向到签名URL
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error('=== File API Error ===');
    console.error('Error:', error);
    console.error('Error message:', String(error));
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
