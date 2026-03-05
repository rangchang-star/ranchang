import postgres from 'postgres';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;

// 硬编码数据 - 会员
const members = [
  {
    phone: '13800138001',
    password: 'password123',
    nickname: '王姐',
    name: '王姐',
    avatar: '/avatar-1.jpg',
    company: '精密制造集团',
    position: '运营总监',
    bio: '15年供应链管理经验，擅长传统制造业数字化转型，曾帮助多家企业实现精益管理和成本控制。\n\n专业领域：\n• 供应链优化与重构\n• 数字化转型实施\n• 成本控制与效率提升\n• 跨部门协同管理',
    role: 'user',
  },
  {
    phone: '13800138002',
    password: 'password123',
    nickname: '李明',
    name: '李明',
    avatar: '/avatar-2.jpg',
    company: '永明投资管理',
    position: '投资总监',
    bio: '12年投融资经验，专注于新能源和智能制造领域，资金规模5000万。\n\n专业领域：\n• 项目投融资决策\n• 财务尽调与估值\n• 政策解读与分析\n• 海外市场拓展',
    role: 'user',
  },
  {
    phone: '13800138003',
    password: 'password123',
    nickname: '赵芳',
    name: '赵芳',
    avatar: '/avatar-3.jpg',
    company: '卓越教育咨询',
    position: '合伙人',
    bio: '10年人力资源经验，擅长团队管理、培训体系搭建和课程开发。\n\n专业领域：\n• 人才发展战略\n• 培训体系搭建\n• 团队管理优化\n• 绩效考核设计',
    role: 'user',
  },
  {
    phone: '13800138004',
    password: 'password123',
    nickname: '陈伟',
    name: '陈伟',
    avatar: '/avatar-4.jpg',
    company: '蓝海品牌策划',
    position: '创意总监',
    bio: '15年市场营销经验，擅长品牌策划、数字营销和内容创意。\n\n专业领域：\n• 品牌战略规划\n• 数字营销运营\n• 内容创意策划\n• 跨界营销合作',
    role: 'user',
  },
  {
    phone: '13800138005',
    password: 'password123',
    nickname: '刘芳',
    name: '刘芳',
    avatar: '/avatar-5.jpg',
    company: '康瑞医疗集团',
    position: '运营经理',
    bio: '10年财务咨询经验，专注于财务顾问和税务筹划服务。\n\n专业领域：\n• 财务分析与规划\n• 税务筹划服务\n• 风险控制管理\n• 企业财务诊断',
    role: 'user',
  },
];

// 硬编码数据 - 活动
const activities = [
  {
    title: 'CEO转型期私董会',
    subtitle: '战略定位与组织重构',
    category: 'private',
    description: '邀请10位CEO共同探讨传统企业在AI时代的转型路径，通过深度对话和案例分析，帮助企业在变革中找到新的增长点。\n\n活动亮点：\n• 小班精品，10位CEO深度交流\n• 实战案例分享与讨论\n• 专家导师现场指导\n• 建立高端人脉网络',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop',
    address: '北京市朝阳区CBD国贸大厦',
    startDate: new Date('2025-02-15T14:00:00'),
    endDate: new Date('2025-02-15T17:00:00'),
    capacity: 12,
    teaFee: 35,
    status: 'active',
    createdBy: 1, // 管理员ID
  },
  {
    title: '数字化转型实战沙龙',
    subtitle: '企业数字化转型的成功案例分享',
    category: 'salon',
    description: '邀请行业专家分享数字化转型的成功案例，帮助企业了解最新的技术应用和管理理念。\n\n活动亮点：\n• 3位行业专家实战分享\n• 互动问答环节\n• 数字化工具演示\n• 茶歇交流时间',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop',
    address: '上海市浦东新区陆家嘴金融中心',
    startDate: new Date('2025-02-20T13:30:00'),
    endDate: new Date('2025-02-20T17:00:00'),
    capacity: 30,
    teaFee: 50,
    status: 'active',
    createdBy: 1,
  },
  {
    title: 'AI应用场景实战',
    subtitle: 'AI技术应用到企业业务',
    category: 'ai',
    description: '通过实际案例演示，学习如何将AI技术应用到企业业务中，提升效率和竞争力。\n\n活动亮点：\n• 实际项目案例分析\n• AI工具动手实践\n• 专家一对一指导\n• 获得实战经验证书',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    address: '深圳市南山区科技园',
    startDate: new Date('2025-02-25T09:00:00'),
    endDate: new Date('2025-02-25T17:00:00'),
    capacity: 20,
    teaFee: 80,
    status: 'active',
    createdBy: 1,
  },
  {
    title: '品牌升级私董会',
    subtitle: '品牌升级的策略和方法',
    category: 'private',
    description: '邀请品牌专家和企业家共同探讨品牌升级的策略和方法，助力企业打造强势品牌。\n\n活动亮点：\n• 品牌专家深度指导\n• 成功案例拆解\n• 品牌诊断与建议\n• 建立品牌合作网络',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop',
    address: '杭州市西湖区阿里巴巴园区',
    startDate: new Date('2025-03-01T14:30:00'),
    endDate: new Date('2025-03-01T17:30:00'),
    capacity: 15,
    teaFee: 60,
    status: 'active',
    createdBy: 1,
  },
];

