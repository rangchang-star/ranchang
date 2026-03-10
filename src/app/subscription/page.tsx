"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Play,
  PlayCircle,
  Heart,
  Mic,
  Users,
  X,
  PauseCircle,
} from "lucide-react";

interface DigitalAsset {
  id: string;
  title: string;
  description: string;
  type: string;
  size: string;
  createTime: string;
  likes: number;
  cover?: string;
}

interface Salon {
  id: string;
  period: string;
  introduction: string;
  duration: string;
  limit: string;
  digitalAssets: DigitalAsset[];
}

interface PageSettings {
  tabDescriptions: {
    training: string;
    consultation: string;
  };
  mediaConfig: {
    visit: {
      type: "image" | "video" | null;
      url: string;
    };
    aiCircle: {
      type: "image" | "video" | null;
      url: string;
    };
  };
}

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState<"training" | "consultation">("training");

  const [pageSettings, setPageSettings] = useState<PageSettings>({
    tabDescriptions: {
      training: "每次探访都是商业思维的激烈碰撞，更是一场关于财务收入与使命践行的重新审视....",
      consultation: "AI加油圈，为期一年的AI环境高效浸泡池，每周一聚，要求全员产出AI数字资产",
    },
    mediaConfig: {
      visit: {
        type: null,
        url: "",
      },
      aiCircle: {
        type: null,
        url: "",
      },
    },
  });

  const [salon, setSalon] = useState<Salon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 加载页面设置
        const settingsRes = await fetch("/api/settings/subscription");
        const settingsData = await settingsRes.json();
        if (settingsData.success) {
          setPageSettings(settingsData.data || pageSettings);
        }

        // 加载沙龙信息
        const salonRes = await fetch("/api/salon");
        const salonData = await salonRes.json();
        if (salonData.success) {
          setSalon(salonData.data);
        }
      } catch (error) {
        console.error("加载数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">订阅服务</h1>
        </div>

        {/* 内容区域 */}
        <div className="px-5 py-4">
          {isLoading ? (
            <div className="text-center py-10 text-gray-400">加载中...</div>
          ) : (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger
                  value="training"
                  className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white`}
                >
                  培训
                </TabsTrigger>
                <TabsTrigger
                  value="consultation"
                  className={`data-[state=active]:bg-blue-500 data-[state=active]:text-white`}
                >
                  咨询
                </TabsTrigger>
              </TabsList>

              <TabsContent value="training" className="mt-4">
                <div className="text-sm text-gray-600 mb-4">
                  {pageSettings.tabDescriptions.training}
                </div>

                {pageSettings.mediaConfig.visit.type === "image" && (
                  <img
                    src={pageSettings.mediaConfig.visit.url}
                    alt="探访培训"
                    className="w-full rounded-lg mb-4"
                  />
                )}

                {pageSettings.mediaConfig.visit.type === "video" && (
                  <video
                    src={pageSettings.mediaConfig.visit.url}
                    controls
                    className="w-full rounded-lg mb-4"
                  />
                )}

                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  立即预约
                </Button>
              </TabsContent>

              <TabsContent value="consultation" className="mt-4">
                <div className="text-sm text-gray-600 mb-4">
                  {pageSettings.tabDescriptions.consultation}
                </div>

                {pageSettings.mediaConfig.aiCircle.type === "image" && (
                  <img
                    src={pageSettings.mediaConfig.aiCircle.url}
                    alt="AI圈"
                    className="w-full rounded-lg mb-4"
                  />
                )}

                {pageSettings.mediaConfig.aiCircle.type === "video" && (
                  <video
                    src={pageSettings.mediaConfig.aiCircle.url}
                    controls
                    className="w-full rounded-lg mb-4"
                  />
                )}

                {salon && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{salon.period}</h3>
                      <Badge variant="secondary">{salon.limit}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{salon.introduction}</p>
                    <div className="text-sm text-gray-500 mb-4">
                      时长: {salon.duration}
                    </div>

                    {salon.digitalAssets && salon.digitalAssets.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          数字资产
                        </h4>
                        <div className="space-y-2">
                          {salon.digitalAssets.map((asset) => (
                            <div
                              key={asset.id}
                              className="bg-white rounded-lg p-3 flex items-start space-x-3"
                            >
                              {asset.cover && (
                                <img
                                  src={asset.cover}
                                  alt={asset.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-900">
                                  {asset.title}
                                </h5>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {asset.description}
                                </p>
                                <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                  <span>{asset.type}</span>
                                  <span>•</span>
                                  <span>{asset.size}</span>
                                  <span>•</span>
                                  <span>{asset.createTime}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs">{asset.likes}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="w-full bg-blue-500 hover:bg-blue-600 mt-4">
                      加入沙龙
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* 底部导航 */}
        <BottomNav />
      </div>
    </div>
  );
}
