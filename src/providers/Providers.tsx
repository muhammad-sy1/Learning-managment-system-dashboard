"use client";
import { setNavigate } from "@/lib/router";
import ReactQueryProvider from "./ReactQueryProvider";
import ToasterProvider from "./ToasterProvider";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { ThemeProvider } from "./theme-provider";
import DirProvider from "./DirProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    setNavigate((url) => router.push(url));
  }, [router]);

  return (
    <DirProvider>
      <ThemeProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <ToasterProvider />
      </ThemeProvider>
    </DirProvider>
  );
}
