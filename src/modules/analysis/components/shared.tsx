import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function SectionHeading({
  id,
  icon: Icon,
  title,
  description,
  action,
}: {
  id?: string
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="flex scroll-mt-20 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-balance text-xl font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="text-pretty text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  isPending,
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  hint?: string
  accent?: boolean
  isPending?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-5",
        accent && "border-primary/30 bg-primary/5",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground",
            accent && "bg-primary/15 text-primary",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
        {isPending ? <span className="text-muted-foreground">—</span> : value}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

const AVATAR_COLORS = [
  "bg-[oklch(0.66_0.19_45)]",
  "bg-[oklch(0.6_0.13_200)]",
  "bg-[oklch(0.55_0.16_145)]",
  "bg-[oklch(0.58_0.18_15)]",
  "bg-[oklch(0.62_0.14_300)]",
]

export function InitialAvatar({
  name,
  id,
  size = "md",
}: {
  name: string
  id: number
  size?: "sm" | "md"
}) {
  const color = AVATAR_COLORS[id % AVATAR_COLORS.length]
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        color,
        size === "sm" ? "size-8 text-xs" : "size-9 text-sm",
      )}
    >
      {name ? name?.charAt(0).toUpperCase() : ""}
    </span>
  )
}

export function timeOf(lastSeen: string) {
  const parts = lastSeen.split(" ")
  return parts[1]?.slice(0, 5) ?? "--:--"
}
