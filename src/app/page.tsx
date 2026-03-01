'use client';

import { PageContainer } from '@/components/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame, MapPin, Users, Star } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  age: number;
  avatar: string;
  tags: string[];
  need: string;
  highlight: {
    icon: React.ReactNode;
    text: string;
  };
}

const mockMembers: Member[] = [
  {
    id: '1',
    name: '王姐',
    age: 48,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Felix',
    tags: ['供应链专家', '数字化转型', '项目管理'],
    need: '想帮传统制造企业做数字化升级',
    highlight: {
      icon: <MapPin className="w-4 h-4" />,
      text: '可对接长三角制造业资源',
    },
  },
  {
    id: '2',
    name: '李明',
    age: 52,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=John',
    tags: ['投融资', '战略规划', '并购整合'],
    need: '寻找优质项目对接投资机构',
    highlight: {
      icon: <Flame className="w-4 h-4" />,
      text: '拥有50+投资机构资源',
    },
  },
  {
    id: '3',
    name: '张总',
    age: 45,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Robert',
    tags: ['智能制造', '工业互联网', '生产运营'],
    need: '希望帮助传统工厂实现智能化改造',
    highlight: {
      icon: <Star className="w-4 h-4" />,
      text: '服务过30+制造企业',
    },
  },
  {
    id: '4',
    name: '陈老师',
    age: 50,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=William',
    tags: ['组织发展', '人才梯队', '教练式辅导'],
    need: '想为成长型企业提供组织能力诊断',
    highlight: {
      icon: <Users className="w-4 h-4" />,
      text: '培养过100+企业高管',
    },
  },
];

export default function HomePage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 头部标题 */}
        <div>
          <h2 className="text-3xl font-bold font-serif text-foreground mb-2">
            燃场
          </h2>
          <p className="text-muted-foreground text-base">
            让经验被复用，让困境有回响
          </p>
        </div>

        {/* 会员展示墙 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground font-serif">
            能力连接
          </h3>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {mockMembers.map((member) => (
                <Card
                  key={member.id}
                  className="flex-shrink-0 w-[280px] hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-5 space-y-4">
                    {/* 头像和基本信息 */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-14 h-14 border-2 border-primary">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-foreground">
                          {member.name}·{member.age}岁
                        </div>
                      </div>
                    </div>

                    {/* 能力标签 */}
                    <div className="flex flex-wrap gap-2">
                      {member.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* 一句话需求 */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.need}
                    </p>

                    {/* 核心吸引力 */}
                    <div className="flex items-center space-x-2 text-xs text-primary font-medium">
                      {member.highlight.icon}
                      <span>{member.highlight.text}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 温暖文案 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
          <p className="text-sm text-orange-900 text-center font-serif">
            ✨ 每个人都是一座孤岛，直到有人愿意渡海而来
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
