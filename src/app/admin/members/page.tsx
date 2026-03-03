'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Eye, ShieldCheck, Shield } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 可用标签（用于搜索）
const availableTags = ['普通', '私董案主', '探访主', '学员', '小组成员'];

// 模拟会员数据
const mockMembers = [
  {
    id: '1',
    name: '王姐',
    age: 48,
    avatar: '/avatar-3.jpg',
    level: '活跃会员',
    tags: ['普通', '私董案主'],
    industry: '企业服务',
    joinDate: '2024-01-15',
    status: 'active',
    isFeatured: true,
  },
  {
    id: '2',
    name: '李明',
    age: 52,
    avatar: '/avatar-2.jpg',
    level: '智囊团',
    tags: ['私董案主', '探访主'],
    industry: '金融投资',
    joinDate: '2024-02-20',
    status: 'active',
    isFeatured: true,
  },
  {
    id: '3',
    name: '张总',
    age: 45,
    avatar: '/avatar-1.jpg',
    level: '种子会员',
    tags: ['学员', '小组成员'],
    industry: '制造业',
    joinDate: '2024-03-01',
    status: 'active',
    isFeatured: false,
  },
  {
    id: '4',
    name: '陈老师',
    age: 50,
    avatar: '/avatar-4.jpg',
    level: '种子会员',
    tags: ['探访主', '学员'],
    industry: '教育培训',
    joinDate: '2024-03-10',
    status: 'inactive',
    isFeatured: false,
  },
];

export default function AdminMembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.level.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === '' || member.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">会员管理</h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">管理平台会员信息</p>
          </div>
          <Button>导出数据</Button>
        </div>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                placeholder="搜索会员姓名、等级..."
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

        {/* 会员列表 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900">
              会员列表（{filteredMembers.length}）
            </h3>
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* 圆形头像 */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-[15px] font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
                        {member.age}岁
                      </span>
                      {member.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[11px] font-normal">
                          首页推荐
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[13px] text-[rgba(0,0,0,0.6)] mb-2">
                      <span>{member.industry}</span>
                      <span>·</span>
                      <span>{member.level}</span>
                      <span>·</span>
                      <span>{member.joinDate} 加入</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.tags.map((tag) => (
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

                <div className="flex items-center space-x-2">
                  {member.status === 'active' ? (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <Shield className="w-5 h-5 text-gray-400" />
                  )}
                  <Link href={`/admin/members/${member.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                  </Link>
                  <Link href={`/admin/members/${member.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  未找到符合条件的会员
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
