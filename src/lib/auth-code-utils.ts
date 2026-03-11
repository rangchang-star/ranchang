// 简单的内存存储（生产环境应使用 Redis）
const codeStore = new Map<string, { code: string; expiresAt: number; count: number }>();

// 验证码验证函数（供其他接口使用）
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

// 存储验证码（供发送验证码接口使用）
export function storeCode(phone: string, code: string): void {
  const now = Date.now();
  codeStore.set(phone, {
    code,
    expiresAt: now + 60000,
    count: (codeStore.get(phone)?.count || 0) + 1,
  });
}

// 清理过期的验证码
export function cleanupExpiredCodes(): void {
  const now = Date.now();
  for (const [key, value] of codeStore.entries()) {
    if (now > value.expiresAt) {
      codeStore.delete(key);
    }
  }
}

// 导出 codeStore（用于测试）
export { codeStore };