// 硬编码数据 - 探访
const visits = [
  {
    title: '探访华为深圳总部',
    description: '深入了解华为的企业文化、研发体系和管理模式，与华为高管面对面交流。\n\n探访亮点：\n• 参观华为展厅和研发中心\n• 与华为高管座谈\n• 了解华为人才培养体系\n• 学习华为创新文化',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    location: '深圳市龙岗区坂田华为总部',
    date: new Date('2025-03-10T09:00:00'),
    capacity: 20,
    teaFee: 100,
    status: 'active',
    createdBy: 1,
  },
  {
    title: '探访阿里杭州总部',
    description: '深度了解阿里巴巴的商业模式、组织文化和创新机制。\n\n探访亮点：\n• 参观阿里园区\n• 与阿里云专家交流\n• 了解电商生态体系\n• 学习阿里文化价值观',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop',
    location: '杭州市余杭区阿里巴巴滨江园区',
    date: new Date('2025-03-20T09:00:00'),
    capacity: 25,
    teaFee: 120,
    status: 'active',
    createdBy: 1,
  },
];

async function seedDatabase() {
  console.log('正在连接Supabase数据库...');
  console.log('连接字符串:', connectionString.replace(/:[^:@]+@/, ':****@'));
  
  try {
    const sql = postgres(connectionString, {
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log('\n开始导入数据...\n');

    // 1. 创建管理员账号
    console.log('1/4 创建管理员账号...');
    const adminPassword = await bcrypt.hash('zy818989', 10);
    await sql`
      INSERT INTO users (phone, password, nickname, name, role, status)
      VALUES (
        '13800138888',
        ${adminPassword},
        '大鱼',
        '大鱼',
        'admin',
        'active'
      )
      ON CONFLICT (phone) DO NOTHING
    `;
    console.log('✅ 管理员账号创建成功 (账号: 13800138888, 密码: zy818989)');

    // 2. 插入会员数据
    console.log('\n2/4 导入会员数据...');
    for (const member of members) {
      const hashedPassword = await bcrypt.hash(member.password, 10);
      await sql`
        INSERT INTO users 
        (phone, password, nickname, name, avatar, company, position, bio, role, status)
        VALUES (
          ${member.phone},
          ${hashedPassword},
          ${member.nickname},
          ${member.name},
          ${member.avatar},
          ${member.company},
          ${member.position},
          ${member.bio},
          ${member.role},
          'active'
        )
        ON CONFLICT (phone) DO NOTHING
      `;
      console.log(`  ✅ 导入会员: ${member.nickname}`);
    }

    // 3. 插入活动数据
    console.log('\n3/4 导入活动数据...');
    for (const activity of activities) {
      const result = await sql`
        INSERT INTO activities 
        (title, subtitle, category, description, image, address, start_date, end_date, capacity, tea_fee, status, created_by)
        VALUES (
          ${activity.title},
          ${activity.subtitle},
          ${activity.category},
          ${activity.description},
          ${activity.image},
          ${activity.address},
          ${activity.startDate},
          ${activity.endDate},
          ${activity.capacity},
          ${activity.teaFee},
          ${activity.status},
          ${activity.createdBy}
        )
        RETURNING id
      `;
      console.log(`  ✅ 导入活动: ${activity.title} (ID: ${result[0].id})`);
    }

    // 4. 插入探访数据
    console.log('\n4/4 导入探访数据...');
    for (const visit of visits) {
      const result = await sql`
        INSERT INTO visits 
        (title, description, image, location, date, capacity, tea_fee, status, created_by)
        VALUES (
          ${visit.title},
          ${visit.description},
          ${visit.image},
          ${visit.location},
          ${visit.date},
          ${visit.capacity},
          ${visit.teaFee},
          ${visit.status},
          ${visit.createdBy}
        )
        RETURNING id
      `;
      console.log(`  ✅ 导入探访: ${visit.title} (ID: ${result[0].id})`);
    }

    await sql.end();
    
    console.log('\n=================================');
    console.log('✅ 数据导入完成！');
    console.log('=================================');
    console.log('已导入数据:');
    console.log('  - 管理员: 1个');
    console.log('  - 会员: 5个');
    console.log('  - 活动: 4个');
    console.log('  - 探访: 2个');
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ 数据导入失败:', error.message);
    
    if (error.code === 'ENETUNREACH' || error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.log('\n=================================');
      console.log('检测到网络连接问题，请稍后在你的环境中执行:');
      console.log('=================================\n');
      console.log('npx tsx scripts/seed-data.ts');
    }
    
    process.exit(1);
  }
}

seedDatabase();
