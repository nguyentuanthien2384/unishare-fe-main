import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { UserRole } from "@/@types/user.type";
import axios from "axios";

interface ApiErrorResponse {
  message?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

const useInvalidateAdminUsers = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
  };
};

interface UpdateRoleResponse {
  role: UserRole;
}

const updateUserRole = async ({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) => {
  const response = await api.patch<UpdateRoleResponse>(
    `/admin/users/${userId}/role`,
    { role },
  );
  return response.data;
};
export const useUpdateUserRole = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data) => {
      toast.success(`Đã cập nhật vai trò thành ${data.role}!`);
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Cập nhật thất bại")),
  });
};

const blockUser = async (userId: string) => {
  return api.post(`/admin/users/${userId}/block`);
};
export const useBlockUser = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success("Đã khóa người dùng!");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Khóa thất bại")),
  });
};

const unblockUser = async (userId: string) => {
  return api.post(`/admin/users/${userId}/unblock`);
};
export const useUnblockUser = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      toast.success("Đã mở khóa người dùng!");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Mở khóa thất bại")),
  });
};

interface ResetPasswordResponse {
  message: string;
  newPassword: string;
}

const resetPassword = async (userId: string): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(
    `/admin/users/${userId}/reset-password`,
  );
  return response.data;
};
export const useResetPassword = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(`${data.message}\nMật khẩu mới là: ${data.newPassword}`, {
        duration: 10000,
      });
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Reset thất bại")),
  });
};
