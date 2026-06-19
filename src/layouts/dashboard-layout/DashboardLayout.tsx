"use client";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardHeader from "./dashboard-header/DashboardHeader";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace(`/${locale}/login`);
    }
    // router.replace(token ? `` : `/${locale}/login`);
  }, [router, locale]);
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <SidebarInset>
        <div className="flex flex-col min-h-screen ">
          {/* Header */}
          <DashboardHeader />

          {/* Content */}
          <main className="flex-1 p-6 ">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
