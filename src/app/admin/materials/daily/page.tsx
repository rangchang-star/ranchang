'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Search, Volume2, Play, ArrowLeft, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 每日现货资源数据类型
interface DailyDeclaration {
  id: string;
  title: string;
  date: string;
  duration: string;
  image: string;
  audio: string;
  createdAt: string;
  isFeatured: boolean;
}

export default function AdminDailyDeclarationsPage() {
  const [declarations, setDeclarations] = useState<DailyDeclaration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefMap = useRef<Record<string, HTMLAudioElement>>({});

  // 从 API 加载数据
  useEffect(() => {
    loadDeclarations();
  }, []);

  const loadDeclarations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/daily-declarations');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // 过滤掉无效数据
          const validDeclarations = data.data.filter(
            (decl: any) => decl && decl.id && decl.title && decl.date
          );
          setDeclarations(validDeclarations);
        } else {
          setDeclarations([]);
        }
      } else {
        // 如果API不存在，使用模拟数据
        setDeclarations([
          {
            id: '1',
            title: '重塑自我，迎接新挑战',
            date: '2024-03-01',
            duration: '3:15',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop',
            audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            createdAt: '2024-03-01T00:00:00Z',
            isFeatured: true,
          },
          {
            id: '2',
            title: '勇敢突破，创造无限可能',
            date: '2024-03-02',
            duration: '4:20',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=200&fit=crop',
            audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            createdAt: '2024-03-02T00:00:00Z',
            isFeatured: true,
          },
          {
            id: '3',
            title: '坚持初心，砥砺前行',
            date: '2024-03-03',
            duration: '2:45',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop',
            audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            createdAt: '2024-03-03T00:00:00Z',
            isFeatured: false,
          },
        ]);
      }
    } catch (error) {
      console.error('加载每日现货资源失败:', error);
      // 使用模拟数据
      setDeclarations([
        {
          id: '1',
          title: '重塑自我，迎接新挑战',
          date: '2024-03-01',
          duration: '3:15',
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&h=200&fit=crop',
          audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          createdAt: '2024-03-01T00:00:00Z',
          isFeatured: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 播放/暂停音频
  const togglePlay = (id: string, audioUrl: string) => {
    if (playingId === id) {
      // 暂停当前播放
      if (audioRefMap.current[id]) {
        audioRefMap.current[id].pause();
      }
      setPlayingId(null);
    } else {
      // 停止其他音频
      if (playingId && audioRefMap.current[playingId]) {
        audioRefMap.current[playingId].pause();
      }
      // 播放新音频
      if (!audioRefMap.current[id]) {
        const audio = new Audio(audioUrl);
        audioRefMap.current[id] = audio;
      }
      audioRefMap.current[id].play();
      setPlayingId(id);

      // 监听播放结束
      audioRefMap.current[id].onended = () => {
        setPlayingId(null);
      };
    }
  };

  // 删除宣告
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个每日现货资源吗？')) return;
    try {
      const response = await fetch(`/api/daily-declarations/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('每日现货资源已删除');
          loadDeclarations();
        } else {
          alert(data.error || '删除失败');
        }
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  // 切换勾选状态（一次只允许勾选一条）
  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    // 如果要勾选，先取消其他所有勾选
    if (!isFeatured) {
      const uncheckPromises = declarations
        .filter(decl => decl.id !== id && decl.isFeatured)
        .map(decl => 
          fetch(`/api/daily-declarations/${decl.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isFeatured: false }),
          })
        );
      await Promise.all(uncheckPromises);
    }

    try {
      const response = await fetch(`/api/daily-declarations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (response.ok) {
        loadDeclarations();
      }
    } catch (error) {
      console.error('更新勾选状态失败:', error);
    }
  };

  // 过滤宣告
  const filteredDeclarations = declarations.filter((decl) =>
    decl &&
    decl.title &&
    decl.date &&
    (decl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    decl.date.includes(searchTerm))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/materials">
              <Button variant="ghost" size="sm" className="text-[rgba(0,0,0,0.6)] hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            </Link>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 mb-1">每日现货资源管理</h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.6)]">管理每日资源现货内容</p>
            </div>
          </div>
          <Link href="/admin/materials/daily/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加每日现货资源
            </Button>
          </Link>
        </div>

        {/* 操作栏 */}
        <div className="border border-[rgba(0,0,0,0.1)]">
          <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                placeholder="搜索每日现货资源..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 h-8 text-[13px] border-[rgba(0,0,0,0.1)]"
              />
            </div>
          </div>

          {/* 列表 */}
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {isLoading ? (
              <div className="p-12 text-center">
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">加载中...</p>
              </div>
            ) : filteredDeclarations.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[13px] text-[rgba(0,0,0,0.6)]">暂无每日现货资源</p>
              </div>
            ) : (
              filteredDeclarations.map((declaration) => (
                <div
                  key={declaration.id}
                  className="flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* 勾选框 */}
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={declaration.isFeatured}
                        onCheckedChange={(checked) => handleToggleFeatured(declaration.id, declaration.isFeatured)}
                        className="w-5 h-5 border-2 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
                      />
                    </div>

                    {/* 方形图片 */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[rgba(0,0,0,0.05)]">
                      <Image
                        src={declaration.image}
                        alt={declaration.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                          {declaration.title}
                        </h3>
                        {declaration.isFeatured && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-medium">
                            ✓ 前台显示
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[13px] text-[rgba(0,0,0,0.6)] mb-2">
                        <span>{declaration.date}</span>
                        <span>·</span>
                        <span className="flex items-center">
                          <Volume2 className="w-3 h-3 mr-1" />
                          {declaration.duration}
                        </span>
                      </div>
                      {/* 音频播放器 */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePlay(declaration.id, declaration.audio)}
                          className="h-7 text-[12px]"
                        >
                          {playingId === declaration.id ? (
                            <>
                              <Play className="w-3 h-3 mr-1 fill-current" />
                              暂停
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              播放
                            </>
                          )}
                        </Button>
                        <audio
                          ref={(el) => {
                            if (el) audioRefMap.current[declaration.id] = el;
                          }}
                          src={declaration.audio}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link href={`/admin/materials/daily/${declaration.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        编辑
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(declaration.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
