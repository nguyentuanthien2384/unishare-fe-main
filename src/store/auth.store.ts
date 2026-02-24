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

      // TODO: Bỏ mock này khi có backend thật
      login: async (email, _password) => {
        const mockUser: User = {
          _id: "mock-user-001",
          email,
          fullName: "Nguyen Van Test",
          role: "USER",
          status: "ACTIVE",
          joinedDate: new Date().toISOString(),
          uploadsCount: 5,
          downloadsCount: 12,
        };
        const mockToken = "mock-token-abc123";
        set({ user: mockUser, token: mockToken, isAuthenticated: true });
        toast.success("Đăng nhập thành công! (mock)");
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
