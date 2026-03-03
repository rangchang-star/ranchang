'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Flame, TrendingUp, Briefcase, Award, ChevronRight, PlayCircle, Clock, Heart, Edit, Mic, Upload, RotateCcw, User, Bell, X, CheckCircle, AlertCircle, Info, Calendar, MapPin, Users } from 'lucide-react';

// 量表维度类型
interface AssessmentDimension {
  name: string;
  score: number;
  description: string;
}

// 量表类型
interface Assessment {
  name: string;
  score: number;
  level: string;
  summary: string;
  dimensions: AssessmentDimension[];
}

// 行业数据项（必选）
const industryOptions = [
  '企业服务', '金融投资', '制造业', '教育培训', '医疗健康', 
  '消费零售', '房地产', '互联网', '人工智能', '新能源',
  '汽车行业', '物流运输', '传媒娱乐', '农业', '政府公共',
  '法律咨询', '建筑设计', '化工环保', '通信', '其他'
];

// 资源标签数据项（必选，参考同类平台）
const resourceTags = [
  '资金', '人才', '技术', '渠道', '客户资源',
  '供应链', '品牌', '专利', '场地', '设备',
  '数据资源', '政府关系', '媒体资源', '合作伙伴', '其他'
];

// 人找事/事找人/纯交流选项（必选）
const connectionType = [
  { id: 'personLookingForJob', label: '人找事', description: '我有能力，寻找项目机会' },
  { id: 'jobLookingForPerson', label: '事找人', description: '我有项目，寻找合作伙伴' },
  { id: 'pureExchange', label: '纯交流', description: '只想交流学习，暂无合作需求' }
];

// 通知类型定义
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

// 默认通知数据
const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: '报名审核通过',
    message: '您报名的「转型期私董会」已通过审核，请按时参加',
    time: '2024-03-02 10:30',
    read: false,
    actionUrl: '/activities',
  },
  {
    id: '2',
    type: 'info',
    title: '新的探访邀请',
    message: '张明邀请您参与「上海某制造业企业数字化转型探访」',
    time: '2024-03-01 15:20',
    read: false,
    actionUrl: '/profile',
  },
  {
    id: '3',
    type: 'warning',
    title: '活动即将开始',
    message: '「CEO转型期私董会」将在2小时后开始',
    time: '2024-03-01 08:00',
    read: true,
    actionUrl: '/activities',
  },
];

// 高燃宣告方向选项
const declarationDirections = [
  { id: 'confidence', name: '信心', icon: 'icon-confidence.jpg' },
  { id: 'mission', name: '使命', icon: 'icon-mission.jpg' },
  { id: 'self', name: '自我', icon: 'icon-self.jpg' },
  { id: 'opponent', name: '对手', icon: 'icon-opponent.jpg' },
  { id: 'environment', name: '环境', icon: 'icon-environment.jpg' }
];

// 量表结果数据（基于成熟量表设计）

/**
 * 量表1：创业心理评估
 * 理论基础：心理资本理论（Psychological Capital Theory - Luthans et al.）
 * 参考量表：PCQ-24心理资本问卷、创业自我效能感量表
 */
const entrepreneurialPsychologyAssessment = {
  name: '创业心理评估',
  score: 85,
  level: '优秀',
  summary: '您的创业心理素质全面，具备出色的抗压能力、创新思维和风险把控能力，适合在充满不确定性的创业环境中发挥领导力。',
  dimensions: [
    { name: '抗压韧性', score: 90, description: '面对挫折和压力时的恢复能力' },
    { name: '创新思维', score: 85, description: '产生新想法和解决方案的能力' },
    { name: '团队协作', score: 80, description: '与他人合作并建立信任的能力' },
    { name: '风险意识', score: 82, description: '识别、评估和管理风险的能力' },
    { name: '成就动机', score: 88, description: '追求卓越和实现目标的内在驱动力' },
    { name: '适应性', score: 84, description: '适应变化和环境调整的能力' }
  ]
};

/**
 * 量表2：商业认知评估
 * 理论基础：创业认知理论（Entrepreneurial Cognition Theory - Baron & Shane）
 * 参考量表：商业洞察力评估、创业认知量表
 */
