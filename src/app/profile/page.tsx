import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                燃场
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-purple-600">首页</Link>
                <Link href="/discovery" className="text-gray-700 hover:text-purple-600">发现</Link>
                <Link href="/activities" className="text-gray-700 hover:text-purple-600">活动</Link>
                <Link href="/declarations" className="text-gray-700 hover:text-purple-600">宣告</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧个人信息 */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mb-4"></div>
                  <CardTitle className="text-2xl">张三</CardTitle>
                  <p className="text-gray-500 text-sm mt-2">技术总监 · AI创业</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">公司</p>
                    <p className="font-semibold">杭州创新科技有限公司</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">行业</p>
                    <p className="font-semibold">人工智能</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">等级</p>
                    <p className="font-semibold text-purple-600">LV.5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">成就</p>
                    <p className="text-sm">AI创业先锋 · 技术专家</p>
                  </div>
                  <Button className="w-full">编辑资料</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧内容 */}
          <div className="md:col-span-2 space-y-6">
            {/* 我的宣告 */}
            <Card>
              <CardHeader>
                <CardTitle>我的宣告</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold mb-2">我要成为最优秀的技术创业者</p>
                    <p className="text-sm text-gray-600 mb-2">15年技术积淀，我用AI重塑传统制造业...</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>👍 128</span>
                      <span>👁️ 1256</span>
                      <span>2024-03-12</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold mb-2">用AI改变世界</p>
                    <p className="text-sm text-gray-600 mb-2">技术的力量是无穷的...</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>👍 89</span>
                      <span>👁️ 654</span>
                      <span>2024-03-10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 我的活动 */}
            <Card>
              <CardHeader>
                <CardTitle>我的活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold mb-2">创业心理学</p>
                        <p className="text-sm text-gray-600 mb-2">2024-03-27 14:00-17:00</p>
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">已报名</span>
                      </div>
                      <span className="text-purple-600">查看详情</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold mb-2">拥抱AI，改变基因</p>
                        <p className="text-sm text-gray-600 mb-2">2024-03-28 14:00-17:00</p>
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">待审核</span>
                      </div>
                      <span className="text-purple-600">查看详情</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 我的文档 */}
            <Card>
              <CardHeader>
                <CardTitle>我的文档</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold mb-2">AI创业指南.pdf</p>
                      <p className="text-sm text-gray-600">2.5 MB · 2024-03-10</p>
                    </div>
                    <span className="text-purple-600">下载</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold mb-2">技术架构设计.docx</p>
                      <p className="text-sm text-gray-600">1.2 MB · 2024-03-08</p>
                    </div>
                    <span className="text-purple-600">下载</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
