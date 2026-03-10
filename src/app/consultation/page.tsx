'use client';

import { PageContainer } from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Lightbulb, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CaseData {
  id: string;
  type: string;
  title: string;
  description: string;
  solution: string;
}

export default function ConsultationPage() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    type: 'psychology' as 'psychology' | 'business' | 'both',
    title: '',
    situation: '',
    help: '',
    wantCase: 'consider' as 'yes' | 'consider' | 'no',
  });

  useEffect(() => {
    async function loadCases() {
      try {
        // TODO: 创建 /api/consultations/cases 接口
        const response = await fetch('/api/consultations/cases');
        const data = await response.json();

        if (data.success) {
          setCases(data.data);
        }
      } catch (err) {
        console.error('Failed to load cases:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 提交表单
    alert('已收到您的留言，我们将在3个工作日内反馈');
  };

  return (
    <PageContainer title="有些路，一个人走太累">
      <div className="space-y-10">
        {/* 案例展示 */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
            真实案例
          </h3>

          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              加载中...
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              暂无案例
            </div>
          ) : (
            <div className="space-y-8">
              {cases.map((caseItem) => (
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
          )}
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
              <Label>是否愿意被做成案例 *</Label>
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
                  <Label htmlFor="consider">考虑</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">不愿意</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" size="lg">
              提交咨询
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
