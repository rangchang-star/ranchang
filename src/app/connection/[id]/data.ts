// 服务器组件：获取数据
async function getUserData(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/api/users/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('加载用户信息失败');
  }

  const data = await response.json();
  return data;
}
