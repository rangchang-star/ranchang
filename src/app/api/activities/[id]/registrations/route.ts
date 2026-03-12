import { NextRequest, NextResponse } from 'next/server';
import { db, activityRegistrations } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取活动报名列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const registrations = await db
      .select()
      .from(activityRegistrations)
      .where(eq(activityRegistrations.activityId, id));

    return NextResponse.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error('获取报名列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取报名列表失败' },
      { status: 500 }
    );
  }
}

// POST - 报名活动
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const newRegistration = await db
      .insert(activityRegistrations)
      .values({
        id: crypto.randomUUID(),
        activityId: id,
        userId: body.userId,
        note: body.note,
        status: 'registered',
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newRegistration[0],
    });
  } catch (error) {
    console.error('报名失败:', error);
    return NextResponse.json(
      { success: false, error: '报名失败' },
      { status: 500 }
    );
  }
}
