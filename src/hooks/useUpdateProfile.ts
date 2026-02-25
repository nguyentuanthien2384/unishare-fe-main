import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { UpdateProfileDto, ChangePasswordDto } from "@/@types/user.type";
import { useAuthStore } from "@/store/auth.store";
import { User } from "@/@types/user.type";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (data: UpdateProfileDto): Promise<User> => {
      if (!currentUser) throw new Error("Chưa đăng nhập");
      return { ...currentUser, ...data };
    },
    onSuccess: (updatedUser) => {
      toast.success("Cập nhật thông tin thành công!");
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Cập nhật thất bại"),
  });
};

export const useChangePassword = () => {
  const changePassword = useAuthStore((state) => state.changePassword);

  return useMutation({
    mutationFn: async (data: ChangePasswordDto): Promise<void> => {
      changePassword(data.oldPassword, data.newPassword);
    },
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Đổi mật khẩu thất bại"),
  });
};
