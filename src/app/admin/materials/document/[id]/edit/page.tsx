'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

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

// 动态导入 React Quill，避免 SSR 问题
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="text-[13px] text-[rgba(0,0,0,0.6)]">加载编辑器...</div>,
});

export default function AdminDocumentEditPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');
  const [cover, setCover] = useState<string>('');
  const [content, setContent] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 模拟加载数据
  useEffect(() => {
    // 这里应该从API加载数据
    // 模拟数据
    setTitle('【新时代来了】用5条AI指令挽救一位创业者');
    setIcon('robot');
    setCover('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop');
    setContent('<p>在AI时代，传统创业者面临巨大挑战。本文将介绍5条实用的AI指令，帮助你重新定义业务模式，提高效率，实现转型升级。</p>');
  }, [documentId]);

  // 处理封面上传
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // 保存
  const handleSave = () => {
    if (!title) {
      alert('请输入文件名');
      return;
    }
    if (!icon) {
      alert('请选择图标');
      return;
    }
    if (!cover) {
      alert('请上传封面图片');
      return;
    }
    if (!content) {
      alert('请输入文档内容');
      return;
    }

    setIsUploading(true);

    // 模拟保存 - 这里应该调用API保存数据
    setTimeout(() => {
      setIsUploading(false);
      alert('文档更新成功！');
      router.push('/admin/materials');
    }, 1000);
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
              <h1 className="text-2xl font-bold text-gray-900">编辑文档</h1>
              <p className="text-gray-500 text-sm">修改认知库文档内容</p>
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
                  {/* 图片预览 */}
                  <div className="w-40 h-40 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {cover ? (
                      <img src={cover} alt="预览" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label htmlFor="cover-upload">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          更换封面
                        </span>
                      </Button>
                    </label>
                    <p className="mt-2 text-xs text-gray-500">
                      建议上传 800x400 像素的横向图片，支持 JPG、PNG 格式
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
              {mounted ? (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="在这里输入文档内容，支持复制粘贴飞书文档的格式..."
                  style={{ minHeight: '400px' }}
                />
              ) : (
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">加载编辑器...</div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              💡 提示：可以直接从飞书文档复制内容并粘贴到这里，格式会自动保留
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
