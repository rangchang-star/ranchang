import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';

// 初始化对象存储客户端
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: '',
  secretKey: '',
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string; // 'cover', 'audio', 'photo'

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes: Record<string, string[]> = {
      cover: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
      photo: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    };

    const validTypes = allowedTypes[fileType] || [];
    if (validTypes.length > 0 && !validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `不支持的文件类型: ${file.type}` },
        { status: 400 }
      );
    }

    // 验证文件大小 (限制 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小超过限制 (最大 50MB)' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 生成文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `visits/${fileType}/${timestamp}_${randomStr}.${fileExtension}`;

    // 上传文件
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: fileName,
      contentType: file.type,
    });

    // 生成签名 URL
    const signedUrl = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400 * 30, // 30天有效期
    });

    return NextResponse.json({
      success: true,
      data: {
        key: fileKey,
        url: signedUrl,
        fileName: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error: any) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { error: error.message || '文件上传失败' },
      { status: 500 }
    );
  }
}
