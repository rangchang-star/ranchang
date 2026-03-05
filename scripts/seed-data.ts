import postgres from 'postgres';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';

config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;

// 硬编码数据 - 会员（从前端发现页同步）
const members = [
  {
    phone: '13800138001',
    password: 'password123',
    nickname: '王建国',
    name: '王建国',
    age: 45,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_bbf6f195-3b8a-4b54-b64f-6f3bae98e444.jpeg?sign=1804211030-245d720254-0-b74ed079c491b9ed339b093771ad4a259345877e591dd9a7c41080042c5b0bb5',
    company: '精密制造集团',
    position: '运营总监',
    industry: '制造业',
    bio: '15年供应链管理经验，擅长传统制造业数字化转型，曾帮助多家企业实现精益管理和成本控制。',
    need: '寻找智能制造转型合作伙伴，希望与有数字化改造经验的企业对接',
    tagStamp: 'personLookingForJob',
    tags: ['精益管理', '供应链优化', '成本控制'],
    abilityTags: ['精益管理', '供应链优化', '成本控制', '流程优化', '团队管理'],
    resourceTags: [],
    isTrusted: true,
    role: 'user',
  },
  {
    phone: '13800138002',
    password: 'password123',
    nickname: '李雪梅',
    name: '李雪梅',
    age: 38,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_e261d034-5d7d-4119-9d0c-fdfa90bcdbcc.jpeg?sign=1804211032-29d4f52530-0-fc22688ea885c9e0d9b1a3dc21456c2e957369397efa73e953abad7a18f37c1a',
    company: '卓越教育咨询',
    position: '合伙人',
    industry: '教育咨询',
    bio: '12年教育咨询经验，擅长团队管理、培训体系搭建和课程开发。',
    need: '寻找女性职业发展导师，希望提升领导力和战略思维',
    tagStamp: 'personLookingForJob',
    tags: ['团队管理', '培训体系搭建', '课程开发'],
    abilityTags: ['团队管理', '培训体系搭建', '课程开发', '绩效管理'],
    resourceTags: [],
    isTrusted: true,
    role: 'user',
  },
  {
    phone: '13800138003',
    password: 'password123',
    nickname: '张志强',
    name: '张志强',
    age: 42,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_c5921701-ca08-48f7-9889-af89c3b63a24.jpeg?sign=1804211031-6d2ec28685-0-a2001ce035b1e234214d716bfe2fbba38984784350dfbbbc7986a4bed3f8a6e2',
    company: '绿色能源科技',
    position: '副总经理',
    industry: '新能源',
    bio: '15年新能源行业经验，专注于项目投融资、政策解读和海外市场拓展。',
    need: '寻找光伏产业链上下游合作伙伴，有丰富行业资源',
    tagStamp: 'jobLookingForPerson',
    tags: ['项目投融资', '政策解读', '海外市场'],
    abilityTags: ['项目投融资', '政策解读', '海外市场', '战略合作'],
    resourceTags: ['资金', '行业资源'],
    isTrusted: false,
    role: 'user',
  },
  {
    phone: '13800138004',
    password: 'password123',
    nickname: '刘美玲',
    name: '刘美玲',
    age: 36,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_2e0ade81-a72f-4138-90b2-dcf628e76c47.jpeg?sign=1804211032-1839ddf44e-0-ab2abd6b8fc954483fd7274d14f6a887a4e36394a5482923d464ed21a9380413',
    company: '康瑞医疗集团',
    position: '运营经理',
    industry: '医疗健康',
    bio: '10年医疗健康行业经验，擅长患者关系管理、医疗数据分析和合规运营。',
    need: '希望学习互联网医疗运营经验，拓展线上业务',
    tagStamp: 'personLookingForJob',
    tags: ['患者关系管理', '医疗数据分析', '合规运营'],
    abilityTags: ['患者关系管理', '医疗数据分析', '合规运营'],
    resourceTags: [],
    isTrusted: false,
    role: 'user',
  },
  {
    phone: '13800138005',
    password: 'password123',
    nickname: '陈永明',
    name: '陈永明',
    age: 48,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_af5cc0fe-324f-427e-bdeb-546e898b62f6.jpeg?sign=1804211031-65708fd535-0-d43856138aca15c5c8ba06d6a515fa5a2366705a4df51fb95b9a66e244ec31e5',
    company: '永明投资管理',
    position: '创始人兼CEO',
    industry: '金融投资',
    bio: '20年金融投资经验，专注于投资决策、财务尽调和企业估值。',
    need: '寻找优质成长型企业投资机会，资金规模5000万',
    tagStamp: 'jobLookingForPerson',
    tags: ['投资决策', '财务尽调', '企业估值'],
    abilityTags: ['投资决策', '财务尽调', '企业估值'],
    resourceTags: ['资金'],
    isTrusted: true,
    role: 'user',
  },
  {
    phone: '13800138006',
    password: 'password123',
    nickname: '赵丽娜',
    name: '赵丽娜',
    age: 40,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_47e0f5ad-6b79-478b-af48-3c8629aadf23.jpeg?sign=1804211046-b450875ec6-0-721112335d177e7449e7a28fcfc4287f5245a2eac8324a03caa77bbeddc08fd9',
    company: '蓝海品牌策划',
    position: '创意总监',
    industry: '品牌营销',
    bio: '15年品牌营销经验，擅长品牌策划、数字营销和内容创意。',
    need: '寻求品牌升级案例分享，希望与资深品牌顾问交流',
    tagStamp: 'personLookingForJob',
    tags: ['品牌策划', '数字营销', '内容创意'],
    abilityTags: ['品牌策划', '数字营销', '内容创意'],
    resourceTags: [],
    isTrusted: false,
    role: 'user',
  },
  {
    phone: '13800138007',
    password: 'password123',
    nickname: '吴建华',
    name: '吴建华',
    age: 52,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_34d509dd-d51a-4a72-a0c7-eac172cf785e.jpeg?sign=1804211046-488f8307be-0-cba7bb7116abe4c8093c833e0fba75ccf50de9c8b6922e7ad1f274e131e54de9',
    company: '宏达建筑工程',
    position: '总工程师',
    industry: '建筑工程',
    bio: '25年建筑工程经验，擅长工程管理、成本控制和技术攻关。',
    need: '寻找绿色建筑技术合作伙伴，有多个在建项目',
    tagStamp: 'jobLookingForPerson',
    tags: ['工程管理', '成本控制', '技术攻关'],
    abilityTags: ['工程管理', '成本控制', '技术攻关'],
    resourceTags: ['项目'],
    isTrusted: false,
    role: 'user',
  },
  {
    phone: '13800138008',
    password: 'password123',
    nickname: '周晓红',
    name: '周晓红',
    age: 35,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_6dbc7c6d-7be2-4882-9374-7524bafeb004.jpeg?sign=1804211046-e9a4a35be8-0-0c000c4e11d33e9afe13da09a1fd624fa4872dca29ef3c4082b70739eef6cb60',
    company: '尚品电商',
    position: '运营总监',
    industry: '电子商务',
    bio: '10年电商运营经验，擅长电商运营、数据分析和供应链管理。',
    need: '希望学习跨境电商运营，拓展海外市场',
    tagStamp: 'personLookingForJob',
    tags: ['电商运营', '数据分析', '供应链管理'],
    abilityTags: ['电商运营', '数据分析', '供应链管理'],
    resourceTags: [],
    isTrusted: false,
    role: 'user',
  },
  {
    phone: '13800138009',
    password: 'password123',
    nickname: '黄文博',
    name: '黄文博',
    age: 44,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_8f147e12-97fd-4a3a-910c-c01210b51992.jpeg?sign=1804211048-a56add5fc0-0-25e517d0da0fdfded0338138db1912845f6e2a98ccf93a98cedfa2ca18f4ffeb',
    company: '智源科技',
    position: '技术总监',
    industry: '人工智能',
    bio: '18年AI行业经验，专注于算法研发、产品规划和技术落地。',
    need: '寻找AI应用场景合作伙伴，有丰富技术积累',
    tagStamp: 'jobLookingForPerson',
    tags: ['算法研发', '产品规划', '技术落地'],
    abilityTags: ['算法研发', '产品规划', '技术落地'],
    resourceTags: ['技术'],
    isTrusted: true,
    role: 'user',
  },
  {
    phone: '13800138010',
    password: 'password123',
    nickname: '林芳',
    name: '林芳',
    age: 39,
    avatar: 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_76511fd7-7e41-4832-9927-9e43805e6e69.jpeg?sign=1804211046-eb24a4c27d-0-c751e5ceac171fa9e3bf3321967ef31a828a276e01a534a388e407ea6864b931',
    company: '金领人力咨询',
    position: '合伙人',
    industry: '人力资源',
    bio: '12年人力资源经验，擅长人才招聘、培训发展和绩效管理。',
    need: '希望学习企业人才发展战略，提升组织能力',
    tagStamp: 'personLookingForJob',
    tags: ['人才招聘', '培训发展', '绩效管理'],
    abilityTags: ['人才招聘', '培训发展', '绩效管理'],
    resourceTags: [],
    isTrusted: false,
    role: 'user',
  },
];

