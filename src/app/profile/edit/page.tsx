'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, Upload, Plus, X, Mic, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';

// 数据验证函数：检查特殊字符
const containsSpecialChars = (str: string): boolean => {
  // 允许中文、英文、数字、空格、常见标点符号
  const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s\u002c\u002e\uff0c\u3002\uff01\uff1f\u0021\uff1f\u0022\u201c\u201d\u2018\u2019\uff08\uff09\u0028\u0029\u3010\u3011\u300a\u300b\u002d\u2014\u005f]+$/;
  return !validPattern.test(str);
};

// 防XSS攻击：转义HTML特殊字符
const escapeHtml = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// 模拟数据
const mockUserProfile = {
  avatar: '/avatar-1.jpg',
  name: '王姐',
  gender: 'female',
  age: 38,
  phone: '13800138888',
  email: 'wang***@example.com',
  companyName: '',
  companyScale: '',
  companyPosition: '',
  purpose: '人找事', // 人找事/事找人/纯交流
  industry: '制造业',
  industryTags: ['供应链', '智能制造', '数字化转型'],
  resources: ['AI技术', '供应链资源', '企业培训'],
  declaration: '用15年供应链管理经验，帮助传统企业实现AI转型',
  directions: ['信心', '使命', '自我'],
};

const companyScales = [
  '1-10人',
  '10-50人',
  '50-100人',
  '100-500人',
  '500人以上',
];

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

const hardcoreTags = [
  '团队管理',
  '沟通能力',
  '战略思维',
  '执行力',
  '项目管理',
  '创新思维',
  '问题解决',
  '领导力',
  '学习能力',
  '跨界整合',
  '风险控制',
  '资源整合',
  '商业谈判',
  '数据分析',
  '市场洞察',
];

const directions = [
  { id: 'confidence', name: '信心', icon: '/icon-confidence.jpg' },
  { id: 'mission', name: '使命', icon: '/icon-mission.jpg' },
  { id: 'self', name: '自我', icon: '/icon-self.jpg' },
  { id: 'future', name: '未来', icon: '/icon-future.jpg' },
  { id: 'growth', name: '成长', icon: '/icon-growth.jpg' },
];

function ProfileEditContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const { user, isLoggedIn } = useAuth();

  // 根据登录用户数据初始化用户资料
  const getUserProfile = () => {
    if (!isLoggedIn || !user) {
      // 未登录时返回默认的mock数据
      return mockUserProfile;
    }

    // 将登录用户数据映射到编辑页面需要的格式
    return {
      avatar: user.avatar || mockUserProfile.avatar,
      name: user.name || user.nickname || mockUserProfile.name,
      gender: 'female', // 暂时默认，实际可以从用户数据中获取
      age: user.age || mockUserProfile.age,
      phone: user.phone || mockUserProfile.phone,
      email: '', // 暂时为空
      companyName: user.company || '',
      companyScale: '',
      companyPosition: user.position || '',
      purpose: getPurposeFromTagStamp(user.tagStamp),
      industry: user.industry || mockUserProfile.industry,
      industryTags: user.hardcoreTags || mockUserProfile.industryTags,
      resources: user.resourceTags || mockUserProfile.resources,
      declaration: user.bio || mockUserProfile.declaration,
      directions: mockUserProfile.directions,
    };
  };

  // 辅助函数：将 tagStamp 转换为 purpose
  const getPurposeFromTagStamp = (tagStamp?: string): string => {
    if (!tagStamp) return '纯交流';
    if (tagStamp === 'personLookingForJob') return '人找事';
    if (tagStamp === 'jobLookingForPerson') return '事找人';
    return '纯交流';
  };

  const [profile, setProfile] = useState(getUserProfile());
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(profile.purpose);
  const [selectedIndustryTag, setSelectedIndustryTag] = useState<string>(profile.industryTags[0] || '');
  const [selectedResources, setSelectedResources] = useState<string[]>(profile.resources);
  const [customResource, setCustomResource] = useState('');
  const [selectedAbilityTags, setSelectedAbilityTags] = useState<string[]>(profile.industryTags || []);
  const [customAbility, setCustomAbility] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<string>(profile.directions[0] || '');

  // 当用户数据变化时，更新profile状态
  useEffect(() => {
    if (isLoggedIn && user) {
      const newProfile = getUserProfile();
      setProfile(newProfile);
      setSelectedPurpose(newProfile.purpose);
      setSelectedIndustryTag(newProfile.industryTags[0] || '');
      setSelectedResources(newProfile.resources);
      setSelectedAbilityTags(newProfile.industryTags || []);
    }
  }, [isLoggedIn, user]);
  
  // 高燃宣告数据结构 - 每个方向独立管理主题、简介、音频
  const [declarations, setDeclarations] = useState<Record<string, {
    theme: string;          // 宣告主题
    description: string;    // 宣告内容
    audioUrl?: string;      // 音频URL
    isRecording: boolean;   // 是否正在录音
    hasRecorded: boolean;   // 是否已录制
  }>>({});
  
  // 重录确认对话框
  const [showReRecordDialog, setShowReRecordDialog] = useState(false);
  const [directionToReRecord, setDirectionToReRecord] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'reRecord' | 'delete' | null>(null);

  // 工作经历状态
  const [experiences, setExperiences] = useState<Array<{
    company: string;
    position: string;
    duration: string;
  }>>([]);

  // 主要成就状态
  const [achievements, setAchievements] = useState<string[]>([]);

  const handlePurposeSelect = (purpose: string) => {
    setSelectedPurpose(purpose);
  };

  const handleIndustryTagSelect = (tag: string) => {
    setSelectedIndustryTag(tag);
  };

  const handleDirectionSelect = (directionId: string) => {
    setSelectedDirection(directionId);
    // 切换方向时不需要重置录音状态，保留之前的录音
  };

  const handleDirectionRecord = (directionId: string) => {
    // 只有勾选了方向才能录音
    if (selectedDirection !== directionId) {
      return;
    }

    const currentDeclaration = declarations[directionId] || { theme: '', description: '', isRecording: false, hasRecorded: false };

    if (currentDeclaration.hasRecorded) {
      // 如果已经录制过，弹出确认对话框（重录）
      setDirectionToReRecord(directionId);
      setActionType('reRecord');
      setShowReRecordDialog(true);
    } else if (currentDeclaration.isRecording) {
      // 停止录音
      setDeclarations(prev => ({
        ...prev,
        [directionId]: { 
          ...prev[directionId],
          isRecording: false, 
          hasRecorded: true 
        }
      }));
    } else {
      // 开始录音
      setDeclarations(prev => ({
        ...prev,
        [directionId]: { 
          ...prev[directionId],
          isRecording: true, 
          hasRecorded: false 
        }
      }));
    }
  };

  // 确认重录
  const confirmReRecord = () => {
    if (directionToReRecord) {
      setDeclarations(prev => ({
        ...prev,
        [directionToReRecord]: { 
          ...prev[directionToReRecord],
          isRecording: true, 
          hasRecorded: false 
        }
      }));
      setShowReRecordDialog(false);
      setDirectionToReRecord(null);
      setActionType(null);
    }
  };

  // 取消操作
  const cancelAction = () => {
    setShowReRecordDialog(false);
    setDirectionToReRecord(null);
    setActionType(null);
  };

  // 确认删除
  const confirmDelete = () => {
    if (directionToReRecord) {
      setDeclarations(prev => ({
        ...prev,
        [directionToReRecord]: { 
          ...prev[directionToReRecord],
          audioUrl: undefined,
          hasRecorded: false 
        }
      }));
      setShowReRecordDialog(false);
      setDirectionToReRecord(null);
      setActionType(null);
    }
  };

  // 播放录音
  const handlePlayRecording = (directionId: string) => {
    const declaration = declarations[directionId];
    if (declaration?.audioUrl) {
      const audio = new Audio(declaration.audioUrl);
      audio.play();
    }
  };

  // 删除录音
  const handleDeleteRecording = (directionId: string) => {
    setDirectionToReRecord(directionId);
    setActionType('delete');
    setShowReRecordDialog(true);
  };

  // 更新宣告主题
  const updateDeclarationTheme = (directionId: string, theme: string) => {
    setDeclarations(prev => ({
      ...prev,
      [directionId]: { 
        ...prev[directionId],
        theme 
      }
    }));
  };

  // 更新宣告内容
  const updateDeclarationDescription = (directionId: string, description: string) => {
    setDeclarations(prev => ({
      ...prev,
      [directionId]: { 
        ...prev[directionId],
        description 
      }
    }));
  };

  const handleResourceToggle = (resource: string) => {
    if (selectedResources.includes(resource)) {
      setSelectedResources(selectedResources.filter((r) => r !== resource));
    } else {
      // 最多选择三个
      if (selectedResources.length >= 3) {
        alert('资源标签最多选择三个');
        return;
      }
      setSelectedResources([...selectedResources, resource]);
    }
  };

  const handleAddCustomResource = () => {
    const trimmed = customResource.trim();
    if (trimmed && !selectedResources.includes(trimmed)) {
      // 检查长度限制（最多4个汉字）
      if (trimmed.length > 4) {
        alert('资源标签最多4个汉字');
        return;
      }
      // 最多选择三个
      if (selectedResources.length >= 3) {
        alert('资源标签最多选择三个');
        return;
      }
      setSelectedResources([...selectedResources, trimmed]);
      setCustomResource('');
    }
  };

  const handleAbilityTagRemove = (tag: string) => {
    setSelectedAbilityTags(selectedAbilityTags.filter((t) => t !== tag));
  };

  const handleAbilityTagToggle = (tag: string) => {
    if (selectedAbilityTags.includes(tag)) {
      setSelectedAbilityTags(selectedAbilityTags.filter((t) => t !== tag));
    } else {
      // 最多选择三个
      if (selectedAbilityTags.length >= 3) {
        alert('能力标签最多选择三个');
        return;
      }
      setSelectedAbilityTags([...selectedAbilityTags, tag]);
    }
  };

  const handleAddCustomAbility = () => {
    const trimmed = customAbility.trim();
    if (trimmed && !selectedAbilityTags.includes(trimmed)) {
      // 检查长度限制（最多4个汉字）
      if (trimmed.length > 4) {
        alert('能力标签最多4个汉字');
        return;
      }
      // 最多选择三个
      if (selectedAbilityTags.length >= 3) {
        alert('能力标签最多选择三个');
        return;
      }
      setSelectedAbilityTags([...selectedAbilityTags, trimmed]);
      setCustomAbility('');
    }
  };

  // 添加工作经历
  const handleAddExperience = () => {
    setExperiences([...experiences, { company: '', position: '', duration: '' }]);
  };

  // 更新工作经历
  const handleUpdateExperience = (index: number, field: 'company' | 'position' | 'duration', value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  // 删除工作经历
  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // 添加主要成就
  const handleAddAchievement = () => {
    setAchievements([...achievements, '']);
  };

  // 更新主要成就
  const handleUpdateAchievement = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    setAchievements(updated);
  };

  // 删除主要成就
  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // 验证必选项
    const requiredErrors: string[] = [];

    // 验证基本信息
    if (!profile.name || profile.name.trim() === '') {
      requiredErrors.push('姓名或花名');
    } else if (containsSpecialChars(profile.name)) {
      requiredErrors.push('姓名包含非法字符');
    }
    if (!profile.gender) {
      requiredErrors.push('性别');
    }
    if (!profile.age || profile.age <= 0) {
      requiredErrors.push('年龄');
    }
    if (!profile.phone || profile.phone.trim() === '') {
      requiredErrors.push('电话号');
    } else if (!/^1[3-9]\d{9}$/.test(profile.phone.replace(/\s/g, ''))) {
      requiredErrors.push('电话号格式不正确（应为11位手机号）');
    }

    // 验证来这里的目的
    if (!selectedPurpose) {
      requiredErrors.push('来这里的目的');
    }

    // 验证所属行业
    if (!profile.industry) {
      requiredErrors.push('所属行业');
    }

    // 验证一句说清你的需要
    if (!profile.declaration || profile.declaration.trim().length < 20) {
      requiredErrors.push('一句说清你的需要（不少于20字）');
    } else if (profile.declaration.length > 200) {
      requiredErrors.push('一句说清你的需要（不超过200字，当前' + profile.declaration.length + '字）');
    } else if (containsSpecialChars(profile.declaration)) {
      requiredErrors.push('一句说清你的需要包含非法字符');
    }

    // 验证能力标签（必选）
    if (!selectedAbilityTags || selectedAbilityTags.length === 0) {
      requiredErrors.push('能力标签（必选）');
    }

    // 验证高燃宣告（如果选中了方向）
    if (selectedDirection) {
      const declaration = declarations[selectedDirection];
      
      // 验证宣告主题
      if (!declaration?.theme || declaration.theme.trim() === '') {
        requiredErrors.push('宣告主题');
      } else if (declaration.theme.trim().length < 8) {
        requiredErrors.push('宣告主题（不少于8字）');
      } else if (declaration.theme.trim().length > 15) {
        requiredErrors.push('宣告主题（不超过15字）');
      }
      
      // 验证宣告内容
      if (!declaration?.description || declaration.description.trim() === '') {
        requiredErrors.push('宣告内容');
      } else if (declaration.description.trim().length < 25) {
        requiredErrors.push('宣告内容（不少于25字）');
      } else if (declaration.description.trim().length > 60) {
        requiredErrors.push('宣告内容（不超过60字）');
      }
    }

    // 如果有必选项未填写，显示提示
    if (requiredErrors.length > 0) {
      alert('请填写星号必选项：\n' + requiredErrors.join('、'));
      return;
    }

    // 防重复提交检查
    const submitKey = `profile-submit-${Date.now()}`;
    if (sessionStorage.getItem('profile-submitting') === 'true') {
      alert('正在保存中，请勿重复提交');
      return;
    }
    sessionStorage.setItem('profile-submitting', 'true');

    // 组合完整数据
    const fullProfile = {
      ...profile,
      purpose: selectedPurpose,
      industryTags: selectedIndustryTag ? [selectedIndustryTag] : [],
      resources: selectedResources,
      hardcoreTags: selectedAbilityTags,
      directions: selectedDirection ? [selectedDirection] : [],
      declarations, // 保存高燃宣告数据（包含每个方向的主题、简介、音频）
      experiences,
      achievements,
      updatedAt: new Date().toISOString(),
    };

    // 保存到localStorage
    try {
      localStorage.setItem('userProfile', JSON.stringify(fullProfile));

      // 保存宣告数据（新的数据结构）
      const declarationsArray = directions.map(dir => {
        const decl = declarations[dir.id] || { theme: '', description: '', hasRecorded: false };
        return {
          id: dir.id,
          name: dir.name,
          icon: dir.icon,
          theme: decl.theme,
          description: decl.description,
          audioUrl: decl.audioUrl,
          hasRecorded: decl.hasRecorded,
        };
      });

      localStorage.setItem('userDeclarations', JSON.stringify(declarationsArray));

      // 触发自定义事件，通知其他页面更新
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userProfile',
        newValue: JSON.stringify(fullProfile),
        storageArea: window.localStorage,
      }));

      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userDeclarations',
        newValue: JSON.stringify(declarationsArray),
        storageArea: window.localStorage,
      }));

      console.log('保存资料:', fullProfile);
      alert('资料保存成功！');
      window.location.href = '/profile';
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      // 清除提交状态
      setTimeout(() => {
        sessionStorage.removeItem('profile-submitting');
      }, 1000);
    }
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
            <Button onClick={handleSave} className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-4 py-1.5 text-white">
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
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">姓名或花名 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                  placeholder="请输入姓名或花名"
                />
              </div>
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">性别 <span className="text-red-400">*</span></label>
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
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">年龄 <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                  placeholder="请输入年龄"
                />
              </div>
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">电话号 <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                  placeholder="请输入电话号"
                />
              </div>
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">公司名称</label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                  placeholder="请输入公司名称"
                />
              </div>
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">公司规模</label>
                <select
                  value={profile.companyScale}
                  onChange={(e) => setProfile({ ...profile, companyScale: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                >
                  <option value="">请选择公司规模</option>
                  {companyScales.map((scale) => (
                    <option key={scale} value={scale}>
                      {scale}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">公司职位</label>
                <input
                  type="text"
                  value={profile.companyPosition}
                  onChange={(e) => setProfile({ ...profile, companyPosition: e.target.value })}
                  className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                  placeholder="请输入公司职位"
                />
              </div>
            </div>
          </div>

          {/* 来这里的目的 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">来这里的目的（前端展示的角色） <span className="text-red-400">*</span></h2>
            <div className="flex flex-wrap gap-2">
              {['人找事', '事找人', '纯交流'].map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => handlePurposeSelect(purpose)}
                  className={`px-3 py-1.5 text-[11px] border ${
                    selectedPurpose === purpose
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
              className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] resize-none placeholder-[rgba(0,0,0,0.3)]"
              rows={3}
              placeholder="用一句话描述你的需要和目标（不少于20字）"
              minLength={20}
            />
            <p className="text-[10px] text-[rgba(0,0,0,0.4)]">
              {profile.declaration.length}/200字（最少20字）
              {profile.declaration.length < 20 && profile.declaration.length > 0 && (
                <span className="text-red-400 ml-1">还需{20 - profile.declaration.length}字</span>
              )}
              {profile.declaration.length >= 20 && profile.declaration.length <= 200 && (
                <span className="text-green-600 ml-1">✓</span>
              )}
              {profile.declaration.length > 200 && (
                <span className="text-red-400 ml-1">超出{profile.declaration.length - 200}字</span>
              )}
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
            {/* 自定义资源标签输入框 */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customResource}
                onChange={(e) => setCustomResource(e.target.value)}
                maxLength={4}
                className="flex-1 px-3 py-2 text-[11px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                placeholder="自定义资源标签（最多4字）"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomResource();
                  }
                }}
              />
              <button
                onClick={handleAddCustomResource}
                className="px-3 py-2 bg-blue-400 text-white text-[11px] border border-blue-400 hover:bg-blue-500"
              >
                添加
              </button>
            </div>
            {/* 已选资源标签（可删除） */}
            {selectedResources.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedResources.map((resource) => (
                  <span
                    key={resource}
                    className="px-2 py-1 text-[10px] border border-blue-400 bg-blue-400/40 text-blue-400 flex items-center gap-1"
                  >
                    {resource}
                    <button
                      onClick={() => handleResourceToggle(resource)}
                      className="text-blue-400 hover:text-blue-600 font-bold text-xs ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[11px] text-[rgba(0,0,0,0.4)]">点开会员详细页后才能看到资源标签（最多选3个）</p>
          </div>

          {/* 硬核标签 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">硬核标签 <span className="text-red-400">*</span></h2>
            <div className="flex flex-wrap gap-2">
              {hardcoreTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAbilityTagToggle(tag)}
                  className={`px-2 py-1 text-[10px] border ${
                    selectedAbilityTags.includes(tag)
                      ? 'border-blue-400 bg-blue-400/40 text-blue-400'
                      : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* 自定义硬核标签输入框 */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customAbility}
                onChange={(e) => setCustomAbility(e.target.value)}
                maxLength={4}
                className="flex-1 px-3 py-2 text-[11px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                placeholder="自定义硬核标签（最多4字）"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomAbility();
                  }
                }}
              />
              <button
                onClick={handleAddCustomAbility}
                className="px-3 py-2 bg-blue-400 text-white text-[11px] border border-blue-400 hover:bg-blue-500"
              >
                添加
              </button>
            </div>
            {/* 已选硬核标签（可删除） */}
            {selectedAbilityTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedAbilityTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-[10px] border border-blue-400 bg-blue-400/40 text-blue-400 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleAbilityTagToggle(tag)}
                      className="text-blue-400 hover:text-blue-600 font-bold text-xs ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[11px] text-[rgba(0,0,0,0.4)]">前台只显示硬核标签（最多选3个）</p>
          </div>

          {/* 宣告方向 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">
              高燃宣告（请勾选你要前端展示的宣告）
            </h2>
            {/* 宣告方向列表 */}
            <div className="space-y-4">
              {directions.map((direction) => (
                <div
                  key={direction.id}
                  className={`space-y-3 p-3 border ${
                    selectedDirection === direction.id
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-[rgba(0,0,0,0.1)]'
                  }`}
                >
                  {/* 宣告方向标题和勾选 */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDirectionSelect(direction.id)}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-4 h-4 border-2 border-blue-400 flex items-center justify-center">
                        {selectedDirection === direction.id && (
                          <Check className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                      <div className="w-8 h-8 relative">
                        <img
                          src={direction.icon}
                          alt={direction.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[12px] font-semibold">{direction.name}</span>
                    </button>
                    
                    {/* 音频控制按钮 */}
                    {selectedDirection === direction.id && (
                      <div className="flex items-center space-x-2 ml-auto">
                        {/* 播放按钮 */}
                        {declarations[direction.id]?.hasRecorded && (
                          <button
                            onClick={() => handlePlayRecording(direction.id)}
                            className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
                            title="播放录音"
                          >
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        )}
                        
                        {/* 录音按钮 */}
                        <button
                          onClick={() => handleDirectionRecord(direction.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            declarations[direction.id]?.isRecording
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-blue-400 hover:bg-blue-500'
                          }`}
                          title={declarations[direction.id]?.hasRecorded ? "重新录音" : "开始录音"}
                        >
                          <Mic className="w-3 h-3 text-white" />
                        </button>
                        
                        {/* 删除按钮 */}
                        {declarations[direction.id]?.hasRecorded && (
                          <button
                            onClick={() => handleDeleteRecording(direction.id)}
                            className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center hover:bg-gray-500 transition-colors"
                            title="删除录音"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* 选中状态下的输入框 */}
                  {selectedDirection === direction.id && (
                    <div className="space-y-2 pl-7 animate-in slide-in-from-top-2 duration-200">
                      {/* 宣告主题 */}
                      <div>
                        <label className="text-[11px] text-[rgba(0,0,0,0.4)] block mb-1">
                          宣告主题 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={declarations[direction.id]?.theme || ''}
                          onChange={(e) => updateDeclarationTheme(direction.id, e.target.value)}
                          className="w-full px-3 py-2 text-[11px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                          placeholder="请输入宣告主题（8-15字）"
                          maxLength={15}
                        />
                      </div>
                      
                      {/* 宣告内容 */}
                      <div>
                        <label className="text-[11px] text-[rgba(0,0,0,0.4)] block mb-1">
                          宣告内容 <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          value={declarations[direction.id]?.description || ''}
                          onChange={(e) => updateDeclarationDescription(direction.id, e.target.value)}
                          className="w-full px-3 py-2 text-[11px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] resize-none placeholder-[rgba(0,0,0,0.3)]"
                          rows={3}
                          placeholder="请输入宣告内容（25-60字）"
                          minLength={25}
                          maxLength={60}
                        />
                        <p className="text-[10px] text-[rgba(0,0,0,0.4)]">
                          {(declarations[direction.id]?.description || '').length}/60
                        </p>
                      </div>
                      
                      {/* 录音状态提示 */}
                      <div className="text-[10px] text-[rgba(0,0,0,0.4)]">
                        {declarations[direction.id]?.isRecording ? (
                          <span className="text-red-500">🔴 正在录音...</span>
                        ) : declarations[direction.id]?.hasRecorded ? (
                          <span className="text-green-600">✓ 录音完成，可点击播放键试听</span>
                        ) : (
                          <span>点击录音图标开始录制此宣告的音频</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 工作经历 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-gray-900">工作经历</h2>
              <Button
                onClick={handleAddExperience}
                className="text-[11px] bg-blue-400 hover:bg-blue-500 text-white px-3 py-1"
              >
                <Plus className="w-3 h-3 mr-1" />
                添加
              </Button>
            </div>
            <div className="space-y-3">
              {experiences.map((exp, index) => (
                <div key={index} className="p-3 bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">经历 {index + 1}</span>
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      className="text-[rgba(0,0,0,0.4)] hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">公司名称</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] bg-white border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                      placeholder="请输入公司名称"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">职位</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] bg-white border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                      placeholder="请输入职位"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">时间段</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => handleUpdateExperience(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] bg-white border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                      placeholder="例如：2015-至今"
                    />
                  </div>
                </div>
              ))}
              {experiences.length === 0 && (
                <p className="text-[11px] text-[rgba(0,0,0,0.4)] text-center py-4">
                  暂无工作经历，点击"添加"按钮添加
                </p>
              )}
            </div>
          </div>

          {/* 主要成就 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-gray-900">主要成就</h2>
              <Button
                onClick={handleAddAchievement}
                className="text-[11px] bg-blue-400 hover:bg-blue-500 text-white px-3 py-1"
              >
                <Plus className="w-3 h-3 mr-1" />
                添加
              </Button>
            </div>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => handleUpdateAchievement(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-[13px] bg-white border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                    placeholder="请输入主要成就"
                  />
                  <button
                    onClick={() => handleRemoveAchievement(index)}
                    className="p-2 text-[rgba(0,0,0,0.4)] hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="text-[11px] text-[rgba(0,0,0,0.4)] text-center py-4">
                  暂无主要成就，点击"添加"按钮添加
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 确认操作对话框 */}
      {showReRecordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-sm">
            <div className="p-4">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                {actionType === 'delete' ? '确认删除' : '确认重录'}
              </h3>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                {actionType === 'delete' 
                  ? '确定要删除这条录音吗？删除后将无法恢复。'
                  : '重新录音将覆盖之前的录音，确定要继续吗？'
                }
              </p>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                onClick={cancelAction}
                className="flex-1 py-3 text-[13px] text-[rgba(0,0,0,0.6)] hover:bg-gray-50 border-r border-gray-200"
              >
                取消
              </button>
              <button
                onClick={actionType === 'delete' ? confirmDelete : confirmReRecord}
                className={`flex-1 py-3 text-[13px] text-white ${
                  actionType === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-400 hover:bg-blue-500'
                }`}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from 'react';

export default function ProfileEditPage() {
  return (
    <Suspense fallback={<div className="p-4">加载中...</div>}>
      <ProfileEditContent />
    </Suspense>
  );
}
