import { NextRequest, NextResponse } from 'next/server';

// 简单的内存存储（生产环境应使用 Redis）
const codeStore = new Map<string, { code: string; expiresAt: number; count: number }>();

// 频率限制
const rateLimit = new Map<string, { count: number; resetAt: number }>();

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

    // 频率限制：同一手机号1分钟内只能发送3次
    const now = Date.now();
    const phoneLimit = rateLimit.get(phone);
    if (phoneLimit) {
      if (now < phoneLimit.resetAt) {
        if (phoneLimit.count >= 3) {
          return NextResponse.json(
            { success: false, message: '验证码发送过于频繁，请稍后重试' },
            { status: 429 }
          );
        }
        phoneLimit.count++;
      } else {
        // 重置计数器
        rateLimit.set(phone, { count: 1, resetAt: now + 60000 });
      }
    } else {
      rateLimit.set(phone, { count: 1, resetAt: now + 60000 });
    }

    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 存储验证码（60秒有效期）
    codeStore.set(phone, {
      code,
      expiresAt: now + 60000,
      count: (codeStore.get(phone)?.count || 0) + 1,
    });

    // 清理过期的验证码
    for (const [key, value] of codeStore.entries()) {
      if (now > value.expiresAt) {
        codeStore.delete(key);
      }
    }

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
  } catch (error) {
    console.error('发送验证码失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 导出验证码验证函数（供其他接口使用）
export function verifyCode(phone: string, code: string): boolean {
  const stored = codeStore.get(phone);
  if (!stored) {
    return false;
  }

  if (Date.now() > stored.expiresAt) {
    codeStore.delete(phone);
    return false;
  }

  if (stored.code !== code) {
    return false;
  }

  // 验证成功后删除验证码
  codeStore.delete(phone);
  return true;
}
