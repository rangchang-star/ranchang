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

// POST - 图片上传
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '未选择文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: '只支持图片文件' },
        { status: 400 }
      );
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: '图片大小不能超过5MB' },
        { status: 400 }
      );
    }

    // 转换文件为Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成文件名（使用原始文件名）
    const fileName = file.name;

    // 上传到对象存储
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: `images/${fileName}`,
      contentType: file.type,
    });

    // 返回fileKey
    return NextResponse.json({
      success: true,
      data: {
        fileKey: fileKey,
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    return NextResponse.json(
      { success: false, error: '图片上传失败' },
      { status: 500 }
    );
  }
}
