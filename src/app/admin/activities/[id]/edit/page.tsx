'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Calendar, MapPin, Users, Check, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

// 从API获取活动数据
const fetchActivity = async (id: string) => {
  try {
    const response = await fetch(`/api/activities/${id}`);
    if (!response.ok) {
      throw new Error('加载活动数据失败');
    }
    const data = await response.json();
    if (data.success) {
      const activity = data.data;
      // 转换为编辑页面需要的格式
      // 日期转换：从timestamp格式(2026-03-31T00:00:00.000Z)转为date input格式(2026-03-31)
      const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0]; // 只保留YYYY-MM-DD部分
        } catch {
          return '';
        }
      };

      return {
        id: activity.id.toString(),
        title: activity.title,
        date: formatDate(activity.date || ''),
        startTime: activity.startTime || '14:00',
        endTime: activity.endTime || '17:00',
        location: activity.location || '',
        address: activity.location || '',
        type: activity.type || 'private',
        maxParticipants: activity.capacity || 12,
        tags: activity.tags || [], // 直接使用API返回的tags，不硬编码
        status: activity.status,
        teaFee: activity.teaFee || '', // 直接使用API返回的teaFee
        description: activity.description || '',
        imageUrl: activity.coverImage || '',
        participants: [], // participants字段在API中不存在，使用guests
        guests: activity.guests || [], // 直接使用API返回的guests
      };
    }
    return null;
  } catch (error) {
    console.error('加载活动数据失败:', error);
    return null;
  }
};

