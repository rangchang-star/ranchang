'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Calendar, MapPin, Users, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import 'react-quill/dist/quill.snow.css';

// 动态导入 React Quill，避免 SSR 问题
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="text-[13px] text-[rgba(0,0,0,0.6)]">加载编辑器...</div>
});

// 活动类型选项
const activityTypeOptions = [
  { id: 'private', label: '私董会', description: '小规模深度交流', icon: '🎯' },
  { id: 'salon', label: '沙龙', description: '主题分享与交流', icon: '💡' },
  { id: 'ai', label: 'AI实战', description: 'AI技术实践工作坊', icon: '🤖' },
];

// 可用标签
const availableTags = ['私董会', '名额紧张', '跨界', 'AI', 'AI实战', '工作坊', '已结束'];

// 获取活动类型标签
const getActivityTypeLabel = (type: string) => {
  const option = activityTypeOptions.find(opt => opt.id === type);
  return option ? option.label : type;
};

// React Quill 工具栏配置
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'clean'],
  ],
};

export default function AdminActivityCreatePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('private');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    if (!title || !date || !startTime || !endTime || !location || !maxParticipants) {
      alert('请填写所有必填字段');
      return;
    }

    console.log('保存活动:', {
      title,
      date,
      startTime,
      endTime,
      location,
      type,
      maxParticipants: parseInt(maxParticipants),
      tags: selectedTags,
      description,
      imageUrl,
    });

    alert('活动已创建');
    router.push('/admin/activities');
  };

  // 计算当前已报名人数（默认为0）
  const enrolled = 0;

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/activities">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">创建新活动</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">填写活动信息并实时预览效果</p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            保存并发布
          </Button>
        </div>

        {/* 两栏布局：左侧编辑表单，右侧预览 */}
        <div className="flex gap-6">
          {/* 左侧：编辑表单 */}
          <div className="flex-1 max-w-[600px] space-y-5">
            {/* 基本信息 */}
            <div className="border border-[rgba(0,0,0,0.1)]">
              <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <h3 className="text-[13px] font-semibold text-gray-900">基本信息</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    活动标题 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="请输入活动标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-[13px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-2">
                      活动日期 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-2">
                      时间段 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="text-[13px] flex-1"
                      />
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">至</span>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="text-[13px] flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    活动地点 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="例如：上海·静安"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    封面图片URL
                  </label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-[13px]"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.5)] mt-1">留空将使用默认图片</p>
                </div>
              </div>
            </div>

            {/* 活动类型 */}
            <div className="border border-[rgba(0,0,0,0.1)]">
              <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <h3 className="text-[13px] font-semibold text-gray-900">活动类型</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  {activityTypeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setType(option.id)}
                      className={cn(
                        'p-3 text-left border transition-colors',
                        type === option.id
                          ? 'bg-[rgba(59,130,246,0.4)] border-blue-400'
                          : 'border-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.02)]'
                      )}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                        {option.label}
                      </div>
                      <div className="text-[11px] text-[rgba(0,0,0,0.6)]">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 人数和标签 */}
            <div className="border border-[rgba(0,0,0,0.1)]">
              <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <h3 className="text-[13px] font-semibold text-gray-900">人数和标签</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    最大参与人数 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="例如：30"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    活动标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          'px-3 py-1.5 text-[13px] border transition-colors',
                          selectedTags.includes(tag)
                            ? 'bg-blue-400 text-white border-blue-400'
                            : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)]'
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 活动描述 */}
            <div className="border border-[rgba(0,0,0,0.1)]">
              <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <h3 className="text-[13px] font-semibold text-gray-900">活动描述</h3>
              </div>
              <div className="p-4">
                {mounted ? (
                  <div className="quill-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                      placeholder="请输入活动描述..."
                      modules={quillModules}
                    />
                  </div>
                ) : (
                  <div className="text-[13px] text-[rgba(0,0,0,0.6)]">加载编辑器...</div>
                )}
              </div>
            </div>

            {/* 取消按钮 */}
            <div>
              <Link href="/admin/activities">
                <Button variant="outline">
                  取消
                </Button>
              </Link>
            </div>
          </div>

          {/* 右侧：预览卡片 */}
          <div className="w-[380px] flex-shrink-0">
            <div className="sticky top-20">
              <div className="text-[13px] font-semibold text-gray-900 mb-3">活动卡片预览</div>
              
              {/* 预览卡片 */}
              <div className="border border-[rgba(0,0,0,0.1)] overflow-hidden bg-white">
                {/* 封面图 */}
                <div className="h-44 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={title || '活动封面'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <div className="text-[13px] text-[rgba(0,0,0,0.5)]">活动封面</div>
                    </div>
                  )}
                </div>

                {/* 卡片内容 */}
                <div className="p-4">
                  {/* 类型标签 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-[rgba(59,130,246,0.1)] text-blue-600 text-[11px] font-medium">
                      {getActivityTypeLabel(type)}
                    </span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-medium">
                      进行中
                    </span>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-[15px] font-bold text-gray-900 mb-3 line-clamp-2">
                    {title || '活动标题'}
                  </h3>

                  {/* 信息行 */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-[13px] text-[rgba(0,0,0,0.6)]">
                      <Calendar className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                      <span>{date || '待定日期'} · {startTime || '--:--'} - {endTime || '--:--'}</span>
                    </div>
                    <div className="flex items-center text-[13px] text-[rgba(0,0,0,0.6)]">
                      <MapPin className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                      <span>{location || '待定地点'}</span>
                    </div>
                    <div className="flex items-center text-[13px] text-[rgba(0,0,0,0.6)]">
                      <Users className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                      <span>已报名 {enrolled}/{maxParticipants || '--'} 人</span>
                    </div>
                  </div>

                  {/* 标签 */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {selectedTags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[11px] text-[rgba(0,0,0,0.6)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 描述预览 */}
                  {description && (
                    <div className="text-[13px] text-[rgba(0,0,0,0.6)] line-clamp-3 mb-3">
                      <div dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                  )}

                  {/* 按钮 */}
                  <button className="w-full py-2.5 bg-blue-400 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors">
                    立即报名
                  </button>
                </div>
              </div>

              {/* 提示 */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-[12px] text-blue-700">
                    这是活动卡片在用户端显示的预览效果
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
