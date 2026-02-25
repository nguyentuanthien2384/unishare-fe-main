import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { User } from "@/@types/user.type";

export interface UpdateProfileDto {
  fullName?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (data: UpdateProfileDto): Promise<User> => {
      if (!currentUser) throw new Error("Chưa đăng nhập");
      const updatedUser: User = { ...currentUser, ...data };
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      toast.success("Cập nhật hồ sơ thành công!");
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (err: Error) => toast.error(err.message || "Lỗi cập nhật."),
  });
};

export const useChangePassword = () => {
  const changePassword = useAuthStore((s) => s.changePassword);

  return useMutation({
    mutationFn: async (data: ChangePasswordDto): Promise<void> => {
      changePassword(data.oldPassword, data.newPassword);
    },
    onSuccess: () => toast.success("Đổi mật khẩu thành công!"),
    onError: (err: Error) =>
      toast.error(err.message || "Lỗi đổi mật khẩu."),
  });
};
