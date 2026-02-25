"use client";
import { useState } from "react"; // <-- Import useState
import RoleGuard from "@/components/auth/RoleGuard";
import UploadsOverTimeChart from "@/components/statistics/UploadsOverTimeChart";
import { usePlatformStats } from "@/hooks/usePlatformStats";

// Component thẻ stat nhỏ (giữ nguyên)
function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
      <div className="text-sm text-gray-500 uppercase">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

function StatisticsPageContent() {
  const { data: stats, isLoading } = usePlatformStats();
  // --- THÊM STATE MỚI ---
  const [days, setDays] = useState(30); // Mặc định là 30 ngày
  // --- KẾT THÚC ---

  if (isLoading) return <p>Đang tải thống kê...</p>;
  if (!stats) return <p>Không có dữ liệu.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Statistics</h1>
      <p className="mt-1 text-gray-600">Platform analytics and insights</p>

      {/* 4 Thẻ Stats (giữ nguyên) */}
      <div className="flex gap-6 mt-8">
        <StatCard title="Total Uploads" value={stats.totalUploads} />
        <StatCard title="Total Downloads" value={stats.totalDownloads} />
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Avg DL/Doc" value={stats.avgDlPerDoc} />
      </div>

      {/* Biểu đồ */}
      <div className="mt-10 p-6 bg-white rounded-lg shadow-lg">
        {/* --- THÊM CÁC NÚT LỌC --- */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Uploads Over Time</h2>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  days === d
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
        {/* --- KẾT THÚC --- */}
        <div className="mt-4">
          {/* Truyền 'days' vào component biểu đồ */}
          <UploadsOverTimeChart days={days} />
        </div>
      </div>
    </div>
  );
}

// Bọc trang bằng RoleGuard (giữ nguyên)
export default function StatisticsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MODERATOR"]}>
      <StatisticsPageContent />
    </RoleGuard>
  );
}
