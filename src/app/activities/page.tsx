import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ActivitiesPage() {
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
                <Link href="/activities" className="text-purple-600 font-semibold">活动</Link>
                <Link href="/declarations" className="text-gray-700 hover:text-purple-600">宣告</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-gray-700 hover:text-purple-600">
                个人中心
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">活动</h1>
            <p className="text-gray-600">参与活动，拓展人脉，提升能力</p>
          </div>
          <Link href="/admin/activities">
            <Button variant="outline">管理活动</Button>
          </Link>
        </div>

        {/* 筛选 */}
        <div className="flex space-x-4 mb-8">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-full">全部</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50">沙龙</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50">工作坊</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50">探访</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50">线上</button>
        </div>

        {/* 活动列表 */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-purple-400 to-blue-400 rounded-t-lg md:rounded-l-lg"></div>
              <div className="flex-1 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">沙龙</span>
                  <span className="text-gray-500 text-sm">2024-03-27 14:00-17:00</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">创业心理学</h2>
                <p className="text-gray-600 mb-4">
                  专为35+创业者打造的深度对话，探索创业者的心理状态，助力创业成长
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 杭州西湖区</span>
                    <span>👥 5/10 人</span>
                  </div>
                  <Button>立即报名</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-blue-400 to-cyan-400 rounded-t-lg md:rounded-l-lg"></div>
              <div className="flex-1 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">工作坊</span>
                  <span className="text-gray-500 text-sm">2024-03-28 14:00-17:00</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">拥抱AI，改变基因</h2>
                <p className="text-gray-600 mb-4">
                  用AI技术重塑传统行业，学习如何将AI应用到实际业务中
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 杭州滨江区</span>
                    <span>👥 3/20 人</span>
                  </div>
                  <Button>立即报名</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-cyan-400 to-green-400 rounded-t-lg md:rounded-l-lg"></div>
              <div className="flex-1 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">探访</span>
                  <span className="text-gray-500 text-sm">2024-03-29 14:00-17:00</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">阿里云创新中心探访</h2>
                <p className="text-gray-600 mb-4">
                  深入了解云原生技术发展和创业孵化模式，与行业专家面对面交流
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 北京市海淀区</span>
                    <span>👥 8/30 人</span>
                  </div>
                  <Button>立即报名</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
