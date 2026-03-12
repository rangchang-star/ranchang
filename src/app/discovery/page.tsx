import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DiscoveryPage() {
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
                <Link href="/discovery" className="text-purple-600 font-semibold">发现</Link>
                <Link href="/activities" className="text-gray-700 hover:text-purple-600">活动</Link>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">发现精彩</h1>
          <p className="text-gray-600">探索创业故事，发现无限可能</p>
        </div>

        {/* 筛选 */}
        <div className="flex space-x-4 mb-8">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-full">全部</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50">活动</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50">探访</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-50">宣告</button>
        </div>

        {/* 活动列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/activities/1">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">沙龙</span>
                  <span className="text-gray-500 text-sm">2024-03-27</span>
                </div>
                <CardTitle>创业心理学</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">专为35+创业者打造的深度对话</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>杭州西湖区</span>
                  <span>5/10 人</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/activities/2">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">工作坊</span>
                  <span className="text-gray-500 text-sm">2024-03-28</span>
                </div>
                <CardTitle>拥抱AI，改变基因</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">用AI重塑传统行业</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>杭州滨江区</span>
                  <span>3/20 人</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/activities/3">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-green-400 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">探访</span>
                  <span className="text-gray-500 text-sm">2024-03-29</span>
                </div>
                <CardTitle>阿里云创新中心探访</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">了解云原生技术发展</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>杭州市海淀区</span>
                  <span>8/30 人</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
