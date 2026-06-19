"use client";

import AuthLayout from "@/modules/auth/layouts/auth-layout/AuthLayout";
import useAuth from "@/modules/auth/store/authStore";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (auth.hasHydrated) {
      if (auth.user) {
        router.push("/");
      }
    }
  }, [auth.hasHydrated, auth.user, router]);

  return <AuthLayout>{children}</AuthLayout>;
}
