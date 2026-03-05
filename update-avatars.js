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

loadEnv();

const supabaseUrl = process.env.COZE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const client = createClient(supabaseUrl, supabaseKey);

// 头像URL映射（按姓名匹配）
const avatarUrls = {
  '王建国': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_bbf6f195-3b8a-4b54-b64f-6f3bae98e444.jpeg?sign=1804211030-245d720254-0-b74ed079c491b9ed339b093771ad4a259345877e591dd9a7c41080042c5b0bb5',
  '李雪梅': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_e261d034-5d7d-4119-9d0c-fdfa90bcdbcc.jpeg?sign=1804211032-29d4f52530-0-fc22688ea885c9e0d9b1a3dc21456c2e957369397efa73e953abad7a18f37c1a',
  '张志强': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_c5921701-ca08-48f7-9889-af89c3b63a24.jpeg?sign=1804211031-6d2ec28685-0-a2001ce035b1e234214d716bfe2fbba38984784350dfbbbc7986a4bed3f8a6e2',
  '刘美玲': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_2e0ade81-a72f-4138-90b2-dcf628e76c47.jpeg?sign=1804211032-1839ddf44e-0-ab2abd6b8fc954483fd7274d14f6a887a4e36394a5482923d464ed21a9380413',
  '陈永明': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_af5cc0fe-324f-427e-bdeb-546e898b62f6.jpeg?sign=1804211031-65708fd535-0-d43856138aca15c5c8ba06d6a515fa5a2366705a4df51fb95b9a66e244ec31e5',
  '赵丽娜': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_47e0f5ad-6b79-478b-af48-3c8629aadf23.jpeg?sign=1804211046-b450875ec6-0-721112335d177e7449e7a28fcfc4287f5245a2eac8324a03caa77bbeddc08fd9',
  '吴建华': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_34d509dd-d51a-4a72-a0c7-eac172cf785e.jpeg?sign=1804211046-488f8307be-0-cba7bb7116abe4c8093c833e0fba75ccf50de9c8b6922e7ad1f274e131e54de9',
  '周晓红': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_6dbc7c6d-7be2-4882-9374-7524bafeb004.jpeg?sign=1804211046-e9a4a35be8-0-0c000c4e11d33e9afe13da09a1fd624fa4872dca29ef3c4082b70739eef6cb60',
  '黄文博': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_8f147e12-97fd-4a3a-910c-c01210b51992.jpeg?sign=1804211048-a56add5fc0-0-25e517d0da0fdfded0338138db1912845f6e2a98ccf93a98cedfa2ca18f4ffeb',
  '林芳': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_76511fd7-7e41-4832-9927-9e43805e6e69.jpeg?sign=1804211046-eb24a4c27d-0-c751e5ceac171fa9e3bf3321967ef31a828a276e01a534a388e407ea6864b931',
  '马志远': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_4911ce18-3b02-468b-817c-a21a97c624f9.jpeg?sign=1804211062-614a8a3cbd-0-b2b0187f53e653b31e8b5e83af4728fa294fa1d89cd434ea42d865eab4599e9c',
  '郑雅琪': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_72c31a7d-a06c-4035-a5e9-aac0ed413d5e.jpeg?sign=1804211060-0bd7d62594-0-3fe51ac7034b902d2ddb28ae545f48e57ba164eb93b9792be80fe9b67b4ae51b',
  '孙德明': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_99f51794-3c1c-49c7-bf14-0bff78002b89.jpeg?sign=1804211062-0bab1bd323-0-657ef2a001355328f4fb52755a876b8a4d4765431a93974ac9feb678443a2df1',
  '朱婷婷': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_c12966d3-a3d8-48d4-9603-953cce5a513d.jpeg?sign=1804211063-0bf5020661-0-23c6c8a8407b4c35094ee825508603587bc7060a96bccda0f70063088b308ba0',
  '高建平': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_1e525e4f-dfae-432d-88f8-74ebc8ffebec.jpeg?sign=1804211062-7471cf813c-0-90872e80037fb3fe73898f53a51c65b03c7fbfbd31c9aba1bc712c2f9c523f02',
  '何思源': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_931cf4ef-cb82-4f6c-9e32-c8f529c67eb1.jpeg?sign=1804211076-eccffc5b59-0-cecf6d5074f96d8a9f8cb44c6be826e1cd91c17f9b65d96ecd304643a27cbe89',
  '罗晓燕': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_106f500a-9d49-4c99-b8c7-31f0a8c21e99.jpeg?sign=1804211075-86373440bc-0-d0fbcd44a724dfe824a9948451f117558b15fe0c41725901d43b18c413c1df02',
  '谢俊杰': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_a84c0c50-4891-4b17-9b44-b3622c9b56b7.jpeg?sign=1804211075-c970579af1-0-7aeaef88420cee79703d8a61c20504abef3f8af24e4bbbe540cc3e3175cb9503',
  '韩雨薇': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_a7a5d2f7-ec69-46de-903a-8932c177f4fe.jpeg?sign=1804211076-ad1af6907f-0-6f316cdbd66414e03fe6f95d9c2d932d822b59319339797f0f977b0d38e2b75c',
  '邓永强': 'https://coze-coding-project.tos.coze.site/coze_storage_7612179044355801123/image/generate_image_5d9e226e-6214-408c-af11-95006f5f6eb4.jpeg?sign=1804211076-0236224df0-0-86e8c56a6b3e9ea45f838f750c53eccb506a6b968af5113ee1cba1bc910c9b90'
};

async function updateAvatars() {
  try {
    console.log('🚀 开始更新会员头像...');

    let successCount = 0;
    let failCount = 0;

    // 逐个更新头像
    for (const [name, avatarUrl] of Object.entries(avatarUrls)) {
      try {
        const { data, error } = await client
          .from('users')
          .update({ avatar: avatarUrl })
          .eq('name', name)
          .select();

        if (error) {
          console.error(`❌ 更新 ${name} 失败:`, error.message);
          failCount++;
        } else {
          console.log(`✅ ${name} 头像更新成功`);
          successCount++;
        }

        // 稍微延迟，避免请求过快
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ 更新 ${name} 异常:`, error.message);
        failCount++;
      }
    }

    console.log('\n========================================');
    console.log('✅ 头像更新完成！');
    console.log('========================================');
    console.log(`成功: ${successCount} 条`);
    console.log(`失败: ${failCount} 条`);
    console.log('========================================\n');

    return { successCount, failCount };

  } catch (error) {
    console.error('❌ 错误:', error);
    throw error;
  }
}

updateAvatars();
