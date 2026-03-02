'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 可用标签
const availableTags = ['普通', '私董案主', '探访主', '学员', '小组成员'];

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

// 模拟完整会员数据
const mockMember = {
  id: '1',
  // 基本信息
  name: '王芳',
  age: 45,
  avatar: '/avatar-3.jpg',
  connectionType: 'personLookingForJob',
  industry: '企业服务',
  need: '希望找到传统制造业的数字化转型项目机会，用15年HRBP经验帮助企业搭建AI时代的人才培养体系',
  abilityTags: ['HRBP', '团队管理', '人才发展', '组织优化', '数字化转型'],
  resourceTags: ['人才', '技术', '品牌'],

  // 后台标签
  adminTags: ['普通', '私董案主'],

  // 公司信息
  phone: '13800123000',
  email: 'wang@example.com',
  company: '某科技公司',
  position: 'CEO',
  faith: '基督教',

  // 其他信息
  level: '活跃会员',
  joinDate: '2024-01-15',
  status: 'active',
  isFeatured: true,

  // 高燃宣告
  declaration: {
    direction: 'confidence',
    text: '用15年HRBP经验，帮助企业搭建AI时代的人才培养体系，实现从传统HR到数字化HRBP的转型',
    summary: '基于15年人力资源管理经验，专注于企业数字化转型中的人才体系搭建与AI赋能实践',
    date: '2024年3月1日',
    views: 2847,
    hasAudio: true,
    audioUrl: '/declaration-audio.mp3',
  },

  // 量表评估
  assessments: [
    {
      name: '创业心理评估',
      score: 85,
      level: '优秀',
      summary: '您的创业心理素质全面，具备出色的抗压能力、创新思维和风险把控能力。',
    },
    {
      name: '商业认知评估',
      score: 78,
      level: '良好',
      summary: '您对商业模式和市场策略有基本理解，在财务分析和战略规划方面还有提升空间。',
    },
    {
      name: 'AI认知评估',
      score: 88,
      level: '优秀',
      summary: '您对AI工具有深入理解和丰富实践经验，具备将AI技术落地应用的能力。',
    },
    {
      name: '事业使命感评估',
      score: 82,
      level: '良好',
      summary: '您有清晰的职业使命感，能够将个人价值观与社会价值结合。',
    },
  ],

  // 探访记录
  visitRecords: [
    {
      id: '1',
      title: '上海某制造业企业数字化转型探访',
      date: '2024年3月15日',
      role: '探访人',
      skill: '人力资源',
      industry: '企业转型',
    },
    {
      id: '2',
      title: '杭州科技创业公司战略规划探访',
      date: '2024年3月12日',
      role: '探访人',
      skill: '组织优化',
      industry: '战略规划',
    },
  ],

  // 参与活动
  activities: [
    {
      id: '1',
      title: 'CEO转型期私董会',
      date: '2024年3月20日',
      status: '即将开始',
      category: '私董会',
    },
  ],
};

