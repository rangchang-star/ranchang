'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function AdminVisitEditPage() {
  const router = useRouter();
  const params = useParams();
  const visitId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 探访基本信息 - 对应数据库字段
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('draft');
  const [coverImage, setCoverImage] = useState('');
  const [record, setRecord] = useState('');
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [rating, setRating] = useState('');
  const [feedbackAudio, setFeedbackAudio] = useState('');
  const [photos, setPhotos] = useState('');
  const [participants, setParticipants] = useState('');

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

  // 加载现有探访数据
  useEffect(() => {
    async function loadVisitData() {
      if (!visitId) return;

      try {
        setIsLoadingData(true);
        const response = await fetch(`/admin/api/visits/${visitId}`);

        if (!response.ok) {
          throw new Error('加载探访数据失败');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const visit = data.data;
          setCompanyId(visit.companyId || '');
          setCompanyName(visit.companyName || '');
          setDate(visit.date ? visit.date.split('T')[0] : '');
          setTime(visit.time || '');
          setLocation(visit.location || '');
          setDescription(visit.description || '');
          setIndustry(visit.industry || '');
          setCapacity(visit.capacity?.toString() || '');
          setStatus(visit.status || 'draft');
          setCoverImage(visit.coverImage || '');
          setRecord(visit.record || '');
          setOutcome(visit.outcome || '');
          setNotes(visit.notes || '');
          setKeyPoints(visit.keyPoints ? JSON.stringify(visit.keyPoints) : '');
          setNextSteps(visit.nextSteps ? JSON.stringify(visit.nextSteps) : '');
          setRating(visit.rating?.toString() || '');
          setFeedbackAudio(visit.feedbackAudio || '');
          setPhotos(visit.photos ? JSON.stringify(visit.photos) : '');
          setParticipants(visit.participants?.toString() || '');
        } else {
          throw new Error(data.error || '加载探访数据失败');
        }
      } catch (err: any) {
        console.error('加载探访数据失败:', err);
        alert(err.message || '加载探访数据失败');
      } finally {
        setIsLoadingData(false);
      }
    }

    loadVisitData();
  }, [visitId]);

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
        companyId: companyId,
        companyName: companyName,
        date: date,
        time: time || null,
        location: location || null,
        description: description || null,
        industry: industry || null,
        capacity: capacity ? parseInt(capacity) : null,
        status: status,
        coverImage: coverImage || null,
        coverImageKey: null,
        record: record || null,
        outcome: outcome || null,
        notes: notes || null,
        keyPoints: keyPoints ? JSON.parse(keyPoints) : null,
        nextSteps: nextSteps ? JSON.parse(nextSteps) : null,
        rating: rating ? parseInt(rating) : null,
        feedbackAudio: feedbackAudio || null,
        photos: photos ? JSON.parse(photos) : null,
        participants: participants ? parseInt(participants) : null,
      };

      // 调用 API 更新数据
      const response = await fetch(`/admin/api/visits/${visitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '更新失败');
      }

      alert('探访更新成功！');
      router.push('/admin/visits');
    } catch (error: any) {
      console.error('更新探访失败:', error);
      alert(error.message || '更新探访失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-[13px] text-[rgba(0,0,0,0.6)]">加载中...</div>
        </div>
      </AdminLayout>
    );
  }

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
              <h2 className="text-[15px] font-bold text-gray-900 mb-1">编辑探访</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">修改探访记录信息</p>
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
                  探访时间
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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
                  参与人数
                </label>
                <Input
                  type="number"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="请输入参与人数"
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

            {/* 拜访记录 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                拜访记录
              </label>
              <textarea
                value={record}
                onChange={(e) => setRecord(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="请输入拜访记录..."
              />
            </div>

            {/* 成果 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                成果
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="请输入成果..."
              />
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                备注
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="请输入备注..."
              />
            </div>

            {/* 关键点（JSON格式） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                关键点（JSON数组格式）
              </label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder='["关键点1", "关键点2"]'
              />
            </div>

            {/* 下一步计划（JSON格式） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                下一步计划（JSON数组格式）
              </label>
              <textarea
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder='["计划1", "计划2"]'
              />
            </div>

            {/* 评分 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评分（1-5）
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="请输入评分"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  反馈录音URL
                </label>
                <Input
                  value={feedbackAudio}
                  onChange={(e) => setFeedbackAudio(e.target.value)}
                  placeholder="请输入反馈录音URL"
                />
              </div>
            </div>

            {/* 照片（JSON格式） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                照片（JSON数组格式）
              </label>
              <textarea
                value={photos}
                onChange={(e) => setPhotos(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder='["照片URL1", "照片URL2"]'
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
