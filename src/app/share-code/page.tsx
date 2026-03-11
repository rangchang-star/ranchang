'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileArchive, Clock, Package, CheckCircle } from 'lucide-react';

export default function ShareCodePage() {
  const [packageInfo, setPackageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPackageInfo();
  }, []);

  const fetchPackageInfo = async () => {
    try {
      setLoading(true);
      // 这里可以调用 API 获取包信息，暂时用静态数据
      setPackageInfo({
        name: 'ran-field-app',
        version: '20260311_175224',
        size: '332K',
        timestamp: new Date().toLocaleString('zh-CN'),
        description: '燃场 App 完整项目代码',
      });
    } catch (error) {
      console.error('获取包信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch('/api/download-code');

      if (!response.ok) {
        throw new Error('下载失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // 从响应头获取文件名
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'code-package.tar.gz';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('下载失败:', error);
      alert('下载失败: ' + error.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center text-slate-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-4">
            <FileArchive className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">代码分享</h1>
          <p className="text-slate-400">下载燃场 App 项目代码包</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              代码包信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">项目名称</div>
                <div className="text-white font-medium">{packageInfo?.name}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">版本</div>
                <div className="text-white font-medium">{packageInfo?.version}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">文件大小</div>
                <div className="text-white font-medium">{packageInfo?.size}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">生成时间</div>
                <div className="text-white font-medium">{packageInfo?.timestamp}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-2">包含内容</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  完整源代码（src/）
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  配置文件（package.json, tsconfig.json 等）
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  项目文档（README.md, docs/）
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  数据库配置
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>1. 下载代码包后，使用以下命令解压：</p>
            <code className="block bg-slate-900 p-3 rounded text-xs text-slate-300">
              tar -xzf ran-field-app_*.tar.gz
            </code>
            <p className="mt-4">2. 进入项目目录：</p>
            <code className="block bg-slate-900 p-3 rounded text-xs text-slate-300">
              cd ran-field-app_*
            </code>
            <p className="mt-4">3. 安装依赖：</p>
            <code className="block bg-slate-900 p-3 rounded text-xs text-slate-300">
              pnpm install
            </code>
            <p className="mt-4">4. 启动开发服务器：</p>
            <code className="block bg-slate-900 p-3 rounded text-xs text-slate-300">
              pnpm dev
            </code>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          >
            {downloading ? (
              <>
                <Download className="w-4 h-4 mr-2 animate-bounce" />
                下载中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                下载代码包
              </>
            )}
          </Button>
          <p className="text-slate-500 text-sm mt-3">
            压缩包大小：{packageInfo?.size}
          </p>
        </div>
      </div>
    </div>
  );
}
