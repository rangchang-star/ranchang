import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // TODO: 从数据库获取用户收藏的探访项目列表
    // 这里先返回模拟数据
    const mockFavorites = [
      {
        id: '1',
        userId: userId,
        visitId: '1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: userId,
        visitId: '2',
        createdAt: new Date().toISOString(),
      },
    ];

    // 根据 visitId 获取真实的探访项目数据
    const favorites = mockFavorites.map((fav) => {
      const visit = MockDatabase.getVisitById(fav.visitId);
      return {
        ...fav,
        visit: visit ? {
          id: visit.id,
          title: visit.title,
          image: visit.image,
          date: visit.date,
          industry: visit.industry,
          tags: visit.tags,
          role: '探访人',
        } : null,
      };
    }).filter(fav => fav.visit !== null);

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取收藏列表失败',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { visitId } = body;

    if (!visitId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少探访项目ID',
        },
        { status: 400 }
      );
    }

    // TODO: 将收藏关系保存到数据库
    // 这里先返回成功
    return NextResponse.json({
      success: true,
      message: '收藏成功',
      data: {
        id: Date.now().toString(),
        userId,
        visitId,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('添加收藏失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '添加收藏失败',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { visitId } = body;

    if (!visitId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少探访项目ID',
        },
        { status: 400 }
      );
    }

    // TODO: 从数据库删除收藏关系
    // 这里先返回成功
    return NextResponse.json({
      success: true,
      message: '取消收藏成功',
    });
  } catch (error) {
    console.error('取消收藏失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取消收藏失败',
      },
      { status: 500 }
    );
  }
}
