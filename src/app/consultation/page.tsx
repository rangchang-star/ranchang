'use client';

import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Lightbulb, Heart } from 'lucide-react';
import { useState } from 'react';

const mockCases = [
  {
    id: '1',
    type: '心理',
    title: '45岁转型，我整整失眠了半年',
    description: '在大厂工作了20年，突然不知道自己还能做什么，每天都在焦虑中度过...',
    solution: '通过专业心理咨询和小组支持，慢慢找回自我价值感',
  },
  {
    id: '2',
    type: '心理',
    title: '创业失败后，我该如何重新站起来',
    description: '第一次创业失败，投入的积蓄打了水漂，家人也不支持我继续...',
    solution: '接受失败是成长的一部分，寻求同行者支持和经验复盘',
  },
  {
    id: '3',
    type: '商业',
    title: '传统制造业转型，我该怎么选择方向',
    description: '做了15年制造，现在想做数字化转型，但不知道从哪里开始...',
    solution: '先做小范围试点，验证商业模式，再逐步扩大规模',
  },
  {
    id: '4',
    type: '商业',
    title: '合伙人分家，我该如何处理股权问题',
    description: '创业3年，合伙人对方向产生分歧，想要分家但不清楚股权如何处理...',
    solution: '建议寻求专业法务支持，提前签署好退出机制',
  },
];

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    type: 'psychology' as 'psychology' | 'business' | 'both',
    title: '',
    situation: '',
    help: '',
    wantCase: 'consider' as 'yes' | 'consider' | 'no',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 提交表单
    alert('已收到您的留言，我们将在3个工作日内反馈，结果可在"个人中心-我的咨询"查看');
  };

  return (
    <PageContainer title="有些路，一个人走太累">
      <div className="space-y-10">
        {/* 案例展示 */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
            真实案例
          </h3>
          <div className="space-y-8">
            {mockCases.map((caseItem) => (
              <div key={caseItem.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-lg text-foreground">
                    {caseItem.title}
                  </h4>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                      caseItem.type === '心理'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-secondary/50 text-secondary-foreground'
                    }`}
                  >
                    {caseItem.type === '心理' ? (
                      <Heart className="w-3 h-3 mr-1" />
                    ) : (
                      <Lightbulb className="w-3 h-3 mr-1" />
                    )}
                    {caseItem.type}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {caseItem.description}
                </p>

                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-medium">启发：</span>
                    {caseItem.solution}
                  </p>
                </div>

                <Button variant="outline" className="w-full text-sm">
                  类似困扰？点这里留言
                </Button>

                <div className="border-t border-border" />
              </div>
            ))}
          </div>
        </div>

        {/* 留言表单 */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
            留言咨询
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">称呼 *</Label>
                <Input
                  id="name"
                  placeholder="您的称呼"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">联系方式 *</Label>
                <Input
                  id="contact"
                  placeholder="手机/微信"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>问题类型 *</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, type: value })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="psychology" id="psychology" />
                  <Label htmlFor="psychology">心理</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">商业</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">两者</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">问题标题 *</Label>
              <Input
                id="title"
                placeholder="一句话概括"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="situation">情况说明 *</Label>
              <Textarea
                id="situation"
                placeholder="详细描述您的背景和困境"
                value={formData.situation}
                onChange={(e) =>
                  setFormData({ ...formData, situation: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="help">希望获得什么 *</Label>
              <Textarea
                id="help"
                placeholder="期待被如何支持"
                value={formData.help}
                onChange={(e) =>
                  setFormData({ ...formData, help: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>是否愿意成为案主</Label>
              <RadioGroup
                value={formData.wantCase}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, wantCase: value })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">愿意</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="consider" id="consider" />
                  <Label htmlFor="consider">需要考虑</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">暂不愿意</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">上传附件（可选）</Label>
              <Input
                id="attachment"
                type="file"
              />
              <p className="text-xs text-muted-foreground">
                支持 BP、文档等文件
              </p>
            </div>

            <Button type="submit" className="w-full">
              提交留言
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
