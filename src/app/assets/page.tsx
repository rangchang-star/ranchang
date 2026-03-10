'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  type: string;
  title: string;
  icon?: string;
  description: string;
  cover: string;
  date: string;
  views: number;
}

export default function DigitalAssetsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadDocuments() {
      try {
        // TODO: 创建 /api/documents 接口
        const response = await fetch('/api/documents');
        const data = await response.json();

        if (data.success) {
          setDocuments(data.data);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const handleDocClick = (doc: Document) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share && selectedDoc) {
      navigator.share({
        title: selectedDoc.title,
        text: selectedDoc.description,
        url: window.location.href,
      });
    }
  };

  const getIcon = (iconType?: string) => {
    if (!iconType) return '📄';
    const iconMap: Record<string, string> = {
      robot: '🤖',
      loop: '🔄',
      target: '🎯',
      refresh: '♻️',
      zap: '⚡',
      box: '📦',
      book: '📚',
      table: '📋',
      note: '📝',
    };
    return iconMap[iconType] || '📄';
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/discovery">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">数字资产</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* 文档列表 */}
        <div className="px-5 py-6">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              加载中...
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无文档
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocClick(doc)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-2">
                    {doc.cover ? (
                      <img
                        src={doc.cover}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">
                        {getIcon(doc.icon)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    {doc.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{doc.date}</span>
                    <span>{doc.views || 0}浏览</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 文档详情弹窗 */}
        {isModalOpen && selectedDoc && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">文档详情</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4">
                {selectedDoc.cover && (
                  <img
                    src={selectedDoc.cover}
                    alt={selectedDoc.title}
                    className="w-full aspect-video object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedDoc.title}
                </h3>

                <p className="text-sm text-gray-700 mb-4">
                  {selectedDoc.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                  <span>{selectedDoc.date}</span>
                  <span>{selectedDoc.views} 浏览</span>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    查看文档
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
