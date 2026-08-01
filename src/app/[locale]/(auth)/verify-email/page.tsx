"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import useVerifyEmail from "@/modules/auth/hooks/useVerifyEmail";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const verifyMutation = useVerifyEmail();
  const t = useTranslations("Auth.verifyEmail");
  const [hasAttempted, setHasAttempted] = useState(false);

  const id = searchParams.get("id");
  const hash = searchParams.get("hash");

  useEffect(() => {
    if (id && hash && !hasAttempted) {
      setHasAttempted(true);
      verifyMutation.mutate(id, hash);
    }
  }, [id, hash, hasAttempted, verifyMutation]);

  return (
    <div className="bg-background relative h-fit w-[clamp(300px,95vw,550px)] rounded-2xl p-6 font-medium border shadow-lg space-y-3">
      <h1 className="text-4xl">
        <span className="text-blue-500">{t("title")}</span>
      </h1>

      <div className="flex flex-col items-center justify-center gap-6 py-8">
        {verifyMutation.isPending && (
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <p className="text-lg">{t("verifying")}</p>
          </div>
        )}

        {verifyMutation.isSuccess && (
          <div className="text-center space-y-4">
            <div className="text-6xl">✓</div>
            <p className="text-lg text-green-600">{t("success")}</p>
            <Link href="/login">
              <Button className="w-full text-background py-4 transition rounded-md bg-foreground">
                {t("backToLogin")}
              </Button>
            </Link>
          </div>
        )}

        {verifyMutation.isError && (
          <div className="text-center space-y-4">
            <div className="text-6xl">✗</div>
            <p className="text-lg text-red-600">{t("error")}</p>
            <div className="space-y-2">
              <Link href="/register">
                <Button className="w-full text-background py-4 transition rounded-md bg-foreground">
                  {t("backToRegister")}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full py-4 transition rounded-md"
                >
                  {t("backToLogin")}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!id || !hash ? (
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{t("invalidLink")}</p>
            <Link href="/login">
              <Button className="w-full text-background py-4 transition rounded-md bg-foreground">
                {t("backToLogin")}
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
