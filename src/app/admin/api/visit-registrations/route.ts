import { NextRequest, NextResponse } from 'next/server';
import { db, visitRegistrations, visits, appUsers } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

// GET - 获取探访报名列表（支持状态筛选）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || '';

    let query = db
      .select({
        id: visitRegistrations.id,
        visitId: visitRegistrations.visitId,
        userId: visitRegistrations.userId,
        status: visitRegistrations.status,
        note: visitRegistrations.note,
        createdAt: visitRegistrations.createdAt,
        updatedAt: visitRegistrations.updatedAt,
        // 探访信息
        visitTitle: visits.companyName,
        visitDate: visits.date,
        visitTime: visits.time,
        visitLocation: visits.location,
        // 用户信息
        userName: appUsers.name,
        userNickname: appUsers.nickname,
        userEmail: appUsers.email,
        userPhone: appUsers.phone,
      })
      .from(visitRegistrations)
      .leftJoin(visits, eq(visitRegistrations.visitId, visits.id))
      .leftJoin(appUsers, eq(visitRegistrations.userId, appUsers.id))
      .orderBy(desc(visitRegistrations.createdAt));

    // 状态筛选
    if (status) {
      query = (query as any).where(eq(visitRegistrations.status, status));
    }

    const registrations = await query;

    const data = registrations.map((reg) => ({
      id: reg.id,
      visitId: reg.visitId,
      userId: reg.userId,
      userName: reg.userName || reg.userNickname,
      userEmail: reg.userEmail,
      userPhone: reg.userPhone,
      status: reg.status,
      note: reg.note,
      createdAt: reg.createdAt,
      updatedAt: reg.updatedAt,
      visitInfo: {
        title: reg.visitTitle,
        date: reg.visitDate,
        time: reg.visitTime,
        location: reg.visitLocation,
      },
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取探访报名列表失败:', error);
    // 如果表不存在，返回空数据而不是错误
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === '42P01') {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
    return NextResponse.json(
      { success: false, error: '获取探访报名列表失败' },
      { status: 500 }
    );
  }
}