export default function AdminMemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [memberId, setMemberId] = useState<string>('');

  useEffect(() => {
    params.then(p => setMemberId(p.id));
  }, [params]);
  const [name, setName] = useState(mockMember.name);
  const [age, setAge] = useState(mockMember.age);
  const [connectionType, setConnectionType] = useState(mockMember.connectionType);
  const [industry, setIndustry] = useState(mockMember.industry);
  const [need, setNeed] = useState(mockMember.need);
  const [abilityTags, setAbilityTags] = useState(mockMember.abilityTags);
  const [resourceTags, setResourceTags] = useState(mockMember.resourceTags);
  const [adminTags, setAdminTags] = useState(mockMember.adminTags);
  const [phone, setPhone] = useState(mockMember.phone);
  const [email, setEmail] = useState(mockMember.email);
  const [company, setCompany] = useState(mockMember.company);
  const [position, setPosition] = useState(mockMember.position);
  const [faith, setFaith] = useState(mockMember.faith || '');
  const [isFeatured, setIsFeatured] = useState(mockMember.isFeatured);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleTagToggle = (tag: string, type: 'admin' | 'ability' | 'resource') => {
    const setTags = type === 'admin' ? setAdminTags : type === 'ability' ? setAbilityTags : setResourceTags;
    const currentTags = type === 'admin' ? adminTags : type === 'ability' ? abilityTags : resourceTags;

    if (currentTags.includes(tag)) {
      setTags(currentTags.filter((t) => t !== tag));
    } else {
      setTags([...currentTags, tag]);
    }
  };

  const handleSave = () => {
    console.log('保存会员信息:', {
      id: memberId,
      name,
      age,
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
    });
    alert('会员信息已保存');
    router.back();
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
                    src={mockMember.avatar}
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
                    {mockMember.level} · {mockMember.joinDate} 加入
                  </p>
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

            {/* 能力标签 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">能力标签</h3>
              <div className="flex flex-wrap gap-2">
                {abilityTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-blue-600 text-[11px] font-normal relative group"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag, 'ability')}
                      className="ml-1 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.6)] mt-2">
                当前能力标签：{abilityTags.join('、')}
              </p>
            </div>

            {/* 资源标签 */}
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-4">资源标签（最多3个）</h3>
              <div className="flex flex-wrap gap-2">
                {resourceTagsOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag, 'resource')}
                    className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                      resourceTags.includes(tag)
                        ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border border-blue-400'
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
                        ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border border-blue-400'
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
                    <p className="text-[13px] text-[rgba(0,0,0,0.6)] mb-2">
                      <span className="font-medium text-gray-900">方向：</span>
                      {mockMember.declaration.direction === 'confidence' && '信心'}
                      {mockMember.declaration.direction === 'mission' && '使命'}
                      {mockMember.declaration.direction === 'self' && '自我'}
                      {mockMember.declaration.direction === 'opponent' && '对手'}
                      {mockMember.declaration.direction === 'environment' && '环境'}
                    </p>
                    <p className="text-[13px] text-gray-900 mb-2">{mockMember.declaration.text}</p>
                    <p className="text-[11px] text-[rgba(0,0,0,0.6)] mb-1">{mockMember.declaration.summary}</p>
                    <div className="flex items-center space-x-4 text-[11px] text-[rgba(0,0,0,0.6)]">
                      <span>发布时间：{mockMember.declaration.date}</span>
                      <span>浏览量：{mockMember.declaration.views}</span>
                    </div>
                  </div>
                </div>
                {mockMember.declaration.hasAudio && (
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayAudio}
                      className="w-12 h-12 rounded-full"
                    >
                      {isPlayingAudio ? '⏸' : '▶'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteAudio}
                      className="text-blue-600 border-blue-400 hover:bg-blue-50"
                    >
                      删除录音
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 量表评估展示（只读） */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">量表评估</h3>
            </div>
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-4">
                {mockMember.assessments.map((assessment, index) => (
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
            </div>
          </div>

          {/* 探访记录展示（只读） */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">探访记录（{mockMember.visitRecords.length}）</h3>
            </div>
            <div className="px-4 py-3">
              <div className="space-y-3">
                {mockMember.visitRecords.map((record) => (
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
                {mockMember.visitRecords.length === 0 && (
                  <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无探访记录</p>
                )}
              </div>
            </div>
          </div>

          {/* 参与活动展示（只读） */}
          <div className="border border-[rgba(0,0,0,0.1)]">
            <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
              <h3 className="text-[13px] font-semibold text-gray-900">参与活动（{mockMember.activities.length}）</h3>
            </div>
            <div className="px-4 py-3">
              <div className="space-y-3">
                {mockMember.activities.map((activity) => (
                  <div key={activity.id} className="p-3 bg-[rgba(0,0,0,0.02)]">
                    <h4 className="text-[13px] font-medium text-gray-900 mb-1">{activity.title}</h4>
                    <div className="flex items-center space-x-4 text-[11px] text-[rgba(0,0,0,0.6)]">
                      <span>{activity.date}</span>
                      <span>类别：{activity.category}</span>
                      <span>状态：{activity.status}</span>
                    </div>
                  </div>
                ))}
                {mockMember.activities.length === 0 && (
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
      </div>
    </AdminLayout>
  );
}
