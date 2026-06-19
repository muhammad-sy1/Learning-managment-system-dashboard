import { ReusableCard } from "@/components/ReusableCard";
import { renderSafeHTML } from "@/utils/renderSafeHTML";
import {
  FileText,
  RefreshCcw,
  Shield,
  ToggleLeft,
  Truck,
  Video,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { IGeneralInfo } from "../../types/info";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GENERAL_TUTORIAL_VIDEOS } from "../../constants/tutorialVideos";

const buildMediaUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.replace(/^\/+/, "");
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "");

  return baseUrl
    ? `${baseUrl}/${normalizedPath}`
    : `/storage/${normalizedPath}`;
};

const GeneralInfoCard = ({ data }: { data: IGeneralInfo }) => {
  const t = useTranslations("Dashboard.InfoPage");

  const policies = [
    {
      key: "privacy_policy",
      title: t("general.privacyPolicy"),
      icon: <Shield className="h-5 w-5 text-green-700" />,
    },
    {
      key: "refund_policy",
      title: t("general.refundPolicy"),
      icon: <RefreshCcw className="h-5 w-5 text-blue-700" />,
    },
    {
      key: "terms_of_use",
      title: t("general.termsOfUse"),
      icon: <FileText className="h-5 w-5 text-purple-700" />,
    },
    {
      key: "delivery_note",
      title: t("general.deliveryNotes"),
      icon: <Truck className="h-5 w-5 text-orange-700" />,
    },
    {
      key: "delivery_capacity_policy",
      title: t("general.deliveryCapacityPolicy"),
      icon: <Truck className="h-5 w-5 text-orange-700" />,
    },
  ] as const;

  const orderToggles = [
    {
      key: "market_orders_enabled",
      name: "general-market_orders_enabled",
      title: t("general.marketOrdersEnabled"),
    },
    {
      key: "resturant_orders_enabled",
      name: "general-resturant_orders_enabled",
      title: t("general.restaurantOrdersEnabled"),
    },
    {
      key: "custom_orders_enabled",
      name: "general-custom_orders_enabled",
      title: t("general.customOrdersEnabled"),
    },
    {
      key: "google_map_enabled",
      name: "general-google_map_enabled",
      title: t("general.googleMapEnabled"),
    },
  ] as const;

  const orderLimits = [
    {
      key: "resturant_order_max_total",
      label: t("general.restaurantOrderMaxTotal"),
    },
    {
      key: "market_order_max_total",
      label: t("general.marketOrderMaxTotal"),
    },
  ] as const;

  const applicationsLinks = [
    {
      key: "join_as_delivery_url",
      label: t("general.joinAsDeliveryUrl"),
    },
    {
      key: "join_as_partner_url",
      label: t("general.joinAsPartnerUrl"),
    },
  ] as const;

  return (
    <>
      {policies.map((policy) => {
        const ar = data?.[policy.key]?.ar;
        const en = data?.[policy.key]?.en;

        if (!ar && !en) return null;

        return (
          <ReusableCard
            key={policy.key}
            title={policy.title}
            icon={policy.icon}
          >
            <div className="grid gap-8 md:grid-cols-2">
              {/* Arabic */}
              {ar && (
                <div className="border p-4 rounded-2xl">
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                    {t("general.arabic")}
                  </h4>
                  <div
                    className="prose prose-sm max-w-none text-right leading-relaxed"
                    dir="rtl"
                    dangerouslySetInnerHTML={renderSafeHTML(ar)}
                  />
                </div>
              )}

              {/* English */}
              {en && (
                <div className="border p-4 rounded-2xl">
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                    {t("general.english")}
                  </h4>
                  <div
                    className="prose prose-sm max-w-none text-left leading-relaxed"
                    dir="ltr"
                    dangerouslySetInnerHTML={renderSafeHTML(en)}
                  />
                </div>
              )}
            </div>
          </ReusableCard>
        );
      })}

      <ReusableCard
        title={t("general.orderLimits")}
        icon={<Wallet className="h-5 w-5 text-indigo-700" />}
      >
        <div className="space-y-6">
          {orderLimits.map((item) => (
            <Field key={item.key}>
              <FieldLabel htmlFor={item.key}>{item.label}</FieldLabel>

              <Input
                id={item.key}
                disabled
                type="text"
                value={data?.[item.key] ?? ""}
                placeholder="-"
              />
            </Field>
          ))}
        </div>
      </ReusableCard>

      <ReusableCard title={t("general.orderToggles")} icon={<ToggleLeft />}>
        <div className="flex flex-col gap-4">
          {orderToggles.map((toggle) => (
            <FieldLabel htmlFor={toggle.name} key={toggle.key}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{toggle.title}</FieldTitle>
                </FieldContent>
                <Switch
                  id={toggle.name}
                  dir="ltr"
                  disabled
                  checked={data?.[toggle.key] === "1"}
                />
              </Field>
            </FieldLabel>
          ))}
        </div>
      </ReusableCard>

      <ReusableCard
        title={t("general.floatingNote")}
        icon={<Truck className="h-5 w-5 text-indigo-700" />}
      >
        <div className="grid gap-8 md:grid-cols-2">
          {/* Arabic */}
          <div className="border p-4 rounded-2xl">
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
              {t("general.arabic")}
            </h4>
            <div
              className="prose prose-sm max-w-none text-right leading-relaxed"
              dir="rtl"
              dangerouslySetInnerHTML={renderSafeHTML(
                data.home_entry_floating_note?.ar,
              )}
            />
          </div>

          {/* English */}
          <div className="border p-4 rounded-2xl">
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
              {t("general.english")}
            </h4>
            <div
              className="prose prose-sm max-w-none text-left leading-relaxed"
              dir="ltr"
              dangerouslySetInnerHTML={renderSafeHTML(
                data.home_entry_floating_note?.en,
              )}
            />
          </div>

          <div className="rounded-2xl border p-4 space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {t("general.floatingBanner")}
            </h4>

            <div className="relative w-full overflow-hidden rounded-xl border bg-muted aspect-[16/9]">
              {data?.home_entry_floating_banner ? (
                <Image
                  src={buildMediaUrl(data.home_entry_floating_banner)!}
                  alt={t("general.floatingBanner")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  {t("general.noBanner")}
                </div>
              )}
            </div>
          </div>
        </div>
      </ReusableCard>

      <ReusableCard
        title={t("general.customDeliveryNote")}
        icon={<Truck className="h-5 w-5 text-indigo-700" />}
      >
        <div className="grid gap-8 md:grid-cols-2">
          {/* Arabic */}
          <div className="border p-4 rounded-2xl">
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
              {t("general.arabic")}
            </h4>
            <div
              className="prose prose-sm max-w-none text-right leading-relaxed"
              dir="rtl"
              dangerouslySetInnerHTML={renderSafeHTML(
                data.custom_delivery_note?.ar,
              )}
            />
          </div>

          {/* English */}
          <div className="border p-4 rounded-2xl">
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
              {t("general.english")}
            </h4>
            <div
              className="prose prose-sm max-w-none text-left leading-relaxed"
              dir="ltr"
              dangerouslySetInnerHTML={renderSafeHTML(
                data.custom_delivery_note?.en,
              )}
            />
          </div>
        </div>
      </ReusableCard>

      <ReusableCard
        title={t("general.applicationsLinks")}
        icon={<Truck className="h-5 w-5 text-indigo-700" />}
      >
        <div className="grid gap-8 md:grid-cols-2">
          {applicationsLinks.map((item) => (
            <FieldLabel htmlFor={item.key} key={item.key}>
              <Field orientation="vertical">
                <FieldContent>
                  <FieldTitle>{item.label}</FieldTitle>
                </FieldContent>
                <Input
                  id={item.key}
                  disabled
                  type="text"
                  value={data?.[item.key] ?? ""}
                  placeholder="-"
                />
              </Field>
            </FieldLabel>
          ))}
        </div>
      </ReusableCard>

      <ReusableCard
        title={t("general.tutorialVideos")}
        icon={<Video className="h-5 w-5 text-indigo-700" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {GENERAL_TUTORIAL_VIDEOS.map((video) => {
            const videoUrl = buildMediaUrl(data?.[video.key]);

            return (
              <div
                key={video.key}
                className={cn(
                  "overflow-hidden rounded-xl border bg-card",
                  "shadow-sm transition-shadow hover:shadow-md",
                )}
              >
                <div className="border-b px-4 py-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    {t(video.labelKey)}
                  </h4>
                </div>

                <div className="aspect-video bg-muted">
                  {videoUrl ? (
                    <video
                      className="h-full w-full object-cover"
                      controls
                      preload="metadata"
                      src={videoUrl}
                    >
                      {t("general.videoNotSupported")}
                    </video>
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                      {t("general.noTutorialVideo")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ReusableCard>
    </>
  );
};

export default GeneralInfoCard;
