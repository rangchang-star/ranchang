import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 连接数据库（确保连接到 ran_field 数据库）
    const connectionString = process.env.DATABASE_URL?.replace(/\/postgres$/, '/ran_field') || '';
    console.log('Login API - 连接字符串数据库部分:', connectionString.split('/').pop());
    const sql = postgres(connectionString, { ssl: false });

    try {
      // 调试：打印当前连接的数据库
      const dbResult = await sql`SELECT current_database()`;
      console.log('Login API - 当前数据库:', dbResult[0].current_database);

      // 调试：检查 auth_credentials 表是否存在
      const tables = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_name = 'auth_credentials' AND table_schema = 'public'
      `;
      console.log('Login API - auth_credentials 表存在:', tables.length > 0);
      
      // 调试：打印所有 public 表
      const allTables = await sql`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      console.log('Login API - 所有 public 表:', allTables.map(t => t.table_name).join(', '));

      // 查找认证凭据
      const credentials = await sql`
        SELECT * FROM public.auth_credentials
        WHERE username = ${username}
      `;

      if (credentials.length === 0) {
        return NextResponse.json(
          { success: false, error: '用户不存在' },
          { status: 401 }
        );
      }

      const credential = credentials[0];

      // 验证密码
      const isValid = await bcrypt.compare(password, credential.password_hash);

      if (!isValid) {
        return NextResponse.json(
          { success: false, error: '密码错误' },
          { status: 401 }
        );
      }

      // 获取用户信息
      const users = await sql`
        SELECT * FROM public.users WHERE id = ${credential.user_id}
      `;

      if (users.length === 0) {
        return NextResponse.json(
          { success: false, error: '用户不存在' },
          { status: 401 }
        );
      }

      const user = users[0];

      // 返回用户信息（不包含敏感信息）
      return NextResponse.json({
        success: true,
        message: '登录成功',
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
          company: user.company,
          position: user.position
        }
      });
    } finally {
      await sql.end();
    }
  } catch (error: any) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
