'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, FileCode, Copy, Check, Search, X, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  extension?: string;
}

interface FileContent {
  path: string;
  name: string;
  extension: string;
  language: string;
  content: string;
  size: number;
  lastModified: Date;
}

export default function CodeBrowserPage() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src']));
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>('');

  // 加载文件树
  useEffect(() => {
    loadFileTree('');
  }, []);

  // 加载文件内容
  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile);
    }
  }, [selectedFile]);

  const loadFileTree = async (path: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/code-browser/files?path=${path}`);
      const data = await response.json();

      if (data.success) {
        setFileTree(data.tree);
        setError('');
      } else {
        setError(data.error || '加载失败');
      }
    } catch (err) {
      console.error('加载文件树失败:', err);
      setError('加载文件树失败');
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (filePath: string) => {
    try {
      setContentLoading(true);
      const response = await fetch(`/api/code-browser/file?path=${filePath}`);
      const data = await response.json();

      if (data.success) {
        setFileContent(data);
        setError('');
      } else {
        setError(data.error || '加载失败');
        setFileContent(null);
      }
    } catch (err) {
      console.error('加载文件内容失败:', err);
      setError('加载文件内容失败');
      setFileContent(null);
    } finally {
      setContentLoading(false);
    }
  };

  const toggleDirectory = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleCopy = () => {
    if (fileContent?.content) {
      navigator.clipboard.writeText(fileContent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 过滤文件树
  const filterTree = (nodes: FileNode[]): FileNode[] => {
    if (!searchQuery) return nodes;

    return nodes
      .map(node => {
        if (node.type === 'directory' && node.children) {
          const filteredChildren = filterTree(node.children);
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
        } else if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return node;
        }
        return null;
      })
      .filter((node): node is FileNode => node !== null) as FileNode[];
  };

  // 渲染文件树节点
  const renderTreeNode = (node: FileNode, level: number = 0): JSX.Element | null => {
    const isExpanded = expandedDirs.has(node.path);
    const isSelected = selectedFile === node.path;
    const paddingLeft = level * 16 + 12;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center py-2 px-2 cursor-pointer hover:bg-slate-800/50 transition-colors ${
            isSelected ? 'bg-orange-500/10 border-r-2 border-orange-500' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (node.type === 'directory') {
              toggleDirectory(node.path);
            } else {
              setSelectedFile(node.path);
            }
          }}
        >
          {node.type === 'directory' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-2 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2 text-slate-400" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-blue-400" />
              )}
              <span className="text-sm text-slate-300">{node.name}</span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 mr-2" /> {/* 占位 */}
              <FileCode className="w-4 h-4 mr-2 text-slate-400" />
              <span className="text-sm text-slate-300">{node.name}</span>
            </>
          )}
        </div>
        {node.type === 'directory' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredTree = filterTree(fileTree);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 顶部导航 */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-orange-500" />
            <div>
              <h1 className="text-xl font-bold text-white">代码浏览器</h1>
              <p className="text-xs text-slate-400">燃场 App 项目代码</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="搜索文件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-4 h-[calc(100vh-180px)]">
          {/* 左侧文件树 */}
          <div className="w-80 flex-shrink-0 bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-white">文件树</h2>
            </div>
            <div className="p-2 overflow-y-auto h-[calc(100%-60px)]">
              {loading ? (
                <div className="text-center py-8 text-slate-400">加载中...</div>
              ) : filteredTree.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  {searchQuery ? '没有找到匹配的文件' : '没有文件'}
                </div>
              ) : (
                filteredTree.map(node => renderTreeNode(node))
              )}
            </div>
          </div>

          {/* 右侧代码显示 */}
          <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            {fileContent ? (
              <>
                {/* 文件头部 */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{fileContent.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {fileContent.path} · {(fileContent.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </>
                    )}
                  </Button>
                </div>

                {/* 代码内容 */}
                <div className="overflow-auto h-[calc(100%-80px)]">
                  {contentLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-slate-400">加载中...</div>
                    </div>
                  ) : (
                    <SyntaxHighlighter
                      language={fileContent.language}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        background: 'transparent',
                      }}
                      showLineNumbers
                      wrapLines
                    >
                      {fileContent.content}
                    </SyntaxHighlighter>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <FileCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">请选择文件查看代码</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
