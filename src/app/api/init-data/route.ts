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
        ('user-001', '张伟', 42, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei', 'zhangwei@example.com', '阿里云', '技术总监', '男', '1000-5000人', '创业', '互联网', '寻找技术合伙人', '["云计算", "AI", "架构设计"]', '["阿里云资源", "投资人网络"]', '["硬核工程师", "连续创业者"]', 'L5', 'active', true, '2024-01-15', NOW()),
        ('user-002', '李娜', 38, 'https://api.dicebear.com/7.x/avataaars/svg?seed=lina', 'lina@example.com', '字节跳动', '产品总监', '女', '10000+人', '求职', '互联网', '寻找产品经理岗位', '["产品规划", "用户体验", "数据分析"]', '["大厂内推", "猎头资源"]', '["产品思维", "增长黑客"]', 'L4', 'active', true, '2024-02-01', NOW()),
        ('user-003', '王强', 45, 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang', 'wangqiang@example.com', '腾讯', '技术专家', '男', '10000+人', '创业', '金融科技', '寻求技术合伙人', '["区块链", "风控系统", "高并发"]', '["银行资源", "金融牌照"]', '["技术极客", "金融专家"]', 'L5', 'active', true, '2024-02-15', NOW()),
        ('user-004', '陈静', 36, 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjing', 'chenjing@example.com', '美团', '运营总监', '女', '10000+人', '创业', '本地生活', '寻找运营合伙人', '["用户增长", "社群运营", "数据驱动"]', '["商户资源", "渠道合作"]', '["增长黑客", "社群专家"]', 'L4', 'active', false, '2024-03-01', NOW()),
        ('user-005', '刘洋', 40, 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuyang', 'liuyang@example.com', '创业公司', '创始人', '男', '10-50人', '创业', '智能制造', '寻找投资', '["物联网", "工业4.0", "供应链"]', '["工厂资源", "客户资源"]', '["实业家", "技术控"]', 'L3', 'active', true, '2024-03-15', NOW()),
        ('user-006', '赵敏', 35, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaomin', 'zhaomin@example.com', '京东', '供应链总监', '女', '10000+人', '职业发展', '电商', '寻求供应链专家', '["供应链优化", "仓储管理", "物流配送"]', '["供应商资源", "物流网络"]', '["供应链专家", "效率提升"]', 'L4', 'active', false, '2024-04-01', NOW()),
        ('user-007', '孙浩', 39, 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunhao', 'sunhao@example.com', '百度', 'AI研究员', '男', '10000+人', '创业', '人工智能', '寻找AI应用场景', '["深度学习", "NLP", "计算机视觉"]', '["算法资源", "算力资源"]', '["AI专家", "科研达人"]', 'L4', 'active', true, '2024-04-15', NOW()),
        ('user-008', '周琳', 37, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoulin', 'zhoulin@example.com', '小红书', '市场总监', '女', '1000-5000人', '职业发展', '社交电商', '寻求市场合作', '["品牌营销", "内容运营", "用户洞察"]', '["KOL资源", "MCN合作"]', '["营销专家", "内容高手"]', 'L4', 'active', false, '2024-05-01', NOW()),
        ('user-009', '吴磊', 33, 'https://api.dicebear.com/7.x/avataaars/svg?seed=wulei', 'wulei@example.com', '自由职业', '独立开发者', '男', '1-10人', '创业', 'SaaS', '寻找产品市场', '["全栈开发", "产品设计", "技术架构"]', '["开源社区", "技术社群"]', '["独立开发者", "技术极客"]', 'L3', 'active', true, '2024-05-15', NOW()),
        ('user-010', '郑芳', 41, 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhengfang', 'zhengfang@example.com', '华为', '战略总监', '女', '10000+人', '职业发展', '通信技术', '寻求战略咨询', '["战略规划", "市场分析", "投资并购"]', '["行业资源", "政府关系"]', '["战略专家", "行业领袖"]', 'L5', 'active', true, '2024-06-01', NOW())
    `;
    console.log('[数据初始化] users 表完成 (10条记录)');

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

    // 插入活动数据（前5条）
    await client`
      INSERT INTO public.activities (id, title, description, date, start_time, end_time, location, capacity, registered_count, type, cover_image, status, created_at)
      VALUES
        ('act-001', '35+创业者的第一堂AI课', '学习如何将AI技术应用到创业项目中，提升竞争力', '2024-12-20', '14:00', '17:00', '北京市朝阳区望京SOHO', 50, 35, '技术分享', '/images/activity-ai-class.jpg', 'active', NOW()),
        ('act-002', '跨境电商实战 workshop', '从0到1搭建跨境电商业务，实战经验分享', '2024-12-22', '10:00', '16:00', '上海市浦东新区陆家嘴', 30, 28, '实战培训', '/images/activity-ecommerce.jpg', 'active', NOW()),
        ('act-003', '传统企业数字化转型论坛', '探讨传统企业如何利用新技术实现数字化转型', '2024-12-25', '09:00', '18:00', '深圳市南山区科技园', 100, 85, '行业论坛', '/images/activity-digital-transformation.jpg', 'active', NOW()),
        ('act-004', '创业者投资人对接会', '优质项目路演，投资人现场点评和对接', '2024-12-28', '13:30', '18:00', '北京市海淀区中关村', 80, 72, '投融资', '/images/activity-investment.jpg', 'active', NOW()),
        ('act-005', '新能源行业趋势研讨会', '深入了解新能源行业发展趋势和投资机会', '2025-01-05', '14:00', '17:00', '上海市杨浦区创智天地', 40, 32, '行业研讨', '/images/activity-new-energy.jpg', 'active', NOW())
    `;
    console.log('[数据初始化] activities 表完成 (5条记录)');

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

    // 插入宣告数据（前5条）
    await client`
      INSERT INTO public.declarations (id, user_id, direction, text, summary, audio_url, views, date, is_featured, created_at)
      VALUES
        ('decl-001', 'user-001', '技术创业', '35岁才开始技术创业会不会太晚？我觉得永远不会太晚！10年大厂经验，现在正全力打造自己的云原生平台。年龄不是问题，热情和决心才是关键！', '35岁创业，云原生平台', NULL, 128, '2024-12-01', true, NOW()),
        ('decl-002', 'user-002', '职业转型', '从运营到产品，我用了3年时间。35岁转行不容易，但只要方向对了，努力就有回报。现在找到了自己真正热爱的事业！', '运营转产品经理', NULL, 95, '2024-12-02', true, NOW()),
        ('decl-003', 'user-003', '金融科技', '传统金融 + 区块链 = 无限可能。深耕风控系统15年，现在用技术重新定义金融。年龄让我更有经验，技术让我更有力量！', '金融科技区块链', NULL, 156, '2024-12-03', true, NOW()),
        ('decl-004', 'user-004', '创业坚持', '连续创业3次，前两次都失败了。但每次失败都是宝贵的财富。第三次，终于找到了正确的方向！35岁，不是终点，是新的起点！', '连续创业，坚持不放弃', NULL, 203, '2024-12-04', true, NOW()),
        ('decl-005', 'user-005', '实业创业', '做实业虽然辛苦，但很踏实。10年制造业经验，现在用物联网和工业4.0技术升级传统工厂。让中国制造更智能！', '实业家转型智能制造', NULL, 87, '2024-12-05', true, NOW())
    `;
    console.log('[数据初始化] declarations 表完成 (5条记录)');

    console.log('[数据初始化] 完成！');

    return NextResponse.json({
      success: true,
      message: '数据初始化成功',
      stats: {
        users: 10,
        activities: 5,
        declarations: 5
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
