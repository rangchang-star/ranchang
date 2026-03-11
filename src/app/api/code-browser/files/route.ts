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

// 忽略的文件和目录
const IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.cache',
  'coverage',
  '*.log',
  '*.md',
  '.env',
  '.DS_Store',
];

// 忽略的文件扩展名
const IGNORE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  extension?: string;
}

// 检查是否应该忽略
function shouldIgnore(name: string, type: string): boolean {
  // 检查扩展名
  const ext = path.extname(name);
  if (type === 'file' && IGNORE_EXTS.includes(ext)) {
    return true;
  }

  // 检查匹配模式
  return IGNORE_PATTERNS.some(pattern => {
    if (pattern.startsWith('*')) {
      return name.endsWith(pattern.slice(1));
    }
    return name === pattern;
  });
}

// 递归构建文件树
async function buildFileTree(
  dirPath: string,
  basePath: string = ''
): Promise<FileNode[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      if (shouldIgnore(entry.name, entry.isDirectory() ? 'directory' : 'file')) {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        // 递归处理目录
        const children = await buildFileTree(fullPath, relativePath);
        if (children.length > 0) {
          nodes.push({
            name: entry.name,
            path: relativePath,
            type: 'directory',
            children,
          });
        }
      } else {
        // 处理文件
        const ext = path.extname(entry.name);
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: 'file',
          extension: ext,
        });
      }
    }

    // 排序：目录在前，文件在后
    return nodes.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });
  } catch (error) {
    console.error('构建文件树失败:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const basePath = searchParams.get('path') || '';

    // 确定扫描的根目录
    const workspacePath = process.env.COZE_WORKSPACE_PATH || '/workspace/projects';
    const scanPath = basePath ? path.join(workspacePath, basePath) : workspacePath;

    // 验证路径是否在允许的目录内
    const relativePath = path.relative(workspacePath, scanPath);
    if (!ALLOWED_DIRS.includes(relativePath) && relativePath !== '') {
      return NextResponse.json(
        { error: '路径不允许访问' },
        { status: 403 }
      );
    }

    // 构建文件树
    const fileTree = await buildFileTree(scanPath, relativePath);

    return NextResponse.json({
      success: true,
      tree: fileTree,
      currentPath: relativePath,
    });
  } catch (error: any) {
    console.error('获取文件列表失败:', error);
    return NextResponse.json(
      { error: error.message || '获取文件列表失败' },
      { status: 500 }
    );
  }
}