const businessCognitionAssessment = {
  name: '商业认知评估',
  score: 78,
  level: '良好',
  summary: '您对商业模式和市场策略有基本理解，但在财务分析和战略规划方面还有提升空间，建议加强商业系统性思维的训练。',
  dimensions: [
    { name: '市场洞察', score: 75, description: '识别市场机会和用户需求的能力' },
    { name: '商业模式', score: 80, description: '设计和优化盈利模式的能力' },
    { name: '财务分析', score: 72, description: '理解和运用财务指标的能力' },
    { name: '战略规划', score: 85, description: '制定和执行长期战略的能力' },
    { name: '资源整合', score: 76, description: '有效配置和整合资源的能力' },
    { name: '竞争分析', score: 79, description: '理解和应对市场竞争的能力' }
  ]
};

/**
 * 量表3：AI认知评估
 * 理论基础：AI素养框架（EU DigComp Framework）、数字素养模型
 * 参考量表：AI应用能力评估、数字素养问卷
 */
const aiCognitionAssessment = {
  name: 'AI认知评估',
  score: 88,
  level: '优秀',
  summary: '您对AI工具有深入理解和丰富实践经验，具备将AI技术落地应用的能力，是组织中推动AI转型的关键人才。',
  dimensions: [
    { name: 'AI工具应用', score: 92, description: '使用各类AI工具解决实际问题的能力' },
    { name: 'AI趋势理解', score: 85, description: '理解AI发展趋势和技术边界的能力' },
    { name: 'AI思维模式', score: 88, description: '用AI思维优化工作流程的能力' },
    { name: 'AI落地实践', score: 85, description: '将AI技术整合到业务中的能力' },
    { name: 'AI伦理意识', score: 86, description: '理解AI伦理和合规要求的能力' },
    { name: 'AI学习能力', score: 90, description: '持续学习AI新技术的能力' }
  ]
};

/**
 * 量表4：事业使命感评估
 * 理论基础：使命感理论（Calling Theory - Steger et al.）、职业价值观理论（Super）
 * 参考量表：使命承诺量表（Calling and Vocation Questionnaire）、职业价值观问卷
 */
const careerMissionAssessment = {
  name: '事业使命感评估',
  score: 82,
  level: '良好',
  summary: '您有清晰的职业使命感，能够将个人价值观与社会价值结合，建议在使命传达和团队感召方面进一步加强影响力。',
  dimensions: [
    { name: '使命感清晰度', score: 85, description: '对自身使命和愿景的清晰程度' },
    { name: '社会价值认同', score: 80, description: '认同工作对社会贡献的程度' },
    { name: '内在驱动力', score: 84, description: '基于使命感而非外部奖励的工作动力' },
    { name: '使命坚持', score: 78, description: '在困难中坚持使命的韧性' },
    { name: '使命传达', score: 79, description: '向他人传达使命和价值观的能力' },
    { name: '使命整合', score: 86, description: '将使命融入日常工作决策的能力' }
  ]
};

// 用户基本信息
const userInfo = {
  id: '1', // 用户ID，用于匹配探访记录中的访客
  name: '王芳',
  age: 45,
  avatar: '/avatar-3.jpg',
  connectionType: 'personLookingForJob', // 人找事/事找人/纯交流
  industry: '企业服务',
  need: '希望找到传统制造业的数字化转型项目机会，用15年HRBP经验帮助企业搭建AI时代的人才培养体系',
  abilityTags: ['HRBP', '团队管理', '人才发展', '组织优化', '数字化转型'],
  resourceTags: ['人才', '技术', '品牌'],
  currentDeclaration: {
    direction: 'confidence',
    text: '用15年HRBP经验，帮助企业搭建AI时代的人才培养体系，实现从传统HR到数字化HRBP的转型',
    summary: '基于15年人力资源管理经验，专注于企业数字化转型中的人才体系搭建与AI赋能实践',
    date: '2024年3月1日',
    views: 2847,
  },
  assessments: [entrepreneurialPsychologyAssessment, businessCognitionAssessment, aiCognitionAssessment, careerMissionAssessment] as Assessment[],
};

