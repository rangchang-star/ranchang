'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Calendar, MapPin, Users, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

// 模拟从后台获取活动数据
const fetchActivity = (id: string) => {
  const mockActivities = [
    {
      id: '1',
      title: '转型期私董会：如何找到第二曲线',
      date: '2024-04-10',
      startTime: '14:00',
      endTime: '17:00',
      location: '上海·静安',
      address: '上海市静安区南京西路1788号',
      type: 'private',
      maxParticipants: 12,
      tags: ['私董会', '名额紧张'],
      status: 'ongoing',
      description: '针对35+职场转型人群，通过私董会形式深度探讨职业转型路径。我们将围绕"如何利用过往经验"、"如何降低试错成本"等话题展开讨论。',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
    },
    {
      id: '2',
      title: '跨界沙龙：AI时代的商业创新',
      date: '2024-04-15',
      startTime: '19:00',
      endTime: '21:00',
      location: '北京·朝阳',
      address: '北京市朝阳区CBD国贸大厦',
      type: 'salon',
      maxParticipants: 30,
      tags: ['跨界', 'AI'],
      status: 'ongoing',
      description: '邀请不同领域的专家分享AI在各行业的应用实践，促进跨界交流与合作。适合对AI商业化感兴趣的朋友参与。',
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
    },
    {
      id: '3',
      title: 'AI实战赋能营（第一期）',
      date: '2024-04-20',
      startTime: '09:00',
      endTime: '17:00',
      location: '深圳·南山',
      address: '深圳市南山区科技园',
      type: 'ai',
      maxParticipants: 30,
      tags: ['AI实战', '工作坊'],
      status: 'ended',
      description: '全天候AI工具实战培训，从工具选型到场景落地，帮你快速掌握AI辅助工作的核心技能。',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
    },
    {
      id: '4',
      title: '35+职场转型工作坊',
      date: '2024-04-25',
      startTime: '13:00',
      endTime: '17:00',
      location: '广州·天河',
      address: '广州市天河区珠江新城',
      type: 'private',
      maxParticipants: 15,
      tags: ['工作坊', '即将开始'],
      status: 'ongoing',
      description: '为35+职场人提供转型指导，涵盖简历优化、面试技巧、行业分析等内容，帮助你顺利实现职业转型。',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    },
  ];
  
  return mockActivities.find(a => a.id === id);
};

export default function AdminActivityEditPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // 加载活动数据
    const activity = fetchActivity(activityId);
    if (activity) {
      setTitle(activity.title);
      setDate(activity.date);
      setStartTime(activity.startTime);
      setEndTime(activity.endTime);
      setLocation(activity.location);
      setType(activity.type);
      setMaxParticipants(activity.maxParticipants.toString());
      setSelectedTags(activity.tags);
      setDescription(activity.description);
      setImageUrl(activity.imageUrl || '');
    }
    setLoading(false);
  }, [activityId]);

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
      id: activityId,
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

    alert('活动已更新');
    router.push('/admin/activities');
  };

  // 计算当前已报名人数（默认为0）
  const enrolled = 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-[13px] text-[rgba(0,0,0,0.6)]">加载中...</div>
        </div>
      </AdminLayout>
    );
  }

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
              <h2 className="text-[15px] font-bold text-gray-900">编辑活动</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">修改活动信息并实时预览效果</p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            保存更改
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
                      modules={{
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
                      }}
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
