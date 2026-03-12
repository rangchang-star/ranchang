import { useEffect, useState } from 'react';
import { getImageUrl, preloadImageUrls } from '@/lib/utils/storage-url';

/**
 * 获取图片URL的Hook
 *
 * @param fileKey - 文件在S3存储中的key
 * @param fallback - 失败时使用的fallback URL
 * @returns { url, loading, error }
 */
export function useImageUrl(fileKey?: string | null, fallback?: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileKey) {
      setUrl(fallback || null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    getImageUrl(fileKey)
      .then((resultUrl: string | null) => {
        if (resultUrl) {
          setUrl(resultUrl);
          setError(null);
        } else {
          setUrl(fallback || null);
          setError('无法获取图片URL');
        }
      })
      .catch((err: any) => {
        console.error('获取图片URL失败:', err);
        setUrl(fallback || null);
        setError(err.message || '获取图片URL失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fileKey, fallback]);

  return { url, loading, error };
}

/**
 * 批量获取图片URL的Hook
 *
 * @param fileKeys - 文件key数组
 * @returns { urls, loading, error }
 */
export function useImageUrls(fileKeys: (string | null | undefined)[]) {
  const [urls, setUrls] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileKeys || fileKeys.length === 0) {
      setUrls(new Map());
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 过滤掉空的key
    const validKeys = fileKeys.filter((key): key is string => !!key);

    // 并行加载所有URL
    Promise.all(
      validKeys.map(async (key) => {
        try {
          const url = await getImageUrl(key);
          return { key, url };
        } catch (err) {
          return { key, url: null };
        }
      })
    )
      .then(results => {
        const urlMap = new Map<string, string>();
        results.forEach(({ key, url }) => {
          if (url) {
            urlMap.set(key, url);
          }
        });
        setUrls(urlMap);
      })
      .catch(err => {
        console.error('批量获取图片URL失败:', err);
        setError(err.message || '批量获取图片URL失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fileKeys]);

  return { urls, loading, error };
}

/**
 * 上传文件的Hook
 *
 * @param uploadEndpoint - 上传API端点
 * @returns { upload, uploading, error, progress }
 */
export function useFileUpload(uploadEndpoint: string = '/api/upload/avatar') {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, additionalData?: Record<string, string>) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 添加额外数据
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      // 模拟进度
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '上传失败');
      }

      const result = await response.json();

      if (result.success) {
        return {
          fileKey: result.data.fileKey,
          message: result.data.message,
        };
      } else {
        throw new Error(result.error || '上传失败');
      }
    } catch (err: any) {
      console.error('上传文件失败:', err);
      setError(err.message || '上传文件失败');
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { upload, uploading, error, progress };
}
