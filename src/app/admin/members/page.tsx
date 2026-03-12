'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Eye, ShieldCheck, Shield, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 会员数据类型
interface Member {
  id: string;
  name: string;
  age: number;
  avatar: string;
  level: number;
  tags: string[];
  industry: string;
  joinDate: string;
  status: string;
  isFeatured: boolean;
  phone: string;
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
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // 从 API 加载会员数据
  useEffect(() => {
    async function loadMembers() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/admin/api/members');

        if (!response.ok) {
          throw new Error('加载会员数据失败');
        }

        const data = await response.json();

        if (data.success) {
          setMembers(data.data);
        } else {
          throw new Error(data.error || '加载会员数据失败');
        }
      } catch (err: any) {
        console.error('加载会员数据失败:', err);
        setError(err.message || '加载会员数据失败');
      } finally {
        setIsLoading(false);
      }
    }

    loadMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(member.level).includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === '' || member.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // 收集所有可用的标签
  const availableTags = Array.from(
    new Set(members.flatMap((member) => member.tags))
  );

  // 删除会员
  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`确定要删除会员 "${memberName}" 吗？此操作不可恢复。`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '删除失败');
      }

      // 从列表中移除已删除的会员
      setMembers(members.filter((m) => m.id !== memberId));
    } catch (error: any) {
      alert(error.message || '删除失败，请重试');
    }
  };

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
                disabled={isLoading}
                className="pl-10 text-[13px]"
              />
            </div>
          </div>

          {/* 标签筛选 */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-[13px] text-[rgba(0,0,0,0.6)]">标签筛选：</span>
            <button
              onClick={() => setSelectedTag('')}
              disabled={isLoading}
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
                disabled={isLoading}
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

        {/* 加载状态 */}
        {isLoading && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[rgba(0,0,0,0.6)]">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-red-500">{error}</p>
          </div>
        )}

        {/* 会员列表 */}
        {!isLoading && !error && (
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
                      <span className="text-[11px] text-[rgba(0,0,0,0.6)] mr-1 py-1">硬核标签：</span>
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
                        <span className="text-[11px] text-[rgba(0,0,0,0.4)] py-1">未设置</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[11px] text-[rgba(0,0,0,0.6)] mr-1">资源标签：</span>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id, member.name)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </Button>
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
        )}
      </div>
    </AdminLayout>
  );
}
