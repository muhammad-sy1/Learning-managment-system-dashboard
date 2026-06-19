"use client"

import { CurrentHourAnalysis, OnlineAnalysis } from "./live-sections"
import { HeatmapAnalytics } from "./heatmap-analytics"
import { HourlyUsageAnalytics } from "./hourly-usage"
import { PeakHoursAnalytics } from "./peak-hours"
import { RangeAnalysis } from "./range-analysis"

export function Analysis() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6 md:px-6 md:py-8">
      <OnlineAnalysis />
      <CurrentHourAnalysis />
      <RangeAnalysis />
      <HourlyUsageAnalytics />
      <HeatmapAnalytics />
      <PeakHoursAnalytics />
    </div>
  )
}
