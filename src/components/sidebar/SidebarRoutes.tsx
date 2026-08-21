import useAuth from "@/modules/auth/store/authStore";
import {
  BookOpen,
  Folder,
  Home,
  Shield,
  Store,
  User,
  Users,
  WalletCards,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { MenuItem } from "./app-sidebar";
export function SidebarRoutes(): MenuItem[] {
  const t = useTranslations("Sidebar");
  const user = useAuth((state) => state?.user);

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
            href: "/dashboard/categories",
            label: t("navigation.categories"),
            icon: Folder,
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
  ];

  return routes;

}
