'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Upload, Plus, X, Mic, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// 模拟数据
const mockUserProfile = {
  avatar: '/avatar-1.jpg',
  name: '王姐',
  gender: 'female',
  age: 38,
  phone: '138****8888',
  email: 'wang***@example.com',
  purpose: ['人找事'], // 人找事/事找人/纯交流
  industry: '制造业',
  industryTags: ['供应链', '智能制造', '数字化转型'],
  resources: ['AI技术', '供应链资源', '企业培训'],
  declaration: '用15年供应链管理经验，帮助传统企业实现AI转型',
  directions: ['信心', '使命', '自我'],
};

const industries = [
  '互联网/IT/软件',
  '金融/投资/保险',
  '房地产/建筑/物业',
  '制造业/工业',
  '医疗/健康/医药',
  '教育/培训/科研',
  '零售/电商/贸易',
  '服务业',
  '传媒/广告/文化',
  '汽车/交通/物流',
  '能源/环保/化工',
  '政府/公共事业',
  '法律/咨询/专业服务',
  '其他',
];

// 行业标签映射
const industryTagsMap: Record<string, string[]> = {
  '互联网/IT/软件': ['人工智能', '软件开发', '数据分析', '云计算', '网络安全', '移动开发'],
  '金融/投资/保险': ['银行', '证券', '基金', '保险', '投资', '互联网金融'],
  '房地产/建筑/物业': ['房地产开发', '建筑设计', '物业管理', '室内设计', '工程施工'],
  '制造业/工业': ['智能制造', '工业4.0', '供应链', '质量管理', '生产管理'],
  '医疗/健康/医药': ['医疗服务', '医药研发', '医疗器械', '健康管理', '生物制药'],
  '教育/培训/科研': ['在线教育', '职业培训', 'K12教育', '高等教育', '科研机构'],
  '零售/电商/贸易': ['电子商务', '新零售', '跨境电商', '供应链管理', '品牌营销'],
  '服务业': ['餐饮', '酒店', '旅游', '美容美发', '家政服务', '物流配送', '生活服务'],
  '传媒/广告/文化': ['新媒体', '影视制作', '广告策划', '内容创作', '文化传播'],
  '汽车/交通/物流': ['新能源汽车', '智能驾驶', '物流配送', '汽车制造', '交通出行'],
  '能源/环保/化工': ['新能源', '节能环保', '化工新材料', '石油化工', '清洁能源'],
  '政府/公共事业': ['政务管理', '公共服务', '事业单位', '社会组织'],
  '法律/咨询/专业服务': ['法律服务', '管理咨询', '财务咨询', '人力资源', '市场咨询'],
  '其他': ['综合服务', '跨行业', '自由职业'],
};

const resourceTags = [
  'AI技术',
  '供应链资源',
  '企业培训',
  '营销资源',
  '资金支持',
  '人脉资源',
  '法律咨询',
  '财务顾问',
];

const directions = [
  { id: 'confidence', name: '信心', icon: '/icon-confidence.jpg' },
  { id: 'mission', name: '使命', icon: '/icon-mission.jpg' },
  { id: 'self', name: '自我', icon: '/icon-self.jpg' },
  { id: 'future', name: '未来', icon: '/icon-future.jpg' },
  { id: 'growth', name: '成长', icon: '/icon-growth.jpg' },
];

