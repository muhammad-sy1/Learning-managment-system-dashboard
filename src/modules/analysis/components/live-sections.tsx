"use client"

import { Clock, Radio, Users } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InitialAvatar, SectionHeading, timeOf } from "./shared"
import { useGetOnlineData } from "../hooks/useGetOnlineData"
import { useGetCurrentHourData } from "../hooks/useGetCurrentHourData"
import { IOnlineUser } from "../types/analysis"

function UserCard({ user }: { user: IOnlineUser }) {
  const t = useTranslations("Dashboard.analysis.onlineNow")
  return (
    <Card className="group transition-colors hover:border-primary/50">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="relative">
          <InitialAvatar id={user.id} name={user.first_name} />
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {user.first_name} {user.last_name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email ?? t("noEmail")}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {timeOf(user.last_seen)}
        </span>
      </CardContent>
    </Card>
  )
}

function UserGrid({
  users,
  isPending,
  emptyLabel,
}: {
  users: IOnlineUser[]
  isPending: boolean
  emptyLabel: string
}) {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-3 p-4">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Users className="size-10 opacity-30" />
          <p className="text-sm">{emptyLabel}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

function LivePill({ count, isPending }: { count: number; isPending: boolean }) {
  const t = useTranslations("Dashboard.analysis.onlineNow")
  return (
    <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
      <Radio className="size-3.5 animate-pulse" />
      {isPending ? "…" : count} {t("live")}
    </span>
  )
}

export function OnlineAnalysis() {
  const t = useTranslations("Dashboard.analysis.onlineNow")
  const { data, isPending } = useGetOnlineData()
  const users = data?.data?.users ?? []
  const windowMinutes = data?.data?.window_minutes

  return (
    <section className="space-y-5">
      <SectionHeading
        id="online"
        icon={Radio}
        title={t("title")}
        description={
          windowMinutes
            ? t("descriptionWithWindow", { minutes: windowMinutes })
            : t("descriptionDefault")
        }
        action={<LivePill count={users.length} isPending={isPending} />}
      />
      <UserGrid users={users} isPending={isPending} emptyLabel={t("empty")} />
    </section>
  )
}

export function CurrentHourAnalysis() {
  const t = useTranslations("Dashboard.analysis.currentHour")
  const tOnline = useTranslations("Dashboard.analysis.onlineNow")
  const { data, isPending } = useGetCurrentHourData()
  const visitors = data?.data?.visitors ?? []

  return (
    <section className="space-y-5">
      <SectionHeading
        id="current-hour"
        icon={Clock}
        title={t("title")}
        description={t("description")}
        action={
          <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            <Radio className="size-3.5 animate-pulse" />
            {isPending ? "…" : visitors.length} {tOnline("live")}
          </span>
        }
      />
      <UserGrid users={visitors} isPending={isPending} emptyLabel={t("empty")} />
    </section>
  )
}
