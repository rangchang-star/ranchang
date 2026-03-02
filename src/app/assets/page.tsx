'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Download, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 模拟数据
const mockDigitalAssets = [
  {
    id: '1',
    type: 'course',
    typeName: '课程',
    title: 'AI时代供应链管理实战',
    cover: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=180&fit=crop',
    price: 999,
    sales: 156,
    views: 2847,
    rating: 4.8,
    students: 89,
    category: '企业管理',
    status: 'published',
    createdAt: '2024年2月1日',
  },
  {
    id: '2',
    type: 'ebook',
    typeName: '电子书',
    title: '35+创业者破局指南',
    cover: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=180&fit=crop',
    price: 99,
    sales: 234,
    views: 1567,
    rating: 4.6,
    students: null,
    category: '创业指导',
    status: 'published',
    createdAt: '2024年1月15日',
  },
  {
    id: '3',
    type: 'course',
    typeName: '课程',
    title: '传统制造业数字化转型',
    cover: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=180&fit=crop',
    price: 1599,
    sales: 78,
    views: 1234,
    rating: 4.9,
    students: 45,
    category: '智能制造',
    status: 'published',
    createdAt: '2024年3月10日',
  },
  {
    id: '4',
    type: 'consulting',
    typeName: '咨询',
    title: '企业AI战略规划咨询',
    cover: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=180&fit=crop',
    price: 4999,
    sales: 12,
    views: 456,
    rating: 5.0,
    students: null,
    category: '战略咨询',
    status: 'published',
    createdAt: '2024年2月20日',
  },
];

export default function DigitalAssetsPage() {
  const [assets] = useState(mockDigitalAssets);

  const totalSales = assets.reduce((sum, asset) => sum + asset.price * asset.sales, 0);
  const totalViews = assets.reduce((sum, asset) => sum + asset.views, 0);
  const totalStudents = assets.reduce((sum, asset) => sum + (asset.students || 0), 0);

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
            <h1 className="text-[15px] font-semibold text-gray-900">数字资产</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* 数据统计 */}
        <div className="px-5 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              <div className="text-xl font-semibold text-gray-900 mb-1">
                ¥{(totalSales / 10000).toFixed(1)}w
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.4)]">总销售额</div>
            </div>
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {totalViews}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.4)]">总浏览</div>
            </div>
            <div className="p-4 bg-[rgba(0,0,0,0.02)]">
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {totalStudents}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.4)]">学员数</div>
            </div>
          </div>
        </div>

        <div className="px-5 space-y-4">
          {/* 资产列表 */}
          {assets.map((asset) => (
            <Link key={asset.id} href={`/asset/${asset.id}`} className="block">
              <div className="p-4 bg-white border border-[rgba(0,0,0,0.05)]">
                <div className="flex items-start space-x-3">
                  {/* 封面图 */}
                  <div className="w-24 h-16 flex-shrink-0 overflow-hidden">
                    <img
                      src={asset.cover}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className="rounded-none bg-blue-400 text-white font-normal text-[9px]">
                        {asset.typeName}
                      </Badge>
                      <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[9px]">
                        {asset.category}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {asset.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-[rgba(0,0,0,0.4)]">
                      <span className="font-semibold text-blue-400">
                        ¥{asset.price}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-0.5" />
                          {asset.views}
                        </span>
                        <span className="flex items-center">
                          <Download className="w-3 h-3 mr-0.5" />
                          {asset.sales}
                        </span>
                        {asset.students !== null && (
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-0.5" />
                            {asset.students}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(0,0,0,0.05)] text-[10px]">
                  <span className="text-[rgba(0,0,0,0.4)]">创建于 {asset.createdAt}</span>
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">
                      ¥{(asset.price * asset.sales / 10000).toFixed(2)}w
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {assets.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[rgba(0,0,0,0.05)] rounded-none flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[rgba(0,0,0,0.25)]" />
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.4)] mb-4">
                还没有数字资产
              </p>
              <Link href="/asset/create">
                <Button className="bg-blue-400 hover:bg-blue-500 font-normal text-[13px]">
                  创建第一个数字资产
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
