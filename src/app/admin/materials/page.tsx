'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Search, Volume2, FileText, Image, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 图标选项
const iconOptions = [
  { value: 'robot', label: '🤖 机器人', icon: '🤖' },
  { value: 'loop', label: '🔄 循环', icon: '🔄' },
  { value: 'target', label: '🎯 目标', icon: '🎯' },
  { value: 'refresh', label: '♻️ 刷新', icon: '♻️' },
  { value: 'zap', label: '⚡ 闪电', icon: '⚡' },
  { value: 'box', label: '📦 盒子', icon: '📦' },
  { value: 'book', label: '📚 书籍', icon: '📚' },
  { value: 'table', label: '📋 表格', icon: '📋' },
  { value: 'note', label: '📝 笔记', icon: '📝' },
  { value: 'flame', label: '🔥 火焰', icon: '🔥' },
  { value: 'lightbulb', label: '💡 灯泡', icon: '💡' },
  { value: 'rocket', label: '🚀 火箭', icon: '🚀' },
];

export default function AdminMaterialsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'documents' | 'settings'>('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [libraryTitle, setLibraryTitle] = useState('大鱼的认知库');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 从 API 加载文档数据
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // 转换数据格式，添加必要的字段
          const iconMap: Record<string, string> = {
            pdf: '📚',
            docx: '📝',
            doc: '📝',
            xlsx: '📋',
            xls: '📋',
            pptx: '📊',
            ppt: '📊',
          };

          const formattedDocuments = data.data.map((doc: any) => ({
            ...doc,
            icon: iconMap[doc.fileType] || '📄',
            views: doc.downloadCount || 0,
            cover: doc.cover || '/default-document-cover.jpg',
          }));
          setDocuments(formattedDocuments);
        }
      }
    } catch (error) {
      console.error('加载文档失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 保存设置
  const handleSaveSettings = () => {
    // 这里应该调用API保存设置
    console.log('保存设置:', { libraryTitle, selectedIcon });
    alert('设置已保存');
  };

  // 删除文档
  const handleDeleteDocument = async (id: string) => {
    if (!confirm('确定要删除这个文档吗？')) return;
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('文档已删除');
          loadDocuments(); // 重新加载文档列表
        } else {
          alert(data.error || '删除失败');
        }
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除文档失败:', error);
      alert('删除失败');
    }
  };

  // 过滤文档
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">资料管理</h1>
          <p className="text-gray-500">管理每日现货资源和大鱼认知库内容</p>
        </div>

        {/* Tab 导航 */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('daily')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'daily'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              每日现货资源
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'documents'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              大鱼认知库
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              基础设置
            </button>
          </nav>
        </div>

        {/* 每日宣告管理 */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">管理每日资源现货内容</p>
                <p className="text-xs text-gray-500">包括添加、编辑、删除和发布每日资源现货</p>
              </div>
              <Link href="/admin/materials/daily/create">
                <Button className="bg-blue-400 hover:bg-blue-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  添加每日现货资源
                </Button>
              </Link>
            </div>

            {/* 快速访问 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/materials/daily">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">资源现货列表</h3>
                      <p className="text-xs text-gray-500">查看和管理所有每日资源现货</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/materials/daily/create">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">创建资源现货</h3>
                      <p className="text-xs text-gray-500">添加新的每日资源现货</p>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">使用说明</h3>
                    <p className="text-xs text-gray-500">支持图片和音频上传</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 示例数据展示 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">最近添加的资源现货</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=100&h=100&fit=crop"
                      alt="示例"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">重塑自我，迎接新挑战</h5>
                    <p className="text-xs text-gray-500">2024-03-01 · 3:15</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">已发布</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 大鱼认知库管理 */}
        {activeTab === 'documents' && (
          <div>
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索文档..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <Link href="/admin/materials/document/create">
                <Button className="bg-blue-400 hover:bg-blue-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  添加文档
                </Button>
              </Link>
            </div>

            {/* 文档列表 */}
            <div className="bg-white border border-gray-200 rounded-none">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">图标</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">标题</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">封面</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">浏览</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        暂无文档
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((document) => (
                      <tr key={document.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="text-2xl">{document.icon}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{document.title}</td>
                        <td className="py-3 px-4">
                          <img
                            src={document.cover}
                            alt="封面"
                            className="w-10 h-10 object-cover"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{document.views}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                            已发布
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Link href={`/admin/materials/document/${document.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 基础设置 */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white border border-gray-200 rounded-none p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">认知库基础设置</h2>
              
              {/* 认知库标题 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  认知库标题
                </label>
                <Input
                  value={libraryTitle}
                  onChange={(e) => setLibraryTitle(e.target.value)}
                  placeholder="例如：大鱼的认知库"
                  className="max-w-md"
                />
                <p className="mt-2 text-xs text-gray-500">
                  这个标题会显示在认知库页面的顶部
                </p>
              </div>

              {/* 默认图标 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  默认图标
                </label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedIcon(option.value)}
                      className={`p-3 border-2 transition-colors ${
                        selectedIcon === option.value
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  选择添加新文档时的默认图标
                </p>
              </div>

              <Button onClick={handleSaveSettings} className="bg-blue-400 hover:bg-blue-500 text-white">
                保存设置
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
