# 对象存储配置说明

头像上传功能需要配置对象存储服务。请在项目根目录的 `.env.local` 文件中添加以下环境变量：

```env
# 对象存储配置
COZE_BUCKET_ENDPOINT_URL=your_endpoint_url
COZE_BUCKET_NAME=your_bucket_name
```

## 环境变量说明

- `COZE_BUCKET_ENDPOINT_URL`: 对象存储服务的端点 URL
- `COZE_BUCKET_NAME`: 存储桶名称

## 获取配置信息

1. 登录对象存储控制台
2. 创建或找到您的存储桶
3. 获取端点 URL 和存储桶名称
4. 将配置信息添加到 `.env.local` 文件中

## 重启服务

配置完成后，请重启开发服务器以使环境变量生效：

```bash
# 停止当前服务
# 然后重新启动
pnpm dev
```

## 功能说明

头像上传功能包括：

1. **文件选择**: 点击头像或相机按钮选择图片
2. **格式验证**: 只支持 JPEG、PNG、GIF、WebP 格式
3. **大小限制**: 图片大小不能超过 5MB
4. **上传状态**: 上传过程中显示加载动画
5. **实时预览**: 上传成功后立即显示新头像
6. **数据同步**: 头像 URL 会保存到 localStorage

## API 接口

- 上传接口: `POST /api/upload/avatar`
- 参数:
  - `file`: 图片文件（FormData）
  - `userId`: 用户 ID
- 返回:
  ```json
  {
    "success": true,
    "data": {
      "fileKey": "avatars/xxx.jpg",
      "url": "https://..."
    }
  }
  ```

## 注意事项

- 对象存储服务需要先在集成中心配置
- 上传的图片会自动重命名，格式为：`avatars/{userId}_{timestamp}.{ext}`
- 生成的签名 URL 有效期为 1 年
