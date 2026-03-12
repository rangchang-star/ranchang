import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DeclarationsPage() {
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
                <Link href="/declarations" className="text-purple-600 font-semibold">宣告</Link>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">高燃宣告</h1>
            <p className="text-gray-600">大声宣告你的创业梦想</p>
          </div>
          <Button>发表宣告</Button>
        </div>

        {/* 宣告列表 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full"></div>
                <div>
                  <div className="font-semibold">张三</div>
                  <div className="text-sm text-gray-500">2024-03-12</div>
                </div>
              </div>
              <CardTitle className="text-2xl">我要成为最优秀的技术创业者</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                15年技术积淀，我用AI重塑传统制造业，让老工厂焕发新生机！我的使命是帮助1000家企业成功转型，让传统企业在数字时代绽放光彩！
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👍 128</span>
                <span>👁️ 1256</span>
                <span>💬 45</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full"></div>
                <div>
                  <div className="font-semibold">李四</div>
                  <div className="text-sm text-gray-500">2024-03-11</div>
                </div>
              </div>
              <CardTitle className="text-2xl">20年咨询生涯，助力企业数字化转型</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                20年咨询生涯，我的使命是帮助1000家企业成功转型，让传统企业在数字时代绽放光彩！
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👍 256</span>
                <span>👁️ 1089</span>
                <span>💬 78</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full"></div>
                <div>
                  <div className="font-semibold">王五</div>
                  <div className="text-sm text-gray-500">2024-03-10</div>
                </div>
              </div>
              <CardTitle className="text-2xl">用科技点亮创业之路</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                科技改变生活，创业改变世界。我相信技术的力量，也相信创业的力量。让我们一起用科技点亮创业之路！
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👍 89</span>
                <span>👁️ 654</span>
                <span>💬 32</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
