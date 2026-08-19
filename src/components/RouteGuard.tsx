"use client";

import Loading from "@/app/[locale]/dashboard/loading";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { useRouter } from "@/i18n/navigation";
import useAuth from "@/modules/auth/store/authStore";
import useGetProfile from "@/modules/profile/hooks/useGetProfile";
import { PermissionsUtil } from "@/utils/permissions";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useMemo } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/register", "/403", "/404"];

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("token");
  const { hasHydrated } = useAuth();
  const Islogin = useAuth((state) => state.isLoggedInRoute);

  const { data: profile, isPending, fetchStatus, isFetching } = useGetProfile();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const accessStatus = useMemo(() => {
    // if (!token && !isPublicRoute) {
    //   return { canAccess: false, shouldRedirect: "/login", isLoading: false };
    // }

    if (isPublicRoute) {
      return { canAccess: true, shouldRedirect: null, isLoading: false };
    }

    if (
      token &&
      (!profile || isPending || isFetching || fetchStatus === "fetching") &&
      Islogin === false
    ) {
      return { canAccess: false, shouldRedirect: null, isLoading: true };
    }

    if (profile) {
      const userPermissions = profile.user.permissions ?? [];

      const canAccess = PermissionsUtil.canAccessRoute(
        pathname,
        userPermissions,
      );
      if (!canAccess) {
        return {
          canAccess: false,
          shouldRedirect: "/dashboard/403",
          isLoading: false,
        };
      }

      return { canAccess: true, shouldRedirect: null, isLoading: false };
    }
    if (Islogin === true) {
      return { canAccess: false, shouldRedirect: null, isLoading: false };
    }
    return { canAccess: false, shouldRedirect: null, isLoading: false };
  }, [
    token,
    isPublicRoute,
    profile,
    isPending,
    isFetching,
    fetchStatus,
    Islogin,
    pathname,
  ]);

  useEffect(() => {
    if (profile) {
      const userPermissions = profile.user.permissions ?? [];
      usePermissionStore.getState().setPermissions(userPermissions);
      usePermissionStore.getState().setUser(profile.user);
    }
  }, [profile]);
  useEffect(() => {
    if (accessStatus.shouldRedirect) {
      router.replace(accessStatus.shouldRedirect);
    }
  }, [accessStatus.shouldRedirect, router]);

  // if (accessStatus.isLoading || !hasHydrated) {
  //   return <Loading />;
  // }

  // if (accessStatus.shouldRedirect && token) {
  //   return <Loading />;
  // }

  return <>{children}</>;
};
