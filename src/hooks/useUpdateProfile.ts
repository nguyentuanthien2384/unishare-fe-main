import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { UpdateProfileDto } from "@/@types/user.type";
import { ChangePasswordDto } from "@/@types/user.type";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

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
  const response = await api.patch("/users/me/profile", data);
  return response.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      toast.success("Cập nhật thông tin thành công!");
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Cập nhật thất bại")),
  });
};

const changePassword = async (data: ChangePasswordDto) => {
  const response = await api.post("/users/me/change-password", data);
  return response.data;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Đổi mật khẩu thất bại")),
  });
};
