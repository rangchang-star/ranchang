'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 模拟数据 - 参考图片中的文档列表
const mockDocuments = [
  {
    id: '1',
    type: 'document',
    title: '【新时代来了】用5条AI指令挽救一位创业者',
    icon: 'robot',
  },
  {
    id: '2',
    type: 'document',
    title: '【闭环思维】摆脱单点能力陷阱',
    icon: 'loop',
  },
  {
    id: '3',
    type: 'document',
    title: '【创业刺客】趋势与红利是两回事',
    icon: 'target',
  },
  {
    id: '4',
    type: 'document',
    title: '【"能力"过期了】给自己一次机会，20分钟找回特长',
    icon: 'refresh',
  },
  {
    id: '5',
    type: 'document',
    title: '【干就完了】错位竞争5连招',
    icon: 'zap',
  },
  {
    id: '6',
    type: 'document',
    title: '【商业工具箱】出去干仗必须有合手的兵器',
    icon: 'box',
  },
  {
    id: '7',
    type: 'document',
    title: '【摆摊老张的江湖生存课】短板、闭环、真功夫',
    icon: 'book',
  },
];

// 图标映射
const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'robot':
      return '🤖';
    case 'loop':
      return '🔄';
    case 'target':
      return '🎯';
    case 'refresh':
      return '♻️';
    case 'zap':
      return '⚡';
    case 'box':
      return '📦';
    case 'book':
      return '📚';
    case 'table':
      return '📋';
    case 'note':
      return '📝';
    default:
      return '📄';
  }
};

export default function DigitalAssetsPage() {
  const [documents] = useState(mockDocuments);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-[rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[13px] font-semibold text-[rgba(0,0,0,0.7)]">大鱼的认知库</h1>
            <Link href="/profile">
              <Button variant="ghost" className="p-2 h-9 w-9">
                <X className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 文档列表 */}
        <div className="px-5 py-4">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/asset/${doc.id}`}
              className="flex items-center space-x-3 py-4 border-b border-[rgba(0,0,0,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
            >
              {/* 图标 */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[rgba(0,0,0,0.05)] rounded-none">
                <span className="text-xl">{getIcon(doc.icon)}</span>
              </div>

              {/* 文档标题 */}
              <div className="flex-1">
                <h3 className="text-[13px] text-gray-900 leading-relaxed">
                  {doc.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[rgba(0,0,0,0.05)] rounded-none flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[rgba(0,0,0,0.25)]" />
            </div>
            <p className="text-[13px] text-[rgba(0,0,0,0.4)]">
              暂无文档
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
