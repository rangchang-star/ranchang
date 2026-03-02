'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp, Eye, Download, Users, Share2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';

// 模拟数据
const mockAssetData = {
  id: '1',
  type: 'course',
  typeName: '课程',
  title: 'AI时代供应链管理实战',
  subtitle: '从传统到智能的全面转型指南',
  description: '本课程结合15年供应链管理经验，深入讲解AI技术在供应链管理中的应用实践。课程涵盖AI需求预测、智能库存管理、供应商智能评估、物流优化等核心内容，帮助企业实现供应链数字化转型。',
  cover: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
  price: 999,
  originalPrice: 1999,
  sales: 156,
  views: 2847,
  rating: 4.8,
  reviewCount: 89,
  students: 89,
  category: '企业管理',
  tags: ['供应链', '人工智能', '数字化转型', '实战'],
  instructor: {
    name: '王姐',
    avatar: '/avatar-1.jpg',
    title: '供应链管理专家',
    experience: '15年行业经验',
  },
  chapters: [
    { id: 1, title: '课程介绍与学习指南', duration: '12:30', free: true },
    { id: 2, title: '传统供应链的挑战', duration: '25:45', free: false },
    { id: 3, title: 'AI技术基础与应用场景', duration: '30:20', free: false },
    { id: 4, title: '智能需求预测系统', duration: '28:15', free: false },
    { id: 5, title: '智能库存管理实践', duration: '32:10', free: false },
  ],
  features: [
    '永久观看',
    '课程资料下载',
    '专属学习群',
    '导师答疑',
    '结业证书',
  ],
  reviews: [
    {
      user: '张总',
      avatar: '/avatar-2.jpg',
      rating: 5,
      content: '课程内容非常实用，学完之后直接应用到工作中，效果显著！',
      date: '2024年3月1日',
    },
    {
      user: '李姐',
      avatar: '/avatar-3.jpg',
      rating: 4,
      content: '讲师经验丰富，案例分析很到位，期待更多进阶课程。',
      date: '2024年2月25日',
    },
  ],
  status: 'published',
  createdAt: '2024年2月1日',
};

export default function AssetDetailPage() {
  const params = useParams();
  const [asset] = useState(mockAssetData);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: asset.title,
        text: asset.description.substring(0, 100),
        url: window.location.href,
      });
    }
  };

  const handlePurchase = () => {
    // 这里应该实现购买逻辑
    console.log('购买:', asset.id);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/assets">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">资产详情</h1>
            <Button variant="ghost" onClick={handleShare} className="p-2">
              <Share2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {/* 封面图 */}
          <div className="w-full h-56 overflow-hidden relative">
            <img
              src={asset.cover}
              alt={asset.title}
              className="w-full h-full object-cover"
            />
            {asset.type === 'course' && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Button className="w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100">
                  <Play className="w-6 h-6 text-black ml-1" />
                </Button>
              </div>
            )}
          </div>

          <div className="px-5 space-y-4">
            {/* 标题和价格 */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="rounded-none bg-blue-400 text-white font-normal text-[10px]">
                  {asset.typeName}
                </Badge>
                <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[10px]">
                  {asset.category}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{asset.title}</h1>
              <p className="text-[13px] text-[rgba(0,0,0,0.5)] mb-3">
                {asset.subtitle}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-red-400">¥{asset.price}</span>
                  {asset.originalPrice && (
                    <span className="text-sm text-[rgba(0,0,0,0.3)] line-through">
                      ¥{asset.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= asset.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[rgba(0,0,0,0.1)]'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-[rgba(0,0,0,0.4)] ml-1">
                    {asset.rating} ({asset.reviewCount}评价)
                  </span>
                </div>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[rgba(0,0,0,0.02)] text-center">
                <Eye className="w-5 h-5 text-[rgba(0,0,0,0.3)] mx-auto mb-1" />
                <div className="text-lg font-semibold text-gray-900">{asset.views}</div>
                <div className="text-[9px] text-[rgba(0,0,0,0.4)]">浏览</div>
              </div>
              <div className="p-3 bg-[rgba(0,0,0,0.02)] text-center">
                <Download className="w-5 h-5 text-[rgba(0,0,0,0.3)] mx-auto mb-1" />
                <div className="text-lg font-semibold text-gray-900">{asset.sales}</div>
                <div className="text-[9px] text-[rgba(0,0,0,0.4)]">销量</div>
              </div>
              <div className="p-3 bg-[rgba(0,0,0,0.02)] text-center">
                <Users className="w-5 h-5 text-[rgba(0,0,0,0.3)] mx-auto mb-1" />
                <div className="text-lg font-semibold text-gray-900">
                  {asset.students || '-'}
                </div>
                <div className="text-[9px] text-[rgba(0,0,0,0.4)]">学员</div>
              </div>
            </div>

            {/* 讲师信息 */}
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              <h2 className="text-[13px] font-semibold text-gray-900 mb-3">讲师介绍</h2>
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={asset.instructor.avatar} alt={asset.instructor.name} />
                  <AvatarFallback>{asset.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-gray-900 mb-0.5">
                    {asset.instructor.name}
                  </div>
                  <div className="text-[11px] text-[rgba(0,0,0,0.4)]">
                    {asset.instructor.title}
                  </div>
                  <div className="text-[10px] text-[rgba(0,0,0,0.3)]">
                    {asset.instructor.experience}
                  </div>
                </div>
              </div>
            </div>

            {/* 课程目录 */}
            {asset.type === 'course' && asset.chapters.length > 0 && (
              <div>
                <h2 className="text-[13px] font-semibold text-gray-900 mb-3">课程目录</h2>
                <div className="space-y-2">
                  {asset.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.02)]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-400 bg-opacity-10 flex items-center justify-center">
                          <span className="text-[11px] text-blue-400 font-semibold">
                            {chapter.id}
                          </span>
                        </div>
                        <span className="text-[13px] text-gray-900">{chapter.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4 text-[rgba(0,0,0,0.3)]" />
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)]">
                          {chapter.duration}
                        </span>
                        {chapter.free && (
                          <Badge className="rounded-none bg-green-400 text-white font-normal text-[9px]">
                            免费
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 课程特色 */}
            {asset.features.length > 0 && (
              <div>
                <h2 className="text-[13px] font-semibold text-gray-900 mb-3">课程特色</h2>
                <div className="grid grid-cols-2 gap-2">
                  {asset.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-[rgba(0,0,0,0.02)]">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-none" />
                      <span className="text-[11px] text-gray-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 课程介绍 */}
            <div>
              <h2 className="text-[13px] font-semibold text-gray-900 mb-2">课程介绍</h2>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {asset.description}
              </p>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 用户评价 */}
            {asset.reviews.length > 0 && (
              <div>
                <h2 className="text-[13px] font-semibold text-gray-900 mb-3">
                  用户评价 ({asset.reviewCount})
                </h2>
                <div className="space-y-3">
                  {asset.reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-[rgba(0,0,0,0.02)]">
                      <div className="flex items-start space-x-3 mb-2">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-gray-900">
                              {review.user}
                            </span>
                            <span className="text-[10px] text-[rgba(0,0,0,0.4)]">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center space-x-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-[rgba(0,0,0,0.1)]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-gray-700">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部固定操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.05)] z-50">
          <div className="w-full max-w-md mx-auto px-5 py-4">
            <Button
              onClick={handlePurchase}
              className="w-full bg-blue-400 hover:bg-blue-500 font-normal text-[15px]"
            >
              立即购买 · ¥{asset.price}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
