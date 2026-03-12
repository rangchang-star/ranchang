import { NextRequest, NextResponse } from 'next/server';
import { db, documents } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';

// GET - 获取文档列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';

    let query = db
      .select()
      .from(documents)
      .orderBy(desc(documents.createdAt));

    const conditions = [];
    if (category) {
      conditions.push(eq(documents.category, category));
    }
    if (status && status !== 'all') {
      conditions.push(eq(documents.status, status));
    }

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const documentList = await query;

    // 转换数据格式
    const data = documentList.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      fileUrl: doc.fileUrl,
      fileKey: doc.fileKey,
      coverImage: doc.coverImage,
      coverImageKey: doc.coverImageKey,
      fileSize: doc.fileSize,
      fileType: doc.fileType,
      downloads: doc.downloads,
      likes: doc.likes,
      authorId: doc.authorId,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取文档列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取文档列表失败' },
      { status: 500 }
    );
  }
}
