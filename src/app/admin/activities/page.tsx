import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminActivitiesPage() {
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
            <Link href="/admin" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>📊</span>
              <span className="ml-3">仪表盘</span>
            </Link>
            <Link href="/admin/members" className="flex items-center px-6 py-3 text-gray-700 hover:text-purple-600 hover:bg-gray-50">
              <span>👥</span>
              <span className="ml-3">会员管理</span>
            </Link>
            <Link href="/admin/activities" className="flex items-center px-6 py-3 text-purple-600 bg-purple-50 border-r-4 border-purple-600">
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">活动管理</h1>
              <p className="text-gray-600">管理所有活动和报名</p>
            </div>
            <Button>创建活动</Button>
          </div>

          {/* 筛选 */}
          <div className="flex space-x-4 mb-6">
            <select className="px-4 py-2 border rounded-lg bg-white">
              <option>全部状态</option>
              <option>草稿</option>
              <option>已发布</option>
              <option>已结束</option>
              <option>已取消</option>
            </select>
            <select className="px-4 py-2 border rounded-lg bg-white">
              <option>全部类型</option>
              <option>沙龙</option>
              <option>工作坊</option>
              <option>探访</option>
            </select>
          </div>

          {/* 活动列表 */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">活动名称</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">类型</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">日期</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">报名人数</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">状态</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">创业心理学</p>
                        <p className="text-sm text-gray-500">杭州西湖区</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">沙龙</span>
                    </td>
                    <td className="px-6 py-4 text-sm">2024-03-27</td>
                    <td className="px-6 py-4 text-sm">5/10</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">进行中</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm">编辑</Button>
                      <Button variant="ghost" size="sm">报名</Button>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">拥抱AI，改变基因</p>
                        <p className="text-sm text-gray-500">杭州滨江区</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">工作坊</span>
                    </td>
                    <td className="px-6 py-4 text-sm">2024-03-28</td>
                    <td className="px-6 py-4 text-sm">3/20</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">报名中</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm">编辑</Button>
                      <Button variant="ghost" size="sm">报名</Button>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">阿里云创新中心探访</p>
                        <p className="text-sm text-gray-500">北京市海淀区</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">探访</span>
                    </td>
                    <td className="px-6 py-4 text-sm">2024-03-29</td>
                    <td className="px-6 py-4 text-sm">8/30</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">报名中</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm">编辑</Button>
                      <Button variant="ghost" size="sm">报名</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
