'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, Star, Share2, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `探访记录 - ${visit.target.name}`,
        text: visit.outcome,
        url: window.location.href,
      });
    }
  };

  const handleContact = () => {
    // 这里应该实现联系功能
    console.log('联系:', visit.target.name);
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
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">拜访时间</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">{visit.location}</div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">拜访地点</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-[rgba(0,0,0,0.3)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  {visit.participants} 人参与
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.4)]">参与人数</div>
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

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              onClick={handleContact}
              className="flex-1 bg-blue-400 hover:bg-blue-500 font-normal text-[13px]"
            >
              <Phone className="w-4 h-4 mr-2" />
              联系
            </Button>
            <Button
              onClick={handleContact}
              variant="outline"
              className="flex-1 font-normal text-[13px]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              消息
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
