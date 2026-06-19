// import { create } from "zustand";
// import Cookies from "js-cookie";
// import { persist } from "zustand/middleware";
// import { queryClient } from "@/lib/react-query/queryClient";
// import { navigateTo } from "@/lib/router";
// interface IAuthStore {
//   user: IUser | null;
//   login: (data: ILoginResponse) => void;
//   setUser: (user: IUser) => void;
//   logout: () => void;
//   hasHydrated: boolean;
//   setHasHydrated: (state: boolean) => void;
// }

// const useAuth = create<IAuthStore>()(
//   persist(
//     (set) => ({
//       hasHydrated: false,
//       setHasHydrated: (state) => set({ hasHydrated: state }),
//       user: null,
//       login: (loginData) => {
//         Cookies.set("token", loginData.token);
//         set({ user: loginData.user });
//       },
//       setUser: (user) => set({ user }),
//       logout: () => {
//         Cookies.remove("token");
//         queryClient.clear();
//         const currentUrl = window.location.pathname + window.location.search;
//         navigateTo(`/login?next=${encodeURIComponent(currentUrl)}`);
//         set({ user: null });
//       },
//     }),
//     {
//       name: "auth-storage",
//       onRehydrateStorage: () => (state) => {
//         const token = Cookies.get("token");
//         if (!token) {
//           state?.logout();
//         }
//         state?.setHasHydrated(true);
//       },
//     }
//   )
// );

// export default useAuth;
