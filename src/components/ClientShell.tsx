"use client";

import { RouteGuard } from "@/components/RouteGuard";
// import SwRegistrar from "@/components/SwRegistrar";
// import { useRouter } from "@/i18n/navigation";
import NotificationsProvider from "@/providers/NotificationsProvider";
import Providers from "@/providers/Providers";
// import x` from "js-cookie";
// import { useEffect } from "react";
export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  // const token = Cookies.get("token");
  // const router = useRouter();
  // useEffect(() => {
  //   if (!token) {
  //     // router.push(`/login`);
  //   }
  // }, []);

  return (
    <>
      <NotificationsProvider>
        <Providers>
          <RouteGuard>
            {children}

          </RouteGuard>
        </Providers>
      </NotificationsProvider>
    </>
  );
}
