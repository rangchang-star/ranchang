import { NextRequest, NextResponse } from 'next/server';
import { db, visits } from '@/lib/db';
import { client as postgresClient } from '@/storage/database/supabase/connection';
import { eq, desc, like } from 'drizzle-orm';

// GET - 获取探访列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // 构建简单的SQL查询
    let whereConditions: string[] = [];

    if (search) {
      whereConditions.push(`company_name ILIKE '%${search.replace(/'/g, "''")}%'`);
    }

    if (status && status !== 'all') {
      whereConditions.push(`status = '${status.replace(/'/g, "''")}'`);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const query = `
      SELECT
        id,
        company_id,
        company_name,
        industry,
        location,
        description,
        date,
        capacity,
        registered_count,
        cover_image,
        status,
        created_at,
        updated_at
      FROM visits
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const visitList = await postgresClient.unsafe(query);

    // 转换数据格式
    const data = (visitList as any[]).map((visit: any) => {
      const visitDate = new Date(visit.date);
      const isPast = visitDate < new Date();

      return {
        id: visit.id,
        companyId: visit.company_id,
        companyName: visit.company_name,
        industry: visit.industry || '',
        location: visit.location || '',
        description: visit.description || '',
        date: visitDate.toISOString().split('T')[0],
        capacity: visit.capacity || 0,
        registeredCount: visit.registered_count || 0,
        coverImage: visit.cover_image || '',
        coverImageKey: visit.cover_image_key || '',
        status: isPast ? 'ended' : (visit.status === 'published' ? 'active' : 'draft'),
        createdAt: visit.created_at,
        updatedAt: visit.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('获取探访列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取探访列表失败',
      },
      { status: 500 }
    );
  }
}

// POST - 创建探访
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newVisit = await db
      .insert(visits)
      .values({
        id: crypto.randomUUID(),
        company_id: body.companyId,
        company_name: body.companyName,
        industry: body.industry,
        location: body.location,
        description: body.description,
        date: new Date(body.date),
        capacity: body.capacity,
        cover_image: body.coverImage,
        status: body.status || 'draft',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newVisit[0],
    });
  } catch (error) {
    console.error('创建探访失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建探访失败',
      },
      { status: 500 }
    );
  }
}
