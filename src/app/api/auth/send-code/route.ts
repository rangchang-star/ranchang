import { NextRequest, NextResponse } from 'next/server';
import { generateCode } from '@/lib/verification-code';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, type } = body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: '请输入正确的手机号' },
        { status: 400 }
      );
    }

    // 生成验证码
    const code = generateCode(phone, type || 'register');

    // 在开发环境打印验证码到日志
    console.log(`[${type}] 验证码: ${code}, 手机号: ${phone}, 有效期: 60秒`);

    // 生产环境应该发送短信
    // await sendSMS(phone, code);

    return NextResponse.json({
      success: true,
      message: '验证码发送成功',
      // 开发环境返回验证码（生产环境应该删除）
      ...(process.env.NODE_ENV === 'development' && { devCode: code }),
    });
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    
    if (error.message === '验证码发送过于频繁，请稍后重试') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