// 硬编码数据 - 活动（从前端发现页同步）
const activities = [
  {
    title: 'CEO转型期私董会',
    subtitle: '战略定位与组织重构',
    category: 'private',
    description: '邀请10位CEO共同探讨传统企业在AI时代的转型路径，通过深度对话和案例分析，帮助企业在变革中找到新的增长点。',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=160&h=160&fit=crop',
    address: '北京市朝阳区CBD国贸大厦',
    startDate: new Date('2025-02-15T14:00:00'),
    endDate: new Date('2025-02-15T17:00:00'),
    capacity: 12,
    teaFee: 35,
    status: 'active',
    createdBy: 1, // 管理员ID
  },
  {
    title: 'AI实战赋能营',
    subtitle: '从工具应用到业务落地',
    category: 'ai',
    description: '全天候AI工具实战培训，涵盖Midjourney、ChatGPT等主流工具的深度应用，帮助学员快速掌握AI赋能业务的方法。',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=160&h=160&fit=crop',
    address: '上海市浦东新区张江高科',
    startDate: new Date('2025-02-20T09:00:00'),
    endDate: new Date('2025-02-20T18:00:00'),
    capacity: 20,
    teaFee: 50,
    status: 'active',
    createdBy: 1,
  },
  {
    title: '创业者分享沙龙',
    subtitle: '35+职场转型故事',
    category: 'salon',
    description: '邀请3位成功转型的35+创业者分享他们的转型故事和经验，为正在考虑转型的职场人提供参考和启发。',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop',
    address: '深圳市南山区科技园',
    startDate: new Date('2025-02-25T14:00:00'),
    endDate: new Date('2025-02-25T17:00:00'),
    capacity: 15,
    teaFee: 40,
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
        (phone, password, nickname, name, age, avatar, company, position, industry, bio, need, tag_stamp, tags, ability_tags, resource_tags, is_trusted, role, status)
        VALUES (
          ${member.phone},
          ${hashedPassword},
          ${member.nickname},
          ${member.name},
          ${member.age},
          ${member.avatar},
          ${member.company},
          ${member.position},
          ${member.industry},
          ${member.bio},
          ${member.need},
          ${member.tagStamp},
          ${JSON.stringify(member.tags || [])}::jsonb,
          ${JSON.stringify(member.abilityTags || [])}::jsonb,
          ${JSON.stringify(member.resourceTags || [])}::jsonb,
          ${member.isTrusted || false},
          ${member.role},
          'active'
        )
        ON CONFLICT (phone) DO NOTHING
      `;
      console.log(`  ✅ 导入会员: ${member.nickname} (${member.industry} - ${member.position})`);
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
    console.log('  - 会员: 10个');
    console.log('  - 活动: 3个');
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
