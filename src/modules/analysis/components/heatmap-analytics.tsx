"use client"

import { Grid3x3 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./shared"
import { useGetHeatmapData } from "../hooks/useHeatmap"

function cellClass(ratio: number) {
  if (ratio <= 0) return "bg-muted"
  if (ratio < 0.2) return "bg-primary/15"
  if (ratio < 0.4) return "bg-primary/35"
  if (ratio < 0.6) return "bg-primary/55"
  if (ratio < 0.8) return "bg-primary/75"
  return "bg-primary"
}

export function HeatmapAnalytics() {
  const t = useTranslations("Dashboard.analysis.heatmap")
  const { data, isPending } = useGetHeatmapData()
  const heatmap = data?.data?.heatmap ?? []

  const DAYS = [
    t("days.Mon"),
    t("days.Tue"),
    t("days.Wed"),
    t("days.Thu"),
    t("days.Fri"),
    t("days.Sat"),
    t("days.Sun"),
  ]

  const max = Math.max(...heatmap.map((h) => Number(h.avg_users)), 0)
  const getValue = (day: number, hour: number) => {
    const item = heatmap.find((h) => h.day_of_week === day && h.hour_of_day === hour)
    return item ? Number(item.avg_users) : 0
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        id="heatmap"
        icon={Grid3x3}
        title={t("title")}
        description={t("description")}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t("weeklyActivity")}</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("less")}</span>
            <div className="flex items-center gap-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((r) => (
                <span key={r} className={cn("size-3 rounded-[3px]", cellClass(r === 0 ? 0 : r))} />
              ))}
            </div>
            <span>{t("more")}</span>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-[280px] w-full" />
          ) : (
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[820px]">
                {/* hour header */}
                <div className="mb-1.5 grid grid-cols-[40px_repeat(24,1fr)] gap-1">
                  <div />
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div
                      key={h}
                      className="text-center text-[10px] text-muted-foreground tabular-nums"
                    >
                      {h % 2 === 0 ? h : ""}
                    </div>
                  ))}
                </div>

                {DAYS.map((day, dIdx) => (
                  <div
                    key={day}
                    className="mb-1 grid grid-cols-[40px_repeat(24,1fr)] items-center gap-1"
                  >
                    <div className="text-xs font-medium text-muted-foreground">{day}</div>
                    {Array.from({ length: 24 }).map((_, h) => {
                      const value = getValue(dIdx + 1, h)
                      const ratio = max > 0 ? value / max : 0
                      return (
                        <Tooltip key={h}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "aspect-square w-full rounded-[3px] ring-1 ring-inset ring-border/40 transition-transform hover:scale-110 hover:ring-primary cursor-default",
                                cellClass(ratio),
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <p className="font-medium">
                                {day} · {h.toString().padStart(2, "0")}:00
                              </p>
                              <p className="text-background/70">{value.toFixed(1)} {t("avgUsers")}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
