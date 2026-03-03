'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Eye, Plus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 可用标签（用于搜索）
const availableTags = ['已结束', '进行中', 'AI', '智能制造', '金融投资', '数字化转型'];

// 模拟探访数据
const mockVisits = [
  {
    id: '1',
    date: '2024年3月5日',
    time: '14:00-16:00',
    status: 'completed',
    target: {
      name: '张总',
      title: '创始人兼CEO',
      company: '智能制造科技有限公司',
      avatar: '/avatar-2.jpg',
    },
    purpose: '了解企业数字化转型实践，寻求合作机会',
    location: '北京市海淀区中关村软件园',
    participants: 3,
    rating: 5,
    tags: ['已结束', '智能制造', '数字化转型'],
    createdAt: '2024年3月5日 16:30',
  },
  {
    id: '2',
    date: '2024年3月8日',
    time: '10:00-12:00',
    status: 'completed',
    target: {
      name: '李总',
      title: '董事长',
      company: '投资管理有限公司',
      avatar: '/avatar-1.jpg',
    },
    purpose: '探讨AI在投资领域的应用场景',
    location: '上海市浦东新区陆家嘴',
    participants: 5,
    rating: 4,
    tags: ['已结束', 'AI', '金融投资'],
    createdAt: '2024年3月8日 12:30',
  },
  {
    id: '3',
    date: '2024年3月15日',
    time: '09:30-11:30',
    status: 'completed',
    target: {
      name: '王总',
      title: 'CEO',
      company: '工业互联网技术有限公司',
      avatar: '/avatar-3.jpg',
    },
    purpose: '学习工业互联网平台建设经验',
    location: '深圳市南山区科技园',
    participants: 4,
    rating: 5,
    tags: ['已结束', 'AI', '智能制造'],
    createdAt: '2024年3月15日 11:30',
  },
];

export default function AdminVisitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const filteredVisits = mockVisits.filter((visit) => {
    const matchesSearch =
      visit.target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.target.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === '' || visit.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">探访管理</h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">管理点亮页探访内容</p>
          </div>
          <Link href="/admin/visits/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加探访
            </Button>
          </Link>
        </div>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                placeholder="搜索探访对象、公司、目的..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-[13px]"
              />
            </div>
          </div>

          {/* 标签筛选 */}
          <div className="flex items-center space-x-2">
            <span className="text-[13px] text-[rgba(0,0,0,0.6)]">标签筛选：</span>
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                selectedTag === ''
                  ? 'bg-[rgba(59,130,246,0.4)] text-white'
                  : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
              }`}
            >
              全部
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                  selectedTag === tag
                    ? 'bg-[rgba(59,130,246,0.4)] text-white'
                    : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 探访列表 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900">
              探访列表（{filteredVisits.length}）
            </h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {filteredVisits.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无符合条件的探访记录</p>
              </div>
            ) : (
              filteredVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* 圆形头像 */}
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={visit.target.avatar}
                        alt={visit.target.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-[15px] font-semibold text-gray-900">
                          {visit.target.name}
                        </h3>
                        <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                          {visit.target.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[13px] text-[rgba(0,0,0,0.6)] mb-2">
                        <span>{visit.target.company}</span>
                        <span>·</span>
                        <span>{visit.date}</span>
                        <span>·</span>
                        <span>{visit.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-wrap gap-2">
                          {visit.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-white text-[11px] font-normal"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link href={`/visit/${visit.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        预览
                      </Button>
                    </Link>
                    <Link href={`/admin/visits/${visit.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        编辑
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('确定要删除这条探访记录吗？')) {
                          // 实际项目中需要调用删除API
                          console.log('删除探访:', visit.id);
                        }
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
