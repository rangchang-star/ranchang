"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, MapPin, Calendar, Users, Star, Plus, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Visitor {
  id: string;
  name: string;
  avatar?: string;
  abilityTags?: string[];
}

interface Visit {
  id: string;
  date: string;
  time: string;
  status: string;
  target: {
    name: string;
    title: string;
    company: string;
    avatar?: string;
  };
  purpose: string;
  location: string;
  participants: number;
  outcome: string;
  keyPoints?: string[];
  nextSteps?: string[];
  rating: number;
  notes: string;
  images?: string[];
  tags: string[];
  visitors: Visitor[];
  createdAt: string;
}

export default function AdminVisitEditPage() {
  const router = useRouter();
  const params = useParams();
  const visitId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [visit, setVisit] = useState<Visit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableMembers, setAvailableMembers] = useState<Visitor[]>([]);

  // 表单状态
  const [visitDate, setVisitDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("");
  const [targetName, setTargetName] = useState("");
  const [targetTitle, setTargetTitle] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [purpose, setPurpose] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState(5);
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 加载探访详情
        const visitRes = await fetch(`/api/admin/visits/${visitId}`);
        const visitData = await visitRes.json();
        if (visitData.success && visitData.data) {
          const visit = visitData.data;
          setVisit(visit);
          setVisitDate(visit.date || "");
          setStartTime(visit.time?.split("-")[0] || "");
          setEndTime(visit.time?.split("-")[1] || "");
          setStatus(visit.status || "");
          setTargetName(visit.target?.name || "");
          setTargetTitle(visit.target?.title || "");
          setTargetCompany(visit.target?.company || "");
          setPurpose(visit.purpose || "");
          setLocation(visit.location || "");
          setParticipants(visit.participants?.toString() || "");
          setOutcome(visit.outcome || "");
          setNotes(visit.notes || "");
          setSelectedTags(visit.tags || []);
          setRating(visit.rating || 5);
          setSelectedVisitors(visit.visitors?.map((v: Visitor) => v.id) || []);
        }

        // 加载可选成员
        const membersRes = await fetch("/api/admin/members");
        const membersData = await membersRes.json();
        if (membersData.success) {
          setAvailableMembers(membersData.data || []);
        }
      } catch (error) {
        console.error("加载数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [visitId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/visits/${visitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: visitDate,
          time: `${startTime}-${endTime}`,
          status,
          target: {
            name: targetName,
            title: targetTitle,
            company: targetCompany,
          },
          purpose,
          location,
          participants: parseInt(participants),
          outcome,
          notes,
          tags: selectedTags,
          rating,
          visitors: selectedVisitors,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("保存成功");
        router.push(`/admin/visits/${visitId}`);
      } else {
        alert("保存失败: " + (data.message || "未知错误"));
      }
    } catch (error) {
      console.error("保存失败:", error);
      alert("保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleVisitor = (visitorId: string) => {
    if (selectedVisitors.includes(visitorId)) {
      setSelectedVisitors(selectedVisitors.filter((id) => id !== visitorId));
    } else {
      setSelectedVisitors([...selectedVisitors, visitorId]);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-gray-400 py-10">加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!visit) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-gray-400 py-10">加载失败</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/admin/visits/${visitId}`}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">编辑探访</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "保存中..." : "保存"}
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* 基本信息 */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  探访日期
                </label>
                <Input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始时间
                  </label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束时间
                  </label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="pending">待开始</option>
                  <option value="processing">进行中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  参与人数
                </label>
                <Input
                  type="number"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 探访对象 */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">探访对象</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <Input
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  职位
                </label>
                <Input
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公司
                </label>
                <Input
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 探访详情 */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">探访详情</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  探访目的
                </label>
                <Input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  地点
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  探访成果
                </label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* 评分 */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">评分</h2>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* 标签 */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">标签</h2>
            <div className="flex flex-wrap gap-2">
              {["已结束", "进行中", "AI", "智能制造", "金融投资", "数字化转型", "工业互联网"].map(
                (tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    onClick={() => toggleTag(tag)}
                    className="cursor-pointer"
                  >
                    {tag}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* 访客选择 */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">访客</h2>
            <div className="grid grid-cols-2 gap-3">
              {availableMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => toggleVisitor(member.id)}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedVisitors.includes(member.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {member.avatar && (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{member.name}</div>
                      {member.abilityTags && (
                        <div className="text-xs text-gray-500">
                          {member.abilityTags.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