export default function AdminActivityEditPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('private');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [teaFee, setTeaFee] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'ended' | 'cancelled'>('draft');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  
  // 自定义嘉宾
  const [showAddCustomGuest, setShowAddCustomGuest] = useState(false);
  const [customGuestName, setCustomGuestName] = useState('');
  const [customGuestBio, setCustomGuestBio] = useState('');
  const [customGuestAvatar, setCustomGuestAvatar] = useState('');
  
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // 加载会员数据
  useEffect(() => {
    async function loadMembers() {
      try {
        const response = await fetch('/admin/api/members/selectable');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAvailableMembers(data.data);
          }
        }
      } catch (error) {
        console.error('加载会员数据失败:', error);
      } finally {
        setIsLoadingMembers(false);
      }
    }

    loadMembers();
  }, []);

  useEffect(() => {
    async function loadActivity() {
      setLoading(true);
      const activity = await fetchActivity(activityId);
      if (activity) {
        setTitle(activity.title);
        setDate(activity.date);
        setStartTime(activity.startTime);
        setEndTime(activity.endTime);
        setLocation(activity.location);
        setType(activity.type);
        setMaxParticipants(activity.maxParticipants.toString());
        setTeaFee(activity.teaFee || '');
        setSelectedTags(activity.tags || []);
        setStatus(activity.status || 'draft');

        // 处理嘉宾数据
        const guestsData = (activity as any).guests || [];
        if (guestsData.length > 0) {
          // 提取嘉宾ID列表
          const guestIds = guestsData.map((g: any) => g.id);
          setSelectedParticipants(guestIds);

          // 将嘉宾数据添加到availableMembers中，以便显示
          const newGuests = guestsData.map((g: any) => ({
            id: g.id,
            name: g.name,
            avatar: g.avatar || '',
            bio: g.bio || '',
          }));

          // 合并到availableMembers中（去重）
          setAvailableMembers(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const filteredNewGuests = newGuests.filter((g: any) => !existingIds.has(g.id));
            return [...prev, ...filteredNewGuests];
          });
        }

        setDescription(activity.description);
        setImageUrl(activity.imageUrl || '');
      }
      setLoading(false);
    }
    loadActivity();
  }, [activityId]);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleToggleParticipant = (memberId: string) => {
    // 使用 Set 确保不会重复
    const currentSet = new Set(selectedParticipants);
    if (currentSet.has(memberId)) {
      currentSet.delete(memberId);
    } else {
      currentSet.add(memberId);
    }
    setSelectedParticipants(Array.from(currentSet));
  };

  const handleDeleteParticipant = (memberId: string) => {
    // 从已选中列表中移除
    setSelectedParticipants(selectedParticipants.filter((id) => id !== memberId));
    // 从可用嘉宾列表中永久删除
    setAvailableMembers(availableMembers.filter((m) => m.id !== memberId));
  };

  const handleSave = async () => {
    if (!title || !date || !startTime || !endTime || !location || !maxParticipants) {
      alert('请填写所有必填字段');
      return;
    }

    try {
      // 构建嘉宾数据
      const guestsData = selectedParticipants.map(memberId => {
        const member = availableMembers.find(m => m.id === memberId);
        return {
          id: memberId,
          name: member?.name || '',
          avatar: member?.avatar || '',
          bio: member?.bio || '',
        };
      });

      // 调用API保存活动
      const response = await fetch(`/admin/api/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          location,
          type,
          coverImage: imageUrl,
          date,
          startTime,
          endTime,
          capacity: parseInt(maxParticipants),
          status: status,
          startDate: date,
          endDate: date,
          teaFee,
          tags: selectedTags,
          guests: guestsData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存活动失败');
      }

      alert('活动已更新');
      router.push('/admin/activities');
    } catch (error: any) {
      console.error('保存活动失败:', error);
      alert(`保存失败：${error.message}`);
    }
  };

  const handleDelete = async () => {
    // 确认删除
    if (!confirm('确定要删除这个活动吗？此操作不可撤销！')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '删除活动失败');
      }

      alert('活动已删除');
      router.push('/admin/activities');
    } catch (error: any) {
      console.error('删除活动失败:', error);
      alert(`删除失败：${error.message}`);
    }
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
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存更改
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              删除活动
            </Button>
          </div>
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

                {/* 封面图片 */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    封面图片
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="封面预览"
                          className="w-32 h-20 rounded-lg object-cover border-2 border-[rgba(0,0,0,0.1)]"
                        />
                      ) : (
                        <div className="w-32 h-20 rounded-lg bg-[rgba(0,0,0,0.05)] border-2 border-dashed border-[rgba(0,0,0,0.2)] flex items-center justify-center">
                          <span className="text-[11px] text-[rgba(0,0,0,0.4)]">暂无封面</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setImageUrl(url);
                          }
                        }}
                        className="text-[13px]"
                      />
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="或输入封面图片URL"
                        className="text-[13px]"
                      />
                      <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                        支持上传图片或输入图片链接，留空将使用默认图片
                      </p>
                    </div>
                  </div>
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

            {/* 活动状态 */}
            <div className="border border-[rgba(0,0,0,0.1)]">
              <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
                <h3 className="text-[13px] font-semibold text-gray-900">活动状态</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={cn(
                      'p-3 text-left border transition-colors',
                      status === 'draft'
                        ? 'bg-[rgba(107,114,128,0.1)] border-gray-400'
                        : 'border-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.02)]'
                    )}
                  >
                    <div className="text-lg mb-1">📝</div>
                    <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                      草稿
                    </div>
                    <div className="text-[11px] text-[rgba(0,0,0,0.6)]">
                      暂存不发布
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={cn(
                      'p-3 text-left border transition-colors',
                      status === 'published'
                        ? 'bg-[rgba(59,130,246,0.1)] border-blue-400'
                        : 'border-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.02)]'
                    )}
                  >
                    <div className="text-lg mb-1">🚀</div>
                    <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                      报名中
                    </div>
                    <div className="text-[11px] text-[rgba(0,0,0,0.6)]">
                      用户可报名
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('ended')}
                    className={cn(
                      'p-3 text-left border transition-colors',
                      status === 'ended'
                        ? 'bg-[rgba(107,114,128,0.1)] border-gray-400'
                        : 'border-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.02)]'
                    )}
                  >
                    <div className="text-lg mb-1">✅</div>
                    <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                      已结束
                    </div>
                    <div className="text-[11px] text-[rgba(0,0,0,0.6)]">
                      活动已结束
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('cancelled')}
                    className={cn(
                      'p-3 text-left border transition-colors',
                      status === 'cancelled'
                        ? 'bg-[rgba(239,68,68,0.1)] border-red-400'
                        : 'border-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.02)]'
                    )}
                  >
                    <div className="text-lg mb-1">❌</div>
                    <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                      已取消
                    </div>
                    <div className="text-[11px] text-[rgba(0,0,0,0.6)]">
                      活动已取消
                    </div>
                  </button>
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
                    茶水费 <span className="text-[rgba(0,0,0,0.5)] font-normal">(选填)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="例如：aa茶水费35元"
                    value={teaFee}
                    onChange={(e) => setTeaFee(e.target.value)}
                    className="text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    参与嘉宾
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {availableMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleToggleParticipant(member.id)}
                        className={`relative flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-all ${
                          selectedParticipants.includes(member.id)
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-[rgba(0,0,0,0.1)] hover:border-[rgba(59,130,246,0.3)]'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {selectedParticipants.includes(member.id) && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {selectedParticipants.includes(member.id) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteParticipant(member.id);
                              }}
                              className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                              title="删除嘉宾"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          )}
                        </div>
                        <span className="text-[11px] text-[rgba(0,0,0,0.8)]">{member.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* 自定义添加按钮 */}
                  <button
                    type="button"
                    onClick={() => setShowAddCustomGuest(true)}
                    className="w-full mt-3 p-3 border-2 border-dashed border-[rgba(0,0,0,0.2)] rounded-lg text-[13px] text-[rgba(0,0,0,0.6)] hover:border-[rgba(59,130,246,0.5)] hover:text-blue-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加自定义嘉宾</span>
                  </button>
                </div>

                {/* 自定义嘉宾对话框 */}
                {showAddCustomGuest && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">添加自定义嘉宾</h3>
                        <button
                          onClick={() => setShowAddCustomGuest(false)}
                          className="text-[rgba(0,0,0,0.4)] hover:text-[rgba(0,0,0,0.6)]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* 上传头像 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          添加头像 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-4">
                          {customGuestAvatar ? (
                            <img
                              src={customGuestAvatar}
                              alt="头像预览"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                              <span className="text-[13px] text-[rgba(0,0,0,0.4)]">暂无</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setCustomGuestAvatar(url);
                              }
                            }}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </div>

                      {/* 添加名称 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          添加名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customGuestName}
                          onChange={(e) => setCustomGuestName(e.target.value)}
                          placeholder="请输入嘉宾名称"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>

                      {/* 添加简介 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          添加简介
                        </label>
                        <textarea
                          value={customGuestBio}
                          onChange={(e) => setCustomGuestBio(e.target.value)}
                          placeholder="请输入嘉宾简介"
                          className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddCustomGuest(false);
                            setCustomGuestName('');
                            setCustomGuestBio('');
                            setCustomGuestAvatar('');
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-[13px] hover:bg-gray-50 transition-colors"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!customGuestName || !customGuestAvatar) {
                              alert('请填写名称和上传头像');
                              return;
                            }

                            const newGuestId = Date.now().toString();
                            const newGuest = {
                              id: newGuestId,
                              name: customGuestName,
                              avatar: customGuestAvatar,
                              bio: customGuestBio,
                            };

                            setAvailableMembers([...availableMembers, newGuest]);
                            setSelectedParticipants([...selectedParticipants, newGuestId]);
                            setShowAddCustomGuest(false);
                            setCustomGuestName('');
                            setCustomGuestBio('');
                            setCustomGuestAvatar('');
                          }}
                          className="flex-1 px-4 py-2 bg-blue-400 text-white rounded-md text-[13px] hover:bg-blue-500 transition-colors"
                        >
                          确认添加
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请输入活动描述..."
                  className="w-full min-h-[200px] px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
                <p className="text-[11px] text-[rgba(0,0,0,0.5)] mt-1">纯文本输入，不支持富文本格式</p>
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
                        <span key={tag} className="relative inline-flex items-center px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[11px] text-[rgba(0,0,0,0.6)] rounded">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            className="ml-1 hover:text-red-500 transition-colors"
                            title="删除标签"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 描述预览 */}
                  {description && (
                    <div className="text-[13px] text-[rgba(0,0,0,0.6)] line-clamp-3 mb-3 whitespace-pre-wrap">
                      {description}
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
