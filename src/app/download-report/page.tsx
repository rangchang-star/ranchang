'use client';

import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DownloadReportPage() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/BUSINESS_PROCESS_REPORT.txt';
    link.download = 'BUSINESS_PROCESS_REPORT.txt';
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            业务流程报告
          </h1>
          <p className="text-sm text-gray-600">
            燃场App业务流程说明报告 - 完整版
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              报告内容：
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 项目概览与技术栈</li>
              <li>• 网站结构与页面导航</li>
              <li>• 业务逻辑详细说明</li>
              <li>• 用户操作流程</li>
              <li>• 数据流转设计</li>
              <li>• 核心技术实现</li>
              <li>• 数据库设计</li>
              <li>• API接口文档</li>
              <li>• 部署方案</li>
              <li>• 后续开发建议</li>
            </ul>
          </div>

          <div className="text-xs text-gray-500 text-center">
            文件大小：约 22KB
          </div>
        </div>

        <Button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          下载报告
        </Button>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
