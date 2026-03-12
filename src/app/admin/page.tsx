import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              燃场后台
            </h1>
          </div>
          <nav className="mt-6">
            <Link href="/admin" className="flex items-center px-6 py-3 text-purple-600 bg-purple-50 border-r-4 border-purple-600">
              <span>📊</span>
              <span className="ml-3">仪表盘</span>
            </Link>
            <Link href="/admin/members" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>👥</span>
              <span className="ml-3">会员管理</span>
            </Link>
            <Link href="/admin/activities" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>🎯</span>
              <span className="ml-3">活动管理</span>
            </Link>
            <Link href="/admin/visits" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>🏢</span>
              <span className="ml-3">探访管理</span>
            </Link>
            <Link href="/admin/declarations" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>📢</span>
              <span className="ml-3">宣告管理</span>
            </Link>
            <Link href="/admin/documents" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>📄</span>
              <span className="ml-3">文档管理</span>
            </Link>
            <Link href="/admin/notifications" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>🔔</span>
              <span className="ml-3">通知管理</span>
            </Link>
            <Link href="/admin/settings" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>⚙️</span>
              <span className="ml-3">系统设置</span>
            </Link>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">仪表盘</h1>
            <p className="text-gray-600">欢迎回来，管理员</p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">总会员数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">1,234</div>
                <p className="text-sm text-gray-500 mt-2">+12% 较上月</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">活动总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">56</div>
                <p className="text-sm text-gray-500 mt-2">+3 本月新增</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">宣告总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">892</div>
                <p className="text-sm text-gray-500 mt-2">+28 本月新增</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-500">报名总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">345</div>
                <p className="text-sm text-gray-500 mt-2">+45 本月新增</p>
              </CardContent>
            </Card>
          </div>

          {/* 最近活动 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">创业心理学</p>
                      <p className="text-sm text-gray-500">2024-03-27 · 5/10 人</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">进行中</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">拥抱AI，改变基因</p>
                      <p className="text-sm text-gray-500">2024-03-28 · 3/20 人</p>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">报名中</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">阿里云创新中心探访</p>
                      <p className="text-sm text-gray-500">2024-03-29 · 8/30 人</p>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">报名中</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最新会员</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold">张三</p>
                      <p className="text-sm text-gray-500">技术总监 · 2024-03-12</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold">李四</p>
                      <p className="text-sm text-gray-500">CEO · 2024-03-11</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold">王五</p>
                      <p className="text-sm text-gray-500">产品经理 · 2024-03-10</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
