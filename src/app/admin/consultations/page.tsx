"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Clock, User, X, Briefcase, Users, Tag } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  industry?: string;
  company?: string;
  position?: string;
  connectionType?: string;
  need?: string;
  hardcoreTags?: string[];
  resourceTags?: string[];
}

interface Consultation {
  id: string;
  userId: string;
  topic: string;
  status: "pending" | "processing" | "completed";
  createdAt: string;
  scheduledDate?: string;
  description?: string;
  user?: User;
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processing" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsultations();
  }, []);

  async function loadConsultations() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/consultations");
      const data = await res.json();
      if (data.success) {
        setConsultations(data.data || []);
      }
    } catch (error) {
      console.error("加载咨询失败:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusChange = async (consultationId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/consultations/${consultationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await loadConsultations();
        if (selectedConsultation && selectedConsultation.id === consultationId) {
          setSelectedConsultation({ ...selectedConsultation, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error("更新状态失败:", error);
    }
  };

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">咨询管理</h1>

          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="搜索用户姓名或话题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              全部
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
            >
              待处理
            </Button>
            <Button
              variant={statusFilter === "processing" ? "default" : "outline"}
              onClick={() => setStatusFilter("processing")}
            >
              进行中
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              onClick={() => setStatusFilter("completed")}
            >
              已完成
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 列表 */}
          <div className="lg:col-span-1 space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-400 py-10">加载中...</div>
            ) : filteredConsultations.length === 0 ? (
              <div className="text-center text-gray-400 py-10">暂无咨询记录</div>
            ) : (
              filteredConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  onClick={() => setSelectedConsultation(consultation)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedConsultation?.id === consultation.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {consultation.user?.avatar && (
                      <img
                        src={consultation.user.avatar}
                        alt={consultation.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{consultation.user?.name}</h3>
                        <Badge
                          variant={
                            consultation.status === "pending"
                              ? "secondary"
                              : consultation.status === "processing"
                              ? "default"
                              : "outline"
                          }
                        >
                          {consultation.status === "pending" && "待处理"}
                          {consultation.status === "processing" && "进行中"}
                          {consultation.status === "completed" && "已完成"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{consultation.topic}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(consultation.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 详情 */}
          <div className="lg:col-span-2">
            {selectedConsultation ? (
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    {selectedConsultation.user?.avatar && (
                      <img
                        src={selectedConsultation.user.avatar}
                        alt={selectedConsultation.user.name}
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedConsultation.user?.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedConsultation.user?.position} • {selectedConsultation.user?.company}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">
                          <User className="w-3 h-3 mr-1" />
                          {selectedConsultation.user?.industry}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <select
                    value={selectedConsultation.status}
                    onChange={(e) => handleStatusChange(selectedConsultation.id, e.target.value)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">咨询话题</h3>
                    <p className="text-sm text-gray-600">{selectedConsultation.topic}</p>
                  </div>

                  {selectedConsultation.description && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">描述</h3>
                      <p className="text-sm text-gray-600">{selectedConsultation.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">用户需求</h3>
                    <p className="text-sm text-gray-600">{selectedConsultation.user?.need}</p>
                  </div>

                  {selectedConsultation.user?.hardcoreTags && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">硬核技能</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedConsultation.user.hardcoreTags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedConsultation.user?.resourceTags && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">资源标签</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedConsultation.user.resourceTags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-6 text-center text-gray-400">
                选择左侧咨询记录查看详情
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
