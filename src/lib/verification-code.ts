// 验证码存储（内存，重启后清空）
const codeStore = new Map<string, { code: string; expiresAt: number; count: number }>();

// 频率限制
const rateLimit = new Map<string, { count: number; resetAt: number }>();

// 生成验证码
export function generateCode(phone: string, type: string): string {
  const now = Date.now();

  // 频率限制：同一手机号1分钟内只能发送3次
  const phoneLimit = rateLimit.get(phone);
  if (phoneLimit) {
    if (now < phoneLimit.resetAt) {
      if (phoneLimit.count >= 3) {
        throw new Error('验证码发送过于频繁，请稍后重试');
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

  return code;
}

// 验证码验证函数
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
