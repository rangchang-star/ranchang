'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// 活动类型选项
const activityTypeOptions = [
  { id: 'private', label: '私董会', description: '小规模深度交流' },
  { id: 'salon', label: '沙龙', description: '主题分享与交流' },
  { id: 'ai', label: 'AI实战', description: 'AI技术实践工作坊' },
];

// 可用标签
const availableTags = ['私董会', '名额紧张', '跨界', 'AI', 'AI实战', '工作坊', '已结束'];

export default function AdminActivityCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('private');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');

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
    });

    alert('活动已创建');
    router.push('/admin/activities');
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* 顶部导航 */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/activities">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
          </Link>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">创建新活动</h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">填写活动信息并发布</p>
          </div>
        </div>

        {/* 表单 */}
        <div className="space-y-5">
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
            </div>
          </div>

          {/* 活动类型 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">活动类型</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {activityTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setType(option.id)}
                    className={`p-4 text-left border transition-colors ${
                      type === option.id
                        ? 'bg-[rgba(59,130,246,0.4)] border-blue-400'
                        : 'border-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-gray-900 mb-1">
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
                  placeholder="请输入最大人数"
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
                      className={`px-3 py-1.5 text-[11px] font-normal border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border-blue-400'
                          : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] border border-transparent hover:bg-[rgba(0,0,0,0.08)]'
                      }`}
                    >
                      {selectedTags.includes(tag) ? '✓ ' : ''}
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
              <textarea
                placeholder="请输入活动描述..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full p-3 text-[13px] border border-[rgba(0,0,0,0.1)] rounded-md focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-4">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存并发布
            </Button>
            <Link href="/admin/activities">
              <Button variant="outline">
                取消
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
