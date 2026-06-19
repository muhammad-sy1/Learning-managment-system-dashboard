"use client";
import { useLocale } from "next-intl";
import { Button } from "../../../components/ui/button";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/react-query/queryClient";
import { useSearchParams } from "next/navigation";

export default function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggle = () => {
    const nextLocale = currentLocale === "ar" ? "en" : "ar";
    // router.replace(pathname, { locale: nextLocale });
      router.replace(`${pathname}?${searchParams.toString()}`, {
        locale: nextLocale,
      });
    queryClient.invalidateQueries();
  };

  return (
    <Button
      variant="link"
      size="icon"
      aria-label="Toggle language"
      onClick={handleToggle}
    >
      <Languages className="!h-4 !w-4" />
    </Button>
  );
}
