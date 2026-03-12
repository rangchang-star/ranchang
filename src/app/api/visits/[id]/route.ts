import { NextRequest, NextResponse } from 'next/server';
import { db, visits, appUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// GET - 获取探访详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const visitList = await db
      .select({
        id: visits.id,
        companyId: visits.companyId,
        companyName: visits.companyName,
        industry: visits.industry,
        location: visits.location,
        description: visits.description,
        date: visits.date,
        capacity: visits.capacity,
        registeredCount: visits.registeredCount,
        coverImage: visits.coverImage,
        coverImageKey: visits.coverImageKey,
        status: visits.status,
        createdAt: visits.createdAt,
        updatedAt: visits.updatedAt,
        // 被探访对象信息
        targetName: appUsers.name,
        targetAvatar: appUsers.avatar,
        targetCompany: appUsers.company,
        targetPosition: appUsers.position,
        targetIndustry: appUsers.industry,
        targetTags: appUsers.abilityTags,
      })
      .from(visits)
      .leftJoin(appUsers, eq(visits.companyId, appUsers.id))
      .where(eq(visits.id, id));

    if (visitList.length === 0) {
      return NextResponse.json(
        { success: false, error: '探访不存在' },
        { status: 404 }
      );
    }

    const visit = visitList[0];

    const data = {
      id: visit.id,
      title: visit.companyName, // 兼容前端使用的 title 字段
      companyId: visit.companyId,
      companyName: visit.companyName,
      industry: visit.industry,
      location: visit.location,
      description: visit.description,
      date: visit.date,
      time: null, // 数据库中不存在此字段
      capacity: visit.capacity,
      participants: null, // 数据库中不存在此字段
      registeredCount: visit.registeredCount,
      coverImage: visit.coverImage,
      coverImageKey: visit.coverImageKey,
      status: visit.status,
      record: null, // 数据库中不存在此字段
      outcome: null, // 数据库中不存在此字段
      notes: null, // 数据库中不存在此字段
      keyPoints: [], // 数据库中不存在此字段
      nextSteps: [], // 数据库中不存在此字段
      rating: null, // 数据库中不存在此字段
      feedbackAudio: null, // 数据库中不存在此字段
      photos: [], // 数据库中不存在此字段
      createdAt: visit.createdAt,
      updatedAt: visit.updatedAt,
      // 被探访对象信息
      target: visit.targetName ? {
        id: visit.companyId,
        name: visit.targetName,
        avatar: visit.targetAvatar,
        title: visit.targetPosition,
        company: visit.targetCompany,
        tags: visit.targetTags,
      } : null,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取探访详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访详情失败' },
      { status: 500 }
    );
  }
}
