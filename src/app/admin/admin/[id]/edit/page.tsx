'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, ArrowLeft, Save } from 'lucide-react';

export default function EditAdminPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 加载管理员信息
  useEffect(() => {
    const loadAdminInfo = async () => {
      try {
        const response = await fetch(`/api/admin/admins/${adminId}`);
        const data = await response.json();

        if (data.success) {
          setAdminName(data.data.name);
        } else {
          alert(`加载失败：${data.error}`);
          router.push('/admin/admin');
        }
      } catch (error) {
        console.error('加载管理员信息失败:', error);
        alert('加载失败，请重试');
        router.push('/admin/admin');
      } finally {
        setLoadingData(false);
      }
    };

    loadAdminInfo();
  }, [adminId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 验证新密码
    if (!formData.newPassword) {
      newErrors.newPassword = '请输入新密码';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = '密码至少需要6位';
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
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
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('密码修改成功！');
        router.push('/admin/admin');
      } else {
        alert(`修改失败：${data.error}`);
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      alert('修改失败，请重试');
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

  if (loadingData) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    );
  }

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
              <h1 className="text-[20px] font-bold text-gray-900">修改管理员密码</h1>
              <p className="text-[13px] text-gray-500">为 {adminName} 修改登录密码</p>
            </div>
          </div>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[rgba(0,0,0,0.05)] p-6 space-y-6">
          {/* 新密码 */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              新密码 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="请输入新密码（至少6位）"
                className={cn(
                  "pl-10 h-10 text-[13px]",
                  errors.newPassword && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-[12px] text-red-500">{errors.newPassword}</p>
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
                placeholder="请再次输入新密码"
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

          {/* 提示信息 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-[12px] text-yellow-700">
              <strong>提示：</strong>修改密码后，该管理员需要使用新密码登录后台管理系统。
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
              {loading ? '保存中...' : '保存修改'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
