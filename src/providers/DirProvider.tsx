"use client";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useLocale } from "next-intl";

export default function DirProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();

  const dir = locale === "ar" ? "rtl" : "ltr";

  return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}
