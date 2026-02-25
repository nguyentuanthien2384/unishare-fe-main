"use client";
import { useState } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import ManageSubjects from "./components/ManagerSubjects";
import ManageMajors from "./components/ManagerMajors";
import ManageUsers from "./components/ManagerUsers";
import ManageDocuments from "./components/ManagerDocuments";
import { useAuthStore } from "@/store/auth.store";

type TabType = "subjects" | "majors" | "users" | "documents";

export default function ManagePage() {
  const [tab, setTab] = useState<TabType>("subjects");

  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const baseTabs = [
    { key: "subjects", label: "Quản lý Môn học" },
    { key: "majors", label: "Quản lý Ngành học" },
    { key: "documents", label: "Quản lý Tài liệu" },
  ] as const;

  const tabs = isAdmin
    ? [...baseTabs, { key: "users", label: "Quản lý Users" }]
    : baseTabs;

  return (
    <RoleGuard allowedRoles={["ADMIN", "MODERATOR"]}>
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Quản lý Hệ thống</h1>

        {/* Thanh Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex gap-6">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  tab === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Nội dung Tab */}
        <div>
          {tab === "subjects" && <ManageSubjects />}
          {tab === "majors" && <ManageMajors />}
          {tab === "documents" && <ManageDocuments />}
          {tab === "users" && isAdmin && <ManageUsers />}
        </div>
      </div>
    </RoleGuard>
  );
}
