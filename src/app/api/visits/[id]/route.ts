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
        time: visits.time,
        capacity: visits.capacity,
        registeredCount: visits.registeredCount,
        participants: visits.participants,
        coverImage: visits.coverImage,
        coverImageKey: visits.coverImageKey,
        status: visits.status,
        record: visits.record,
        outcome: visits.outcome,
        notes: visits.notes,
        keyPoints: visits.keyPoints,
        nextSteps: visits.nextSteps,
        rating: visits.rating,
        feedbackAudio: visits.feedbackAudio,
        photos: visits.photos,
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
      image: visit.coverImage, // 兼容前端使用的 image 字段
      tags: visit.industry ? [visit.industry] : [], // 使用 industry 作为标签
      companyId: visit.companyId,
      companyName: visit.companyName,
      industry: visit.industry,
      location: visit.location,
      description: visit.description,
      date: visit.date,
      time: visit.time,
      duration: '约2小时', // 默认时长
      capacity: visit.capacity,
      participants: visit.participants,
      registeredCount: visit.registeredCount,
      views: 0, // 默认浏览量
      coverImage: visit.coverImage,
      coverImageKey: visit.coverImageKey,
      status: visit.status,
      record: visit.record,
      outcome: visit.outcome,
      notes: visit.notes,
      keyPoints: visit.keyPoints || [],
      nextSteps: visit.nextSteps || [],
      rating: visit.rating,
      feedbackAudio: visit.feedbackAudio,
      photos: visit.photos || [],
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
      // 探访人信息（默认为空，需要从 visit_records 或其他表获取）
      visitors: [],
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
