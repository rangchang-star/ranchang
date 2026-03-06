import { NextRequest, NextResponse } from 'next/server';
import { mockVisits } from '@/lib/mock-database';

export async function GET(request: NextRequest) {
  try {
    // 转换数据格式以适配后台管理页面
    const visits = mockVisits.map((visit) => ({
      id: visit.id,
      date: visit.date,
      time: visit.time || '14:00-16:00',
      status: 'completed',
      target: visit.target || {
        name: '待确认',
        title: '待确认',
        company: '待确认',
        avatar: '',
      },
      purpose: visit.record.substring(0, 50) + '...',
      location: visit.location || '待确认',
      participants: visit.participants || visit.visitors?.length || 0,
      rating: visit.rating || 5,
      tags: [...visit.status, visit.industry],
      title: visit.title,
      industry: visit.industry,
      duration: visit.duration,
      visitors: visit.visitors,
      record: visit.record,
      audioDuration: visit.audioDuration,
      audioUrl: visit.audioUrl,
      image: visit.image,
      outcome: visit.outcome,
      keyPoints: visit.keyPoints,
      nextSteps: visit.nextSteps,
      notes: visit.notes,
      images: visit.images,
      views: visit.views,
      likes: visit.likes,
      createdAt: visit.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: visits,
      total: visits.length,
    });
  } catch (error) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取探访列表失败' },
      { status: 500 }
    );
  }
}
