/**
 * 文件URL管理工具
 * 用于根据fileKey动态生成临时签名URL，并管理URL缓存
 */

interface CachedUrl {
  url: string;
  expiresAt: number; // 过期时间戳（毫秒）
}

// URL缓存
const urlCache: Record<string, CachedUrl> = {};

/**
 * 根据fileKey获取图片URL
 *
 * @param fileKey - 文件在S3存储中的key
 * @param forceRefresh - 是否强制刷新（忽略缓存）
 * @returns 签名URL
 */
export async function getImageUrl(
  fileKey: string | null | undefined,
  forceRefresh = false
): Promise<string | null> {
  if (!fileKey) {
    return null;
  }

  // 检查缓存
  if (!forceRefresh && urlCache[fileKey]) {
    const cached = urlCache[fileKey];
    // 检查是否过期（签名URL有效期1天，提前5分钟刷新）
    const fiveMinutes = 5 * 60 * 1000;
    const now = Date.now();
    if (cached.expiresAt - now > fiveMinutes) {
      return cached.url;
    }
  }

  try {
    // 调用API生成签名URL
    const response = await fetch(`/api/image-url?key=${encodeURIComponent(fileKey)}`);
    
    if (!response.ok) {
      throw new Error('生成签名URL失败');
    }
    
    const data = await response.json();
    
    if (!data.success || !data.url) {
      throw new Error('无效的响应');
    }

    const signedUrl = data.url;

    // 缓存URL
    urlCache[fileKey] = {
      url: signedUrl,
      expiresAt: Date.now() + 86400 * 1000,
    };

    return signedUrl;
  } catch (error) {
    console.error('生成签名URL失败:', error);
    return null;
  }
}

/**
 * 预加载图片URL
 * 用于提前缓存即将使用的图片URL，提升用户体验
 *
 * @param fileKeys - 文件key数组
 */
export async function preloadImageUrls(fileKeys: (string | null | undefined)[]): Promise<void> {
  const validKeys = fileKeys.filter((key): key is string => !!key);

  // 并行加载所有URL
  await Promise.all(validKeys.map((key) => getImageUrl(key)));
}

/**
 * 清除URL缓存
 *
 * @param fileKey - 指定清除的fileKey，不传则清除所有缓存
 */
export function clearUrlCache(fileKey?: string): void {
  if (fileKey) {
    delete urlCache[fileKey];
  } else {
    Object.keys(urlCache).forEach((key) => {
      delete urlCache[key];
    });
  }
}

/**
 * 检查URL是否即将过期（5分钟内）
 *
 * @param fileKey - 文件key
 * @returns 是否即将过期
 */
export function isUrlExpiringSoon(fileKey: string): boolean {
  const cached = urlCache[fileKey];
  if (!cached) {
    return true;
  }

  const fiveMinutes = 5 * 60 * 1000; // 5分钟
  const now = Date.now();

  return cached.expiresAt - now < fiveMinutes;
}
