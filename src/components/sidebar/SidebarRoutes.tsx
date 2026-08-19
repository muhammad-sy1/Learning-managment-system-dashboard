import { ROUTE_PERMISSIONS_MAP } from "@/lib/constants";
// import useAuth from "@/modules/auth/store/authStore";
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
  Settings,
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
import { usePermissionStore } from "@/hooks/usePermissionStore";

// src/routes/sidebarRoutes.ts
export function SidebarRoutes(): MenuItem[] {
  const t = useTranslations("Sidebar");
  const hasPermission = usePermissionStore((state) => state.hasPermission);
  // const user = useAuth((state) => state?.user);
  // const isSuperAdmin =

  const routes: MenuItem[] = [
    // Home
    {
      href: "/dashboard",
      label: t("navigation.home"),
      icon: Home,
    },
    {
      // id: "analytics",
      href: "/dashboard/analytics",
      label: t("navigation.analytics"),
      icon: Signal,
    },
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
    {
      label: t("navigation.users"),
      icon: Users,
      menuType: "users",
      children: [
        {
          id: "students",
          href: "/dashboard/users",
          label: t("navigation.students"),
          icon: User,
          searchParams: { role: "STUDENT", page: "1" },
        },
        {
          id: "instructors",
          href: "/dashboard/users",
          label: t("navigation.instructors"),
          icon: Store,
          searchParams: { is_instructor: "1", role: "STUDENT", page: "1" },
        },
        {
          id: "admins",
          href: "/dashboard/users",
          label: t("navigation.admins"),
          icon: Shield,
          searchParams: { role: "ADMIN", page: "1" },
        },
        // {
        //   id: "users-carts",
        //   href: "/dashboard/users-carts",
        //   label: t("navigation.usersCarts"),
        //   icon: ShoppingCart,
        //   searchParams: { page: "1" },
        // },
      ],
    },
    {
      href: "/dashboard/settings",
      label: t("navigation.settings"),
      icon: Settings,
    },

    // // Provinces
    // {
    //   id: "zones",
    //   href: "/dashboard/zones",
    //   label: t("navigation.zones"),
    //   icon: MapPin,
    // },

    // // Coupons
    // {
    //   id: "coupons",
    //   href: "/dashboard/coupons",
    //   label: t("navigation.coupons"),
    //   icon: Tag,
    // },

    // // Sections group
    // {
    //   label: t("navigation.sectionsGroup"),
    //   icon: Layers,
    //   menuType: "sections-group",
    //   children: [
    //     {
    //       id: "sections",
    //       href: "/dashboard/sections",
    //       label: t("navigation.sections"),
    //       icon: Folder,
    //     },
    //     {
    //       id: "merchant-categories",
    //       href: "/dashboard/merchants-categories",
    //       label: t("navigation.merchantCategories"),
    //       icon: Store,
    //     },
    //     {
    //       id: "sub-sections",
    //       href: "/dashboard/sub-section",
    //       label: t("navigation.subsection"),
    //       icon: FolderOpen,
    //     },
    //   ],
    // },

    // // Banners
    // {
    //   label: t("navigation.banners"),
    //   icon: Images,
    //   menuType: "banners-group",
    //   children: [
    //     {
    //       id: "main-banners",
    //       href: "/dashboard/banners",
    //       label: t("navigation.mainbanners"),
    //       icon: Images,
    //       searchParams: { type: "HOME_SLIDER" },
    //     },
    //     {
    //       id: "secondary-banners",
    //       href: "/dashboard/banners",
    //       label: t("navigation.secondaryBanners"),
    //       icon: Images,
    //       searchParams: { type: "HOME" },
    //     },
    //     {
    //       id: "favorite-banners",
    //       href: "/dashboard/banners",
    //       label: t("navigation.titleFavorite"),
    //       icon: Images,
    //       searchParams: { type: "FAVORITE" },
    //     },
    //     {
    //       id: "my-orders-banners",
    //       href: "/dashboard/banners",
    //       label: t("navigation.titleMyOrders"),
    //       icon: Images,
    //       searchParams: { type: "MY_ORDERS" },
    //     },
    //   ],
    // },

    // // Products
    // {
    //   id: "products",
    //   href: "/dashboard/products",
    //   label: t("navigation.products"),
    //   icon: Package,
    // },

    // // Finance
    // {
    //   label: t("navigation.fainance"),
    //   icon: Layers,
    //   menuType: "fainance-group",
    //   children: [
    //     {
    //       id: "finance",
    //       href: "/dashboard/finance",
    //       label: t("navigation.mainfainance"),
    //       icon: Folder,
    //     },
    //     {
    //       id: "sub-finance",
    //       href: "/dashboard/sub-finance",
    //       label: t("navigation.Subfainance"),
    //       icon: FolderOpen,
    //     },
    //     {
    //       id: "transactions",
    //       href: "/dashboard/transactions",
    //       label: t("navigation.transactions"),
    //       icon: FolderOpen,
    //     },
    //   ],
    // },

    // // Orders

    // {
    //   label: t("navigation.ordersSection"),
    //   icon: Layers,
    //   menuType: "orders-group",
    //   children: [
    //     {
    //       id: "orders-restaurant-market",
    //       href: "/dashboard/orders?types=RESTURANT,MARKET",
    //       label: t("navigation.restaurantMarketsOrders"),
    //       icon: ShoppingCart,
    //     },
    //     {
    //       id: "orders-custom",
    //       href: "/dashboard/orders?types=CUSTOM",
    //       label: t("navigation.customOrders"),
    //       icon: ShoppingCart,
    //     },
    //   ],
    // },

    // // Join Orders
    // {
    //   label: t("navigation.joinApplications"),
    //   icon: Paperclip,
    //   menuType: "join-applications-group",
    //   children: [
    //     {
    //       id: "join-applications-delivery",
    //       href: "/dashboard/join-applications?type=delivery",
    //       label: t("navigation.deliveryApplications"),
    //       icon: ShoppingCart,
    //     },
    //     {
    //       id: "join-applications-partner",
    //       href: "/dashboard/join-applications?type=partner",
    //       label: t("navigation.partnersApplications"),
    //       icon: ShoppingCart,
    //     },
    //   ],
    // },

    // {
    //   id: "settings",
    //   href: "/dashboard/info",
    //   label: t("navigation.info"),
    //   icon: InfoIcon,
    // },

    // // Support
    // {
    //   label: t("navigation.support"),
    //   icon: Headphones,
    //   menuType: "support-group",
    //   children: [
    //     {
    //       id: "chats",
    //       href: "/dashboard/chats",
    //       label: t("navigation.chats"),
    //       icon: MessageSquare,
    //     },
    //     {
    //       id: "chat-ratings",
    //       href: "/dashboard/chats/ratings",
    //       label: t("navigation.ratings"),
    //       icon: Star,
    //     },
    //   ],
    // },
  ];

  //  if (isSuperAdmin) {
  if (5 > 3) {
    return routes;
  }

  const filterRoutes = (items: MenuItem[]): MenuItem[] => {
    return items
      .map((item) => {
        const key = item.id || item.menuType || item.href?.split("?")[0] || "";
        const perms = ROUTE_PERMISSIONS_MAP[key] || [];

        if (item.children) {
          const filteredChildren = filterRoutes(item.children);
          if (filteredChildren.length === 0) {
            return null;
          }
          return { ...item, children: filteredChildren };
        }

        const hasAccess =
          perms.length === 0 || perms.some((perm) => hasPermission(perm));

        // console.log(
        //   `Item: ${item.label}, Key: ${key}, Perms: ${perms}, Has Access: ${hasAccess}`
        // );

        return hasAccess ? item : null;
      })
      .filter(Boolean) as MenuItem[];
  };

  return filterRoutes(routes);
}
