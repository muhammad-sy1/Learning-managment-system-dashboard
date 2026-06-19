import { ReusableCard } from "@/components/ReusableCard";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IAppInfo } from "../../types/info";
import {
  Smartphone,
  Truck,
  Store,
  Clipboard,
  Key,
  Loader2,
  FileDown,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JSX, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { renderSafeHTML } from "@/utils/renderSafeHTML";
import { FaMobile } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { downloadAndroidApk } from "../../services/info";
import { toast } from "sonner";

const AppInfoCard = ({ data }: { data: IAppInfo }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = useTranslations("Dashboard.InfoPage");
  const [activeApp, setActiveApp] = useState<
    "client" | "delivery" | "merchant"
  >("client");

  type ActiveApp = "client" | "delivery" | "merchant";

  const apps: ActiveApp[] = ["client", "delivery", "merchant"];

  const appConfig: Record<ActiveApp, { titleKey: string; icon: JSX.Element }> =
    {
      client: {
        titleKey: "app.client",
        icon: <Smartphone className="h-5 w-5 text-blue-600" />,
      },
      delivery: {
        titleKey: "app.delivery",
        icon: <Truck className="h-5 w-5 text-green-600" />,
      },
      merchant: {
        titleKey: "app.merchant",
        icon: <Store className="h-5 w-5 text-purple-600" />,
      },
    };

  const modeLabels: Record<string, string> = {
    gp: t("app.googlePlay"),
    as: t("app.appStore"),
    prod: t("app.production"),
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-2 shadow-sm   mx-auto ">
        <Tabs
          value={activeApp}
          onValueChange={(v) => setActiveApp(v as ActiveApp)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full h-12">
            {apps.map((app) => (
              <TabsTrigger
                key={app}
                value={app}
                className="flex items-center gap-2"
              >
                {appConfig[app].icon}
                {t(appConfig[app].titleKey)}
              </TabsTrigger>
            ))}
          </TabsList>

          {apps.map((app) => {
            const appData = {
              as_version: data?.[`${app}_as_version`],
              gp_version: data?.[`${app}_gp_version`],
              force_update: data?.[`${app}_force_update`],
              app_store: data?.[`${app}_app_store`],
              google_play: data?.[`${app}_google_play`],
              mode: data?.[`${app}_mode`],
              change_logs_ar: data?.[`${app}_change_logs`]?.ar,
              change_logs_en: data?.[`${app}_change_logs`]?.en,
              android_apk: data?.[`${app}_android_apk`],
            };

            return (
              <TabsContent key={app} value={app} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <ReusableCard
                    title={`${t(appConfig[app].titleKey)} ${t("app.versionInfo")}`}
                    icon={appConfig[app].icon}
                  >
                    <div className="space-y-6">
                      {/* Versions */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border p-4">
                          <p className="text-xs text-muted-foreground">
                            {t("app.clientAsVersion")}
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {appData.as_version ?? "-"}
                          </p>
                        </div>

                        <div className="rounded-xl border p-4">
                          <p className="text-xs text-muted-foreground">
                            {t("app.clientGpVersion")}
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {appData.gp_version ?? "-"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Status */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between rounded-xl border p-4">
                          <span className="text-sm text-muted-foreground">
                            {t("app.updateStatus")}
                          </span>
                          <Badge
                            variant={
                              appData.force_update === "1"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {appData.force_update === "1"
                              ? t("app.forceUpdate")
                              : t("app.optionalUpdate")}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border p-4">
                          <span className="text-sm text-muted-foreground">
                            {t("app.currentMode")}
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {appData.mode?.split(",").map((mode) => (
                              <Badge key={mode} variant="outline">
                                {modeLabels[mode] ?? mode}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Links */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl border p-4">
                          <span className="text-sm text-muted-foreground">
                            {t("app.appStoreLink")}
                          </span>

                          {appData.app_store ? (
                            <Link
                              href={appData.app_store}
                              target="_blank"
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              {t("app.openLink")}
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {t("app.noLink")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between rounded-xl border p-4">
                          <span className="text-sm text-muted-foreground">
                            {t("app.googlePlayLink")}
                          </span>

                          {appData.google_play ? (
                            <Link
                              href={appData.google_play}
                              target="_blank"
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              {t("app.openLink")}
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {t("app.noLink")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </ReusableCard>
                  <ReusableCard
                    title={t("app.changelog")}
                    icon={<Clipboard className="h-5 w-5" />}
                  >
                    <div className="grid gap-8 md:grid-cols-2">
                      {/* Arabic */}
                      <div className="border p-4 rounded-2xl">
                        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                          العربية
                        </h4>
                        <div
                          className="prose prose-sm max-w-none text-right leading-relaxed"
                          dir="rtl"
                          dangerouslySetInnerHTML={renderSafeHTML(
                            data?.[`${app}_change_logs`]?.ar,
                          )}
                        />
                      </div>

                      {/* English */}
                      <div className="border p-4 rounded-2xl">
                        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                          English
                        </h4>
                        <div
                          className="prose prose-sm max-w-none text-left leading-relaxed"
                          dir="ltr"
                          dangerouslySetInnerHTML={renderSafeHTML(
                            data?.[`${app}_change_logs`]?.en,
                          )}
                        />
                      </div>
                    </div>
                  </ReusableCard>
                  <ReusableCard
                    title={t("app.androidAPK")}
                    icon={<FaMobile className="h-5 w-5" />}
                    className="md:col-span-2"
                  >
                    <div className="grid gap-8">
                      {/* <Button
                        variant="outline"
                        // disabled={!appData.android_apk}
                        className="max-w-md"
                        asChild
                      >
                        <a
                          href={appData.android_apk}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          {t("app.downloadAPK")}
                        </a>
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isDownloading}
                        onClick={async () => {
                          try {
                            setIsDownloading(true);

                            const blob = await downloadAndroidApk(
                              data.client_android_apk!,
                            );

                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");

                            a.href = url;
                            a.download = `${data.client_android_apk}.apk`;
                            a.click();

                            window.URL.revokeObjectURL(url);
                          } catch (e) {
                            toast.error("فشل تحميل الملف", {
                              description:
                                (e as string) || "حدث خطأ أثناء تحميل ملف APK.",
                            });
                            console.log("error message", e);
                          } finally {
                            setIsDownloading(false);
                          }
                        }}
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </ReusableCard>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <ReusableCard
        title={t("app.otpSettings")}
        icon={<Key className="h-5 w-5 text-indigo-700" />}
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="border p-4 rounded-2xl">
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
              العربية
            </h4>
            <div className="prose prose-sm max-w-none text-right leading-relaxed">
              {data?.otp_text?.ar}
            </div>
          </div>

          {/* English */}
          <div className="border p-4 rounded-2xl">
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
              English
            </h4>
            <div className="prose prose-sm max-w-none text-left leading-relaxed">
              {data?.otp_text?.en}
            </div>
          </div>
        </div>
      </ReusableCard>
    </div>
  );
};

export default AppInfoCard;
