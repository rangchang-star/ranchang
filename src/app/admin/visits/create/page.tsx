'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, User } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  nickname: string;
  company: string;
  position: string;
}

export default function AdminVisitCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 探访基本信息 - 对应数据库字段
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState(''); // 必填字段，关联用户ID
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('draft');
  const [coverImage, setCoverImage] = useState('');

  // 加载用户列表
  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      try {
        const response = await fetch('/admin/api/members');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUsers(data.data);
          }
        }
      } catch (error) {
        console.error('加载用户列表失败:', error);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

  // 当选择用户时，自动填充公司名称
  const handleUserSelect = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);
    if (selectedUser) {
      setCompanyId(selectedUser.id);
      setCompanyName(selectedUser.company || selectedUser.name || '');
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!companyName.trim()) {
      alert('请输入公司名称');
      return false;
    }
    if (!companyId.trim()) {
      alert('请选择或输入公司ID（关联用户）');
      return false;
    }
    if (!date.trim()) {
      alert('请输入探访日期');
      return false;
    }
    return true;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // 构造数据 - 只包含数据库表 visits 中存在的字段
      const visitData = {
        companyId: companyId, // 必填，关联 app_users.id
        companyName: companyName, // 必填
        date: date, // 必填
        location: location || null,
        description: description || null,
        industry: industry || null,
        capacity: capacity ? parseInt(capacity) : null,
        status: status, // draft, upcoming, completed, cancelled
        coverImage: coverImage || null,
        coverImageKey: null, // 如果有对象存储，这里需要设置
      };

      console.log('保存探访数据:', visitData);

      // 调用 API 保存数据
      const response = await fetch('/admin/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '保存失败');
      }

      alert('探访添加成功！');
      router.push('/admin/visits');
    } catch (error: any) {
      console.error('添加探访失败:', error);
      alert(error.message || '添加探访失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/visits">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
            </Link>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 mb-1">添加探访</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">创建新的探访记录</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? '保存中...' : '保存'}
          </Button>
        </div>

        {/* 表单内容 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="p-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择用户（关联公司） <span className="text-red-500">*</span>
                </label>
                {loadingUsers ? (
                  <div className="text-sm text-gray-500">加载用户列表中...</div>
                ) : (
                  <select
                    value={companyId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">请选择用户</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.nickname} - {user.company || '无公司'} ({user.position || '无职位'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="请输入公司名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  探访日期 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  探访地点
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="请输入探访地点"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  行业
                </label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="请输入行业"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  容量
                </label>
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="请输入容量"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">草稿</option>
                  <option value="upcoming">即将开始</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  封面图片URL
                </label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="请输入封面图片URL"
                />
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                探访描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="请输入探访描述..."
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
