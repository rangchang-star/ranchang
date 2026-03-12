'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AdminVisitCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 探访基本信息 - 对应数据库字段
  const [company_name, setCompanyName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [capacity, setCapacity] = useState('');
  const [participants, setParticipants] = useState('');
  const [status, setStatus] = useState('active');
  const [visitor_id, setVisitorId] = useState('');
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [cover_image, setCoverImage] = useState('');

  // 表单验证
  const validateForm = (): boolean => {
    if (!company_name.trim()) {
      alert('请输入公司名称');
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
      // 构造数据 - 只包含数据库表字段
      const visitData = {
        company_name,
        date,
        time,
        location,
        description,
        industry,
        capacity: capacity ? parseInt(capacity) : null,
        participants: participants ? parseInt(participants) : null,
        status,
        visitor_id,
        outcome,
        notes,
        rating,
        cover_image,
        key_points: [],
        next_steps: [],
        photos: [],
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
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={company_name}
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
                  探访时间
                </label>
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="例如：09:00-17:00"
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
                  状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">进行中</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  访客ID
                </label>
                <Input
                  value={visitor_id}
                  onChange={(e) => setVisitorId(e.target.value)}
                  placeholder="请输入访客ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评分 (1-5)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
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
                  参与人数
                </label>
                <Input
                  type="number"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="请输入参与人数"
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
                placeholder="请输入探访描述..."
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            {/* 探访成果 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                探访成果
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="请输入探访成果..."
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            {/* 探访笔记 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                探访笔记
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="请输入探访笔记..."
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            {/* 封面图片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图片URL
              </label>
              <Input
                value={cover_image}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="请输入封面图片URL"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
