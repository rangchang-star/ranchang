/**
 * 数据初始化API
 * 一次性重置所有表的数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/storage/database/supabase/connection';

export async function POST(request: NextRequest) {
  try {
    console.log('[数据初始化] 开始...');

    // 1. 重建 users 表
    console.log('[数据初始化] 重建 users 表...');
    await client`DROP TABLE IF EXISTS public.users CASCADE`;
    await client`
      CREATE TABLE public.users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        age INTEGER,
        avatar TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        connection_type VARCHAR(50),
        industry VARCHAR(100),
        need TEXT,
        ability_tags JSONB,
        resource_tags JSONB,
        level VARCHAR(50),
        company VARCHAR(255),
        position VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        is_featured BOOLEAN DEFAULT FALSE,
        join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE,
        tag_stamp VARCHAR(50),
        hardcore_tags JSONB,
        gender VARCHAR(10),
        company_scale VARCHAR(50)
      )
    `;

    // 插入用户数据
    await client`
      INSERT INTO public.users (id, name, age, avatar, email, company, position, gender, company_scale, connection_type, industry, need, ability_tags, resource_tags, hardcore_tags, level, status, is_featured, join_date, created_at)
      VALUES
        ('user-001', '张伟', 42, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei', 'zhangwei@example.com', '阿里云', '技术总监', '男', '1000-5000人', '创业', '互联网', '寻找技术合伙人', '["云计算", "AI", "架构设计"]', '["阿里云资源", "投资人网络"]', '["硬核工程师", "连续创业者"]', 'L5', 'active', true, '2024-01-15', NOW())
    `;
    console.log('[数据初始化] users 表完成 (1条记录)');

    // 2. 重建 activities 表
    console.log('[数据初始化] 重建 activities 表...');
    await client`DROP TABLE IF EXISTS public.activities CASCADE`;
    await client`
      CREATE TABLE public.activities (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        start_time VARCHAR(10),
        end_time VARCHAR(10),
        location VARCHAR(255),
        capacity INTEGER,
        registered_count INTEGER DEFAULT 0,
        type VARCHAR(50),
        cover_image TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE
      )
    `;

    // 插入活动数据（只保留1条）
    await client`
      INSERT INTO public.activities (id, title, description, date, start_time, end_time, location, capacity, registered_count, type, cover_image, status, created_at)
      VALUES
        ('act-001', '35+创业者的第一堂AI课', '学习如何将AI技术应用到创业项目中，提升竞争力', '2024-12-20', '14:00', '17:00', '北京市朝阳区望京SOHO', 50, 35, '技术分享', '/images/activity-ai-class.jpg', 'active', NOW())
    `;
    console.log('[数据初始化] activities 表完成 (1条记录)');

    // 3. 重建 declarations 表
    console.log('[数据初始化] 重建 declarations 表...');
    await client`DROP TABLE IF EXISTS public.declarations CASCADE`;
    await client`
      CREATE TABLE public.declarations (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        direction VARCHAR(100),
        text TEXT NOT NULL,
        summary TEXT,
        audio_url VARCHAR(500),
        views INTEGER DEFAULT 0,
        date DATE NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // 插入宣告数据（只保留1条）
    await client`
      INSERT INTO public.declarations (id, user_id, direction, text, summary, audio_url, views, date, is_featured, created_at)
      VALUES
        ('decl-001', 'user-001', '技术创业', '35岁才开始技术创业会不会太晚？我觉得永远不会太晚！10年大厂经验，现在正全力打造自己的云原生平台。年龄不是问题，热情和决心才是关键！', '35岁创业，云原生平台', NULL, 128, '2024-12-01', true, NOW())
    `;
    console.log('[数据初始化] declarations 表完成 (1条记录)');

    // 4. 重建 visits 表
    console.log('[数据初始化] 重建 visits 表...');
    await client`DROP TABLE IF EXISTS public.visits CASCADE`;
    await client`
      CREATE TABLE public.visits (
        id VARCHAR(36) PRIMARY KEY,
        company_id VARCHAR(36) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        location VARCHAR(255),
        description TEXT,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        capacity INTEGER,
        registered_count INTEGER DEFAULT 0,
        cover_image TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE
      )
    `;

    // 插入探访数据（只保留1条）
    await client`
      INSERT INTO public.visits (id, company_id, company_name, industry, location, description, date, capacity, registered_count, cover_image, status, created_at)
      VALUES
        ('visit-001', 'user-001', '阿里云创新中心', '云计算', '北京市海淀区上地', '参观阿里云创新中心，了解云原生技术发展和创业孵化模式', '2024-12-15', 30, 28, '/images/visit-aliyun.jpg', 'active', NOW())
    `;
    console.log('[数据初始化] visits 表完成 (1条记录)');

    console.log('[数据初始化] 完成！');

    return NextResponse.json({
      success: true,
      message: '数据初始化成功',
      stats: {
        users: 1,
        activities: 1,
        declarations: 1,
        visits: 1
      }
    });
  } catch (error: any) {
    console.error('[数据初始化] 失败:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
