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

// 允许的文件类型
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
// 最大文件大小 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '请选择要上传的文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '只支持 JPEG、PNG、GIF、WebP 格式的图片' },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: '图片大小不能超过 5MB' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成文件名：avatars/用户ID_UUID.扩展名
    const userId = formData.get('userId') as string;
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `avatars/${userId}_${Date.now()}.${ext}`;

    // 上传文件到对象存储
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: fileName,
      contentType: file.type,
    });

    // 不再生成临时签名URL，只返回fileKey
    // fileKey 是永久有效的标识符，可用于后续生成访问URL
    // 如需获取访问URL，请调用 /api/storage/get-url?fileKey=xxx

    return NextResponse.json({
      success: true,
      data: {
        fileKey,
        message: '文件上传成功，fileKey已返回，请使用 /api/storage/get-url 获取访问URL',
      },
    });
  } catch (error: any) {
    console.error('头像上传失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '头像上传失败' },
      { status: 500 }
    );
  }
}
