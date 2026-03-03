'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 模拟数据 - 参考图片中的文档列表
const mockDocuments = [
  {
    id: '1',
    type: 'document',
    title: '【新时代来了】用5条AI指令挽救一位创业者',
    icon: 'robot',
    description: '在AI时代，传统创业者面临巨大挑战。本文将介绍5条实用的AI指令，帮助你重新定义业务模式，提高效率，实现转型升级。',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    date: '2025-01-15',
    views: 1234,
  },
  {
    id: '2',
    type: 'document',
    title: '【闭环思维】摆脱单点能力陷阱',
    icon: 'loop',
    description: '很多创业者陷入单点能力的陷阱，只擅长某一方面而忽视了整体。闭环思维帮助你构建完整的商业闭环，实现可持续发展。',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    date: '2025-02-01',
    views: 856,
  },
  {
    id: '3',
    type: 'document',
    title: '【创业刺客】趋势与红利是两回事',
    icon: 'target',
    description: '不要被表面的趋势迷惑。真正的红利往往隐藏在趋势背后。本文教你如何辨别趋势与真正的商业机会。',
    cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
    date: '2025-02-10',
    views: 2156,
  },
  {
    id: '4',
    type: 'document',
    title: '【"能力"过期了】给自己一次机会，20分钟找回特长',
    icon: 'refresh',
    description: '时代在变，曾经的特长可能不再适用。但每个人都有独特的潜力。本文带你找回你的核心竞争力。',
    cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
    date: '2025-02-20',
    views: 943,
  },
  {
    id: '5',
    type: 'document',
    title: '【干就完了】错位竞争5连招',
    icon: 'zap',
    description: '在红海中如何脱颖而出？错位竞争是关键。本文分享5个实用的错位竞争策略，助你找到蓝海市场。',
    cover: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    date: '2025-03-01',
    views: 1678,
  },
  {
    id: '6',
    type: 'document',
    title: '【商业工具箱】出去干仗必须有合手的兵器',
    icon: 'box',
    description: '工欲善其事，必先利其器。本文整理了创业者必备的实用工具和资源，让你的工作效率倍增。',
    cover: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
    date: '2025-03-10',
    views: 1256,
  },
  {
    id: '7',
    type: 'document',
    title: '【摆摊老张的江湖生存课】短板、闭环、真功夫',
    icon: 'book',
    description: '一个普通摆摊老张的生存智慧，揭示了商业的本质：认识短板、构建闭环、练就真功夫。',
    cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
    date: '2025-03-15',
    views: 2345,
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
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDocClick = (doc: typeof mockDocuments[0]) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedDoc?.title,
        text: selectedDoc?.description?.substring(0, 100),
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-[10px] border-b border-[rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" className="p-1.5">
                <ArrowLeft className="w-4 h-4 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[13px] font-semibold text-[rgba(0,0,0,0.7)]">大鱼的认知库</h1>
            <Link href="/profile">
              <Button variant="ghost" className="p-1.5 h-[26px] w-[26px]">
                <X className="w-4 h-4 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 文档列表 */}
        <div className="px-4 py-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocClick(doc)}
              className="flex items-center space-x-[8px] py-[11px] border-b border-[rgba(0,0,0,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer"
            >
              {/* 图标 */}
              <div className="flex-shrink-0 w-[28px] h-[28px] flex items-center justify-center bg-[rgba(0,0,0,0.05)] rounded-none">
                <span className="text-[14px]">{getIcon(doc.icon)}</span>
              </div>

              {/* 文档标题 */}
              <div className="flex-1">
                <h3 className="text-[9px] text-gray-900 leading-relaxed">
                  {doc.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-[42px] h-[42px] bg-[rgba(0,0,0,0.05)] rounded-none flex items-center justify-center mx-auto mb-4">
              <FileText className="w-[18px] h-[18px] text-[rgba(0,0,0,0.25)]" />
            </div>
            <p className="text-[9px] text-[rgba(0,0,0,0.4)]">
              暂无文档
            </p>
          </div>
        )}
      </div>

      {/* 详情模态框 */}
      {isModalOpen && selectedDoc && (
        <div
          className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 遮罩层 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          />

          {/* 内容容器 */}
          <div
            className={`relative w-full max-w-md bg-white max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl transition-transform duration-300 ${
              isModalOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {/* 顶部导航 */}
            <div className="sticky top-0 bg-white z-10 px-5 py-[10px] border-b border-[rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="p-1.5"
                  onClick={() => setIsModalOpen(false)}
                >
                  <ArrowLeft className="w-4 h-4 text-[rgba(0,0,0,0.6)]" />
                </Button>
                <h1 className="text-[13px] font-semibold text-[rgba(0,0,0,0.7)]">文档详情</h1>
                <Button variant="ghost" onClick={handleShare} className="p-1.5">
                  <Share2 className="w-4 h-4 text-[rgba(0,0,0,0.6)]" />
                </Button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="overflow-y-auto max-h-[calc(90vh-50px)]">
              {/* 封面图 */}
              {selectedDoc.cover && (
                <div className="w-full h-56 overflow-hidden">
                  <img
                    src={selectedDoc.cover}
                    alt={selectedDoc.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="px-5 py-4 space-y-4">
                {/* 标题 */}
                <div>
                  <h2 className="text-[15px] font-bold text-gray-900 mb-2">
                    {selectedDoc.title}
                  </h2>
                  <div className="flex items-center space-x-3 text-[11px] text-[rgba(0,0,0,0.4)]">
                    <span>{selectedDoc.date}</span>
                    <span>•</span>
                    <span>{selectedDoc.views} 浏览</span>
                  </div>
                </div>

                {/* 描述 */}
                <div className="py-4">
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-2">文档简介</h3>
                  <p className="text-[12px] text-[rgba(0,0,0,0.6)] leading-relaxed">
                    {selectedDoc.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
