'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useFileUpload, useImageUrl } from '@/hooks/use-image';

interface AvatarUploadProps {
  currentAvatarKey?: string | null;
  userId?: string;
  name?: string;
  onUploadSuccess?: (fileKey: string) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-8 h-8 rounded-full',
  md: 'w-12 h-12 rounded-full',
  lg: 'w-24 h-24 rounded-full',
  xl: 'w-32 h-32 rounded-full',
};

export function AvatarUpload({
  currentAvatarKey,
  userId = '',
  name = '',
  onUploadSuccess,
  readonly = false,
  size = 'lg',
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { url: avatarUrl } = useImageUrl(currentAvatarKey);
  const { upload, uploading, progress } = useFileUpload();

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

    // 验证文件大小（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('图片大小不能超过 5MB');
      return;
    }

    try {
      const result = await upload(file, { userId });
      if (result.fileKey) {
        // 清除file input，允许重复选择同一文件
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // 通知父组件上传成功
        onUploadSuccess?.(result.fileKey);
      }
    } catch (error: any) {
      alert(`上传失败：${error.message}`);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} cursor-pointer ${!readonly ? 'hover:opacity-80' : ''}`} onClick={handleFileSelect}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} />
        ) : null}
        <AvatarFallback className={sizeClasses[size]}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {!readonly && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading && (
            <div className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-md ${sizeClasses[size]}`}>
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}

          {!uploading && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-md opacity-0 hover:opacity-100 transition-opacity ${sizeClasses[size]}`}
              onClick={handleFileSelect}
            >
              <Upload className="w-6 h-6 text-white" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * 简单的头像显示组件（只读）
 */
interface AvatarDisplayProps {
  avatarKey?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export function AvatarDisplay({ avatarKey, name = '', size = 'md', fallback }: AvatarDisplayProps) {
  const { url: avatarUrl } = useImageUrl(avatarKey, fallback);

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={name} />
      ) : null}
      <AvatarFallback>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
