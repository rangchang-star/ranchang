import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // 生成 bcrypt 哈希（使用默认的 salt rounds = 10）
    const hash = await bcrypt.hash(password, 10);

    return NextResponse.json({
      success: true,
      password: password,
      password_hash: hash
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
