import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// GET - 获取高燃宣告列表
export async function GET(request: NextRequest) {
  try {
    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      // 注：由于schema中没有declarations表，暂时只使用模拟数据
      // 如果需要数据库支持，需要先在schema中添加declarations表定义
      console.warn('declarations表未定义，使用模拟数据');
    }

    // 使用统一的模拟数据
    const declarations = MockDatabase.getDeclarations();

    // 关联用户信息
    const declarationsWithUser = declarations.map(declaration => {
      const user = MockDatabase.getUserById(parseInt(declaration.userId));
      return {
        ...declaration,
        user: user ? {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          avatar: user.avatar,
          position: user.position,
          company: user.company,
          tags: user.hardcoreTags || user.tags || [], // 优先使用hardcoreTags
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: declarationsWithUser
    });
  } catch (error: any) {
    console.error('获取高燃宣告列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取高燃宣告列表失败'
    }, { status: 500 });
  }
}
