import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 允许访问的目录
const ALLOWED_DIRS = [
  'src',
  'components',
  'lib',
  'app',
  'contexts',
  'hooks',
  'types',
];

// 允许读取的文件扩展名
const ALLOWED_EXTS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.html',
  '.css',
  '.scss',
  '.xml',
  '.yaml',
  '.yml',
  '.toml',
];

// 最大文件大小（100KB）
const MAX_FILE_SIZE = 100 * 1024;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: '缺少文件路径参数' },
        { status: 400 }
      );
    }

    // 获取工作区路径
    const workspacePath = process.env.COZE_WORKSPACE_PATH || '/workspace/projects';
    const fullPath = path.join(workspacePath, filePath);

    // 验证路径是否在工作区内
    const relativePath = path.relative(workspacePath, fullPath);
    if (relativePath.startsWith('..')) {
      return NextResponse.json(
        { error: '路径超出工作区范围' },
        { status: 403 }
      );
    }

    // 检查文件扩展名
    const ext = path.extname(filePath);
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: `不支持的文件类型: ${ext}` },
        { status: 400 }
      );
    }

    // 检查是否在允许的目录中
    const isAllowed = ALLOWED_DIRS.some(dir => relativePath.startsWith(dir));
    if (!isAllowed) {
      return NextResponse.json(
        { error: '路径不允许访问' },
        { status: 403 }
      );
    }

    // 检查文件是否存在
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }

    // 获取文件统计信息
    const stats = await fs.stat(fullPath);

    // 检查文件大小
    if (stats.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '文件过大，超过100KB限制' },
        { status: 413 }
      );
    }

    // 读取文件内容
    const content = await fs.readFile(fullPath, 'utf-8');

    // 检测文件类型
    const language = getLanguage(ext);

    return NextResponse.json({
      success: true,
      path: filePath,
      name: path.basename(filePath),
      extension: ext,
      language,
      content,
      size: stats.size,
      lastModified: stats.mtime,
    });
  } catch (error: any) {
    console.error('读取文件失败:', error);
    return NextResponse.json(
      { error: error.message || '读取文件失败' },
      { status: 500 }
    );
  }
}

// 根据扩展名获取语言类型
function getLanguage(ext: string): string {
  const languageMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.js': 'javascript',
    '.jsx': 'jsx',
    '.json': 'json',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.xml': 'xml',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.toml': 'toml',
  };

  return languageMap[ext] || 'text';
}
