"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import LandingPage from "./LandingPage";

export default function LocaleEntry() {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };

  useEffect(() => {
    const token = Cookies.get("token");
    router.replace(token ? `/${locale}/dashboard` : `/${locale}`);
  }, [router, locale]);

  return (
    <div>
      {/* <LandingPage /> */}
    </div>
  );
  // or your <Loading/>
}
