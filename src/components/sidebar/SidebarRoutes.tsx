// import { ROUTE_PERMISSIONS_MAP } from "@/lib/constants";
import useAuth from "@/modules/auth/store/authStore";
import {
  // Activity,
  BookOpen,
  Folder,
  // FolderOpen,
  // Headphones,
  Home,
  // Images,
  // InfoIcon,
  // Layers,
  // MapPin,
  // MessageSquare,
  // Package,
  // Paperclip,
  // Settings,
  Shield,
  Signal,
  // Star,
  Store,
  // Tag,
  User,
  Users,
  WalletCards,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { MenuItem } from "./app-sidebar";
// import { usePermissionStore } from "@/hooks/usePermissionStore";

// src/routes/sidebarRoutes.ts
export function SidebarRoutes(): MenuItem[] {
  const t = useTranslations("Sidebar");
  // const hasPermission = usePermissionStore((state) => state.hasPermission);
  const user = useAuth((state) => state?.user);
  // const isSuperAdmin =
  // console.log("user?.is_instructor", user?.is_instructor);

  const routes: MenuItem[] = [
    // Home
    {
      href: "/dashboard",
      label: t("navigation.home"),
      icon: Home,
    },
    ...(!user?.is_instructor
      ? [
          {
            href: "/dashboard/analytics",
            label: t("navigation.analytics"),
            icon: Signal,
          },
        ]
      : []),
    {
      href: "/dashboard/courses",
      label: t("navigation.courses"),
      icon: BookOpen,
    },
    {
      href: "/dashboard/payout-requests",
      label: t("navigation.payoutRequests"),
      icon: WalletCards,
    },
    {
      href: "/dashboard/categories",
      label: t("navigation.categories"),
      icon: Folder,
    },

    // Users
    ...(!user?.is_instructor
      ? [
          {
            label: t("navigation.users"),
            icon: Users,
            menuType: "users",
            children: [
              {
                id: "instructors",
                href: "/dashboard/users",
                label: t("navigation.instructors"),
                icon: Store,
                searchParams: {
                  is_instructor: "1",
                  role: "STUDENT",
                  page: "1",
                },
              },
              {
                id: "admins",
                href: "/dashboard/users",
                label: t("navigation.admins"),
                icon: Shield,
                searchParams: { role: "ADMIN", page: "1" },
              },
              {
                id: "students",
                href: "/dashboard/users",
                label: t("navigation.students"),
                icon: User,
                searchParams: { role: "STUDENT", page: "1" },
              },
            ],
          },
        ]
      : [
          {
            id: "students",
            href: "/dashboard/instructor-students",
            label: t("navigation.students"),
            icon: User,
            searchParams: { role: "STUDENT", page: "1" },
          },
        ]),
    // {
    //   href: "/dashboard/settings",
    //   label: t("navigation.settings"),
    //   icon: Settings,
    // },
  ];

  return routes;

  // const filterRoutes = (items: MenuItem[]): MenuItem[] => {
  //   return items
  //     .map((item) => {
  //       const key = item.id || item.menuType || item.href?.split("?")[0] || "";
  //       const perms = ROUTE_PERMISSIONS_MAP[key] || [];

  //       if (item.children) {
  //         const filteredChildren = filterRoutes(item.children);
  //         if (filteredChildren.length === 0) {
  //           return null;
  //         }
  //         return { ...item, children: filteredChildren };
  //       }

  //       const hasAccess =
  //         perms.length === 0 || perms.some((perm) => hasPermission(perm));

  //       // console.log(
  //       //   `Item: ${item.label}, Key: ${key}, Perms: ${perms}, Has Access: ${hasAccess}`
  //       // );

  //       return hasAccess ? item : null;
  //     })
  //     .filter(Boolean) as MenuItem[];
  // };

  // return filterRoutes(routes);
}
