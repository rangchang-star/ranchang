import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, Briefcase, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarDisplay } from '@/components/avatar-upload';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';
import postgres from 'postgres';

const tagStampMap = {
  personLookingForJob: { label: '人找事', description: '我有能力，寻找项目机会' },
  jobLookingForPerson: { label: '事找人', description: '我有项目，寻找合作伙伴' },
  pureExchange: { label: '纯交流', description: '只想交流学习，暂无合作需求' },
};

// 高燃宣告方向映射
const directionMap: Record<string, string> = {
  confidence: '信心',
  mission: '使命',
  self: '自我',
  opponent: '对手',
  environment: '环境',
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
      SELECT * FROM public.app_users WHERE id = ${id}
    `;

    if (users.length === 0) {
      console.log('用户不存在:', id);
      return null;
    }

    console.log('获取到用户数据:', users[0]);
    console.log('experience字段:', users[0].experience);
    console.log('achievement字段:', users[0].achievement);

    // 获取该用户的最新高燃宣告
    const declarations = await sql`
      SELECT * FROM public.declarations
      WHERE user_id = ${id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    console.log('获取到高燃宣告数据:', declarations);

    // 将高燃宣告数据附加到用户数据中
    const userData = users[0];
    if (declarations.length > 0) {
      (userData as any).declaration = declarations[0];
    }

    return userData;
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
    experiences: user.experience || [],
    achievements: user.achievement || [],
    declaration: (user as any).declaration || null,
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
              <AvatarDisplay avatarKey={formattedUser.avatar} name={formattedUser.name} size="xl" />

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
          {formattedUser.declaration ? (
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-gray-900">高燃宣告</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-[11px] bg-white text-orange-600 border-orange-300">
                    {directionMap[formattedUser.declaration.direction] || formattedUser.declaration.direction}
                  </Badge>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
                {formattedUser.declaration.text}
              </p>
              {formattedUser.declaration.summary && (
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
                  {formattedUser.declaration.summary}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-gray-500">
                  {new Date(formattedUser.declaration.created_at).toLocaleDateString('zh-CN')}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] text-gray-500">{formattedUser.declaration.views || 0}次播放</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-gray-900">高燃宣告</h3>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                该用户暂未发布高燃宣告
              </p>
            </div>
          )}

          {/* 硬核经历 */}
          {formattedUser.experiences && formattedUser.experiences.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-gray-900">硬核经历</h3>
                <Briefcase className="w-4 h-4 text-blue-500" />
              </div>
              <div className="space-y-3">
                {formattedUser.experiences.map((exp: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-[14px] font-semibold text-gray-900 mb-1">
                          {exp.company}
                        </h4>
                        <p className="text-[12px] text-gray-600 mb-1">{exp.position}</p>
                      </div>
                      <div className="flex items-center text-[11px] text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 主要成就 */}
          {formattedUser.achievements && formattedUser.achievements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-gray-900">主要成就</h3>
                <Award className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="space-y-2">
                {formattedUser.achievements.map((achievement: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 bg-yellow-50 rounded-lg p-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                    </div>
                    <p className="text-[13px] text-gray-700 leading-relaxed">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
