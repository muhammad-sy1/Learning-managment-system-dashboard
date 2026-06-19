"use client";

import LoginForm from "@/modules/auth/components/LoginForm";
import LoginFormSkeleton from "@/modules/auth/components/LoginFormSkeleton";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default  function Page() {

  const t =  useTranslations("Auth.login");

  return (
    <div className="bg-background relative h-fit w-[clamp(300px,95vw,550px)] rounded-2xl p-6 font-medium border shadow-lg space-y-3">
      <h1 className="text-4xl ">
        <span className="text-blue-500">{t("title")}</span> {t("companyName")}
      </h1>
      <span className="text-blue-400 block text-xl">{t("subtitle")}</span>
      
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}