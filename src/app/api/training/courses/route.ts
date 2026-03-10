import { NextRequest, NextResponse } from 'next/server';

// 从 DATABASE_URL 解析连接参数
function parseDatabaseUrl(connectionString: string) {
  const urlMatch = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!urlMatch) {
    throw new Error('DATABASE_URL 格式错误');
  }
  const [, user, password, host, port, database] = urlMatch;
  return { user, password, host, port: parseInt(port), database };
}

// GET - 获取培训课程列表
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        success: false,
        error: '数据库未配置'
      }, { status: 500 });
    }

    const connectionString = process.env.DATABASE_URL || '';
    const dbConfig = parseDatabaseUrl(connectionString);

    const { default: pg } = await import('pg');
    const pgClient = new pg.Client({
      ...dbConfig,
      ssl: false,
    });

    await pgClient.connect();

    try {
      // 如果 training_courses 表不存在，返回默认课程数据
      const checkTableQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'training_courses'
        );
      `;

      const tableExistsResult = await pgClient.query(checkTableQuery);
      const tableExists = tableExistsResult.rows[0].exists;

      if (!tableExists) {
        // 返回默认课程数据（临时方案）
        const defaultCourses = [
          {
            id: '1',
            title: 'AI实战赋能营',
            subtitle: '用AI，给自己的经验插上翅膀',
            target: '想用AI提升效率的职场人/创业者',
            icon: '⚡',
            content: [
              {
                title: '教学内容',
                items: [
                  'AI工具选型与组合',
                  '提示词工程实战',
                  'AI辅助决策',
                  '用AI梳理商业逻辑',
                ],
              },
              {
                title: '学后获得',
                items: [
                  '一套可落地的AI工作流',
                  '专属AI工具包',
                  '加入AI实战社群',
                ],
              },
            ],
            founderName: '张老师',
            founderTitle: 'AI实战专家',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=kindlefield-ai-course',
          },
          {
            id: '2',
            title: 'AI+商业创新工作坊',
            subtitle: '让AI成为你的创新加速器',
            target: '创业者、企业高管、创新者',
            icon: '🎯',
            content: [
              {
                title: '教学内容',
                items: [
                  'AI驱动的商业模式设计',
                  'AI辅助的产品创新',
                  'AI赋能的市场营销',
                  'AI工具的团队协作应用',
                ],
              },
              {
                title: '学后获得',
                items: [
                  'AI创新方法论框架',
                  '行业AI应用案例库',
                  '与资深专家1对1交流',
                ],
              },
            ],
            founderName: '李老师',
            founderTitle: '商业创新顾问',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=kindlefield-innovation-workshop',
          },
        ];

        return NextResponse.json({
          success: true,
          data: defaultCourses
        });
      }

      // 从数据库获取课程数据
      const sqlQuery = `
        SELECT id, title, subtitle, target, icon, content,
               founder_name, founder_title, qr_code
        FROM training_courses
        WHERE status = 'published'
        ORDER BY created_at DESC
      `;

      const result = await pgClient.query(sqlQuery);

      // 格式化数据
      const formattedCourses = result.rows.map((row: any) => ({
        id: row.id.toString(),
        title: row.title,
        subtitle: row.subtitle || '',
        target: row.target || '',
        icon: row.icon || '📚',
        content: row.content || [],
        founderName: row.founder_name || '',
        founderTitle: row.founder_title || '',
        qrCode: row.qr_code || '',
      }));

      return NextResponse.json({
        success: true,
        data: formattedCourses
      });
    } finally {
      await pgClient.end();
    }
  } catch (error: any) {
    console.error('获取课程列表失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取课程列表失败: ' + error.message
    }, { status: 500 });
  }
}
