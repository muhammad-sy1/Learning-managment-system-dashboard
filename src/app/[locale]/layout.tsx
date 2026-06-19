// app/[locale]/layout.tsx  (SERVER component)
import ClientShell from "@/components/ClientShell"; // client wrapper
import SwRegistrar from "@/components/SwRegistrar";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Tajawal } from "next/font/google";

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}
export const metadata = {
  title: "Lista Stores",
  description: "متجر الكتروني",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

const tajawal = Tajawal({
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-tajawal",
  preload: true,
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // <-- Promise here
}) {
  const { locale } = await params; // <-- await it
  const messages = await getMessages(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={tajawal.className}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
                <SwRegistrar />
          
          <ClientShell>{children}</ClientShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
