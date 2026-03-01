"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import RoleGuard from "@/components/auth/RoleGuard";
import {
  ShieldExclamationIcon,
  UserMinusIcon,
  UserPlusIcon,
  NoSymbolIcon,
  DocumentMinusIcon,
  ArrowPathIcon,
  KeyIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Log {
  _id: string;
  action: string;
  performedBy: { _id: string; fullName: string; email: string } | null;
  targetUser?: { _id: string; fullName: string } | null;
  targetDocument?: { _id: string; title: string } | null;
  details?: string;
  createdAt: string;
}

interface LogsResponse {
  data: Log[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

const actionLabels: Record<string, { label: string; color: string; icon: typeof ShieldExclamationIcon }> = {
  BLOCK_USER: { label: "Block User", color: "bg-red-100 text-red-700", icon: NoSymbolIcon },
  UNBLOCK_USER: { label: "Unblock User", color: "bg-green-100 text-green-700", icon: ArrowPathIcon },
  BLOCK_DOCUMENT: { label: "Block tài liệu", color: "bg-orange-100 text-orange-700", icon: DocumentMinusIcon },
  UNBLOCK_DOCUMENT: { label: "Unblock tài liệu", color: "bg-teal-100 text-teal-700", icon: ArrowPathIcon },
  CHANGE_ROLE: { label: "Đổi quyền", color: "bg-blue-100 text-blue-700", icon: UserPlusIcon },
  DELETE_USER: { label: "Xóa User", color: "bg-red-100 text-red-700", icon: UserMinusIcon },
  DELETE_DOCUMENT: { label: "Xóa tài liệu", color: "bg-red-100 text-red-700", icon: DocumentMinusIcon },
  DELETE_OWN_DOCUMENT: { label: "Xóa tài liệu (chủ)", color: "bg-orange-100 text-orange-700", icon: TrashIcon },
  RESET_PASSWORD: { label: "Reset mật khẩu", color: "bg-yellow-100 text-yellow-700", icon: KeyIcon },
  DELEGATE_ADMIN: { label: "Ủy quyền Admin", color: "bg-purple-100 text-purple-700", icon: ShieldExclamationIcon },
};

function ManageLogsContent() {
  const [page, setPage] = useState(1);
  const [filterAction, setFilterAction] = useState("");

  const { data, isLoading } = useQuery<LogsResponse>({
    queryKey: ["adminLogs", page, filterAction],
    queryFn: async () => {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (filterAction) params.action = filterAction;
      const res = await api.get("/logs", { params });
      return res.data;
    },
  });

  const getActionInfo = (action: string) => {
    return actionLabels[action] || { label: action, color: "bg-gray-100 text-gray-700", icon: ShieldExclamationIcon };
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lịch sử hoạt động hệ thống</h3>
        <select
          value={filterAction}
          onChange={(e) => {
            setFilterAction(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          <option value="">Tất cả hành động</option>
          {Object.entries(actionLabels).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Đang tải logs...</div>
      ) : !data || data.data.length === 0 ? (
        <div className="text-center py-12">
          <ShieldExclamationIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có log nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((log) => {
              const info = getActionInfo(log.action);
              const Icon = info.icon;
              return (
                <div
                  key={log._id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${info.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${info.color}`}>
                        {info.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">
                      <span className="font-medium">{log.performedBy?.fullName || "Hệ thống"}</span>
                      {log.targetUser && (
                        <> {" \u2192 "} <span className="font-medium">{log.targetUser.fullName}</span></>
                      )}
                      {log.targetDocument && (
                        <> {" \u2192 "} <span className="font-medium italic">&quot;{log.targetDocument.title}&quot;</span></>
                      )}
                    </p>
                    {log.details && (
                      <p className="mt-0.5 text-xs text-gray-500">{log.details}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Trước
              </button>
              <span className="text-sm text-gray-500">
                Trang {page} / {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ManageLogs() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <ManageLogsContent />
    </RoleGuard>
  );
}
