'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, MapPin, Calendar, Users, Star, Plus, X } from 'lucide-react';
import Link from 'next/link';

// 可用标签
const availableTags = ['已结束', '进行中', 'AI', '智能制造', '金融投资', '数字化转型', '工业互联网'];

// 模拟会员数据（实际项目中应从API获取）
const mockMembers = [
  { id: '1', name: '王姐', avatar: '/avatar-3.jpg', abilityTags: ['HRBP', '团队管理'] },
  { id: '2', name: '李明', avatar: '/avatar-2.jpg', abilityTags: ['战略', '金融投资'] },
  { id: '3', name: '张总', avatar: '/avatar-1.jpg', abilityTags: ['智能制造', '技术研发'] },
  { id: '4', name: '陈老师', avatar: '/avatar-4.jpg', abilityTags: ['教育培训', '创业指导'] },
];

// 模拟数据（实际项目中应从API获取）
const mockVisit = {
  id: '1',
  date: '2024年3月5日',
  time: '14:00-16:00',
  status: 'completed',
  target: {
    name: '张总',
    title: '创始人兼CEO',
    company: '智能制造科技有限公司',
    avatar: '/avatar-2.jpg',
  },
  purpose: '了解企业数字化转型实践，寻求合作机会',
  location: '北京市海淀区中关村软件园',
  participants: 3,
  outcome: '深入了解对方的产品体系和技术路线，初步达成战略合作意向',
  keyPoints: [
    '对方正在构建工业互联网平台，需要供应链整合能力',
    '双方在技术路线和商业模式上高度契合',
    '计划下个月进行第二次深入交流',
    '对方对我们的AI解决方案表现出浓厚兴趣',
  ],
  nextSteps: [
    '3月20日前提交技术方案初稿',
    '4月初进行第二次拜访',
    '准备相关案例和参考资料',
  ],
  rating: 5,
  notes: '张总是非常务实的企业家，对技术和市场都有深刻理解。团队氛围很好，执行力强。建议重点关注其产品迭代速度。',
  images: [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop',
  ],
  tags: ['已结束', '智能制造', '数字化转型'],
  visitors: [
    { id: '1', name: '王姐', avatar: '/avatar-3.jpg', abilityTags: ['HRBP', '团队管理'] },
    { id: '2', name: '李明', avatar: '/avatar-2.jpg', abilityTags: ['战略', '金融投资'] },
  ],
  createdAt: '2024年3月5日 16:30',
};

