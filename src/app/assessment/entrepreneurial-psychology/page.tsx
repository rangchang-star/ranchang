'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 模拟数据
const assessmentData = {
  id: 'entrepreneurial-psychology',
  name: '创业心理评估',
  description: '评估您的创业心理素质，包括风险承受能力、决策能力、抗压能力、创新意识等多个维度，帮助您了解自己的创业心理状态。',
  duration: '约15分钟',
  questionCount: 20,
  categories: ['风险承受', '决策能力', '抗压能力', '创新意识', '团队协作'],
};

const questions = [
  {
    id: 1,
    category: '风险承受',
    question: '当面临一个高风险高回报的投资机会时，您会怎么做？',
    options: [
      { value: 1, label: '完全不会考虑，风险太大' },
      { value: 2, label: '会仔细评估，但不太可能投资' },
      { value: 3, label: '会投入少量资金尝试' },
      { value: 4, label: '会投入部分资金' },
      { value: 5, label: '会全力以赴，抓住机会' },
    ],
  },
  {
    id: 2,
    category: '风险承受',
    question: '您的创业项目遭遇重大挫折，损失了一半资金，您会怎么做？',
    options: [
      { value: 1, label: '立即停止，退出创业' },
      { value: 2, label: '暂停项目，重新评估' },
      { value: 3, label: '继续项目，但会更加谨慎' },
      { value: 4, label: '积极寻找新的资金来源，继续推进' },
      { value: 5, label: '把挫折视为机会，调整策略后重新出发' },
    ],
  },
  {
    id: 3,
    category: '决策能力',
    question: '当需要在有限信息下做出重要决策时，您通常会？',
    options: [
      { value: 1, label: '尽量拖延，等待更多信息' },
      { value: 2, label: '寻求他人意见，依赖他人决策' },
      { value: 3, label: '根据直觉快速决策' },
      { value: 4, label: '分析现有信息，权衡利弊后决策' },
      { value: 5, label: '快速决策，并准备好应对各种可能' },
    ],
  },
  {
    id: 4,
    category: '决策能力',
    question: '当团队内部对重大决策有分歧时，您会？',
    options: [
      { value: 1, label: '回避冲突，不做决定' },
      { value: 2, label: '采纳多数人的意见' },
      { value: 3, label: '听取各方意见后自己决定' },
      { value: 4, label: '引导讨论，寻求共识' },
      { value: 5, label: '快速做出决策，承担责任' },
    ],
  },
  {
    id: 5,
    category: '抗压能力',
    question: '当您连续工作一周，项目进展缓慢时，您会？',
    options: [
      { value: 1, label: '感到沮丧，想要放弃' },
      { value: 2, label: '感到焦虑，怀疑自己的能力' },
      { value: 3, label: '调整心态，继续努力' },
      { value: 4, label: '主动寻求帮助和建议' },
      { value: 5, label: '从失败中学习，重新制定计划' },
    ],
  },
  {
    id: 6,
    category: '抗压能力',
    question: '当竞争对手推出更优秀的产品时，您会？',
    options: [
      { value: 1, label: '感到恐慌，不知所措' },
      { value: 2, label: '等待对手犯错' },
      { value: 3, label: '模仿对手的产品' },
      { value: 4, label: '分析对手的优势，寻找差异化机会' },
      { value: 5, label: '把竞争视为动力，加速产品迭代' },
    ],
  },
  {
    id: 7,
    category: '创新意识',
    question: '您如何看待传统商业模式？',
    options: [
      { value: 1, label: '遵循传统，不要轻易改变' },
      { value: 2, label: '在传统基础上做小调整' },
      { value: 3, label: '考虑创新，但担心风险' },
      { value: 4, label: '积极探索新的商业模式' },
      { value: 5, label: '主动颠覆传统，追求创新' },
    ],
  },
  {
    id: 8,
    category: '创新意识',
    question: '当您有一个创新的想法时，您会？',
    options: [
      { value: 1, label: '只是想想，不会付诸行动' },
      { value: 2, label: '和少数人讨论，听听意见' },
      { value: 3, label: '小范围尝试' },
      { value: 4, label: '制定计划，逐步实施' },
      { value: 5, label: '立即行动，快速验证' },
    ],
  },
  {
    id: 9,
    category: '团队协作',
    question: '您认为团队成员应该具备的最重要品质是？',
    options: [
      { value: 1, label: '服从领导' },
      { value: 2, label: '专业技能强' },
      { value: 3, label: '有责任心' },
      { value: 4, label: '有创新精神' },
      { value: 5, label: '共同价值观和愿景' },
    ],
  },
  {
    id: 10,
    category: '团队协作',
    question: '当团队成员出现矛盾时，您会？',
    options: [
      { value: 1, label: '回避矛盾，让时间解决' },
      { value: 2, label: '分别谈话，了解情况' },
      { value: 3, label: '公开讨论，寻找解决方案' },
      { value: 4, label: '建立规则，预防矛盾' },
      { value: 5, label: '把矛盾转化为团队成长的机会' },
    ],
  },
];

export default function EntrepreneurialPsychologyAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (value: number) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    });

    // 自动跳到下一题
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsCompleted(true);
    // 这里应该提交答案到后端
    console.log('提交答案:', answers);

    // 延迟后跳转到结果页
    setTimeout(() => {
      window.location.href = '/assessment/entrepreneurial-psychology/result';
    }, 2000);
  };

  const progress = ((Object.keys(answers).length / questions.length) * 100).toFixed(0);

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-5">
          <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">提交成功</h2>
          <p className="text-[13px] text-[rgba(0,0,0,0.4)]">正在生成评估报告...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-[15px] font-semibold text-gray-900">{assessmentData.name}</h1>
            <div className="w-10" />
          </div>
        </div>

        {/* 进度条 */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between text-[11px] text-[rgba(0,0,0,0.4)] mb-2">
            <span>进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-[rgba(0,0,0,0.1)]">
            <div
              className="h-full bg-blue-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 题目区域 */}
        <div className="px-5">
          <div className="mb-6">
            <Badge className="rounded-none bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.6)] font-normal text-[10px] mb-3">
              {questions[currentQuestion].category}
            </Badge>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-[11px] text-[rgba(0,0,0,0.4)]">题目 {currentQuestion + 1}</span>
              <span className="text-[11px] text-[rgba(0,0,0,0.3)]">/ {questions.length}</span>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900 leading-relaxed">
              {questions[currentQuestion].question}
            </h2>
          </div>

          {/* 选项 */}
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left border hover:border-blue-400 hover:bg-blue-400 hover:bg-opacity-5 transition-all ${
                  answers[questions[currentQuestion].id] === option.value
                    ? 'border-blue-400 bg-blue-400 bg-opacity-10'
                    : 'border-[rgba(0,0,0,0.05)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-900">{option.label}</span>
                  <ChevronRight className="w-4 h-4 text-[rgba(0,0,0,0.2)]" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 底部导航 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.05)] z-50">
          <div className="w-full max-w-md mx-auto px-5 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="text-[13px]"
              >
                上一题
              </Button>
              <div className="flex items-center space-x-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 ${
                      index === currentQuestion
                        ? 'bg-blue-400'
                        : index < currentQuestion
                        ? 'bg-green-400'
                        : 'bg-[rgba(0,0,0,0.1)]'
                    }`}
                  />
                ))}
              </div>
              {currentQuestion < questions.length - 1 && (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="bg-blue-400 hover:bg-blue-500 font-normal text-[13px]"
                >
                  下一题
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
