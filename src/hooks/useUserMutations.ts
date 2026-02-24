import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export interface UpdateProfileDto {
  fullName?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

interface ApiErrorResponse {
  message?: string;
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }
  return fallbackMessage;
};

const updateProfile = async (data: UpdateProfileDto) => {
  const res = await api.patch("/users/me/profile", data);
  return res.data;
};

const changePassword = async (data: ChangePasswordDto) => {
  const res = await api.post("/users/me/change-password", data);
  return res.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      toast.success("Cập nhật hồ sơ thành công!");
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Lỗi cập nhật.")),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => toast.success("Đổi mật khẩu thành công!"),
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Lỗi đổi mật khẩu.")),
  });
};
