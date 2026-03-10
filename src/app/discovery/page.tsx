"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Flame,
  Play,
  User,
  Users,
  Timer,
  Music2,
  X,
  ArrowLeft,
  ArrowRight,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";

interface Skill {
  id: string;
  name: string;
  size: number;
  color: string;
  borderColor: string;
  textColor: string;
  x: number;
  y: number;
}

export default function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState<"activity" | "declaration" | "skill">("activity");
  const [activities, setActivities] = useState<any[]>([]);
  const [declarations, setDeclarations] = useState<any[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 加载活动
        const activitiesRes = await fetch("/api/activities");
        const activitiesData = await activitiesRes.json();
        if (activitiesData.success) {
          setActivities(activitiesData.data || []);
        }

        // 加载宣告
        const declarationsRes = await fetch("/api/declarations");
        const declarationsData = await declarationsRes.json();
        if (declarationsData.success) {
          setDeclarations(declarationsData.data || []);
        }

        // 加载技能树
        const skillsRes = await fetch("/api/skills");
        const skillsData = await skillsRes.json();
        if (skillsData.success) {
          setSkills(skillsData.data || []);
        }
      } catch (error) {
        console.error("加载数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredActivities = activities.filter((activity) =>
    activity.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeclarations = declarations.filter((declaration) =>
    declaration.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Link href="/profile">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">发现</h1>
          </div>

          {/* 搜索框 */}
          <div className="mt-3 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索活动、宣告、技能..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tab 切换 */}
          <div className="flex mt-4 space-x-2">
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "activity"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              活动
            </button>
            <button
              onClick={() => setActiveTab("declaration")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "declaration"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              宣告
            </button>
            <button
              onClick={() => setActiveTab("skill")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "skill"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              技能树
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="px-5 py-4">
          {isLoading ? (
            <div className="text-center py-10 text-gray-400">加载中...</div>
          ) : activeTab === "activity" ? (
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  暂无活动
                </div>
              ) : (
                filteredActivities.map((activity: any) => (
                  <Link
                    key={activity.id}
                    href={`/activity/${activity.id}`}
                    className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description?.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            {activity.capacity}人
                          </span>
                          <span className="flex items-center space-x-1">
                            <Timer className="w-3 h-3" />
                            {activity.start_date
                              ? new Date(activity.start_date).toLocaleDateString("zh-CN")
                              : ""}
                          </span>
                        </div>
                      </div>
                      {activity.image && (
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : activeTab === "declaration" ? (
            <div className="space-y-4">
              {filteredDeclarations.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  暂无宣告
                </div>
              ) : (
                filteredDeclarations.map((declaration: any) => (
                  <Link
                    key={declaration.id}
                    href={`/declaration/${declaration.id}`}
                    className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                          src={declaration.user?.avatar || ""}
                          alt={declaration.user?.name}
                        />
                        <AvatarFallback>
                          {declaration.user?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {declaration.text?.substring(0, 50)}...
                        </p>
                        <p className="text-sm text-gray-600">
                          {declaration.summary?.substring(0, 80)}...
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Play className="w-3 h-3" />
                            {declaration.views || 0}
                          </span>
                          <span className="flex items-center space-x-1">
                            <Flame className="w-3 h-3" />
                            热度
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            // 技能树
            <div className="relative h-[500px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden">
              {skills.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  暂无技能数据
                </div>
              ) : (
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`absolute rounded-full flex items-center justify-center ${skill.color} ${skill.borderColor} border-2 ${skill.textColor} text-sm font-medium cursor-pointer hover:scale-110 transition-transform`}
                    style={{
                      width: skill.size,
                      height: skill.size,
                      left: `${skill.x}%`,
                      top: `${skill.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {skill.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 底部导航 */}
        <BottomNav />
      </div>
    </div>
  );
}
