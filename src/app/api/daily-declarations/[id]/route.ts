import { NextRequest, NextResponse } from 'next/server';
import { MockDatabase } from '@/lib/mock-database';

// 获取单个每日宣告
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    let declaration;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const dbDeclarations = await db.select().from(dailyDeclarations).where(eq(dailyDeclarations.id, parseInt(id)));

        if (dbDeclarations.length === 0) {
          return NextResponse.json(
            { success: false, error: '每日宣告不存在' },
            { status: 404 }
          );
        }

        declaration = dbDeclarations[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，使用模拟数据:', dbError.message);
        // 降级到模拟数据
        declaration = MockDatabase.getDailyDeclarationById(id);
        if (!declaration) {
          return NextResponse.json(
            { success: false, error: '每日宣告不存在' },
            { status: 404 }
          );
        }
      }
    } else {
      // 使用模拟数据
      declaration = MockDatabase.getDailyDeclarationById(id);
      if (!declaration) {
        return NextResponse.json(
          { success: false, error: '每日宣告不存在' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: declaration,
    });
  } catch (error) {
    console.error('获取每日宣告失败:', error);
    return NextResponse.json(
      { success: false, error: '获取每日宣告失败' },
      { status: 500 }
    );
  }
}

// 更新每日宣告
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.date || !body.image || !body.audio) {
      return NextResponse.json({
        success: false,
        error: '请填写所有必填字段'
      }, { status: 400 });
    }

    let updated;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const result = await db.update(dailyDeclarations)
          .set({
            title: body.title,
            date: new Date(body.date),
            image: body.image,
            audio: body.audio,
            summary: body.summary || '',
            text: body.text || '',
            iconType: body.iconType || '',
            rank: body.rank || 0,
            profile: body.profile || '',
            duration: body.duration || '',
            views: body.views || 0,
            isFeatured: body.isFeatured || false,
            updatedAt: new Date(),
          })
          .where(eq(dailyDeclarations.id, parseInt(id)))
          .returning();

        if (result.length === 0) {
          return NextResponse.json(
            { success: false, error: '每日宣告不存在' },
            { status: 404 }
          );
        }

        updated = result[0];
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅更新模拟数据:', dbError.message);
        // 降级到模拟数据
        updated = MockDatabase.updateDailyDeclaration(id, body);
        if (!updated) {
          return NextResponse.json(
            { success: false, error: '每日宣告不存在' },
            { status: 404 }
          );
        }
      }
    } else {
      // 使用模拟数据
      updated = MockDatabase.updateDailyDeclaration(id, body);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: '每日宣告不存在' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: '每日宣告更新成功',
      data: updated
    });
  } catch (error) {
    console.error('更新每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '更新每日宣告失败'
    }, { status: 500 });
  }
}

// 删除每日宣告
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    let success = false;

    // 检查是否配置了数据库连接
    if (process.env.DATABASE_URL && process.env.DATABASE_URL !== '') {
      try {
        const { db, dailyDeclarations } = await import('@/storage/database/supabase/connection');
        const { eq } = await import('drizzle-orm');

        const result = await db.delete(dailyDeclarations)
          .where(eq(dailyDeclarations.id, parseInt(id)))
          .returning();

        success = result.length > 0;
      } catch (dbError: any) {
        console.warn('数据库连接失败，仅删除模拟数据:', dbError.message);
        // 降级到模拟数据
        success = MockDatabase.deleteDailyDeclaration(id);
      }
    } else {
      // 使用模拟数据
      success = MockDatabase.deleteDailyDeclaration(id);
    }

    if (!success) {
      return NextResponse.json(
        { success: false, error: '每日宣告不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '每日宣告删除成功'
    });
  } catch (error) {
    console.error('删除每日宣告失败:', error);
    return NextResponse.json({
      success: false,
      error: '删除每日宣告失败'
    }, { status: 500 });
  }
}
