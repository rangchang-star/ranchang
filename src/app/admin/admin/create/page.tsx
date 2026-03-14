'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, User, Phone, Lock, ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 验证手机号
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6位';
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 验证昵称
    if (!formData.nickname.trim()) {
      newErrors.nickname = '请输入昵称';
    }

    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
          nickname: formData.nickname,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('管理员创建成功！');
        router.push('/admin/admin');
      } else {
        alert(`创建失败：${data.error}`);
      }
    } catch (error) {
      console.error('创建管理员失败:', error);
      alert('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center space-x-3 mb-6">
          <Button
            onClick={() => router.push('/admin/admin')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-gray-900">创建管理员</h1>
              <p className="text-[13px] text-gray-500">添加新的管理员账号</p>
            </div>
          </div>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[rgba(0,0,0,0.05)] p-6 space-y-6">
          {/* 手机号 */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              手机号 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="请输入手机号"
                className={cn(
                  "pl-10 h-10 text-[13px]",
                  errors.phone && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-[12px] text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              密码 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="请输入密码（至少6位）"
                className={cn(
                  "pl-10 h-10 text-[13px]",
                  errors.password && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-[12px] text-red-500">{errors.password}</p>
            )}
          </div>

          {/* 确认密码 */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              确认密码 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="请再次输入密码"
                className={cn(
                  "pl-10 h-10 text-[13px]",
                  errors.confirmPassword && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[12px] text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 昵称 */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              昵称 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                placeholder="请输入昵称"
                className={cn(
                  "pl-10 h-10 text-[13px]",
                  errors.nickname && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {errors.nickname && (
              <p className="mt-1 text-[12px] text-red-500">{errors.nickname}</p>
            )}
          </div>

          {/* 姓名 */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="请输入真实姓名"
                className={cn(
                  "pl-10 h-10 text-[13px]",
                  errors.name && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>
            )}
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-[12px] text-blue-700">
              <strong>提示：</strong>创建的管理员账号将拥有管理后台的所有权限，请谨慎操作。
            </p>
          </div>

          {/* 按钮 */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={() => router.push('/admin/admin')}
              variant="outline"
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? '创建中...' : '创建管理员'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
