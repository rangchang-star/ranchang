import { NextRequest, NextResponse } from 'next/server';
import { db, approvals, appUsers } from '@/lib/db';
import { desc, eq, like, and } from 'drizzle-orm';

// GET - 获取审批列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const search = searchParams.get('search') || '';

    // 构建查询条件
    const conditions = [];

    if (type) {
      conditions.push(eq(approvals.type, type));
    }

    if (status) {
      conditions.push(eq(approvals.status, status));
    }

    let query = db
      .select()
      .from(approvals)
      .leftJoin(appUsers, eq(approvals.userId, appUsers.id))
      .orderBy(desc(approvals.createdAt));

    // 应用查询条件
    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    // 搜索筛选（如果有搜索词）
    if (search) {
      if (conditions.length > 0) {
        query = (query as any).where(like(approvals.title, `%${search}%`));
      } else {
        query = (query as any).where(like(approvals.title, `%${search}%`));
      }
    }

    const approvalList = await query;

    const data = approvalList.map((item: any) => ({
      id: item.approvals.id,
      userId: item.approvals.userId,
      userName: item.app_users?.name || item.app_users?.nickname,
      type: item.approvals.type,
      title: item.approvals.title,
      description: item.approvals.description,
      status: item.approvals.status,
      reviewNote: item.approvals.reviewNote,
      reviewedAt: item.approvals.reviewedAt,
      createdAt: item.approvals.createdAt,
      updatedAt: item.approvals.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取审批列表失败:', error);
    // 如果表不存在，返回空数据而不是错误
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === '42P01') {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
    return NextResponse.json(
      { success: false, error: '获取审批列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建审批
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newApproval = await db
      .insert(approvals)
      .values({
        id: crypto.randomUUID(),
        userId: body.userId,
        type: body.type,
        title: body.title,
        description: body.description,
        status: 'pending',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newApproval[0],
    });
  } catch (error) {
    console.error('创建审批失败:', error);
    return NextResponse.json(
      { success: false, error: '创建审批失败' },
      { status: 500 }
    );
  }
}
