'use client';

import Link from 'next/link';
import { ArrowLeft, Share2, Download, TrendingUp, Target, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';

// 模拟数据
const assessmentResults = {
  'entrepreneurial-psychology': {
    name: '创业心理评估',
    totalScore: 85,
    level: '优秀',
    levelColor: 'text-green-400',
    levelBg: 'bg-green-400',
    categories: [
      { name: '风险承受', score: 78, advice: '建议在重大决策前进行风险评估，制定应对方案。' },
      { name: '决策能力', score: 90, advice: '继续保持，可以进一步培养战略思维。' },
      { name: '抗压能力', score: 82, advice: '能力较强，建议加强情绪管理。' },
      { name: '创新意识', score: 88, advice: '保持创新热情，鼓励团队创新。' },
      { name: '团队协作', score: 87, advice: '团队协作能力突出，继续发挥领导力。' },
    ],
    strengths: ['决策果断', '抗压能力强', '创新思维活跃'],
    improvements: ['风险控制能力需加强', '情绪管理有待提升'],
    recommendations: [
      '建议定期进行风险评估培训',
      '可以参加创业心理辅导课程',
      '多与成功创业者交流经验',
      '建立完善的风险管理机制',
    ],
    completedAt: '2024年3月5日',
  },
  'business-cognition': {
    name: '商业认知评估',
    totalScore: 75,
    level: '良好',
    levelColor: 'text-blue-400',
    levelBg: 'bg-blue-400',
    categories: [
      { name: '市场洞察', score: 70, advice: '建议深入学习市场分析方法。' },
      { name: '商业模式', score: 80, advice: '商业模式认知较好，继续实践。' },
      { name: '财务素养', score: 65, advice: '建议加强财务知识学习。' },
      { name: '竞争策略', score: 78, advice: '竞争意识较强，可以更主动。' },
      { name: '战略思维', score: 82, advice: '战略思维突出，继续保持。' },
    ],
    strengths: ['战略思维清晰', '商业模式理解透彻'],
    improvements: ['财务知识需要加强', '市场分析能力需提升'],
    recommendations: [
      '参加财务管理培训',
      '阅读市场营销相关书籍',
      '多分析商业案例',
      '与商业专家交流学习',
    ],
    completedAt: '2024年3月10日',
  },
  'ai-cognition': {
    name: 'AI认知评估',
    totalScore: 68,
    level: '及格',
    levelColor: 'text-yellow-400',
    levelBg: 'bg-yellow-400',
    categories: [
      { name: 'AI基础', score: 75, advice: '基础较好，可以继续深入学习。' },
      { name: 'AI应用', score: 60, advice: '需要更多实践应用经验。' },
      { name: 'AI伦理', score: 70, advice: '伦理意识较好，继续保持。' },
      { name: 'AI战略', score: 65, advice: '战略思维需要培养。' },
      { name: 'AI工具', score: 70, advice: '多使用和评估AI工具。' },
    ],
    strengths: ['AI基础扎实', '伦理意识强'],
    improvements: ['应用经验不足', '战略思维需要提升'],
    recommendations: [
      '参与AI项目实践',
      '关注AI行业动态',
      '学习AI战略规划',
      '尝试使用更多AI工具',
    ],
    completedAt: '2024年3月8日',
  },
  'career-mission': {
    name: '事业使命感评估',
    totalScore: 92,
    level: '卓越',
    levelColor: 'text-purple-400',
    levelBg: 'bg-purple-400',
    categories: [
      { name: '自我认知', score: 90, advice: '自我认知清晰，继续保持。' },
      { name: '价值追求', score: 95, advice: '价值观明确，值得学习。' },
      { name: '社会意义', score: 88, advice: '社会意识强，继续发挥。' },
      { name: '长期愿景', score: 93, advice: '愿景清晰，目标坚定。' },
      { name: '行动力', score: 94, advice: '执行力强，值得肯定。' },
    ],
    strengths: ['使命清晰', '行动力强', '价值观坚定'],
    improvements: [],
    recommendations: [
      '继续深耕使命领域',
      '影响和带动更多人',
      '记录和分享你的经验',
      '持续学习和成长',
    ],
    completedAt: '2024年3月12日',
  },
};

export default function AssessmentResultPage() {
  const params = useParams();
  const assessmentId = params.id as string;
  const result = assessmentResults[assessmentId as keyof typeof assessmentResults];

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-5">
          <AlertCircle className="w-16 h-16 text-[rgba(0,0,0,0.3)] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">评估报告不存在</h2>
          <Link href="/profile/assessments">
            <Button className="mt-4 bg-blue-400 hover:bg-blue-500 font-normal">
              返回评估列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${result.name}结果`,
        text: `我的${result.name}得分：${result.totalScore}分`,
        url: window.location.href,
      });
    }
  };

  const handleDownload = () => {
    // 这里应该实现下载功能
    console.log('下载报告');
    alert('报告下载功能开发中');
  };

  const handleRetake = () => {
    window.location.href = `/assessment/${assessmentId}`;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile/assessments">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">评估报告</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={handleShare} className="p-2">
                <Share2 className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
              <Button variant="ghost" onClick={handleDownload} className="p-2">
                <Download className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* 总分卡片 */}
          <div className="p-6 bg-gradient-to-br from-blue-400 to-blue-500">
            <div className="text-center text-white">
              <h2 className="text-[13px] font-normal mb-2 opacity-80">{result.name}</h2>
              <div className="text-6xl font-bold mb-2">{result.totalScore}</div>
              <Badge className={`rounded-none ${result.levelBg} text-white font-normal text-[11px]`}>
                {result.level}
              </Badge>
              <p className="text-[11px] mt-3 opacity-80">评估于 {result.completedAt}</p>
            </div>
          </div>

          {/* 维度分析 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">维度分析</h3>
            <div className="space-y-4">
              {result.categories.map((category) => (
                <div key={category.name} className="p-4 bg-[rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-gray-900">{category.name}</span>
                    <span className="text-[13px] font-semibold text-blue-400">{category.score}分</span>
                  </div>
                  <div className="w-full h-2 bg-[rgba(0,0,0,0.1)] mb-2">
                    <div
                      className="h-full bg-blue-400 rounded-none"
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[rgba(0,0,0,0.5)]">{category.advice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 优势分析 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">优势分析</h3>
            <div className="space-y-2">
              {result.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-green-400 bg-opacity-10">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-[13px] text-gray-900">{strength}</span>
                </div>
              ))}
              {result.strengths.length === 0 && (
                <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                  继续努力，发现你的优势
                </p>
              )}
            </div>
          </div>

          {/* 改进建议 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">改进建议</h3>
            <div className="space-y-2">
              {result.improvements.map((improvement, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-400 bg-opacity-10">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-[13px] text-gray-900">{improvement}</span>
                </div>
              ))}
              {result.improvements.length === 0 && (
                <p className="text-[11px] text-[rgba(0,0,0,0.4)]">
                  表现优秀，继续保持
                </p>
              )}
            </div>
          </div>

          {/* 行动建议 */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">行动建议</h3>
            <div className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              onClick={handleRetake}
              variant="outline"
              className="flex-1 font-normal text-[13px]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重新评估
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 bg-blue-400 hover:bg-blue-500 font-normal text-[13px]"
            >
              <Download className="w-4 h-4 mr-2" />
              下载报告
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
