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
    // 注意：status 字段在数据库中不存在，这里暂时不做过滤

    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const documentList = await query;

    // 转换数据格式，只返回数据库中存在的字段
    const data = documentList.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      content: doc.content,
      fileUrl: doc.fileUrl,
      coverImage: doc.coverImage, // 对应数据库的 cover 字段
      icon: doc.icon, // 图标字段
      fileSize: doc.fileSize,
      fileType: doc.fileType,
      downloadCount: doc.downloadCount,
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

// POST - 创建文档
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, icon, coverImage, content, description, category } = body;

    // 验证必填字段
    if (!title) {
      return NextResponse.json(
        { success: false, error: '请输入文件名' },
        { status: 400 }
      );
    }

    if (!coverImage) {
      return NextResponse.json(
        { success: false, error: '请上传封面图片' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: '请输入文档内容' },
        { status: 400 }
      );
    }

    // 创建文档，只使用数据库中存在的字段
    const [newDocument] = await db
      .insert(documents)
      .values({
        title,
        coverImage: coverImage, // 对应数据库的 cover 字段
        content: content || '',
        description: description || '',
        category: category || '认知库',
        icon: icon || 'book', // 默认图标
        fileType: 'knowledge',
        downloadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: {
        id: newDocument.id,
        title: newDocument.title,
        description: newDocument.description,
        category: newDocument.category,
        content: newDocument.content,
        fileUrl: newDocument.fileUrl,
        coverImage: newDocument.coverImage,
        icon: newDocument.icon,
        fileSize: newDocument.fileSize,
        fileType: newDocument.fileType,
        downloadCount: newDocument.downloadCount,
        createdAt: newDocument.createdAt,
        updatedAt: newDocument.updatedAt,
      },
    });
  } catch (error) {
    console.error('创建文档失败:', error);
    return NextResponse.json(
      { success: false, error: '创建文档失败' },
      { status: 500 }
    );
  }
}
