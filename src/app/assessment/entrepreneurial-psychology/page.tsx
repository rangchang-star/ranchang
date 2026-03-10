"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  category: string;
  question: string;
  options: { value: number; label: string }[];
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  duration: string;
  questionCount: number;
  categories: string[];
  questions: Question[];
}

export default function EntrepreneurialPsychologyPage() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    async function loadAssessment() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/assessments/entrepreneurial-psychology`);
        const data = await res.json();
        if (data.success) {
          setAssessment(data.data);
        }
      } catch (error) {
        console.error("加载评估失败:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAssessment();
  }, []);

  const handleAnswer = (questionId: number, value: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: value });
  };

  const handleNext = () => {
    if (assessment && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/assessments/entrepreneurial-psychology/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessment?.id,
          answers: selectedAnswers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/assessment/entrepreneurial-psychology/result?id=${data.resultId}`;
      }
    } catch (error) {
      console.error("提交失败:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="w-full max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="text-gray-400">加载中...</div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="w-full max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
          <div className="text-gray-400">加载失败</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Link href="/assessment">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">{assessment.name}</h1>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>⏱️ {assessment.duration}</span>
              <span>📋 {assessment.questionCount} 题</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>进度</span>
              <span>{currentQuestionIndex + 1}/{assessment.questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {showResult ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                评估完成！
              </h2>
              <p className="text-gray-600 mb-6">
                您已完成所有问题，点击下方按钮提交答案。
              </p>
              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                提交评估
              </Button>
            </div>
          ) : (
            <div>
              <Badge variant="secondary" className="mb-4">
                {assessment.questions[currentQuestionIndex].category}
              </Badge>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                {assessment.questions[currentQuestionIndex].question}
              </h2>

              <div className="space-y-3">
                {assessment.questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleAnswer(assessment.questions[currentQuestionIndex].id, option.value)
                    }
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedAnswers[assessment.questions[currentQuestionIndex].id] === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!selectedAnswers[assessment.questions[currentQuestionIndex].id]}
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
              >
                {currentQuestionIndex === assessment.questions.length - 1 ? "完成" : "下一题"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
