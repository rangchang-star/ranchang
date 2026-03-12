'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, User, Upload, X, Image, Mic, FileImage } from 'lucide-react';
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
  const [visitorId, setVisitorId] = useState(''); // 探访人ID

  // 文件上传状态
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'cover' | 'audio' | 'photo' | null>(null);

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

  // 当选择探访人时，保存探访人ID
  const handleVisitorSelect = (visitorUserId: string) => {
    setVisitorId(visitorUserId);
  };

  // 处理文件上传
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'audio' | 'photo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadType(type);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/admin/api/visits/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '上传失败');
      }

      const result = await response.json();

      if (result.success) {
        const { url } = result.data;

        if (type === 'cover') {
          setCoverImage(url);
        } else if (type === 'audio') {
          setFeedbackAudio(url);
        } else if (type === 'photo') {
          // 将新照片URL添加到现有照片列表中
          const currentPhotos = photos ? photos.split('\n').filter(p => p.trim()) : [];
          setPhotos([...currentPhotos, url].join('\n'));
        }
      }
    } catch (error: any) {
      console.error('文件上传失败:', error);
      alert(error.message || '文件上传失败，请重试');
    } finally {
      setUploading(false);
      setUploadType(null);

      // 清空 input
      e.target.value = '';
    }
  };

  // 删除照片
  const handleRemovePhoto = (photoUrl: string) => {
    const currentPhotos = photos ? photos.split('\n').filter(p => p.trim()) : [];
    const newPhotos = currentPhotos.filter(p => p !== photoUrl);
    setPhotos(newPhotos.join('\n'));
  };

  // 删除封面
  const handleRemoveCover = () => {
    setCoverImage('');
  };

  // 删除录音
  const handleRemoveAudio = () => {
    setFeedbackAudio('');
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
          setKeyPoints(visit.keyPoints ? visit.keyPoints.join('\n') : '');
          setNextSteps(visit.nextSteps ? visit.nextSteps.join('\n') : '');
          setRating(visit.rating?.toString() || '');
          setFeedbackAudio(visit.feedbackAudio || '');
          setPhotos(visit.photos ? visit.photos.join('\n') : '');
          setParticipants(visit.participants?.toString() || '');
          setVisitorId(visit.visitorId || '');
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
      alert('请输入探访项目主主题');
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
        visitorId: visitorId || null,
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
        keyPoints: keyPoints ? keyPoints.split('\n').filter(item => item.trim()) : null,
        nextSteps: nextSteps ? nextSteps.split('\n').filter(item => item.trim()) : null,
        rating: rating ? parseInt(rating) : null,
        feedbackAudio: feedbackAudio || null,
        photos: photos ? photos.split('\n').filter(item => item.trim()) : null,
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
                  探访项目主主题 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="请输入探访项目主主题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  探访人
                </label>
                {loadingUsers ? (
                  <div className="text-sm text-gray-500">加载用户列表中...</div>
                ) : (
                  <select
                    value={visitorId}
                    onChange={(e) => handleVisitorSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">请选择探访人</option>
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
                  封面图片
                </label>
                {coverImage ? (
                  <div className="relative">
                    <img
                      src={coverImage}
                      alt="封面"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveCover}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        {uploading && uploadType === 'cover' ? '上传中...' : '点击上传封面图片'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'cover')}
                        disabled={uploading && uploadType === 'cover'}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
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

            {/* 关键点 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                关键点（每行一个）
              </label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="关键点1&#10;关键点2&#10;关键点3"
              />
            </div>

            {/* 下一步计划 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                下一步计划（每行一个）
              </label>
              <textarea
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="计划1&#10;计划2&#10;计划3"
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
                  反馈录音
                </label>
                {feedbackAudio ? (
                  <div className="relative">
                    <audio controls src={feedbackAudio} className="w-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveAudio}
                      className="mt-2"
                    >
                      <X className="w-4 h-4 mr-2" />
                      删除录音
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50">
                      <Mic className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        {uploading && uploadType === 'audio' ? '上传中...' : '点击上传反馈录音'}
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileUpload(e, 'audio')}
                        disabled={uploading && uploadType === 'audio'}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 照片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                现场照片
              </label>

              {/* 上传按钮 */}
              <div className="mb-4">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50">
                    <FileImage className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      {uploading && uploadType === 'photo' ? '上传中...' : '点击上传照片'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'photo')}
                      disabled={uploading && uploadType === 'photo'}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 照片列表 */}
              {photos && (
                <div className="grid grid-cols-4 gap-4">
                  {photos.split('\n').filter(p => p.trim()).map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`照片${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemovePhoto(photo)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* 文本框作为备用 */}
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-1">
                  或直接输入照片URL（每行一个）
                </label>
                <textarea
                  value={photos}
                  onChange={(e) => setPhotos(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="照片URL1&#10;照片URL2&#10;照片URL3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
