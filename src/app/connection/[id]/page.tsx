import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';
import postgres from 'postgres';

const tagStampMap = {
  personLookingForJob: { label: '人找事', description: '我有能力，寻找项目机会' },
  jobLookingForPerson: { label: '事找人', description: '我有项目，寻找合作伙伴' },
  pureExchange: { label: '纯交流', description: '只想交流学习，暂无合作需求' },
};

// 从数据库获取用户数据
async function getUserData(id: string) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL is not defined');
    return null;
  }

  const sql = postgres(connectionString);

  try {
    const users = await sql`
      SELECT * FROM public.users WHERE id = ${id}
    `;

    if (users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  } finally {
    await sql.end();
  }
}

export default async function ConnectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 在 Next.js 16 中，params 需要使用 await 来访问
  const { id: userId } = await params;

  console.log('User ID:', userId);

  const user = await getUserData(userId);

  if (!user) {
    notFound();
  }

  // 格式化数据
  const formattedUser = {
    id: user.id,
    name: user.name,
    age: user.age,
    avatar: user.avatar || '/avatar-default.jpg',
    tags: [],
    industry: user.industry || '',
    tagStamp: user.tag_stamp || 'pureExchange',
    need: user.need || '',
    hardcoreTags: user.hardcore_tags || [],
    resourceTags: user.resource_tags || [],
    company: user.company || '',
    position: user.position || '',
    createdAt: user.created_at,
  };

  const tagStamp = tagStampMap[formattedUser.tagStamp as keyof typeof tagStampMap];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/discovery">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">会员详情</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-5 space-y-6">
          <div className="relative">
            <div className={`absolute top-0 right-0 px-3 py-1 text-[11px] font-medium rounded-bl-md z-10 border-l-2 border-t-2 ${
              formattedUser.tagStamp === 'personLookingForJob'
                ? 'bg-[rgba(34,197,94,0.15)] text-gray-600 border-gray-400'
                : 'bg-blue-100 text-gray-600 border-gray-400'
            }`}>
              {tagStamp?.label}
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                <img
                  src={formattedUser.avatar}
                  alt={formattedUser.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">{formattedUser.name}</h2>
                  <p className="text-[13px] text-[rgba(0,0,0,0.4)]">{formattedUser.age}岁</p>
                </div>

                {/* 行业标签 */}
                <div className="mb-3">
                  <span className="px-3 py-1 bg-[rgba(34,197,94,0.15)] text-green-600 text-[11px] font-normal">
                    {formattedUser.industry}
                  </span>
                </div>

                {/* 关注数据 */}
                <div className="flex items-center space-x-6 text-[13px]">
                  <div>
                    <span className="font-semibold text-gray-900">0</span>
                    <span className="text-[rgba(0,0,0,0.4)] ml-1">关注者</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">0</span>
                    <span className="text-[rgba(0,0,0,0.4)] ml-1">关注</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex-1 font-normal text-[13px] py-3 border-[rgba(0,0,0,0.2)] text-gray-700">
              <Heart className="w-4 h-4 mr-2" />
              喜欢
            </Button>
            <Button variant="outline" className="px-4 py-3 border-[rgba(0,0,0,0.2)]">
              <Share2 className="w-4 h-4 text-gray-700" />
            </Button>
          </div>

          {/* 硬核标签 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">硬核标签</h3>
            <div className="flex flex-wrap gap-2">
              {formattedUser.hardcoreTags && formattedUser.hardcoreTags.length > 0 ? (
                formattedUser.hardcoreTags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-[11px] px-3 py-1 bg-gray-100 text-gray-700">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-[13px] text-gray-400">暂无标签</p>
              )}
            </div>
          </div>

          {/* 资源标签 */}
          {formattedUser.resourceTags && formattedUser.resourceTags.length > 0 && (
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-3">资源标签</h3>
              <div className="flex flex-wrap gap-2">
                {formattedUser.resourceTags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-[11px] px-3 py-1 border-gray-300 text-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 我需要 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-3">我需要</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">
              {formattedUser.need || '暂无需求'}
            </p>
          </div>

          {/* 高燃宣告 */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-semibold text-gray-900">高燃宣告</h3>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
              {formattedUser.need}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-gray-500">
                {new Date(formattedUser.createdAt).toLocaleDateString('zh-CN')}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[11px] text-gray-500">0次播放</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
