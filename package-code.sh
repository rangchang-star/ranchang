#!/bin/bash

# 代码打包脚本
# 用于打包项目代码以便分享给其他 AI 助手分析

set -e

PROJECT_DIR="${COZE_WORKSPACE_PATH:-/workspace/projects}"
OUTPUT_DIR="/tmp/code-packages"
PACKAGE_NAME="ran-field-app"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_DIR="${OUTPUT_DIR}/${PACKAGE_NAME}_${TIMESTAMP}"

echo "📦 开始打包项目代码..."
echo "📁 项目目录: ${PROJECT_DIR}"
echo "📦 输出目录: ${PACKAGE_DIR}"

# 创建输出目录
mkdir -p "${PACKAGE_DIR}"

# 复制主要文件
echo "📋 复制项目文件..."

# 复制配置文件
cp -r ${PROJECT_DIR}/package.json "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/tsconfig.json "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/drizzle.config.ts "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/components.json "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/.coze "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/.cozeproj "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/next.config.ts "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/tailwind.config.ts "${PACKAGE_DIR}/" 2>/dev/null || true

# 复制 README 和文档
cp -r ${PROJECT_DIR}/README.md "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/DATABASE.md "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/docs "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/*.md "${PACKAGE_DIR}/" 2>/dev/null || true

# 复制源代码目录
cp -r ${PROJECT_DIR}/src "${PACKAGE_DIR}/" 2>/dev/null || true

# 复制数据库配置文件（如果存在）
cp -r ${PROJECT_DIR}/*.sql "${PACKAGE_DIR}/" 2>/dev/null || true
cp -r ${PROJECT_DIR}/schema "${PACKAGE_DIR}/" 2>/dev/null || true

# 创建项目说明文件
cat > "${PACKAGE_DIR}/_CODE_SHARE_README.txt" << 'EOF'
================================================================================
燃场 App - 代码分享包
================================================================================

📦 项目概述
-----------
项目名称：燃场 App
技术栈：Next.js 16 + React 18 + TypeScript 5 + Tailwind CSS 4
UI 组件库：shadcn/ui
数据库：阿里云 RDS PostgreSQL (ran_field)
ORM：Drizzle ORM

🎯 核心功能
-----------
1. 发现光亮
   - 能力连接：35+人群能力展示与连接
   - 活动推荐：优质活动推荐与报名
   - 高燃宣告：用户宣言与互动

2. 点亮事业
   - 探访点亮：用户相互探访
   - AI 加油圈：AI 驱动的互动与支持

3. 个人中心
   - 用户信息管理
   - 个人数据展示

4. 后台管理
   - 活动管理
   - 用户管理
   - 宣言管理

📁 目录结构
-----------
src/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   │   ├── login/         # 登录接口
│   │   ├── init-data/     # 数据初始化
│   │   ├── [resource]/    # 通用资源接口
│   │   └── ...
│   ├── discover/          # 发现光亮页面
│   ├── ignite/            # 点亮事业页面
│   ├── profile/           # 个人中心页面
│   └── ...
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件库
│   ├── auth-guard.tsx   # 认证守卫
│   └── ...
├── lib/                  # 工具库
│   ├── services/        # 服务层（业务逻辑）
│   ├── db.ts           # 数据库连接
│   └── utils.ts        # 工具函数
├── contexts/            # React Context
├── hooks/              # 自定义 Hooks
└── types/              # TypeScript 类型定义

🗄️ 数据库表结构
-----------
- users: 用户信息
- activities: 活动信息
- declarations: 用户宣言
- visits: 用户互访记录
- activity_registrations: 活动报名
- app_users: App 用户
- daily_declarations: 每日宣言
- documents: 文档管理
- notifications: 通知
- registrations: 注册信息
- settings: 系统设置
- auth_credentials: 认证凭证（登录）

🔑 当前问题
-----------
1. auth_credentials 表在 API 中无法查询，但通过 SQL 工具可以访问
2. 数据库连接可能存在权限或连接池问题
3. 需要确认当前连接的数据库是 ran_field 而非 postgres

📝 测试用户
-----------
用户名：13023699913
密码：818989
用户：张伟 (user-001)

🚀 快速开始
-----------
1. 安装依赖：
   pnpm install

2. 配置环境变量：
   DATABASE_URL=postgresql://username:password@host:port/ran_field

3. 启动开发服务器：
   pnpm dev

4. 访问应用：
   http://localhost:5000

⚠️  注意事项
-----------
- 代码包已排除 node_modules、.next、.git 等大文件
- 数据库凭据已从代码中移除，请自行配置
- 生产环境部署需要配置环境变量

================================================================================
生成时间：{TIMESTAMP}
================================================================================
EOF

# 替换时间戳
sed -i "s/{TIMESTAMP}/${TIMESTAMP}/g" "${PACKAGE_DIR}/_CODE_SHARE_README.txt"

# 创建压缩包
echo "📦 创建压缩包..."
cd "${OUTPUT_DIR}"
tar -czf "${PACKAGE_NAME}_${TIMESTAMP}.tar.gz" "${PACKAGE_NAME}_${TIMESTAMP}"

# 清理临时目录
rm -rf "${PACKAGE_DIR}"

echo ""
echo "✅ 打包完成！"
echo "📦 压缩包路径: ${OUTPUT_DIR}/${PACKAGE_NAME}_${TIMESTAMP}.tar.gz"
echo "📊 压缩包大小: $(du -h ${OUTPUT_DIR}/${PACKAGE_NAME}_${TIMESTAMP}.tar.gz | cut -f1)"
echo ""
echo "📝 下一步："
echo "   1. 压缩包已保存在 /tmp/code-packages/ 目录"
echo "   2. 可通过文件下载功能获取压缩包"
echo "   3. 解压后可分享给其他 AI 助手进行分析"
echo ""
