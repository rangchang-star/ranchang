'use client';

import { PageContainer } from '@/components/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Member {
  id: string;
  name: string;
  age: number;
  avatar: string;
  tags: string[];
  need: string;
  location: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    name: '王姐',
    age: 48,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Felix',
    tags: ['供应链专家', '数字化转型', '项目管理'],
    need: '希望找到传统制造业的数字化项目机会',
    location: '上海',
  },
  {
    id: '2',
    name: '李明',
    age: 52,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=John',
    tags: ['投融资', '战略规划', '并购整合'],
    need: '想寻找优质项目对接投资机构',
    location: '北京',
  },
  {
    id: '3',
    name: '张总',
    age: 45,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Robert',
    tags: ['智能制造', '工业互联网', '生产运营'],
    need: '希望找到愿意尝试智能化改造的工厂',
    location: '深圳',
  },
  {
    id: '4',
    name: '陈老师',
    age: 50,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=William',
    tags: ['组织发展', '人才梯队', '教练式辅导'],
    need: '想为成长型企业提供组织能力诊断',
    location: '杭州',
  },
];

export default function HomePage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        {/* 头部 */}
        <div className="pt-2">
          <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            燃场
          </h2>
          <p className="text-muted-foreground text-base font-normal">
            让经验被复用，让困境有回响
          </p>
        </div>

        {/* 会员展示墙 */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            能力连接
          </h3>
          <ScrollArea className="w-full pb-2">
            <div className="flex space-x-4">
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-72 space-y-4"
                >
                  {/* 头像和基本信息 */}
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-lg text-foreground mb-1">
                        {member.name} <span className="text-muted-foreground font-normal">{member.age}岁</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {member.location}
                      </div>
                    </div>
                  </div>

                  {/* 能力标签 */}
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 需求（希望别人带给我什么） */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      期望
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {member.need}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 温暖文案 */}
        <div className="text-center py-6">
          <p className="text-base text-muted-foreground">
            每个人都是一座孤岛，直到有人愿意渡海而来
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
