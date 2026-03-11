/**
 * 服务层类型定义
 *
 * 这里定义前端需要的数据格式，确保：
 * 1. 所有可选字段都有明确的 null 标记
 * 2. 所有可能为空的字段都有默认值策略
 * 3. 字段名统一使用 camelCase
 */

// ============================================================
// 用户类型
// ============================================================

/**
 * 用户数据（前端格式）
 * 所有字段都经过服务层处理，确保不会有 undefined
 */
export interface User {
  id: string;
  name: string;              // 必有值（服务层提供默认值）
  email: string;             // 必有值
  avatar: string;            // 必有值（默认头像）
  age: number | null;        // 可为空
  company: string | null;    // 可为空
  position: string | null;   // 可为空
  phone: string | null;      // 可为空
  gender: string | null;     // 可为空
  companyScale: string | null; // 可为空
  tags: string[];            // 必有值（默认空数组）
  hardcoreTags: string[];    // 必有值（默认空数组）
  abilityTags: string[];     // 必有值（默认空数组）
  resourceTags: string[];    // 必有值（默认空数组）
  status: string;            // 必有值
  isFeatured: boolean;       // 必有值
  joinDate: Date;            // 必有值
  lastLogin: Date | null;    // 可为空
  createdAt: Date;           // 必有值
  updatedAt: Date | null;    // 可为空
}

// ============================================================
// 活动类型
// ============================================================

/**
 * 活动数据（前端格式）
 */
export interface Activity {
  id: string;
  title: string;
  subtitle: string;          // 必有值（默认空字符串）
  category: string;          // 必有值（默认"其他"）
  description: string;       // 必有值（默认空字符串）
  image: string;             // 必有值（默认图片）
  address: string;           // 必有值（默认空字符串）
  startDate: Date;           // 必有值
  endDate: Date;             // 必有值
  capacity: number;          // 必有值（默认0）
  teaFee: number;            // 必有值（默认0）
  status: string;            // 必有值
  createdBy: string;         // 必有值
  createdAt: Date;           // 必有值
  updatedAt: Date;           // 必有值
}

// ============================================================
// 宣告类型
// ============================================================

/**
 * 宣告数据（前端格式）
 */
export interface Declaration {
  id: string;
  userId: string;            // 必有值
  direction: string | null;  // 可为空
  text: string;              // 必有值
  summary: string | null;    // 可为空
  audioUrl: string | null;   // 可为空
  views: number;             // 必有值（默认0）
  date: Date;                // 必有值
  isFeatured: boolean;       // 必有值
  createdAt: Date;           // 必有值
  updatedAt: Date;           // 必有值
}

// ============================================================
// 设置类型
// ============================================================

/**
 * 设置数据（前端格式）
 */
export interface Settings {
  navigation: {
    discovery: { icon: string; label: string };
    ignition: { icon: string; label: string };
    profile: { icon: string; label: string };
  };
  pageTitles: {
    discovery: string;
    activities: string;
    visit: string;
    assets: string;
    declarations: string;
    connection: string;
    consultation: string;
  };
  discovery: {
    slogan: string;
    logo: string;
    music: string;
    bgImage: string;
  };
}

// ============================================================
// 分页查询参数
// ============================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}
