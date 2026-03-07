'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 可用标签
const availableTags = ['普通', '私董案主', '探访主', '探访员', '学员', '小组成员', '同工'];

// 人找事/事找人/纯交流选项
const connectionTypeOptions = [
  { id: 'personLookingForJob', label: '人找事', description: '我有能力，寻找项目机会' },
  { id: 'jobLookingForPerson', label: '事找人', description: '我有项目，寻找合作伙伴' },
  { id: 'pureExchange', label: '纯交流', description: '只想交流学习，暂无合作需求' }
];

// 行业选项
const industryOptions = [
  '企业服务', '金融投资', '制造业', '教育培训', '医疗健康',
  '消费零售', '房地产', '互联网', '人工智能', '新能源',
  '汽车行业', '物流运输', '传媒娱乐', '农业', '政府公共',
  '法律咨询', '建筑设计', '化工环保', '通信', '其他'
];

// 资源标签
const resourceTagsOptions = [
  '资金', '人才', '技术', '渠道', '客户资源',
  '供应链', '品牌', '专利', '场地', '设备',
  '数据资源', '政府关系', '媒体资源', '合作伙伴', '其他'
];

// 硬核标签
const abilityTagsOptions = [
  'AI技术',
  '定方向',
  '带兵打仗',
  '从0到1',
  '摆平烂摊',
  '搞定人',
  '看懂账本',
  '攒局组队',
  '卖出去',
  '稳军心',
  '搞定自己',
  '找人识人',
  '会说人话',
];

