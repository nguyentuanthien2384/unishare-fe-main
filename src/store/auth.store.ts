import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/@types/user.type";
import { toast } from "react-hot-toast";

const DEFAULT_PASSWORD = "123456";

interface AuthState {
  user: User | null;
  token: string | null;
  password: string;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setUser: (user: User) => void;
  changePassword: (oldPassword: string, newPassword: string) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      token: null,
      password: DEFAULT_PASSWORD,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        const currentPassword = get().password;
        if (password !== currentPassword) {
          toast.error("Mật khẩu không đúng!");
          throw new Error("Mật khẩu không đúng");
        }

        const mockUser: User = {
          _id: "mock-user-001",
          email,
          fullName: "Nguyen Tuấn Thiền",
          role: "ADMIN",
          status: "ACTIVE",
          joinedDate: new Date().toISOString(),
          uploadsCount: 5,
          downloadsCount: 12,
        };
        const mockToken = "mock-token-abc123";
        set({ user: mockUser, token: mockToken, isAuthenticated: true });
        toast.success("Đăng nhập thành công!");
      },

      changePassword: (oldPassword, newPassword) => {
        const currentPassword = get().password;
        if (oldPassword !== currentPassword) {
          throw new Error("Mật khẩu cũ không đúng!");
        }
        set({ password: newPassword });
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
