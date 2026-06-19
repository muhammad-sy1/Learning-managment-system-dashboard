"use client";

import Loading from "@/app/[locale]/dashboard/loading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatPrice";
import {
  Activity,
  DollarSign,
  Package,
  ShoppingCart,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import StatisticsFilter from "../filters/StatisticsFilter";
import { useGetStatistics } from "../hooks/useGetStatistics";
import { StatCard } from "./StatCard";

const chartData = [
  { value: 20 },
  { value: 25 },
  { value: 22 },
  { value: 28 },
  { value: 26 },
  { value: 30 },
  { value: 26 },
];

// const statistics = {
//   users: { count: 26, trend: "+12%", color: "from-violet-500 to-purple-600" },
//   products: { count: 30, trend: "+8%", color: "from-blue-500 to-cyan-600" },
//   orders: { count: 3, trend: "+3%", color: "from-emerald-500 to-teal-600" },
//   commission: { total: 0, trend: "0%", color: "from-amber-500 to-orange-600" },
// };

export function StatsGrid() {
  const { data: statistics, isPending } = useGetStatistics();
  const t = useTranslations("Dashboard.statistics");
  const commission = statistics?.statistics.commission;

  const formatCommission = (value: number) => formatPrice(value, "SYP");

  const commissionSections = [
    {
      title: t("commission.merchant.title"),
      icon: Store,
      total: commission?.merchant.total ?? 0,
      accent:
        "from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-600",
      items: [
        {
          label: t("commission.merchant.normal_app_commission"),
          value: commission?.merchant.normal_app_commission ?? 0,
        },
        {
          label: t("commission.merchant.custom_app_commission"),
          value: commission?.merchant.custom_app_commission ?? 0,
        },
        {
          label: t("commission.merchant.tx_app_commission"),
          value: commission?.merchant.tx_app_commission ?? 0,
        },
      ],
    },
    {
      title: t("commission.delivery.title"),
      icon: Truck,
      total: commission?.delivery.total ?? 0,
      accent:
        "from-sky-500/15 via-sky-500/5 to-transparent border-sky-500/20 text-sky-600",
      items: [
        {
          label: t("commission.delivery.orders_app_commission"),
          value: commission?.delivery.orders_app_commission ?? 0,
        },
        {
          label: t("commission.delivery.tx_app_commission"),
          value: commission?.delivery.tx_app_commission ?? 0,
        },
      ],
    },
  ];

  if (isPending) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen ">
      <StatisticsFilter />
      <div className="container mx-auto px-1 py-4 md:py-4">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("statistics")}
            </h1>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          <StatCard
            title={t("totalUsers")}
            value={statistics?.statistics.users?.count ?? 0}
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
            data={chartData}
          />
          <StatCard
            title={t("products")}
            value={statistics?.statistics.products?.count ?? 0}
            icon={Package}
            gradient="from-purple-500 to-pink-500"
            data={chartData.map((d) => ({ value: d.value + 5 }))}
          />
          <StatCard
            title={t("orders")}
            value={statistics?.statistics.orders?.count ?? 0}
            icon={ShoppingCart}
            gradient="from-green-500 to-emerald-500"
            data={chartData.map((d) => ({ value: d.value - 10 }))}
          />
          <StatCard
            title={t("totalCommission")}
            value={statistics?.statistics.commission?.total ?? 0}
            icon={DollarSign}
            gradient="from-yellow-500 to-orange-500"
            data={chartData.map((d) => ({ value: d.value - 5 }))}
            prefix="SYP"
          />
        </div>

        <Card className="relative overflow-hidden border-border/50 bg-card/70 p-0 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.08),transparent_30%)]" />

          <div className="relative p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-orange-500/20">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {t("commissionBreakdown")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("commissionDescription")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
                <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("commission.gross_total")}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {formatCommission(commission?.gross_total ?? 0)}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("commission.total")}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-2xl font-bold",
                      (commission?.total ?? 0) < 0
                        ? "text-destructive"
                        : "text-emerald-600",
                    )}
                  >
                    {formatCommission(commission?.total ?? 0)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 lg:grid-cols-2">
              {commissionSections.map((section) => {
                const SectionIcon = section.icon;

                return (
                  <div
                    key={section.title}
                    className={cn(
                      "rounded-2xl border bg-gradient-to-br p-4",
                      section.accent,
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/80 shadow-sm">
                          <SectionIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {section.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("sectionTotal")}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border bg-background/80 px-3 py-1 text-sm font-semibold",
                          section.total < 0
                            ? "border-destructive/20 text-destructive"
                            : "border-emerald-500/20 text-emerald-600",
                        )}
                      >
                        {formatCommission(section.total)}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-3">
                      {section.items.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-xl border border-border/50 bg-background/70 px-4 py-3"
                        >
                          <p className="text-sm text-muted-foreground">
                            {item.label}
                          </p>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              item.value < 0
                                ? "text-destructive"
                                : "text-foreground",
                            )}
                          >
                            {formatCommission(item.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
