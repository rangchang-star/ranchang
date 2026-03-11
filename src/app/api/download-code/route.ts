import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // 获取最新的代码包
    const packageDir = '/tmp/code-packages';
    const files = await fs.readdir(packageDir);
    const tarFiles = files.filter(f => f.endsWith('.tar.gz'));

    if (tarFiles.length === 0) {
      return NextResponse.json(
        { error: '没有找到代码包' },
        { status: 404 }
      );
    }

    // 获取最新的文件（按文件名排序，时间戳在文件名中）
    tarFiles.sort().reverse();
    const latestFile = tarFiles[0];
    const filePath = path.join(packageDir, latestFile);

    // 读取文件
    const fileBuffer = await fs.readFile(filePath);
    const fileStats = await fs.stat(filePath);

    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', 'application/gzip');
    headers.set('Content-Disposition', `attachment; filename="${latestFile}"`);
    headers.set('Content-Length', fileStats.size.toString());

    // 返回文件
    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('下载代码包失败:', error);
    return NextResponse.json(
      { error: error.message || '下载失败' },
      { status: 500 }
    );
  }
}
