'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Calendar, Share2, Heart, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/bottom-nav';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState, useEffect } from 'react';

// 模拟数据
const mockAbilityData = {
  '1': {
    id: '1',
    name: '王姐',
    age: 48,
    avatar: '/avatar-1.jpg',
    industry: '制造业',
    location: '上海',
    tagStamp: 'personLookingForJob', // 人找事
    need: '希望找到传统制造业的数字化项目机会',
    resources: ['AI技术', '供应链资源', '企业培训'],
    description: '拥有20年制造业供应链管理经验，曾主导过多个大型制造企业的数字化转型项目。熟悉ERP系统实施、供应链优化、成本控制等领域。现寻求相关项目合作机会。',
    experience: [
      { company: '某大型制造企业', position: '供应链总监', duration: '2015-至今' },
      { company: '某知名咨询公司', position: '高级顾问', duration: '2010-2015' },
    ],
    skills: ['供应链管理', 'ERP实施', '数字化转型', '成本控制', '流程优化'],
    achievements: [
      '主导完成某500强企业供应链数字化转型',
      '为企业节省成本超过2000万元',
      '获得企业数字化转型最佳实践奖',
    ],
    isTrusted: true,
  },
  '2': {
    id: '2',
    name: '李明',
    age: 52,
    avatar: '/avatar-2.jpg',
    industry: '金融投资',
    location: '北京',
    tagStamp: 'jobLookingForPerson', // 事找人
    need: '想寻找优质项目对接投资机构',
    resources: ['资金支持', '人脉资源', '财务顾问'],
    description: '拥有25年金融投资行业经验，曾任职于多家知名投资机构，专注于企业战略规划和投融资业务。擅长帮助企业进行资本运作、战略布局。',
    experience: [
      { company: '某知名投资机构', position: '合伙人', duration: '2010-至今' },
      { company: '某投资银行', position: '董事总经理', duration: '2000-2010' },
    ],
    skills: ['投融资', '战略规划', '资本运作', '企业并购', '上市辅导'],
    achievements: [
      '成功投资30+项目，总规模超过50亿元',
      '帮助10+企业完成IPO',
      '获得年度最佳投资总监奖',
    ],
    isTrusted: false,
  },
  '3': {
    id: '3',
    name: '赵芳',
    age: 45,
    avatar: '/avatar-3.jpg',
    industry: '企业服务',
    location: '深圳',
    tagStamp: 'personLookingForJob', // 人找事
    need: '需要搭建企业的人才培养体系',
    resources: ['企业培训', '人脉资源', '法律咨询'],
    description: '18年人力资源管理经验，曾在多家知名企业担任HRD，擅长人才梯队建设、组织发展、企业文化打造等。',
    experience: [
      { company: '某互联网公司', position: '人力资源总监', duration: '2018-至今' },
      { company: '某外企', position: 'HRBP', duration: '2012-2018' },
    ],
    skills: ['人力资源', '人才梯队建设', '组织发展', '企业文化', '绩效考核'],
    achievements: [
      '搭建企业人才管理体系，培养100+骨干人才',
      '推动企业文化建设，员工满意度提升30%',
      '获得年度最佳HR团队奖',
    ],
    isTrusted: true,
  },
  '4': {
    id: '4',
    name: '陈伟',
    age: 50,
    avatar: '/avatar-4.jpg',
    industry: '消费零售',
    location: '广州',
    tagStamp: 'jobLookingForPerson', // 事找人
    need: '寻找优质的营销合作项目',
    resources: ['营销资源', '品牌资源', 'AI技术'],
    description: '20年市场营销经验，曾主导过多个知名品牌的营销战役，擅长品牌建设、市场推广、数字营销等。',
    experience: [
      { company: '某知名品牌', position: '营销总监', duration: '2015-至今' },
      { company: '某广告公司', position: '创意总监', duration: '2010-2015' },
    ],
    skills: ['市场营销', '品牌建设', '数字营销', '市场推广', '活动策划'],
    achievements: [
      '主导品牌升级，品牌知名度提升50%',
      '打造多个爆款营销案例',
      '获得年度最佳营销案例奖',
    ],
    isTrusted: false,
  },
  '5': {
    id: '5',
    name: '刘芳',
    age: 47,
    avatar: '/avatar-5.jpg',
    industry: '专业服务',
    location: '杭州',
    tagStamp: 'personLookingForJob', // 人找事
    need: '为企业提供专业的财务咨询服务',
    resources: ['财务顾问', '税务筹划', '法律咨询'],
    description: '20年财务顾问经验，注册会计师，擅长税务筹划、财务分析、内部控制等，曾服务过多家上市公司。',
    experience: [
      { company: '某会计师事务所', position: '合伙人', duration: '2012-至今' },
      { company: '某上市公司', position: '财务经理', duration: '2005-2012' },
    ],
    skills: ['财务顾问', '税务筹划', '财务分析', '内部控制', '审计'],
    achievements: [
      '为50+企业提供财务咨询服务',
      '帮助企业节省税务成本超过1000万元',
      '获得年度优秀注册会计师',
    ],
    isTrusted: true,
  },
};