export default function ProfileEditPage() {
  const [profile, setProfile] = useState(mockUserProfile);
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>(profile.purpose);
  const [selectedIndustryTag, setSelectedIndustryTag] = useState<string>(profile.industryTags[0] || '');
  const [selectedResources, setSelectedResources] = useState<string[]>(profile.resources);
  const [selectedDirection, setSelectedDirection] = useState<string>(profile.directions[0] || '');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showDeclarationInput, setShowDeclarationInput] = useState(false);
  const [declarationDescription, setDeclarationDescription] = useState('');

  const handlePurposeToggle = (purpose: string) => {
    if (selectedPurpose.includes(purpose)) {
      setSelectedPurpose(selectedPurpose.filter((p) => p !== purpose));
    } else {
      setSelectedPurpose([...selectedPurpose, purpose]);
    }
  };

  const handleIndustryTagSelect = (tag: string) => {
    setSelectedIndustryTag(tag);
  };

  const handleDirectionSelect = (directionId: string) => {
    setSelectedDirection(directionId);
    // 切换方向时重置录音状态
    setIsRecording(false);
    setHasRecorded(false);
    setShowDeclarationInput(false);
    setDeclarationDescription('');
  };

  const handleDirectionRecord = (directionId: string) => {
    // 只有勾选了方向才能录音
    if (selectedDirection !== directionId) {
      return;
    }

    if (isRecording) {
      // 停止录音
      setIsRecording(false);
      setHasRecorded(true);
      // 录音完成后，显示输入框
      setShowDeclarationInput(true);
    } else {
      // 开始录音
      setIsRecording(true);
      setHasRecorded(false);
      setShowDeclarationInput(false);
    }
  };

  const handleResourceToggle = (resource: string) => {
    if (selectedResources.includes(resource)) {
      setSelectedResources(selectedResources.filter((r) => r !== resource));
    } else {
      setSelectedResources([...selectedResources, resource]);
    }
  };

  const handleSave = () => {
    // 这里应该调用保存API
    console.log('保存资料:', {
      ...profile,
      purpose: selectedPurpose,
      industryTags: selectedIndustryTag ? [selectedIndustryTag] : [],
      resources: selectedResources,
      directions: selectedDirection ? [selectedDirection] : [],
      declarationDescription,
    });
    alert('资料保存成功！');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">编辑资料</h1>
            <Button onClick={handleSave} className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-4 py-1.5">
              保存
            </Button>
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* 头像上传 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
              <Button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded-none flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </Button>
            </div>
            <p className="text-[11px] text-[rgba(0,0,0,0.4)]">点击更换头像</p>
          </div>

          {/* 基本信息 */}
          <div className="space-y-4">
            <h2 className="text-[13px] font-semibold text-gray-900">基本信息</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">姓名</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)]"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">性别</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={profile.gender === 'male'}
                      onChange={() => setProfile({ ...profile, gender: 'male' })}
                      className="w-4 h-4"
                    />
                    <span className="text-[13px]">男</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={profile.gender === 'female'}
                      onChange={() => setProfile({ ...profile, gender: 'female' })}
                      className="w-4 h-4"
                    />
                    <span className="text-[13px]">女</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">年龄</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)]"
                  placeholder="请输入年龄"
                />
              </div>
            </div>
          </div>

          {/* 来这里的目的 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">来这里的目的 <span className="text-red-400">*</span></h2>
            <div className="flex flex-wrap gap-2">
              {['人找事', '事找人', '纯交流'].map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => handlePurposeToggle(purpose)}
                  className={`px-3 py-1.5 text-[11px] border ${
                    selectedPurpose.includes(purpose)
                      ? 'border-blue-400 bg-blue-400/40 text-blue-400'
                      : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>

          {/* 一句说清你的需要 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">一句说清你的需要 <span className="text-red-400">*</span></h2>
            <textarea
              value={profile.declaration}
              onChange={(e) => setProfile({ ...profile, declaration: e.target.value })}
              className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] resize-none"
              rows={3}
              placeholder="用一句话描述你的需要和目标（不少于20字）"
              minLength={20}
            />
            <p className="text-[10px] text-[rgba(0,0,0,0.4)]">
              {profile.declaration.length}/20+
            </p>
          </div>

          {/* 所属行业 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">所属行业 <span className="text-red-400">*</span></h2>
            <div>
              <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">选择行业</label>
              <select
                value={profile.industry}
                onChange={(e) => {
                  setProfile({ ...profile, industry: e.target.value });
                  setSelectedIndustryTag(''); // 切换行业时清空选中的标签
                }}
                className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)]"
              >
                <option value="">请选择行业</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            {/* 行业标签 - 只有选择行业后才显示 */}
            {profile.industry && (
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-2 block">行业标签（单选）</label>
                {selectedIndustryTag && (
                  <div className="mb-2">
                    <span className="px-2 py-1 bg-green-400 bg-opacity-10 text-green-600 text-[10px] flex items-center space-x-1">
                      <span>{selectedIndustryTag}</span>
                      <button
                        onClick={() => setSelectedIndustryTag('')}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {(industryTagsMap[profile.industry] || []).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleIndustryTagSelect(tag)}
                      className={`px-2 py-1 text-[10px] border ${
                        selectedIndustryTag === tag
                          ? 'border-green-400 bg-green-400 bg-opacity-10 text-green-600'
                          : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 资源标签 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">资源标签 <span className="text-red-400">*</span></h2>
            <div className="flex flex-wrap gap-2">
              {resourceTags.map((resource) => (
                <button
                  key={resource}
                  onClick={() => handleResourceToggle(resource)}
                  className={`px-2 py-1 text-[10px] border ${
                    selectedResources.includes(resource)
                      ? 'border-blue-400 bg-blue-400/40 text-blue-400'
                      : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                  }`}
                >
                  {resource}
                </button>
              ))}
            </div>
          </div>

          {/* 宣告方向 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">
              宣告方向
              <span className="text-[10px] text-[rgba(0,0,0,0.4)] font-normal ml-2">（请勾选你昨天展示的宣告）</span>
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {directions.map((direction) => (
                <button
                  key={direction.id}
                  onClick={() => handleDirectionSelect(direction.id)}
                  className={`relative flex flex-col items-center p-2 border ${
                    selectedDirection === direction.id
                      ? 'border-blue-400 bg-blue-400/40'
                      : 'border-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  {/* 左上角勾选框 */}
                  <div className="absolute top-1 left-1 w-4 h-4 border-2 border-blue-400 flex items-center justify-center">
                    {selectedDirection === direction.id && (
                      <Check className="w-3 h-3 text-blue-400" />
                    )}
                  </div>
                  {/* 图标 */}
                  <div className="w-10 h-10 mb-1 relative">
                    <img
                      src={direction.icon}
                      alt={direction.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* 右下角录音机图标 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectionRecord(direction.id);
                    }}
                    className={`absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      selectedDirection === direction.id && isRecording
                        ? 'bg-red-500 animate-pulse'
                        : selectedDirection === direction.id && hasRecorded
                        ? 'bg-green-500'
                        : selectedDirection === direction.id
                        ? 'bg-blue-400 hover:bg-blue-500'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] mt-1">{direction.name}</span>
                </button>
              ))}
            </div>

            {/* 录音状态提示 */}
            {selectedDirection && (
              <div className="text-[11px] text-[rgba(0,0,0,0.4)]">
                {isRecording ? (
                  <span className="text-red-500">🔴 正在录音...</span>
                ) : hasRecorded ? (
                  <span className="text-green-600">✓ 录音完成，请填写简述</span>
                ) : (
                  <span>点击录音图标开始录音此宣告</span>
                )}
              </div>
            )}

            {/* 宣告简述输入框 - 只有勾选并录音后才显示 */}
            {showDeclarationInput && selectedDirection && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] block">此宣告简述（不少于20字）</label>
                <textarea
                  value={declarationDescription}
                  onChange={(e) => setDeclarationDescription(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] resize-none"
                  rows={3}
                  placeholder="请输入此宣告的简述..."
                  minLength={20}
                />
                <p className="text-[10px] text-[rgba(0,0,0,0.4)]">
                  {declarationDescription.length}/20+
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
