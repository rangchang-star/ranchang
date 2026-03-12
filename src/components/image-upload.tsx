'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X } from 'lucide-react';
import { useFileUpload, useImageUrl } from '@/hooks/use-image';

interface ImageUploadProps {
  currentImageKey?: string | null;
  userId?: string;
  onUploadSuccess?: (fileKey: string) => void;
  onRemove?: () => void;
  readonly?: boolean;
  aspectRatio?: 'square' | '16:9' | '4:3';
  maxSize?: number; // MB
  className?: string;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
};

export function ImageUpload({
  currentImageKey,
  userId = '',
  onUploadSuccess,
  onRemove,
  readonly = false,
  aspectRatio = '16:9',
  maxSize = 5,
  className = '',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { url: imageUrl } = useImageUrl(currentImageKey);
  const { upload, uploading, progress } = useFileUpload('/api/upload/avatar');

  const handleFileSelect = () => {
    if (!readonly) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 JPEG、PNG、GIF、WebP 格式的图片');
      return;
    }

    // 验证文件大小
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`图片大小不能超过 ${maxSize}MB`);
      return;
    }

    try {
      const result = await upload(file, { userId });
      if (result.fileKey) {
        // 清除file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess?.(result.fileKey);
      }
    } catch (error: any) {
      alert(`上传失败：${error.message}`);
    }
  };

  const handleRemove = () => {
    if (confirm('确定要删除这张图片吗？')) {
      onRemove?.();
    }
  };

  return (
    <div className={`relative w-full ${aspectRatioClasses[aspectRatio]} bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt="上传的图片"
            className="w-full h-full object-cover"
          />

          {!readonly && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleFileSelect}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  更换
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  disabled={uploading}
                >
                  <X className="w-4 h-4 mr-1" />
                  删除
                </Button>
              </div>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                <div className="text-white text-sm">上传中... {progress}%</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={handleFileSelect}
        >
          {uploading ? (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-2" />
              <div className="text-gray-600 text-sm">上传中... {progress}%</div>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <div className="text-gray-600 text-sm font-medium">点击上传图片</div>
              <div className="text-gray-400 text-xs mt-1">
                支持 JPEG、PNG、GIF、WebP，最大 {maxSize}MB
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 简单的图片显示组件（只读）
 */
interface ImageDisplayProps {
  imageKey?: string | null;
  alt?: string;
  aspectRatio?: 'square' | '16:9' | '4:3';
  className?: string;
  fallback?: string;
}

export function ImageDisplay({
  imageKey,
  alt = '图片',
  aspectRatio = '16:9',
  className = '',
  fallback,
}: ImageDisplayProps) {
  const { url: imageUrl } = useImageUrl(imageKey, fallback);

  if (!imageUrl) {
    return (
      <div className={`w-full ${aspectRatioClasses[aspectRatio]} bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">暂无图片</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${aspectRatioClasses[aspectRatio]} overflow-hidden rounded-lg ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
