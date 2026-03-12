import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
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
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700">
                登录
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
                注册
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            点燃创业激情
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mt-2">
              成就创业梦想
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            连接创业者，分享经验，共同成长
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/activities" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              探索活动
            </Link>
            <Link href="/declarations" className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition border">
              发表宣告
            </Link>
          </div>
        </div>

        {/* 每日宣告 */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">每日宣告</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>20年技术积淀，重塑制造业</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">用AI技术助力传统企业转型升级</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>创业心理学</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">深度解析创业者心理，助力成长</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>拥抱AI，改变基因</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">专为35+创业者打造</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 热门活动 */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">热门活动</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>创业沙龙</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">与成功创业者面对面交流</p>
                <div className="text-sm text-gray-500">
                  <p>时间：每周六 14:00</p>
                  <p>地点：杭州西湖区</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>企业走访</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">深入了解优秀企业的运营模式</p>
                <div className="text-sm text-gray-500">
                  <p>时间：每月一次</p>
                  <p>地点：杭州市内</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-green-400 rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>创业工作坊</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">实战演练，快速提升创业能力</p>
                <div className="text-sm text-gray-500">
                  <p>时间：每月一次</p>
                  <p>地点：线上+线下</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-400">© 2024 燃场. 点燃创业激情，成就创业梦想.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
