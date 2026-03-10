const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');

// 加载环境变量
function loadEnv() {
  try {
    const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;

    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const lines = output.trim().split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex);
        let value = line.substring(eqIndex + 1);
        if ((value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith('"') && value.endsWith('"'))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    console.error('加载环境变量失败:', error.message);
  }
}

// 加载环境变量
loadEnv();

// 创建Supabase客户端
const supabaseUrl = process.env.COZE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseKey);

function getSupabaseClient() {
  return client;
}

// 20条真实的中国会员数据
const mockUsers = [
  {
    name: '王建国',
    age: 45,
    phone: '138****5678',
    email: 'wangjianguo@example.com',
    connection_type: '资源连接',
    industry: '制造业',
    need: '寻找智能制造转型合作伙伴，希望与有数字化改造经验的企业对接',
    hardcore_tags: ['精益管理', '供应链优化', '成本控制'],
    resource_tags: ['工厂资源', '供应商网络', '技术团队'],
    level: '资深从业者',
    company: '精密制造集团',
    position: '运营总监',
    status: 'active',
    is_featured: true,
    avatar: '/avatar-wang-1.jpg'
  },
  {
    name: '李雪梅',
    age: 38,
    phone: '139****9012',
    email: 'lixuemei@example.com',
    connection_type: '能力连接',
    industry: '教育咨询',
    need: '寻找女性职业发展导师，希望提升领导力和战略思维',
    hardcore_tags: ['团队管理', '培训体系搭建', '课程开发'],
    resource_tags: ['培训资源', '讲师资源', '企业客户'],
    level: '中层管理者',
    company: '卓越教育咨询',
    position: '合伙人',
    status: 'active',
    is_featured: true,
    avatar: '/avatar-li-1.jpg'
  },
  {
    name: '张志强',
    age: 42,
    phone: '136****3456',
    email: 'zhangzhiqiang@example.com',
    connection_type: '资源连接',
    industry: '新能源',
    need: '寻找光伏产业链上下游合作伙伴，有丰富行业资源',
    hardcore_tags: ['项目投融资', '政策解读', '海外市场'],
    resource_tags: ['政策资源', '融资渠道', '海外客户'],
    level: '资深从业者',
    company: '绿色能源科技',
    position: '副总经理',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-zhang-1.jpg'
  },
  {
    name: '刘美玲',
    age: 36,
    phone: '137****7890',
    email: 'liumeiling@example.com',
    connection_type: '能力连接',
    industry: '医疗健康',
    need: '希望学习互联网医疗运营经验，拓展线上业务',
    hardcore_tags: ['患者关系管理', '医疗数据分析', '合规运营'],
    resource_tags: ['医院资源', '医生资源', '患者数据'],
    level: '中层管理者',
    company: '康瑞医疗集团',
    position: '运营经理',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-liu-1.jpg'
  },
  {
    name: '陈永明',
    age: 48,
    phone: '135****2345',
    email: 'chenyongming@example.com',
    connection_type: '资源连接',
    industry: '金融投资',
    need: '寻找优质成长型企业投资机会，资金规模5000万',
    hardcore_tags: ['投资决策', '财务尽调', '企业估值'],
    resource_tags: ['资金资源', '投行资源', '企业网络'],
    level: '资深从业者',
    company: '永明投资管理',
    position: '创始人兼CEO',
    status: 'active',
    is_featured: true,
    avatar: '/avatar-chen-1.jpg'
  },
  {
    name: '赵丽娜',
    age: 40,
    phone: '158****6789',
    email: 'zhaolina@example.com',
    connection_type: '能力连接',
    industry: '品牌营销',
    need: '寻求品牌升级案例分享，希望与资深品牌顾问交流',
    hardcore_tags: ['品牌策划', '数字营销', '内容创意'],
    resource_tags: ['媒体资源', 'KOL资源', '创意团队'],
    level: '中层管理者',
    company: '蓝海品牌策划',
    position: '创意总监',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-zhao-1.jpg'
  },
  {
    name: '吴建华',
    age: 52,
    phone: '159****1234',
    email: 'wujianhua@example.com',
    connection_type: '资源连接',
    industry: '建筑工程',
    need: '寻找绿色建筑技术合作伙伴，有多个在建项目',
    hardcore_tags: ['工程管理', '成本控制', '技术攻关'],
    resource_tags: ['项目资源', '施工团队', '供应商'],
    level: '资深从业者',
    company: '宏达建筑工程',
    position: '总工程师',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-wu-1.jpg'
  },
  {
    name: '周晓红',
    age: 35,
    phone: '186****5678',
    email: 'zhouxiaohong@example.com',
    connection_type: '能力连接',
    industry: '电子商务',
    need: '希望学习跨境电商运营，拓展海外市场',
    hardcore_tags: ['电商运营', '数据分析', '供应链管理'],
    resource_tags: ['平台资源', '物流资源', '选品资源'],
    level: '中层管理者',
    company: '尚品电商',
    position: '运营总监',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-zhou-1.jpg'
  },
  {
    name: '黄文博',
    age: 44,
    phone: '180****3456',
    email: 'huangwenbo@example.com',
    connection_type: '资源连接',
    industry: '人工智能',
    need: '寻找AI应用场景合作伙伴，有丰富技术积累',
    hardcore_tags: ['算法研发', '产品规划', '技术落地'],
    resource_tags: ['技术资源', '数据资源', '应用场景'],
    level: '资深从业者',
    company: '智源科技',
    position: '技术总监',
    status: 'active',
    is_featured: true,
    avatar: '/avatar-huang-1.jpg'
  },
  {
    name: '林芳',
    age: 39,
    phone: '155****7890',
    email: 'linfang@example.com',
    connection_type: '能力连接',
    industry: '人力资源',
    need: '希望学习企业人才发展战略，提升组织能力',
    hardcore_tags: ['人才招聘', '培训发展', '绩效管理'],
    resource_tags: ['人才库资源', '培训资源', '测评工具'],
    level: '中层管理者',
    company: '金领人力咨询',
    position: '合伙人',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-lin-1.jpg'
  },
  {
    name: '马志远',
    age: 46,
    phone: '177****9012',
    email: 'mazhiyuan@example.com',
    connection_type: '资源连接',
    industry: '物流运输',
    need: '寻找物流科技合作伙伴，推动智慧物流升级',
    hardcore_tags: ['物流规划', '供应链管理', '数字化转型'],
    resource_tags: ['仓储资源', '运输网络', '客户资源'],
    level: '资深从业者',
    company: '通达物流集团',
    position: '副总经理',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-ma-1.jpg'
  },
  {
    name: '郑雅琪',
    age: 33,
    phone: '188****1234',
    email: 'zhengyaqi@example.com',
    connection_type: '能力连接',
    industry: '新媒体',
    need: '寻求内容创作经验分享，希望提升内容质量',
    hardcore_tags: ['内容策划', '视频剪辑', '社群运营'],
    resource_tags: ['创作者资源', 'MCN资源', '平台资源'],
    level: '中层管理者',
    company: '创想传媒',
    position: '内容总监',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-zheng-1.jpg'
  },
  {
    name: '孙德明',
    age: 50,
    phone: '152****3456',
    email: 'sundeming@example.com',
    connection_type: '资源连接',
    industry: '化工行业',
    need: '寻找环保技术合作伙伴，推动绿色生产转型',
    hardcore_tags: ['工艺优化', '安全管理', '环保技术'],
    resource_tags: ['技术资源', '设备资源', '环保资质'],
    level: '资深从业者',
    company: '德明化工',
    position: '董事长',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-sun-1.jpg'
  },
  {
    name: '朱婷婷',
    age: 37,
    phone: '189****5678',
    email: 'zhutingting@example.com',
    connection_type: '能力连接',
    industry: '教育培训',
    need: '希望学习在线教育运营经验，拓展线上业务',
    hardcore_tags: ['课程设计', '学员管理', '营销推广'],
    resource_tags: ['师资资源', '课程资源', '招生渠道'],
    level: '中层管理者',
    company: '启航教育',
    position: '运营总监',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-zhu-1.jpg'
  },
  {
    name: '高建平',
    age: 43,
    phone: '176****7890',
    email: 'gaojianping@example.com',
    connection_type: '资源连接',
    industry: '汽车制造',
    need: '寻找新能源汽车零部件供应商，有采购需求',
    hardcore_tags: ['供应链管理', '质量控制', '成本优化'],
    resource_tags: ['供应商资源', '技术资源', '市场资源'],
    level: '资深从业者',
    company: '长城汽车制造',
    position: '采购总监',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-gao-1.jpg'
  },
  {
    name: '何思源',
    age: 34,
    phone: '170****9012',
    email: 'hesiyuan@example.com',
    connection_type: '能力连接',
    industry: 'IT服务',
    need: '希望学习企业数字化解决方案，提升服务能力',
    hardcore_tags: ['技术咨询', '项目管理', '客户关系'],
    resource_tags: ['技术资源', '客户资源', '合作伙伴'],
    level: '中层管理者',
    company: '云腾科技',
    position: '技术经理',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-he-1.jpg'
  },
  {
    name: '罗晓燕',
    age: 41,
    phone: '183****1234',
    email: 'luoxiaoyan@example.com',
    connection_type: '资源连接',
    industry: '服装纺织',
    need: '寻找设计师和面料供应商，打造自主品牌',
    hardcore_tags: ['品牌规划', '供应链管理', '产品设计'],
    resource_tags: ['设计师资源', '面料资源', '生产资源'],
    level: '资深从业者',
    company: '雅致服饰',
    position: '创始人兼CEO',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-luo-1.jpg'
  },
  {
    name: '谢俊杰',
    age: 47,
    phone: '179****3456',
    email: 'xiejunjie@example.com',
    connection_type: '资源连接',
    industry: '房地产',
    need: '寻找城市更新项目合作伙伴，有丰富开发经验',
    hardcore_tags: ['项目开发', '规划设计', '招商运营'],
    resource_tags: ['土地资源', '资金资源', '开发团队'],
    level: '资深从业者',
    company: '金地地产',
    position: '项目总监',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-xie-1.jpg'
  },
  {
    name: '韩雨薇',
    age: 32,
    phone: '181****5678',
    email: 'hanyuwei@example.com',
    connection_type: '能力连接',
    industry: '游戏开发',
    need: '希望学习游戏运营经验，提升用户留存',
    hardcore_tags: ['游戏设计', '用户运营', '数据分析'],
    resource_tags: ['开发资源', '美术资源', '渠道资源'],
    level: '中层管理者',
    company: '梦想游戏',
    position: '运营总监',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-han-1.jpg'
  },
  {
    name: '邓永强',
    age: 49,
    phone: '175****9012',
    email: 'dengyongqiang@example.com',
    connection_type: '资源连接',
    industry: '农业科技',
    need: '寻找智慧农业技术合作伙伴，推动农业现代化',
    hardcore_tags: ['农业技术', '产品开发', '市场拓展'],
    resource_tags: ['土地资源', '技术资源', '销售渠道'],
    level: '资深从业者',
    company: '丰收农业科技',
    position: '总经理',
    status: 'active',
    is_featured: false,
    avatar: '/avatar-deng-1.jpg'
  }
];

async function insertMockUsers() {
  try {
    console.log('🚀 开始插入20条会员数据...');

    const client = getSupabaseClient();

    // 转换数据格式，添加时间戳
    const usersToInsert = mockUsers.map(user => ({
      name: user.name,
      age: user.age,
      phone: user.phone,
      email: user.email,
      connection_type: user.connection_type,
      industry: user.industry,
      need: user.need,
      hardcore_tags: user.hardcore_tags,
      resource_tags: user.resource_tags,
      level: user.level,
      company: user.company,
      position: user.position,
      status: user.status,
      is_featured: user.is_featured,
      avatar: user.avatar,
      join_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // 过去一年内的随机时间
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // 批量插入
    const { data, error } = await client
      .from('users')
      .insert(usersToInsert)
      .select();

    if (error) {
      console.error('❌ 插入失败:', error.message);
      throw error;
    }

    console.log(`✅ 成功插入 ${data.length} 条会员数据！`);
    console.log('\n📋 会员清单：');
    data.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.industry} - ${user.position}`);
    });

    return data;

  } catch (error) {
    console.error('❌ 错误:', error);
    throw error;
  }
}

insertMockUsers();
