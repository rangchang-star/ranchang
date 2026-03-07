'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Shield, Edit2, Trash2, Lock, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Admin {
  id: number;
  phone: string;
  nickname: string;
  name: string;
  avatar: string;
  company: string;
  position: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminManagementPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<number | null>(null);

  // 加载管理员列表
  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/admins');
      const data = await response.json();

      if (data.success) {
        setAdmins(data.data);
        setFilteredAdmins(data.data);
      } else {
        console.error('加载管理员列表失败:', data.error);
      }
    } catch (error) {
      console.error('加载管理员列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = admins.filter(admin =>
        admin.name.includes(searchQuery) ||
        admin.nickname.includes(searchQuery) ||
        admin.phone.includes(searchQuery)
      );
      setFilteredAdmins(filtered);
    } else {
      setFilteredAdmins(admins);
    }
  }, [searchQuery, admins]);

  // 删除管理员
  const handleDeleteAdmin = async (adminId: number) => {
    if (!confirm('确定要删除此管理员吗？该操作将把该管理员降级为普通用户。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('管理员已删除');
        loadAdmins(); // 重新加载列表
      } else {
        alert(`删除失败：${data.error}`);
      }
    } catch (error) {
      console.error('删除管理员失败:', error);
      alert('删除失败，请重试');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900">管理员管理</h1>
              <p className="text-[13px] text-gray-500">管理系统管理员账号</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={loadAdmins}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              刷新
            </Button>
            <Button
              onClick={() => router.push('/admin/admin/create')}
              className="bg-blue-400 hover:bg-blue-500"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              创建管理员
            </Button>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索管理员姓名、昵称或手机号"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-[13px]"
            />
          </div>
        </div>

        {/* 管理员列表 */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.05)] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="mt-3 text-gray-500 text-[13px]">加载中...</p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-[13px]">
                {searchQuery ? '没有找到匹配的管理员' : '暂无管理员'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              {filteredAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={admin.avatar} alt={admin.name} />
                      <AvatarFallback>{admin.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-[15px] font-semibold text-gray-900">
                          {admin.name}
                        </h3>
                        {admin.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[11px] rounded">
                            管理员
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-gray-500">
                        {admin.nickname} · {admin.phone}
                      </p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        {admin.company} · {admin.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => router.push(`/admin/admin/${admin.id}/edit`)}
                      variant="ghost"
                      size="sm"
                    >
                      <Lock className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="mt-4 text-center">
          <p className="text-[12px] text-gray-400">
            共 {admins.length} 位管理员
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
