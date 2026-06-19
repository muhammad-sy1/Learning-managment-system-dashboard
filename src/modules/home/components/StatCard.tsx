"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  trend?: string;
  icon: LucideIcon;
  gradient: string;
  data: { value: number }[];
  prefix?: string;
}

export function StatCard({
  title,
  value,
  // trend,
  icon: Icon,
  gradient,
  // data,
  prefix = "",
}: StatCardProps) {
  // const isPositive = trend?.startsWith("+");

  return (
    <Card className="relative overflow-hidden p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg group">
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300",
          gradient,
        )}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={cn(
              "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
              gradient,
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-md text-muted-foreground mb-1">{title}</p>
          {/* <div
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {trend}
          </div> */}
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-balance">
            {prefix} {value}
          </p>
        </div>

        {/* Mini Chart */}
        {/* <div className="h-12 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id={`gradient-${title}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </Card>
  );
}
