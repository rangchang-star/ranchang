import { NextRequest, NextResponse } from 'next/server';
import { db, activities, appUsers } from '@/lib/db';
import { eq, or } from 'drizzle-orm';

// POST - 修复活动嘉宾头像数据（将 blob URL 替换为正确的对象存储 key）并清理无效数据
export async function POST(request: NextRequest) {
  try {
    const activityList = await db.select().from(activities);

    let fixedCount = 0;
    let fixedGuests = 0;
    let cleanedInvalidGuests = 0;

    for (const activity of activityList) {
      if (!activity.guests || !Array.isArray(activity.guests)) {
        continue;
      }

      let needsUpdate = false;
      const fixedGuestsList = [];

      for (const guest of activity.guests) {
        let fixedGuest = { ...guest };

        // 清理无效嘉宾（name 和 avatar 都为空）
        if (!guest.name && !guest.avatar) {
          needsUpdate = true;
          cleanedInvalidGuests++;
          continue; // 跳过这个无效嘉宾，不添加到列表中
        }

        // 检查 avatar 是否是 blob URL 或为空
        if (!guest.avatar || guest.avatar.startsWith('blob:')) {
          // 查询该用户在 appUsers 表中的 avatar 字段
          let userAvatar = '';
          
          try {
            // 优先通过 id 查询
            const users = await db
              .select({ avatar: appUsers.avatar })
              .from(appUsers)
              .where(eq(appUsers.id, guest.id));
            
            if (users.length > 0 && users[0].avatar && !users[0].avatar.startsWith('blob:')) {
              userAvatar = users[0].avatar;
            }
          } catch (err) {
            console.error('查询用户头像失败:', err);
          }

          // 如果通过 id 查询失败，尝试通过 name 查询
          if (!userAvatar && guest.name) {
            try {
              const users = await db
                .select({ avatar: appUsers.avatar })
                .from(appUsers)
                .where(eq(appUsers.name, guest.name));
              
              if (users.length > 0 && users[0].avatar && !users[0].avatar.startsWith('blob:')) {
                userAvatar = users[0].avatar;
              }
            } catch (err) {
              console.error('通过姓名查询用户头像失败:', err);
            }
          }

          if (userAvatar !== guest.avatar) {
            needsUpdate = true;
            fixedGuest = {
              ...guest,
              avatar: userAvatar,
            };
            fixedGuests++;
          }
        }

        fixedGuestsList.push(fixedGuest);
      }

      if (needsUpdate) {
        await db
          .update(activities)
          .set({ guests: fixedGuestsList })
          .where(eq(activities.id, activity.id));
        fixedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `已修复 ${fixedCount} 个活动的 ${fixedGuests} 个嘉宾头像数据，清理 ${cleanedInvalidGuests} 个无效嘉宾`,
      fixedCount,
      fixedGuests,
      cleanedInvalidGuests,
    });
  } catch (error) {
    console.error('修复嘉宾头像数据失败:', error);
    return NextResponse.json(
      { success: false, error: '修复嘉宾头像数据失败' },
      { status: 500 }
    );
  }
}
