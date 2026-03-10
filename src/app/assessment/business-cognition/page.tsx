'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 模拟数据
const assessmentData = {
  id: 'business-cognition',
  name: '商业认知评估',
  description: '评估您的商业认知水平，包括市场洞察、商业模式、财务素养、竞争策略等维度，帮助您了解自己的商业认知状况。',
  duration: '约20分钟',
  questionCount: 25,
  categories: ['市场洞察', '商业模式', '财务素养', '竞争策略', '战略思维'],
};

const questions = [
  {
    id: 1,
    category: '市场洞察',
    question: '在进入一个新市场前，您认为最重要的是什么？',
    options: [
      { value: 1, label: '立即推出产品，快速占领市场' },
      { value: 2, label: '跟随竞争对手的产品' },
      { value: 3, label: '进行简单的市场调查' },
      { value: 4, label: '深入分析用户需求和痛点' },
      { value: 5, label: '构建完整的用户画像和市场分析' },
    ],
  },
  {
    id: 2,
    category: '市场洞察',
    question: '如何判断一个市场是否有潜力？',
    options: [
      { value: 1, label: '看市场规模' },
      { value: 2, label: '看竞争程度' },
      { value: 3, label: '看用户增长' },
      { value: 4, label: '看市场规模+增长率' },
      { value: 5, label: '综合分析市场、用户、竞争、政策等多维度' },
    ],
  },
  {
    id: 3,
    category: '商业模式',
    question: '您认为一个好的商业模式的核心是什么？',
    options: [
      { value: 1, label: '低价策略' },
      { value: 2, label: '高利润' },
      { value: 3, label: '快速增长' },
      { value: 4, label: '可持续盈利' },
      { value: 5, label: '创造独特价值+可持续盈利+可复制' },
    ],
  },
  {
    id: 4,
    category: '商业模式',
    question: '如何设计商业模式？',
    options: [
      { value: 1, label: '模仿成功案例' },
      { value: 2, label: '基于直觉' },
      { value: 3, label: '分析行业惯例' },
      { value: 4, label: '围绕用户需求设计' },
      { value: 5, label: '基于价值主张+用户需求+收入模式系统设计' },
    ],
  },
  {
    id: 5,
    category: '财务素养',
    question: '企业最重要的财务指标是什么？',
    options: [
      { value: 1, label: '销售额' },
      { value: 2, label: '利润' },
      { value: 3, label: '现金流' },
      { value: 4, label: 'ROI' },
      { value: 5, label: '现金流+ROI+利润率的综合评估' },
    ],
  },
  {
    id: 6,
    category: '财务素养',
    question: '如何评估一个项目的财务可行性？',
    options: [
      { value: 1, label: '看投资回报率' },
      { value: 2, label: '看回收期' },
      { value: 3, label: '看净现值' },
      { value: 4, label: 'ROI+回收期' },
      { value: 5, label: 'NPV+IRR+风险分析+敏感性分析' },
    ],
  },
  {
    id: 7,
    category: '竞争策略',
    question: '面对强大的竞争对手，您会采取什么策略？',
    options: [
      { value: 1, label: '价格战' },
      { value: 2, label: '模仿对手' },
      { value: 3, label: '避开竞争' },
      { value: 4, label: '寻找差异化' },
      { value: 5, label: '构建差异化+细分市场+生态合作' },
    ],
  },
  {
    id: 8,
    category: '竞争策略',
    question: '如何建立竞争壁垒？',
    options: [
      { value: 1, label: '价格优势' },
      { value: 2, label: '品牌推广' },
      { value: 3, label: '快速扩张' },
      { value: 4, label: '技术创新' },
      { value: 5, label: '技术+品牌+网络效应+规模经济综合构建' },
    ],
  },
  {
    id: 9,
    category: '战略思维',
    question: '制定战略时，您会优先考虑什么？',
    options: [
      { value: 1, label: '短期目标' },
      { value: 2, label: '竞争对手' },
      { value: 3, label: '市场机会' },
      { value: 4, label: '自身优势' },
      { value: 5, label: '愿景+使命+核心价值观+长期目标' },
    ],
  },
  {
    id: 10,
    category: '战略思维',
    question: '如何应对市场变化？',
    options: [
      { value: 1, label: '坚持原计划' },
      { value: 2, label: '被动应对' },
      { value: 3, label: '快速调整' },
      { value: 4, label: '主动预测' },
      { value: 5, label: '建立预警系统+敏捷调整+持续学习' },
    ],
  },
];

export default function BusinessCognitionAssessmentPage() {
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
      window.location.href = '/assessment/business-cognition/result';
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
