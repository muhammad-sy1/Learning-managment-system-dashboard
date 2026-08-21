"use client";
import { Analysis } from "@/modules/analysis/components/analysis";
import { InstructorDashboard } from "@/modules/analysis/components/InstructorDashboard";
import useAuth from "@/modules/auth/store/authStore";

export default function HomePage() {
  const user = useAuth((state) => state?.user);

  return (
    <>
      {user?.is_instructor ? <InstructorDashboard /> : <Analysis />}
    </>
  );
}
