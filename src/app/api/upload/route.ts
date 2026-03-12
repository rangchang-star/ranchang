import { NextRequest, NextResponse } from 'next/server';

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

    // 转换文件为base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // 生成唯一的fileKey
    const fileKey = `images/${Date.now()}-${file.name}`;

    // 注意：这里只是示例，实际应该上传到对象存储服务
    // 由于项目限制，这里返回一个模拟的永久CDN地址
    const cdnUrl = `https://ranchang-cdn.example.com/${fileKey}`;

    // 保存到本地临时目录（仅用于演示）
    // 在实际项目中，应该上传到对象存储服务
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, fileKey.replace('images/', ''));
    fs.writeFileSync(filePath, buffer);

    // 返回永久CDN地址
    return NextResponse.json({
      success: true,
      data: {
        fileKey: fileKey,
        url: cdnUrl,
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