export default function AdminVisitEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  // 探访基本信息
  const [visitDate, setVisitDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('completed');

  // 探访对象信息
  const [targetName, setTargetName] = useState('');
  const [targetTitle, setTargetTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetAvatar, setTargetAvatar] = useState('/avatar-1.jpg');

  // 探访详情
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState('');

  // 富文本内容
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');

  // 标签和图片
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState(5);

  // 访客选择
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([]);

  // 自定义访客
  const [showAddCustomVisitor, setShowAddCustomVisitor] = useState(false);
  const [customVisitorName, setCustomVisitorName] = useState('');
  const [customVisitorIntro, setCustomVisitorIntro] = useState('');
  const [customVisitorAvatar, setCustomVisitorAvatar] = useState('');
  const [customMemberId, setCustomMemberId] = useState('');

  // 关键点（动态数组）
  const [keyPoints, setKeyPoints] = useState<string[]>(['']);

  // 下一步计划（动态数组）
  const [nextSteps, setNextSteps] = useState<string[]>(['']);

  // 图片URLs（动态数组）
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  // 图片预览
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(['']);

  // 加载现有数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 解析时间
        const timeParts = mockVisit.time.split('-');
        const [start, end] = timeParts;

        setVisitDate(mockVisit.date);
        setStartTime(start);
        setEndTime(end);
        setStatus(mockVisit.status);
        setTargetName(mockVisit.target.name);
        setTargetTitle(mockVisit.target.title);
        setTargetCompany(mockVisit.target.company);
        setTargetAvatar(mockVisit.target.avatar);
        setPurpose(mockVisit.purpose);
        setLocation(mockVisit.location);
        setParticipants(mockVisit.participants.toString());
        setOutcome(mockVisit.outcome || '');
        setNotes(mockVisit.notes || '');
        setSelectedTags(mockVisit.tags);
        setRating(mockVisit.rating);
        setSelectedVisitors(mockVisit.visitors?.map((v) => v.id) || []);
        setKeyPoints(mockVisit.keyPoints.length > 0 ? mockVisit.keyPoints : ['']);
        setNextSteps(mockVisit.nextSteps.length > 0 ? mockVisit.nextSteps : ['']);
        setImageUrls(mockVisit.images.length > 0 ? mockVisit.images : ['']);
        setImagePreviewUrls(mockVisit.images.length > 0 ? mockVisit.images : ['']);
      } catch (error) {
        console.error('加载数据失败:', error);
        alert('加载数据失败');
      }
    };

    loadData();
  }, [params.id]);

  // 添加标签
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 移除标签
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // 自定义标签
  const [customTag, setCustomTag] = useState('');
  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  // 添加访客
  const handleAddVisitor = (memberId: string) => {
    if (!selectedVisitors.includes(memberId)) {
      setSelectedVisitors([...selectedVisitors, memberId]);
    }
  };

  // 移除访客
  const handleRemoveVisitor = (memberId: string) => {
    setSelectedVisitors(selectedVisitors.filter((id) => id !== memberId));
  };

  // 添加关键点
  const handleAddKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  // 移除关键点
  const handleRemoveKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  // 更新关键点
  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...keyPoints];
    newKeyPoints[index] = value;
    setKeyPoints(newKeyPoints);
  };

  // 添加下一步计划
  const handleAddNextStep = () => {
    setNextSteps([...nextSteps, '']);
  };

  // 移除下一步计划
  const handleRemoveNextStep = (index: number) => {
    setNextSteps(nextSteps.filter((_, i) => i !== index));
  };

  // 更新下一步计划
  const handleNextStepChange = (index: number, value: string) => {
    const newNextSteps = [...nextSteps];
    newNextSteps[index] = value;
    setNextSteps(newNextSteps);
  };

  // 添加图片
  const handleAddImage = () => {
    setImageUrls([...imageUrls, '']);
    setImagePreviewUrls([...imagePreviewUrls, '']);
  };

  // 移除图片
  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index));
  };

  // 更新图片URL
  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setImagePreviewUrls(newUrls);
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!targetName.trim()) {
      alert('请输入探访对象姓名');
      return false;
    }
    if (!targetTitle.trim()) {
      alert('请输入探访对象职位');
      return false;
    }
    if (!targetCompany.trim()) {
      alert('请输入探访对象公司');
      return false;
    }
    if (!visitDate.trim()) {
      alert('请选择探访日期');
      return false;
    }
    if (!startTime.trim()) {
      alert('请输入开始时间');
      return false;
    }
    if (!endTime.trim()) {
      alert('请输入结束时间');
      return false;
    }
    if (!purpose.trim()) {
      alert('请输入探访目的');
      return false;
    }
    if (!location.trim()) {
      alert('请输入探访地点');
      return false;
    }
    return true;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 构造数据
      const visitData = {
        id: params.id,
        date: visitDate,
        time: `${startTime}-${endTime}`,
        status,
        target: {
          name: targetName,
          title: targetTitle,
          company: targetCompany,
          avatar: targetAvatar,
        },
        purpose,
        location,
        participants: participants ? parseInt(participants) : 0,
        outcome,
        keyPoints: keyPoints.filter((kp) => kp.trim()),
        nextSteps: nextSteps.filter((ns) => ns.trim()),
        rating,
        notes,
        images: imageUrls.filter((url) => url.trim()),
        tags: selectedTags,
        visitors: selectedVisitors.map((memberId) => {
          const member = mockMembers.find((m) => m.id === memberId);
          return member
            ? {
                id: member.id,
                name: member.name,
                avatar: member.avatar,
                abilityTags: member.abilityTags,
              }
            : null;
        }).filter(Boolean),
        createdAt: mockVisit.createdAt,
        updatedAt: new Date().toLocaleString('zh-CN'),
      };

      console.log('更新探访数据:', visitData);

      // 实际项目中需要调用API更新数据
      // const response = await fetch(`/api/admin/visits/${params.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(visitData),
      // });

      alert('探访更新成功！');
      router.push('/admin/visits');
    } catch (error) {
      console.error('更新探访失败:', error);
      alert('更新探访失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/visits">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </Link>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 mb-1">编辑探访</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">编辑探访记录信息</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? '保存中...' : '保存'}
          </Button>
        </div>

        {/* 表单内容 */}
        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">基本信息</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* 探访对象信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    探访对象姓名 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="请输入探访对象姓名"
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    职位 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    placeholder="如：创始人兼CEO"
                    className="text-[13px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公司 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="请输入公司名称"
                  className="text-[13px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  探访对象头像URL
                </label>
                <Input
                  value={targetAvatar}
                  onChange={(e) => setTargetAvatar(e.target.value)}
                  placeholder="请输入头像图片URL"
                  className="text-[13px]"
                />
              </div>

              {/* 探访时间 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    探访日期 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      开始时间 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      结束时间 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="text-[13px]"
                    />
                  </div>
                </div>
              </div>

              {/* 探访地点和目的 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    探访地点 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="请输入探访地点"
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    探访目的 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="请输入探访目的"
                    className="text-[13px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  参与人数
                </label>
                <Input
                  type="number"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="请输入参与人数"
                  className="text-[13px]"
                />
              </div>

              {/* 访客选择 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    选择访客
                  </label>
                  <span className="text-[12px] text-[rgba(0,0,0,0.4)]">
                    已选择 {selectedVisitors.length} 位访客
                  </span>
                </div>

                {/* 已选访客 */}
                {selectedVisitors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedVisitors.map((memberId) => {
                      const member = mockMembers.find((m) => m.id === memberId);
                      if (!member) return null;
                      return (
                        <div
                          key={memberId}
                          className="flex items-center space-x-2 px-3 py-2 bg-[rgba(59,130,246,0.4)] text-white text-[13px]"
                        >
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full"
                            unoptimized
                          />
                          <span>{member.name}</span>
                          <button
                            onClick={() => handleRemoveVisitor(memberId)}
                            className="hover:text-gray-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 可选访客 */}
                <div className="space-y-2">
                  <span className="text-[12px] text-[rgba(0,0,0,0.6)]">可选访客：</span>
                  <div className="grid grid-cols-2 gap-2">
                    {mockMembers
                      .filter((member) => !selectedVisitors.includes(member.id))
                      .map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => handleAddVisitor(member.id)}
                          className="flex items-center space-x-2 p-2 bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.08)] transition-colors text-left"
                        >
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-gray-900 truncate">
                              {member.name}
                            </div>
                            <div className="text-[11px] text-[rgba(0,0,0,0.6)] truncate">
                              {member.abilityTags.join(' · ')}
                            </div>
                          </div>
                          <Plus className="w-4 h-4 text-[rgba(0,0,0,0.4)] flex-shrink-0" />
                        </button>
                      ))}
                  </div>
                </div>

                {/* 自定义访客按钮 */}
                <button
                  type="button"
                  onClick={() => setShowAddCustomVisitor(true)}
                  className="w-full mt-2 p-2 border-2 border-dashed border-[rgba(0,0,0,0.2)] rounded-lg text-[13px] text-[rgba(0,0,0,0.6)] hover:border-[rgba(59,130,246,0.5)] hover:text-blue-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>添加自定义访客</span>
                </button>
              </div>

              {/* 自定义访客对话框 */}
              {showAddCustomVisitor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">添加自定义访客</h3>
                      <button
                        onClick={() => setShowAddCustomVisitor(false)}
                        className="text-[rgba(0,0,0,0.4)] hover:text-[rgba(0,0,0,0.6)]"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* 上传头像 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        头像 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        {customVisitorAvatar ? (
                          <Image
                            src={customVisitorAvatar}
                            alt="头像预览"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                            <span className="text-[13px] text-[rgba(0,0,0,0.4)]">暂无</span>
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setCustomVisitorAvatar(url);
                            }
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* 姓名 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={customVisitorName}
                        onChange={(e) => setCustomVisitorName(e.target.value)}
                        placeholder="请输入姓名"
                      />
                    </div>

                    {/* 介绍 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        介绍
                      </label>
                      <textarea
                        value={customVisitorIntro}
                        onChange={(e) => setCustomVisitorIntro(e.target.value)}
                        placeholder="请输入介绍"
                        className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowAddCustomVisitor(false);
                          setCustomVisitorName('');
                          setCustomVisitorIntro('');
                          setCustomVisitorAvatar('');
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          if (!customVisitorName || !customVisitorAvatar) {
                            alert('请填写姓名和上传头像');
                            return;
                          }

                          const newMemberId = Date.now().toString();
                          const newMember = {
                            id: newMemberId,
                            name: customVisitorName,
                            avatar: customVisitorAvatar,
                            abilityTags: customVisitorIntro ? [customVisitorIntro] : [],
                          };

                          mockMembers.push(newMember);
                          setSelectedVisitors([...selectedVisitors, newMemberId]);
                          setShowAddCustomVisitor(false);
                          setCustomVisitorName('');
                          setCustomVisitorIntro('');
                          setCustomVisitorAvatar('');
                        }}
                      >
                        确认添加
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 探访成果 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">探访成果</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* 探访对象评价 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  探访对象评价
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-[13px] text-[rgba(0,0,0,0.6)] ml-2">
                    ({rating}星)
                  </span>
                </div>
              </div>

              {/* 探访成果描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  探访成果描述
                </label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="请描述本次探访的成果和收获..."
                  className="w-full min-h-[120px] px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* 探访笔记 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  探访笔记
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="请记录探访过程中的重要观察和心得..."
                  className="w-full min-h-[120px] px-3 py-2 text-[13px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 关键点和下一步计划 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">关键信息</h3>
            </div>
            <div className="p-4 space-y-4">
              {/* 关键点 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    关键点
                  </label>
                  <Button variant="outline" size="sm" onClick={handleAddKeyPoint}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加关键点
                  </Button>
                </div>
                {keyPoints.map((keyPoint, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <Input
                      value={keyPoint}
                      onChange={(e) => handleKeyPointChange(index, e.target.value)}
                      placeholder="请输入关键点"
                      className="flex-1 text-[13px]"
                    />
                    {keyPoints.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveKeyPoint(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* 下一步计划 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    下一步计划
                  </label>
                  <Button variant="outline" size="sm" onClick={handleAddNextStep}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加计划
                  </Button>
                </div>
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <Input
                      value={step}
                      onChange={(e) => handleNextStepChange(index, e.target.value)}
                      placeholder="请输入下一步计划"
                      className="flex-1 text-[13px]"
                    />
                    {nextSteps.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveNextStep(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 探访图片 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">探访图片</h3>
            </div>
            <div className="p-4 space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Input
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="请输入图片URL"
                      className="flex-1 text-[13px]"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {url && (
                    <div className="w-full h-32 overflow-hidden bg-gray-100">
                      <img
                        src={url}
                        alt={`探访图片${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddImage}>
                <Plus className="w-4 h-4 mr-2" />
                添加图片
              </Button>
            </div>
          </div>

          {/* 标签 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">标签</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-[13px] text-[rgba(0,0,0,0.6)]">可用标签：</span>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[rgba(59,130,246,0.4)] text-white'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-[13px] text-[rgba(0,0,0,0.6)]">已选标签：</span>
                  {selectedTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[rgba(59,130,246,0.4)] text-white text-[13px]"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-2 pt-2 border-t border-[rgba(0,0,0,0.05)]">
                <span className="text-[13px] text-[rgba(0,0,0,0.6)]">自定义标签：</span>
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  placeholder="输入标签名称"
                  className="w-48 h-8 text-[13px]"
                />
                <Button size="sm" onClick={handleAddCustomTag}>
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
