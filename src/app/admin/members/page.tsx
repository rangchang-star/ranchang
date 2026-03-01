'use client';

import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Edit, Eye, Shield, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const mockMembers = [
  {
    id: '1',
    name: '王姐',
    age: 48,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Felix',
    level: '活跃会员',
    tags: ['供应链专家', '数字化转型'],
    joinDate: '2024-01-15',
    status: 'active',
    isFeatured: true,
  },
  {
    id: '2',
    name: '李明',
    age: 52,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=John',
    level: '智囊团',
    tags: ['投融资', '战略规划'],
    joinDate: '2024-02-20',
    status: 'active',
    isFeatured: true,
  },
  {
    id: '3',
    name: '张总',
    age: 45,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=Robert',
    level: '种子会员',
    tags: ['智能制造', '工业互联网'],
    joinDate: '2024-03-01',
    status: 'active',
    isFeatured: false,
  },
  {
    id: '4',
    name: '陈老师',
    age: 50,
    avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=William',
    level: '种子会员',
    tags: ['组织发展', '人才梯队'],
    joinDate: '2024-03-10',
    status: 'inactive',
    isFeatured: false,
  },
];

export default function AdminMembersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">会员管理</h2>
            <p className="text-muted-foreground">管理平台会员信息</p>
          </div>
          <Button>导出数据</Button>
        </div>

        {/* 搜索栏 */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索会员姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 会员列表 */}
        <Card>
          <CardHeader>
            <CardTitle>会员列表（{filteredMembers.length}）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {member.age}岁
                        </span>
                        {member.isFeatured && (
                          <Badge variant="outline" className="text-xs">
                            首页推荐
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.tags.join(' · ')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {member.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          加入于 {member.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {member.status === 'active' ? (
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <Shield className="w-5 h-5 text-gray-400" />
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
