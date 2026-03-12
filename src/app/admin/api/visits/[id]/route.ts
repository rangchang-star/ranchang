import { NextRequest, NextResponse } from 'next/server';
import { db, visits, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取单个探访详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: visitId } = await params;

    const visit = await db
      .select()
      .from(visits)
      .where(eq(visits.id, visitId))
      .limit(1);

    if (!visit || visit.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: visit[0],
    });
  } catch (error) {
    console.error('获取探访详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访详情失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新探访
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: visitId } = await params;
    const body = await request.json();

    const updatedVisit = await db
      .update(visits)
      .set({
        companyId: body.companyId,
        companyName: body.companyName,
        date: body.date ? new Date(body.date) : new Date(),
        time: body.time || null,
        location: body.location || null,
        description: body.description || null,
        industry: body.industry || null,
        capacity: body.capacity || null,
        status: body.status || 'draft',
        coverImage: body.coverImage || null,
        coverImageKey: body.coverImageKey || null,
        record: body.record || null,
        outcome: body.outcome || null,
        notes: body.notes || null,
        keyPoints: body.keyPoints || null,
        nextSteps: body.nextSteps || null,
        rating: body.rating || null,
        feedbackAudio: body.feedbackAudio || null,
        photos: body.photos || null,
        participants: body.participants || null,
        updatedAt: new Date(),
      })
      .where(eq(visits.id, visitId))
      .returning();

    if (!updatedVisit || updatedVisit.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedVisit[0],
    });
  } catch (error) {
    console.error('更新探访失败:', error);
    return NextResponse.json(
      { success: false, error: '更新探访失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除探访
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: visitId } = await params;

    const deletedVisit = await db
      .delete(visits)
      .where(eq(visits.id, visitId))
      .returning();

    if (!deletedVisit || deletedVisit.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedVisit[0],
    });
  } catch (error) {
    console.error('删除探访失败:', error);
    return NextResponse.json(
      { success: false, error: '删除探访失败' },
      { status: 500 }
    );
  }
}
