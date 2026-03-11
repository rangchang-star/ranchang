/**
 * 发现页面 - 使用服务层版本（示例）
 *
 * 展示如何使用数据服务层改造页面
 */

"use client";

import { useState, useEffect } from "react";
import { UserService } from "@/lib/services/user.service";
import { ActivityService } from "@/lib/services/activity.service";
import { DeclarationService } from "@/lib/services/declaration.service";
import { SettingsService } from "@/lib/services/settings.service";
import type { User, Activity, Declaration, Settings } from "@/lib/services/types";

// ============================================================
// 服务层版本的核心优势
// ============================================================

/**
 * 优势1：数据格式统一，永远不会 undefined
 *
 * 旧版本：
 * const userName = user.name || '匿名用户';  // 每次都要检查
 * const userAvatar = user.avatar || '/default.jpg';  // 每次都要检查
 *
 * 新版本：
 * const userName = user.name;  // 一定有值
 * const userAvatar = user.avatar;  // 一定有值（服务层已处理）
 */

/**
 * 优势2：错误处理统一，代码更简洁
 *
 * 旧版本：
 * try {
 *   const response = await fetch("/api/users");
 *   if (response.ok) {
 *     const data = await response.json();
 *     if (data.success) {
 *       const users = data.data.map(u => ({
 *         id: u.id,
 *         name: u.name || '匿名',
 *         avatar: u.avatar || '/default.jpg',
 *         // ... 还要处理很多字段
 *       }));
 *       setUsers(users);
 *     }
 *   } else {
 *     console.error('加载失败');
 *   }
 * } catch (error) {
 *   console.error(error);
 * }
 *
 * 新版本：
 * const result = await UserService.getList();
 * if (result.users.length > 0) {
 *   setUsers(result.users);
 * }
 */

/**
 * 优势3：类型安全，IDE 自动提示
 *
 * 旧版本：
 * user.someField  // 不知道这个字段是什么类型
 *
 * 新版本：
 * user.name  // TypeScript 知道这是 string
 * user.age   // TypeScript 知道这是 number | null
 */

// ============================================================
// 使用服务层的发现页面（示例）
// ============================================================

export default function DiscoveryPageExample() {
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 加载设置 - 使用服务层
  useEffect(() => {
    async function loadSettings() {
      const settings = await SettingsService.getAll();
      setSettings(settings);  // 一定有值（服务层返回默认值）
    }

    loadSettings();
  }, []);

  // ✅ 加载数据 - 使用服务层
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        // 并行加载数据（服务层已经处理了错误）
        const [usersResult, activitiesResult, declarationsResult] = await Promise.all([
          UserService.getList({ limit: 10 }),
          ActivityService.getActive(10),
          DeclarationService.getList({ limit: 5 }),
        ]);

        setUsers(usersResult.users);  // 数据格式统一，无需转换
        setActivities(activitiesResult.activities);
        setDeclarations(declarationsResult.declarations);

      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // ✅ 渲染数据 - 不需要检查 undefined
  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      {/* ✅ settings 一定存在，不会 undefined */}
      <h1>{settings?.discovery.slogan}</h1>

      {/* ✅ Logo 一定有默认值 */}
      <img
        src={settings?.discovery.logo}
        alt="Logo"
      />

      {/* ✅ 用户列表 */}
      <div>
        {users.map(user => (
          <div key={user.id}>
            {/* ✅ 所有字段都有值，不会 undefined */}
            <h2>{user.name}</h2>
            <p>{user.company || '暂无公司'}</p>
            <img src={user.avatar} alt={user.name} />
          </div>
        ))}
      </div>

      {/* ✅ 活动列表 */}
      <div>
        {activities.map(activity => (
          <div key={activity.id}>
            {/* ✅ 所有字段都有值，不会 undefined */}
            <h2>{activity.title}</h2>
            <p>{activity.category}</p>
            <img src={activity.image} alt={activity.title} />
          </div>
        ))}
      </div>

      {/* ✅ 宣告列表 */}
      <div>
        {declarations.map(declaration => (
          <div key={declaration.id}>
            {/* ✅ 所有字段都有值，不会 undefined */}
            <p>{declaration.text}</p>
            <span>查看次数: {declaration.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 对比：旧版本 vs 新版本
// ============================================================

/**
 * 旧版本问题：
 * 1. 每次都要检查 undefined
 * 2. 数据转换逻辑分散在各个页面
 * 3. 错误处理不统一
 * 4. 类型不安全
 *
 * 新版本优势：
 * 1. ✅ 所有字段都保证有值
 * 2. ✅ 数据转换集中在服务层
 * 3. ✅ 错误处理统一
 * 4. ✅ 完全类型安全
 * 5. ✅ 改数据库只需改服务层
 * 6. ✅ 新页面直接复用服务
 */