// 探访记录（管理员后台确认后出现）
const visitRecords = [
  {
    id: '1',
    title: '上海某制造业企业数字化转型探访',
    date: '2024年3月15日',
    role: '探访人',
    skill: '人力资源',
    industry: '企业转型',
    visitors: [
      { id: '2', name: '李明', avatar: '/avatar-2.jpg', skill: '战略' },
      { id: '1', name: '王芳', avatar: '/avatar-3.jpg', skill: '人力资源' },
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=120&fit=crop',
  },
  {
    id: '2',
    title: '杭州科技创业公司战略规划探访',
    date: '2024年3月12日',
    role: '探访人',
    skill: '组织优化',
    industry: '战略规划',
    visitors: [
      { id: '1', name: '王芳', avatar: '/avatar-3.jpg', skill: '组织优化' },
      { id: '4', name: '赵芳', avatar: '/avatar-3.jpg', skill: '运营' },
    ],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=120&fit=crop',
  },
];

// 参与的活动
const activities = [
  {
    id: '1',
    title: 'CEO转型期私董会',
    date: '2024年3月20日',
    time: '14:00-17:00',
    location: '上海·静安',
    status: '待参加',
    category: '私董会',
    description: '针对35+职场转型人群，通过私董会形式深度探讨职业转型路径。我们将围绕"如何利用过往经验"、"如何降低试错成本"等话题展开讨论。',
    participants: 12,
    enrolled: 8,
  },
  {
    id: '2',
    title: 'AI加油圈2026期',
    date: '2024年3月15日',
    time: '19:00-21:00',
    location: '北京·朝阳',
    status: '待审核',
    category: '沙龙',
    description: '邀请不同领域的专家分享AI在各行业的应用实践，促进跨界交流与合作。适合对AI商业化感兴趣的朋友参与。',
    participants: 30,
    enrolled: 20,
  },
];

// 咨询话题
// 咨询师信息
const consultantInfo = {
  name: '大鱼老师',
  avatar: '/avatar-1.jpg',
  tags: ['燃场CEO', 'AICG工程师', '心理咨询师', '投资人'],
};

// 咨询话题
const consultationTopics = [
  {
    id: 'ai-frontier',
    name: 'AI前沿',
    placeholder: '您在AI应用中遇到什么挑战？请描述具体场景，例如：如何将AI整合到现有业务流程中、选择合适的AI工具、AI实施的风险和成本控制等...',
    icon: '🤖',
  },
  {
    id: 'entrepreneur-psychology',
    name: '创业心理',
    placeholder: '作为创业者，您最困扰的是什么？请描述您的心境，例如：如何应对创业不确定性、团队管理中的心理挑战、失败后的心理重建、如何保持创业激情等...',
    icon: '🧠',
  },
  {
    id: 'business-logic',
    name: '商业逻辑',
    placeholder: '您的商业模式中遇到什么困惑？请具体描述，例如：如何找到盈利点、如何设计可持续的商业模式、如何验证市场需求、如何优化成本结构等...',
    icon: '💡',
  },
  {
    id: 'mission-navigation',
    name: '使命导航',
    placeholder: '您对事业使命有什么迷茫？请详细说明，例如：如何找到个人使命感、使命与现实的冲突、如何传递使命给团队、使命与盈利的平衡等...',
    icon: '🎯',
  },
];

// 数字资产产出
const digitalAssets = [
  {
    id: '1',
    title: 'AI时代HRBP实战手册',
    description: '基于15年经验总结的AI赋能人力资源管理全流程指南',
    type: '文档',
    size: '3.8MB',
    likes: 156,
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop',
  },
  {
    id: '2',
    title: '企业人才培养体系模板',
    description: '包含招聘、培养、晋升、激励全环节的实用模板',
    type: '表格',
    size: '2.1MB',
    likes: 234,
    cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&h=120&fit=crop',
  },
];

// 量表图标映射
const getAssessmentIcon = (name: string) => {
  if (name === '创业心理评估') return '🧠';
  if (name === '商业认知评估') return '💼';
  if (name === 'AI认知评估') return '🤖';
  if (name === '事业使命感评估') return '🎯';
  return '📊';
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'records' | 'assets'>('records');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [showActivityDetail, setShowActivityDetail] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[0] | null>(null);
  
  // 咨询相关状态
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [consultationQuestion, setConsultationQuestion] = useState('');
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);
  const [showProfileGuideDialog, setShowProfileGuideDialog] = useState(false);
  const [guideType, setGuideType] = useState<'login' | 'profile' | null>(null);

  // 过滤出包含当前用户作为访客的探访记录
  const userVisitRecords = visitRecords.filter((record) =>
    record.visitors.some((visitor) => visitor.id === userInfo.id)
  );

  // 获取未读通知数量
  const unreadCount = notifications.filter(n => !n.read).length;

  // 获取通知图标
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // 标记通知为已读
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 检查用户基础信息
  const checkUserProfile = (): boolean => {
    // 模拟检查是否登录（实际应该从全局状态或cookie获取）
    const isLoggedIn = true; // 假设已登录

    if (!isLoggedIn) {
      setGuideType('login');
      setShowProfileGuideDialog(true);
      return false;
    }

    // 检查基础信息是否完整
    const isProfileComplete = userInfo.name && userInfo.industry && userInfo.connectionType;

    if (!isProfileComplete) {
      setGuideType('profile');
      setShowProfileGuideDialog(true);
      return false;
    }

    return true;
  };

  // 处理话题选择
  const handleTopicSelect = (topicId: string) => {
    // 先检查基础信息
    if (!checkUserProfile()) {
      return;
    }
    // 如果信息完整，则选择话题
    setSelectedTopic(topicId);
  };

  // 提交咨询
  const handleSubmitConsultation = async () => {
    if (!selectedTopic) {
      alert('请选择咨询话题');
      return;
    }
    if (!consultationQuestion.trim()) {
      alert('请输入您的问题');
      return;
    }

    setIsSubmittingConsultation(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const topic = consultationTopics.find(t => t.id === selectedTopic);
      console.log('提交咨询:', {
        topic: topic?.name,
        question: consultationQuestion,
        userId: userInfo.id,
      });

      alert('咨询提交成功！我们会尽快回复您。');
      setSelectedTopic('');
      setConsultationQuestion('');
    } catch (error) {
      console.error('提交咨询失败:', error);
      alert('提交咨询失败，请重试');
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  // 功能菜单数据结构
  interface MenuItem {
    icon: any;
    label: string;
    subtitle: string;
    action: string;
    route: string;
  }

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // 从localStorage加载宣告数量并动态生成menuItems
  useEffect(() => {
    const loadDeclarationCount = () => {
      try {
        const storedDeclarations = localStorage.getItem('userDeclarations');
        let count = 0;
        if (storedDeclarations) {
          const declarations = JSON.parse(storedDeclarations);
          count = Array.isArray(declarations) ? declarations.length : 0;
        }

        // 动态生成menuItems，"我的宣告"数量从localStorage读取
        const items: MenuItem[] = [
          {
            icon: Flame,
            label: '我的宣告',
            subtitle: `${count}条`,
            action: 'view-declarations',
            route: '/declarations',
          },
          {
            icon: TrendingUp,
            label: '探访记录',
            subtitle: '2次',
            action: 'view-visits',
            route: '/visit/1',
          },
          {
            icon: Award,
            label: '数字资产',
            subtitle: '2个',
            action: 'view-assets',
            route: '/assets',
          },
          {
            icon: Briefcase,
            label: '参与活动',
            subtitle: '2个',
            action: 'view-activities',
            route: '/activities',
          },
        ];

        setMenuItems(items);
      } catch (error) {
        console.error('Failed to load declaration count:', error);
        // 如果加载失败，使用默认值
        const items: MenuItem[] = [
          {
            icon: Flame,
            label: '我的宣告',
            subtitle: '0条',
            action: 'view-declarations',
            route: '/declarations',
          },
          {
            icon: TrendingUp,
            label: '探访记录',
            subtitle: '2次',
            action: 'view-visits',
            route: '/visit/1',
          },
          {
            icon: Award,
            label: '数字资产',
            subtitle: '2个',
            action: 'view-assets',
            route: '/assets',
          },
          {
            icon: Briefcase,
            label: '参与活动',
            subtitle: '2个',
            action: 'view-activities',
            route: '/activities',
          },
        ];
        setMenuItems(items);
      }
    };

    loadDeclarationCount();

    // 监听localStorage变化（当其他页面添加宣告时，这里也会更新）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userDeclarations') {
        loadDeclarationCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white pb-14">
      {/* 手机H5宽度 */}
      <div className="w-full max-w-md mx-auto">
        <div className="px-5 pt-[60px] pb-4 space-y-8">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-gray-900">个人中心</h1>
            <div className="flex items-center space-x-2">
              {/* 消息按钮 */}
              <button
                className="relative p-2 hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-blue-400" />
                {/* 红点 */}
                {unreadCount > 0 ? (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                ) : (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white" />
                )}
              </button>
              {/* 设置按钮 */}
              <Link href="/settings" className="p-2 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                <Settings className="w-5 h-5 text-blue-400" />
              </Link>
            </div>
          </div>

          {/* 消息弹窗 */}
          {showNotifications && (
            <div className="absolute right-0 top-14 w-80 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-xl z-50 overflow-hidden">
              {/* 弹窗头部 */}
              <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-[13px] font-semibold text-gray-900">消息通知</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-700"
                    >
                      全部已读
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-[rgba(0,0,0,0.05)] rounded"
                  >
                    <X className="w-4 h-4 text-[rgba(0,0,0,0.6)]" />
                  </button>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-[13px] text-[rgba(0,0,0,0.6)]">
                    暂无消息
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.02)] transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          setShowNotifications(false);
                          // 这里可以添加跳转逻辑
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-[13px] font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                          </div>
                          <p className="text-[12px] text-[rgba(0,0,0,0.6)] mb-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 底部查看全部 */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-[rgba(0,0,0,0.1)]">
                  <button
                    className="w-full py-2 text-[12px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    查看全部消息
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 用户信息卡片 */}
          <div className="p-4 bg-white relative">
            {/* 标签戳 */}
            {userInfo.connectionType && (
              <div className={`absolute top-0 right-0 px-2 py-0.5 text-[9px] font-medium rounded-bl-md z-10 border-l-2 border-t-2 ${
                userInfo.connectionType === 'personLookingForJob'
                  ? 'bg-[rgba(34,197,94,0.15)] text-gray-600 border-gray-400'
                  : userInfo.connectionType === 'jobLookingForPerson'
                  ? 'bg-blue-100 text-gray-600 border-gray-400'
                  : 'bg-gray-100 text-gray-600 border-gray-400'
              }`}>
                {connectionType.find(t => t.id === userInfo.connectionType)?.label}
              </div>
            )}

            <div className="flex items-start space-x-4">
              {/* 方形头像 */}
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden relative">
                <Image
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-400 flex items-center justify-center">
                  <Upload className="w-3 h-3 text-white" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{userInfo.name}</h2>
                  <p className="text-[13px] text-[rgba(0,0,0,0.25)]">{userInfo.age}岁</p>
                </div>
                {/* 行业标签 */}
                <div className="mt-2">
                  <span className="px-2.5 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal line-clamp-1">
                    {userInfo.industry}
                  </span>
                </div>
              </div>
            </div>

            {/* 能力标签 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {userInfo.abilityTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1"
                >
                  {tag}
                </span>
              ))}
              <button className="px-2.5 py-1 border border-dashed border-[rgba(0,0,0,0.25)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                +添加
              </button>
            </div>

            {/* 资源标签 */}
            <div className="mt-4">
              <div className="text-[11px] text-[rgba(0,0,0,0.25)] mb-2">资源标签（必填）</div>
              <div className="flex flex-wrap gap-2">
                {userInfo.resourceTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal line-clamp-1"
                  >
                    {tag}
                  </span>
                ))}
                <button className="px-2.5 py-1 border border-dashed border-[rgba(0,0,0,0.25)] text-[rgba(0,0,0,0.25)] text-[11px] font-normal">
                  +添加
                </button>
              </div>
            </div>

            {/* 一句说清你的需要 */}
            <div className="mt-4 p-3 bg-[rgba(0,0,0,0.02)]">
              <div className="text-[11px] text-[rgba(0,0,0,0.25)] mb-1">一句话说清你的需求</div>
              <p className="text-[13px] text-gray-900 leading-relaxed line-clamp-3">
                {userInfo.need}
              </p>
            </div>

            {/* 当前宣告 */}
            <div className="mt-4 p-3 bg-[rgba(0,0,0,0.02)]">
              <div className="flex items-start space-x-2">
                <Flame className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[rgba(0,0,0,0.25)]">
                      {declarationDirections.find(d => d.id === userInfo.currentDeclaration.direction)?.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                        <Mic className="w-3 h-3 text-[rgba(0,0,0,0.25)]" />
                      </button>
                      <button className="p-1 hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                        <PlayCircle className="w-3 h-3 text-[rgba(0,0,0,0.25)]" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-900 leading-relaxed line-clamp-2 mb-2">
                    {userInfo.currentDeclaration.text}
                  </p>
                  <p className="text-[11px] text-[rgba(0,0,0,0.25)] leading-relaxed line-clamp-2 mb-2">
                    {userInfo.currentDeclaration.summary}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[rgba(0,0,0,0.25)]">
                    <span>{userInfo.currentDeclaration.date}</span>
                    <span>{userInfo.currentDeclaration.views.toLocaleString()}次</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 编辑按钮 */}
            <div className="mt-4 flex justify-center">
              <Link href="/profile/edit">
                <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[11px] px-6 py-2 flex items-center space-x-2">
                  <Edit className="w-3 h-3" />
                  <span>完善资料</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* 引导说明 */}
          <div className="p-4 bg-[rgba(59,130,246,0.05)] border border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-gray-900 mb-1">完善您的个人资料</h3>
                <p className="text-[11px] text-[rgba(0,0,0,0.4)] leading-relaxed">
                  完善资料后，您的信息将在"发现光亮"页面向其他会员展示，帮助您快速找到匹配的合作伙伴和机会。
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-[10px] text-[rgba(0,0,0,0.4)]">下一步：</span>
                  <Link href="/profile/edit" className="text-[10px] text-[rgba(0,0,0,0.4)] underline">
                    完善资料
                  </Link>
                  <span className="text-[10px] text-[rgba(0,0,0,0.4)]">或</span>
                  <Link href="/activities" className="text-[10px] text-[rgba(0,0,0,0.4)] underline">
                    参与活动
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 量表结果展示 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">量表</span>
                <span className="text-blue-400">评估</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-5">
              {userInfo.assessments.map((assessment: Assessment, idx: number) => (
                <div key={idx} className="p-4 bg-white">
                  {/* 量表标题和总分 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getAssessmentIcon(assessment.name)}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{assessment.name}</h3>
                        <Badge className={`rounded-none font-normal text-[10px] mt-1 ${
                          assessment.level === '优秀' ? 'bg-green-100 text-green-600' : 
                          assessment.level === '良好' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {assessment.level} · {assessment.score}分
                        </Badge>
                      </div>
                    </div>
                    <Link
                      href={`/assessment/${assessment.name === '创业心理评估' ? 'entrepreneurial-psychology' : assessment.name === '商业认知评估' ? 'business-cognition' : assessment.name === 'AI认知评估' ? 'ai-cognition' : 'career-mission'}`}
                    >
                      <Button className="bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.25)] font-normal text-[10px] px-3 py-1 h-7 flex items-center space-x-1">
                        <RotateCcw className="w-3 h-3" />
                        <span>重新测试</span>
                      </Button>
                    </Link>
                  </div>

                  {/* 一句话总结 */}
                  <div className="p-3 bg-[rgba(0,0,0,0.02)] mb-3">
                    <p className="text-[12px] text-gray-700 leading-relaxed">
                      {assessment.summary}
                    </p>
                  </div>

                  {/* 维度条形图 */}
                  <div className="space-y-2">
                    {assessment.dimensions.map((dimension: AssessmentDimension, dimIdx: number) => (
                      <div key={dimIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[rgba(0,0,0,0.25)]">
                          <span className="font-medium">{dimension.name}</span>
                          <span>{dimension.score}分</span>
                        </div>
                        <div className="w-full bg-[rgba(0,0,0,0.05)] h-2">
                          <div 
                            className={`h-2 rounded-none transition-all ${
                              dimension.score >= 90 ? 'bg-green-500' :
                              dimension.score >= 80 ? 'bg-blue-500' :
                              dimension.score >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${dimension.score}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-[rgba(0,0,0,0.25)] pl-1">
                          {dimension.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          {/* 活动详情弹窗 */}
          {showActivityDetail && selectedActivity && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* 背景遮罩 */}
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowActivityDetail(false)}
              />
              
              {/* 弹窗内容 */}
              <div className="relative bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                {/* 弹窗头部 */}
                <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-gray-900">活动详情</h3>
                  <button
                    onClick={() => setShowActivityDetail(false)}
                    className="p-1 hover:bg-[rgba(0,0,0,0.05)] rounded"
                  >
                    <X className="w-4 h-4 text-[rgba(0,0,0,0.6)]" />
                  </button>
                </div>

                {/* 弹窗内容 */}
                <div className="p-4 space-y-4">
                  {/* 活动标题 */}
                  <div>
                    <h4 className="text-[15px] font-bold text-gray-900 mb-2">{selectedActivity.title}</h4>
                    <Badge
                      className={`rounded-none font-normal text-[11px] ${
                        selectedActivity.status === '待参加'
                          ? 'bg-blue-400 text-white'
                          : selectedActivity.status === '待审核'
                          ? 'bg-yellow-400 text-white'
                          : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)]'
                      }`}
                    >
                      {selectedActivity.status}
                    </Badge>
                  </div>

                  {/* 活动信息 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[13px] text-[rgba(0,0,0,0.6)]">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedActivity.date} {selectedActivity.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[13px] text-[rgba(0,0,0,0.6)]">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[13px] text-[rgba(0,0,0,0.6)]">
                      <Users className="w-4 h-4" />
                      <span>已报名 {selectedActivity.enrolled}/{selectedActivity.participants} 人</span>
                    </div>
                  </div>

                  {/* 活动描述 */}
                  <div>
                    <h5 className="text-[13px] font-semibold text-gray-900 mb-2">活动介绍</h5>
                    <p className="text-[13px] text-[rgba(0,0,0,0.6)] leading-relaxed">
                      {selectedActivity.description}
                    </p>
                  </div>
                </div>

                {/* 弹窗底部 */}
                <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.1)]">
                  <Button
                    className="w-full bg-blue-400 hover:bg-blue-500 text-white text-[13px]"
                    onClick={() => setShowActivityDetail(false)}
                  >
                    关闭
                  </Button>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* 探访记录 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">探访</span>
                <span className="text-blue-400">记录</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-3">
              {userVisitRecords.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                    暂无探访记录
                  </p>
                  <p className="text-[11px] text-[rgba(0,0,0,0.4)] mt-1">
                    探访记录将在后台探访管理中添加访客后显示
                  </p>
                </div>
              ) : (
                userVisitRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                      <Image
                        src={record.image}
                        alt={record.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                        {record.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-[10px] text-[rgba(0,0,0,0.25)] mb-2">
                        <span>{record.date}</span>
                        <span>·</span>
                        <Badge className="rounded-none bg-[rgba(34,197,94,0.15)] text-green-600 font-normal text-[10px]">
                          {record.industry}
                        </Badge>
                        <span>·</span>
                        <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px]">
                          {record.role}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {record.visitors.map((visitor, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <Image
                                src={visitor.avatar}
                                alt={visitor.name}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[9px]">
                              {visitor.skill}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* 参与的活动 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">参与</span>
                <span className="text-blue-400">活动</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowActivityDetail(true);
                      }}
                    >
                      {activity.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] text-[rgba(0,0,0,0.25)]">
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] font-normal text-[10px]">
                        {activity.category}
                      </Badge>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-none font-normal text-[10px] ml-2 flex-shrink-0 ${
                      activity.status === '待参加'
                        ? 'bg-blue-400 text-white'
                        : activity.status === '待审核'
                        ? 'bg-yellow-400 text-white'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)]'
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* 我要咨询 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                <span className="text-[rgba(96,165,250,0.6)]">我要</span>
                <span className="text-blue-400">咨询</span>
              </h2>
            </div>
            <div className="h-[1px] bg-[rgba(0,0,0,0.05)] mb-4" />
            
            {/* 话题选择 */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-[12px] text-[rgba(0,0,0,0.6)]">选择话题：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {consultationTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTopicSelect(topic.id)}
                    className={`px-2 py-1.5 text-[12px] font-normal transition-colors flex items-center space-x-1 flex-1 min-w-[calc(25%-8px)] max-w-[calc(25%-8px)] justify-center ${
                      selectedTopic === topic.id
                        ? 'bg-[rgba(59,130,246,0.4)] text-white'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                    }`}
                  >
                    <span className="text-[10px]">{topic.icon}</span>
                    <span className="whitespace-nowrap">{topic.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 问题输入 */}
            {selectedTopic && (
              <div className="space-y-3">
                {/* 咨询师信息 */}
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-400">
                    <img
                      src={consultantInfo.avatar}
                      alt={consultantInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-gray-900 mb-2">
                      你要咨询的人是<span className="font-semibold">"{consultantInfo.name}"</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {consultantInfo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[rgba(59,130,246,0.1)] text-blue-600 text-[10px] font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <textarea
                    value={consultationQuestion}
                    onChange={(e) => setConsultationQuestion(e.target.value)}
                    placeholder={consultationTopics.find(t => t.id === selectedTopic)?.placeholder}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px] resize-none"
                  />
                </div>
                <Button
                  onClick={handleSubmitConsultation}
                  disabled={isSubmittingConsultation}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white rounded-none"
                >
                  {isSubmittingConsultation ? '提交中...' : '提交咨询'}
                </Button>
              </div>
            )}
          </div>

          {/* 功能菜单 */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.route}
                className="w-full p-4 bg-white hover:bg-[rgba(0,0,0,0.02)] transition-colors flex items-center"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-[rgba(0,0,0,0.05)] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[rgba(0,0,0,0.25)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.label}
                      </span>
                      <span className="text-[13px] text-[rgba(0,0,0,0.25)] line-clamp-1">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.25)] ml-3 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 基础信息引导对话框 */}
      {showProfileGuideDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-md">
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">
                {guideType === 'login' ? '请先登录' : '请完善基础信息'}
              </h3>
              <button
                onClick={() => setShowProfileGuideDialog(false)}
                className="p-1 hover:bg-gray-100 rounded-none"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-4">
              {guideType === 'login' ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium mb-1">登录后才可发起咨询</p>
                      <p className="text-xs text-gray-600">请先登录账号，以便我们更好地为您提供服务</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Info className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium mb-1">请完善基础信息</p>
                      <p className="text-xs text-gray-600 mb-2">为了让咨询师更好地了解您，请先完善以下基础信息：</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 姓名</li>
                        <li>• 行业</li>
                        <li>• 连接类型（人找事/事找人/纯交流）</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="flex border-t border-gray-200">
              <button
                onClick={() => setShowProfileGuideDialog(false)}
                className="flex-1 py-3 text-sm text-gray-600 hover:bg-gray-50 border-r border-gray-200"
              >
                稍后再说
              </button>
              <button
                onClick={() => {
                  setShowProfileGuideDialog(false);
                  if (guideType === 'login') {
                    // 跳转到登录页面
                    window.location.href = '/login';
                  } else {
                    // 跳转到个人资料页面
                    window.location.href = '/profile/edit';
                  }
                }}
                className="flex-1 py-3 text-sm text-white bg-[rgba(59,130,246,0.4)] hover:bg-[rgba(59,130,246,0.5)]"
              >
                {guideType === 'login' ? '去登录' : '去完善'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
