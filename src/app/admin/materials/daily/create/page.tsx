'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDailyDeclarationCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('3:00');
  const [image, setImage] = useState<string>('');
  const [audio, setAudio] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理录音上传
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudio(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 保存
  const handleSave = async () => {
    if (!title) {
      alert('请输入标题');
      return;
    }
    if (!image) {
      alert('请上传图片');
      return;
    }
    if (!audio) {
      alert('请上传录音');
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch('/api/daily-declarations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          date,
          duration,
          image,
          audio,
          isActive: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('每日现货资源创建成功！');
        router.push('/admin/materials/daily');
      } else {
        alert(data.error || '创建失败');
      }
    } catch (error) {
      console.error('创建失败:', error);
      alert('创建失败，请重试');
    } finally {
      setIsUploading(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">添加每日现货资源</h1>
              <p className="text-gray-500 text-sm">创建新的每日现货资源</p>
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
        <div className="max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-none p-6 space-y-6">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                资源现货标题 <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：重塑自我，迎接新挑战"
              />
            </div>

            {/* 日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日期 <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* 录音时长 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                录音时长 <span className="text-red-500">*</span>
              </label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="例如：3:15"
              />
              <p className="mt-1 text-xs text-gray-500">格式：分:秒，例如 3:15</p>
            </div>

            {/* 方形图片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                方形图片 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  {/* 图片预览 */}
                  <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {image ? (
                      <img src={image} alt="预览" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          上传图片
                        </span>
                      </Button>
                    </label>
                    <p className="mt-2 text-xs text-gray-500">
                      建议上传正方形图片，尺寸 200x200 像素，支持 JPG、PNG 格式
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 录音上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                录音文件 <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {audio && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <audio controls className="flex-1 h-8">
                      <source src={audio} type="audio/mpeg" />
                      您的浏览器不支持音频播放
                    </audio>
                  </div>
                )}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {audio ? '更换录音' : '上传录音'}
                    </span>
                  </Button>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  支持 MP3、WAV 等音频格式，建议文件大小不超过 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
