import DashboardLayout from "@/layouts/dashboard-layout/DashboardLayout";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
