import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { User } from "@/@types/user.type";
import { toast } from "react-hot-toast";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setUser: (user: User) => void; // ✅ thêm dòng này
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),

      // ✅ thêm setUser
      setUser: (user) => set({ user }),

      login: async (email, password) => {
        try {
          const response = await api.post("/auth/login", { email, password });
          const { user, accessToken } = response.data;
          set({ user, token: accessToken, isAuthenticated: true });
          toast.success("Đăng nhập thành công!");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Email hoặc mật khẩu không đúng",
          );
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success("Đã đăng xuất");
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);
