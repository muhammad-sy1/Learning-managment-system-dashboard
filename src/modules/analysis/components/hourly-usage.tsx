"use client"

import { Activity, Clock, TrendingUp, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetHourlyUsageData } from "../hooks/useHourlyUsageAnalytics"
import { SectionHeading, StatCard } from "./shared"

export function HourlyUsageAnalytics() {
  const t = useTranslations("Dashboard.analysis.hourlyUsage")
  const { data, isPending } = useGetHourlyUsageData()
  const hours = data?.data?.hours ?? []

  const chartConfig = {
    total_requests: { label: t("requests"), color: "var(--chart-1)" },
    unique_users: { label: t("uniqueUsers"), color: "var(--chart-2)" },
  }

  const totalRequests = hours.reduce((a, b) => a + b.total_requests, 0)
  const peak = hours.reduce(
    (max, h) => (h.total_requests > max.total_requests ? h : max),
    hours[0] ?? { hour: "--", total_requests: 0 },
  )
  const activeHours = hours.filter((h) => h.total_requests > 0).length
  const peakUsers = Math.max(...hours.map((h) => h.unique_users), 0)

  return (
    <section className="space-y-5">
      <SectionHeading
        id="hourly"
        icon={Activity}
        title={t("title")}
        description={t("description")}
        action={data?.data?.date ? <Badge variant="outline">{data.data.date}</Badge> : null}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Activity}
          label={t("totalRequests")}
          value={totalRequests.toLocaleString()}
          accent
          isPending={isPending}
        />
        <StatCard icon={Zap} label={t("peakHour")} value={peak.hour} isPending={isPending} />
        <StatCard
          icon={TrendingUp}
          label={t("peakUsers")}
          value={peakUsers}
          hint={t("peakUsersHint")}
          isPending={isPending}
        />
        <StatCard icon={Clock} label={t("activeHours")} value={`${activeHours}/24`} isPending={isPending} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("activityOverTime")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={hours} margin={{ left: 4, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-total_requests)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--color-total_requests)" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-unique_users)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-unique_users)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={2}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tickLine={false} axisLine={false} width={32} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="total_requests"
                  type="monotone"
                  fill="url(#fillRequests)"
                  stroke="var(--color-total_requests)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="unique_users"
                  type="monotone"
                  fill="url(#fillUsers)"
                  stroke="var(--color-unique_users)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("hourlyBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <ScrollArea className="h-[260px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("hour")}</TableHead>
                    <TableHead className="text-right">{t("requests")}</TableHead>
                    <TableHead className="text-right">{t("uniqueUsers")}</TableHead>
                    <TableHead className="w-[120px]">{t("load")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hours.map((h) => {
                    const pct = peak.total_requests
                      ? Math.round((h.total_requests / peak.total_requests) * 100)
                      : 0
                    return (
                      <TableRow key={h.hour}>
                        <TableCell className="font-medium tabular-nums">{h.hour}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {h.total_requests.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{h.unique_users}</TableCell>
                        <TableCell>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
