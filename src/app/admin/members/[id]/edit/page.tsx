'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 可用标签
const availableTags = [
  '普通',
  '私董案主',
  '探访主',
  '学员',
  '小组成员'
];

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
  phone: '138****1234',
  email: 'wang@example.com',
  company: '某科技公司',
  position: 'CEO',
  industry: '企业服务',
  abilityTags: ['供应链专家', '数字化转型'],
  description: '15年供应链管理经验，专注于制造业数字化转型'
};

export default function AdminMemberEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [name, setName] = useState(mockMember.name);
  const [age, setAge] = useState(mockMember.age);
  const [phone, setPhone] = useState(mockMember.phone);
  const [email, setEmail] = useState(mockMember.email);
  const [company, setCompany] = useState(mockMember.company);
  const [position, setPosition] = useState(mockMember.position);
  const [selectedTags, setSelectedTags] = useState<string[]>(mockMember.tags);
  const [isFeatured, setIsFeatured] = useState(mockMember.isFeatured);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    // 这里可以添加保存逻辑，例如调用API
    console.log('保存会员信息:', {
      id: params.id,
      name,
      age,
      phone,
      email,
      company,
      position,
      tags: selectedTags,
      isFeatured,
    });
    alert('会员信息已保存');
    router.back();
  };

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
              <h2 className="text-[15px] font-bold text-gray-900">编辑会员信息</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">ID: {params.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              取消
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </div>

        <div className="border border-[rgba(0,0,0,0.1)]">
          {/* 头像部分 */}
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={mockMember.avatar}
                  alt={name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-1">{name}</h3>
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">
                  {mockMember.level} · {mockMember.joinDate} 加入
                </p>
              </div>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-4">基本信息</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    姓名
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    年龄
                  </label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="text-[13px]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    电话
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    邮箱
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    公司
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[rgba(0,0,0,0.6)] mb-2">
                    职位
                  </label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="text-[13px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 标签管理 */}
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-4">标签管理</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 text-[13px] font-normal transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[rgba(59,130,246,0.4)] text-blue-600 border border-blue-400'
                        : 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] border border-transparent hover:bg-[rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {selectedTags.includes(tag) ? '✓ ' : ''}
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.6)]">
                已选择 {selectedTags.length} 个标签：{selectedTags.join('、')}
              </p>
            </div>
          </div>

          {/* 其他设置 */}
          <div className="px-4 py-3">
            <h3 className="text-[13px] font-semibold text-gray-900 mb-4">其他设置</h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4"
              />
              <label
                htmlFor="isFeatured"
                className="text-[13px] font-medium text-[rgba(0,0,0,0.6)]"
              >
                首页推荐
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
