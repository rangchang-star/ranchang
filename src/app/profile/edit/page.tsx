'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Upload, Plus, X } from 'lucide-react';
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
  purpose: ['找人做事'], // 人找事/事找人/纯交流
  industry: '制造业',
  industryTags: ['供应链', '智能制造', '数字化转型'],
  resources: ['AI技术', '供应链资源', '企业培训'],
  declaration: '用15年供应链管理经验，帮助传统企业实现AI转型',
  directions: ['信心', '使命', '自我'],
};

const industries = [
  '制造业',
  '互联网',
  '金融',
  '教育',
  '医疗',
  '零售',
  '房地产',
  '建筑',
  '农业',
  '服务业',
];

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
  const [selectedIndustryTags, setSelectedIndustryTags] = useState<string[]>(profile.industryTags);
  const [selectedResources, setSelectedResources] = useState<string[]>(profile.resources);
  const [selectedDirections, setSelectedDirections] = useState<string[]>(profile.directions);
  const [customIndustry, setCustomIndustry] = useState('');

  const handlePurposeToggle = (purpose: string) => {
    if (selectedPurpose.includes(purpose)) {
      setSelectedPurpose(selectedPurpose.filter((p) => p !== purpose));
    } else {
      setSelectedPurpose([...selectedPurpose, purpose]);
    }
  };

  const handleIndustryTagToggle = (tag: string) => {
    if (selectedIndustryTags.includes(tag)) {
      setSelectedIndustryTags(selectedIndustryTags.filter((t) => t !== tag));
    } else {
      setSelectedIndustryTags([...selectedIndustryTags, tag]);
    }
  };

  const handleAddCustomIndustry = () => {
    if (customIndustry && !selectedIndustryTags.includes(customIndustry)) {
      setSelectedIndustryTags([...selectedIndustryTags, customIndustry]);
      setCustomIndustry('');
    }
  };

  const handleResourceToggle = (resource: string) => {
    if (selectedResources.includes(resource)) {
      setSelectedResources(selectedResources.filter((r) => r !== resource));
    } else {
      setSelectedResources([...selectedResources, resource]);
    }
  };

  const handleDirectionToggle = (direction: string) => {
    if (selectedDirections.includes(direction)) {
      setSelectedDirections(selectedDirections.filter((d) => d !== direction));
    } else {
      setSelectedDirections([...selectedDirections, direction]);
    }
  };

  const handleSave = () => {
    // 这里应该调用保存API
    console.log('保存资料:', {
      ...profile,
      purpose: selectedPurpose,
      industryTags: selectedIndustryTags,
      resources: selectedResources,
      directions: selectedDirections,
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
              {['找人做事', '事找人', '纯交流'].map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => handlePurposeToggle(purpose)}
                  className={`px-3 py-1.5 text-[11px] border ${
                    selectedPurpose.includes(purpose)
                      ? 'border-blue-400 bg-blue-400 bg-opacity-10 text-blue-400'
                      : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>

          {/* 所属行业 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">所属行业 <span className="text-red-400">*</span></h2>
            <div>
              <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">选择行业</label>
              <select
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
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
            <div>
              <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-2 block">行业标签（多选）</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedIndustryTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-green-400 bg-opacity-10 text-green-600 text-[10px] flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleIndustryTagToggle(tag)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => handleIndustryTagToggle(industry)}
                    className={`px-2 py-1 text-[10px] border ${
                      selectedIndustryTags.includes(industry)
                        ? 'border-green-400 bg-green-400 bg-opacity-10 text-green-600'
                        : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-[11px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)]"
                  placeholder="自定义行业标签"
                />
                <Button
                  onClick={handleAddCustomIndustry}
                  className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-3 py-1.5"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
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
                      ? 'border-blue-400 bg-blue-400 bg-opacity-10 text-blue-400'
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
            <h2 className="text-[13px] font-semibold text-gray-900">宣告方向</h2>
            <div className="grid grid-cols-3 gap-2">
              {directions.map((direction) => (
                <button
                  key={direction.id}
                  onClick={() => handleDirectionToggle(direction.id)}
                  className={`flex flex-col items-center p-2 border ${
                    selectedDirections.includes(direction.id)
                      ? 'border-blue-400 bg-blue-400 bg-opacity-10'
                      : 'border-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  <div className="w-10 h-10 mb-1">
                    <img
                      src={direction.icon}
                      alt={direction.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px]">{direction.name}</span>
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
        </div>
      </div>
    </div>
  );
}
