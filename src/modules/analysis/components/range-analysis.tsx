"use client"

import { Activity, CalendarRange, TrendingUp, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetRangeData } from "../hooks/useGetRangeData"
import { IRangeVisitor } from "../types/analysis"
import { InitialAvatar, SectionHeading, StatCard, timeOf } from "./shared"

const chartConfig = {
  request_count: { label: "Requests", color: "var(--chart-1)" },
}

function VisitorRow({ visitor, rank, max }: { visitor: IRangeVisitor; rank: number; max: number }) {
  const t = useTranslations("Dashboard.analysis.rangeAnalysis")
  const pct = max > 0 ? Math.round((visitor.request_count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="w-6 shrink-0 text-center text-xs font-bold text-muted-foreground tabular-nums">
        {rank}
      </span>
      <InitialAvatar id={visitor.id} name={visitor.first_name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">
            {visitor.first_name} {visitor.last_name}
          </p>
          <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
            {visitor.request_count.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{visitor.email ?? t("noEmail")}</span>
          <span className="shrink-0">{timeOf(visitor.last_seen)}</span>
        </div>
      </div>
    </div>
  )
}

export function RangeAnalysis() {
  const t = useTranslations("Dashboard.analysis.rangeAnalysis")
  const { data, isPending } = useGetRangeData()
  const visitors = data?.data?.visitors ?? []
  const from = data?.data?.from
  const to = data?.data?.to
  const maxRequests = Math.max(...visitors.map((v) => v.request_count), 0)
  const totalRequests = visitors.reduce((s, v) => s + v.request_count, 0)
  const avg = visitors.length ? Math.round(totalRequests / visitors.length) : 0

  const chartData = visitors.slice(0, 8).map((v) => ({
    name: v.first_name,
    request_count: v.request_count,
  }))

  return (
    <section className="space-y-5">
      <SectionHeading
        id="range"
        icon={CalendarRange}
        title={t("title")}
        description={
          from && to
            ? t("descriptionWithRange", { from: from.split(" ")[0], to: to.split(" ")[0] })
            : t("descriptionDefault")
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label={t("visitors")} value={visitors.length} accent isPending={isPending} />
        <StatCard
          icon={Activity}
          label={t("totalRequests")}
          value={totalRequests.toLocaleString()}
          isPending={isPending}
        />
        <StatCard
          icon={TrendingUp}
          label={t("avgPerVisitor")}
          value={avg.toLocaleString()}
          isPending={isPending}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">{t("topVisitors")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-[320px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={70}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="request_count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill="var(--color-request_count)"
                        fillOpacity={1 - i * 0.07}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t("leaderboard")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isPending ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-h-[320px] divide-y divide-border overflow-y-auto">
                {visitors.map((v, i) => (
                  <VisitorRow key={v.id} visitor={v} rank={i + 1} max={maxRequests} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
