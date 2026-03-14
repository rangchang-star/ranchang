'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUpload, ImageDisplay } from '@/components/image-upload';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


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

export default function AdminDocumentCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');
  const [coverKey, setCoverKey] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 处理图片上传成功
  const handleImageUploadSuccess = async (fileKey: string) => {
    setCoverKey(fileKey);
    // 获取 CDN 地址
    try {
      const response = await fetch(`/api/image-url?key=${encodeURIComponent(fileKey)}`);
      const data = await response.json();
      if (data.success && data.url) {
        setCoverUrl(data.url);
      }
    } catch (error) {
      console.error('获取图片URL失败:', error);
    }
  };

  // 保存
  const handleSave = async () => {
    if (!title) {
      alert('请输入文件名');
      return;
    }
    if (!icon) {
      alert('请选择图标');
      return;
    }
    if (!coverKey) {
      alert('请上传封面图片');
      return;
    }
    if (!content) {
      alert('请输入文档内容');
      return;
    }

    setIsUploading(true);

    try {
      // 调用 API 保存数据
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          icon,
          coverImageKey: coverKey,
          coverImage: coverUrl,
          content,
          description: '',
          category: '认知库',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '保存失败');
      }

      alert('文档创建成功！');
      router.push('/admin/materials');
    } catch (error) {
      console.error('保存失败:', error);
      alert(`保存失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // React Quill 工具栏配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
      // 允许粘贴富文本格式（支持飞书格式）
      matchVisual: true,
    },
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin/materials">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">添加文档</h1>
              <p className="text-gray-500 text-sm">创建新的认知库文档</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isUploading}
            className="bg-blue-400 hover:bg-blue-500 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isUploading ? '保存中...' : '保存'}
          </Button>
        </div>

        {/* 表单内容 */}
        <div className="max-w-4xl space-y-6">
          {/* 基本信息 */}
          <div className="bg-white border border-gray-200 rounded-none p-6 space-y-6">
            {/* 文件名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文件名 <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：【新时代来了】用5条AI指令挽救一位创业者"
              />
            </div>

            {/* 图标选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文件图标 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setIcon(option.value)}
                    className={`p-3 border-2 transition-colors ${
                      icon === option.value
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={option.label}
                  >
                    <span className="text-xl">{option.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 封面图片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图片 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  {/* 图片上传 */}
                  <ImageUpload
                    currentImageKey={coverKey}
                    userId=""
                    onUploadSuccess={handleImageUploadSuccess}
                  />
                  <div className="flex-1">
                    <p className="mt-2 text-xs text-gray-500">
                      建议上传 800x400 像素的横向图片，支持 JPG、PNG、GIF、WebP 格式
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 富文本内容 */}
          <div className="bg-white border border-gray-200 rounded-none p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文档内容 <span className="text-red-500">*</span>
            </label>
            <div className="bg-gray-50 rounded-none">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在这里输入文档内容，支持复制粘贴飞书文档的格式..."
                className="w-full min-h-[400px] px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              💡 提示：纯文本输入，不支持富文本格式
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
