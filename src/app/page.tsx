"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./[locale]/dashboard/loading";

export default function Page() {
  const router = useRouter();
  const token = Cookies.get("token");
  const locale = Cookies.get("locale") ?? "ar";
  useEffect(() => {
    if (token) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}/login`);
    }
  }, [locale, router, token]);

  return (
    <html>
      <body>
        <Loading />
      </body>
    </html>
  );
}
