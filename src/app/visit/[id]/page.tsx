'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, Star, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useParams } from 'next/navigation';

// 模拟数据
const mockVisitData = {
  id: '1',
  date: '2024年3月5日',
  time: '14:00-16:00',
  status: 'completed',
  target: {
    name: '张总',
    title: '创始人兼CEO',
    company: '智能制造科技有限公司',
    industry: '智能制造',
    avatar: '/avatar-2.jpg',
    tags: ['人工智能', '工业互联网', '数字化转型'],
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
  createdAt: '2024年3月5日 16:30',
};

export default function VisitDetailPage() {
  const params = useParams();
  const [visit] = useState(mockVisitData);

  // 申请对话框状态
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wechat: '',
    company: '',
    position: '',
    scale: '',
    industry: '',
    belief: '',
    problem: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    wechat: '',
    industry: '',
    problem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 从本地存储同步用户信息
  const loadUserInfo = () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const info = JSON.parse(userInfo);
        setFormData((prev) => ({
          ...prev,
          name: info.name || prev.name,
          phone: info.phone || prev.phone,
          wechat: info.wechat || prev.wechat,
          company: info.company || prev.company,
          position: info.position || prev.position,
          scale: info.scale || prev.scale,
          industry: info.industry || prev.industry,
          belief: info.belief || prev.belief,
        }));
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  // 打开对话框时加载用户信息
  const handleOpenDialog = () => {
    loadUserInfo();
    setApplyDialogOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `探访记录 - ${visit.target.name}`,
        text: visit.outcome,
        url: window.location.href,
      });
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      phone: '',
      wechat: '',
      industry: '',
      problem: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入电话号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号码';
    }

    if (!formData.wechat.trim()) {
      newErrors.wechat = '请输入微信号';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = '请输入行业';
    }

    if (!formData.problem.trim()) {
      newErrors.problem = '请填写需要解决的问题';
    } else if (formData.problem.trim().length < 10) {
      newErrors.problem = '问题描述至少需要10个字';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  // 处理表单提交
  const handleApplySubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);

      // 模拟提交到后台
      setTimeout(() => {
        setIsSubmitting(false);

        // 保存用户信息到本地存储，以便下次自动填充
        const userInfo = {
          name: formData.name,
          phone: formData.phone,
          wechat: formData.wechat,
          company: formData.company,
          position: formData.position,
          scale: formData.scale,
          industry: formData.industry,
          belief: formData.belief,
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        setApplyDialogOpen(false);

        // 重置表单（保留加载的用户信息）
        setFormData((prev) => ({
          ...prev,
          problem: '',
        }));
        setErrors({
          name: '',
          phone: '',
          wechat: '',
          industry: '',
          problem: '',
        });

        // 模拟添加通知到本地存储
        try {
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          const newNotification = {
            id: `visit-apply-${Date.now()}`,
            type: 'info',
            title: '被访申请已提交',
            message: `您已提交被访申请，请等待审核，我们会尽快与您联系`,
            time: new Date().toLocaleString('zh-CN'),
            read: false,
          };
          localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications]));
        } catch (error) {
          console.error('保存通知失败:', error);
        }

        alert('申请提交成功！我们会尽快审核，请留意通知消息。');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-14">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">探访记录</h1>
            <Button variant="ghost" onClick={handleShare} className="p-2">
              <Share2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
            </Button>
          </div>
        </div>

        <div className="px-5 space-y-5">
          {/* 状态标签 */}
          <div className="flex items-center justify-between">
            <Badge
              className={`rounded-none font-normal text-[11px] ${
                visit.status === 'completed'
                  ? 'bg-green-400 text-white'
                  : 'bg-yellow-400 text-black'
              }`}
            >
              {visit.status === 'completed' ? '已完成' : '进行中'}
            </Badge>
            <span className="text-[10px] text-[rgba(0,0,0,0.4)]">
              记录时间：{visit.createdAt}
            </span>
          </div>

          {/* 拜访对象 */}
          <div className="p-4 bg-[rgba(0,0,0,0.02)]">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-3">拜访对象</h2>
            <div className="flex items-start space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={visit.target.avatar} alt={visit.target.name} />
                <AvatarFallback>{visit.target.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                  {visit.target.name}
                </div>
                <div className="text-[11px] text-[rgba(0,0,0,0.4)] mb-1">
                  {visit.target.title} · {visit.target.company}
                </div>
                <div className="flex flex-wrap gap-1">
                  {visit.target.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[9px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 拜访信息 */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  {visit.date} {visit.time}
                </div>
                <div className="text-[9px] text-[rgba(0,0,0,0.4)]">拜访时间</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">{visit.location}</div>
                <div className="text-[9px] text-[rgba(0,0,0,0.4)]">拜访地点</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  {visit.participants} 人参与
                </div>
                <div className="text-[9px] text-[rgba(0,0,0,0.4)]">参与人数</div>
              </div>
            </div>
          </div>

          {/* 拜访目的 */}
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900 mb-2">拜访目的</h2>
            <p className="text-[13px] text-gray-700 leading-relaxed">{visit.purpose}</p>
          </div>

          {/* 拜访成果 */}
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900 mb-2">拜访成果</h2>
            <p className="text-[13px] text-gray-700 leading-relaxed">{visit.outcome}</p>
          </div>

          {/* 关键要点 */}
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900 mb-2">关键要点</h2>
            <ul className="space-y-1.5">
              {visit.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start text-[13px] text-gray-700">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-none mt-1.5 mr-2 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 下一步计划 */}
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900 mb-2">下一步计划</h2>
            <ul className="space-y-1.5">
              {visit.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start text-[13px] text-gray-700">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-none mt-1.5 mr-2 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 备注 */}
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900 mb-2">备注</h2>
            <p className="text-[13px] text-gray-700 leading-relaxed">{visit.notes}</p>
          </div>

          {/* 评分 */}
          <div>
            <h2 className="text-[13px] font-semibold text-gray-900 mb-2">本次评分</h2>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= visit.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[rgba(0,0,0,0.1)]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 照片 */}
          {visit.images.length > 0 && (
            <div>
              <h2 className="text-[13px] font-semibold text-gray-900 mb-2">现场照片</h2>
              <div className="grid grid-cols-2 gap-2">
                {visit.images.map((image, index) => (
                  <div key={index} className="w-full h-32 overflow-hidden">
                    <img
                      src={image}
                      alt={`照片${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 申请按钮 */}
          <div className="flex justify-center pt-4 pb-4">
            <button
              onClick={handleOpenDialog}
              className="px-6 py-2 rounded-none bg-gradient-to-br from-blue-400 to-blue-500 text-white text-sm font-normal hover:scale-105 hover:-translate-y-0.5 hover:shadow-xl hover:from-blue-500 hover:to-blue-600 active:scale-95 shadow-lg transition-all duration-200"
            >
              申请成为被访者
            </button>
          </div>
        </div>
      </div>

      {/* 申请对话框 */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="w-[95%] max-w-[480px] max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              我需要被探访
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>

          {/* 提示信息 */}
          <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-4">
            请填写您的企业信息，说明您希望通过被访者角色解决什么问题，我们会审核后与您联系。
          </p>

          {/* 表单 */}
          <div className="space-y-4">
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入您的姓名"
                className={errors.name ? 'border-red-400' : ''}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* 电话 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                电话 <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入您的手机号码"
                className={errors.phone ? 'border-red-400' : ''}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* 微信 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                微信号 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.wechat}
                onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
                placeholder="请输入您的微信号"
                className={errors.wechat ? 'border-red-400' : ''}
              />
              {errors.wechat && (
                <p className="text-[11px] text-red-500 mt-1">{errors.wechat}</p>
              )}
            </div>

            {/* 公司名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                公司名称
              </label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="请输入您的公司名称"
              />
            </div>

            {/* 职位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                职位
              </label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="请输入您的职位"
              />
            </div>

            {/* 规模 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                企业规模
              </label>
              <Input
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                placeholder="例如：20-50人、50-100人"
              />
            </div>

            {/* 行业 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                行业 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="请输入您的行业"
                className={errors.industry ? 'border-red-400' : ''}
              />
              {errors.industry && (
                <p className="text-[11px] text-red-500 mt-1">{errors.industry}</p>
              )}
            </div>

            {/* 信仰 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                信仰
              </label>
              <Input
                value={formData.belief}
                onChange={(e) => setFormData({ ...formData, belief: e.target.value })}
                placeholder="如有信仰可填写"
              />
            </div>

            {/* 需要解决的问题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                需要解决的问题 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="请描述您希望通过被访者角色解决什么问题，例如：需要了解行业转型经验、寻找合作伙伴、获取专家建议等..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.problem && (
                <p className="mt-1 text-xs text-red-500">{errors.problem}</p>
              )}
            </div>
          </div>

          {/* 提交按钮 */}
          <Button
            onClick={handleApplySubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white mt-6"
          >
            {isSubmitting ? '提交中...' : '确认申请'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
