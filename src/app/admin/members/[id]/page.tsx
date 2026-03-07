'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Edit, MapPin, Calendar, Phone, Mail, Building, Briefcase, ShieldCheck, Shield, Loader2 } from 'lucide-react';

// 会员数据类型
interface Member {
  id: string;
  name: string;
  age: number;
  avatar: string;
  level: string;
  tags: string[];
  industry: string;
  joinDate: string;
  status: string;
  isFeatured: boolean;
  phone: string;
  email: string;
  company: string;
  position: string;
  bio: string;
  need: string;
  tagStamp: string;
  hardcoreTags: string[];
  resourceTags: string[];
  role: string;
  connectionCount: number;
  activityCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [memberId, setMemberId] = useState<string>('');
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setMemberId(p.id));
  }, [params]);

  // 从API加载会员详情
  useEffect(() => {
    async function loadMemberDetail() {
      if (!memberId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/admin/api/members/${memberId}`);

        if (!response.ok) {
          throw new Error('加载会员详情失败');
        }

        const data = await response.json();

        if (data.success && data.data) {
          setMember(data.data);
        } else {
          throw new Error(data.error || '加载会员详情失败');
        }
      } catch (err: any) {
        console.error('加载会员详情失败:', err);
        setError(err.message || '加载会员详情失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadMemberDetail();
  }, [memberId]);

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

        {/* 加载状态 */}
        {isLoading && (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-red-500">{error}</p>
          </div>
        )}

        {/* 会员详情 */}
        {!isLoading && !error && member && (
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={member.avatar}
                  alt={member.name}
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
                      {member.name}
                      <span className="ml-2 text-[13px] text-[rgba(0,0,0,0.6)]">
                        {member.age}岁
                      </span>
                    </h3>
                    <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                      {member.company} · {member.position}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.status === 'active' ? (
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <Shield className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] text-[rgba(0,0,0,0.6)] mr-1">后台标签：</span>
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[rgba(59,130,246,0.4)] text-white text-[11px] font-normal"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] text-[11px] font-normal">
                    {member.level}
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
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                <Mail className="w-4 h-4" />
                <span>{member.email || '未设置'}</span>
              </div>
              <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                <Building className="w-4 h-4" />
                <span>{member.company}</span>
              </div>
              <div className="flex items-center space-x-2 text-[rgba(0,0,0,0.6)]">
                <Briefcase className="w-4 h-4" />
                <span>{member.position}</span>
              </div>
            </div>
          </div>

          {/* 行业和能力 */}
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">行业与能力</h3>
            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-[rgba(0,0,0,0.6)]">行业：</span>
                <span className="text-[13px] text-gray-900">{member.industry}</span>
              </div>
              <div>
                <span className="text-[11px] text-[rgba(0,0,0,0.6)] mr-2">硬核标签（必填）：</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {member.hardcoreTags && member.hardcoreTags.length > 0 ? (
                    member.hardcoreTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-blue-100 text-blue-600 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">未设置</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[rgba(0,0,0,0.6)] mr-2">资源标签（必填）：</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {member.resourceTags && member.resourceTags.length > 0 ? (
                    member.resourceTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-normal"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-[rgba(0,0,0,0.4)]">未设置</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[rgba(0,0,0,0.6)]">简介：</span>
                <p className="text-[13px] text-[rgba(0,0,0,0.6)] mt-1">{member.bio || member.need}</p>
              </div>
            </div>
          </div>

          {/* 活动统计 */}
          <div className="px-4 py-3">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">活动统计</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[rgba(0,0,0,0.02)]">
                <p className="text-[20px] font-bold text-gray-900">{member.activityCount}</p>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)]">参与活动</p>
              </div>
              <div className="text-center p-3 bg-[rgba(0,0,0,0.02)]">
                <p className="text-[20px] font-bold text-gray-900">{member.connectionCount}</p>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)]">连接数</p>
              </div>
              <div className="text-center p-3 bg-[rgba(0,0,0,0.02)]">
                <p className="text-[20px] font-bold text-gray-900">{member.status === 'active' ? '活跃' : '未活跃'}</p>
                <p className="text-[11px] text-[rgba(0,0,0,0.6)]">状态</p>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-[rgba(0,0,0,0.6)]">
              <span>加入时间：</span>
              <span>{member.joinDate}</span>
              <span className="mx-2">|</span>
              <span>更新时间：</span>
              <span>{new Date(member.updatedAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