export default function AdminMemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [memberId, setMemberId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 表单状态
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [connectionType, setConnectionType] = useState('personLookingForJob');
  const [industry, setIndustry] = useState('');
  const [need, setNeed] = useState('');
  const [abilityTags, setAbilityTags] = useState<string[]>([]);
  const [resourceTags, setResourceTags] = useState<string[]>([]);
  const [adminTags, setAdminTags] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [faith, setFaith] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [level, setLevel] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [connectionCount, setConnectionCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  // 额外的数据（暂时为空，待后端完善）
  const [declaration, setDeclaration] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [visitRecords, setVisitRecords] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // 加载用户数据
  useEffect(() => {
    params.then(p => {
      setMemberId(p.id);
      loadMemberData(p.id);
    });
  }, [params]);

  const loadMemberData = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/admin/api/members/${id}`);

      if (!response.ok) {
        throw new Error('加载会员信息失败');
      }

      const data = await response.json();

      if (data.success) {
        const member = data.data;
        setName(member.name || '');
        setAge(member.age || 0);
        setConnectionType(member.connectionType || 'personLookingForJob');
        setIndustry(member.industry || '');
        setNeed(member.need || '');
        setAbilityTags(member.abilityTags || []);
        setResourceTags(member.resourceTags || []);
        setAdminTags(member.adminTags || ['普通']);
        setPhone(member.phone || '');
        setEmail(member.email || '');
        setCompany(member.company || '');
        setPosition(member.position || '');
        setFaith(member.faith || '');
        setIsFeatured(member.isFeatured || false);
        setAvatarUrl(member.avatar || '');
        setLevel(member.level || '');
        setJoinDate(member.joinDate || '');
        setStatus(member.status || '');
        setRole(member.role || '');
        setBio(member.bio || '');
        setConnectionCount(member.connectionCount || 0);
        setActivityCount(member.activityCount || 0);
      } else {
        throw new Error(data.error || '加载会员信息失败');
      }
    } catch (err: any) {
      console.error('加载会员信息失败:', err);
      setError(err.message || '加载会员信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tag: string, type: 'admin' | 'ability' | 'resource') => {
    const setTags = type === 'admin' ? setAdminTags : type === 'ability' ? setAbilityTags : setResourceTags;
    const currentTags = type === 'admin' ? adminTags : type === 'ability' ? abilityTags : resourceTags;

    if (currentTags.includes(tag)) {
      setTags(currentTags.filter((t) => t !== tag));
    } else {
      // 能力标签和资源标签最多选3个
      if ((type === 'ability' || type === 'resource') && currentTags.length >= 3) {
        alert(`${type === 'ability' ? '能力' : '资源'}标签最多选择3个`);
        return;
      }
      setTags([...currentTags, tag]);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 创建本地预览URL
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = async () => {
    // 验证必选项
    const requiredErrors: string[] = [];
    if (!abilityTags || abilityTags.length === 0) {
      requiredErrors.push('能力标签（必选）');
    }
    if (!resourceTags || resourceTags.length === 0) {
      requiredErrors.push('资源标签（必选）');
    }

    if (requiredErrors.length > 0) {
      alert('请填写必选项：\n' + requiredErrors.join('、'));
      return;
    }

    try {
      // 调用API保存会员信息
      const response = await fetch(`/admin/api/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age,
          avatar: avatarUrl,
          connectionType,
          industry,
          need,
          abilityTags,
          resourceTags,
          adminTags,
          phone,
          email,
          company,
          position,
          faith,
          isFeatured,
          bio,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存会员信息失败');
      }

      alert('会员信息已保存');
      router.back();
    } catch (error: any) {
      console.error('保存会员信息失败:', error);
      alert(`保存失败：${error.message}`);
    }
  };

  const handleDelete = () => {
    if (confirm(`确定要删除会员「${name}」吗？此操作不可恢复！`)) {
      console.log('删除会员:', memberId);
      alert('会员已删除');
      router.push('/admin/members');
    }
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleDeleteAudio = () => {
    if (confirm('确定要删除录音吗？此操作不可恢复！')) {
      setIsPlayingAudio(false);
      alert('录音已删除');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* 加载状态 */}
        {isLoading && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isLoading && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-red-500 mb-4">{error}</p>
            <Link href="/admin/members">
              <Button variant="outline">返回列表</Button>
            </Link>
          </div>
        )}

        {/* 内容区域 */}
        {!isLoading && !error && (
        <>
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/members">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">编辑会员信息</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">ID: {memberId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              取消
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {/* 基本信息卡片 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            {/* 头像部分 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt={name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1">{name}</h3>
                  <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                    {level} · {joinDate} 加入
                  </p>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="border-[rgba(0,0,0,0.1)]"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      更换头像
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 个人基本信息 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">个人基本信息</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                      姓名
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                      年龄
                    </label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="text-[13px]"
                    />
                  </div>
                </div>

                {/* 人找事/事找人/纯交流 */}
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    连接类型
                  </label>
                  <div className="space-y-2">
                    {connectionTypeOptions.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="connectionType"
                          checked={connectionType === option.id}
                          onChange={() => setConnectionType(option.id)}
                          className="w-4 h-4"
                        />
                        <div>
                          <span className="text-[13px] font-medium text-gray-900">{option.label}</span>
                          <p className="text-[11px] text-[rgba(0,0,0,0.6)]">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 行业 */}
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    行业
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-[rgba(0,0,0,0.1)] text-[13px] focus:outline-none focus:border-blue-400"
                  >
                    {industryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 一句说清你的需要 */}
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    一句说清你的需要（至少20字）
                  </label>
                  <textarea
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-[rgba(0,0,0,0.1)] text-[13px] focus:outline-none focus:border-blue-400 resize-none"
                  />
                  <p className="text-[11px] text-[rgba(0,0,0,0.6)] mt-1">
                    当前字数：{need.length} / 200
                  </p>
                </div>
              </div>
            </div>

            {/* 联系方式 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">联系方式</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    电话
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    邮箱
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    公司
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    职位
                  </label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    信仰（可选）
                  </label>
                  <Input
                    value={faith}
                    onChange={(e) => setFaith(e.target.value)}
                    placeholder="请输入您的信仰"
                    className="text-[13px]"
                  />
                </div>
              </div>
            </div>

            {/* 硬核标签 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">硬核标签 <span className="text-red-500">*</span></h3>
              <div className="flex flex-wrap gap-2">
                {abilityTagsOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag, 'ability')}
                    className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                      abilityTags.includes(tag)
                        ? 'bg-[rgba(59,130,246,0.4)] text-white border border-blue-400'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] border border-transparent hover:bg-[rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {abilityTags.includes(tag) ? '✓ ' : ''}
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.6)] mt-2">
                已选择 {abilityTags.length} 个标签（最多3个）：{abilityTags.join('、')}
              </p>
              <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">前台只显示硬核标签</p>
            </div>

            {/* 资源标签 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">资源标签（最多3个） <span className="text-red-500">*</span></h3>
              <div className="flex flex-wrap gap-2">
                {resourceTagsOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag, 'resource')}
                    className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                      resourceTags.includes(tag)
                        ? 'bg-[rgba(59,130,246,0.4)] text-white border border-blue-400'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] border border-transparent hover:bg-[rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {resourceTags.includes(tag) ? '✓ ' : ''}
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.6)] mt-2">
                已选择 {resourceTags.length} 个标签：{resourceTags.join('、')}
              </p>
              <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">点开会员详细页后才能看到资源标签</p>
            </div>

            {/* 后台标签 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">后台标签（可多选）</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag, 'admin')}
                    className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                      adminTags.includes(tag)
                        ? 'bg-[rgba(59,130,246,0.4)] text-white border border-blue-400'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] border border-transparent hover:bg-[rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {adminTags.includes(tag) ? '✓ ' : ''}
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.6)] mt-2">
                已选择 {adminTags.length} 个标签：{adminTags.join('、')}
              </p>
            </div>

            {/* 其他设置 */}
            <div className="px-4 py-3">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">其他设置</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-[13px] font-medium text-[rgba(0,0,0,0.6)]"
                >
                  首页推荐
                </label>
              </div>
            </div>
          </div>

          {/* 高燃宣告展示（只读） */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">高燃宣告</h3>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <div className="p-3 bg-[rgba(0,0,0,0.02)]">
                    {declaration ? (
                      <>
                        <p className="text-[13px] text-[rgba(0,0,0,0.6)] mb-2">
                          <span className="font-medium text-gray-900">方向：</span>
                          {declaration.direction === 'confidence' && '信心'}
                          {declaration.direction === 'mission' && '使命'}
                          {declaration.direction === 'self' && '自我'}
                          {declaration.direction === 'opponent' && '对手'}
                          {declaration.direction === 'environment' && '环境'}
                        </p>
                        <p className="text-[13px] text-gray-900 mb-2">{declaration.text}</p>
                        <p className="text-[11px] text-[rgba(0,0,0,0.6)] mb-1">{declaration.summary}</p>
                        <div className="flex items-center space-x-4 text-[11px] text-[rgba(0,0,0,0.6)]">
                          <span>发布时间：{declaration.date}</span>
                          <span>浏览量：{declaration.views}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无高燃宣告</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  {declaration && declaration.hasAudio && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayAudio}
                      className={`w-12 h-12 rounded-full text-blue-600 border-blue-400`}
                    >
                      {isPlayingAudio ? '⏸' : '▶'}
                    </Button>
                  )}
                  {declaration && declaration.hasAudio && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteAudio}
                      className="text-blue-600 border-blue-400 hover:bg-blue-50"
                    >
                      删除录音
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 量表评估展示（只读） */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">量表评估</h3>
            </div>
            <div className="px-4 py-3">
              {assessments.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {assessments.map((assessment, index) => (
                    <div key={index} className="p-3 bg-[rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[13px] font-semibold text-gray-900">{assessment.name}</h4>
                        <span className="text-[13px] font-medium">
                          {assessment.score}分
                        </span>
                      </div>
                      <p className="text-[11px] text-[rgba(0,0,0,0.6)] mb-1">评级：{assessment.level}</p>
                      <p className="text-[11px] text-[rgba(0,0,0,0.6)] line-clamp-2">{assessment.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无量表评估数据</p>
              )}
            </div>
          </div>

          {/* 探访记录展示（只读） */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">探访记录（{visitRecords.length}）</h3>
            </div>
            <div className="px-4 py-3">
              {visitRecords.length > 0 ? (
                <div className="space-y-3">
                  {visitRecords.map((record) => (
                    <div key={record.id} className="p-3 bg-[rgba(0,0,0,0.02)]">
                      <h4 className="text-[13px] font-medium text-gray-900 mb-1">{record.title}</h4>
                      <div className="flex items-center space-x-4 text-[11px] text-[rgba(0,0,0,0.6)]">
                        <span>{record.date}</span>
                        <span>角色：{record.role}</span>
                        <span>技能：{record.skill}</span>
                        <span>行业：{record.industry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无探访记录</p>
              )}
            </div>
          </div>

          {/* 参与活动展示（只读） */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">参与活动（{activities.length}）</h3>
            </div>
            <div className="px-4 py-3">
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-3 bg-[rgba(0,0,0,0.02)]">
                    <h4 className="text-[13px] font-medium text-gray-900 mb-1">{activity.title}</h4>
                    <div className="flex items-center space-x-4 text-[11px] text-[rgba(0,0,0,0.6)]">
                      <span>{activity.date}</span>
                      <span>类别：{activity.category}</span>
                      <span>状态：{activity.status}</span>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无参与活动</p>
                )}
              </div>
            </div>
          </div>

          {/* 删除会员按钮 */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3">
              <Button
                variant="outline"
                onClick={handleDelete}
                className="w-full text-blue-600 border-blue-400 hover:bg-blue-50 hover:border-blue-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除会员
              </Button>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </AdminLayout>
  );
}
