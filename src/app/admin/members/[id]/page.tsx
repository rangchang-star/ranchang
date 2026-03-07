'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Edit, MapPin, Calendar, Phone, Mail, Building, Briefcase, ShieldCheck, Shield } from 'lucide-react';

// 模拟会员数据
const mockMember = {
  id: '1',
  name: '王姐',
  age: 48,
  avatar: '/avatar-3.jpg',
  level: '活跃会员',
  tags: ['普通', '私董案主'],
  joinDate: '2024-01-15',
  status: 'active',
  isFeatured: true,
  phone: '13800123456',
  email: 'wang@example.com',
  company: '某科技公司',
  position: 'CEO',
  industry: '企业服务',
  hardcoreTags: ['供应链专家', '数字化转型'],
  description: '15年供应链管理经验，专注于制造业数字化转型',
  lastLogin: '2024-03-18 09:30',
  activityCount: 12,
  visitCount: 5,
};

export default function AdminMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [memberId, setMemberId] = useState<string>('');

  useEffect(() => {
    params.then(p => setMemberId(p.id));
  }, [params]);

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/members">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">会员详情</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">ID: {memberId}</p>
            </div>
          </div>
          <Link href={`/admin/members/${memberId}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Button>
          </Link>
        </div>

        {/* 基本信息 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={mockMember.avatar}
                  alt={mockMember.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                      {mockMember.name}
                      <span className="ml-2 text-[13px] text-[rgba(0,0,0,0.6)]">
                        {mockMember.age}岁
                      </span>
                    </h3>
                    <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                      {mockMember.company} · {mockMember.position}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mockMember.status === 'active' ? (
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <Shield className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockMember.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-white text-[11px] font-normal"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[11px] font-normal">
                    {mockMember.level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">联系方式</h3>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                <Phone className="w-4 h-4" />
                <span>{mockMember.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                <Mail className="w-4 h-4" />
                <span>{mockMember.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                <Building className="w-4 h-4" />
                <span>{mockMember.company}</span>
              </div>
              <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                <Briefcase className="w-4 h-4" />
                <span>{mockMember.position}</span>
              </div>
            </div>
          </div>

          {/* 行业和能力 */}
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">行业与能力</h3>
            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-[rgba(0,0,0,0.6)]">行业：</span>
                <span className="text-[13px] text-gray-900">{mockMember.industry}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockMember.hardcoreTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-white text-[11px] font-normal"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <span className="text-[11px] text-[rgba(0,0,0,0.6)]">简介：</span>
                <p className="text-[13px] text-[rgba(0,0,0,0.6)] mt-1">{mockMember.description}</p>
              </div>
            </div>
          </div>

          {/* 活动统计 */}
          <div className="px-4 py-3">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">活动统计</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[rgba(0,0,0,0.02)]">
                <p className="text-[20px] font-bold text-gray-900">{mockMember.activityCount}</p>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)]">参与活动</p>
              </div>
              <div className="text-center p-3 bg-[rgba(0,0,0,0.02)]">
                <p className="text-[20px] font-bold text-gray-900">{mockMember.visitCount}</p>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)]">探访次数</p>
              </div>
              <div className="text-center p-3 bg-[rgba(0,0,0,0.02)]">
                <p className="text-[20px] font-bold text-gray-900">{mockMember.status === 'active' ? '活跃' : '未活跃'}</p>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)]">状态</p>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-[rgba(0,0,0,0.6)]">
              <span>加入时间：</span>
              <span>{mockMember.joinDate}</span>
              <span className="mx-2">|</span>
              <span>最后登录：</span>
              <span>{mockMember.lastLogin}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
