'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, Upload, Plus, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUpload, AvatarDisplay } from '@/components/avatar-upload';
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
// 默认用户资料（仅用于未登录时的空状态展示）
const mockUserProfile = {
  avatar: '',
  name: '',
  gender: '',
  age: 0,
  phone: '',
  email: '',
  companyName: '',
  companyScale: '',
  companyPosition: '',
  purpose: '',
  industry: '',
  industryTags: [],
  hardcoreTags: [],
  resources: [],
  declaration: '',
  directions: [],
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

// 硬核标签说明映射
const tagDescriptions: Record<string, string> = {
  'AI技术': '拥抱AI，掌握前沿技术工具',
  '定方向': '做战略、选赛道、不踩坑',
  '带兵打仗': '从管1个人到管100个人的实战能力',
  '从0到1': '冷启动、开荒、从零搭班子',
  '摆平烂摊': '接盘烂项目、救火、危机处理',
  '搞定人': '跨部门推动、向上管理、难缠客户',
  '看懂账本': '算成本、看财报、懂毛利、控预算',
  '攒局组队': '拉资源、找搭档、攒项目',
  '卖出去': '拿单、成交、搞钱',
  '稳军心': '团队动荡、士气低、人心散',
  '搞定自己': '情绪管理、抗压、不崩',
  '找人识人': '招对人、看走眼、搭团队',
  '会说人话': '汇报、路演、谈判、讲明白事',
};

export function ProfileEditContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const { user, isLoggedIn, refreshUser } = useAuth();

  // 根据登录用户数据初始化用户资料
  const getUserProfile = () => {
    if (!isLoggedIn || !user) {
      // 未登录时返回空的默认数据
      return mockUserProfile;
    }

    // 将登录用户数据映射到编辑页面需要的格式
    return {
      avatar: user.avatar || mockUserProfile.avatar,
      name: user.name || mockUserProfile.name,
      gender: user.gender || mockUserProfile.gender,
      age: user.age || mockUserProfile.age,
      phone: user.phone || mockUserProfile.phone,
      email: user.email || mockUserProfile.email,
      companyName: user.company || '',
      companyScale: user.companyScale || mockUserProfile.companyScale,
      companyPosition: user.position || '',
      purpose: getPurposeFromTagStamp(user.tagStamp || undefined),
      industry: user.industry || mockUserProfile.industry,
      industryTags: user.abilityTags || mockUserProfile.industryTags, // 从 user.abilityTags 加载行业标签
      resources: user.resourceTags || mockUserProfile.resources,
      hardcoreTags: user.hardcoreTags || mockUserProfile.hardcoreTags || [], // 硬核标签从用户数据中获取，无则使用默认值
      declaration: user.need || user.bio || mockUserProfile.declaration, // 优先从 user.need 读取，fallback 到 user.bio
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
  const [selectedAbilityTags, setSelectedAbilityTags] = useState<string[]>(profile.hardcoreTags || []);
  const [selectedDirection, setSelectedDirection] = useState<string>(''); // 默认不选择任何方向
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 保存状态

  // 当用户数据变化时，更新profile状态
  useEffect(() => {
    if (isLoggedIn && user) {
      const newProfile = getUserProfile();
      setProfile(newProfile);
      setSelectedPurpose(newProfile.purpose);
      setSelectedIndustryTag(newProfile.industryTags[0] || '');
      setSelectedResources(newProfile.resources);
      setSelectedAbilityTags(newProfile.hardcoreTags || []); // 使用 newProfile.hardcoreTags
    }
  }, [isLoggedIn, user]);

  // 使用 ref 标记是否已刷新过数据，避免重复刷新导致输入被清空
  const hasRefreshedData = useRef(false);

  // 编辑页面加载时，从数据库刷新用户数据（只执行一次）
  useEffect(() => {
    const refreshUserDataFromDatabase = async () => {
      // 如果已经刷新过，就不再执行
      if (hasRefreshedData.current || !isLoggedIn || !user) {
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // 更新 localStorage 中的用户数据
            localStorage.setItem('currentUser', JSON.stringify(data.data));

            // 如果数据库中有硬核经历数据，使用数据库的数据（按用户ID保存）
            if (data.data.experience && Array.isArray(data.data.experience) && data.data.experience.length > 0) {
              setExperiences(data.data.experience);
              localStorage.setItem(`userExperiences_${user.id}`, JSON.stringify(data.data.experience));
            }

            // 如果数据库中有主要成就数据，使用数据库的数据（按用户ID保存）
            if (data.data.achievement && Array.isArray(data.data.achievement) && data.data.achievement.length > 0) {
              setAchievements(data.data.achievement);
              localStorage.setItem(`userAchievements_${user.id}`, JSON.stringify(data.data.achievement));
            }

            // 标记已刷新过
            hasRefreshedData.current = true;
            
            // 关键：调用 refreshUser 更新 AuthContext，确保 getUserProfile 能获取最新数据
            await refreshUser();
          }
        }
      } catch (error) {
        console.error('Failed to refresh user data from database:', error);
      }
    };

    refreshUserDataFromDatabase();
  }, [isLoggedIn, user?.id, refreshUser]);

  // 资源现货 - 简化为简单的主题和内容
  const [declarationType, setDeclarationType] = useState<string>('resource'); // 默认为"资源现货"
  const [declarationTheme, setDeclarationTheme] = useState<string>('');
  const [declarationDescription, setDeclarationDescription] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  // 语音朗读主题
  const handleSpeakTheme = () => {
    console.log('点击了播放按钮');
    console.log('当前主题内容:', declarationTheme);

    if (!declarationTheme.trim()) {
      alert('请先输入主题内容');
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('您的浏览器不支持语音朗读功能');
      return;
    }

    console.log('浏览器支持语音合成');

    // 取消当前的播放
    window.speechSynthesis.cancel();

    // 尝试获取语音列表（某些浏览器需要先获取才能播放）
    const voices = window.speechSynthesis.getVoices();
    console.log('可用语音数量:', voices.length);

    // 等待一下确保语音合成准备好
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(declarationTheme);
      utterance.lang = 'zh-CN'; // 设置为中文
      utterance.rate = 1; // 语速
      utterance.pitch = 1; // 音调
      utterance.volume = 1; // 音量

      // 尝试设置中文语音
      const chineseVoice = voices.find(voice => voice.lang.includes('zh'));
      if (chineseVoice) {
        utterance.voice = chineseVoice;
        console.log('使用中文语音:', chineseVoice.name);
      }

      console.log('准备播放:', utterance);

      utterance.onstart = () => {
        console.log('开始播放');
        setIsPlaying(true);
      };

      utterance.onend = () => {
        console.log('播放结束');
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error('播放错误:', event);
        setIsPlaying(false);
        alert('播放失败，请重试');
      };

      // 尝试播放
      try {
        window.speechSynthesis.speak(utterance);
        console.log('已调用 speak 方法');
      } catch (error) {
        console.error('调用 speak 方法失败:', error);
        alert('播放失败，请重试');
      }
    }, 100);
  };

  // 预加载语音列表（某些浏览器需要）
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('语音列表已加载:', voices.length);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // 硬核经历状态 - 从 localStorage 恢复（按用户ID隔离）
  const [experiences, setExperiences] = useState<Array<{
    company: string;
    position: string;
    duration: string;
  }>>(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`userExperiences_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 主要成就状态 - 从 localStorage 恢复（按用户ID隔离）
  const [achievements, setAchievements] = useState<string[]>(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`userAchievements_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 从 localStorage 恢复资源现货数据（按用户ID隔离）
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`userDeclarations_${user.id}`);
      if (saved) {
        try {
          const parsedDeclarations = JSON.parse(saved);
          // 找到第一个有内容的宣告并恢复
          const activeDeclaration = parsedDeclarations.find((d: any) => d.theme && d.description);
          if (activeDeclaration) {
            setDeclarationTheme(activeDeclaration.theme || '');
            setDeclarationDescription(activeDeclaration.description || '');
          }
        } catch (error) {
          console.error('Failed to restore declarations:', error);
        }
      }
    }
  }, [user?.id]);

  // 从数据库获取用户的资源现货数据
  useEffect(() => {
    const fetchUserDeclarations = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/declarations?userId=${user.id}`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          // 获取最新的资源现货
          const latestDeclaration = result.data[0];
          
          // 更新资源现货状态
          setDeclarationType(latestDeclaration.type || 'resource');
          setDeclarationTheme(latestDeclaration.text || '');
          setDeclarationDescription(latestDeclaration.summary || '');
          
          // 同时保存到 localStorage
          localStorage.setItem(`userDeclarations_${user.id}`, JSON.stringify([{
            type: latestDeclaration.type || 'resource',
            theme: latestDeclaration.text || '',
            description: latestDeclaration.summary || '',
            direction: latestDeclaration.direction || 'confidence',
          }]));

          console.log('从数据库获取到资源现货:', latestDeclaration);
        } else {
          console.log('数据库中没有该用户的资源现货数据');
        }
      } catch (error) {
        console.error('获取资源现货数据失败:', error);
      }
    };

    fetchUserDeclarations();
  }, [user?.id]);

  const handlePurposeSelect = (purpose: string) => {
    setSelectedPurpose(purpose);
  };

  const handleIndustryTagSelect = (tag: string) => {
    setSelectedIndustryTag(tag);
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

  const handleAbilityTagToggle = (tag: string) => {
    if (selectedAbilityTags.includes(tag)) {
      setSelectedAbilityTags(selectedAbilityTags.filter((t) => t !== tag));
    } else {
      // 最多选择三个
      if (selectedAbilityTags.length >= 3) {
        alert('硬核标签最多选择三个');
        return;
      }
      setSelectedAbilityTags([...selectedAbilityTags, tag]);
    }
  };

  // 添加硬核经历
  const handleAddExperience = () => {
    setExperiences([...experiences, { company: '', position: '', duration: '' }]);
  };

  // 更新硬核经历
  const handleUpdateExperience = (index: number, field: 'company' | 'position' | 'duration', value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  // 删除硬核经历
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

  const handleSave = async () => {
    console.log('===== 保存按钮被点击 =====');
    console.log('当前用户:', user);
    console.log('当前profile:', profile);
    console.log('isLoggedIn:', isLoggedIn);

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
    if (profile.declaration && profile.declaration.trim().length > 0) {
      if (profile.declaration.trim().length < 20) {
        requiredErrors.push('一句说清你的需要（不少于20字）');
      } else if (profile.declaration.length > 200) {
        requiredErrors.push('一句说清你的需要（不超过200字，当前' + profile.declaration.length + '字）');
      } else if (containsSpecialChars(profile.declaration)) {
        requiredErrors.push('一句说清你的需要包含非法字符');
      }
    }

    // 验证硬核标签（必选）
    if (!selectedAbilityTags || selectedAbilityTags.length === 0) {
      requiredErrors.push('硬核标签（必选）');
    }

    // 验证资源现货（如果填写了）
    if (declarationTheme || declarationDescription) {
      // 验证主题
      if (!declarationTheme || declarationTheme.trim() === '') {
        requiredErrors.push('主题');
      } else if (declarationTheme.trim().length < 8) {
        requiredErrors.push('主题（不少于8字）');
      } else if (declarationTheme.trim().length > 15) {
        requiredErrors.push('主题（不超过15字）');
      }

      // 验证内容
      if (!declarationDescription || declarationDescription.trim() === '') {
        requiredErrors.push('内容');
      } else if (declarationDescription.trim().length < 25) {
        requiredErrors.push('内容（不少于25字）');
      } else if (declarationDescription.trim().length > 60) {
        requiredErrors.push('内容（不超过60字）');
      }
    }

    // 如果有必选项未填写，显示提示
    if (requiredErrors.length > 0) {
      console.log('验证失败:', requiredErrors);
      alert('请填写星号必选项：\n' + requiredErrors.join('、'));
      return;
    }

    console.log('验证通过，准备保存');

    // 防重复提交检查
    if (isSubmitting) {
      console.log('检测到重复提交，当前状态:', isSubmitting);
      return;
    }

    // 设置提交状态
    setIsSubmitting(true);
    console.log('设置提交状态为 true');

    // 组合完整数据
    const fullProfile = {
      ...profile,
      purpose: selectedPurpose,
      industryTags: selectedIndustryTag ? [selectedIndustryTag] : [],
      resources: selectedResources,
      hardcoreTags: selectedAbilityTags,
      declarationTheme,
      declarationDescription,
      experiences,
      achievements,
      updatedAt: new Date().toISOString(),
    };

    // 保存到localStorage和数据库
    try {
      console.log('===== 开始保存数据 =====');
      console.log('当前提交状态:', isSubmitting);
      console.log('isLoggedIn:', isLoggedIn);
      console.log('user:', user);
      console.log('profile:', profile);
      console.log('selectedPurpose:', selectedPurpose);
      console.log('selectedIndustryTag:', selectedIndustryTag);
      console.log('selectedResources:', selectedResources);
      console.log('selectedAbilityTags:', selectedAbilityTags);

      // 先调用后端 API 保存到数据库
      if (isLoggedIn && user) {
        console.log('准备发送 API 请求到:', `/api/users/${user.id}`);

        const tagStamp = selectedPurpose === '人找事' ? 'personLookingForJob' :
                         selectedPurpose === '事找人' ? 'jobLookingForPerson' : 'pureExchange';

        const requestBody = {
          name: profile.name,
          phone: profile.phone,
          avatar: profile.avatar,
          gender: profile.gender,
          age: profile.age,
          email: profile.email,
          company: profile.companyName,
          companyScale: profile.companyScale,
          position: profile.companyPosition,
          industry: profile.industry,
          need: profile.declaration,
          tagStamp: tagStamp,
          abilityTags: selectedIndustryTag ? [selectedIndustryTag] : [],
          hardcoreTags: selectedAbilityTags,
          resourceTags: selectedResources,
          experience: experiences,
          achievement: achievements,
        };

        console.log('请求体:', requestBody);

        const response = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('API 响应状态:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API 错误:', errorData);
          throw new Error(errorData.error || '保存失败');
        }

        console.log('数据库保存成功');
      } else {
        console.log('未登录，跳过数据库保存');
      }

      // 同时更新 localStorage 以保持前端一致性（按用户ID隔离）
      if (isLoggedIn && user) {
        localStorage.setItem(`userProfile_${user.id}`, JSON.stringify(fullProfile));

        // 更新 currentUser 中的相关字段，确保个人中心页面能读取到最新数据
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        currentUser.name = profile.name;
        currentUser.avatar = profile.avatar;
        currentUser.age = profile.age;
        currentUser.company = profile.companyName;
        currentUser.position = profile.companyPosition;
        currentUser.industry = profile.industry;
        currentUser.need = profile.declaration;
        currentUser.bio = profile.declaration;
        currentUser.hardcoreTags = selectedAbilityTags;
        currentUser.resourceTags = selectedResources;
        currentUser.tagStamp = selectedPurpose === '人找事' ? 'personLookingForJob' :
                             selectedPurpose === '事找人' ? 'jobLookingForPerson' : 'pureExchange';
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // 保存硬核经历（按用户ID隔离）
        localStorage.setItem(`userExperiences_${user.id}`, JSON.stringify(experiences));

        // 保存主要成就（按用户ID隔离）
        localStorage.setItem(`userAchievements_${user.id}`, JSON.stringify(achievements));

        // 保存资源现货到localStorage（按用户ID隔离）
        if (declarationTheme || declarationDescription) {
          localStorage.setItem(`userDeclarations_${user.id}`, JSON.stringify([{
            theme: declarationTheme,
            description: declarationDescription,
            direction: 'confidence',
          }]));
        }
      }

      // 保存资源现货到数据库
      if (isLoggedIn && user) {
        try {
          // 只保存填写了的资源现货（默认方向为"信心"）
          if (declarationTheme && declarationDescription) {
            console.log('保存资源现货到数据库:', { type: declarationType, theme: declarationTheme, description: declarationDescription });

            const declarationRequest = {
              userId: user.id,
              type: declarationType, // 资源现货类型：ability(能力现货), connection(人脉现货), resource(资源现货)
              direction: 'confidence', // 默认方向为信心
              text: declarationTheme, // 主题（简短，8-15字）
              summary: declarationDescription, // 内容（详细，25-60字）
              audioUrl: null,
              views: 0,
              isFeatured: true,
            };

            const declarationResponse = await fetch('/api/declarations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(declarationRequest),
            });

            if (!declarationResponse.ok) {
              const errorData = await declarationResponse.json();
              console.error('保存资源现货失败:', errorData);
              // 不影响主流程，只记录错误
            } else {
              console.log('资源现货保存成功');
            }
          } else {
            console.log('用户没有填写资源现货，跳过保存');
          }
        } catch (error) {
          console.error('保存资源现货到数据库失败:', error);
          // 不影响主流程，只记录错误
        }
      }

      console.log('===== 刷新全局用户状态 =====');
      // 刷新全局用户状态，确保所有页面都能显示最新数据
      await refreshUser();

      console.log('保存资料:', fullProfile);
      console.log('准备跳转到个人中心');
      alert('资料保存成功！');
      window.location.href = '/profile';
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      console.log('清除提交状态');
      // 立即清除提交状态
      setIsSubmitting(false);
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
            <Button 
              onClick={handleSave} 
              disabled={isSubmitting}
              className={`font-normal text-[11px] px-4 py-1.5 text-white ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-400 hover:bg-blue-500'
              }`}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* 头像上传 */}
          <div className="flex flex-col items-center space-y-3">
            <AvatarUpload
              currentAvatarKey={profile.avatar}
              userId={user?.id}
              name={profile.name}
              onUploadSuccess={(fileKey) => setProfile({ ...profile, avatar: fileKey })}
              size="lg"
            />
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
                  onMouseEnter={() => setHoveredTag(tag)}
                  onMouseLeave={() => setHoveredTag(null)}
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
            {/* 硬核标签说明框 */}
            <div className="px-3 py-2 text-[11px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)]">
              {hoveredTag ? tagDescriptions[hoveredTag] : '点击或悬停标签查看技能说明'}
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

          {/* 资源现货 */}
          <div className="space-y-3">
            <h2 className="text-[13px] font-semibold text-gray-900">
              资源现货
            </h2>
            {/* 标签选择器 */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'ability', label: '能力现货' },
                { value: 'connection', label: '人脉现货' },
                { value: 'resource', label: '资源现货' },
              ].map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => setDeclarationType(tag.value)}
                  className={`px-3 py-1.5 text-[11px] border ${
                    declarationType === tag.value
                      ? 'border-blue-400 bg-blue-400/40 text-blue-400'
                      : 'border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)]'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            <div>
              <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">
                主题 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={declarationTheme}
                onChange={(e) => setDeclarationTheme(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.3)]"
                placeholder={
                  declarationType === 'ability'
                    ? '能力主题：30分钟安装openclaw，30分钟教会你养龙虾。'
                    : declarationType === 'connection'
                    ? '人脉主题：20分钟对话阿里P8人力专家，直通大厂人脉'
                    : '资源主题：母婴类供应商资源现货，直接对接不绕路'
                }
                maxLength={15}
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-[rgba(0,0,0,0.4)]">
                  {declarationTheme.length}/15字（8-15字）
                </p>
                <button
                  onClick={handleSpeakTheme}
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                    isPlaying ? 'text-blue-500' : 'text-gray-400'
                  }`}
                  title={isPlaying ? '停止播放' : '朗读主题'}
                >
                  {isPlaying ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">
                内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={declarationDescription}
                onChange={(e) => setDeclarationDescription(e.target.value)}
                className="w-full px-3 py-2.5 text-[13px] bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] resize-none placeholder-[rgba(0,0,0,0.3)]"
                rows={3}
                placeholder={
                  declarationType === 'ability'
                    ? '请输入能力现货内容'
                    : declarationType === 'connection'
                    ? '请输入人脉现货内容'
                    : '请输入资源现货内容'
                }
                minLength={25}
                maxLength={60}
              />
              <p className="text-[10px] text-[rgba(0,0,0,0.4)]">
                {declarationDescription.length}/60字（25-60字）
              </p>
            </div>
          </div>

          {/* 工作经历 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-gray-900">硬核经历</h2>
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
                    <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">战绩一</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 text-[13px] bg-white border border-[rgba(0,0,0,0.05)] placeholder-[rgba(0,0,0,0.2)]"
                      placeholder="说说那些年你干成的事，让我们知道你的厉害。"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1 block">当时职位</label>
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
                  暂无硬核经历，点击"添加"按钮添加
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