export default function AbilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    message: '此功能暂时关闭，需要对接人与资源联系"燃场app"工作人员。',
    contact: 'v:13023699913',
  });

  // 从 localStorage 读取联系信息
  useEffect(() => {
    try {
      const settings = localStorage.getItem('pageSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        if (parsedSettings.contactInfo) {
          setContactInfo(parsedSettings.contactInfo);
        }
      }
    } catch (error) {
      console.error('读取联系信息失败:', error);
    }
  }, []);

  const person = mockAbilityData[id as keyof typeof mockAbilityData];

  if (!person) {
    return (
      <div className="min-h-screen bg-white pb-14">
        <div className="w-full max-w-md mx-auto px-5 pt-6">
          <Link href="/discovery">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
          </Link>
          <div className="mt-8 text-center text-gray-500">
            未找到该用户信息
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-14">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="px-5 pt-6 pb-4 border-b border-[rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <Link href="/discovery">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 个人信息 */}
        <div className="px-5 py-6 space-y-6">
          {/* 头像和基本信息 */}
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {person.name}
              </h1>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-[rgba(0,0,0,0.6)]">{person.age}岁</span>
                <span className="text-sm text-[rgba(0,0,0,0.4)]">·</span>
                <span className="text-sm text-[rgba(0,0,0,0.6)]">{person.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* 行业标签 - 1个，绿色 */}
                <Badge className="bg-[rgba(34,197,94,0.15)] text-green-600 text-xs">
                  {person.industry}
                </Badge>
                {/* 资源标签 - 3个，蓝色 */}
                {person.resources && person.resources.slice(0, 3).map((resource) => (
                  <Badge
                    key={resource}
                    className="bg-[rgba(59,130,246,0.1)] text-blue-600 text-xs"
                  >
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 标签戳 */}
          <div className="px-4 py-3 bg-[rgba(0,0,0,0.02)] rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-900">
                {person.tagStamp === 'personLookingForJob' ? '人找事' : '事找人'}
              </span>
            </div>
            <p className="text-sm text-[rgba(0,0,0,0.6)] mt-2">
              {person.need}
            </p>
          </div>

          {/* 个人介绍 */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">个人介绍</h2>
            <p className="text-sm text-[rgba(0,0,0,0.6)] leading-relaxed">
              {person.description}
            </p>
          </div>

          {/* 硬核经历 */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">硬核经历</h2>
            <div className="space-y-3">
              {person.experience.map((exp, index) => (
                <div key={index} className="px-4 py-3 bg-[rgba(0,0,0,0.02)] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {exp.company}
                    </span>
                    <span className="text-xs text-[rgba(0,0,0,0.4)]">
                      {exp.duration}
                    </span>
                  </div>
                  <div className="text-sm text-[rgba(0,0,0,0.6)]">
                    {exp.position}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 专业技能 */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">专业技能</h2>
            <div className="flex flex-wrap gap-2">
              {person.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 主要成就 */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">主要成就</h2>
            <div className="space-y-2">
              {person.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-[rgba(0,0,0,0.6)]">
                    {achievement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3 pt-4 border-t border-[rgba(0,0,0,0.05)]">
            <Button 
              className="w-full bg-blue-400 hover:bg-blue-500 text-white"
              onClick={() => setShowContactDialog(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              发起连接
            </Button>
          </div>
        </div>
      </div>

      {/* 联系提示对话框 */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="w-[95%] max-w-[400px] p-6">
          <VisuallyHidden>
            <DialogTitle>联系提示</DialogTitle>
          </VisuallyHidden>
          
          <div className="space-y-4">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                功能暂时关闭
              </h3>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)] leading-relaxed">
                {contactInfo.message}
              </p>
              <p className="text-[13px] text-blue-600 mt-2 font-medium">
                {contactInfo.contact}
              </p>
            </div>

            <Button
              className="w-full bg-blue-400 hover:bg-blue-500 text-white"
              onClick={() => setShowContactDialog(false)}
            >
              我知道了
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
