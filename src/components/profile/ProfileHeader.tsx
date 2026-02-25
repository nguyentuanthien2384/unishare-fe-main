"use client";
import Image from "next/image";
import { User } from "@/@types/user.type";
import { useMyStats } from "@/hooks/useMyStats";
import { CldUploadWidget } from "next-cloudinary";
import { useUpdateProfile } from "@/hooks/useUserMutations";
import { PencilIcon } from "@heroicons/react/24/outline";

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="flex-1 bg-white rounded-lg shadow p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-blue-600 mt-1">{value}</p>
    </div>
  );
}

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
  onChangePassClick: () => void;
}

export default function ProfileHeader({
  user,
  onEditClick,
  onChangePassClick,
}: ProfileHeaderProps) {
  const { data: stats } = useMyStats();
  const updateAvatarMutation = useUpdateProfile();

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  const avatarSrc =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff`;

  return (
    <>
      <div className="p-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg text-white relative">
        <div className="flex items-center">
          <div className="relative group">
            <Image
              src={avatarSrc}
              alt={user.fullName}
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-white/50"
              unoptimized
            />

            {/* Nút Upload ẩn (hiện khi hover) */}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                multiple: false,
                cropping: true,
                croppingAspectRatio: 1,
              }}
              onSuccess={(result) => {
                if (
                  typeof result.info === "object" &&
                  result.info?.secure_url
                ) {
                  updateAvatarMutation.mutate({
                    avatarUrl: result.info.secure_url,
                  });
                }
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <PencilIcon className="w-8 h-8 text-white" />
                </button>
              )}
            </CldUploadWidget>
          </div>

          <div className="ml-6">
            <h1 className="text-4xl font-bold">{user.fullName}</h1>
            <p className="text-lg opacity-90">{user.email}</p>
            <p className="mt-2 text-sm opacity-80">
              Joined: {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>

          {/* Nút Edit/Change Pass */}
          <div className="ml-auto flex gap-3">
            <button
              onClick={onEditClick}
              className="px-4 py-2 bg-white/30 rounded-full text-white font-semibold text-sm hover:bg-white/50 transition"
            >
              Sửa hồ sơ
            </button>
            <button
              onClick={onChangePassClick}
              className="px-4 py-2 bg-white/30 rounded-full text-white font-semibold text-sm hover:bg-white/50 transition"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Thẻ Stats (giữ nguyên) */}
      <div className="flex gap-6 mt-8">
        <StatCard title="Total Uploads" value={stats?.totalUploads ?? 0} />
        <StatCard title="Total Downloads" value={stats?.totalDownloads ?? 0} />
        <StatCard
          title="Avg Downloads/Doc"
          value={stats?.avgDownloadsPerDoc ?? 0}
        />
      </div>
    </>
  );
}
