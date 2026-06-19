"use client"

import { Flame, TrendingUp, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { SectionHeading, StatCard } from "./shared"
import { useGetPeakHoursData } from "../hooks/usePeakHours"

export function PeakHoursAnalytics() {
  const t = useTranslations("Dashboard.analysis.peakHours")
  const { data, isPending } = useGetPeakHoursData()
  const peakHours = data?.data?.peak_hours ?? []
  const days = data?.data?.days

  const chartConfig = {
    avg_users: { label: t("avgUsersAtPeak"), color: "var(--chart-1)" },
  }

  const sorted = [...peakHours].sort((a, b) => a.hour_of_day - b.hour_of_day)
  const maxAvg = Math.max(...peakHours.map((h) => Number(h.avg_users)), 0)
  const top = peakHours[0]

  const chartData = sorted.map((h) => ({
    label: `${h.hour_of_day.toString().padStart(2, "0")}`,
    avg_users: Number(Number(h.avg_users).toFixed(1)),
  }))

  return (
    <section className="space-y-5">
      <SectionHeading
        id="peak"
        icon={Flame}
        title={t("title")}
        description={t("description")}
        action={days ? <Badge variant="outline">{t("lastDays", { days })}</Badge> : null}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Flame}
          label={t("topPeakHour")}
          value={top ? `${top.hour_of_day}:00` : "--"}
          accent
          isPending={isPending}
        />
        <StatCard
          icon={Users}
          label={t("avgUsersAtPeak")}
          value={top ? Number(top.avg_users).toFixed(1) : "--"}
          isPending={isPending}
        />
        <StatCard
          icon={TrendingUp}
          label={t("maxUsersAtPeak")}
          value={top?.max_users ?? "--"}
          isPending={isPending}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("distribution")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} margin={{ left: 4, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={1}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 11 }} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="avg_users" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell
                      key={i}
                      fill="var(--color-avg_users)"
                      fillOpacity={maxAvg ? 0.35 + (d.avg_users / maxAvg) * 0.65 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("rankedByAvg")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            peakHours.slice(0, 8).map((h, i) => {
              const pct = maxAvg ? (Number(h.avg_users) / maxAvg) * 100 : 0
              return (
                <div key={h.hour_of_day} className="flex items-center gap-3 py-1.5">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums",
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="w-14 shrink-0 text-sm font-medium tabular-nums">
                    {h.hour_of_day}:00
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {Number(h.avg_users).toFixed(1)}
                  </span>
                  <span className="hidden w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground sm:block">
                    {t("max")} {h.max_users}
                  </span>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </section>
  )
}
