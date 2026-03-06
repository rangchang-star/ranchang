import { NextRequest, NextResponse } from 'next/server';

// 默认设置数据
const defaultSettings = {
  // 底部导航键配置
  navigation: {
    discovery: {
      label: '发现光亮',
      icon: 'flame',
    },
    ignition: {
      label: '点亮事业',
      icon: 'trending-up',
    },
    profile: {
      label: '个人中心',
      icon: 'user',
    },
  },
  // 页面标题配置
  pageTitles: {
    discovery: '发现光亮',
    activities: '活动列表',
    visit: '探访点亮',
    assets: '能力资产',
    declarations: '高燃宣告',
    connection: '能力连接',
    consultation: '专家咨询',
    training: '培训赋能',
    subscription: 'AI加油圈',
    notifications: '消息通知',
    settings: '系统设置',
  },
  // 发现键设置
  discovery: {
    slogan: '发现光亮，点亮事业',
    logo: '/logo-ranchang.png',
    music: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundImage: '/discovery-bg.jpg',
  },
  // 点亮键设置
  ignition: {
    visitSlogan: '每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....',
    visitMedia: {
      type: null,
      url: '',
    },
    aiCircleSlogan: 'AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产',
    aiCircleMedia: {
      type: null,
      url: '',
    },
  },
  // 个人键量表设置
  profile: {
    businessCognition: {
      displayStyle: 'radar',
    },
    aiCognition: {
      displayStyle: 'radar',
    },
    careerMission: {
      displayStyle: 'cards',
    },
    entrepreneurialPsychology: {
      displayStyle: 'progress',
    },
  },
  // 联系信息配置
  contactInfo: {
    message: '此功能暂时关闭，需要对接人与资源联系"燃场app"工作人员。',
    contact: 'v:13023699913',
  },
};

export async function GET() {
  try {
    // 从 localStorage 中获取设置（注意：在服务端无法直接访问 localStorage）
    // 实际应用中应该从数据库读取，这里暂时返回默认设置
    // 前端会结合 localStorage 使用
    
    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  } catch (error) {
    console.error('获取设置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取设置失败',
      },
      { status: 500 }
    );
  }
}
