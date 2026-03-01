import { toast } from "react-hot-toast";
import { useAdminStore } from "@/store/admin.store";
import { UserRole } from "@/@types/user.type";
import { useCallback } from "react";

export const useUpdateUserRole = () => {
  const updateRole = useAdminStore((s) => s.updateUserRole);
  const mutate = useCallback(
    ({ userId, role }: { userId: string; role: UserRole }) => {
      updateRole(userId, role);
      toast.success(`Đã cập nhật vai trò thành ${role}!`);
    },
    [updateRole],
  );
  return { mutate, isPending: false };
};

export const useBlockUser = () => {
  const block = useAdminStore((s) => s.blockUser);
  const mutate = useCallback(
    (userId: string) => {
      block(userId);
      toast.success("Đã khóa người dùng!");
    },
    [block],
  );
  return { mutate, isPending: false };
};

export const useUnblockUser = () => {
  const unblock = useAdminStore((s) => s.unblockUser);
  const mutate = useCallback(
    (userId: string) => {
      unblock(userId);
      toast.success("Đã mở khóa người dùng!");
    },
    [unblock],
  );
  return { mutate, isPending: false };
};

export const useResetPassword = () => {
  const resetPass = useAdminStore((s) => s.resetPassword);
  const mutate = useCallback(
    async (userId: string) => {
      const result = await resetPass(userId);
      toast.success(`${result.message}\nMật khẩu mới là: ${result.newPassword}`, {
        duration: 10000,
      });
    },
    [resetPass],
  );
  return { mutate, isPending: false };
};
