"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Home, Search, Zap } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";

const messages = {
  en: enMessages,
  ar: arMessages,
};

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<"en" | "ar">("ar");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const pathLocale = pathname?.split("/")[1] as "en" | "ar";
    if (pathLocale && (pathLocale === "en" || pathLocale === "ar")) {
      setLocale(pathLocale);
      setIsRTL(pathLocale === "ar");
    } else {
      setLocale("ar");
      setIsRTL(true);
    }
  }, [pathname]);

  const t = messages[locale];

  const handleGoBack = () => {
    router.back();
  };

  const getHomeUrl = () => {
    return `/${locale}`;
  };

  return (
    <html>
      <body>
        <div
          className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 ${
            isRTL ? "rtl" : "ltr"
          }`}
        >
          <div className="max-w-2xl mx-auto text-center">
            {/* Animated 404 Icon */}
            <div className="relative mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="text-8xl font-bold text-gray-200 dark:text-gray-700 select-none">
                    4
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="mx-4 relative">
                  <div className="w-20 h-20 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
                    <Search className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-bounce" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
                  </div>
                </div>

                <div className="relative">
                  <div className="text-8xl font-bold text-gray-200 dark:text-gray-700 select-none">
                    4
                  </div>
                  <div className="absolute -top-2 -left-2">
                    <div className="w-4 h-4 bg-destructive rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 404 Text */}
            <div className="mb-8">
              <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 mb-4">
                {t.notFound.code}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {t.notFound.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto leading-relaxed">
                {t.notFound.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="lg"
                className="group transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <ArrowLeft
                  className={`w-4 h-4 transition-transform group-hover:${
                    isRTL ? "translate-x-1" : "-translate-x-1"
                  }`}
                />
                {t.notFound.goBack}
              </Button>

              <Button
                asChild
                size="lg"
                className="group transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Link href={getHomeUrl()}>
                  <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
                  {t.notFound.goHome}
                </Link>
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
                <div className="text-[200px] font-bold text-gray-400 select-none pointer-events-none">
                  {t.notFound.code}
                </div>
              </div>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </body>
    </html>
  );
}
