'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 模拟数据
const assessmentData = {
  id: 'career-mission',
  name: '事业使命感评估',
  description: '评估您的事业使命感水平，包括自我认知、价值追求、社会意义、长期愿景等维度，帮助您了解自己事业的深层驱动力。',
  duration: '约25分钟',
  questionCount: 30,
  categories: ['自我认知', '价值追求', '社会意义', '长期愿景', '行动力'],
};

const questions = [
  {
    id: 1,
    category: '自我认知',
    question: '您如何定义自己？',
    options: [
      { value: 1, label: '不知道' },
      { value: 2, label: '按职业定义' },
      { value: 3, label: '按能力定义' },
      { value: 4, label: '按价值观定义' },
      { value: 5, label: '有清晰的自我认知和人生定位' },
    ],
  },
  {
    id: 2,
    category: '自我认知',
    question: '您最大的优势是什么？',
    options: [
      { value: 1, label: '不清楚' },
      { value: 2, label: '专业技能' },
      { value: 3, label: '学习能力' },
      { value: 4, label: '综合能力' },
      { value: 5, label: '独特的天赋和深层的价值驱动力' },
    ],
  },
  {
    id: 3,
    category: '价值追求',
    question: '您工作中最看重什么？',
    options: [
      { value: 1, label: '收入' },
      { value: 2, label: '稳定性' },
      { value: 3, label: '成就感' },
      { value: 4, label: '成长空间' },
      { value: 5, label: '实现个人价值和创造社会意义' },
    ],
  },
  {
    id: 4,
    category: '价值追求',
    question: '什么会让您感到真正的满足？',
    options: [
      { value: 1, label: '赚钱' },
      { value: 2, label: '升职' },
      { value: 3, label: '获得认可' },
      { value: 4, label: '帮助他人' },
      { value: 5, label: '活出真实的自己，创造独特价值' },
    ],
  },
  {
    id: 5,
    category: '社会意义',
    question: '您的工作对社会有什么意义？',
    options: [
      { value: 1, label: '没想过' },
      { value: 2, label: '服务客户' },
      { value: 3, label: '创造就业' },
      { value: 4, label: '推动行业进步' },
      { value: 5, label: '解决社会问题，推动正向改变' },
    ],
  },
  {
    id: 6,
    category: '社会意义',
    question: '如何理解"成功"？',
    options: [
      { value: 1, label: '赚大钱' },
      { value: 2, label: '有地位' },
      { value: 3, label: '实现目标' },
      { value: 4, label: '得到认可' },
      { value: 5, label: '活出使命，影响和改变他人' },
    ],
  },
  {
    id: 7,
    category: '长期愿景',
    question: '您的长期目标是？',
    options: [
      { value: 1, label: '没有明确目标' },
      { value: 2, label: '3年目标' },
      { value: 3, label: '5年目标' },
      { value: 4, label: '10年愿景' },
      { value: 5, label: '有清晰的人生使命和终极愿景' },
    ],
  },
  {
    id: 8,
    category: '长期愿景',
    question: '您希望10年后成为什么样的人？',
    options: [
      { value: 1, label: '没想过' },
      { value: 2, label: '有钱人' },
      { value: 3, label: '成功人士' },
      { value: 4, label: '行业专家' },
      { value: 5, label: '活出使命的人，影响和改变世界' },
    ],
  },
  {
    id: 9,
    category: '行动力',
    question: '如何实现自己的目标？',
    options: [
      { value: 1, label: '等待机会' },
      { value: 2, label: '制定计划' },
      { value: 3, label: '分步执行' },
      { value: 4, label: '快速迭代' },
      { value: 5, label: '以使命为导向，持续学习和调整' },
    ],
  },
  {
    id: 10,
    category: '行动力',
    question: '遇到困难时，您会？',
    options: [
      { value: 1, label: '放弃' },
      { value: 2, label: '寻求帮助' },
      { value: 3, label: '坚持努力' },
      { value: 4, label: '调整策略' },
      { value: 5, label: '从使命出发，找到更深的动力' },
    ],
  },
];

export default function CareerMissionAssessmentPage() {
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
      window.location.href = '/assessment/career-mission/result';
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
