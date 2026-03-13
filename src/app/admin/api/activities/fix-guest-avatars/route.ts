import { NextRequest, NextResponse } from 'next/server';
import { db, activities } from '@/lib/db';
import { eq } from 'drizzle-orm';

// POST - 修复活动嘉宾头像数据（清理 blob URL）
export async function POST(request: NextRequest) {
  try {
    const activityList = await db.select().from(activities);

    let fixedCount = 0;

    for (const activity of activityList) {
      if (!activity.guests || !Array.isArray(activity.guests)) {
        continue;
      }

      let needsUpdate = false;
      const fixedGuests = activity.guests.map((guest: any) => {
        // 检查 avatar 是否是 blob URL
        if (guest.avatar && guest.avatar.startsWith('blob:')) {
          needsUpdate = true;
          return {
            ...guest,
            avatar: '', // 清空 blob URL
          };
        }
        return guest;
      });

      if (needsUpdate) {
        await db
          .update(activities)
          .set({ guests: fixedGuests })
          .where(eq(activities.id, activity.id));
        fixedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `已修复 ${fixedCount} 个活动的嘉宾头像数据`,
      fixedCount,
    });
  } catch (error) {
    console.error('修复嘉宾头像数据失败:', error);
    return NextResponse.json(
      { success: false, error: '修复嘉宾头像数据失败' },
      { status: 500 }
    );
  }
}
