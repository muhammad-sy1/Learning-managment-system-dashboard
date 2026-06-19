

import { queryClient } from "@/lib/react-query/queryClient";
import { navigateTo } from "@/lib/router";
import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthStore {
  user: IUser | null;
  login: (data: ILoginResponse) => void;
  setUser: (user: IUser) => void;
  isLoggedInRoute: boolean;
  logout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const useAuth = create<IAuthStore>()(
  persist(
    (set) => ({
      hasHydrated: false,
      isLoggedInRoute: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      user: null,
      login: (loginData) => {
        Cookies.set("token", loginData.token, { expires: 365 });
        set({
          user: loginData.user,
          isLoggedInRoute: true, 
        });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        Cookies.remove("token");
        queryClient.clear();
        const currentUrl = window.location.pathname + window.location.search;
        navigateTo(`/login?next=${encodeURIComponent(currentUrl)}`);
        set({ user: null, isLoggedInRoute: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== "isLoggedInRoute")
        ),
      onRehydrateStorage: () => (state) => {
        const token = Cookies.get("token");
        if (!token) {
          state?.logout();
        }
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuth;
