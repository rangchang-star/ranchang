'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 模拟数据
const assessmentData = {
  id: 'ai-cognition',
  name: 'AI认知评估',
  description: '评估您的AI认知水平，包括AI基础理解、AI应用能力、AI伦理意识、AI战略思维等维度，帮助您了解自己在AI时代的认知水平。',
  duration: '约18分钟',
  questionCount: 22,
  categories: ['AI基础', 'AI应用', 'AI伦理', 'AI战略', 'AI工具'],
};

const questions = [
  {
    id: 1,
    category: 'AI基础',
    question: '您如何理解人工智能？',
    options: [
      { value: 1, label: '就是机器人' },
      { value: 2, label: '一种计算机程序' },
      { value: 3, label: '能模仿人类智能的系统' },
      { value: 4, label: '通过数据和算法实现智能决策的技术' },
      { value: 5, label: '模拟、延伸和扩展人类智能的理论、方法、技术及应用系统' },
    ],
  },
  {
    id: 2,
    category: 'AI基础',
    question: '机器学习和深度学习的区别是什么？',
    options: [
      { value: 1, label: '没有区别' },
      { value: 2, label: '深度学习更高级' },
      { value: 3, label: '算法不同' },
      { value: 4, label: '深度学习基于神经网络' },
      { value: 5, label: '深度学习是机器学习的子集，基于多层神经网络' },
    ],
  },
  {
    id: 3,
    category: 'AI应用',
    question: '在您的行业中，AI有哪些应用场景？',
    options: [
      { value: 1, label: '不了解' },
      { value: 2, label: '听说过几个' },
      { value: 3, label: '了解一些常见应用' },
      { value: 4, label: '能列出多个应用场景' },
      { value: 5, label: '深入了解并能评估应用效果和ROI' },
    ],
  },
  {
    id: 4,
    category: 'AI应用',
    question: '如何评估一个AI项目的价值？',
    options: [
      { value: 1, label: '看技术先进性' },
      { value: 2, label: '看成本' },
      { value: 3, label: '看应用效果' },
      { value: 4, label: '成本+效果' },
      { value: 5, label: '技术可行性+成本+ROI+战略价值+风险' },
    ],
  },
  {
    id: 5,
    category: 'AI伦理',
    question: 'AI应用中最重要的伦理问题是什么？',
    options: [
      { value: 1, label: '成本问题' },
      { value: 2, label: '技术问题' },
      { value: 3, label: '效率问题' },
      { value: 4, label: '隐私和安全' },
      { value: 5, label: '隐私+公平+透明+可解释性+责任归属' },
    ],
  },
  {
    id: 6,
    category: 'AI伦理',
    question: '如何确保AI的公平性？',
    options: [
      { value: 1, label: '不需要' },
      { value: 2, label: '人工审查' },
      { value: 3, label: '算法优化' },
      { value: 4, label: '多样化数据' },
      { value: 5, label: '多样化数据+算法审计+持续监控+人工监督' },
    ],
  },
  {
    id: 7,
    category: 'AI战略',
    question: '企业AI战略应该从哪里开始？',
    options: [
      { value: 1, label: '购买AI工具' },
      { value: 2, label: '招聘AI人才' },
      { value: 3, label: '培训员工' },
      { value: 4, label: '寻找应用场景' },
      { value: 5, label: '明确业务目标+识别高价值场景+评估可行性+制定路线图' },
    ],
  },
  {
    id: 8,
    category: 'AI战略',
    question: '如何构建企业的AI能力？',
    options: [
      { value: 1, label: '购买解决方案' },
      { value: 2, label: '外包开发' },
      { value: 3, label: '招聘AI专家' },
      { value: 4, label: '建立AI团队' },
      { value: 5, label: '培养AI文化+建设团队能力+建立数据基础设施+持续迭代' },
    ],
  },
  {
    id: 9,
    category: 'AI工具',
    question: '您使用过哪些AI工具？',
    options: [
      { value: 1, label: '没用过' },
      { value: 2, label: '听说过' },
      { value: 3, label: '偶尔使用' },
      { value: 4, label: '经常使用几个' },
      { value: 5, label: '广泛使用并能够评估效果' },
    ],
  },
  {
    id: 10,
    category: 'AI工具',
    question: '如何选择AI工具？',
    options: [
      { value: 1, label: '看热度' },
      { value: 2, label: '看价格' },
      { value: 3, label: '看功能' },
      { value: 4, label: '功能+价格' },
      { value: 5, label: '需求匹配+功能评估+成本效益+安全合规+可扩展性' },
    ],
  },
];

export default function AICognitionAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (value: number) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsCompleted(true);
    console.log('提交答案:', answers);
    setTimeout(() => {
      window.location.href = '/assessment/ai-cognition/result';
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

        <div className="px-5 py-4">
          <div className="flex items-center justify-between text-[11px] text-[rgba(0,0,0,0.4)] mb-2">
            <span>进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-[rgba(0,0,0,0.1)]">
            <div className="h-full bg-blue-400 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

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
