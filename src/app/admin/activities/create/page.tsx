'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Calendar, MapPin, Users, Clock, Check, Plus, X } from 'lucide-react';
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

// 模拟会员数据（实际项目中应从API获取）
const mockMembers = [
  { id: '1', name: '王姐', avatar: '/avatar-3.jpg', bio: 'HRBP专家，20年人力资源经验' },
  { id: '2', name: '李明', avatar: '/avatar-2.jpg', bio: '战略咨询师，专注企业数字化转型' },
  { id: '3', name: '张总', avatar: '/avatar-1.jpg', bio: '智能制造领域专家' },
  { id: '4', name: '陈老师', avatar: '/avatar-4.jpg', bio: '创业导师，投资人' },
  { id: '5', name: '刘总', avatar: '/avatar-5.jpg', bio: '金融投资专家' },
  { id: '6', name: '赵经理', avatar: '/avatar-6.jpg', bio: '运营管理专家' },
  { id: '7', name: '孙总', avatar: '/avatar-7.jpg', bio: '市场营销专家' },
  { id: '8', name: '周董', avatar: '/avatar-8.jpg', bio: '技术研发专家' },
];

// 获取活动类型标签
const getActivityTypeLabel = (type: string) => {
  const option = activityTypeOptions.find(opt => opt.id === type);
  return option ? option.label : type;
};

export default function AdminActivityCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('private');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [teaFee, setTeaFee] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  
  // 自定义嘉宾
  const [showAddCustomGuest, setShowAddCustomGuest] = useState(false);
  const [customGuestName, setCustomGuestName] = useState('');
  const [customGuestBio, setCustomGuestBio] = useState('');
  const [customGuestAvatar, setCustomGuestAvatar] = useState('');
  
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleToggleParticipant = (memberId: string) => {
    if (selectedParticipants.includes(memberId)) {
      setSelectedParticipants(selectedParticipants.filter((id) => id !== memberId));
    } else {
      setSelectedParticipants([...selectedParticipants, memberId]);
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
      teaFee,
      participants: selectedParticipants,
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
                    参与嘉宾 <span className="text-[rgba(0,0,0,0.5)] font-normal">(已选 {selectedParticipants.length + 3} 人)</span>
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {mockMembers.map((member) => (
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
                                handleToggleParticipant(member.id);
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

                            mockMembers.push(newGuest);
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
