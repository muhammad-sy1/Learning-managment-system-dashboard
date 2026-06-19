"use client";
import LoginFormSkeleton from "@/modules/auth/components/LoginFormSkeleton";
import VerifyCode from "@/modules/auth/components/Verify-code";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function Page() {
  const t = useTranslations("Auth.verifyCode");

  return (
    <div className="bg-background h-fit w-[clamp(300px,95vw,550px)] rounded-2xl p-6 font-medium border shadow-lg space-y-3">
      <h1 className="text-4xl ">
        <span className="text-[#D80C10]">{t("title")}</span>
      </h1>
      <span className="block text-lg">{t("description")}</span>
      <Suspense fallback={<LoginFormSkeleton />}>
        <VerifyCode />
      </Suspense>
    </div>
  );
}
