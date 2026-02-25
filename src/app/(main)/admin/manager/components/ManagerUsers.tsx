// src/app/admin/manage/components/ManageUsers.tsx
"use client";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminUsers } from "@/hooks/useAdminData";
import {
  useUpdateUserRole,
  useBlockUser,
  useUnblockUser,
  useResetPassword,
} from "@/hooks/useAdminMutateUser";
import { User } from "@/@types/user.type";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import RoleGuard from "@/components/auth/RoleGuard";

function ManageUsersContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch users
  const { data: usersData, isLoading } = useAdminUsers(debouncedSearchTerm);

  // Mutations
  const roleMutation = useUpdateUserRole();
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();
  const resetPassMutation = useResetPassword();

  // Modal state
  const [modalState, setModalState] = useState<{
    action: "block" | "unblock";
    user: User;
  } | null>(null);

  // ✅ Handle Reset Password
  const handleResetPassword = (user: User) => {
    if (window.confirm(`Reset mật khẩu cho ${user.email}?`)) {
      resetPassMutation.mutate(user._id);
    }
  };

  // ✅ Handle Confirm Action (Block/Unblock)
  const handleConfirmAction = () => {
    if (!modalState) return;
    const { action, user } = modalState;

    if (action === "block") {
      blockMutation.mutate(user._id);
    } else if (action === "unblock") {
      unblockMutation.mutate(user._id);
    }

    setModalState(null);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Tìm kiếm người dùng</h3>
      <input
        type="text"
        placeholder="Tìm user theo tên hoặc email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
      />

      {/* Bảng hiển thị user */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên / Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            )}
            {!isLoading && usersData?.data.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Không tìm thấy user nào
                </td>
              </tr>
            )}
            {usersData?.data.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-800"
                        : user.role === "MODERATOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.status === "ACTIVE" ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Blocked
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {/* Nút Thăng/Giáng cấp */}
                    {user.role === "USER" && (
                      <button
                        onClick={() =>
                          roleMutation.mutate({
                            userId: user._id,
                            role: "MODERATOR",
                          })
                        }
                        className="text-blue-600 hover:text-blue-900 hover:underline"
                      >
                        Thăng cấp
                      </button>
                    )}
                    {user.role === "MODERATOR" && (
                      <button
                        onClick={() =>
                          roleMutation.mutate({
                            userId: user._id,
                            role: "USER",
                          })
                        }
                        className="text-yellow-600 hover:text-yellow-900 hover:underline"
                      >
                        Giáng cấp
                      </button>
                    )}

                    {/* Nút Block/Unblock */}
                    {user.status === "ACTIVE" ? (
                      <button
                        onClick={() => setModalState({ action: "block", user })}
                        className="text-red-600 hover:text-red-900 hover:underline"
                      >
                        Khóa
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setModalState({ action: "unblock", user })
                        }
                        className="text-green-600 hover:text-green-900 hover:underline"
                      >
                        Mở khóa
                      </button>
                    )}

                    {/* Nút Reset Password */}
                    <button
                      onClick={() => handleResetPassword(user)}
                      className="text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      Reset Pass
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận Block/Unblock */}
      <DeleteConfirmModal
        isOpen={!!modalState}
        onClose={() => setModalState(null)}
        onConfirm={handleConfirmAction}
        title={`Xác nhận ${modalState?.action === "block" ? "Khóa" : "Mở khóa"} User`}
        message={`Bạn có chắc muốn ${
          modalState?.action === "block" ? "khóa" : "mở khóa"
        } người dùng "${modalState?.user.email}"?`}
      />
    </div>
  );
}

export default function ManageUsersProtected() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <ManageUsersContent />
    </RoleGuard>
  );
}
