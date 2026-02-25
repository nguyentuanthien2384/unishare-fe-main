"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  useUserProfile,
  useUserStats,
  useUserDocuments,
} from "@/hooks/useUserProfile";
import DocumentCard from "@/components/documents/DocumentCard";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { User } from "@/@types/user.type";

interface UserStats {
  totalUploads: number;
  totalDownloads: number;
  avgDownloadsPerDoc: number;
}

function UserProfileHeader({ user, stats }: { user: User; stats?: UserStats }) {
  const avatarSrc =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff`;

  return (
    <>
      <div className="p-8 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg shadow-lg text-white">
        <div className="flex items-center">
          <Image
            src={avatarSrc}
            alt={user.fullName}
            width={96}
            height={96}
            className="rounded-full object-cover border-4 border-white/50"
            unoptimized
          />
          <div className="ml-6">
            <h1 className="text-4xl font-bold">{user.fullName}</h1>
            <p className="text-lg opacity-90">{user.email}</p>
            <p className="mt-2 text-sm opacity-80">
              Joined: {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-6 mt-8">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
          <div className="text-sm text-gray-500 uppercase">Total Uploads</div>
          <div className="mt-2 text-3xl font-bold">
            {stats?.totalUploads ?? 0}
          </div>
        </div>
        <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
          <div className="text-sm text-gray-500 uppercase">Total Downloads</div>
          <div className="mt-2 text-3xl font-bold">
            {stats?.totalDownloads ?? 0}
          </div>
        </div>
        <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
          <div className="text-sm text-gray-500 uppercase">
            Avg Downloads/Doc
          </div>
          <div className="mt-2 text-3xl font-bold">
            {stats?.avgDownloadsPerDoc ?? 0}
          </div>
        </div>
      </div>
    </>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  // --- SỬA LỖI Ở ĐÂY ---
  // Lấy cả user và trạng thái _hasHydrated
  const loggedInUser = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  // --- KẾT THÚC SỬA ---

  const userId = params.userId as string;

  // --- SỬA LOGIC useEffect NÀY ---
  useEffect(() => {
    // Chỉ chạy logic khi Zustand đã khôi phục state xong
    if (hasHydrated) {
      if (userId === "me" || (loggedInUser && userId === loggedInUser._id)) {
        router.replace("/profile/me");
      }
    }
  }, [userId, loggedInUser, hasHydrated, router]); // Thêm hasHydrated
  // --- KẾT THÚC SỬA ---

  // Lấy dữ liệu profile công khai
  const { data: user, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { data: stats, isLoading: isLoadingStats } = useUserStats(userId);
  const { data: docData, isLoading: isLoadingDocs } = useUserDocuments(userId);

  // Nếu chưa khôi phục state, hiển thị loading (tránh bị render nội dung)
  if (!hasHydrated) {
    return <div className="p-8">Đang tải phiên...</div>;
  }

  // Nếu user tự truy cập, (useEffect) đang chuyển hướng
  if (userId === "me" || (loggedInUser && userId === loggedInUser._id)) {
    return <div className="p-8">Đang chuyển hướng...</div>;
  }

  // Render trang profile công khai
  if (isLoadingProfile || isLoadingStats) {
    return <div className="p-8">Đang tải hồ sơ...</div>;
  }

  if (!user) {
    return <div className="p-8">Không tìm thấy người dùng này.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. Header (Phiên bản chỉ xem) */}
      <UserProfileHeader user={user} stats={stats} />

      {/* 2. Danh sách tài liệu của user này */}
      <div className="mt-12 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Tài liệu của {user.fullName}</h2>
          <span className="font-semibold text-blue-600">
            {docData?.pagination.total || 0} documents
          </span>
        </div>

        <div>
          {isLoadingDocs && <p className="p-6">Đang tải tài liệu...</p>}
          {docData && docData.data.length > 0 ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {docData.data.map((doc) => (
                // Dùng lại DocumentCard (nó đã có link)
                <DocumentCard key={doc._id} doc={doc} viewMode="grid" />
              ))}
            </div>
          ) : (
            !isLoadingDocs && (
              <p className="p-6">Người dùng này chưa đăng tải tài liệu nào.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
